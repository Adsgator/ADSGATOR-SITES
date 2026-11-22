import type { Metadata } from "next";
import { cache } from "react";

import { ConteudoDaFaixa, Faixa } from "@/components/checkout/faixa";
import { FormularioDoCheckout } from "@/components/checkout/formulario";
import { FormularioDaMensalidade } from "@/components/checkout/mensalidade";
import { TelaDoResultado } from "@/components/checkout/resultado";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { mensagemDoCheckout } from "@/config/checkout";
import { linkWhatsApp } from "@/config/site";
import { catalogo, servicoPorSlug, servicosDoLink } from "@/lib/checkout/catalogo";
import { respostaDaCobranca } from "@/lib/checkout/contratacao";
import { datasDaMensalidade, situacaoDoLink } from "@/lib/checkout/mensalidade";
import { linkDoPainel, type LinkDoPainel } from "@/lib/checkout/painel";

// O link que o Lucas gera na ficha do cliente, no painel
// (checkout.adsgator.com.br/K7Q2PX; decisão 1 A, 2026-11-21): a contratação
// com os serviços combinados ou a mensalidade (Google Ads depois da aprovação
// da página, manutenção perto dos 30 dias da entrega). O que o link traz vem
// sempre do painel, conferido no servidor.

/** O link do painel, uma vez por requisição (a página e a prévia usam). */
const lerLink = cache(async (codigo: string): Promise<LinkDoPainel | null | "erro"> =>
  linkDoPainel(codigo).catch((e) => {
    console.error("checkout: o painel não respondeu ao ler o link", String(e));
    return "erro" as const;
  }),
);

const nomes = (servicos: string[]) =>
  catalogo.filter((s) => servicos.includes(s.slug)).map((s) => (s.slug === "google-ads" ? "Google Ads" : s.nome));

// A prévia ao colar o link no WhatsApp (decisão 2 A): título e texto conforme o link.
export async function generateMetadata({ params }: PageProps<"/checkout/[codigo]">): Promise<Metadata> {
  const link = await lerLink((await params).codigo);
  if (!link || link === "erro") return { title: "Contratação" };
  const titulo =
    link.tipo === "mensalidade"
      ? `Mensalidade de ${nomes(link.servicos)[0] ?? "serviço"}`
      : `Contratação: ${nomes(link.servicos).join(" + ")}`;
  const descricao =
    link.tipo === "mensalidade"
      ? "Confira a mensalidade e a data da renovação e pague no Pix ou no cartão."
      : "Confira o que foi combinado e contrate com Pix ou cartão, em ambiente seguro.";
  return { title: titulo, description: descricao, openGraph: { title: `${titulo} · Adsgator`, description: descricao } };
}

const cabecalhosDaMensalidade: Record<string, { titulo: React.ReactNode; texto: string }> = {
  "google-ads": {
    titulo: (
      <>
        Agora é a vez do <span className="highlight">Google Ads</span>
      </>
    ),
    texto: "Sua página está aprovada. Confira a mensalidade do Google Ads e escolha como pagar.",
  },
  manutencao: {
    titulo: (
      <>
        Sua página segue <span className="highlight">cuidada</span>
      </>
    ),
    texto: "Os 30 dias de suporte da entrega estão terminando. Confira a mensalidade da manutenção e escolha como pagar.",
  },
};

const avisos: Record<string, { titulo: string; texto: string }> = {
  invalido: { titulo: "Este link não é válido", texto: "Fale com a gente no WhatsApp para receber o link certo." },
  vencido: { titulo: "Este link venceu", texto: "Os links valem 15 dias. Fale com a gente no WhatsApp para receber um novo." },
  contratado: {
    titulo: "Esta contratação já foi feita",
    texto: "Não precisa fazer mais nada. Se quiser mudar algo, fale com a gente no WhatsApp.",
  },
  ativado: {
    titulo: "Esta mensalidade já está ativa",
    texto: "Não precisa fazer mais nada. Se quiser mudar algo, fale com a gente no WhatsApp.",
  },
  erro: { titulo: "Não foi possível abrir agora", texto: "Tente de novo em instantes ou fale com a gente no WhatsApp." },
};

function Aviso({ tipo, mensalidade }: { tipo: string; mensalidade?: boolean }) {
  const a = avisos[tipo] ?? avisos.erro;
  return (
    <>
      <Faixa
        rotulo={mensalidade ? "Mensalidade" : "Contratação"}
        titulo={
          mensalidade ? (
            "Sua mensalidade"
          ) : (
            <>
              Falta pouco para <span className="highlight">começar</span>
            </>
          )
        }
      />
      <ConteudoDaFaixa>
        <div className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm" data-aviso-link={tipo}>
          <h2 className="text-lg font-semibold">{a.titulo}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{a.texto}</p>
          <a
            href={linkWhatsApp(mensagemDoCheckout)}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
          >
            <IconeWhatsApp className="size-4" />
            Falar no WhatsApp
          </a>
        </div>
      </ConteudoDaFaixa>
    </>
  );
}

export default async function PaginaDoLink({ params }: PageProps<"/checkout/[codigo]">) {
  const codigo = (await params).codigo.toUpperCase();
  const link = await lerLink(codigo);
  if (link === "erro") return <Aviso tipo="erro" />;
  if (!link) return <Aviso tipo="invalido" />;

  if (link.tipo === "contratacao") {
    if (link.pago) return <Aviso tipo="contratado" />;
    if (!link.valido) return <Aviso tipo="vencido" />;
    const escolhidos = servicosDoLink(link.servicos.join(","));
    if (escolhidos.length === 0) return <Aviso tipo="invalido" />;
    return <FormularioDoCheckout codigo={codigo} escolhidos={escolhidos} />;
  }

  // Mensalidade: confere também no Asaas se já foi ativada.
  const situacao = await situacaoDoLink(codigo, link).catch(() => ({ tipo: "erro" as const }));
  if (situacao.tipo === "ativado" && situacao.pixPendente) {
    // Voltou ao link com o Pix da 1ª ainda por pagar: o mesmo Pix.
    const c = situacao.pixPendente;
    const datas = datasDaMensalidade(situacao.link);
    const { corpo } = await respostaDaCobranca(c, "pix", Math.round(c.value * 100), 1, c.dueDate, datas.proximo);
    const nome = servicoPorSlug(situacao.link.servico)?.nome ?? "Mensalidade";
    if (corpo.ok)
      return <TelaDoResultado resposta={corpo} contexto={{ tipo: "mensalidade", servico: nome, dia: datas.diaDaRenovacao }} />;
  }
  if (situacao.tipo !== "pronto") return <Aviso tipo={situacao.tipo} mensalidade />;

  const servico = servicoPorSlug(situacao.link.servico);
  const cabecalho = servico && cabecalhosDaMensalidade[servico.slug];
  if (!servico || !cabecalho) return <Aviso tipo="invalido" mensalidade />;
  return (
    <FormularioDaMensalidade
      codigo={codigo}
      cabecalho={cabecalho}
      cliente={situacao.cliente.name}
      servico={{ slug: servico.slug, nome: servico.nome, valor: servico.preco.cartao }}
      datas={datasDaMensalidade(situacao.link)}
    />
  );
}

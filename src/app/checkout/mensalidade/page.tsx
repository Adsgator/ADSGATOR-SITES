import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { ConteudoDaFaixa, Faixa } from "@/components/checkout/faixa";
import { FormularioDaMensalidade } from "@/components/checkout/mensalidade";
import { TelaDoResultado } from "@/components/checkout/resultado";
import { mensagemDoCheckout } from "@/config/checkout";
import { linkWhatsApp } from "@/config/site";
import { servicoPorSlug } from "@/lib/checkout/catalogo";
import { respostaDaCobranca } from "@/lib/checkout/contratacao";
import { datasDaMensalidade, situacaoDoLink, type SituacaoDoLink } from "@/lib/checkout/mensalidade";

// O link da mensalidade (?l=...), que o Lucas manda no WhatsApp: no combo,
// quando o cliente aprova a página; na manutenção, 30 dias depois da entrega
// (decisões do Lucas, 2026-11-21). Sempre conferido de novo no servidor.

const titulos: Record<string, { titulo: React.ReactNode; texto: string }> = {
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
  vencido: { titulo: "Este link venceu", texto: "Os links da mensalidade valem 15 dias. Fale com a gente para receber um novo." },
  ativado: {
    titulo: "Esta mensalidade já está ativa",
    texto: "Não precisa fazer mais nada. Se quiser mudar algo, fale com a gente no WhatsApp.",
  },
  erro: { titulo: "Não foi possível abrir agora", texto: "Tente de novo em instantes ou fale com a gente no WhatsApp." },
};

function Aviso({ tipo }: { tipo: string }) {
  const a = avisos[tipo] ?? avisos.erro;
  return (
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
  );
}

export default async function PaginaDaMensalidade({ searchParams }: PageProps<"/checkout/mensalidade">) {
  const { l } = await searchParams;
  const situacao: SituacaoDoLink | { tipo: "erro" } =
    typeof l === "string" ? await situacaoDoLink(l).catch(() => ({ tipo: "erro" as const })) : { tipo: "invalido" };

  const pronto = situacao.tipo === "pronto" ? situacao : null;
  const servico = pronto ? servicoPorSlug(pronto.link.servico) : undefined;
  const cabecalho = servico ? titulos[servico.slug] : undefined;

  // Voltou ao link com o Pix da 1ª ainda por pagar: o mesmo Pix.
  if (situacao.tipo === "ativado" && situacao.pixPendente) {
    const c = situacao.pixPendente;
    const datas = datasDaMensalidade(situacao.link);
    const { corpo } = await respostaDaCobranca(c, "pix", Math.round(c.value * 100), 1, c.dueDate, datas.proximo);
    const nome = servicoPorSlug(situacao.link.servico)?.nome ?? "Mensalidade";
    if (corpo.ok)
      return <TelaDoResultado resposta={corpo} contexto={{ tipo: "mensalidade", servico: nome, dia: datas.diaDaRenovacao }} />;
  }

  if (pronto && servico && cabecalho)
    return (
      <FormularioDaMensalidade
        token={l as string}
        cabecalho={cabecalho}
        cliente={pronto.cliente.name}
        servico={{ slug: servico.slug, nome: servico.nome, valor: servico.preco.cartao }}
        datas={datasDaMensalidade(pronto.link)}
      />
    );

  return (
    <>
      <Faixa rotulo="Mensalidade" titulo="Sua mensalidade" />
      <ConteudoDaFaixa>
        <Aviso tipo={situacao.tipo} />
      </ConteudoDaFaixa>
    </>
  );
}

import { Eyebrow } from "@/components/eyebrow";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { DepoisDaMensalidade, FormularioDaMensalidade } from "@/components/checkout/mensalidade";
import { ResultadoDaContratacao } from "@/components/checkout/resultado";
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
  const pixPendente =
    situacao.tipo === "ativado" && situacao.pixPendente
      ? (
          await respostaDaCobranca(
            situacao.pixPendente,
            "pix",
            Math.round(situacao.pixPendente.value * 100),
            1,
            situacao.pixPendente.dueDate,
          )
        ).corpo
      : null;

  return (
    <>
      <div className="dark section-ink bg-pattern-dark bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:pt-14 sm:pb-28">
          <Eyebrow>Mensalidade</Eyebrow>
          <h1 className="mt-4 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
            {cabecalho?.titulo ?? "Sua mensalidade"}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            {cabecalho?.texto ?? "Confira a mensalidade e escolha como pagar."}
          </p>
        </div>
      </div>

      {/* relative: por cima da faixa, que tem posição própria (o padrão da marca). */}
      <div className="relative mx-auto -mt-14 max-w-6xl px-4 pb-14 sm:-mt-16">
        {pronto && servico ? (
          <FormularioDaMensalidade
            token={l as string}
            cliente={pronto.cliente.name}
            servico={{ slug: servico.slug, nome: servico.nome, valor: servico.preco.cartao }}
            datas={datasDaMensalidade(pronto.link)}
          />
        ) : pixPendente?.ok ? (
          <ResultadoDaContratacao
            resposta={pixPendente}
            email=""
            depois={
              situacao.tipo === "ativado" && (
                <DepoisDaMensalidade forma="pix" dia={datasDaMensalidade(situacao.link).diaDaRenovacao} />
              )
            }
          />
        ) : (
          <Aviso tipo={situacao.tipo} />
        )}
      </div>
    </>
  );
}

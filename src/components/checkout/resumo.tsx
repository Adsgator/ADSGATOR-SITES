import { CheckIcon } from "lucide-react";

import { IconePix } from "@/components/icone-pix";
import {
  dataCurta,
  reais,
  valorDaParcela,
  type Forma,
  type LinhaDeHoje,
  type Mensalidade,
  type Pedido,
} from "@/lib/checkout/pedido";

/** Quando cada mensalidade começa, dito para o cliente. */
export function inicioDaMensalidade(m: Mensalidade, pedido: Pedido) {
  switch (m.inicio) {
    case "aprovacao":
      return "Começa quando você aprovar a sua página. Você recebe o link para pagar, com vencimento em 3 dias.";
    case "entrega":
      return "Começa 30 dias depois da entrega da página: os primeiros 30 dias de suporte já vêm com ela. Você recebe o link para pagar.";
    case "incluida":
      return "Incluída no Google Ads para a página feita pela Adsgator.";
    case "hoje":
      return `1ª mensalidade: vence em ${dataCurta(pedido.vencimento)}, e as próximas todo dia ${pedido.diaDaRenovacao}.`;
  }
}

/** Como fica o pagamento de hoje: "no Pix" ou "em 12x de R$ 104,17". */
export function comoPaga(pedido: Pedido, forma: Forma, parcelas: number) {
  if (forma === "pix") return "no Pix";
  if (parcelas > 1) return `no cartão, em ${parcelas}x de ${reais(valorDaParcela(pedido.totalHoje, parcelas))} sem juros`;
  return "no cartão, à vista";
}

/** Uma linha do resumo, sem ícones, para ficar limpo (Lucas, 2026-11-21): o
 * nome com a nota curta embaixo (o prazo) e o preço ao lado; o detalhe longo
 * (quando a mensalidade começa) ocupa a largura toda. */
function LinhaDoResumo({
  slug,
  nome,
  nota,
  detalhe,
  preco,
}: {
  slug: string;
  nome: string;
  nota?: string;
  detalhe?: string;
  preco: React.ReactNode;
}) {
  return (
    <li data-servico={slug}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium">{nome}</p>
          {nota && <p className="mt-0.5 text-sm text-muted-foreground">{nota}</p>}
        </div>
        <div className="shrink-0 text-right">{preco}</div>
      </div>
      {detalhe && <p className="mt-1 text-sm leading-5 text-muted-foreground">{detalhe}</p>}
    </li>
  );
}

/** O preço da criação: no cartão parcelado, a parcela em destaque e o valor no
 * cartão de referência (Lucas, 2026-11-21); no Pix ou à vista, o valor. */
function PrecoDaCriacao({ linha, forma, parcelas }: { linha: LinhaDeHoje; forma: Forma; parcelas: number }) {
  // O preço cheio (sem o combo) em cima do preço de hoje (Lucas, 2026-11-21).
  const cheio = linha.valorCheio && (
    <span className="block text-xs text-muted-foreground line-through">{reais(linha.valorCheio)}</span>
  );
  if (forma === "cartao" && parcelas > 1)
    return (
      <>
        <span className="block">
          <span className="text-sm text-muted-foreground">{parcelas}x de </span>
          <span className="text-lg font-semibold tracking-tight">{reais(valorDaParcela(linha.valor, parcelas))}</span>
        </span>
        {cheio}
        <span className="block text-xs text-muted-foreground">{reais(linha.valor)} no cartão</span>
      </>
    );
  return (
    <>
      {cheio}
      <span className="block font-semibold">{reais(linha.valor)}</span>
      <span className="block text-xs text-muted-foreground">{forma === "pix" ? "no Pix" : "no cartão, à vista"}</span>
    </>
  );
}

export function ResumoDoPedido({
  pedido,
  forma,
  parcelas,
  economiaNoPix,
  aoEscolherPix,
}: {
  pedido: Pedido;
  forma: Forma;
  parcelas: number;
  /** Quanto o Pix sai mais barato que o cartão, hoje. */
  economiaNoPix: number;
  aoEscolherPix: () => void;
}) {
  const depois = pedido.mensalidades.filter((m) => m.inicio !== "hoje");
  const nota = (slug: string) => pedido.servicos.find((s) => s.slug === slug)?.nota;
  const temMensal = pedido.mensalidades.length > 0;
  const mensalDeHoje = pedido.mensalidades.find((m) => m.inicio === "hoje");

  return (
    <div className="rounded-2xl border bg-card p-5 text-[0.9375rem] shadow-sm sm:p-6" data-resumo>
      <h2 className="text-lg font-semibold">Resumo</h2>

      <ul className="mt-5 space-y-4" data-servicos>
        {pedido.hoje.map((l) => (
          <LinhaDoResumo
            key={l.slug}
            slug={l.slug}
            nome={l.nome}
            nota={l.mensal ? undefined : nota(l.slug)}
            detalhe={l.mensal && mensalDeHoje ? inicioDaMensalidade(mensalDeHoje, pedido) : undefined}
            preco={
              l.mensal ? (
                <span className="font-semibold">{reais(l.valor)}</span>
              ) : (
                <PrecoDaCriacao linha={l} forma={forma} parcelas={parcelas} />
              )
            }
          />
        ))}
      </ul>

      {pedido.economiaNoCombo > 0 && (
        <p className="mt-3 text-sm font-medium">
          Com o Google Ads junto, você economiza {reais(pedido.economiaNoCombo)} na criação.
        </p>
      )}

      {/* "Total hoje" em cima; o valor e a forma numa linha; as parcelas embaixo
          (Lucas, 2026-11-21). */}
      <div className="mt-5 rounded-xl bg-muted/70 px-4 py-3.5" data-bloco-total>
        <p className="text-sm font-medium text-muted-foreground">Total hoje</p>
        <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
          <strong className="text-2xl font-semibold tracking-tight" data-total>
            {reais(pedido.totalHoje)}
          </strong>
          <span className="text-sm text-muted-foreground">
            {forma === "pix" ? "no Pix" : parcelas > 1 ? "no cartão" : "no cartão, à vista"}
          </span>
        </p>
        {forma === "cartao" && parcelas > 1 && (
          <p className="text-sm text-muted-foreground">
            ou {parcelas}x de {reais(valorDaParcela(pedido.totalHoje, parcelas))} sem juros
          </p>
        )}
      </div>

      {economiaNoPix > 0 &&
        (forma === "cartao" ? (
          <div className="mt-4 rounded-xl border border-brand bg-brand/15 p-4" data-destaque-pix>
            <p className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <IconePix className="size-5 shrink-0" />
              No Pix sai por {reais(pedido.totalHoje - economiaNoPix)}
            </p>
            <p className="mt-1 text-sm leading-5">Você economiza {reais(economiaNoPix)} pagando à vista no Pix.</p>
            <button
              type="button"
              onClick={aoEscolherPix}
              className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90"
            >
              Pagar no Pix
            </button>
          </div>
        ) : (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-brand/15 px-4 py-3 text-sm font-medium" data-destaque-pix>
            <IconePix className="size-4 shrink-0" />
            Você economiza {reais(economiaNoPix)} no Pix.
          </p>
        ))}

      {depois.length > 0 && (
        <div className="mt-5 border-t pt-5">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Depois</h3>
          <ul className="mt-3 space-y-4">
            {depois.map((m) => (
              <LinhaDoResumo
                key={m.slug}
                slug={m.slug}
                nome={m.nome}
                detalhe={inicioDaMensalidade(m, pedido)}
                preco={<span className="font-semibold">{m.inicio === "incluida" ? "Incluída" : `${reais(m.valor)}/mês`}</span>}
              />
            ))}
          </ul>
        </div>
      )}

      <ul className="mt-5 space-y-2 border-t pt-4 text-sm text-muted-foreground">
        {temMensal && (
          <li className="flex gap-2">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            Sem fidelidade: cancele quando quiser.
          </li>
        )}
        <li className="flex gap-2">
          <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
          Garantia de 7 dias: se desistir, você recebe de volta o valor pago.
        </li>
      </ul>
    </div>
  );
}

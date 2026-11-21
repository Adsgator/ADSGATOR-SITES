import { CheckIcon } from "lucide-react";

import { IconePix } from "@/components/icone-pix";
import { dataCurta, reais, valorDaParcela, type Forma, type Mensalidade, type Pedido } from "@/lib/checkout/pedido";

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
      return `A primeira vence em ${dataCurta(pedido.vencimento)}, e as próximas todo dia ${pedido.diaDaRenovacao}.`;
  }
}

/** Como fica o pagamento de hoje: "no Pix" ou "em 12x de R$ 104,17". */
export function comoPaga(pedido: Pedido, forma: Forma, parcelas: number) {
  if (forma === "pix") return "no Pix";
  if (parcelas > 1) return `no cartão, em ${parcelas}x de ${reais(valorDaParcela(pedido.totalHoje, parcelas))} sem juros`;
  return "no cartão, à vista";
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
  const temAds = pedido.servicos.some((s) => s.slug === "google-ads");
  const temMensal = pedido.mensalidades.length > 0;
  const mensalDeHoje = pedido.mensalidades.find((m) => m.inicio === "hoje");

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm" data-resumo>
      <h2 className="text-base font-semibold">Resumo</h2>

      <ul className="mt-4 space-y-3 text-sm">
        {pedido.hoje.map((l) => (
          <li key={l.slug} className="flex items-start justify-between gap-4">
            <span>
              {l.nome}
              {l.mensal && <span className="block text-xs text-muted-foreground">1ª mensalidade</span>}
            </span>
            <span className="text-right whitespace-nowrap">
              {l.valorCheio && (
                <span className="mr-2 text-xs text-muted-foreground line-through">{reais(l.valorCheio)}</span>
              )}
              {reais(l.valor)}
            </span>
          </li>
        ))}
      </ul>

      {pedido.economiaNoCombo > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Com o Google Ads junto, a criação sai {reais(pedido.economiaNoCombo)} mais barata.
        </p>
      )}

      <div className="mt-4 flex items-end justify-between gap-4 border-t pt-4">
        <span className="text-sm font-medium">Total hoje</span>
        <span className="text-right">
          <strong className="block text-2xl font-semibold tracking-tight" data-total>
            {reais(pedido.totalHoje)}
          </strong>
          <span className="text-xs text-muted-foreground">{comoPaga(pedido, forma, parcelas)}</span>
        </span>
      </div>

      {economiaNoPix > 0 &&
        (forma === "cartao" ? (
          <div className="mt-4 rounded-xl border border-brand bg-brand/15 p-4" data-destaque-pix>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <IconePix className="size-4 shrink-0" />
              No Pix sai por {reais(pedido.totalHoje - economiaNoPix)}
            </p>
            <p className="mt-1 text-xs leading-5">Você economiza {reais(economiaNoPix)} pagando à vista no Pix.</p>
            <button
              type="button"
              onClick={aoEscolherPix}
              className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90"
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
        <div className="mt-5 border-t pt-4">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Depois</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {depois.map((m) => (
              <li key={m.slug}>
                <span className="flex justify-between gap-4">
                  <span>{m.nome}</span>
                  <span className="whitespace-nowrap">{m.inicio === "incluida" ? "Incluída" : `${reais(m.valor)}/mês`}</span>
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{inicioDaMensalidade(m, pedido)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mensalDeHoje && (
        <p className="mt-4 text-xs leading-5 text-muted-foreground">{inicioDaMensalidade(mensalDeHoje, pedido)}</p>
      )}

      <ul className="mt-5 space-y-2 border-t pt-4 text-xs text-muted-foreground">
        {temMensal && (
          <li className="flex gap-2">
            <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            Sem fidelidade: cancele quando quiser.
          </li>
        )}
        {temAds && (
          <li className="flex gap-2">
            <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            A verba dos anúncios é paga por você direto ao Google.
          </li>
        )}
        <li className="flex gap-2">
          <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
          Desistiu em até 7 dias? Você recebe de volta o que pagou.
        </li>
      </ul>
    </div>
  );
}

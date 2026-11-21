import { CheckIcon } from "lucide-react";

import { dataCurta, reais, valorDaParcela, type Forma, type Mensalidade, type Pedido } from "@/lib/checkout/pedido";

/** Quando cada mensalidade começa, dito para o cliente. */
export function inicioDaMensalidade(m: Mensalidade, pedido: Pedido) {
  switch (m.inicio) {
    case "aprovacao":
      return "Começa quando você aprovar a sua página. Você recebe o link para pagar, com vencimento em 3 dias.";
    case "entrega":
      return "A primeira vence um mês depois da entrega, se você quiser manter.";
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

export function ResumoDoPedido({ pedido, forma, parcelas }: { pedido: Pedido; forma: Forma; parcelas: number }) {
  const depois = pedido.mensalidades.filter((m) => m.inicio !== "hoje");
  const temAds = pedido.servicos.some((s) => s.slug === "google-ads");
  const temMensal = pedido.mensalidades.length > 0;

  if (pedido.servicos.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Escolha ao lado o que você quer contratar para ver o resumo.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6" data-resumo>
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
        <p className="mt-3 rounded-lg bg-brand/15 px-3 py-2 text-xs">
          Com o Google Ads junto, você economiza {reais(pedido.economiaNoCombo)} na criação.
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

      {pedido.hoje.some((l) => l.mensal) && (
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          {inicioDaMensalidade(pedido.mensalidades.find((m) => m.inicio === "hoje")!, pedido)}
        </p>
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

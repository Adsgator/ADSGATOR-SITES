"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { ExternalLinkIcon, LoaderCircleIcon, LockIcon, XIcon } from "lucide-react";

import { site } from "@/config/site";
import { dataCurta, reais, type Forma, type Pedido } from "@/lib/checkout/pedido";
import { cn } from "@/lib/utils";

import { comoPaga, inicioDaMensalidade } from "./resumo";

// Decisão 8 A do Lucas (2026-11-21): ao clicar em Contratar, uma janela só com
// o resumo, os pontos principais dos Termos em linguagem simples, o link para
// os Termos completos e a caixa "Li e aceito", desmarcada; o botão só funciona
// com ela marcada. Os pontos vêm do resumo dos Termos publicados (seções 7 a
// 10 e 14).

/** Pontos principais dos Termos que valem para este pedido. */
function pontosDosTermos(pedido: Pedido) {
  const temAds = pedido.servicos.some((s) => s.slug === "google-ads");
  const temCriacao = pedido.servicos.some((s) => s.tipo === "unico");
  const temMensal = pedido.mensalidades.some((m) => m.inicio !== "incluida");
  const pontos: string[] = [];

  if (temCriacao)
    pontos.push(
      "A página é sua depois de entregue, com o domínio no seu nome e o primeiro ano pago. Você aprova o roteiro, e há até 2 rodadas de ajustes.",
    );
  if (pedido.combo)
    pontos.push(
      "A mensalidade do Google Ads começa quando você aprovar a página: você recebe o link para pagar, com vencimento em 3 dias, e as próximas ficam nesse mesmo dia do mês.",
    );
  if (pedido.mensalidades.some((m) => m.inicio === "entrega"))
    pontos.push(
      "A manutenção começa 30 dias depois da entrega da página, que já vem com 30 dias de suporte: você recebe o link para pagar, e as próximas ficam nesse mesmo dia do mês.",
    );
  if (pedido.hoje.some((l) => l.mensal))
    pontos.push(
      `A mensalidade é paga antes: a primeira vence em ${dataCurta(pedido.vencimento)}, e cada uma libera os 30 dias seguintes.`,
    );
  if (temAds) pontos.push("A verba dos anúncios é paga por você direto ao Google e não entra nesta cobrança.");
  if (temMensal) {
    pontos.push("Sem fidelidade: os planos mensais podem ser cancelados quando você quiser, sem multa, avisando 48 horas antes do vencimento.");
    pontos.push("Com 7 dias de atraso na mensalidade, o serviço é suspenso; com 15, o plano é cancelado.");
  }
  pontos.push("Garantia de 7 dias: se desistir em até 7 dias da contratação, você recebe de volta o que pagou à Adsgator.");
  pontos.push("A Adsgator não garante vendas, contatos nem posição no Google: o resultado do seu negócio é seu.");
  return pontos;
}

export function JanelaDeAceite({
  aberta,
  aoMudar,
  pedido,
  forma,
  parcelas,
  aoContratar,
  enviando,
  erro,
}: {
  aberta: boolean;
  aoMudar: (aberta: boolean) => void;
  pedido: Pedido;
  forma: Forma;
  parcelas: number;
  aoContratar: () => void;
  /** Enquanto o pedido vai ao Asaas: o botão espera e não deixa clicar de novo. */
  enviando: boolean;
  /** O que deu errado no envio (ex.: cartão recusado), para a pessoa corrigir. */
  erro: string | null;
}) {
  const [aceite, setAceite] = useState(false);
  const depois = pedido.mensalidades.filter((m) => m.inicio !== "hoje");

  return (
    <Dialog.Root
      open={aberta}
      onOpenChange={(abrir) => {
        if (!abrir) setAceite(false);
        aoMudar(abrir);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          data-janela-aceite
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-2xl bg-popover text-popover-foreground shadow-xl transition duration-200 data-ending-style:translate-y-6 data-ending-style:opacity-0 data-starting-style:translate-y-6 data-starting-style:opacity-0 sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[min(40rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:data-ending-style:translate-y-[-48%] sm:data-starting-style:translate-y-[-48%]"
        >
          <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
            <div>
              <Dialog.Title className="text-lg font-semibold">Revise e aceite os Termos</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                Confira o que você está contratando antes de pagar.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Fechar"
              className="-mr-2 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-muted"
            >
              <XIcon className="size-4" />
            </Dialog.Close>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5 text-sm">
            <section>
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">O que você está contratando</h3>
              <ul className="mt-3 space-y-2">
                {pedido.hoje.map((l) => (
                  <li key={l.slug} className="flex justify-between gap-4">
                    <span>
                      {l.nome}
                      {l.mensal && <span className="text-muted-foreground"> · 1ª mensalidade</span>}
                    </span>
                    <span className="whitespace-nowrap">{reais(l.valor)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between gap-4 border-t pt-3 font-medium">
                <span>Hoje</span>
                <span className="text-right">
                  {reais(pedido.totalHoje)}
                  <span className="block text-xs font-normal text-muted-foreground">{comoPaga(pedido, forma, parcelas)}</span>
                </span>
              </p>
              {depois.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {depois.map((m) => (
                    <li key={m.slug} className="rounded-lg bg-muted/60 px-3 py-2">
                      <span className="flex justify-between gap-4">
                        <span>{m.nome}</span>
                        <span className="whitespace-nowrap">{m.inicio === "incluida" ? "Incluída" : `${reais(m.valor)}/mês`}</span>
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{inicioDaMensalidade(m, pedido)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Pontos principais dos Termos</h3>
              <ul className="mt-3 space-y-2.5">
                {pontosDosTermos(pedido).map((p) => (
                  <li key={p} className="flex gap-2.5 leading-6">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                <a
                  href={`${site.url}/termos`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 font-medium underline underline-offset-4"
                >
                  Ler os Termos de Serviço completos
                  <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
                </a>
                <a
                  href={`${site.url}/privacidade`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 underline underline-offset-4"
                >
                  Política de Privacidade
                  <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
                </a>
              </p>
            </section>
          </div>

          <div className="space-y-4 border-t px-6 py-5">
            {erro && (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3.5 py-3 text-sm text-destructive" data-erro-envio>
                {erro}
              </p>
            )}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-sm has-checked:border-brand has-checked:bg-brand/10">
              <input
                type="checkbox"
                checked={aceite}
                onChange={(e) => setAceite(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]"
                data-aceite
              />
              <span>
                Li e aceito os <strong>Termos de Serviço</strong> e a <strong>Política de Privacidade</strong> da Adsgator.
              </span>
            </label>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Dialog.Close className="h-12 rounded-full border px-6 text-sm font-medium hover:bg-muted">
                Voltar e revisar
              </Dialog.Close>
              <button
                type="button"
                disabled={!aceite || enviando}
                onClick={aoContratar}
                className={cn(
                  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-medium text-brand-foreground transition-colors hover:bg-brand/90",
                  "disabled:cursor-not-allowed disabled:opacity-45",
                )}
                data-contratar-final
              >
                {enviando ? (
                  <>
                    <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
                    Processando…
                  </>
                ) : (
                  <>
                    <LockIcon className="size-4" aria-hidden="true" />
                    Contratar · {reais(pedido.totalHoje)}
                  </>
                )}
              </button>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

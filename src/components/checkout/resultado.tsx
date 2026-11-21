"use client";

import { useEffect, useState } from "react";
import { CheckCircle2Icon, CheckIcon, ClockIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";

import { IconePix } from "@/components/icone-pix";
import { linkWhatsApp, site } from "@/config/site";
import type { RespostaDaContratacao } from "@/lib/checkout/contratacao";
import { reais, valorDaParcela } from "@/lib/checkout/pedido";

// Depois de contratar. O Pix mostra o QR e o copia e cola que o Asaas devolveu
// e confere a cada 5 segundos se o pagamento caiu, para a tela mudar sozinha.
// O cartão volta aprovado ou em análise (a recusa fica na janela, para corrigir).

type Resposta = Extract<RespostaDaContratacao, { ok: true }>;

const CONFERIR_A_CADA_MS = 5000;

function dataBr(iso: string) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function ProximosPassos({ email }: { email: string }) {
  return (
    <div className="mt-6 space-y-2 border-t pt-5 text-sm leading-6 text-muted-foreground">
      <p>
        Você vai receber a confirmação e os Termos aceitos no e-mail <strong className="text-foreground">{email}</strong>.
      </p>
      <p>Em seguida, a gente chama você no WhatsApp com os próximos passos.</p>
      <p>
        Alguma dúvida?{" "}
        <a
          href={linkWhatsApp("Olá! Acabei de contratar a Adsgator e tenho uma dúvida.")}
          className="font-medium text-foreground underline underline-offset-4"
        >
          Fale com a gente no WhatsApp
        </a>
        , no {site.whatsapp.exibicao}.
      </p>
    </div>
  );
}

function PagamentoNoPix({
  resposta,
  email,
  depois,
}: {
  resposta: Extract<Resposta, { forma: "pix" }>;
  email: string;
  depois?: React.ReactNode;
}) {
  const [pago, setPago] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (pago) return;
    const id = setInterval(async () => {
      try {
        const r = await fetch(`/situacao/${resposta.cobranca}`, { cache: "no-store" });
        if (r.ok && ((await r.json()) as { pago?: boolean }).pago) setPago(true);
      } catch {
        // Sem conexão agora: tenta de novo na próxima volta.
      }
    }, CONFERIR_A_CADA_MS);
    return () => clearInterval(id);
  }, [pago, resposta.cobranca]);

  async function copiar() {
    if (!resposta.pix) return;
    await navigator.clipboard.writeText(resposta.pix.copiaECola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  }

  if (pago) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-card p-6 sm:p-8" data-resultado="pix-pago">
        <CheckCircle2Icon className="size-10 text-success" aria-hidden="true" />
        <h2 className="mt-4 font-heading text-2xl tracking-tight">Pagamento confirmado</h2>
        <p className="mt-2 text-sm text-muted-foreground">Recebemos o seu Pix de {reais(resposta.valor)}. Obrigado!</p>
        {depois ?? <ProximosPassos email={email} />}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border bg-card p-6 sm:p-8" data-resultado="pix">
      <h2 className="flex items-center gap-2.5 font-heading text-2xl tracking-tight">
        <IconePix className="size-6" />
        Falta só o Pix
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Pague {reais(resposta.valor)} até {dataBr(resposta.vencimento)}
        {resposta.pix ? " pelo QR Code ou pelo código abaixo" : ""}. Esta tela muda sozinha quando o pagamento for
        confirmado.
      </p>

      {resposta.pix ? (
        <div className="mt-6 flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- imagem em base64 que o Asaas devolve */}
          <img
            src={`data:image/png;base64,${resposta.pix.imagem}`}
            alt="QR Code do Pix"
            width={224}
            height={224}
            className="size-56 rounded-xl border bg-white p-2"
            data-qr-pix
          />
          <button
            type="button"
            onClick={copiar}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border text-sm font-medium hover:bg-muted"
            data-copiar-pix
          >
            {copiado ? <CheckIcon className="size-4" aria-hidden="true" /> : <CopyIcon className="size-4" aria-hidden="true" />}
            {copiado ? "Código copiado" : "Copiar o código Pix"}
          </button>
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-muted/70 p-4 text-sm leading-6">
          <p>O QR Code não carregou agora. Você pode pagar pela página da cobrança, no Asaas.</p>
          {resposta.linkDaCobranca && (
            <a
              href={resposta.linkDaCobranca}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 font-semibold text-brand-foreground hover:bg-brand/90"
            >
              Abrir a cobrança
              <ExternalLinkIcon className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
      {depois ?? <ProximosPassos email={email} />}
    </div>
  );
}

export function ResultadoDaContratacao({
  resposta,
  email,
  depois,
}: {
  resposta: Resposta;
  email: string;
  /** O que vem depois, no lugar do texto da contratação (ex.: no link da mensalidade). */
  depois?: React.ReactNode;
}) {
  if (resposta.forma === "pix") return <PagamentoNoPix resposta={resposta} email={email} depois={depois} />;

  const como =
    resposta.parcelas > 1
      ? `no cartão, em ${resposta.parcelas}x de ${reais(valorDaParcela(resposta.valor, resposta.parcelas))} sem juros`
      : "no cartão, à vista";

  if (resposta.situacao === "em_analise") {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-card p-6 sm:p-8" data-resultado="cartao-analise">
        <ClockIcon className="size-10 text-muted-foreground" aria-hidden="true" />
        <h2 className="mt-4 font-heading text-2xl tracking-tight">Pagamento em análise</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          O pagamento de {reais(resposta.valor)} {como} está sendo conferido pela operadora do cartão. Assim que for
          aprovado, você recebe a confirmação.
        </p>
        {depois ?? <ProximosPassos email={email} />}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border bg-card p-6 sm:p-8" data-resultado="cartao">
      <CheckCircle2Icon className="size-10 text-success" aria-hidden="true" />
      <h2 className="mt-4 font-heading text-2xl tracking-tight">Contratação confirmada</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pagamento de {reais(resposta.valor)} aprovado {como}.
      </p>
      {depois ?? <ProximosPassos email={email} />}
    </div>
  );
}

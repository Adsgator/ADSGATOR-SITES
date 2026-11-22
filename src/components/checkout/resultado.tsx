"use client";

import { useEffect, useState } from "react";
import { CheckIcon, ClockIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";

import { IconePix } from "@/components/icone-pix";
import { linkWhatsApp, site } from "@/config/site";
import type { RespostaDaContratacao } from "@/lib/checkout/contratacao";
import { reais, valorDaParcela } from "@/lib/checkout/pedido";


// Depois de pagar, na contratação e no link da mensalidade. Sem a faixa verde:
// fundo claro com o padrão da marca, o resultado em cima (confirmada, ativada,
// falta o Pix, em análise) e o cartão embaixo com os detalhes: o que foi pago,
// a próxima cobrança e o que acontece agora (Lucas, 2026-11-21). O Pix confere a cada 5 segundos se o pagamento caiu,
// e a tela muda sozinha.

type Resposta = Extract<RespostaDaContratacao, { ok: true }>;

export type ContextoDoResultado =
  | { tipo: "contratacao"; email: string }
  | { tipo: "mensalidade"; servico: string; dia: number };

const CONFERIR_A_CADA_MS = 5000;

function dataBr(iso: string) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

type Situacao = "pix_pendente" | "pago" | "em_analise";

function cabecalho(situacao: Situacao, resposta: Resposta, contexto: ContextoDoResultado) {
  if (situacao === "pix_pendente" && resposta.forma === "pix")
    return {
      rotulo: "Pagamento",
      titulo: (
        <>
          Falta só o <span className="highlight">Pix</span>
        </>
      ),
      texto: `Pague ${reais(resposta.valor)} até ${dataBr(resposta.vencimento)}${resposta.pix ? " pelo QR Code ou pelo código abaixo" : ""}. Esta página muda sozinha quando o pagamento cair.`,
    };
  if (situacao === "em_analise")
    return {
      rotulo: "Pagamento",
      titulo: (
        <>
          Pagamento em <span className="highlight">análise</span>
        </>
      ),
      texto: "A operadora do cartão está conferindo o pagamento. Não precisa fazer nada.",
    };
  return contexto.tipo === "mensalidade"
    ? {
        rotulo: "Mensalidade",
        titulo: (
          <>
            Mensalidade <span className="highlight">ativada</span>
          </>
        ),
        texto: `Obrigado! Recebemos o pagamento de ${reais(resposta.valor)}.`,
      }
    : {
        rotulo: "Contratação",
        titulo: (
          <>
            Contratação <span className="highlight">confirmada</span>
          </>
        ),
        texto: `Obrigado! Recebemos o pagamento de ${reais(resposta.valor)}.`,
      };
}

function oQueAconteceAgora(situacao: Situacao, resposta: Resposta, contexto: ContextoDoResultado): React.ReactNode[] {
  if (contexto.tipo === "mensalidade") {
    const proximas =
      resposta.forma === "cartao"
        ? `As próximas são cobradas no mesmo cartão, todo dia ${contexto.dia}.`
        : `As próximas chegam por e-mail, com o Pix para pagar, todo dia ${contexto.dia}.`;
    if (situacao === "pix_pendente") return ["Assim que o Pix cair, a mensalidade fica ativa e esta página muda sozinha.", proximas];
    if (situacao === "em_analise") return ["Assim que a operadora aprovar, a mensalidade fica ativa.", proximas];
    return ["A mensalidade está ativa: não precisa fazer mais nada.", proximas];
  }
  const email = <strong className="font-medium text-foreground">{contexto.email}</strong>;
  const primeiro =
    situacao === "pix_pendente" ? (
      <>Assim que o Pix cair, a confirmação e os Termos aceitos chegam no e-mail {email}.</>
    ) : situacao === "em_analise" ? (
      <>Assim que a operadora aprovar, a confirmação e os Termos aceitos chegam no e-mail {email}.</>
    ) : (
      <>A confirmação e os Termos aceitos chegam no e-mail {email}.</>
    );
  return [primeiro, "Em seguida, a gente chama você no WhatsApp com os próximos passos."];
}

function Linha({ nome, children }: { nome: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-6 gap-y-0.5 py-3 first:pt-0">
      <dt className="text-muted-foreground">{nome}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

export function TelaDoResultado({ resposta, contexto }: { resposta: Resposta; contexto: ContextoDoResultado }) {
  const [pago, setPago] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const pixPendente = resposta.forma === "pix" && !pago;
  const situacao: Situacao = pixPendente
    ? "pix_pendente"
    : resposta.forma === "cartao" && resposta.situacao === "em_analise"
      ? "em_analise"
      : "pago";

  useEffect(() => {
    if (resposta.forma !== "pix" || pago) return;
    const id = setInterval(async () => {
      try {
        const r = await fetch(`/situacao/${resposta.cobranca}`, { cache: "no-store" });
        if (r.ok && ((await r.json()) as { pago?: boolean }).pago) setPago(true);
      } catch {
        // Sem conexão agora: tenta de novo na próxima volta.
      }
    }, CONFERIR_A_CADA_MS);
    return () => clearInterval(id);
  }, [pago, resposta]);

  async function copiar() {
    if (resposta.forma !== "pix" || !resposta.pix) return;
    await navigator.clipboard.writeText(resposta.pix.copiaECola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  }

  const pagamento =
    resposta.forma === "pix"
      ? pixPendente
        ? `Pix, até ${dataBr(resposta.vencimento)}`
        : "Pix"
      : resposta.parcelas > 1
        ? `Cartão, em ${resposta.parcelas}x de ${reais(valorDaParcela(resposta.valor, resposta.parcelas))} sem juros`
        : "Cartão, à vista";
  const topo = cabecalho(situacao, resposta, contexto);
  const icone =
    situacao === "pix_pendente" ? (
      <IconePix className="size-7" />
    ) : situacao === "em_analise" ? (
      <ClockIcon className="size-7 text-muted-foreground" aria-hidden="true" />
    ) : (
      <CheckIcon className="size-7 text-success" strokeWidth={2.5} aria-hidden="true" />
    );
  const marca = resposta.forma === "pix" ? (pago ? "pix-pago" : "pix") : resposta.situacao === "aprovado" ? "cartao" : "cartao-analise";

  return (
    <section className="bg-pattern-light">
      <div className="mx-auto max-w-xl px-4 pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full border bg-card shadow-sm">{icone}</span>
          <p className="mt-5 text-xs font-medium tracking-wide text-muted-foreground uppercase">{topo.rotulo}</p>
          <h1 className="mt-2 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl" data-titulo>
            {topo.titulo}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">{topo.texto}</p>
        </div>
        <div className="mt-8 rounded-2xl border bg-card p-6 text-[0.9375rem] shadow-sm sm:p-8" data-resultado={marca}>
          {resposta.forma === "pix" &&
            pixPendente &&
            (resposta.pix ? (
              <div className="mb-7 flex flex-col items-center gap-4">
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
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90"
                  data-copiar-pix
                >
                  {copiado ? <CheckIcon className="size-4" aria-hidden="true" /> : <CopyIcon className="size-4" aria-hidden="true" />}
                  {copiado ? "Código copiado" : "Copiar o código Pix"}
                </button>
              </div>
            ) : (
              <div className="mb-7 rounded-xl bg-muted/70 p-4 text-sm leading-6">
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
            ))}

          <h2 className="sr-only">Resumo do pagamento</h2>
          <dl className="divide-y">
            {contexto.tipo === "mensalidade" && <Linha nome="Serviço">{contexto.servico}</Linha>}
            <Linha nome={contexto.tipo === "mensalidade" ? "Mensalidade" : "Valor"}>
              {reais(resposta.valor)}
              {contexto.tipo === "mensalidade" && "/mês"}
            </Linha>
            <Linha nome="Pagamento">{pagamento}</Linha>
            {resposta.proxima && (
              <Linha nome="Próxima cobrança">
                {dataBr(resposta.proxima)}
                <span className="block text-sm font-normal text-muted-foreground">
                  {resposta.forma === "cartao" ? "no mesmo cartão" : "por e-mail, com o Pix"}
                </span>
              </Linha>
            )}
          </dl>

          <div className="mt-6 rounded-xl bg-muted/70 p-4 sm:p-5">
            <h3 className="text-sm font-semibold">O que acontece agora</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-6 text-muted-foreground">
              {oQueAconteceAgora(situacao, resposta, contexto).map((item, i) => (
                <li key={i} className="flex gap-2.5">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-success" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Alguma dúvida?{" "}
            <a
              href={linkWhatsApp(
                contexto.tipo === "mensalidade"
                  ? "Olá! Tenho uma dúvida sobre a minha mensalidade."
                  : "Olá! Acabei de contratar a Adsgator e tenho uma dúvida.",
              )}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Fale com a gente no WhatsApp
            </a>
            , no {site.whatsapp.exibicao}.
          </p>
        </div>
      </div>
    </section>
  );
}

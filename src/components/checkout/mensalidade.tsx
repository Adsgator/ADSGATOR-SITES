"use client";

import { useState } from "react";
import { CheckIcon, LoaderCircleIcon, LockIcon } from "lucide-react";

import { site } from "@/config/site";
import type { RespostaDaContratacao } from "@/lib/checkout/contratacao";
import { reais, type Forma } from "@/lib/checkout/pedido";
import { cartaoVazio, validarCartao, type Cartao } from "@/lib/checkout/validacao";

import { CamposDoCartao, EscolhaDaForma } from "./pagamento";
import { ConteudoDaFaixa, Faixa } from "./faixa";
import { TelaDoResultado } from "./resultado";

// O link da mensalidade, na tela: o cliente lê o que contrata e a data da
// renovação e paga no Pix ou no cartão (decisão do Lucas, 2026-11-21). Os dados
// dele o Asaas já tem, da contratação; aqui só entra o cartão.

type Datas = { vencimentoNoPix: string; hoje: string; diaDaRenovacao: number; proximo: string };

function dataBr(iso: string) {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

const ordemDosCampos = ["cartao-numero", "cartao-nome", "cartao-validade", "cartao-codigo"];

export function FormularioDaMensalidade({
  token,
  cliente,
  servico,
  datas,
  cabecalho,
}: {
  token: string;
  /** O título e o texto da faixa, conforme o serviço. */
  cabecalho: { titulo: React.ReactNode; texto: string };
  /** Nome do cliente no Asaas, para ele conferir que o link é dele. */
  cliente: string;
  servico: { slug: string; nome: string; valor: number };
  datas: Datas;
}) {
  const [forma, setForma] = useState<Forma>("cartao");
  const [cartao, setCartao] = useState<Cartao>(cartaoVazio);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [tentou, setTentou] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroDoEnvio, setErroDoEnvio] = useState<string | null>(null);
  const [resposta, setResposta] = useState<Extract<RespostaDaContratacao, { ok: true }> | null>(null);

  const primeira =
    forma === "cartao"
      ? `1ª mensalidade cobrada hoje no cartão; as próximas, todo dia ${datas.diaDaRenovacao}, no mesmo cartão.`
      : `1ª mensalidade: vence em ${dataBr(datas.vencimentoNoPix)}, e as próximas todo dia ${datas.diaDaRenovacao}.`;

  function mudarCartao(campo: keyof Cartao, valor: string) {
    const novo = { ...cartao, [campo]: valor };
    setCartao(novo);
    if (tentou) setErros(validarCartao(novo));
  }

  function levarAoPrimeiroErro(e: Record<string, string>) {
    const primeiro = ordemDosCampos.find((c) => e[c]);
    if (!primeiro) return false;
    const el = document.getElementById(primeiro);
    el?.scrollIntoView({ block: "center" });
    el?.focus({ preventScroll: true });
    return true;
  }

  async function ativar() {
    if (enviando) return;
    setTentou(true);
    setErroDoEnvio(null);
    if (forma === "cartao") {
      const e = validarCartao(cartao);
      setErros(e);
      if (levarAoPrimeiroErro(e)) return;
    }
    setEnviando(true);
    try {
      const r = await fetch("/mensalidade/pagar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, forma, cartao: forma === "cartao" ? cartao : cartaoVazio }),
      });
      const j = (await r.json()) as RespostaDaContratacao;
      if (!j.ok) {
        setErroDoEnvio(j.erro);
        if (j.campos) {
          setErros(j.campos);
          levarAoPrimeiroErro(j.campos);
        }
        return;
      }
      setResposta(j);
      window.scrollTo({ top: 0 });
    } catch {
      setErroDoEnvio(
        "A conexão caiu antes da resposta. Para não cobrar duas vezes, fale com a gente no WhatsApp antes de tentar de novo.",
      );
    } finally {
      setEnviando(false);
    }
  }

  if (resposta)
    return (
      <TelaDoResultado
        resposta={resposta}
        contexto={{ tipo: "mensalidade", servico: servico.nome, dia: datas.diaDaRenovacao }}
      />
    );

  return (
    <>
      <Faixa rotulo="Mensalidade" titulo={cabecalho.titulo} texto={cabecalho.texto} />
      <ConteudoDaFaixa>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-8">
          <aside className="lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1 lg:self-start" aria-label="Resumo">
            <div className="rounded-2xl border bg-card p-5 text-[0.9375rem] shadow-sm sm:p-6" data-resumo>
              <h2 className="text-lg font-semibold">Resumo</h2>
              <div className="mt-5 flex items-end justify-between gap-4" data-servico={servico.slug}>
                <p className="font-medium">{servico.nome}</p>
                <p className="shrink-0 font-semibold">{reais(servico.valor)}/mês</p>
              </div>
              <p className="mt-1 text-sm leading-5 text-muted-foreground" data-primeira>
                {primeira}
              </p>

              <div className="mt-5 rounded-xl bg-muted/70 px-4 py-3.5" data-bloco-total>
                <p className="text-sm font-medium text-muted-foreground">{forma === "cartao" ? "Hoje" : "1ª mensalidade"}</p>
                <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
                  <strong className="text-2xl font-semibold tracking-tight" data-total>
                    {reais(servico.valor)}
                  </strong>
                  <span className="text-sm text-muted-foreground">
                    {forma === "cartao" ? "no cartão" : `no Pix, até ${dataBr(datas.vencimentoNoPix)}`}
                  </span>
                </p>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Para: <span className="font-medium text-foreground">{cliente}</span>
              </p>

              <ul className="mt-5 space-y-2 border-t pt-4 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                  Sem fidelidade: cancele quando quiser.
                </li>
                {servico.slug === "google-ads" && (
                  <li className="flex gap-2">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                    A verba dos anúncios é paga por você direto ao Google.
                  </li>
                )}
              </ul>
            </div>
          </aside>

          <section aria-labelledby="titulo-pagamento" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7 lg:col-start-1">
            <h2 id="titulo-pagamento" className="text-lg font-semibold">
              Pagamento
            </h2>
            <EscolhaDaForma
              forma={forma}
              aoEscolher={(f) => {
                setForma(f);
                setErroDoEnvio(null);
              }}
              descricao={{
                cartao: `${reais(servico.valor)} · cobrado hoje`,
                pix: `${reais(servico.valor)} · vence em ${dataBr(datas.vencimentoNoPix)}`,
              }}
            />

            {forma === "pix" ? (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                O QR Code e o código para copiar aparecem logo depois de você ativar. As próximas mensalidades chegam por
                e-mail, com o Pix para pagar, todo dia {datas.diaDaRenovacao}.
              </p>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-6">
                <CamposDoCartao cartao={cartao} erros={erros} aoMudar={mudarCartao} />
                <p className="text-sm leading-6 text-muted-foreground sm:col-span-6">
                  As próximas mensalidades são cobradas neste cartão, todo dia {datas.diaDaRenovacao}.
                </p>
              </div>
            )}

            {erroDoEnvio && (
              <p role="alert" className="mt-5 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" data-erro-envio>
                {erroDoEnvio}
              </p>
            )}

            <button
              type="button"
              onClick={ativar}
              disabled={enviando}
              className="mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
              data-ativar
            >
              {enviando ? (
                <>
                  <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
                  Processando…
                </>
              ) : (
                <>
                  <LockIcon className="size-4" aria-hidden="true" />
                  Ativar a mensalidade · {reais(servico.valor)}
                </>
              )}
            </button>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Valem os{" "}
              <a href={`${site.url}/termos`} target="_blank" rel="noopener" className="underline underline-offset-4">
                Termos de Serviço
              </a>{" "}
              aceitos na contratação.
            </p>
          </section>
        </div>
      </ConteudoDaFaixa>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CreditCardIcon, MessageCircleIcon, QrCodeIcon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Desenhos animados dos guias de explicação (pedido do Lucas, 2026-11-21).
// Começam quando chegam na tela e usam transições de CSS: funcionam igual com
// "reduzir animações" ligado (decisão dele para o site todo) e não têm botão
// de pausar (também decisão dele). Os números são de exemplo e vêm marcados.

/** Vira true quando o elemento chega na tela (uma vez só). */
function useNaTela<T extends Element>() {
  const ref = useRef<T>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisto(true);
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);
  return [ref, visto] as const;
}

/** Passo de um ciclo que só anda depois de o desenho aparecer. */
function useCicloNaTela(passos: number, intervalo: number, ativo: boolean) {
  const [passo, setPasso] = useState(0);
  useEffect(() => {
    if (!ativo) return;
    const id = setInterval(() => setPasso((p) => (p + 1) % passos), intervalo);
    return () => clearInterval(id);
  }, [ativo, passos, intervalo]);
  return passo;
}

/** Número que sobe até o valor quando `ativo` liga. */
function useContagem(valor: number, ativo: boolean, duracao = 1200) {
  const [atual, setAtual] = useState(0);
  useEffect(() => {
    if (!ativo) return;
    let quadro = 0;
    const inicio = performance.now();
    const passo = (agora: number) => {
      const t = Math.min((agora - inicio) / duracao, 1);
      setAtual(Math.round(valor * (1 - (1 - t) ** 3)));
      if (t < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [valor, ativo, duracao]);
  return atual;
}

function Moldura({ titulo, children, className }: { titulo: string; children: React.ReactNode; className?: string }) {
  return (
    <figure className={cn("not-prose mt-5 rounded-3xl border bg-card p-5 text-foreground shadow-lg shadow-ink/5 sm:p-6", className)}>
      <figcaption className="mb-5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{titulo}</span>
        <span className="rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">exemplo</span>
      </figcaption>
      {children}
    </figure>
  );
}

const milhar = (n: number) => n.toLocaleString("pt-BR");

/* ---------- Métricas: o funil ---------- */

export function FunilDasMetricas() {
  const [ref, visto] = useNaTela<HTMLDivElement>();
  const etapas = [
    { rotulo: "Impressões", valor: 1000, largura: 100 },
    { rotulo: "Cliques", valor: 50, largura: 40, taxa: "CTR de 5%" },
    { rotulo: "Toques no WhatsApp", valor: 10, largura: 14, taxa: "Taxa de conversão de 20%" },
  ];
  return (
    <Moldura titulo="Do anúncio ao WhatsApp">
      <div ref={ref} className="space-y-3">
        {etapas.map((etapa, i) => (
          <Etapa key={etapa.rotulo} {...etapa} ativo={visto} atraso={i * 450} />
        ))}
      </div>
    </Moldura>
  );
}

function Etapa({ rotulo, valor, largura, taxa, ativo, atraso }: { rotulo: string; valor: number; largura: number; taxa?: string; ativo: boolean; atraso: number }) {
  const [liga, setLiga] = useState(false);
  useEffect(() => {
    if (!ativo) return;
    const t = setTimeout(() => setLiga(true), atraso);
    return () => clearTimeout(t);
  }, [ativo, atraso]);
  const numero = useContagem(valor, liga, 900);
  return (
    <div>
      {taxa && (
        <p className={cn("mb-2 ml-3 flex items-center gap-2 font-mono text-xs text-brand transition-opacity duration-500", liga ? "opacity-100" : "opacity-0")}>
          <span aria-hidden="true">↓</span> {taxa}
        </p>
      )}
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium">{rotulo}</span>
        <span className="font-mono">{milhar(numero)}</span>
      </div>
      <div className="mt-1.5 h-4 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-brand transition-[width] duration-900 ease-out" style={{ width: liga ? `${largura}%` : "0%" }} />
      </div>
    </div>
  );
}

/* ---------- Leilão: lance, qualidade e a ordem ---------- */

const anunciantes = [
  { nome: "Concorrente A", lance: 90, qualidade: 30 },
  { nome: "Você", lance: 60, qualidade: 90, voce: true },
  { nome: "Concorrente B", lance: 40, qualidade: 60 },
];

export function LeilaoAnimado() {
  const [ref, visto] = useNaTela<HTMLDivElement>();
  // 0: os lances; 1: a qualidade; 2: a ordem final.
  const fase = useCicloNaTela(3, 2600, visto);
  const classificados = [...anunciantes].sort((a, b) => b.lance * b.qualidade - a.lance * a.qualidade);
  const legenda = ["Primeiro, quanto cada um aceita pagar por clique.", "Depois, a qualidade do anúncio e da página.", "A ordem junta os dois: você fica em 1º, pagando menos que o A."];
  return (
    <Moldura titulo="Uma pesquisa, três anunciantes">
      <div ref={ref}>
        <div className="relative" style={{ height: `${anunciantes.length * 4.5}rem` }}>
          {anunciantes.map((a) => {
            const posicao = fase === 2 ? classificados.indexOf(a) : anunciantes.indexOf(a);
            const valor = fase === 0 ? a.lance : fase === 1 ? a.qualidade : Math.round((a.lance * a.qualidade) / 90);
            return (
              <div
                key={a.nome}
                className="absolute inset-x-0 transition-transform duration-700 ease-out"
                style={{ transform: `translateY(${posicao * 4.5}rem)` }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className={cn("font-medium", a.voce && "text-brand")}>
                    {fase === 2 && <span className="mr-2 font-mono text-xs text-muted-foreground">{posicao + 1}º</span>}
                    {a.nome}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{["lance", "qualidade", "classificação"][fase]}</span>
                </div>
                <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-[width] duration-700 ease-out", a.voce ? "bg-brand" : "bg-foreground/30")}
                    style={{ width: visto ? `${valor}%` : "0%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p aria-live="polite" className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
          {legenda[fase]}
        </p>
      </div>
    </Moldura>
  );
}

/* ---------- Cartão ou Pix ---------- */

export function CartaoOuPix() {
  const [ref, visto] = useNaTela<HTMLDivElement>();
  // 0 a 5: o mês passando (cartão) e o saldo descendo (Pix); 5: recarga.
  const passo = useCicloNaTela(6, 1100, visto);
  const saldo = [100, 75, 50, 25, 10, 100][passo];
  return (
    <Moldura titulo="Como cada um funciona no mês">
      <div ref={ref} className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <CreditCardIcon className="size-4 text-brand" />
            Cartão
          </p>
          <div className="mt-4 grid grid-cols-6 gap-1.5" aria-hidden="true">
            {Array.from({ length: 30 }, (_, dia) => (
              <span
                key={dia}
                className={cn("h-4 rounded-sm transition-colors duration-300", dia < (passo + 1) * 5 ? "bg-brand/70" : "bg-muted")}
              />
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Os anúncios rodam o mês todo; o Google cobra no dia 1.</p>
        </div>
        <div className="rounded-2xl border p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <QrCodeIcon className="size-4 text-brand" />
            Pix
          </p>
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out", saldo <= 10 ? "bg-destructive/70" : "bg-brand")} style={{ width: `${saldo}%` }} />
          </div>
          <p className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground" aria-live="polite">
            {passo === 4 ? "O saldo está no fim: a gente avisa." : passo === 5 ? "Você coloca mais e os anúncios seguem." : "O saldo vai sendo usado pelos anúncios."}
          </p>
        </div>
      </div>
    </Moldura>
  );
}

/* ---------- Os primeiros dias ---------- */

const marcosDosDias = [
  { dia: 1, titulo: "Análise dos anúncios", texto: "de 24 a 48 horas" },
  { dia: 2, titulo: "A Adsgator confere", texto: "anúncios, gasto e pesquisas" },
  { dia: 7, titulo: "Fim do aprendizado", texto: "o Google já conhece o seu cliente" },
  { dia: 14, titulo: "Números mais firmes", texto: "dá para avaliar" },
];

export function LinhaDosPrimeirosDias() {
  const [ref, visto] = useNaTela<HTMLDivElement>();
  const [dia, setDia] = useState(0);
  useEffect(() => {
    if (!visto) return;
    const id = setInterval(() => setDia((d) => (d >= 14 ? 14 : d + 1)), 260);
    return () => clearInterval(id);
  }, [visto]);
  return (
    <Moldura titulo="As duas primeiras semanas">
      <div ref={ref}>
        <div className="relative h-2 rounded-full bg-muted" aria-hidden="true">
          <div className="absolute inset-y-0 left-0 rounded-full bg-brand/25" style={{ width: `${(7 / 14) * 100}%` }} />
          <div className="absolute inset-y-0 left-0 rounded-full bg-brand transition-[width] duration-200 ease-linear" style={{ width: `${(dia / 14) * 100}%` }} />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[0.65rem] text-muted-foreground" aria-hidden="true">
          <span>dia 1</span>
          <span>dia 7</span>
          <span>dia 14</span>
        </div>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {marcosDosDias.map((m) => {
            const chegou = dia >= m.dia;
            return (
              <li key={m.titulo} className={cn("flex gap-3 rounded-2xl border p-3 transition-colors duration-300", chegou && "border-brand/50 bg-brand/5")}>
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[0.65rem] transition-colors duration-300",
                    chegou ? "border-brand bg-brand text-brand-foreground" : "bg-card text-muted-foreground",
                  )}
                >
                  {chegou ? <CheckIcon className="size-3.5" /> : m.dia}
                </span>
                <span>
                  <span className="block text-sm font-medium">{m.titulo}</span>
                  <span className="block text-xs text-muted-foreground">
                    dia {m.dia}: {m.texto}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Moldura>
  );
}

/* ---------- Pesquisei e não vi: o orçamento do dia ---------- */

export function OrcamentoDoDia() {
  const [ref, visto] = useNaTela<HTMLDivElement>();
  // 8h às 18h, de hora em hora; o orçamento acaba às 16h.
  const hora = 8 + useCicloNaTela(12, 700, visto);
  const fim = 16;
  const restante = hora >= fim ? 0 : Math.round(100 - ((hora - 8) / (fim - 8)) * 100);
  const aparece = hora < fim;
  return (
    <Moldura titulo="O orçamento ao longo do dia">
      <div ref={ref} className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="flex items-end justify-between font-mono text-xs text-muted-foreground">
            <span>8h</span>
            <span className="text-2xl text-foreground">{hora > 18 ? "amanhã" : `${hora}h`}</span>
            <span>18h</span>
          </div>
          <div className="mt-2 h-4 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out" style={{ width: `${restante}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Orçamento do dia que ainda resta</p>
        </div>
        <div className="w-full rounded-2xl border bg-background p-3 sm:w-56" aria-live="polite">
          <p className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <SearchIcon className="size-3" />
            eletricista perto de mim
          </p>
          <div className={cn("mt-3 rounded-xl border p-2.5 transition-opacity duration-500", aparece ? "opacity-100" : "opacity-25")}>
            <p className="text-[0.65rem] font-medium">Patrocinado</p>
            <p className="text-sm font-medium text-brand">Seu anúncio</p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{aparece ? "Aparecendo" : "Volta amanhã cedo"}</p>
        </div>
      </div>
    </Moldura>
  );
}

/* ---------- LGPD: o aviso de cookies ---------- */

export function AvisoDeCookiesAnimado() {
  const [ref, visto] = useNaTela<HTMLDivElement>();
  // 0: o aviso aparece; 1: toca em Aceitar; 2: resultado; 3: o aviso; 4: Recusar; 5: resultado.
  const passo = useCicloNaTela(6, 1500, visto);
  const aceitou = passo < 3;
  const tocou = passo === 1 || passo === 4;
  const resultado = passo === 2 || passo === 5;
  return (
    <Moldura titulo="Quem aceita e quem recusa">
      <div ref={ref} className="grid items-center gap-5 sm:grid-cols-[auto_1fr]">
        <div className="mx-auto h-64 w-36 overflow-hidden rounded-[1.75rem] border-4 border-foreground/80 bg-background p-2" aria-hidden="true">
          <div className="space-y-1.5">
            <span className="block h-3 w-16 rounded bg-brand/60" />
            <span className="block h-2 w-full rounded bg-muted" />
            <span className="block h-2 w-4/5 rounded bg-muted" />
            <span className="block h-12 w-full rounded-lg bg-muted" />
          </div>
          <div className={cn("mt-3 rounded-xl border bg-card p-2 shadow transition-opacity duration-300", resultado ? "opacity-0" : "opacity-100")}>
            <span className="block h-1.5 w-full rounded bg-muted" />
            <span className="mt-1 block h-1.5 w-3/4 rounded bg-muted" />
            <span className="mt-2 flex gap-1.5">
              <span className={cn("flex-1 rounded-full py-1 text-center text-[0.55rem] font-medium", "bg-brand text-brand-foreground", tocou && aceitou && "ring-2 ring-foreground")}>Aceitar</span>
              <span className={cn("flex-1 rounded-full border py-1 text-center text-[0.55rem]", tocou && !aceitou && "ring-2 ring-foreground")}>Recusar</span>
            </span>
          </div>
          <span className="mt-3 flex items-center justify-center gap-1 rounded-full bg-[#25d366] py-1.5 text-[0.6rem] font-medium text-white">
            <MessageCircleIcon className="size-3" />
            WhatsApp
          </span>
        </div>
        <div aria-live="polite" className="space-y-2 text-sm leading-6">
          <p className={cn("rounded-2xl border p-3 transition-colors duration-300", resultado && aceitou && "border-brand/50 bg-brand/5")}>
            <span className="font-medium">Aceitou:</span> entra na conta do Google e aparece no resumo.
          </p>
          <p className={cn("rounded-2xl border p-3 transition-colors duration-300", resultado && !aceitou && "border-brand/50 bg-brand/5")}>
            <span className="font-medium">Recusou:</span> não entra na conta, mas te chama no WhatsApp do mesmo jeito.
          </p>
        </div>
      </div>
    </Moldura>
  );
}

/* ---------- Verificação do anunciante ---------- */

const etapasDaVerificacao = ["O aviso chega na conta ou por e-mail", "Você responde as perguntas", "Envia a foto do documento", "O Google analisa, em até 5 dias úteis"];

export function EtapasDaVerificacao() {
  const [ref, visto] = useNaTela<HTMLOListElement>();
  const passo = useCicloNaTela(etapasDaVerificacao.length + 2, 1200, visto);
  return (
    <Moldura titulo="Do aviso à conta verificada">
      <ol ref={ref} className="space-y-2">
        {etapasDaVerificacao.map((etapa, i) => {
          const feita = i < passo;
          return (
            <li key={etapa} className={cn("flex items-center gap-3 rounded-2xl border p-3 text-sm transition-colors duration-300", feita && "border-brand/50 bg-brand/5")}>
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-colors duration-300",
                  feita ? "border-brand bg-brand text-brand-foreground" : "bg-card text-muted-foreground",
                )}
              >
                {feita ? <CheckIcon className="size-3.5" /> : i + 1}
              </span>
              {etapa}
            </li>
          );
        })}
        <li
          className={cn(
            "flex items-center gap-3 rounded-2xl p-3 text-sm font-medium transition-[opacity,background-color] duration-300",
            passo > etapasDaVerificacao.length ? "bg-brand text-brand-foreground opacity-100" : "opacity-40",
          )}
        >
          <CheckIcon className="size-4" />
          Conta verificada
        </li>
      </ol>
    </Moldura>
  );
}

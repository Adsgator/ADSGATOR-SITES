"use client";

import { useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";
import { MotionPauseButton, MotionScope } from "@/components/motion/motion-scope";
import { Reveal } from "@/components/motion/reveal";
import { useDigitacao } from "@/components/motion/use-digitacao";
import { BuscaGoogle, Celular, ConversaWhatsApp } from "@/components/telas-servico";
import { segmentos, type Segmento } from "@/config/segmentos";
import { cn } from "@/lib/utils";

const buscasDosSegmentos = segmentos.map((s) => s.busca);

const passos = [
  {
    rotulo: "01 · Busca",
    titulo: "Ele procura o que você faz.",
    texto: "Na hora em que precisa, o seu cliente abre o Google e digita o serviço e a cidade.",
    largura: "max-w-md",
  },
  {
    rotulo: "02 · Anúncio",
    titulo: "E encontra você primeiro.",
    texto: "O seu anúncio aparece no topo, para quem está perto e procurando agora.",
    largura: "max-w-md",
  },
  {
    rotulo: "03 · Página",
    titulo: "Chega numa página feita para ele.",
    texto: "Rápida no celular, clara e com o que ele precisa para decidir.",
    largura: "max-w-[16.5rem]",
  },
  {
    rotulo: "04 · WhatsApp",
    titulo: "E chama você no WhatsApp.",
    texto: "Um toque e a conversa começa. O anúncio traz o contato; quem fecha é você.",
    largura: "max-w-md",
  },
];

/**
 * O caminho do cliente, do Google ao WhatsApp (plano geral, Parte 1, passo 2b).
 * No computador, a seção fica presa na tela e troca o passo com a rolagem,
 * como a linha do tempo do Zouti. No celular, os passos ficam um embaixo do
 * outro. A busca digita os segmentos um por vez, e o anúncio, a página e a
 * conversa acompanham o segmento da vez (pedido do Lucas, 2026-11-20). Com
 * "reduzir animações", a troca das telas é só um esmaecimento.
 */
export function CaminhoCliente() {
  return (
    <MotionScope>
      <Conteudo />
    </MotionScope>
  );
}

function Conteudo() {
  const trilho = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const { scrollYProgress } = useScroll({ target: trilho, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setAtivo(Math.min(passos.length - 1, Math.floor(p * passos.length))),
  );
  const digitacao = useDigitacao(buscasDosSegmentos, { inicio: 400, espera: 3200 });
  const s = segmentos[digitacao.indice];
  const telas = [
    <Pesquisa key="busca" texto={digitacao.visivel ? digitacao.texto : ""} />,
    <Resultados key="anuncio" s={s} />,
    <Celular key="pagina" s={s} />,
    <ConversaWhatsApp key="whatsapp" s={s} />,
  ];

  return (
    <section>
      <div ref={trilho} data-caminho className="relative hidden h-[400vh] lg:block">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_1.1fr] items-center gap-16 px-4">
            <div>
              <Eyebrow>O caminho do seu cliente</Eyebrow>
              <ol className="mt-10 space-y-7">
                {passos.map((passo, i) => (
                  <li
                    key={passo.rotulo}
                    data-ativo={i === ativo ? "" : undefined}
                    className={cn(
                      "border-l-2 pl-6 transition-[opacity,border-color] duration-500",
                      i === ativo ? "border-brand" : "border-border opacity-40",
                    )}
                  >
                    <p className="font-mono text-xs text-muted-foreground">{passo.rotulo}</p>
                    <h3 className="mt-2 font-heading text-3xl leading-tight">{passo.titulo}</h3>
                    <p className="mt-2 max-w-md leading-7 text-muted-foreground">{passo.texto}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-10 flex max-w-md items-center gap-4">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
                  <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-brand" />
                </div>
                <MotionPauseButton />
              </div>
            </div>
            <div aria-hidden="true" className="relative h-[34rem]">
              <div className="pointer-events-none absolute inset-10 rounded-full bg-brand/30 blur-3xl" />
              {passos.map((passo, i) => (
                <div
                  key={passo.rotulo}
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-[opacity,translate,scale] duration-700 ease-out motion-reduce:transition-opacity",
                    i === ativo
                      ? "opacity-100"
                      : cn("pointer-events-none scale-95 opacity-0", i < ativo ? "-translate-y-12" : "translate-y-12"),
                  )}
                >
                  <div className={cn("w-full", passo.largura)}>{telas[i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-24 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <Eyebrow>O caminho do seu cliente</Eyebrow>
          <MotionPauseButton />
        </div>
        <ol className="mt-10 space-y-20">
          {passos.map((passo, i) => (
            <li key={passo.rotulo}>
              <Reveal>
                <p className="font-mono text-xs text-muted-foreground">{passo.rotulo}</p>
                <h3 className="mt-2 font-heading text-3xl leading-tight">{passo.titulo}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{passo.texto}</p>
              </Reveal>
              <Reveal delay={120} className={cn("mx-auto mt-8 w-full", passo.largura)}>
                <div aria-hidden="true">{telas[i]}</div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Passo 1: a busca sendo digitada, com as sugestões do Google. */
function Pesquisa({ texto }: { texto: string }) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-2xl shadow-ink/10">
      <div className="flex items-center gap-3 rounded-full border bg-background px-4 py-3">
        <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="min-h-5 text-sm">
          {texto}
          <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-foreground align-middle" />
        </span>
      </div>
      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
        {["agora", "perto de mim", "aberto hoje"].map((fim, i) => (
          <li
            key={fim}
            style={{ opacity: texto.length > 3 ? 1 - i * 0.2 : 0 }}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition-opacity duration-300"
          >
            <SearchIcon className="size-3.5" />
            {texto} {fim}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Passo 2: o anúncio no topo, com os resultados comuns apagados embaixo. */
function Resultados({ s }: { s: Segmento }) {
  return (
    <div className="space-y-3">
      <BuscaGoogle s={s} />
      {[0, 1].map((n) => (
        <div key={n} className="rounded-3xl border bg-card/60 p-5 opacity-60">
          <span className="block h-3 w-1/3 rounded-full bg-muted" />
          <span className="mt-3 block h-4 w-3/4 rounded-full bg-muted" />
          <span className="mt-2 block h-3 w-full rounded-full bg-muted/70" />
        </div>
      ))}
    </div>
  );
}

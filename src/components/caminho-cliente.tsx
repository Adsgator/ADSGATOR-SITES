"use client";

import { useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { BuscaGoogle, Celular, ConversaWhatsApp } from "@/components/telas-servico";
import { cn } from "@/lib/utils";

const passos = [
  {
    rotulo: "01 · Busca",
    titulo: "Ele procura o que você faz.",
    texto: "Na hora em que precisa, o seu cliente abre o Google e digita o serviço e a cidade.",
    tela: <Pesquisa />,
    largura: "max-w-md",
  },
  {
    rotulo: "02 · Anúncio",
    titulo: "E encontra você primeiro.",
    texto: "O seu anúncio aparece no topo, para quem está perto e procurando agora.",
    tela: <Resultados />,
    largura: "max-w-md",
  },
  {
    rotulo: "03 · Página",
    titulo: "Chega numa página feita para ele.",
    texto: "Rápida no celular, clara e com o que ele precisa para decidir.",
    tela: <Celular />,
    largura: "max-w-[16.5rem]",
  },
  {
    rotulo: "04 · WhatsApp",
    titulo: "E chama você no WhatsApp.",
    texto: "Um toque e a conversa começa. O anúncio traz o contato; quem fecha é você.",
    tela: <ConversaWhatsApp />,
    largura: "max-w-md",
  },
];

/**
 * O caminho do cliente, do Google ao WhatsApp (plano geral, Parte 1, passo 2b).
 * No computador, a seção fica presa na tela e troca o passo com a rolagem,
 * como a linha do tempo do Zouti. No celular, os passos ficam um embaixo do
 * outro. Com "reduzir animações", a troca das telas é só um esmaecimento.
 */
export function CaminhoCliente() {
  const trilho = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const { scrollYProgress } = useScroll({ target: trilho, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setAtivo(Math.min(passos.length - 1, Math.floor(p * passos.length))),
  );

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
              <div className="mt-10 h-1 max-w-md overflow-hidden rounded-full bg-border">
                <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-brand" />
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
                  <div className={cn("w-full", passo.largura)}>{passo.tela}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-24 lg:hidden">
        <Eyebrow>O caminho do seu cliente</Eyebrow>
        <ol className="mt-10 space-y-20">
          {passos.map((passo) => (
            <li key={passo.rotulo}>
              <Reveal>
                <p className="font-mono text-xs text-muted-foreground">{passo.rotulo}</p>
                <h3 className="mt-2 font-heading text-3xl leading-tight">{passo.titulo}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{passo.texto}</p>
              </Reveal>
              <Reveal delay={120} className={cn("mx-auto mt-8 w-full", passo.largura)}>
                <div aria-hidden="true">{passo.tela}</div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Passo 1: a busca sendo digitada, com as sugestões do Google. */
function Pesquisa() {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-2xl shadow-ink/10">
      <div className="flex items-center gap-3 rounded-full border bg-background px-4 py-3">
        <SearchIcon className="size-4 text-muted-foreground" />
        <span className="text-sm">
          eletricista em campinas
          <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-foreground align-middle" />
        </span>
      </div>
      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
        {["eletricista em campinas 24 horas", "eletricista em campinas perto de mim", "eletricista em campinas orçamento"].map(
          (sugestao) => (
            <li key={sugestao} className="flex items-center gap-3 rounded-xl px-3 py-2">
              <SearchIcon className="size-3.5" />
              {sugestao}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

/** Passo 2: o anúncio no topo, com os resultados comuns apagados embaixo. */
function Resultados() {
  return (
    <div className="space-y-3">
      <BuscaGoogle />
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

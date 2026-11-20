"use client";

import { useState } from "react";
import { ClockIcon } from "lucide-react";
import { motion, useMotionValueEvent } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";
import { margemDaFila, useFilaNaRolagem } from "@/components/motion/use-fila-na-rolagem";
import { cn } from "@/lib/utils";

// "Como funciona" (roteiro do site): a linha do tempo deitada, presa na tela,
// que anda com a rolagem. Cada passo diz quem faz e quanto tempo leva; os
// passos já alcançados acendem na linha de cima. A fila começa com o primeiro
// passo alinhado ao título e termina com o último inteiro (useFilaNaRolagem).

export type Passo = { titulo: string; texto: string; quem: "Você" | "Adsgator" | "Juntos"; tempo?: string };

export function PassosNaRolagem({ passos, titulo }: { passos: Passo[]; titulo: React.ReactNode }) {
  const { area, palco, fila, x, andado, alturaDaArea } = useFilaNaRolagem();
  const [atual, setAtual] = useState(0);
  useMotionValueEvent(andado, "change", (p) => setAtual(Math.round(p * (passos.length - 1))));

  return (
    <section ref={area} data-passos style={{ height: alturaDaArea }} className="relative">
      <div ref={palco} className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <Eyebrow>Passo a passo</Eyebrow>
          <h2 className="mt-5 max-w-3xl font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
            {titulo}
          </h2>
          {/* A linha de cima: um ponto por passo, acendendo com a rolagem. */}
          <div aria-hidden="true" className="relative mt-8 flex items-center justify-between">
            <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-border">
              <motion.span style={{ scaleX: andado }} className="block h-full origin-left rounded-full bg-brand" />
            </span>
            {passos.map((passo, i) => (
              <span
                key={passo.titulo}
                className={cn(
                  "relative flex size-7 items-center justify-center rounded-full border font-mono text-xs transition-all duration-300",
                  i <= atual ? "border-brand bg-brand text-brand-foreground" : "bg-background text-muted-foreground",
                  i === atual && "scale-125",
                )}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>

        <motion.ul ref={fila} style={{ x }} className={cn("mt-8 flex w-max gap-5", margemDaFila)}>
          {passos.map(({ titulo: t, texto, quem, tempo }, i) => (
            <li
              key={t}
              data-passo={i}
              data-atual={i === atual ? "" : undefined}
              className={cn(
                "flex w-[min(80vw,22rem)] flex-col rounded-3xl border bg-card p-6 transition-colors duration-300 sm:p-7",
                i === atual && "border-brand",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    quem === "Você" && "bg-muted text-foreground",
                    quem === "Adsgator" && "bg-brand text-brand-foreground",
                    quem === "Juntos" && "border",
                  )}
                >
                  {quem === "Juntos" ? "Você e a Adsgator" : quem}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-2xl leading-tight">{t}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{texto}</p>
              {tempo && (
                <p className="mt-auto flex items-center gap-2 pt-5 text-sm">
                  <ClockIcon className="size-4 shrink-0 text-muted-foreground" />
                  {tempo}
                </p>
              )}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";

import { useFeitos } from "@/components/lista-que-se-marca";
import { cn } from "@/lib/utils";

/**
 * Linha do tempo que se preenche com a rolagem e acende cada marco quando
 * chega nele: deitada a partir de 768 px, em pé no celular (página de Google
 * Ads, "Todo mês"; serve às outras páginas).
 */
export function LinhaDoTempo({
  marcos,
}: {
  /** `icone` já desenhado (um componente não passa da página, no servidor, para cá). */
  marcos: { quando: string; titulo: string; texto: string; icone: React.ReactNode }[];
}) {
  const linha = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: linha, offset: ["start 0.75", "end 0.5"] });
  const acesos = useFeitos(scrollYProgress, marcos.length);

  return (
    <ol
      ref={linha}
      style={{ "--colunas": marcos.length } as React.CSSProperties}
      className="relative grid gap-10 pl-16 md:grid-cols-[repeat(var(--colunas),minmax(0,1fr))] md:gap-8 md:pl-0"
    >
      {/* Em pé (celular) e deitada (a partir de 768 px), do centro do primeiro
          marco ao centro do último. */}
      <span aria-hidden="true" className="absolute top-5 bottom-5 left-[1.1875rem] w-0.5 rounded-full bg-border md:hidden">
        <motion.span style={{ scaleY: scrollYProgress }} className="block h-full origin-top rounded-full bg-brand" />
      </span>
      <span
        aria-hidden="true"
        className="absolute top-[1.1875rem] hidden h-0.5 rounded-full bg-border md:block"
        style={{ left: `calc(100% / ${marcos.length} / 2)`, right: `calc(100% / ${marcos.length} / 2)` }}
      >
        <motion.span style={{ scaleX: scrollYProgress }} className="block h-full origin-left rounded-full bg-brand" />
      </span>

      {marcos.map(({ quando, titulo, texto, icone }, i) => {
        const aceso = i < acesos;
        return (
          <li key={titulo} data-aceso={aceso ? "" : undefined} className="relative md:text-center">
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-0 -left-16 flex size-10 items-center justify-center rounded-full border transition-all duration-500 ease-(--ease-out) md:relative md:left-auto md:mx-auto",
                aceso ? "scale-110 border-brand bg-brand text-brand-foreground" : "bg-card text-muted-foreground",
              )}
            >
              {icone}
              {aceso && <span className="absolute inset-0 animate-ping rounded-full bg-brand/40 [animation-iteration-count:2]" />}
            </span>
            <div className={cn("transition-opacity duration-500 md:mt-6", aceso ? "opacity-100" : "opacity-45")}>
              <p className="font-mono text-xs text-muted-foreground">{quando}</p>
              <h3 className="mt-2 font-heading text-2xl leading-tight">{titulo}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{texto}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

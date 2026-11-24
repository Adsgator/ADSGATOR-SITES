"use client";

import { motion } from "motion/react";

import { blocosDasRespostas, RascunhoDaPagina, type Blocos, type Passeio } from "@/components/briefing/rascunho-da-pagina";
import { blocosDoAnuncio, RascunhoDoAnuncio, type BlocosDoAnuncio } from "@/components/briefing/rascunho-do-anuncio";
import type { Briefing, Papel, Respostas } from "@/lib/briefing/regras";
import { fraseDoVisual } from "@/lib/briefing/temas";
import { cn } from "@/lib/utils";

// O desenho que acompanha as respostas: a página ou o anúncio, conforme o briefing.

export type BlocosDoDesenho = { tipo: "pagina"; blocos: Blocos } | { tipo: "google_ads"; blocos: BlocosDoAnuncio };

export function desenhoDe(briefing: Briefing, respostas: Respostas): BlocosDoDesenho {
  return briefing.tipo === "pagina"
    ? { tipo: "pagina", blocos: blocosDasRespostas(briefing, respostas) }
    : { tipo: "google_ads", blocos: blocosDoAnuncio(briefing, respostas) };
}

export function Desenho({
  desenho,
  foco,
  passeio,
  janela,
  altura,
  className,
}: {
  desenho: BlocosDoDesenho;
  /** A parte que está sendo respondida (a página rola até ela). */
  foco?: Papel;
  passeio?: Passeio;
  /** A página numa janela de altura fixa. O anúncio cabe inteiro e não precisa. */
  janela?: boolean;
  /** A altura da janela (classes), quando não é a de sempre. */
  altura?: string;
  className?: string;
}) {
  return desenho.tipo === "pagina" ? (
    <RascunhoDaPagina blocos={desenho.blocos} foco={foco} passeio={passeio} janela={janela} altura={altura} className={className} />
  ) : (
    <RascunhoDoAnuncio blocos={desenho.blocos} className={cn(altura, className)} />
  );
}

/** A frase que resume o visual escolhido, e o aviso de que é só um desenho. */
export function LegendaDoDesenho({ tipo, desenho }: { tipo: Briefing["tipo"]; desenho?: BlocosDoDesenho }) {
  const frase =
    desenho?.tipo === "pagina" ? fraseDoVisual(desenho.blocos.estilos, desenho.blocos.cores, desenho.blocos.sensacoes) : "";
  return (
    <>
      {frase && (
        <motion.p
          key={frase}
          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45 }}
          className="mt-4 text-center font-heading text-base leading-snug text-balance"
          data-frase-do-visual
        >
          {frase}
        </motion.p>
      )}
      <p className={cn("text-center text-xs text-balance text-muted-foreground", frase ? "mt-2" : "mt-4")}>
        Só um desenho para acompanhar. {tipo === "pagina" ? "O visual de verdade é com a gente." : "O anúncio de verdade é com a gente."}
      </p>
    </>
  );
}

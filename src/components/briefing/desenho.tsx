"use client";

import { motion } from "motion/react";

import { blocosDasRespostas, RascunhoDaPagina, type Blocos, type Passeio } from "@/components/briefing/rascunho-da-pagina";
import { blocosDoAnuncio, RascunhoDoAnuncio, type BlocosDoAnuncio } from "@/components/briefing/rascunho-do-anuncio";
import type { Briefing, Papel, Respostas } from "@/lib/briefing/regras";
import { encontroDosEstilos, fraseDoVisual } from "@/lib/briefing/temas";
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
  refinado,
  janela,
  altura,
  className,
}: {
  desenho: BlocosDoDesenho;
  /** A parte que está sendo respondida (a página rola até ela). */
  foco?: Papel;
  passeio?: Passeio;
  refinado?: boolean;
  /** Numa janela de altura fixa, que rola até a parte em foco. */
  janela?: boolean;
  /** A altura da janela (classes), quando não é a de sempre. */
  altura?: string;
  className?: string;
}) {
  return desenho.tipo === "pagina" ? (
    <RascunhoDaPagina blocos={desenho.blocos} foco={foco} passeio={passeio} refinado={refinado} janela={janela} altura={altura} className={className} />
  ) : (
    <RascunhoDoAnuncio blocos={desenho.blocos} foco={foco} passeio={passeio} refinado={refinado} janela={janela} altura={altura} className={className} />
  );
}

/** A frase que resume o visual escolhido, e o aviso de que é só um desenho. */
export function LegendaDoDesenho({ tipo, desenho }: { tipo: Briefing["tipo"]; desenho?: BlocosDoDesenho }) {
  const frase =
    desenho?.tipo === "pagina" ? fraseDoVisual(desenho.blocos.estilos, desenho.blocos.cores, desenho.blocos.sensacoes) : "";
  const encontro = desenho?.tipo === "pagina" ? encontroDosEstilos(desenho.blocos.estilos) : "";
  return (
    <>
      {frase && (
        <motion.p
          key={frase}
          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45 }}
          className="mt-4 text-center font-heading text-base leading-snug text-balance"
        >
          <span data-frase-do-visual>{frase}</span>
          {encontro && <span className="mt-1 block font-sans text-sm text-muted-foreground">{encontro}</span>}
        </motion.p>
      )}
      <p className={cn("text-center text-xs text-balance text-muted-foreground", frase ? "mt-2" : "mt-4")}>
        Só um desenho para acompanhar. {tipo === "pagina" ? "O visual de verdade é com a gente." : "O anúncio de verdade é com a gente."}
      </p>
    </>
  );
}

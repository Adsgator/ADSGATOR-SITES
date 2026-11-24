"use client";

import { blocosDasRespostas, RascunhoDaPagina, type Blocos } from "@/components/briefing/rascunho-da-pagina";
import { blocosDoAnuncio, RascunhoDoAnuncio, type BlocosDoAnuncio } from "@/components/briefing/rascunho-do-anuncio";
import type { Briefing, Respostas } from "@/lib/briefing/regras";

// O desenho que acompanha as respostas: a página ou o anúncio, conforme o briefing.

export type BlocosDoDesenho = { tipo: "pagina"; blocos: Blocos } | { tipo: "google_ads"; blocos: BlocosDoAnuncio };

export function desenhoDe(briefing: Briefing, respostas: Respostas): BlocosDoDesenho {
  return briefing.tipo === "pagina"
    ? { tipo: "pagina", blocos: blocosDasRespostas(briefing, respostas) }
    : { tipo: "google_ads", blocos: blocosDoAnuncio(briefing, respostas) };
}

export function Desenho({ desenho, className }: { desenho: BlocosDoDesenho; className?: string }) {
  return desenho.tipo === "pagina" ? (
    <RascunhoDaPagina blocos={desenho.blocos} className={className} />
  ) : (
    <RascunhoDoAnuncio blocos={desenho.blocos} className={className} />
  );
}

export function LegendaDoDesenho({ tipo }: { tipo: Briefing["tipo"] }) {
  return (
    <p className="mt-4 text-center text-xs text-balance text-muted-foreground">
      Só um desenho para acompanhar. {tipo === "pagina" ? "O visual de verdade é com a gente." : "O anúncio de verdade é com a gente."}
    </p>
  );
}

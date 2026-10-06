"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type Passo = { titulo: string; texto: string; visual: React.ReactNode };

/**
 * Passos que avançam sozinhos: a barra amarela enche e, quando termina, o
 * próximo passo entra. O fim da animação comanda a troca, então a pausa do
 * MotionScope (classe motion-loop) para a barra e a troca juntas. Clicar num
 * passo mostra ele na hora.
 */
export function Steps({ passos, duracao = 6000 }: { passos: Passo[]; duracao?: number }) {
  const [ativo, setAtivo] = useState(0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <ol className="space-y-2">
        {passos.map((passo, i) => {
          const atual = i === ativo;
          return (
            <li key={passo.titulo} aria-current={atual ? "step" : undefined}>
              <button
                type="button"
                onClick={() => setAtivo(i)}
                className={cn(
                  "w-full rounded-2xl p-5 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  atual ? "bg-card" : "hover:bg-card/50",
                )}
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  <span
                    className={cn(
                      "font-heading text-2xl transition-opacity",
                      atual ? "opacity-100" : "opacity-60",
                    )}
                  >
                    {passo.titulo}
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-2 block pl-9 leading-7 text-muted-foreground transition-opacity",
                    atual ? "opacity-100" : "opacity-60",
                  )}
                >
                  {passo.texto}
                </span>
                {atual && (
                  <span className="mt-4 ml-9 block h-0.5 overflow-hidden rounded-full bg-border">
                    <span
                      key={ativo}
                      className="motion-loop block h-full origin-left bg-brand"
                      style={{ animation: `progresso ${duracao}ms linear forwards` }}
                      onAnimationEnd={() => setAtivo((a) => (a + 1) % passos.length)}
                    />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
      <div aria-hidden="true" className="relative">
        {passos.map((passo, i) => (
          <div
            key={passo.titulo}
            className={cn(
              "transition-opacity duration-500",
              i === ativo ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0",
            )}
          >
            {passo.visual}
          </div>
        ))}
      </div>
    </div>
  );
}

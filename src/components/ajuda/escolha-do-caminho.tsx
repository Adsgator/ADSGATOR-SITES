"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

/** Guia com dois caminhos (ex.: conta criada pela Adsgator ou conta que o
 * cliente já tinha): ele escolhe o dele e vê só esses passos. */
export function EscolhaDoCaminho({
  pergunta,
  respostas,
  caminhos,
}: {
  pergunta: string;
  respostas: string[];
  caminhos: React.ReactNode[];
}) {
  const [escolhido, setEscolhido] = useState(0);
  return (
    <div>
      <fieldset className="mb-8">
        <legend className="font-heading text-xl">{pergunta}</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {respostas.map((resposta, i) => (
            <button
              key={resposta}
              type="button"
              onClick={() => setEscolhido(i)}
              aria-pressed={i === escolhido}
              className={cn(
                "min-h-12 rounded-2xl border px-4 py-3 text-left font-medium transition-colors duration-200",
                i === escolhido ? "border-brand bg-brand/10" : "bg-card hover:bg-muted",
              )}
            >
              {resposta}
            </button>
          ))}
        </div>
      </fieldset>
      {/* Remonta ao trocar: o progresso começa do zero no outro caminho. */}
      <div key={escolhido}>{caminhos[escolhido]}</div>
    </div>
  );
}

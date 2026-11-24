"use client";

import { useSyncExternalStore } from "react";

import { RascunhoDaPagina, type Blocos } from "@/components/briefing/rascunho-da-pagina";
import { estilos, opostoMarcado } from "@/lib/briefing/temas";

const base: Blocos = {
  nome: "Rafa Adestramento",
  whatsapp: true,
  servicos: ["Adestramento básico", "Filhotes", "Comportamento"],
  principal: "Adestramento básico",
  detalhes: {
    "Adestramento básico": "Andar sem puxar, vir quando chama e esperar com calma.",
    Filhotes: "Xixi no lugar, mordida e medo.",
    Comportamento: "Cão que avança ou late demais.",
  },
  numeros: [["7 anos", "de experiência"], ["250", "famílias"], ["5,0", "nota no Google"]],
  elogio: "Que eu explico com calma e respondo.",
  icone: "pata",
  atende: ["Campinas e região"],
};

/** Cada estilo e cada dupla que o briefing deixa escolher. */
export function Galeria({ sensacoes, cor, so }: { sensacoes: string[]; cor?: string; so?: string[] }) {
  const noNavegador = useSyncExternalStore(() => () => {}, () => true, () => false);
  if (!noNavegador) return null;
  const nomes = estilos.map((e) => e.nome);
  const grupos = so
    ? [so]
    : [
        ...nomes.map((n) => [n]),
        ...nomes.flatMap((a, i) => nomes.slice(i + 1).filter((b) => !opostoMarcado(b, [a])).map((b) => [a, b])),
      ];
  return (
    <main className="grid grid-cols-[repeat(auto-fill,18rem)] gap-5 bg-neutral-300 p-5">
      {grupos.map((g) => (
        <figure key={g.join("+")} data-combinacao={g.join("+")}>
          <RascunhoDaPagina janela blocos={{ ...base, estilos: g, sensacoes, cores: cor ? [cor] : [] }} altura={so ? "h-auto" : "h-[17rem]"} />
          <figcaption className="pt-1 text-sm">{g.join(" + ")}</figcaption>
        </figure>
      ))}
    </main>
  );
}

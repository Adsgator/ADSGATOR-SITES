"use client";

import { useRef } from "react";

import { NumeroQueSobe, useApareceu } from "@/components/motion/numero-que-sobe";

/**
 * Uma faixa de números que sobem quando a pessoa chega nela (por
 * requestAnimationFrame: anda também com "reduzir animações").
 */
export function NumerosEmFaixa({ itens }: { itens: { valor: number; antes?: string; rotulo: string }[] }) {
  const caixa = useRef<HTMLDListElement>(null);
  const apareceu = useApareceu(caixa);
  return (
    <dl ref={caixa} data-numeros className="grid gap-8 sm:grid-cols-3">
      {itens.map(({ valor, antes, rotulo }) => (
        // O rótulo vem antes no HTML (dt e depois dd) e aparece embaixo.
        <div key={rotulo} className="flex flex-col-reverse border-t pt-6">
          <dt className="mt-3 text-muted-foreground">{rotulo}</dt>
          <dd className="font-heading text-6xl leading-none tracking-tight sm:text-7xl">
            {antes}
            <NumeroQueSobe valor={valor} ativo={apareceu} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

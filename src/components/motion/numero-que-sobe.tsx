"use client";

import { useEffect, useState } from "react";

/**
 * Se o elemento já apareceu na tela (uma vez só). Para animações que começam
 * quando a pessoa chega nelas: barras que enchem, números que sobem.
 */
export function useApareceu(ref: React.RefObject<Element | null>) {
  const [apareceu, setApareceu] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setApareceu(true);
        observador.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, [ref]);
  return apareceu;
}

/**
 * Número que conta de 0 até o valor quando `ativo` liga, desacelerando no fim.
 * Por requestAnimationFrame: anda igual com "reduzir animações" (decisão do
 * Lucas, 2026-11-20).
 */
export function NumeroQueSobe({ valor, ativo, duracao = 1400 }: { valor: number; ativo: boolean; duracao?: number }) {
  const [atual, setAtual] = useState(0);
  useEffect(() => {
    if (!ativo) return;
    let quadro = 0;
    const inicio = performance.now();
    const passo = (agora: number) => {
      const p = Math.min(1, (agora - inicio) / duracao);
      setAtual(Math.round(valor * (1 - Math.pow(1 - p, 3))));
      if (p < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [ativo, valor, duracao]);
  return <span className="tabular-nums">{atual.toLocaleString("pt-BR")}</span>;
}

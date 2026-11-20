"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

/**
 * Qual explicação de uma lista está acesa, pela posição de cada uma na tela
 * (o anúncio por dentro e a página por dentro). Com o visual ao lado (768 px
 * ou mais), a última que passou de 60% da altura; no celular, com o visual
 * preso em cima, a primeira que está inteira abaixo dele, para a acesa nunca
 * ficar escondida atrás do visual.
 */
export function useParteAtiva(lista: React.RefObject<HTMLElement | null>, visual: React.RefObject<HTMLElement | null>) {
  const [ativa, setAtiva] = useState(0);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", () => {
    if (!lista.current || !visual.current) return;
    const itens = [...lista.current.children].map((li) => li.getBoundingClientRect());
    if (matchMedia("(min-width: 768px)").matches) {
      const linha = innerHeight * 0.6;
      setAtiva(Math.max(0, itens.filter((r) => r.top <= linha).length - 1));
    } else {
      const fimDoVisual = visual.current.getBoundingClientRect().bottom;
      const abaixo = itens.findIndex((r) => r.top >= fimDoVisual - 4);
      setAtiva(abaixo === -1 ? itens.length - 1 : abaixo);
    }
  });
  return ativa;
}

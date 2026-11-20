"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useScroll, useTransform } from "motion/react";

/**
 * Fila que anda de lado enquanto a seção fica presa no topo (o portfólio e os
 * passos de "Como funciona"). A distância é medida: a fila começa com o
 * primeiro item alinhado ao conteúdo e termina com o último inteiro na borda,
 * com uma pausa (`pausa`, parte da rolagem) parada em cada ponta.
 *
 * Uso: `area` na seção (com `style={{ height: alturaDaArea }}`), `palco` na
 * caixa presa (`sticky top-0 h-svh overflow-hidden`), `fila` na lista (com
 * `style={{ x }}`). `andado` vai de 0 a 1 ao longo da fila.
 */
export function useFilaNaRolagem<Area extends HTMLElement = HTMLElement>(pausa = 0.1) {
  const area = useRef<Area>(null);
  const palco = useRef<HTMLDivElement>(null);
  const fila = useRef<HTMLUListElement>(null);
  const distancia = useMotionValue(0);
  const [alturaExtra, setAlturaExtra] = useState(0);

  useEffect(() => {
    const medir = () => {
      if (!fila.current || !palco.current) return;
      const d = Math.max(0, fila.current.scrollWidth - palco.current.clientWidth);
      distancia.set(d);
      setAlturaExtra(Math.round(d / (1 - 2 * pausa)));
    };
    medir();
    const observador = new ResizeObserver(medir);
    if (fila.current) observador.observe(fila.current);
    if (palco.current) observador.observe(palco.current);
    return () => observador.disconnect();
  }, [distancia, pausa]);

  const { scrollYProgress } = useScroll({ target: area, offset: ["start start", "end end"] });
  const andado = useTransform(scrollYProgress, [pausa, 1 - pausa], [0, 1], { clamp: true });
  const x = useTransform(() => -andado.get() * distancia.get());

  return { area, palco, fila, x, andado, alturaDaArea: `calc(100svh + ${alturaExtra}px)` };
}

/** Margem da fila igual à do conteúdo (max-w-6xl com px-4), para o primeiro e o
 * último item ficarem alinhados ao título. */
export const margemDaFila = "px-[max(1rem,calc((100%-72rem)/2+1rem))]";

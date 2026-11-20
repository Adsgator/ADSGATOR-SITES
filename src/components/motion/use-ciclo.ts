"use client";

import { useEffect, useState } from "react";

import { useMotionPaused } from "@/components/motion/motion-scope";

/** Passo de um ciclo (0, 1, 2…) que avança sozinho a cada `intervalo` ms e
 * para no botão de pausar da área (MotionScope). */
export function useCiclo(passos: number, intervalo: number) {
  const pausado = useMotionPaused();
  const [passo, setPasso] = useState(0);
  useEffect(() => {
    if (pausado) return;
    const id = setInterval(() => setPasso((p) => (p + 1) % passos), intervalo);
    return () => clearInterval(id);
  }, [pausado, passos, intervalo]);
  return passo;
}

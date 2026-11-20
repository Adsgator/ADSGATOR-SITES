"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// O "fio" que liga as seções do Início (pedido do Lucas, 2026-11-20: as seções
// precisam se conectar, contando a história sem cortes secos, como no Zouti).
// Uma linha na margem esquerda que se preenche de amarelo com a rolagem, com
// um ponto de luz na ponta, passando por todas as seções. Só em telas largas,
// onde há margem para ela sem encostar no texto.
export function FioCondutor({ children }: { children: React.ReactNode }) {
  const area = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: area, offset: ["start 55%", "end 55%"] });
  const ponta = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={area} className="relative">
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[calc(50%-37rem)] hidden w-px bg-foreground/10 xl:block"
      >
        <motion.div style={{ scaleY: scrollYProgress }} className="absolute inset-0 origin-top bg-brand" />
        <motion.span
          style={{ top: ponta }}
          className="absolute -left-[5px] size-[11px] -translate-y-1/2 rounded-full bg-brand shadow-[0_0_0_6px_color-mix(in_oklab,var(--brand)_25%,transparent),0_0_24px_4px_color-mix(in_oklab,var(--brand)_45%,transparent)]"
        />
      </div>
    </div>
  );
}

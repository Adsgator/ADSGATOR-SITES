"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

// O "fio" que liga as seções do Início (pedido do Lucas, 2026-11-20: as seções
// precisam se conectar, contando a história sem cortes secos, como no Zouti).
// Uma linha na margem esquerda que se preenche de amarelo com a rolagem, com
// um ponto de luz na ponta. Segue a rolagem com uma mola (sem os saltos da roda
// do mouse, que davam a "engasgada") e o ponto anda por transform, sem forçar
// o navegador a recalcular a página. Só em telas largas, onde há margem para
// ela sem encostar no texto.
export function FioCondutor({ children }: { children: React.ReactNode }) {
  const area = useRef<HTMLDivElement>(null);
  const trilho = useRef<HTMLDivElement>(null);
  const [altura, setAltura] = useState(0);
  const { scrollYProgress } = useScroll({ target: area, offset: ["start 55%", "end 55%"] });
  const progresso = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const ponta = useTransform(progresso, (p) => p * altura);

  useEffect(() => {
    const elemento = trilho.current;
    if (!elemento) return;
    const medir = new ResizeObserver(([e]) => setAltura(e.contentRect.height));
    medir.observe(elemento);
    return () => medir.disconnect();
  }, []);

  return (
    <div ref={area} className="relative">
      {children}
      <div
        ref={trilho}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[calc(50%-37rem)] hidden w-px bg-foreground/10 xl:block"
      >
        <motion.div style={{ scaleY: progresso }} className="absolute inset-0 origin-top bg-brand will-change-transform" />
        <motion.span
          style={{ y: ponta }}
          className="absolute top-0 -left-[5px] -mt-[5px] size-[11px] rounded-full bg-brand shadow-[0_0_0_6px_color-mix(in_oklab,var(--brand)_25%,transparent),0_0_24px_4px_color-mix(in_oklab,var(--brand)_45%,transparent)] will-change-transform"
        />
      </div>
    </div>
  );
}

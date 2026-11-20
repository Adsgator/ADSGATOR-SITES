"use client";

import { useRef } from "react";

/**
 * O logo ADSGATOR de ponta a ponta no fim do rodapé, apagado, com uma luz que
 * acende as letras onde o mouse passa (a ideia do rodapé do Zouti, pedida pelo
 * Lucas em 2026-11-20). No celular, sem mouse, a luz fica no centro.
 */
export function RodapeLogo() {
  const area = useRef<HTMLDivElement>(null);

  function mover(evento: React.PointerEvent) {
    const caixa = area.current?.getBoundingClientRect();
    if (!caixa || !area.current) return;
    area.current.style.setProperty("--x", `${evento.clientX - caixa.left}px`);
    area.current.style.setProperty("--y", `${evento.clientY - caixa.top}px`);
  }

  return (
    <div
      ref={area}
      aria-hidden="true"
      onPointerMove={mover}
      className="relative mx-auto aspect-[1484/273] w-full max-w-[96rem] [--x:50%] [--y:50%]"
    >
      <div className="absolute inset-0 bg-[url(/brand/logo-dark.svg)] bg-contain bg-center bg-no-repeat opacity-10" />
      <div className="absolute inset-0 bg-[url(/brand/logo-dark.svg)] bg-contain bg-center bg-no-repeat [mask-image:radial-gradient(circle_at_var(--x)_var(--y),#000,transparent_18rem)]" />
    </div>
  );
}

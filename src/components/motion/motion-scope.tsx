"use client";

import { createContext, useContext, useState } from "react";

const PausaContext = createContext<{
  pausado: boolean;
  alternar: () => void;
} | null>(null);

/**
 * Área com animações que rodam sozinhas (palavra que troca, faixa, passos).
 * Guarda o estado de pausa da área, que os componentes leem com
 * `useMotionPaused` e o CSS pelo atributo `data-paused` (globals.css).
 *
 * O site não tem mais botões de pausar (decisão do Lucas, 2026-11-20, avisado
 * de que a WCAG 2.2.2 pede um jeito de parar o que se move sozinho por mais de
 * 5 s). A área ficou para a pausa voltar com um botão só, se ele decidir.
 */
export function MotionScope({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [pausado, setPausado] = useState(false);
  return (
    <PausaContext value={{ pausado, alternar: () => setPausado((p) => !p) }}>
      <div className={className} data-paused={pausado ? "" : undefined}>
        {children}
      </div>
    </PausaContext>
  );
}

/** Se as animações da área estão pausadas. */
export function useMotionPaused() {
  return useContext(PausaContext)?.pausado ?? false;
}

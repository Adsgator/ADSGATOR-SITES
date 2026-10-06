"use client";

import { createContext, useContext, useState } from "react";
import { PauseIcon, PlayIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const PausaContext = createContext<{
  pausado: boolean;
  alternar: () => void;
} | null>(null);

/**
 * Área com animações que rodam sozinhas (palavra que troca, faixa, passos).
 * O MotionPauseButton dentro dela pausa tudo de uma vez, como nos vídeos do
 * site da Apple: o que se move sozinho precisa poder parar (WCAG 2.2.2). O
 * CSS pausa pelo atributo `data-paused` (globals.css).
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

/** Se as animações da área foram pausadas pelo botão. */
export function useMotionPaused() {
  return useContext(PausaContext)?.pausado ?? false;
}

/** Botão redondo de pausar e continuar as animações da área. */
export function MotionPauseButton({ className }: { className?: string }) {
  const contexto = useContext(PausaContext);
  if (!contexto) return null;
  const { pausado, alternar } = contexto;
  return (
    <button
      type="button"
      onClick={alternar}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      {pausado ? <PlayIcon className="size-3.5" /> : <PauseIcon className="size-3.5" />}
      <span className="sr-only">
        {pausado ? "Continuar as animações" : "Pausar as animações"}
      </span>
    </button>
  );
}

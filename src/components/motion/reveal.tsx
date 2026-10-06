"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Entrada suave quando o conteúdo chega na tela (classe `reveal` no
 * globals.css). `delay` (ms) faz entradas em cascata. Sem JavaScript ou com
 * "reduzir animações", o conteúdo aparece direto.
 */
export function Reveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Margem de baixo: revela quando o topo passa de 90% da tela, para
    // funcionar também com blocos mais altos que a tela.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.visible = "";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

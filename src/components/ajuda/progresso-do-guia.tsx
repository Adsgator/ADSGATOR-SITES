"use client";

import { createContext, useContext, useState } from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// "Fiz este passo": o cliente marca cada passo e a barra no alto mostra quanto
// falta. Só na tela, sem guardar nada (a central não grava nem mede nada).
// Sem animação que dependa de "reduzir animações": a barra e as marcas mudam
// com uma transição curta de CSS, igual nos dois modos.

type Progresso = { feitos: Set<number>; alternar: (passo: number) => void; total: number };

const ContextoDoProgresso = createContext<Progresso | null>(null);

function useProgresso() {
  const contexto = useContext(ContextoDoProgresso);
  if (!contexto) throw new Error("Use dentro de <ProgressoDoGuia>.");
  return contexto;
}

export function ProgressoDoGuia({ total, children }: { total: number; children: React.ReactNode }) {
  const [feitos, setFeitos] = useState<Set<number>>(() => new Set());
  const alternar = (passo: number) =>
    setFeitos((atual) => {
      const novo = new Set(atual);
      if (novo.has(passo)) novo.delete(passo);
      else novo.add(passo);
      return novo;
    });
  return <ContextoDoProgresso.Provider value={{ feitos, alternar, total }}>{children}</ContextoDoProgresso.Provider>;
}

export function BarraDoProgresso() {
  const { feitos, total } = useProgresso();
  const feitosAgora = feitos.size;
  const tudo = feitosAgora === total;
  return (
    <div className="sticky top-16 z-30 -mx-4 mb-8 border-b bg-background/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
      <div className="flex items-center justify-between gap-3 text-sm">
        <p aria-live="polite" className={cn("font-medium", tudo && "text-brand")}>
          {tudo ? "Tudo feito!" : `${feitosAgora} de ${total} passos feitos`}
        </p>
        <p className="font-mono text-xs text-muted-foreground">Marque cada passo ao terminar</p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out"
          style={{ width: `${(feitosAgora / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

/** O número do passo, que vira um sinal de feito. */
export function NumeroDoPasso({ passo }: { passo: number }) {
  const { feitos } = useProgresso();
  const feito = feitos.has(passo);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-sm transition-colors duration-200",
        feito ? "border-brand bg-brand text-brand-foreground" : "bg-card text-foreground",
      )}
    >
      {feito ? <CheckIcon className="size-4" /> : passo}
    </span>
  );
}

export function MarcarPasso({ passo }: { passo: number }) {
  const { feitos, alternar } = useProgresso();
  const feito = feitos.has(passo);
  return (
    <button
      type="button"
      onClick={() => alternar(passo)}
      aria-pressed={feito}
      className={cn(
        "mt-4 inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors duration-200",
        feito ? "border-brand bg-brand/10 text-foreground" : "hover:bg-muted",
      )}
    >
      <CheckIcon className={cn("size-4", feito ? "text-brand" : "text-muted-foreground")} />
      {feito ? "Feito" : "Fiz este passo"}
    </button>
  );
}

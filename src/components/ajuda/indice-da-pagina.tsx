"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ItemDoIndice = { id: string; titulo: string };

/** A parte que já passou de um terço da tela é a que está sendo lida. */
function useParteAtual(itens: ItemDoIndice[]) {
  const [atual, setAtual] = useState("");
  useEffect(() => {
    let agendado = 0;
    const marcar = () => {
      agendado = 0;
      const linha = window.innerHeight / 3;
      const passou = itens.filter(({ id }) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= linha).at(-1);
      setAtual(passou?.id ?? "");
    };
    const aoRolar = () => {
      if (!agendado) agendado = requestAnimationFrame(marcar);
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();
    return () => {
      cancelAnimationFrame(agendado);
      window.removeEventListener("scroll", aoRolar);
    };
  }, [itens]);
  return atual;
}

function Lista({ itens, atual, aoEscolher }: { itens: ItemDoIndice[]; atual: string; aoEscolher?: () => void }) {
  return (
    <ol className="space-y-1">
      {itens.map(({ id, titulo }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            onClick={aoEscolher}
            aria-current={id === atual ? "location" : undefined}
            className={cn(
              "block rounded-lg border-l-2 py-1.5 pr-2 pl-3 text-sm leading-snug transition-colors",
              id === atual ? "border-brand bg-brand/10 font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {titulo}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** "Nesta página": ao lado no computador, e o que se está lendo marcado. */
export function IndiceAoLado({ itens }: { itens: ItemDoIndice[] }) {
  const atual = useParteAtual(itens);
  return (
    <nav aria-label="Nesta página" className="sticky top-24">
      <p className="mb-3 font-mono text-xs text-muted-foreground">Nesta página</p>
      <Lista itens={itens} atual={atual} />
    </nav>
  );
}

/** "Nesta página" no celular e no notebook pequeno: um quadro que abre. */
export function IndiceQueAbre({ itens }: { itens: ItemDoIndice[] }) {
  const atual = useParteAtual(itens);
  const [aberto, setAberto] = useState(false);
  return (
    <div className="rounded-2xl border bg-card">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left text-sm font-medium"
      >
        Nesta página
        <ChevronDownIcon className={cn("size-4 transition-transform", aberto && "rotate-180")} />
      </button>
      {aberto && (
        <nav aria-label="Nesta página, no celular" className="border-t p-3">
          <Lista itens={itens} atual={atual} aoEscolher={() => setAberto(false)} />
        </nav>
      )}
    </div>
  );
}

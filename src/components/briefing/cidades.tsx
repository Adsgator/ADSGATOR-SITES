"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

type Regiao = { cidade: string; regiao: string; vizinhas: string[] };

const PRIMEIRAS = 9;

/** A cidade do cliente, a região dela e as vizinhas de verdade, para tocar e acrescentar. */
export function SugestoesDaRegiao({
  cidade,
  marcadas,
  extras,
  aoTocar,
}: {
  cidade: { nome: string; uf: string } | undefined;
  marcadas: string[];
  extras: string[];
  aoTocar: (nome: string) => void;
}) {
  const [regiao, setRegiao] = useState<Regiao | null>(null);
  const [todas, setTodas] = useState(false);
  const nome = cidade?.nome;
  const uf = cidade?.uf;

  useEffect(() => {
    if (!nome || !uf) return;
    const cancelar = new AbortController();
    fetch(`/forms/consulta/regiao?${new URLSearchParams({ uf, cidade: nome })}`, { signal: cancelar.signal })
      .then((r) => (r.ok ? (r.json() as Promise<Regiao>) : null))
      .then(setRegiao)
      // Sem a consulta, a pessoa escreve: as sugestões só facilitam.
      .catch(() => {});
    return () => cancelar.abort();
  }, [nome, uf]);

  const daRegiao = regiao ? [regiao.cidade, `Toda a região de ${regiao.regiao}`, ...regiao.vizinhas] : nome ? [nome] : [];
  const lista = [...daRegiao, ...extras].filter((o) => !marcadas.includes(o));
  const mostradas = todas ? lista : [...lista.filter((o) => !extras.includes(o)).slice(0, PRIMEIRAS), ...lista.filter((o) => extras.includes(o))];
  if (!lista.length) return null;
  return (
    <div className="flex flex-wrap gap-2" data-sugestoes>
      {mostradas.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => aoTocar(o)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-dashed border-ring px-4 text-sm hover:border-solid hover:bg-card"
        >
          <PlusIcon className="size-3.5" aria-hidden="true" />
          {o}
        </button>
      ))}
      {mostradas.length < lista.length && (
        <button
          type="button"
          onClick={() => setTodas(true)}
          className="min-h-11 px-3 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Ver as outras {lista.length - mostradas.length}
        </button>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** O e-mail da Adsgator com o botão de copiar (guia do perfil no Google). */
export function CopiarEmail({ email }: { email: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(email);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Sem permissão para a área de transferência: seleciona o texto para o
      // cliente copiar na mão.
      const alvo = document.getElementById("email-da-adsgator");
      if (alvo) window.getSelection()?.selectAllChildren(alvo);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs text-muted-foreground">E-mail da Adsgator</p>
        <p id="email-da-adsgator" className="mt-1 font-medium break-all">
          {email}
        </p>
      </div>
      <button
        type="button"
        onClick={copiar}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors",
          copiado ? "border-brand bg-brand/10" : "hover:bg-muted",
        )}
      >
        {copiado ? <CheckIcon className="size-4 text-brand" /> : <CopyIcon className="size-4" />}
        <span aria-live="polite">{copiado ? "Copiado" : "Copiar"}</span>
      </button>
    </div>
  );
}

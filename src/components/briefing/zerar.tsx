"use client";

import { useState } from "react";
import { RotateCcwIcon } from "lucide-react";

import { zerarAmostra } from "@/lib/briefing/guardado-da-amostra";

/** Apaga as respostas da amostra neste navegador. */
export function Zerar() {
  const [quantos, setQuantos] = useState<number | null>(null);
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => setQuantos(zerarAmostra())}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-input px-5 text-sm font-medium hover:bg-muted"
      >
        <RotateCcwIcon className="size-4" aria-hidden="true" />
        Zerar tudo o que respondi
      </button>
      <span className="text-sm text-muted-foreground" aria-live="polite">
        {quantos !== null && (quantos ? "Pronto, tudo zerado." : "Não havia nada guardado.")}
      </span>
    </div>
  );
}

"use client";

import { useSyncExternalStore } from "react";

const consulta = "(prefers-reduced-motion: reduce)";

function assinar(avisar: () => void) {
  const lista = window.matchMedia(consulta);
  lista.addEventListener("change", avisar);
  return () => lista.removeEventListener("change", avisar);
}

/** Na amostra, explica por que os movimentos não aparecem quando o sistema
 * pede menos animação (o site respeita essa escolha de propósito). */
export function AvisoMovimento() {
  const reduzido = useSyncExternalStore(
    assinar,
    () => window.matchMedia(consulta).matches,
    () => false,
  );
  if (!reduzido) return null;
  return (
    <p
      role="note"
      className="mt-6 max-w-2xl rounded-xl border border-brand/40 bg-brand/10 p-4 text-sm leading-6"
    >
      Seu sistema está com &quot;reduzir animações&quot; ligado, então os
      movimentos desta página não aparecem: o site respeita essa escolha. Para
      ver, ligue &quot;Mostrar animações no Windows&quot; em Configurações,
      Facilidade de Acesso, Vídeo, e recarregue a página.
    </p>
  );
}

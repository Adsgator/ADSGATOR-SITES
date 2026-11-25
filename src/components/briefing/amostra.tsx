"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { PlayerDoBriefing, type Comeco, type Guardado, type Salvo } from "@/components/briefing/briefing";
import type { BriefingDaAmostra } from "@/lib/briefing/amostra";
import type { Exemplo } from "@/lib/briefing/amostra-preenchida";
import { guardarAmostra, lerAmostra } from "@/lib/briefing/guardado-da-amostra";

// O briefing da amostra (só no `next dev`): as respostas ficam só neste navegador.

type Props = { briefing: BriefingDaAmostra; comeco: Comeco; exemplo?: Exemplo };

const semAssinatura = () => () => {};

/** Só depois de montar no navegador, porque o começo depende do que está guardado nele. */
export function Amostra(props: Props) {
  const noNavegador = useSyncExternalStore(semAssinatura, () => true, () => false);
  return noNavegador ? <NoNavegador {...props} /> : <div className="min-h-dvh" />;
}

function NoNavegador({ briefing, comeco, exemplo }: Props) {
  const { slug, pastaDoMaterial } = briefing;
  // O exemplo preenchido recomeça inteiro a cada vez que abre.
  const [inicial] = useState<Guardado>(() => (exemplo ? { ...exemplo, enviado: false, materialMandado: false } : lerAmostra(slug)));
  useEffect(() => {
    if (exemplo) guardarAmostra(slug, { ...exemplo, enviado: false });
  }, [slug, exemplo]);
  const [salvo, setSalvo] = useState<Salvo>("");
  const guardar = (dados: Guardado) => setSalvo(guardarAmostra(slug, dados) ? "salvo" : "");
  return (
    <PlayerDoBriefing
      briefing={briefing}
      comeco={comeco}
      inicial={inicial}
      pasta={pastaDoMaterial}
      salvo={salvo}
      aoGuardar={guardar}
      aoEnviar={async (dados) => {
        guardar(dados);
        return "";
      }}
      aoMaterial={guardar}
      aoBaixar={async () => "Nesta amostra o arquivo não sai. No briefing de verdade, baixa o PDF das respostas."}
    />
  );
}

"use client";

import { useEffect, useState } from "react";

import { useMotionPaused } from "@/components/motion/motion-scope";

type Fase = "parado" | "digitando" | "pronto" | "saindo";

/**
 * Texto sendo digitado, letra por letra, que fica um tempo pronto, some e dá
 * lugar ao próximo da lista (buscas sendo feitas). `inicio` atrasa o primeiro,
 * `passo` pula itens da lista (para várias buscas na tela não repetirem). Para
 * no botão de pausar da área (MotionScope).
 */
export function useDigitacao(
  textos: readonly string[],
  { inicio = 0, deslocamento = 0, passo = 1, velocidade = 55, espera = 1800, intervalo = 700 } = {},
) {
  const pausado = useMotionPaused();
  const [estado, setEstado] = useState({ indice: deslocamento % textos.length, letras: 0, fase: "parado" as Fase });

  useEffect(() => {
    if (pausado) return;
    const { indice, letras, fase } = estado;
    const alvo = textos[indice];
    const depois = (ms: number, proximo: typeof estado) => setTimeout(() => setEstado(proximo), ms);
    const id =
      fase === "parado"
        ? depois(inicio, { indice, letras: 0, fase: "digitando" })
        : fase === "digitando"
          ? letras < alvo.length
            ? depois(velocidade, { indice, letras: letras + 1, fase })
            : depois(0, { indice, letras, fase: "pronto" })
          : fase === "pronto"
            ? depois(espera, { indice, letras, fase: "saindo" })
            : depois(400 + intervalo, { indice: (indice + passo) % textos.length, letras: 0, fase: "digitando" });
    return () => clearTimeout(id);
  }, [estado, pausado, textos, inicio, passo, velocidade, espera, intervalo]);

  return {
    texto: textos[estado.indice].slice(0, estado.letras),
    indice: estado.indice,
    pronto: estado.fase === "pronto",
    visivel: estado.fase === "digitando" || estado.fase === "pronto",
  };
}

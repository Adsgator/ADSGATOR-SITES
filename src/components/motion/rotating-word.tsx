"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { useMotionPaused } from "@/components/motion/motion-scope";

/**
 * Palavra que troca de tempos em tempos, com as letras surgindo do desfoque
 * (classe `char-in` no globals.css; com "reduzir animações", as letras só
 * esmaecem). Leitores de tela ouvem só a primeira palavra. Para com o mouse
 * em cima, com a aba escondida e pelo botão de pausa do MotionScope.
 */
export function RotatingWord({
  words,
  interval = 3000,
}: {
  words: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const hover = useRef(false);
  const pausado = useMotionPaused();

  useEffect(() => {
    if (pausado) return;
    const id = window.setInterval(() => {
      if (hover.current || document.hidden) return;
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [pausado, words.length, interval]);

  const word = words[index];
  // Cada parte fica inteira (sem quebra no meio); a linha pode quebrar entre
  // as partes, para caber no celular. `inicio` mantém a cascata das letras.
  const partes = word
    .split(" ")
    .reduce<{ parte: string; inicio: number }[]>((lista, parte) => {
      const anterior = lista.at(-1);
      const inicio = anterior ? anterior.inicio + anterior.parte.length + 1 : 0;
      return [...lista, { parte, inicio }];
    }, []);

  return (
    <span
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
    >
      <span className="sr-only">{words[0]}</span>
      {/* A chave nova reinicia a animação das letras a cada troca. */}
      <span key={word} aria-hidden="true">
        {partes.map(({ parte, inicio }, p) => (
          <Fragment key={p}>
            {p > 0 && " "}
            <span className="inline-block whitespace-nowrap">
              {[...parte].map((char, i) => (
                <span
                  key={i}
                  className="char-in"
                  style={
                    { "--char-delay": `${(inicio + i) * 30}ms` } as React.CSSProperties
                  }
                >
                  {char}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  );
}

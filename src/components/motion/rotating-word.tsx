"use client";

import { Fragment, useEffect, useRef, useState } from "react";

/**
 * Palavra que troca de tempos em tempos, com as letras surgindo do desfoque
 * (classe `char-in` no globals.css). Leitores de tela ouvem só a primeira
 * palavra. Para com o mouse em cima, com a aba escondida e com "reduzir
 * animações".
 */
export function RotatingWord({
  words,
  interval = 3000,
}: {
  words: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const id = window.setInterval(() => {
      if (paused.current || document.hidden || reduce.matches) return;
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

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
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
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

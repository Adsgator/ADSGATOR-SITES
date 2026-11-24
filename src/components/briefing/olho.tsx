"use client";

import { useEffect, useRef, useState } from "react";

// O olho no topo do briefing (ideia do Lucas, 2026-11-24): discreto, só um traço. A
// pupila segue o que está sendo escrito (e o mouse, no computador), pisca a cada
// resposta e, no toque, mostra como está ficando.

/** Quanto a pupila anda, nas unidades do desenho. */
const ALCANCE = { x: 3.4, y: 1.8 };

export function Olho({ feitas, aoAbrir }: { feitas: number; aoAbrir: () => void }) {
  const botao = useRef<HTMLButtonElement>(null);
  const pupila = useRef<SVGCircleElement>(null);
  const [piscada, setPiscada] = useState(0);
  const [antes, setAntes] = useState(feitas);
  if (feitas !== antes) {
    setAntes(feitas);
    setPiscada(piscada + 1);
  }

  useEffect(() => {
    const olhar = (x: number, y: number) => {
      const caixa = botao.current?.getBoundingClientRect();
      if (!caixa || !pupila.current) return;
      const dx = x - (caixa.left + caixa.width / 2);
      const dy = y - (caixa.top + caixa.height / 2);
      const longe = Math.hypot(dx, dy) || 1;
      pupila.current.style.transform = `translate(${(dx / longe) * ALCANCE.x}px, ${(dy / longe) * ALCANCE.y}px)`;
    };
    const aoMover = (e: PointerEvent) => olhar(e.clientX, e.clientY);
    // Escrevendo, acompanha o fim do texto, da esquerda para a direita.
    const aoEscrever = (e: Event) => {
      const campo = e.target;
      if (!(campo instanceof HTMLInputElement || campo instanceof HTMLTextAreaElement)) return;
      const caixa = campo.getBoundingClientRect();
      const porLinha = Math.max(1, Math.floor((caixa.width - 32) / 8));
      const fim = campo.type === "textarea" || campo.type === "text" ? campo.selectionStart : null;
      olhar(caixa.left + 16 + ((fim ?? campo.value.length) % porLinha) * 8, caixa.top + caixa.height / 2);
    };
    window.addEventListener("pointermove", aoMover);
    window.addEventListener("pointerdown", aoMover);
    document.addEventListener("input", aoEscrever);
    return () => {
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerdown", aoMover);
      document.removeEventListener("input", aoEscrever);
    };
  }, []);

  return (
    <button
      ref={botao}
      type="button"
      onClick={aoAbrir}
      aria-label="Ver como está ficando"
      title="Ver como está ficando"
      className="-mr-2.5 flex size-11 items-center justify-center rounded-full text-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
      data-olho
    >
      <svg viewBox="0 0 28 20" className="w-[1.6rem] overflow-visible" fill="none" aria-hidden="true">
        {/* A piscada a cada resposta; a chave nova recomeça a animação. */}
        <g key={piscada} className={piscada ? "olho-pisca" : "olho-parado"}>
          <path
            d="M1.5 10C5.5 4 9.4 1.6 14 1.6S22.500 4 26.5 10C22.5 16 18.6 18.4 14 18.4S5.500 16 1.5 10Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle ref={pupila} cx="14" cy="10" r="3.6" className="olho-pupila fill-brand stroke-current" strokeWidth="1.6" />
        </g>
      </svg>
    </button>
  );
}

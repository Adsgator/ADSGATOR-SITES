"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

// O olho no topo do briefing (ideia do Lucas, 2026-11-24): acompanha o preenchimento
// e, no toque, mostra como está ficando. A pupila segue o que está sendo escrito (e o
// mouse, no computador), pisca a cada resposta e olha para cima quando termina uma.

/** Quanto a pupila anda, nas unidades do desenho. */
const ALCANCE = { x: 6, y: 3.2 };

export function Olho({
  feitas,
  convidar,
  aoAbrir,
}: {
  feitas: number;
  /** Mostra o balão que explica para que serve, até a primeira vez que a pessoa abre (no
   * computador não precisa, o desenho já fica ao lado). */
  convidar: boolean;
  aoAbrir: () => void;
}) {
  const botao = useRef<HTMLButtonElement>(null);
  const pupila = useRef<SVGGElement>(null);
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
    // Escrevendo, acompanha o fim do texto, da esquerda para a direita, linha por linha.
    const aoEscrever = (e: Event) => {
      const campo = e.target;
      if (!(campo instanceof HTMLInputElement || campo instanceof HTMLTextAreaElement)) return;
      const caixa = campo.getBoundingClientRect();
      const porLinha = Math.max(1, Math.floor((caixa.width - 32) / 8));
      const posicao = (campo.selectionStart ?? campo.value.length) % porLinha;
      olhar(caixa.left + 16 + posicao * 8, caixa.top + caixa.height / 2);
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
    <div className="relative">
      <button
        ref={botao}
        type="button"
        onClick={aoAbrir}
        aria-label="Ver como está ficando"
        className="group flex h-11 items-center gap-2 rounded-full border border-input bg-card pr-1.5 pl-1.5 text-sm font-medium outline-none transition-colors hover:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 sm:pl-4"
        data-olho
      >
        <span className="hidden sm:inline">Como está ficando</span>
        <span className="flex size-8 items-center justify-center rounded-full bg-ink">
          <svg viewBox="0 0 48 32" className="w-6 overflow-visible" aria-hidden="true">
            {/* A piscada a cada resposta; a chave nova recomeça a animação. */}
            <g key={piscada} className={piscada ? "olho-pisca" : "olho-parado"}>
              <path d="M2 16C9 5 16 1.5 24 1.5S39 5 46 16C39 27 32 30.5 24 30.5S9 27 2 16Z" fill="#f1f1f1" />
              <g ref={pupila} className="olho-pupila">
                <circle cx="24" cy="16" r="10.5" fill="#ffb100" />
                <circle cx="24" cy="16" r="5.2" fill="#1f271b" />
                <circle cx="27" cy="12.6" r="2" fill="#fff" />
              </g>
            </g>
          </svg>
        </span>
      </button>
      {convidar && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="pointer-events-none absolute top-[calc(100%+1.6rem)] right-0 w-max lg:hidden rounded-xl rounded-tr-sm bg-ink px-3.5 py-2 text-xs font-medium text-paper shadow-lg"
          data-convite-do-olho
        >
          Toque para ver como está ficando
        </motion.p>
      )}
    </div>
  );
}

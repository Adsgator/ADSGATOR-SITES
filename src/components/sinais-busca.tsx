"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

// "Sinais de busca", o fundo da hero (pedido do Lucas, 2026-11-20: algo que
// remeta ao serviço, com movimento que para). Um mapa de cidade apagado; pontos
// acendem pelo mapa, cada um uma pessoa procurando, e uma linha amarela corre
// de cada ponto até o celular do topo (o negócio). Quando todas chegam, o
// centro pulsa uma vez e tudo para. O desenho termina no topo do celular, e o
// celular (tela pequena) tem o seu próprio desenho. Posições fixas, iguais no
// servidor e no navegador. Com "reduzir animações", as linhas e os pontos só
// aparecem, sem os pulsos.

type Mapa = {
  largura: number;
  altura: number;
  quantidade: number;
  /** Área do título e dos botões, sem pontos. */
  livre: { x0: number; x1: number; y0: number; y1: number };
  /** Faixa onde um rótulo cabe inteiro. */
  rotuloX: [number, number];
  distanciaRotulo: number;
};

const COMPUTADOR: Mapa = {
  largura: 1200,
  altura: 700,
  quantidade: 70,
  livre: { x0: 290, x1: 910, y0: 60, y1: 560 },
  rotuloX: [120, 960],
  distanciaRotulo: 260,
};

const CELULAR: Mapa = {
  largura: 400,
  altura: 820,
  quantidade: 60,
  livre: { x0: 34, x1: 366, y0: 70, y1: 640 },
  rotuloX: [40, 250],
  distanciaRotulo: 200,
};

const rotulos = ["dentista", "eletricista", "advogado", "pet shop", "nutricionista", "chaveiro", "estética"];

// Ruas desenhadas para 1200 x 700 e esticadas para cada mapa.
const ruas = [
  "M0 110 C 220 130 380 80 620 120 S 1000 160 1200 100",
  "M0 290 C 260 270 420 330 700 290 S 1040 240 1200 280",
  "M0 500 C 200 480 460 540 760 500 S 1060 460 1200 520",
  "M140 0 C 160 200 110 420 170 700",
  "M420 0 C 400 180 470 380 430 700",
  "M820 0 C 850 220 790 430 840 700",
  "M1060 0 C 1040 240 1100 470 1050 700",
  "M0 640 C 300 620 900 670 1200 630",
];

function montar(m: Mapa) {
  const centro = { x: m.largura / 2, y: m.altura };
  const pontos = Array.from({ length: m.quantidade }, (_, i) => {
    // Espalhados pelo ângulo de ouro, um pouco para cima do centro.
    const angulo = i * 2.39996;
    const raio = 0.2 + ((i * 53) % 100) / 125;
    const x = Math.round(m.largura / 2 + Math.cos(angulo) * raio * m.largura * 0.55);
    const y = Math.round(m.altura * 0.42 + Math.sin(angulo) * raio * m.altura * 0.48);
    return { x: Math.min(m.largura - 20, Math.max(20, x)), y: Math.min(m.altura - 80, Math.max(30, y)), i };
  }).filter(
    (p) =>
      !(p.x > m.livre.x0 && p.x < m.livre.x1 && p.y > m.livre.y0 && p.y < m.livre.y1) &&
      Math.hypot(p.x - centro.x, p.y - centro.y) > m.altura * 0.18,
  );
  const rotulados = new Map<number, string>();
  for (const p of pontos) {
    const longe = [...rotulados.keys()].every((i) => {
      const o = pontos.find((q) => q.i === i)!;
      return Math.hypot(o.x - p.x, o.y - p.y) > m.distanciaRotulo;
    });
    if (p.x > m.rotuloX[0] && p.x < m.rotuloX[1] && longe) rotulados.set(p.i, rotulos[rotulados.size % rotulos.length]);
  }
  return { centro, pontos, rotulados };
}

function Desenho({ m, className }: { m: Mapa; className: string }) {
  const { centro, pontos, rotulados } = montar(m);
  const curva = ({ x, y }: { x: number; y: number }) => {
    const meioX = (x + centro.x) / 2 + (y - centro.y) * 0.2;
    const meioY = (y + centro.y) / 2 - (x - centro.x) * 0.1;
    return `M${x} ${y} Q ${meioX} ${meioY} ${centro.x} ${centro.y}`;
  };
  const passo = 3.2 / pontos.length;
  const fim = 0.4 + pontos.length * passo + 1.1;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${m.largura} ${m.altura}`}
      preserveAspectRatio="xMidYMax slice"
      className={cn("pointer-events-none absolute inset-0 size-full text-foreground", className)}
    >
      {/* As ruas somem aos poucos no fim do mapa, sem corte reto. */}
      <defs>
        <linearGradient id={`some-${m.largura}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.7" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id={`ruas-${m.largura}`}>
          <rect width={m.largura} height={m.altura} fill={`url(#some-${m.largura})`} />
        </mask>
      </defs>
      <g mask={`url(#ruas-${m.largura})`}>
      <g transform={`scale(${m.largura / 1200} ${m.altura / 700})`} fill="none" stroke="currentColor">
        {ruas.map((d) => (
          <path key={d} d={d} strokeOpacity="0.07" strokeWidth="14" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        ))}
        {ruas.map((d) => (
          <path key={`${d}-faixa`} d={d} strokeOpacity="0.1" strokeWidth="1" strokeDasharray="2 10" vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      </g>
      {pontos.map((p, n) => (
        <motion.path
          key={p.i}
          d={curva(p)}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="1.5"
          strokeOpacity="0.55"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.4 + n * passo + 0.25, duration: 1, ease: "easeInOut" }}
        />
      ))}
      {/* Véu da cor do fundo atrás do título e dos botões: as linhas passam
          por baixo e reaparecem perto do celular; os pontos ficam por cima. */}
      <defs>
        <radialGradient id={`veu-${m.largura}`} cx="50%" cy="44%" r="52%">
          <stop offset="0%" stopColor="var(--background)" stopOpacity="0.92" />
          <stop offset="70%" stopColor="var(--background)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--background)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={m.largura} height={m.altura} fill={`url(#veu-${m.largura})`} />
      {pontos.map((p, n) => {
        const atraso = 0.4 + n * passo;
        const rotulo = rotulados.get(p.i);
        return (
          <g key={p.i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="16"
              fill="var(--brand)"
              className="motion-reduce:hidden"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: [0, 1.6], opacity: [0.5, 0] }}
              transition={{ delay: atraso, duration: 1.1, ease: "easeOut" }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            />
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="var(--brand)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: atraso, duration: 0.3 }}
            />
            {rotulo && (
              <motion.text
                x={p.x + 10}
                y={p.y - 10}
                className="fill-muted-foreground font-mono text-[15px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0.5] }}
                transition={{ delay: atraso, duration: 2.6, times: [0, 0.15, 0.7, 1] }}
              >
                {rotulo}
              </motion.text>
            )}
          </g>
        );
      })}
      <motion.circle
        cx={centro.x}
        cy={centro.y}
        r="60"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2"
        className="motion-reduce:hidden"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: [0.3, 2.2], opacity: [0.8, 0] }}
        transition={{ delay: fim, duration: 1.4, ease: "easeOut" }}
        style={{ transformOrigin: `${centro.x}px ${centro.y}px` }}
      />
    </svg>
  );
}

/** Os dois desenhos: o do computador e o do celular. A caixa onde entra deve
 * terminar no topo do celular da hero, para onde as linhas convergem. */
export function SinaisBusca({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute", className)}>
      <Desenho m={COMPUTADOR} className="hidden sm:block" />
      <Desenho m={CELULAR} className="sm:hidden" />
    </div>
  );
}

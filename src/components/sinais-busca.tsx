"use client";

import { motion } from "motion/react";

// "Sinais de busca", o fundo da hero (pedido do Lucas, 2026-11-20: algo que
// remeta ao serviço, com movimento que para). Um mapa de cidade apagado; pontos
// acendem pelo mapa, cada um uma pessoa procurando, e uma linha amarela corre
// de cada ponto até o celular do topo (o negócio). Quando todas chegam, o
// centro pulsa uma vez e tudo para. Posições fixas (iguais no servidor e no
// navegador). Com "reduzir animações", aparece pronto, só esmaecendo.

const LARGURA = 1200;
const ALTURA = 760;
const CENTRO = { x: 600, y: 690 };

const ruas = [
  "M0 120 C 220 140 380 90 620 130 S 1000 170 1200 110",
  "M0 300 C 260 280 420 340 700 300 S 1040 250 1200 290",
  "M0 520 C 200 500 460 560 760 520 S 1060 480 1200 540",
  "M140 0 C 160 200 110 420 170 760",
  "M420 0 C 400 180 470 380 430 760",
  "M820 0 C 850 220 790 430 840 760",
  "M1060 0 C 1040 240 1100 470 1050 760",
  "M0 660 C 300 640 900 700 1200 650",
];

const rotulos = ["dentista", "eletricista", "advogado", "pet shop", "nutricionista", "chaveiro"];

// Pontos espalhados pelo ângulo de ouro, longe do centro de chegada.
const pontos = Array.from({ length: 64 }, (_, i) => {
  const angulo = i * 2.39996;
  const raio = 0.25 + ((i * 53) % 100) / 135;
  const x = Math.round(600 + Math.cos(angulo) * raio * 620);
  const y = Math.round(330 + Math.sin(angulo) * raio * 330);
  return { x: Math.min(1160, Math.max(40, x)), y: Math.min(620, Math.max(40, y)), i };
})
  // Longe do celular e fora da área do título e dos botões: as linhas chegam
  // pelas laterais, sem cruzar o texto.
  .filter((p) => Math.hypot(p.x - CENTRO.x, p.y - CENTRO.y) > 170)
  .filter((p) => !(p.x > 300 && p.x < 900 && p.y > 90 && p.y < 600));

// Rótulos só nos pontos sem outro rótulo por perto e longe da borda.
const rotulados = new Map<number, string>();
for (const p of pontos) {
  const livre = [...rotulados.keys()].every((i) => {
    const o = pontos.find((q) => q.i === i)!;
    return Math.hypot(o.x - p.x, o.y - p.y) > 240;
  });
  if (p.x > 250 && p.x < 900 && livre) rotulados.set(p.i, rotulos[rotulados.size % rotulos.length]);
}

function caminho({ x, y }: { x: number; y: number }) {
  const meioX = (x + CENTRO.x) / 2 + (y - CENTRO.y) * 0.25;
  const meioY = (y + CENTRO.y) / 2 - (x - CENTRO.x) * 0.12;
  return `M${x} ${y} Q ${meioX} ${meioY} ${CENTRO.x} ${CENTRO.y}`;
}

export function SinaisBusca({ className }: { className?: string }) {
  const fim = 0.4 + pontos.length * 0.14 + 1.1;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      preserveAspectRatio="xMidYMax slice"
      className={`pointer-events-none absolute inset-0 size-full text-foreground ${className ?? ""}`}
    >
      <defs>
        <radialGradient id="sinais-vinheta" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="var(--background)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--background)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g fill="none" stroke="currentColor" strokeOpacity="0.07" strokeWidth="14" strokeLinecap="round">
        {ruas.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="none" stroke="currentColor" strokeOpacity="0.09" strokeWidth="1" strokeDasharray="2 10">
        {ruas.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {pontos.map((p, n) => {
        const atraso = 0.4 + n * 0.14;
        const rotulo = rotulados.get(p.i) ?? null;
        return (
          <g key={p.i}>
            <motion.path
              d={caminho(p)}
              fill="none"
              stroke="var(--brand)"
              strokeWidth="1.5"
              strokeOpacity="0.55"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: atraso + 0.25, duration: 0.9, ease: "easeInOut" }}
            />
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="16"
              fill="var(--brand)"
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
                animate={{ opacity: [0, 1, 1, 0.55] }}
                transition={{ delay: atraso, duration: 2.4, times: [0, 0.15, 0.7, 1] }}
              >
                {rotulo}
              </motion.text>
            )}
          </g>
        );
      })}
      <rect width={LARGURA} height={ALTURA} fill="url(#sinais-vinheta)" />
      <motion.circle
        cx={CENTRO.x}
        cy={CENTRO.y}
        r="60"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: [0.3, 2.2], opacity: [0.8, 0] }}
        transition={{ delay: fim, duration: 1.4, ease: "easeOut" }}
        style={{ transformOrigin: `${CENTRO.x}px ${CENTRO.y}px` }}
      />
    </svg>
  );
}

"use client";

import { SearchIcon } from "lucide-react";
import { motion } from "motion/react";

import { useDigitacao } from "@/components/motion/use-digitacao";
import { cn } from "@/lib/utils";

// Fundo da hero (pedidos do Lucas, 2026-11-20): um mapa de bairro bem simples,
// no espírito do Google Maps (ruas orgânicas e poucas casas, só para
// representar, sem nomes), e buscas aparecendo aos poucos pela cidade, uma ou
// duas por vez. Em cada ponto, a lupa balança de leve "procurando", a busca é
// digitada, fica um instante e some; depois de uma pausa, aquele ponto volta
// em outro lugar. Para no botão de pausar da hero. Posições fixas, iguais no
// servidor e no navegador. Vale também com "reduzir animações" (decisão do
// Lucas, 2026-11-20).

const LARGURA = 1400;
const ALTURA = 800;

/** Número pseudoaleatório fixo para cada semente, só com contas de inteiros
 * (o `Math.sin` dava casas decimais diferentes no servidor e no Chrome). */
const sorte = (n: number) => {
  let t = Math.imul(n | 0, 2654435761) >>> 0;
  t = Math.imul(t ^ (t >>> 15), 2246822519) >>> 0;
  t = (t ^ (t >>> 13)) >>> 0;
  return t / 4294967296;
};
const arredondar = (v: number) => Math.round(v * 10) / 10;

const ruas = [
  "M-40 130 C 260 150 440 90 720 140 S 1160 190 1440 120",
  "M-40 340 C 300 310 480 380 800 340 S 1200 280 1440 330",
  "M-40 580 C 230 555 520 620 870 575 S 1240 530 1440 600",
  "M160 -40 C 185 220 125 480 195 840",
  "M490 -40 C 465 210 545 440 500 840",
  "M940 -40 C 975 250 905 490 960 840",
  "M1230 -40 C 1205 270 1270 540 1215 840",
];
const avenida = "M-60 760 C 300 700 620 520 860 470 S 1260 330 1460 250";

// Poucas casas espalhadas: menos é mais, só para o mapa ser reconhecível.
const casas = Array.from({ length: 200 }, (_, n) => ({
  x: arredondar((n % 20) * 72 + sorte(n * 7) * 30),
  y: arredondar(Math.floor(n / 20) * 82 + sorte(n * 13) * 30),
  w: arredondar(16 + sorte(n * 31) * 22),
  h: arredondar(12 + sorte(n * 57) * 16),
  usar: sorte(n * 91) < 0.3,
})).filter((c) => c.usar);

function MapaCidade() {
  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full text-foreground"
    >
      {casas.map((c, n) => (
        <rect key={n} x={c.x} y={c.y} width={c.w} height={c.h} rx="2" className="fill-foreground/[0.06] stroke-foreground/[0.07]" />
      ))}
      <g fill="none" strokeLinecap="round">
        {ruas.map((d) => (
          <path key={d} d={d} className="stroke-foreground/[0.1]" strokeWidth="18" />
        ))}
        <path d={avenida} className="stroke-foreground/[0.12]" strokeWidth="28" />
        {ruas.map((d) => (
          <path key={`${d}-meio`} d={d} className="stroke-background" strokeWidth="1.5" strokeDasharray="3 12" />
        ))}
      </g>
    </svg>
  );
}

const buscas = [
  "dentista perto de mim",
  "advogado trabalhista",
  "eletricista em campinas",
  "banho e tosa perto de mim",
  "nutricionista em valinhos",
  "chaveiro 24 horas",
  "conserto de ar-condicionado",
  "contador para mei",
  "clínica de estética",
];

type Lugar = { x: number; y: number };

// Onde as buscas aparecem (em % da caixa), fora da área do título e dos botões.
const pontosComputador: Lugar[][] = [
  [{ x: 10, y: 24 }, { x: 18, y: 70 }, { x: 7, y: 47 }],
  [{ x: 86, y: 20 }, { x: 80, y: 64 }, { x: 91, y: 42 }],
  [{ x: 24, y: 88 }, { x: 14, y: 9 }, { x: 72, y: 90 }],
  [{ x: 88, y: 84 }, { x: 84, y: 7 }, { x: 6, y: 82 }],
];
// No celular, todos à esquerda, com o balão abrindo para a direita (não sai da
// tela); uma busca fica na faixa de cima e a outra na de baixo, sem se cobrirem.
const pontosCelular: Lugar[][] = [
  [{ x: 4, y: 3 }, { x: 18, y: 1 }, { x: 10, y: 6 }],
  [{ x: 5, y: 92 }, { x: 16, y: 97 }, { x: 4, y: 88 }],
];

function Busca({ pontos, n }: { pontos: Lugar[]; n: number }) {
  // Cada ponto tem o seu ritmo e uma pausa escondida longa: na tela ficam uma
  // ou duas buscas por vez, aparecendo intercaladas.
  const { texto, indice, fase } = useDigitacao(buscas, {
    inicio: 600 + n * 2600,
    deslocamento: n * 2,
    passo: 2,
    velocidade: 55,
    espera: 2300,
    intervalo: 1500 + (n % 2) * 400,
    pausa: 5200 + ((n * 1700) % 3500),
  });
  // Em que volta está (a busca anda de 2 em 2 entre 9; 5 desfaz o "vezes 2"
  // em módulo 9), para cada volta aparecer num lugar diferente.
  const volta = (((indice - ((n * 2) % buscas.length) + buscas.length) % buscas.length) * 5) % buscas.length;
  const lugar = pontos[volta % pontos.length];
  const aDireita = lugar.x > 55;
  const visivel = fase === "procurando" || fase === "digitando" || fase === "pronto";
  const procurando = fase === "procurando";
  const escrevendo = fase === "digitando" || fase === "pronto";

  return (
    <motion.div
      style={{ left: `${lugar.x}%`, top: `${lugar.y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visivel ? 1 : 0, scale: visivel ? 1 : 0.9 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn("absolute flex items-center gap-2", aDireita ? "-translate-x-full flex-row-reverse" : "")}
    >
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-card shadow-[0_8px_24px_-10px_rgb(31_39_27/0.45)] ring-1 ring-border">
        {procurando && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-brand"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <motion.span
          animate={procurando ? { rotate: [-9, 9, -9], x: [-1, 1, -1] } : { rotate: 0, x: 0 }}
          transition={procurando ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
          className="relative"
        >
          <SearchIcon className={cn("size-4 transition-colors", procurando ? "text-brand" : "text-foreground")} />
        </motion.span>
      </span>
      <motion.span
        animate={{ opacity: escrevendo ? 1 : 0, x: escrevendo ? 0 : aDireita ? 8 : -8 }}
        transition={{ duration: 0.3 }}
        className="flex max-w-[55vw] items-center gap-2 rounded-full bg-card px-4 py-2 text-sm whitespace-nowrap shadow-[0_8px_24px_-10px_rgb(31_39_27/0.45)] ring-1 ring-border sm:max-w-none"
      >
        <span className="truncate">{texto}</span>
        {fase === "pronto" ? (
          <span className="font-mono text-[0.65rem] text-brand">agora</span>
        ) : (
          <span className="-ml-1.5 h-4 w-px animate-pulse bg-foreground" />
        )}
      </motion.span>
    </motion.div>
  );
}

/** O mapa com as buscas. A caixa onde entra termina no topo do celular da hero. */
export function MapaBuscas({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute", className)}>
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_65%,transparent)]">
        <MapaCidade />
        {/* Véu atrás do título e dos botões, para a leitura ficar limpa. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_42%_46%_at_50%_48%,var(--background)_45%,transparent)]" />
      </div>
      <div className="absolute inset-0 hidden sm:block">
        {pontosComputador.map((pontos, n) => (
          <Busca key={n} pontos={pontos} n={n} />
        ))}
      </div>
      <div className="absolute inset-0 sm:hidden">
        {pontosCelular.map((pontos, n) => (
          <Busca key={n} pontos={pontos} n={n} />
        ))}
      </div>
    </div>
  );
}

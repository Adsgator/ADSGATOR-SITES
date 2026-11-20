"use client";

import { SearchIcon } from "lucide-react";
import { motion } from "motion/react";

import { useDigitacao } from "@/components/motion/use-digitacao";
import { cn } from "@/lib/utils";

// Fundo da hero (pedido do Lucas, 2026-11-20, com o print do Google Maps): um
// mapa de bairro no estilo do Google Maps, apagado, e buscas aparecendo em
// pontos da cidade. Em cada ponto, a lupa fica "procurando" (pulsa e mexe de
// leve), a busca é digitada, fica um instante e some; a próxima aparece em
// outro lugar. Para no botão de pausar da hero. Mapa com posições fixas
// (iguais no servidor e no navegador). Com "reduzir animações", a lupa só
// esmaece, sem pulsar nem mexer.

const LARGURA = 1400;
const ALTURA = 800;
const PASSO_X = 190;
const PASSO_Y = 150;
const RUA = 22;

/** Número pseudoaleatório fixo para cada semente (o mapa sai sempre igual).
 * Só contas com inteiros: o `Math.sin` dava casas decimais diferentes no
 * servidor e no Chrome, e o React acusava a diferença. */
const sorte = (n: number) => {
  let t = Math.imul(n | 0, 2654435761) >>> 0;
  t = Math.imul(t ^ (t >>> 15), 2246822519) >>> 0;
  t = (t ^ (t >>> 13)) >>> 0;
  return t / 4294967296;
};
const arredondar = (v: number) => Math.round(v * 10) / 10;

const nomesRuas = ["R. das Palmeiras", "Av. Brasil", "R. São José", "R. dos Ipês", "Av. das Américas", "R. Sete de Setembro"];
const lugares = [
  { x: 2, y: 1, nome: "Clínica" },
  { x: 5, y: 3, nome: "Pet shop" },
  { x: 7, y: 0, nome: "Escritório" },
  { x: 1, y: 4, nome: "Padaria" },
];

function montarMapa() {
  const quarteiroes: { x: number; y: number; casas: { x: number; y: number; w: number; h: number }[]; destaque: boolean }[] = [];
  for (let i = -3; i < 10; i++) {
    for (let j = -3; j < 8; j++) {
      const x = i * PASSO_X + RUA / 2;
      const y = j * PASSO_Y + RUA / 2;
      const w = PASSO_X - RUA;
      const h = PASSO_Y - RUA;
      const casas: { x: number; y: number; w: number; h: number }[] = [];
      // Duas fileiras de casas, de larguras variadas, como nos lotes do mapa.
      for (const [linha, topo] of [[0, 6], [1, h / 2 + 3]] as const) {
        let cx = 6;
        let k = 0;
        while (cx < w - 18) {
          const largura = arredondar(Math.min(w - 6 - cx, 22 + sorte(i * 97 + j * 31 + linha * 7 + k) * 30));
          const altura = arredondar(h / 2 - 12 - sorte(i * 13 + j * 71 + k + linha) * 14);
          casas.push({ x: x + cx, y: y + topo + (linha ? 0 : h / 2 - 12 - altura), w: largura, h: altura });
          cx += largura + 4;
          k++;
        }
      }
      quarteiroes.push({ x, y, casas, destaque: lugares.some((l) => l.x === i && l.y === j) });
    }
  }
  return quarteiroes;
}

const quarteiroes = montarMapa();

function MapaCidade() {
  const ruasV = Array.from({ length: 13 }, (_, n) => (n - 3) * PASSO_X);
  const ruasH = Array.from({ length: 11 }, (_, n) => (n - 3) * PASSO_Y);
  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full text-foreground"
    >
      <g transform={`rotate(-22 ${LARGURA / 2} ${ALTURA / 2})`}>
        {quarteiroes.map((q) => (
          <g key={`${q.x}-${q.y}`}>
            {q.destaque && (
              <rect x={q.x + 4} y={q.y + 4} width={PASSO_X - RUA - 8} height={PASSO_Y - RUA - 8} rx="4" className="fill-brand/15" />
            )}
            {q.casas.map((c, n) => (
              <rect
                key={n}
                x={c.x}
                y={c.y}
                width={c.w}
                height={c.h}
                rx="2"
                className="fill-foreground/[0.06] stroke-foreground/[0.08]"
                strokeWidth="1"
              />
            ))}
          </g>
        ))}
        <g className="stroke-foreground/[0.12]" strokeWidth={RUA}>
          {ruasV.map((x) => (
            <line key={`v${x}`} x1={x} y1={-500} x2={x} y2={1300} />
          ))}
          {ruasH.map((y) => (
            <line key={`h${y}`} x1={-500} y1={y} x2={1900} y2={y} />
          ))}
        </g>
        <path
          d="M-300 980 C 200 760 600 820 900 600 S 1500 300 1900 260"
          fill="none"
          className="stroke-foreground/[0.14]"
          strokeWidth={RUA * 1.6}
        />
        {nomesRuas.map((nome, n) => (
          <text
            key={nome}
            x={(n % 3) * 420 + 160}
            y={Math.floor(n / 3) * 3 * PASSO_Y + 4}
            className="fill-background font-sans text-[13px] font-medium"
            dominantBaseline="middle"
          >
            {nome}
          </text>
        ))}
        {lugares.map((l) => (
          <g key={l.nome} transform={`translate(${l.x * PASSO_X + PASSO_X / 2} ${l.y * PASSO_Y + PASSO_Y / 2})`}>
            <circle r="11" className="fill-brand" />
            <text x="18" className="fill-muted-foreground text-[13px] font-medium" dominantBaseline="middle">
              {l.nome}
            </text>
          </g>
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
  const { texto, indice, fase } = useDigitacao(buscas, {
    inicio: 500 + n * 1300,
    deslocamento: n * 2,
    passo: 2,
    velocidade: 50,
    espera: 2200,
    intervalo: 1600,
  });
  // Em que volta está (a busca anda de 2 em 2 entre 9; 5 desfaz o "vezes 2"
  // em módulo 9), para cada volta aparecer num lugar diferente.
  const volta = (((indice - ((n * 2) % buscas.length) + buscas.length) % buscas.length) * 5) % buscas.length;
  const lugar = pontos[volta % pontos.length];
  const aDireita = lugar.x > 55;
  const visivel = fase !== "parado" && fase !== "saindo";
  const procurando = fase === "procurando";
  const escrevendo = fase === "digitando" || fase === "pronto";

  return (
    <motion.div
      style={{ left: `${lugar.x}%`, top: `${lugar.y}%` }}
      animate={{ opacity: visivel ? 1 : 0 }}
      transition={{ duration: 0.35 }}
      className={cn("absolute flex items-center gap-2", aDireita ? "-translate-x-full flex-row-reverse" : "")}
    >
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-card shadow-[0_8px_24px_-10px_rgb(31_39_27/0.45)] ring-1 ring-border">
        {procurando && (
          <motion.span
            className="absolute inset-0 rounded-full bg-brand motion-reduce:hidden"
            initial={{ scale: 1, opacity: 0.45 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <motion.span
          animate={procurando ? { x: [0, 2.5, 0, -2.5, 0], y: [0, -2.5, 0, 2.5, 0] } : { x: 0, y: 0 }}
          transition={procurando ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
          className="relative motion-reduce:transform-none!"
        >
          <SearchIcon className={cn("size-4", procurando ? "text-brand" : "text-foreground")} />
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

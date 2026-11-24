"use client";

import { createElement } from "react";
import { motion, type TargetAndTransition, type Transition } from "motion/react";

import type { Familia, Tema } from "@/lib/briefing/temas";
import { cn } from "@/lib/utils";

// O efeito de cada sensação no topo da página. A sensação diz o comportamento (pular,
// flutuar, correr, emoldurar) e a família do estilo diz a forma e o jeito de se mexer:
// a alegria de um estilo feito à mão não é a mesma de um minimalista.

const repete = (duracao: number, atraso = 0): Transition => ({ duration: duracao, repeat: Infinity, ease: "easeInOut", delay: atraso });

/** Uma forma solta, na linguagem da família. */
function Forma({ familia, i, cor }: { familia: Familia; i: number; cor: string }) {
  switch (familia) {
    case "geometrica":
      return i % 3 === 0 ? (
        <span className="block size-full" style={{ background: cor }} />
      ) : i % 3 === 1 ? (
        <span className="block h-[22%] w-full" style={{ background: cor }} />
      ) : (
        <span className="block size-full rounded-tl-full" style={{ background: cor }} />
      );
    case "organica":
      return <span className="block size-full" style={{ background: cor, borderRadius: i % 2 ? "0 85% 0 85%" : "85% 0 85% 0" }} />;
    case "classica":
      return (
        <svg viewBox="0 0 24 24" className="size-full" fill={cor}>
          <path d="M12 0C12.700 7.500 16.500 11.300 24 12C16.500 12.700 12.700 16.500 12 24C11.300 16.500 7.500 12.700 0 12C7.500 11.300 11.300 7.500 12 0Z" />
        </svg>
      );
    case "artesanal":
      return i % 2 ? (
        <svg viewBox="0 0 24 24" className="size-full" stroke={cor} strokeWidth="3.4" strokeLinecap="round" fill="none">
          <path d="M5 5L19 19M19 5L5 19" />
        </svg>
      ) : (
        <span className="block size-full rounded-full border-2 border-dashed" style={{ borderColor: cor }} />
      );
    case "ludica":
      return i % 3 === 0 ? (
        <span className="block size-full rounded-full" style={{ background: cor }} />
      ) : i % 3 === 1 ? (
        <svg viewBox="0 0 24 24" className="size-full" fill={cor}>
          <path d="M12 2L23 21H1Z" strokeLinejoin="round" stroke={cor} strokeWidth="2" />
        </svg>
      ) : (
        <span className="block size-full rounded-[32%]" style={{ background: cor }} />
      );
  }
}

/** Como a alegria se mexe em cada família. */
const brinca: Record<Familia, (i: number) => { animate: TargetAndTransition; transition: Transition }> = {
  geometrica: (i) => ({ animate: { rotate: [0, 0, 90, 90] }, transition: { ...repete(4.2, i * 0.5), times: [0, 0.55, 0.72, 1] } }),
  organica: (i) => ({ animate: { y: [-6, 12, -6], x: [0, 7, 0], rotate: [0, 34, 0] }, transition: repete(4.6, i * 0.4) }),
  classica: (i) => ({ animate: { scale: [0.5, 1, 0.5], opacity: [0.25, 1, 0.25] }, transition: repete(2.6, i * 0.45) }),
  artesanal: (i) => ({ animate: { rotate: [-12, 12, -12] }, transition: repete(3.2, i * 0.35) }),
  ludica: (i) => ({ animate: { y: [0, -11, 0], rotate: [0, 45, 0] }, transition: repete(1.8 + (i % 3) * 0.4, i * 0.2) }),
};

// Pelas bordas, para não disputar com o texto do meio.
const lugares = [
  { left: "4%", top: "88%" },
  { left: "92%", top: "82%" },
  { left: "88%", top: "22%" },
  { left: "52%", top: "92%" },
  { left: "27%", top: "93%" },
  { left: "95%", top: "50%" },
  { left: "73%", top: "89%" },
];

/** Quantas formas cabem: um estilo contido mostra duas, um solto mostra sete. */
const quantas = (tema: Tema) => Math.round(2 + tema.expressao * 5);

type Props = { tema: Tema; inicial?: string };

/** Misturando estilos, a forma é do que organiza e o movimento é do que solta: rústico
 * com divertido são pontos de costura que pulam, não bolinhas. */
const movimento = (t: Tema) => t.tempero ?? t.familia;

const coresDas = (t: Tema) => [t.destaque, `color-mix(in oklab, ${t.destaque} 45%, ${t.tinta})`, t.tinta];

function Alegria({ tema }: Props) {
  const { familia } = tema;
  const cores = coresDas(tema);
  return lugares.slice(0, quantas(tema)).map((l, i) => (
    <motion.span
      key={i}
      {...brinca[movimento(tema)](i)}
      className="absolute"
      style={{ ...l, width: familia === "classica" ? 13 : 9 + (i % 3) * 2, height: familia === "classica" ? 13 : 9 + (i % 3) * 2, opacity: 0.8 }}
    >
      <Forma familia={familia} i={i} cor={cores[movimento(tema) === "ludica" ? i % 3 : 0]} />
    </motion.span>
  ));
}

function Leveza({ tema }: Props) {
  const { familia } = tema;
  return lugares.slice(0, Math.max(3, quantas(tema) - 1)).map((l, i) => (
    <motion.span
      key={i}
      animate={{ y: [10, -14, 10], opacity: [0.1, 0.42, 0.1] }}
      transition={repete(6 + (i % 3), i * 0.6)}
      className="absolute"
      style={{ ...l, width: 14 + (i % 3) * 7, height: 14 + (i % 3) * 7 }}
    >
      <Forma familia={familia} i={i} cor={tema.destaque} />
    </motion.span>
  ));
}

function Energia({ tema }: Props) {
  const cor = tema.destaque;
  switch (tema.familia) {
    case "organica":
      return [0, 1].map((i) => (
        <motion.svg
          key={i}
          viewBox="0 0 400 24"
          preserveAspectRatio="none"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 3 + i * 1.2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 h-6 w-[200%]"
          style={{ bottom: 4 + i * 11, opacity: 0.5 - i * 0.2 }}
          fill="none"
          stroke={cor}
          strokeWidth="2.5"
        >
          <path d="M0 12Q25 0 50 12T100 12T150 12T200 12T250 12T300 12T350 12T400 12" vectorEffect="non-scaling-stroke" />
        </motion.svg>
      ));
    case "classica":
      return (
        <>
          {[18, 82].map((top, i) => (
            <span key={top} className="absolute inset-x-0 h-px overflow-hidden" style={{ top: `${top}%` }}>
              <motion.span
                animate={{ x: i ? ["320%", "-120%"] : ["-120%", "320%"] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
                className="block h-px w-2/5"
                style={{ background: `linear-gradient(90deg, transparent, ${cor}, transparent)` }}
              />
            </span>
          ))}
        </>
      );
    case "artesanal":
      return (
        <svg className="absolute inset-0 size-full" fill="none" stroke={cor} strokeWidth="2" strokeLinecap="round" opacity="0.6">
          {[10, 92].map((y, i) => (
            <motion.line
              key={y}
              x1="0"
              x2="100%"
              y1={`${y}%`}
              y2={`${y}%`}
              strokeDasharray="10 9"
              animate={{ strokeDashoffset: i ? [0, 76] : [0, -76] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </svg>
      );
    case "ludica":
      return (
        <div className="absolute inset-x-0 bottom-1 flex justify-around px-3">
          {Array.from({ length: 9 }, (_, i) => (
            <motion.span
              key={i}
              animate={{ scaleY: [0.35, 1, 0.35] }}
              transition={repete(0.9, i * 0.1)}
              className="h-5 w-1.5 origin-bottom rounded-full"
              style={{ background: cor, opacity: 0.45 }}
            />
          ))}
        </div>
      );
    default:
      return [0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ x: ["-120%", "620%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.65 }}
          className="absolute -top-6 h-[130%] w-6 -skew-x-[24deg]"
          style={{ background: cor, opacity: 0.15 }}
        />
      ));
  }
}

function Calma({ tema }: Props) {
  const cor = tema.apoio;
  if (tema.familia === "organica") {
    return [0, 1, 2].map((i) => (
      <motion.span
        key={i}
        animate={{ x: ["-6%", "6%", "-6%"] }}
        transition={repete(8 + i * 2)}
        className="absolute -inset-x-8 h-10 rounded-[50%]"
        style={{ bottom: -14 - i * 7, background: cor, opacity: 0.75 - i * 0.18 }}
      />
    ));
  }
  const aro = tema.familia === "artesanal";
  const reto = tema.familia === "geometrica";
  return [0, 1].map((i) => (
    <motion.span
      key={i}
      animate={reto ? { x: ["-4%", "4%", "-4%"] } : { scale: [1, 1.12, 1] }}
      transition={repete(9 + i * 2, i)}
      className={cn("absolute", reto ? "inset-x-[-10%] h-1/3" : "size-52 rounded-full", aro && "border-2 border-dashed")}
      style={{
        ...(reto ? { bottom: `${i * 22 - 12}%` } : { right: -70 + i * 150, bottom: -90 + i * 24 }),
        background: aro ? "transparent" : cor,
        borderColor: aro ? tema.destaque : undefined,
        opacity: aro ? 0.35 : 0.6 - i * 0.2,
      }}
    />
  ));
}

function Acolhimento({ tema }: Props) {
  return (
    <>
      <motion.span
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={repete(4.5)}
        className="absolute -top-10 left-1/2 size-56 -translate-x-1/2 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, color-mix(in oklab, ${tema.destaque} 55%, #ffd9a0), transparent 68%)` }}
      />
      {/* Um abraço em volta, na linguagem do estilo. */}
      <span
        className="absolute -bottom-28 left-1/2 h-40 w-[130%] -translate-x-1/2"
        style={{
          borderRadius: tema.familia === "geometrica" ? "999px 999px 0 0" : "50%",
          background: tema.apoio,
          opacity: 0.45,
        }}
      />
    </>
  );
}

function Inspiracao({ tema }: Props) {
  return (
    <>
      <motion.span
        animate={{ y: ["18%", "-6%", "18%"], opacity: [0.35, 0.75, 0.35] }}
        transition={repete(7)}
        className="absolute inset-x-0 bottom-[-40%] h-full"
        style={{ background: `radial-gradient(ellipse at 50% 100%, color-mix(in oklab, ${tema.destaque} 55%, transparent), transparent 68%)` }}
      />
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [40, -120], opacity: [0, 0.7, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeOut", delay: i * 1.5 }}
          className="absolute bottom-0 size-2.5"
          style={{ left: `${22 + i * 28}%` }}
        >
          <Forma familia={tema.familia} i={i} cor={tema.destaque} />
        </motion.span>
      ))}
    </>
  );
}

function Profissionalismo({ tema }: Props) {
  const cor = tema.tinta;
  const regua: Record<Familia, React.CSSProperties> = {
    geometrica: { height: 2, background: tema.destaque },
    organica: { height: 3, background: tema.destaque, borderRadius: 99 },
    classica: { height: 4, borderTop: `1px solid ${tema.destaque}`, borderBottom: `1px solid ${tema.destaque}` },
    artesanal: { height: 0, borderTop: `2px dashed ${tema.destaque}` },
    ludica: { height: 6, background: tema.destaque, borderRadius: 99 },
  };
  return (
    <span className="absolute inset-x-3 inset-y-2">
      {tema.familia === "geometrica" &&
        ["0%", "100%"].map((left) => (
          <span key={left} className="absolute inset-y-0 w-px opacity-25" style={{ background: cor, left }} />
        ))}
      <motion.span
        animate={{ scaleX: [0, 1] }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 origin-left"
        style={regua[tema.familia]}
      />
    </span>
  );
}

function Ousadia({ tema, inicial }: Props) {
  const cor = tema.destaque;
  if (tema.familia === "classica") {
    // A inicial do nome, enorme.
    return (
      <motion.span
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 0.08, x: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute -top-8 -right-3 leading-none"
        style={{ fontFamily: tema.fonte, fontSize: "13rem", color: cor }}
      >
        {inicial}
      </motion.span>
    );
  }
  // Pelo lado de baixo: em cima fica o menu.
  const formas: Record<Exclude<Familia, "classica">, string> = {
    geometrica: tema.topo === "lado" || tema.topo === "cheio" ? "top-12 -right-1 bottom-0 w-[31%]" : "-bottom-16 -right-10 size-44 rotate-12",
    organica: "-bottom-20 -right-16 size-52 rounded-[38%_62%_55%_45%]",
    artesanal: "-bottom-3 -right-10 h-12 w-72 rotate-[-9deg]",
    ludica: "-bottom-20 -right-16 size-52 rounded-full",
  };
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: tema.familia === "artesanal" ? 0.3 : 0.26, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className={cn("absolute", formas[tema.familia])}
      style={{ background: tema.familia === "artesanal" ? `repeating-linear-gradient(90deg, ${cor} 0 7px, transparent 7px 10px)` : cor }}
    />
  );
}

function Clareza({ tema }: Props) {
  return (
    <motion.span
      animate={{ opacity: [0.55, 0.85, 0.55] }}
      transition={repete(5)}
      className="absolute inset-x-0 -top-6 h-40"
      style={{ background: `radial-gradient(ellipse at 50% 0, ${tema.escuro ? tema.apoio : "#ffffff"}, transparent 70%)` }}
    />
  );
}

/** O selo (Confiança, Cuidado), a moldura da foto (Exclusividade) e o tamanho do título
 * (Clareza, Ousadia) são do próprio topo (topo-da-pagina.tsx). */
const efeitos: Record<string, React.ComponentType<Props>> = {
  Alegria,
  Leveza,
  Energia,
  Calma,
  Acolhimento,
  Inspiração: Inspiracao,
  Profissionalismo,
  Ousadia,
  Clareza,
};

export function EfeitosDaSensacao({
  sensacoes,
  tema,
  inicial,
}: {
  sensacoes: string[];
  tema: Tema;
  /** A primeira letra do título. */
  inicial?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      data-sensacoes={sensacoes.join(",")}
      data-linguagem={`${tema.familia}/${movimento(tema)}`}
    >
      {sensacoes.filter((s) => efeitos[s]).map((s) => createElement(efeitos[s], { key: s, tema, inicial }))}
    </div>
  );
}

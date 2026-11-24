"use client";

import { createElement } from "react";
import { motion } from "motion/react";

import { iconeDaOpcao, iconesDoNegocio, type IconeDoNegocio } from "@/lib/briefing/icones";
import type { Foto, Tema, Textura } from "@/lib/briefing/temas";
import { cn } from "@/lib/utils";

// As artes do desenho da página: a foto no formato do estilo, a textura de fundo e o
// efeito de cada sensação.

const formatos: Record<Foto, React.CSSProperties> = {
  arco: { borderRadius: "999px 999px 0 0" },
  circulo: { borderRadius: "50%" },
  quadro: {},
  inclinada: { borderRadius: "1.1rem", rotate: "-4deg" },
  folha: { borderRadius: "60% 12% 60% 12%" },
  corte: { clipPath: "polygon(14% 0, 100% 0, 100% 86%, 86% 100%, 0 100%, 0 14%)" },
};

/** Um retrato em formas simples, com o ícone do negócio ao lado. */
export function Retrato({
  tema,
  icone,
  larga,
  className,
}: {
  tema: Tema;
  icone?: IconeDoNegocio;
  /** Foto deitada: enquadra a cabeça. */
  larga?: boolean;
  className?: string;
}) {
  // No escuro, a pele usa a tinta clara e o cabelo, o fundo.
  const claro = tema.escuro ? tema.tinta : tema.fundo;
  const forte = tema.escuro ? tema.fundo : tema.tinta;
  const Icone = icone ? iconesDoNegocio[icone] : undefined;
  return (
    <div className={cn("relative", className)}>
      <div
        className="h-full w-full overflow-hidden transition-all duration-700"
        style={{
          borderRadius: tema.foto === "quadro" ? tema.raio : undefined,
          ...formatos[tema.foto],
          background: `linear-gradient(160deg, ${tema.apoio}, color-mix(in oklab, ${tema.destaque} 55%, ${tema.apoio}))`,
        }}
      >
        <svg viewBox={larga ? "-30 14 160 64" : "0 0 100 100"} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <circle cx="80" cy="24" r="13" fill={claro} opacity="0.3" />
          <path d="M18 100C18 76 32 66 50 66S82 76 82 100Z" fill={tema.escuro ? `color-mix(in oklab, ${tema.destaque} 60%, ${forte})` : forte} opacity="0.9" />
          <path d="M42 58H58V70C58 76 42 76 42 70Z" fill={`color-mix(in oklab, ${claro} 68%, ${tema.destaque})`} />
          <ellipse cx="50" cy="46" rx="14.5" ry="17" fill={`color-mix(in oklab, ${claro} 82%, ${tema.destaque})`} />
          <path d="M34 46C31 26 44 22 52 23C64 24 69 34 66 47C63 38 56 35 47 35C40 35 36 39 34 46Z" fill={forte} />
        </svg>
      </div>
      {Icone && (
        <span
          className="absolute -right-1 bottom-1 flex size-7 items-center justify-center rounded-full shadow-md transition-colors duration-700"
          style={{ background: tema.destaque, color: tema.sobre }}
        >
          <Icone className="size-3.5" />
        </span>
      )}
    </div>
  );
}

export function TexturaDoFundo({ textura, cor }: { textura: Textura; cor: string }) {
  if (textura === "nenhuma") return null;
  const c = encodeURIComponent(cor);
  const fundos: Record<Exclude<Textura, "nenhuma">, React.CSSProperties> = {
    grade: {
      backgroundImage: `linear-gradient(${cor} 0.5px, transparent 0.5px), linear-gradient(90deg, ${cor} 0.5px, transparent 0.5px)`,
      backgroundSize: "16px 16px",
      opacity: 0.16,
    },
    pontos: { backgroundImage: `radial-gradient(${cor} 1.3px, transparent 1.6px)`, backgroundSize: "13px 13px", opacity: 0.22 },
    fios: { backgroundImage: `repeating-linear-gradient(90deg, ${cor} 0 0.5px, transparent 0.5px 22px)`, opacity: 0.16 },
    ondas: {
      backgroundImage: ehHex(cor)
        ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='22'%3E%3Cpath d='M0 11Q20 0 40 11T80 11' fill='none' stroke='${c}' stroke-width='1.2'/%3E%3C/svg%3E")`
        : `radial-gradient(circle at 20% 10%, ${cor}, transparent 42%)`,
      opacity: 0.16,
    },
    raios: { backgroundImage: `repeating-linear-gradient(115deg, ${cor} 0 3px, transparent 3px 18px)`, opacity: 0.12 },
  };
  return (
    <div
      className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(#000,transparent)]"
      style={fundos[textura]}
    />
  );
}

const ehHex = (cor: string) => cor.startsWith("#");

const repete = (duracao: number) => ({ duration: duracao, repeat: Infinity, ease: "easeInOut" as const });

/** O efeito de cada sensação em cima do topo da página. */
function Efeito({ sensacao, tema, compacto }: { sensacao: string; tema: Tema; compacto?: boolean }) {
  // Com o texto à esquerda, o selo fica no canto da foto, para não cobrir o título.
  const lugarDoSelo = tema.topo === "centro" ? "left-3" : "right-2";
  const icone = iconeDaOpcao(sensacao);
  switch (sensacao) {
    case "Confiança":
    case "Cuidado":
      return icone ? (
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: [1, 1.12, 1], rotate: 0 }}
          transition={{ scale: repete(2.6), rotate: { duration: 0.5 } }}
          className={cn("absolute flex size-8 items-center justify-center rounded-full shadow-lg", lugarDoSelo, sensacao === "Confiança" ? (compacto ? "top-2" : "top-9") : compacto ? "top-12" : "top-19")}
          style={{ background: tema.fundo, color: tema.destaque, boxShadow: `0 0 0 1.5px ${tema.destaque}` }}
        >
          {createElement(icone, { className: "size-4" })}
        </motion.span>
      ) : null;
    case "Acolhimento":
      return (
        <motion.span
          animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={repete(4.5)}
          className="absolute -top-10 left-1/2 size-56 -translate-x-1/2 rounded-full blur-2xl"
          style={{ background: `radial-gradient(circle, color-mix(in oklab, ${tema.destaque} 60%, #ffd9a0), transparent 68%)` }}
        />
      );
    case "Profissionalismo":
      return (
        <span className="absolute inset-x-3 inset-y-2">
          {[0, 1].map((i) => (
            <span key={i} className="absolute inset-y-0 w-px opacity-25" style={{ background: tema.tinta, left: i ? "100%" : 0 }} />
          ))}
          <span className="absolute inset-x-0 bottom-0 h-px opacity-25" style={{ background: tema.tinta }} />
          <motion.span
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 h-0.5 origin-left"
            style={{ background: tema.destaque }}
          />
        </span>
      );
    case "Calma":
      return (
        <>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ x: ["-6%", "6%", "-6%"] }}
              transition={repete(7 + i * 2)}
              className="absolute -inset-x-8 h-10 rounded-[50%]"
              style={{ bottom: -14 - i * 7, background: tema.apoio, opacity: 0.75 - i * 0.18 }}
            />
          ))}
        </>
      );
    case "Energia":
      return (
        <span className="absolute inset-0 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ x: ["-120%", "420%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: i * 0.6 }}
              className="absolute -top-6 h-[130%] w-6 -skew-x-[24deg]"
              style={{ background: tema.destaque, opacity: 0.16 }}
            />
          ))}
        </span>
      );
    case "Alegria":
      return (
        <>
          {[8, 24, 41, 58, 74, 90].map((x, i) => (
            <motion.span
              key={x}
              animate={{ y: [0, -9, 0], rotate: [0, 40, 0] }}
              transition={{ ...repete(2 + (i % 3) * 0.5), delay: i * 0.2 }}
              className={cn("absolute size-2.5", i % 2 ? "rounded-full" : "rounded-[3px]")}
              style={{ left: `${x}%`, top: `${i % 2 ? 80 + ((i * 7) % 12) : 24 + ((i * 5) % 14)}%`, background: i % 3 ? tema.destaque : tema.tinta, opacity: 0.65 }}
            />
          ))}
        </>
      );
    case "Exclusividade":
      return (
        <motion.span
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-2 border"
          style={{ borderColor: tema.destaque, outline: `1px solid ${tema.destaque}`, outlineOffset: "-5px", opacity: 0.9 }}
        />
      );
    case "Clareza":
      return (
        <motion.span
          animate={{ opacity: [0.55, 0.85, 0.55] }}
          transition={repete(5)}
          className="absolute inset-x-0 -top-6 h-40"
          style={{ background: `radial-gradient(ellipse at 50% 0, ${tema.escuro ? tema.apoio : "#ffffff"}, transparent 70%)` }}
        />
      );
    case "Ousadia":
      return (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, 0] }}
          transition={{ scale: { type: "spring", stiffness: 160, damping: 14 }, rotate: repete(6) }}
          className="absolute -top-14 -right-16 size-36 rounded-[38%_62%_55%_45%]"
          style={{ background: tema.destaque, opacity: 0.55 }}
        />
      );
    default:
      return null;
  }
}

/** Os selos ficam na frente, para a foto não os cobrir. */
const NA_FRENTE = ["Confiança", "Cuidado"];

export function EfeitosDaSensacao({
  sensacoes,
  tema,
  compacto,
  camada,
}: {
  sensacoes: string[];
  tema: Tema;
  compacto?: boolean;
  camada: "fundo" | "frente";
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" data-sensacoes={camada === "fundo" ? sensacoes.join(",") : undefined}>
      {sensacoes.filter((s) => NA_FRENTE.includes(s) === (camada === "frente")).map((s) => (
        <Efeito key={s} sensacao={s} tema={tema} compacto={compacto} />
      ))}
    </div>
  );
}

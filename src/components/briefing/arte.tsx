"use client";

import { iconesDoNegocio, type IconeDoNegocio } from "@/lib/briefing/icones";
import type { Foto, Tema, Textura } from "@/lib/briefing/temas";
import { cn } from "@/lib/utils";

// As artes do desenho da página: a foto no formato do estilo e a textura de fundo.

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
    pontilhado: {
      backgroundImage: `repeating-linear-gradient(0deg, ${cor} 0 0.5px, transparent 0.5px 7px), repeating-linear-gradient(3deg, ${cor} 0 0.5px, transparent 0.5px 23px)`,
      opacity: 0.16,
    },
    manchas: {
      backgroundImage: `radial-gradient(circle at 12% 20%, ${cor}, transparent 32%), radial-gradient(circle at 88% 8%, ${cor}, transparent 38%), radial-gradient(circle at 70% 90%, ${cor}, transparent 34%)`,
      opacity: 0.18,
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

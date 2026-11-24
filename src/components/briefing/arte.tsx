"use client";

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

/** Um retrato em formas simples, com luz de um lado. */
export function Retrato({
  tema,
  larga,
  className,
}: {
  tema: Tema;
  /** Foto deitada: enquadra a cabeça. */
  larga?: boolean;
  className?: string;
}) {
  // No escuro, a pele usa a tinta clara e o cabelo, o fundo.
  const claro = tema.escuro ? tema.tinta : tema.fundo;
  const forte = tema.escuro ? tema.fundo : tema.tinta;
  // Um tom de pele neutro, para a cor do estilo não deixar o rosto azul ou roxo.
  const pele = `color-mix(in oklab, #dfb396 48%, ${claro})`;
  const roupa = tema.escuro ? `color-mix(in oklab, ${tema.destaque} 62%, ${forte})` : `color-mix(in oklab, ${forte} 88%, ${tema.destaque})`;
  return (
    <div
      className={cn("overflow-hidden shadow-[0_14px_26px_-18px_rgb(0_0_0/0.55)] transition-all duration-700", className)}
      style={{
        borderRadius: tema.foto === "quadro" ? tema.raio : undefined,
        ...formatos[tema.foto],
        background: `radial-gradient(circle at 74% 18%, color-mix(in oklab, ${claro} 55%, ${tema.destaque}), transparent 46%), linear-gradient(165deg, ${tema.apoio}, color-mix(in oklab, ${tema.destaque} 58%, ${tema.apoio}))`,
      }}
    >
      <svg viewBox={larga ? "-34 12 168 66" : "0 0 100 100"} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <path d="M14 102C15 79 30 68 50 68S85 79 86 102Z" fill={roupa} />
        <path d="M41 56H59V70C59 78 41 78 41 70Z" fill={`color-mix(in oklab, ${pele} 84%, ${forte})`} />
        <path d="M44 66L50 74L56 66L62 70L50 88L38 70Z" fill={claro} opacity="0.85" />
        <path d="M35 44C35 60 42 66 50 66S65 60 65 44C65 34 58 29 50 29S35 34 35 44Z" fill={pele} />
        <path d="M33 47C29 25 44 19 53 20C67 21 71 34 67 49C66 42 63 38 59 35C52 39 42 39 37 37C35 40 34 43 33 47Z" fill={forte} />
      </svg>
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

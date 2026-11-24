"use client";

import { createElement } from "react";
import { MessageCircleIcon, StarIcon } from "lucide-react";
import { motion } from "motion/react";

import { Retrato, TexturaDoFundo } from "@/components/briefing/arte";
import { EfeitosDaSensacao } from "@/components/briefing/efeitos";
import { iconeDaOpcao, iconesDoNegocio, type IconeDoNegocio } from "@/lib/briefing/icones";
import type { Familia, Tema } from "@/lib/briefing/temas";
import { cn } from "@/lib/utils";

// O topo da página no desenho: muda de composição com o estilo, de cor com as cores e
// ganha o efeito das sensações. É usado também, menor, nos cartões dos estilos. Nada
// fica por cima de nada: o selo entra embaixo do botão e a moldura, em volta da foto
// (a galeria e tests/briefing-visual.mjs conferem todas as combinações).

export function Traco({ largura, cor, forte }: { largura: string; cor: string; forte?: boolean }) {
  return (
    <span
      className={cn("block rounded-full transition-colors duration-700", forte ? "h-1.5" : "h-1")}
      style={{ width: largura, background: cor, opacity: forte ? 0.5 : 0.2 }}
    />
  );
}

/** A linha de prova embaixo do botão: a nota da pessoa, quando ela contou, ou o ícone. */
function Selo({ sensacao, tema, cor, prova }: { sensacao: string; tema: Tema; cor: string; prova?: string }) {
  const icone = iconeDaOpcao(sensacao);
  if (!icone) return null;
  const comNota = sensacao === "Confiança" && prova;
  const forma: Record<Familia, React.CSSProperties> = {
    geometrica: { borderRadius: tema.raio },
    organica: { borderRadius: 999 },
    classica: { borderRadius: 2, borderStyle: "solid" },
    artesanal: { borderRadius: 4, borderStyle: "dashed" },
    ludica: { borderRadius: 12 },
  };
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="inline-flex items-center gap-1.5 border px-2 py-1 text-[0.56rem] leading-none whitespace-nowrap"
      style={{ color: cor, borderColor: `color-mix(in oklab, ${cor} 32%, transparent)`, ...forma[tema.familia] }}
      data-selo={sensacao}
    >
      <motion.span animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="flex">
        {comNota ? <StarIcon className="size-2.5" fill="currentColor" /> : createElement(icone, { className: "size-2.5" })}
      </motion.span>
      {comNota ? `${prova} no Google` : sensacao === "Confiança" ? "Confiança do começo ao fim" : "Cuidado em cada passo"}
    </motion.span>
  );
}

export function TopoDaPagina({
  tema,
  titulo,
  chamada,
  lugar,
  prova,
  comBotao,
  icone,
  sensacoes = [],
  compacto,
  refinado,
  className,
}: {
  tema: Tema;
  titulo: string;
  /** Uma linha embaixo do título; sem ela, entram os tracinhos. */
  chamada?: string;
  /** Onde atende, em cima do título. */
  lugar?: string;
  /** A nota no Google, quando a pessoa contou. */
  prova?: string;
  comBotao: boolean;
  icone?: IconeDoNegocio;
  sensacoes?: string[];
  /** Baixo o bastante para acompanhar a rolagem no celular. */
  compacto?: boolean;
  /** Depois do toque da Adsgator (o fim do briefing). */
  refinado?: boolean;
  className?: string;
}) {
  const ousada = sensacoes.includes("Ousadia");
  const clara = sensacoes.includes("Clareza");
  const exclusiva = sensacoes.includes("Exclusividade");
  const selos = sensacoes.filter((s) => s === "Confiança" || s === "Cuidado");
  const cheio = tema.topo === "cheio";
  const cor = cheio ? tema.sobre : tema.tinta;
  const centro = tema.topo === "centro";
  const aoLado = tema.topo === "lado" || cheio;
  const serifada = tema.familia === "classica" || Boolean(tema.maiusculas);

  // Palavra comprida ao lado da foto pede letra menor, para não passar por baixo dela.
  const maior = Math.min(18, Math.max(...titulo.split(/\s+/).map((x) => x.length))) * (tema.maiusculas ? 1.3 : 1);
  const desejado = ousada ? 1.75 : clara ? 1.5 : tema.topo === "editorial" ? 1.55 : 1.3;
  const tamanho = aoLado ? Math.min(desejado, 12.4 / Math.max(maior, 8)) : Math.min(desejado, 20 / Math.max(maior, 8));

  const Negocio = icone ? iconesDoNegocio[icone] : undefined;
  const foto = (classe: string, larga?: boolean) => (
    <div className={cn("relative", classe)} data-foto>
      {/* Exclusividade: um fio em volta da foto, na linguagem do estilo. */}
      {exclusiva && (
        <motion.span
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className={cn("absolute -inset-1.5", tema.familia === "artesanal" ? "border border-dashed" : "border")}
          style={{
            borderColor: cheio ? tema.sobre : tema.destaque,
            borderRadius: tema.foto === "arco" ? "999px 999px 0 0" : tema.foto === "circulo" ? "50%" : tema.foto === "folha" ? "60% 12% 60% 12%" : tema.raio,
            opacity: 0.8,
          }}
        />
      )}
      <Retrato tema={cheio ? { ...tema, apoio: tema.fundo } : tema} larga={larga} className="h-full w-full" />
    </div>
  );

  const texto = (
    <motion.div
      key={`${tema.topo}${tema.fonte}${tema.maiusculas ?? ""}`}
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative min-w-0", compacto ? "space-y-1.5" : "space-y-2.5", centro && "flex flex-col items-center text-center")}
    >
      {lugar && !compacto && (
        <p
          className="flex max-w-full items-center gap-1.5 text-[0.56rem] tracking-wide"
          style={{ color: cheio ? tema.sobre : `color-mix(in oklab, ${tema.destaque} 72%, ${tema.tinta})` }}
        >
          <span className="h-px w-3.5 shrink-0 bg-current" />
          <span className="min-w-0 truncate">{lugar}</span>
        </p>
      )}
      <p
        className={cn(
          "line-clamp-4 leading-[1.1] text-balance [overflow-wrap:anywhere] transition-all duration-500",
          tema.italico && "italic",
          tema.maiusculas && "uppercase",
        )}
        style={{
          fontFamily: tema.fonte,
          fontWeight: tema.peso,
          fontSize: `${compacto ? Math.min(tamanho, 1.25) : tamanho}rem`,
          letterSpacing: exclusiva && serifada ? "0.05em" : tema.maiusculas ? "0.03em" : "-0.012em",
          color: cor,
        }}
        data-titulo-do-desenho
      >
        {titulo}
      </p>
      {chamada ? (
        <p
          className={cn("[overflow-wrap:anywhere] text-balance transition-colors duration-700", compacto ? "line-clamp-1 text-[0.62rem]" : "line-clamp-3 text-[0.7rem] leading-relaxed")}
          style={{ color: cor, opacity: 0.8 }}
        >
          {chamada}
        </p>
      ) : (
        <span className={cn("block w-full space-y-1.5", centro && "flex flex-col items-center")}>
          <Traco largura="86%" cor={cor} />
          <Traco largura="58%" cor={cor} />
        </span>
      )}
      {comBotao && (
        <span className={cn("flex flex-wrap items-center gap-2", centro && "justify-center")}>
          <span
            data-botao-do-desenho
            className={cn(
              "relative inline-flex w-fit items-center gap-1.5 overflow-hidden font-semibold whitespace-nowrap transition-all duration-700 [&_svg]:shrink-0",
              refinado ? "text-[0.7rem] shadow-lg" : "text-[0.6rem] shadow-sm",
              aoLado ? "px-2.5 py-2" : refinado ? "px-4 py-2.5" : "px-3 py-2",
            )}
            style={{
              background: cheio ? tema.sobre : tema.destaque,
              color: cheio ? tema.destaque : tema.sobre,
              borderRadius: tema.raio,
            }}
          >
            {refinado && (
              <motion.span
                animate={{ x: ["-150%", "420%"] }}
                transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-white/35"
              />
            )}
            <MessageCircleIcon className="size-3" />
            Chamar no WhatsApp
          </span>
        </span>
      )}
      {selos.length > 0 && !compacto && (
        <span className={cn("flex flex-wrap gap-1.5", centro && "justify-center")}>
          {selos.map((s) => (
            <Selo key={s} sensacao={s} tema={tema} cor={cor} prova={prova} />
          ))}
        </span>
      )}
    </motion.div>
  );

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden transition-colors duration-700",
        compacto ? "px-4 py-4" : refinado ? "px-6 py-9" : clara ? "px-5 py-8" : "px-5 py-6",
        className,
      )}
      style={{ background: cheio ? tema.destaque : tema.fundo }}
      data-topo
    >
      <TexturaDoFundo textura={tema.textura} cor={cheio ? tema.sobre : tema.textura === "manchas" ? tema.destaque : tema.tinta} />
      {refinado && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 78% 12%, color-mix(in oklab, ${cheio ? tema.sobre : tema.destaque} 18%, transparent), transparent 58%), linear-gradient(to bottom, transparent 70%, color-mix(in oklab, ${cheio ? tema.destaque : tema.apoio} 55%, transparent))`,
          }}
        />
      )}
      <EfeitosDaSensacao
        sensacoes={sensacoes}
        inicial={titulo[0]}
        tema={cheio ? { ...tema, fundo: tema.destaque, destaque: tema.sobre, tinta: tema.sobre, apoio: `color-mix(in oklab, ${tema.sobre} 22%, ${tema.destaque})` } : tema}
      />
      {centro && (
        <div className={cn("relative flex items-center", compacto ? "justify-center gap-5" : "flex-col gap-4")}>
          {foto(compacto ? "h-24 w-20 shrink-0" : refinado ? "h-32 w-27" : "h-27 w-23")}
          {texto}
        </div>
      )}
      {aoLado && (
        <div className={cn("relative grid grid-cols-[1.5fr_1fr] gap-4", cheio ? "items-end" : "items-center")}>
          <div className={cn("min-w-0", cheio && "pb-1")}>{texto}</div>
          {foto(cheio ? (compacto ? "-mb-4 h-30" : "-mb-6 h-40") : compacto ? "h-28" : "h-38")}
        </div>
      )}
      {tema.topo === "editorial" && (
        <div className={cn("relative", compacto ? "grid grid-cols-2 items-center gap-4" : "space-y-4")}>
          {texto}
          <div className="grid grid-cols-[1fr_2.4fr] gap-2.5">
            <span
              className={cn("flex items-center justify-center transition-colors duration-700", compacto ? "h-20" : "h-24")}
              style={{ background: tema.destaque, color: tema.sobre, borderRadius: tema.raio }}
            >
              {Negocio && <Negocio className="size-7" strokeWidth={1.4} />}
            </span>
            {foto(compacto ? "h-20" : "h-24", true)}
          </div>
        </div>
      )}
    </div>
  );
}

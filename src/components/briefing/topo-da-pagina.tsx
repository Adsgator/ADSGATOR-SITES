"use client";

import { MessageCircleIcon } from "lucide-react";
import { motion } from "motion/react";

import { EfeitosDaSensacao, Retrato, TexturaDoFundo } from "@/components/briefing/arte";
import type { IconeDoNegocio } from "@/lib/briefing/icones";
import type { Tema } from "@/lib/briefing/temas";
import { cn } from "@/lib/utils";

// O topo da página no desenho: muda de composição com o estilo, de cor com as cores
// e ganha o efeito das sensações. É usado também, menor, nos cartões dos estilos.

export function Traco({ largura, cor, forte }: { largura: string; cor: string; forte?: boolean }) {
  return (
    <span
      className={cn("block rounded-full transition-colors duration-700", forte ? "h-1.5" : "h-1")}
      style={{ width: largura, background: cor, opacity: forte ? 0.5 : 0.2 }}
    />
  );
}

export function TopoDaPagina({
  tema,
  titulo,
  chamada,
  comBotao,
  icone,
  sensacoes = [],
  compacto,
  className,
}: {
  tema: Tema;
  titulo: string;
  /** Uma linha embaixo do título; sem ela, entram os tracinhos. */
  chamada?: string;
  comBotao: boolean;
  icone?: IconeDoNegocio;
  sensacoes?: string[];
  /** Baixo o bastante para acompanhar a rolagem no celular. */
  compacto?: boolean;
  className?: string;
}) {
  const ousada = sensacoes.includes("Ousadia");
  const clara = sensacoes.includes("Clareza");
  const exclusiva = sensacoes.includes("Exclusividade");
  const cheio = tema.topo === "cheio";
  const cor = cheio ? tema.sobre : tema.tinta;
  const centro = tema.topo === "centro";

  // Palavra comprida ao lado da foto pede letra menor, para não passar por baixo dela.
  const aoLado = tema.topo === "lado" || cheio;
  const maior = Math.min(18, Math.max(...titulo.split(/\s+/).map((x) => x.length))) * (tema.maiusculas ? 1.25 : 1) * (exclusiva ? 1.15 : 1);
  const desejado = ousada ? 1.6 : clara ? 1.35 : tema.topo === "editorial" ? 1.45 : 1.15;
  const tamanho = aoLado ? Math.min(desejado, 13 / Math.max(maior, 8)) : desejado;

  const texto = (
    <motion.div
      key={`${tema.topo}${tema.fonte}${tema.maiusculas ?? ""}`}
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative min-w-0 space-y-2", centro && "flex flex-col items-center text-center")}
    >
      <p
        className={cn("line-clamp-4 leading-[1.08] text-balance [overflow-wrap:anywhere] transition-all duration-500", tema.italico && "italic", tema.maiusculas && "uppercase")}
        style={{
          fontFamily: tema.fonte,
          fontWeight: tema.peso,
          fontSize: `${tamanho}rem`,
          letterSpacing: exclusiva ? "0.1em" : tema.maiusculas ? "0.04em" : "-0.01em",
          color: cor,
        }}
      >
        {titulo}
      </p>
      {chamada ? (
        <p className="line-clamp-2 [overflow-wrap:anywhere] text-[0.68rem] leading-snug transition-colors duration-700" style={{ color: cor, opacity: 0.75 }}>
          {chamada}
        </p>
      ) : (
        <span className={cn("block w-full space-y-1.5", centro && "flex flex-col items-center")}>
          <Traco largura="86%" cor={cor} />
          <Traco largura="58%" cor={cor} />
        </span>
      )}
      {comBotao && (
        <span
          data-botao-do-desenho
          className="mt-1 inline-flex w-fit items-center gap-1.5 px-2.5 py-1.5 text-[0.6rem] font-semibold whitespace-nowrap shadow-sm transition-all duration-700"
          style={{
            background: cheio ? tema.sobre : tema.destaque,
            color: cheio ? tema.destaque : tema.sobre,
            borderRadius: tema.raio,
          }}
        >
          <MessageCircleIcon className="size-3" />
          Chamar no WhatsApp
        </span>
      )}
    </motion.div>
  );

  return (
    <div
      className={cn("relative isolate overflow-hidden px-4 transition-colors duration-700", clara && !compacto ? "py-7" : compacto ? "py-4" : "py-5", className)}
      style={{ background: cheio ? tema.destaque : tema.fundo }}
    >
      <TexturaDoFundo textura={tema.textura} cor={cheio ? tema.sobre : tema.tinta} />
      <EfeitosDaSensacao camada="fundo" sensacoes={sensacoes} compacto={compacto} tema={cheio ? { ...tema, fundo: tema.destaque, destaque: tema.sobre, tinta: tema.sobre } : tema} />
      {centro && (
        <div className={cn("relative flex items-center", compacto ? "justify-center gap-5" : "flex-col gap-3")}>
          <Retrato tema={tema} icone={icone} className={compacto ? "h-24 w-20 shrink-0" : "h-24 w-20"} />
          {texto}
        </div>
      )}
      {tema.topo === "lado" && (
        <div className="relative grid grid-cols-[1.45fr_1fr] items-center gap-3">
          {texto}
          <Retrato tema={tema} icone={icone} className={compacto ? "h-28" : "h-32"} />
        </div>
      )}
      {cheio && (
        <div className="relative grid grid-cols-[1.45fr_1fr] items-end gap-3">
          <div className="pb-1">{texto}</div>
          <Retrato tema={{ ...tema, apoio: tema.fundo }} icone={icone} className={compacto ? "-mb-5 h-32" : "-mb-5 h-36"} />
        </div>
      )}
      {tema.topo === "editorial" && (
        <div className={cn("relative", compacto ? "grid grid-cols-2 items-center gap-4" : "space-y-3")}>
          {texto}
          <div className="grid grid-cols-[1fr_2.2fr] gap-2">
            <span className="h-20 transition-colors duration-700" style={{ background: tema.destaque, borderRadius: tema.raio }} />
            <Retrato tema={tema} icone={icone} larga className="h-20" />
          </div>
        </div>
      )}
      <EfeitosDaSensacao camada="frente" sensacoes={sensacoes} compacto={compacto} tema={cheio ? { ...tema, fundo: tema.destaque, destaque: tema.sobre, tinta: tema.sobre } : tema} />
    </div>
  );
}

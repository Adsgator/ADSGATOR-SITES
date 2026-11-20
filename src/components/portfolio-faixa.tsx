"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";
import { JanelaPagina, usePassarMouse } from "@/components/janela-pagina";
import { margemDaFila, useFilaNaRolagem } from "@/components/motion/use-fila-na-rolagem";
import { destaques, type PaginaPortfolio } from "@/config/portfolio";
import { cn } from "@/lib/utils";

// O portfólio no Início (roteiro do site, Início, seção 8): as páginas de
// config/portfolio.ts (as 5 primeiras) numa fila que anda de lado com a rolagem.

/**
 * A seção fica presa no topo enquanto a rolagem leva a fila de lado (pedido
 * do Lucas, 2026-11-20). A distância é medida: a fila começa com a primeira
 * página alinhada ao título e termina com a última inteira na borda direita.
 */
export function PortfolioFaixa() {
  const { area, palco, fila, x, andado, alturaDaArea } = useFilaNaRolagem();

  return (
    <section ref={area} data-portfolio style={{ height: alturaDaArea }} className="relative">
      <div ref={palco} className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-16">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-x-6 gap-y-3 px-4">
          <div>
            <Eyebrow>Portfólio</Eyebrow>
            <h2 className="mt-5 font-heading text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              Páginas feitas pela Adsgator.
            </h2>
            <p className="mt-3 max-w-xl text-lg leading-8 text-muted-foreground">
              Cada uma feita para o negócio do cliente. Passe o mouse para ver a página inteira.
            </p>
          </div>
          <Link href="/portfolio" className="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
            Ver o portfólio
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <motion.ul
          ref={fila}
          style={{ x }}
          className={cn("mt-10 flex w-max gap-8", margemDaFila)}
        >
          {destaques.map((pagina) => (
            <Cartao key={pagina.id} pagina={pagina} />
          ))}
        </motion.ul>

        <div aria-hidden="true" className="mx-auto mt-8 h-0.5 w-full max-w-6xl px-4">
          <div className="h-full rounded-full bg-border">
            <motion.div style={{ scaleX: andado }} className="h-full origin-left rounded-full bg-brand" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Uma página da fila: ao passar o mouse (ou focar o cartão pelo teclado), a
 * página inteira rola dentro da janela. Sem link para a página (decisão do
 * Lucas, 2026-11-20). */
function Cartao({ pagina }: { pagina: PaginaPortfolio }) {
  const { ativo, eventos } = usePassarMouse();
  return (
    <li
      data-cartao={pagina.id}
      tabIndex={0}
      aria-label={`${pagina.segmento}: ver a página inteira`}
      {...eventos}
      className="w-[min(85vw,34rem,calc((100svh-28rem)*1.6))] min-w-64 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-8 focus-visible:ring-offset-background"
    >
      <JanelaPagina pagina={pagina} ativo={ativo} sizes="(min-width: 640px) 34rem, 85vw" />
      <p className="mt-4 font-heading text-xl">{pagina.segmento}</p>
    </li>
  );
}

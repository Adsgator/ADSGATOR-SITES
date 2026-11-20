"use client";

import { ArrowUpRightIcon, MapPinIcon } from "lucide-react";

import { JanelaPagina, usePassarMouse } from "@/components/janela-pagina";
import { Reveal } from "@/components/motion/reveal";
import type { PaginaPortfolio } from "@/config/portfolio";

/** Uma página na grade do Portfólio: a janela que rola a página inteira ao
 * passar o mouse, o segmento, a cidade, os serviços e o mini caso sem
 * números (roteiro do site, Portfólio). */
export function PortfolioCaso({ pagina }: { pagina: PaginaPortfolio }) {
  const { ativo, eventos } = usePassarMouse();
  const { id, segmento, site, cidade, servicos, caso } = pagina;
  return (
    <li data-cartao={id} {...eventos}>
      <Reveal>
        <JanelaPagina pagina={pagina} ativo={ativo} sizes="(min-width: 768px) 34rem, 92vw" />
        <div className="mt-6 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div>
            <h3 className="font-heading text-2xl leading-tight sm:text-3xl">{segmento}</h3>
            {cidade && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPinIcon className="size-3.5" />
                {cidade}
              </p>
            )}
          </div>
          {site && (
            <a
              href={`https://${site}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 pt-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              Ver a página no ar
              <ArrowUpRightIcon className="size-4" />
            </a>
          )}
        </div>
        <ul aria-label="Serviços" className="mt-4 flex flex-wrap gap-2">
          {servicos.map((servico) => (
            <li key={servico} className="rounded-full border px-3 py-1 text-xs">
              {servico}
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-3 border-t pt-5 text-sm leading-6">
          {[
            ["O negócio", caso.negocio],
            ["O que precisava", caso.precisava],
            ["O que foi feito", caso.feito],
          ].map(([rotulo, texto]) => (
            <div key={rotulo} className="grid gap-1 sm:grid-cols-[8.5rem_1fr]">
              <dt className="font-mono text-xs text-muted-foreground sm:pt-0.5">{rotulo}</dt>
              <dd>{texto}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </li>
  );
}

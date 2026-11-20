"use client";

import { MapPinIcon } from "lucide-react";

import { JanelaPagina, usePassarMouse } from "@/components/janela-pagina";
import { Reveal } from "@/components/motion/reveal";
import type { PaginaPortfolio } from "@/config/portfolio";

/** Uma página na grade do Portfólio: a janela que rola a página inteira ao
 * passar o mouse, o segmento, a cidade, os serviços e o mini caso sem
 * números (roteiro do site, Portfólio). Sem link para a página (decisão do
 * Lucas): o cartão recebe o foco pelo teclado, e focar também rola a página. */
export function PortfolioCaso({ pagina }: { pagina: PaginaPortfolio }) {
  const { ativo, eventos } = usePassarMouse();
  const { id, segmento, cidade, conceito, servicos, caso } = pagina;
  return (
    <li
      data-cartao={id}
      tabIndex={0}
      aria-label={`${segmento}: ver a página inteira`}
      className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-8 focus-visible:ring-offset-background"
      {...eventos}
    >
      <Reveal>
        <JanelaPagina pagina={pagina} ativo={ativo} sizes="(min-width: 768px) 34rem, 92vw" />
        <div className="mt-6 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div>
            <h3 className="font-heading text-2xl leading-tight sm:text-3xl">{segmento}</h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPinIcon className="size-3.5" />
              {cidade}
            </p>
          </div>
        </div>
        <ul aria-label="Serviços" className="mt-4 flex flex-wrap gap-2">
          {servicos.map((servico) => (
            <li key={servico} className="rounded-full border px-3 py-1 text-xs">
              {servico}
            </li>
          ))}
          {conceito && (
            <li data-conceito className="rounded-full border border-dashed px-3 py-1 text-xs text-muted-foreground">
              Projeto conceito
            </li>
          )}
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

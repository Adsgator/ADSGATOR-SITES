"use client";

import { useRef } from "react";

import { BrandMark } from "@/components/brand";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { NumeroQueSobe, useApareceu } from "@/components/motion/numero-que-sobe";
import { cn } from "@/lib/utils";

// Um resumo como chega no WhatsApp (rodada de profundidade, Lucas,
// 2026-11-20): o do mês do Google Ads e o de cada 3 meses da manutenção, de
// clientes fictícios, com números de exemplo (o Lucas liberou, marcados como
// exemplo) e o "O que fizemos", que o painel monta com o que mudou (plano de
// qualidade, Fase 5). Quando aparece na tela, as barras enchem, os números
// sobem e os itens entram um por vez.

export function ResumoDoMes({
  titulo,
  numeros,
  fizemos,
  legenda = "no seu WhatsApp e por e-mail",
}: {
  titulo: string;
  legenda?: string;
  numeros: { rotulo: string; valor: number; fracao: number }[];
  fizemos: string[];
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);

  return (
    <div ref={caixa} data-resumo data-apareceu={apareceu ? "" : undefined} className="overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-ink/10">
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <BrandMark className="size-9 rounded-full" />
        <div className="leading-tight">
          <p className="font-medium">Adsgator</p>
          <p className="text-xs text-muted-foreground">{legenda}</p>
        </div>
        <span className="ml-auto rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">exemplo</span>
        <span className="flex size-8 items-center justify-center rounded-full bg-success text-white">
          <IconeWhatsApp className="size-4" />
        </span>
      </div>
      <div aria-hidden="true" className="bg-muted/40 p-5">
        <div className="max-w-[92%] rounded-2xl rounded-tl-sm border bg-background p-4 text-sm leading-6">
          <p className="font-semibold">{titulo}</p>
          <div className="mt-3 space-y-3">
            {numeros.map(({ rotulo, valor, fracao }, i) => (
              <div key={rotulo}>
                <p className="flex justify-between gap-3 text-xs text-muted-foreground">
                  {rotulo}
                  <span className="font-semibold text-foreground">
                    <NumeroQueSobe valor={valor} ativo={apareceu} duracao={1200 + i * 300} />
                  </span>
                </p>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    data-barra
                    style={{ transform: `scaleX(${apareceu ? fracao : 0})`, transitionDelay: `${i * 150}ms` }}
                    className="h-full origin-left rounded-full bg-brand transition-transform duration-1000 ease-(--ease-out)"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-semibold">O que fizemos</p>
          <ul className="mt-1 space-y-1">
            {fizemos.map((f, i) => (
              <li
                key={f}
                style={{ transitionDelay: `${900 + i * 250}ms` }}
                className={cn("flex gap-2 transition-all duration-500", apareceu ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0")}
              >
                <span className="text-brand">•</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

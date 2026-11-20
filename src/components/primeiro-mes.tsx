"use client";

import { useRef } from "react";
import { ClipboardCheckIcon, MessageCircleIcon, RocketIcon, SearchCheckIcon } from "lucide-react";

import { useApareceu } from "@/components/motion/numero-que-sobe";
import { cn } from "@/lib/utils";

// "Como funciona", o primeiro mês depois que a campanha entra no ar (Base,
// processo "Google Ads", etapas 7 a 10: o aviso de que está no ar, a
// conferência em 48 h, a revisão completa toda semana e o resumo do mês; a
// conta monitorada 24 horas o tempo todo). Quando aparece na tela, os 30 dias
// se acendem em cascata e cada marco aparece no seu dia (transição do CSS:
// roda também com "reduzir animações" ligado).

const DIAS = 30;
const PASSO_MS = 55;

type Marco = { titulo: string; texto: string; icone: React.ReactNode; tom: string };

const marcos: Record<number, Marco> = {
  1: {
    titulo: "No ar",
    texto: "Você recebe a mensagem de que a campanha está no ar.",
    icone: <RocketIcon className="size-3.5" />,
    tom: "bg-brand text-brand-foreground border-brand",
  },
  3: {
    titulo: "A primeira conferência de perto",
    texto: "Em 48 horas: se os anúncios estão aparecendo, para quem, e se os contatos estão sendo medidos.",
    icone: <SearchCheckIcon className="size-3.5" />,
    tom: "bg-foreground text-background border-foreground",
  },
  8: {
    titulo: "Revisão completa",
    texto: "Toda semana, além do acompanhamento de todo dia: buscas, anúncios, gasto e contatos.",
    icone: <ClipboardCheckIcon className="size-3.5" />,
    tom: "bg-success text-white border-success",
  },
  30: {
    titulo: "O resumo do mês",
    texto: "No seu WhatsApp e por e-mail: o que chegou e o que foi feito.",
    icone: <MessageCircleIcon className="size-3.5" />,
    tom: "bg-brand text-brand-foreground border-brand",
  },
};
// As revisões seguintes repetem a da semana 1.
for (const dia of [15, 22, 29]) marcos[dia] = marcos[8];

const legenda = [1, 3, 8, 30];

export function PrimeiroMes() {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);

  return (
    <div ref={caixa} data-primeiro-mes className="grid gap-10 rounded-3xl border bg-card p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="font-heading text-xl">O primeiro mês</p>
          <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            monitorada 24 horas, todo dia
          </p>
        </div>
        <ol className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-10">
          {Array.from({ length: DIAS }, (_, i) => {
            const dia = i + 1;
            const marco = marcos[dia];
            return (
              <li
                key={dia}
                data-dia={dia}
                data-aceso-dia={apareceu ? "" : undefined}
                title={marco ? `Dia ${dia}: ${marco.titulo}` : `Dia ${dia}`}
                style={{ transitionDelay: `${i * PASSO_MS}ms` }}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-xl border text-xs tabular-nums transition-all duration-300",
                  !apareceu && "scale-95 bg-muted/40 text-muted-foreground/50",
                  apareceu && (marco ? marco.tom : "border-brand/40 bg-brand/5 text-foreground"),
                )}
              >
                {marco && apareceu ? marco.icone : dia}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute bottom-1 size-1 rounded-full bg-brand transition-opacity duration-300",
                    apareceu && !marco ? "opacity-100" : "opacity-0",
                  )}
                  style={{ transitionDelay: `${i * PASSO_MS}ms` }}
                />
              </li>
            );
          })}
        </ol>
      </div>
      <ul className="space-y-5">
        {legenda.map((dia) => {
          const { titulo, texto, icone, tom } = marcos[dia];
          return (
            <li
              key={dia}
              data-marco-visivel={apareceu ? "" : undefined}
              style={{ transitionDelay: `${(dia - 1) * PASSO_MS + 150}ms` }}
              className={cn("flex gap-4 transition-all duration-500", apareceu ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}
            >
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg border", tom)}>{icone}</span>
              <div>
                <p className="font-mono text-xs text-muted-foreground">{dia === 8 ? "Dias 8, 15, 22 e 29" : `Dia ${dia}`}</p>
                <p className="mt-0.5 font-medium">{titulo}</p>
                <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{texto}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

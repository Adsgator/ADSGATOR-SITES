"use client";

import { useRef } from "react";
import { CheckIcon } from "lucide-react";

import { useApareceu } from "@/components/motion/numero-que-sobe";
import { cn } from "@/lib/utils";

// O que a conferência de todo dia olha em cada página com manutenção (painel,
// monitoramento dos sites: página no ar, botões do WhatsApp, número,
// rastreamento, cookies e cadeado). Página de manutenção, "Por que cuidar da
// página". Quando aparece na tela, os itens se marcam um por vez.

const itens = [
  "A página abre e carrega rápido",
  "Cada botão leva ao WhatsApp, com o número certo",
  "A mensagem pronta chega junto",
  "A medição dos contatos está ligada",
  "O aviso de cookies aparece",
  "O cadeado de segurança está válido",
];

export function ConferenciaDoDia() {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);

  return (
    <div
      ref={caixa}
      data-conferencia-do-dia
      className="dark section-ink mt-5 grid gap-8 rounded-3xl border bg-background p-8 text-foreground md:grid-cols-[0.8fr_1.2fr] md:items-center"
    >
      <div>
        <p className="font-mono text-xs text-brand">Todo dia, em cada página</p>
        <p className="mt-3 font-heading text-2xl leading-snug sm:text-3xl">A conferência olha o que faz a página trazer contato.</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {itens.map((item, i) => (
          <li key={item} data-conferido-dia={apareceu ? "" : undefined} className="flex items-center gap-3 text-sm leading-6">
            <span
              style={{ transitionDelay: `${i * 200}ms` }}
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                apareceu ? "border-success bg-success text-white" : "text-transparent",
              )}
            >
              <CheckIcon className="size-3.5" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

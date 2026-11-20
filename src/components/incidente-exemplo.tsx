"use client";

import { useRef } from "react";
import { BellRingIcon, CheckIcon, MessageCircleIcon, TriangleAlertIcon, WrenchIcon } from "lucide-react";

import { useApareceu } from "@/components/motion/numero-que-sobe";
import { cn } from "@/lib/utils";

// "Quando algo dá errado" na página de manutenção (rodada de profundidade,
// Lucas, 2026-11-20): um exemplo do que acontece quando a página cai. O painel
// confere a página o tempo todo e avisa no celular na hora, a qualquer hora; o
// conserto vem no horário de trabalho, sem prometer suporte de madrugada.
// Quando aparece na tela, os passos entram um por vez.

const passos = [
  { hora: "03:12", titulo: "A página para de abrir", texto: "O servidor do domínio sai do ar de madrugada.", icone: TriangleAlertIcon, tom: "bg-destructive/15 text-destructive" },
  { hora: "03:12", titulo: "O aviso chega na hora", texto: "No celular, no mesmo minuto. Ninguém precisou te avisar.", icone: BellRingIcon, tom: "bg-brand text-brand-foreground" },
  { hora: "08:40", titulo: "O problema é resolvido", texto: "Logo no começo do dia, antes de a maioria das pessoas procurar.", icone: WrenchIcon, tom: "bg-muted" },
  { hora: "08:41", titulo: "No ar de novo", texto: "A conferência confirma: a página, o botão do WhatsApp e o cadeado funcionando.", icone: CheckIcon, tom: "bg-success text-white" },
  { hora: "08:45", titulo: "Você fica sabendo o que houve", texto: "Uma mensagem curta explicando o que aconteceu e o que foi feito.", icone: MessageCircleIcon, tom: "bg-muted" },
];

export function IncidenteExemplo() {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);

  return (
    <div ref={caixa} data-incidente data-apareceu={apareceu ? "" : undefined} className="rounded-3xl border bg-card p-6 shadow-2xl shadow-ink/10 sm:p-8">
      <div className="flex items-center justify-between gap-3 border-b pb-4">
        <p className="font-heading text-xl">Uma madrugada qualquer</p>
        <span className="rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">exemplo</span>
      </div>
      <ol className="relative mt-6 space-y-5 pl-12">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[1.0625rem] w-px bg-border" />
        {passos.map(({ hora, titulo, texto, icone: Icone, tom }, i) => (
          <li
            key={titulo}
            data-passo-visivel={apareceu ? "" : undefined}
            style={{ transitionDelay: `${i * 450}ms` }}
            className={cn("relative transition-all duration-500", apareceu ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}
          >
            <span className={cn("absolute top-0 -left-12 flex size-9 items-center justify-center rounded-full", tom)}>
              <Icone className="size-4" />
            </span>
            <p className="font-mono text-xs text-muted-foreground">{hora}</p>
            <p className="mt-0.5 font-medium">{titulo}</p>
            <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{texto}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import { useRef } from "react";

import { BrandMark } from "@/components/brand";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { useApareceu } from "@/components/motion/numero-que-sobe";
import { cn } from "@/lib/utils";

// "Como funciona", o que a gente vai te pedir: a mensagem de quando chega tudo,
// com o prazo escrito com data (Base, processo "Entrada do cliente", etapa
// "Confirmar e passar o prazo": a data vai com o dia da semana, não "14 dias
// úteis"). Exemplo, no tom das conversas reais. Quando aparece na tela, as
// mensagens entram uma por vez (transição do CSS: roda também com "reduzir
// animações" ligado).

const mensagens = [
  { de: "cliente", texto: "Pronto, respondi o formulário e coloquei as fotos na pasta!" },
  { de: "adsgator", texto: "Perfeito, recebi tudo aqui! O seu formulário ficou bem claro." },
  { de: "adsgator", texto: "Já começo a sua página. Até quinta, 10/12, você recebe tudo pronto para avaliar e aprovar." },
  { de: "adsgator", texto: "Se tiver qualquer dúvida no caminho, é só me chamar!" },
] as const;

export function PrazoNaConversa() {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);

  return (
    <div ref={caixa} data-prazo-conversa className="overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-ink/10">
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <BrandMark className="size-9 rounded-full" />
        <p className="font-medium">Adsgator</p>
        <span className="ml-auto rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">exemplo</span>
        <span className="flex size-8 items-center justify-center rounded-full bg-success text-white">
          <IconeWhatsApp className="size-4" />
        </span>
      </div>
      <div className="flex flex-col gap-3 bg-muted/40 p-5 text-sm">
        {mensagens.map((m, i) => (
          <p
            key={m.texto}
            data-mensagem-vista={apareceu ? "" : undefined}
            style={{ transitionDelay: `${i * 700}ms` }}
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-2.5 leading-6 transition-all duration-500",
              m.de === "cliente" ? "ml-auto rounded-tr-sm bg-success/15" : "rounded-tl-sm border bg-background",
              apareceu ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            {m.texto}
          </p>
        ))}
      </div>
    </div>
  );
}

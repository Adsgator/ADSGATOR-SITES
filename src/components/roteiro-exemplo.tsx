"use client";

import { useRef } from "react";
import { CheckIcon } from "lucide-react";

import { useApareceu } from "@/components/motion/numero-que-sobe";
import { segmentos } from "@/config/segmentos";
import { cn } from "@/lib/utils";

// O roteiro de exemplo na página de landing page (rodada de profundidade,
// Lucas, 2026-11-20): o que o cliente aprova antes do layout (Base, "Serviços e
// preços": o roteiro tem as seções e a mensagem principal; o visual é da
// Adsgator), do cliente fictício eletricista. Quando aparece na tela, as
// seções se marcam uma por vez e o "Aprovado" entra no fim.

const s = segmentos[0];

const secoes = [
  { nome: "Topo", conteudo: `A mensagem principal, o selo “${s.selo}”, o botão “${s.cta}” e os diferenciais` },
  { nome: "Serviços", conteudo: s.servicos.map((x) => x.titulo).join(", ") },
  { nome: "Quem somos", conteudo: "A equipe, com foto, e há quanto tempo atende a região" },
  { nome: "Como funciona", conteudo: s.passos.join(" · ") },
  { nome: "Depoimentos", conteudo: "Dois clientes contando como foi" },
  { nome: "Perguntas frequentes", conteudo: s.perguntas.join(" · ") },
  { nome: "Onde atendemos", conteudo: s.area.join(", ") },
  { nome: "Chamada final", conteudo: `“${s.chamada}” e o botão do WhatsApp` },
  { nome: "Rodapé", conteudo: "A cidade, o horário e os contatos" },
];

export function RoteiroExemplo() {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);

  return (
    <div ref={caixa} data-roteiro data-apareceu={apareceu ? "" : undefined} className="relative rounded-3xl border bg-card p-6 shadow-2xl shadow-ink/10 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-5">
        <div>
          <p className="font-mono text-xs text-muted-foreground">Roteiro da página · exemplo</p>
          <p className="mt-1 font-heading text-2xl">{s.nome}</p>
        </div>
        <span
          data-aprovado
          style={{ transitionDelay: `${secoes.length * 220 + 300}ms` }}
          className={cn(
            "inline-flex -rotate-6 items-center gap-1.5 rounded-xl border-2 border-success px-3 py-1 font-mono text-sm font-semibold text-success uppercase transition-all duration-500",
            apareceu ? "scale-100 opacity-100" : "scale-150 opacity-0",
          )}
        >
          <CheckIcon className="size-4" />
          Aprovado
        </span>
      </div>
      <div className="mt-5 rounded-2xl bg-brand/12 px-4 py-3">
        <p className="font-mono text-xs text-muted-foreground">Mensagem principal</p>
        <p className="mt-1 font-heading text-xl leading-snug">
          {s.titulo} {s.tituloDestaque}.
        </p>
      </div>
      <ol className="mt-5 space-y-3 text-sm">
        {secoes.map(({ nome, conteudo }, i) => (
          <li key={nome} data-secao-marcada={apareceu ? "" : undefined} className="flex gap-3">
            <span
              style={{ transitionDelay: `${i * 220}ms` }}
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                apareceu ? "border-brand bg-brand text-brand-foreground" : "text-transparent",
              )}
            >
              <CheckIcon className="size-3" />
            </span>
            <span>
              <span className="font-medium">{nome}:</span> <span className="text-muted-foreground">{conteudo}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-6 border-t pt-4 text-sm text-muted-foreground">Você aprova o roteiro. O visual fica por conta da Adsgator.</p>
    </div>
  );
}

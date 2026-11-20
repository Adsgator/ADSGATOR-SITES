"use client";

import { useEffect, useRef } from "react";

import { useParteAtiva } from "@/components/motion/use-parte-ativa";
import { PaginaCliente } from "@/components/pagina-cliente";
import { segmentos } from "@/config/segmentos";
import { cn } from "@/lib/utils";

// "A página por dentro" na página de landing page (rodada de profundidade,
// Lucas, 2026-11-20): a página do cliente fictício eletricista num celular
// preso ao lado (em cima, no celular), com a parte da vez contornada e a tela
// descendo até ela, enquanto a explicação passa na rolagem. As partes são as
// nove da PaginaCliente, as de uma página completa.

const partes = [
  {
    titulo: "O topo: a mensagem principal",
    texto: "Em segundos, a pessoa entende o que você faz, onde atende e o que fazer. O botão do WhatsApp já está ali, com a mensagem pronta, e os diferenciais logo abaixo.",
  },
  {
    titulo: "Os serviços",
    texto: "O que você faz, em cartões curtos, com as palavras que o seu cliente usa para procurar.",
  },
  {
    titulo: "Quem somos",
    texto: "Quem está por trás do negócio, com foto. As pessoas chamam com mais confiança quem elas sentem que conhecem.",
  },
  {
    titulo: "Como funciona",
    texto: "Os passos até ser atendido. Quem sabe o que vai acontecer chama sem medo.",
  },
  {
    titulo: "Os depoimentos",
    texto: "O que outros clientes dizem. Para quem ainda não te conhece, é a prova mais forte.",
  },
  {
    titulo: "As perguntas frequentes",
    texto: "As dúvidas que você responde todo dia no WhatsApp, já respondidas na página.",
  },
  {
    titulo: "Onde atende",
    texto: "Os bairros e as cidades que você atende, para a pessoa saber na hora que é com você.",
  },
  {
    titulo: "A chamada final",
    texto: "Para quem leu até o fim, o convite de novo, com o botão do WhatsApp.",
  },
  {
    titulo: "O rodapé e o botão flutuante",
    texto: "A cidade e os dados do negócio, e o botão do WhatsApp sempre à mão, em qualquer ponto da página.",
  },
];

const s = segmentos[0];

export function PaginaPorDentro() {
  const lista = useRef<HTMLOListElement>(null);
  const celular = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLDivElement>(null);
  const pagina = useRef<HTMLDivElement>(null);
  const ativa = useParteAtiva(lista, celular);

  // A tela desce até a parte da vez (sem passar do fim da página).
  useEffect(() => {
    const t = tela.current;
    const p = pagina.current;
    const parte = p?.querySelector<HTMLElement>(`[data-parte="${ativa}"]`);
    if (!t || !p || !parte) return;
    const y = Math.min(p.scrollHeight - t.clientHeight, Math.max(0, parte.offsetTop - 24));
    p.style.transform = `translateY(${-y}px)`;
  }, [ativa]);

  return (
    <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
      <div className="sticky top-20 z-10 self-start md:top-28">
        <div ref={celular} aria-hidden="true" data-pagina-por-dentro className="mx-auto w-[13rem] sm:w-[15rem] md:w-[16.5rem]">
          <div className="rounded-[2.6rem] bg-ink p-2 shadow-2xl shadow-ink/25">
            <div className="flex aspect-[9/17] flex-col overflow-hidden rounded-[2.1rem] bg-paper text-ink md:aspect-[9/18.5]">
              <p className="border-b border-ink/10 py-2 text-center font-mono text-[0.6rem] text-ink/60">{s.site}</p>
              <div ref={tela} className="relative flex-1 overflow-hidden">
                <div ref={pagina} className="transition-transform duration-700 ease-(--ease-out)">
                  <PaginaCliente s={s} destaque={ativa} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ol ref={lista} className="space-y-6 md:space-y-14 md:py-16">
        {partes.map(({ titulo, texto }, i) => (
          <li
            key={titulo}
            data-ativa={i === ativa ? "" : undefined}
            className={cn("rounded-3xl border p-6 transition-colors duration-300", i === ativa ? "border-brand bg-card" : "bg-transparent")}
          >
            <p className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 font-heading text-2xl leading-tight">{titulo}</h3>
            <p className="mt-2 leading-7 text-muted-foreground">{texto}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

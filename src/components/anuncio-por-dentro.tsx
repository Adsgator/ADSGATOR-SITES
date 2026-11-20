"use client";

import { useRef } from "react";
import { MapPinIcon } from "lucide-react";

import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { useParteAtiva } from "@/components/motion/use-parte-ativa";
import { segmentos } from "@/config/segmentos";
import { cn } from "@/lib/utils";

// "O anúncio por dentro" na página de Google Ads (rodada de profundidade,
// Lucas, 2026-11-20): um anúncio de pesquisa grande, do cliente fictício
// eletricista, em que cada parte acende quando a explicação dela passa na
// rolagem. As partes são as que o processo de Google Ads monta (Base: títulos
// e descrições, sitelinks, frases de destaque, WhatsApp e local). O anúncio
// fica preso ao lado (embaixo do topo, no celular).

const partes = [
  {
    titulo: "O título",
    texto: "O que a pessoa procurou, dito do jeito do seu negócio. São até 15 títulos por grupo, e o Google testa as combinações para achar a que mais traz contato.",
  },
  {
    titulo: "A descrição",
    texto: "O que você resolve e por que chamar agora: atendimento no mesmo dia, a região, o orçamento pelo WhatsApp.",
  },
  {
    titulo: "Os destaques",
    texto: "As frases curtas que fazem diferença para quem está comparando: garantia, nota fiscal, técnicos com NR-10.",
  },
  {
    titulo: "Os links extras",
    texto: "Atalhos para os serviços da sua página. O anúncio fica maior e a pessoa já cai no que procurava.",
  },
  {
    titulo: "O WhatsApp e o local",
    texto: "O botão do WhatsApp no próprio anúncio e, quando você tem perfil no Google, o endereço e o horário.",
  },
];

const s = segmentos[0];

export function AnuncioPorDentro() {
  const lista = useRef<HTMLOListElement>(null);
  const anuncio = useRef<HTMLDivElement>(null);
  const ativa = useParteAtiva(lista, anuncio);
  const marca = (i: number) =>
    cn("rounded-lg transition-all duration-300", i === ativa ? "bg-brand/15 ring-2 ring-brand ring-offset-4 ring-offset-card" : "");

  return (
    <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
      <div className="sticky top-20 z-10 self-start md:top-28">
        <div ref={anuncio} aria-hidden="true" data-anuncio-grande className="rounded-3xl border bg-card p-5 shadow-2xl shadow-ink/10 sm:p-7">
          <p className="text-xs font-semibold">Patrocinado</p>
          <div className="mt-2 flex items-center gap-2.5">
            <span style={{ background: s.fundo, color: s.destaque }} className="flex size-8 items-center justify-center rounded-full">
              <s.icone className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium">{s.nome}</p>
              <p className="text-xs text-muted-foreground">{s.site}</p>
            </div>
          </div>
          <p data-parte-anuncio={0} className={cn("mt-3 font-heading text-xl leading-snug text-[#1a4fb8] sm:text-2xl dark:text-[#8ab4f8]", marca(0))}>
            {s.anuncio}
          </p>
          <p data-parte-anuncio={1} className={cn("mt-2 text-sm leading-6 text-muted-foreground", marca(1))}>
            {s.anuncioTexto} Instalações, reparos e quadros com segurança.
          </p>
          <p data-parte-anuncio={2} className={cn("mt-2 text-sm text-muted-foreground", marca(2))}>
            {s.diferenciais.join(" · ")}
          </p>
          <div data-parte-anuncio={3} className={cn("mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#1a4fb8] dark:text-[#8ab4f8]", marca(3))}>
            {s.servicos.map((servico) => (
              <span key={servico.titulo}>{servico.titulo}</span>
            ))}
          </div>
          <div data-parte-anuncio={4} className={cn("mt-4 flex flex-wrap items-center gap-3 text-sm", marca(4))}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1.5 text-white">
              <IconeWhatsApp className="size-3.5" />
              WhatsApp
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <MapPinIcon className="size-3.5" />
              {s.cidade} · aberto agora
            </span>
          </div>
        </div>
      </div>

      <ol ref={lista} className="space-y-6 md:space-y-24 md:py-10">
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

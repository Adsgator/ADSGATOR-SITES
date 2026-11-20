"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  BarChart3Icon,
  CheckIcon,
  CookieIcon,
  FileTextIcon,
  KeyRoundIcon,
  LockIcon,
  PenToolIcon,
  SmartphoneIcon,
} from "lucide-react";

import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { useMotionPaused } from "@/components/motion/motion-scope";
import { useApareceu } from "@/components/motion/numero-que-sobe";
import { portfolio } from "@/config/portfolio";
import { cn } from "@/lib/utils";

// Portfólio, "O que toda página tem" (rodada de profundidade, decisão 3 A do
// Lucas, 2026-11-20): o padrão de toda página da Adsgator hoje, com os itens
// que a conferência de todo dia olha nas páginas com manutenção. Não marca item
// por item em cada página do portfólio: das que não estão no ar, só há imagens.
// Quando aparece na tela, os itens se marcam um por vez (transição do CSS: roda
// também com "reduzir animações" ligado), e o celular passa pelas páginas do
// portfólio. Precisa estar dentro de um MotionScope (botão de pausar).

const itens = [
  { titulo: "WhatsApp a um toque", texto: "Com a mensagem pronta, para a pessoa só apertar enviar.", icone: <IconeWhatsApp className="size-4" /> },
  { titulo: "Rápida no celular", texto: "Pensada primeiro para o celular, onde a maior parte das pessoas procura.", icone: <SmartphoneIcon className="size-4" /> },
  { titulo: "Sob medida", texto: "Desenhada para o seu negócio, sem modelo pronto.", icone: <PenToolIcon className="size-4" /> },
  { titulo: "Contatos medidos", texto: "Cada toque no WhatsApp é contado.", icone: <BarChart3Icon className="size-4" /> },
  { titulo: "Aviso de cookies", texto: "Como a lei pede.", icone: <CookieIcon className="size-4" /> },
  { titulo: "Cadeado de segurança", texto: "Sem o aviso de “não seguro” no navegador.", icone: <LockIcon className="size-4" /> },
  { titulo: "Privacidade e termos", texto: "As páginas que todo site precisa ter.", icone: <FileTextIcon className="size-4" /> },
  { titulo: "No seu nome", texto: "O endereço e a página são seus.", icone: <KeyRoundIcon className="size-4" /> },
];

const TROCA_MS = 2600;

export function TodaPaginaTem() {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);
  const pausado = useMotionPaused();
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    if (!apareceu || pausado) return;
    const id = setInterval(() => setAtual((a) => (a + 1) % portfolio.length), TROCA_MS);
    return () => clearInterval(id);
  }, [apareceu, pausado]);

  return (
    <div ref={caixa} data-toda-pagina className="grid items-center gap-12 lg:grid-cols-[0.75fr_1.25fr]">
      <div className="relative mx-auto w-56 sm:w-64">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/4 h-56 rounded-full bg-brand/30 blur-3xl" />
        <div className="relative aspect-[390/844] overflow-hidden rounded-[2rem] border-[6px] border-ink bg-ink shadow-2xl">
          {portfolio.map(({ id }, i) => (
            <Image
              key={id}
              src={`/portfolio/${id}-cel.jpg`}
              alt=""
              fill
              sizes="16rem"
              data-celular-atual={i === atual ? "" : undefined}
              className={cn("rounded-[1.5rem] object-cover object-top transition-opacity duration-700", i === atual ? "opacity-100" : "opacity-0")}
            />
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-xs text-muted-foreground">{portfolio[atual].segmento}</p>
      </div>
      <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {itens.map(({ titulo, texto, icone }, i) => (
          <li key={titulo} className="flex gap-4">
            <span
              data-item-marcado={apareceu ? "" : undefined}
              style={{ transitionDelay: `${i * 180}ms` }}
              className={cn(
                "relative flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300",
                apareceu ? "border-brand bg-brand text-brand-foreground" : "bg-card text-muted-foreground",
              )}
            >
              {icone}
              <span
                aria-hidden="true"
                style={{ transitionDelay: `${i * 180 + 150}ms` }}
                className={cn(
                  "absolute -right-1.5 -bottom-1.5 flex size-4.5 items-center justify-center rounded-full bg-success text-white transition-transform duration-300",
                  apareceu ? "scale-100" : "scale-0",
                )}
              >
                <CheckIcon className="size-3" />
              </span>
            </span>
            <div>
              <p className="font-medium">{titulo}</p>
              <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

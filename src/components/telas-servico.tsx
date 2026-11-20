"use client";

import { useRef } from "react";
import { CheckIcon, MessageCircleIcon, SearchIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * As "telas" do serviço da Adsgator (busca no Google, página no celular e a
 * conversa no WhatsApp), inclinadas em 3D e endireitando com a rolagem, como
 * as telas do produto na referência do Zouti (plano geral, Parte 1). Desenhadas
 * em código, sem dado de cliente e sem número que pareça resultado. Com
 * "reduzir animações", o CSS anula o 3D e o deslocamento (sem diferença entre
 * o servidor e o navegador) e elas só esmaecem.
 */
export function TelasServico() {
  const palco = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: palco,
    offset: ["start end", "center center"],
  });
  const inclinacao = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const escala = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const subida = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const opacidade = useTransform(scrollYProgress, [0, 0.5], [0.35, 1]);

  return (
    <div ref={palco} className="relative mx-auto mt-14 max-w-6xl px-4 [perspective:1400px] sm:mt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-80 max-w-3xl rounded-full bg-brand/35 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        style={{ rotateX: inclinacao, scale: escala, opacity: opacidade, transformOrigin: "50% 100%" }}
        data-palco
        className="relative h-[38rem] motion-reduce:transform-none! sm:h-[36rem]"
      >
        <motion.div
          style={{ y: subida }}
          className="absolute top-0 left-0 z-10 w-[78%] origin-top-left scale-[0.8] motion-reduce:transform-none! sm:top-4 sm:w-[22rem] sm:scale-100 lg:top-16"
        >
          <BuscaGoogle />
        </motion.div>
        <div className="absolute top-20 left-1/2 w-[14rem] -translate-x-1/2 sm:top-0 sm:w-[16.5rem]">
          <Celular />
        </div>
        <motion.div
          style={{ y: subida }}
          className="absolute right-0 bottom-0 z-10 w-[80%] origin-bottom-right scale-[0.8] motion-reduce:transform-none! sm:bottom-2 sm:w-[21rem] sm:scale-100 lg:bottom-16"
        >
          <ConversaWhatsApp />
        </motion.div>
      </motion.div>
    </div>
  );
}

function BuscaGoogle() {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-2xl shadow-ink/10">
      <div className="flex items-center gap-3 rounded-full border bg-background px-4 py-2.5 text-sm">
        <SearchIcon className="size-4 text-muted-foreground" />
        eletricista em campinas
      </div>
      <p className="mt-5 text-xs font-semibold">Patrocinado</p>
      <div className="mt-2 flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-full bg-brand font-heading text-xs text-brand-foreground">
          S
        </span>
        <div className="leading-tight">
          <p className="text-sm font-medium">Seu Negócio</p>
          <p className="text-xs text-muted-foreground">seunegocio.com.br</p>
        </div>
      </div>
      <p className="mt-3 font-heading text-xl leading-snug">Eletricista em Campinas · Atendimento hoje</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Orçamento pelo WhatsApp. Atendemos Campinas e região.
      </p>
    </div>
  );
}

function Celular() {
  return (
    <div className="rounded-[2.6rem] bg-ink p-2 shadow-2xl shadow-ink/25">
      <div className="flex aspect-[9/18.5] flex-col overflow-hidden rounded-[2.1rem] bg-paper text-ink">
        <p className="border-b border-ink/10 py-2 text-center font-mono text-[0.6rem] text-ink/60">
          seunegocio.com.br
        </p>
        <div className="flex flex-1 flex-col px-4 pt-5">
          <span className="h-1.5 w-16 rounded-full bg-brand" />
          <p className="mt-3 font-heading text-[1.4rem] leading-tight">
            Eletricista em Campinas, no mesmo dia
          </p>
          <span className="mt-3 h-2 w-full rounded-full bg-ink/10" />
          <span className="mt-2 h-2 w-4/5 rounded-full bg-ink/10" />
          <div className="bg-pattern-light mt-4 h-24 rounded-2xl border border-ink/10" />
          <ul className="mt-4 space-y-2.5">
            {["w-3/4", "w-2/3", "w-4/5"].map((largura) => (
              <li key={largura} className="flex items-center gap-2">
                <span className="flex size-4 items-center justify-center rounded-full bg-brand text-ink">
                  <CheckIcon className="size-2.5" />
                </span>
                <span className={`h-2 rounded-full bg-ink/10 ${largura}`} />
              </li>
            ))}
          </ul>
          <span className="mt-auto mb-4 flex h-10 items-center justify-center gap-2 rounded-full bg-brand text-xs font-medium text-ink">
            <MessageCircleIcon className="size-3.5" />
            Chamar no WhatsApp
          </span>
        </div>
      </div>
    </div>
  );
}

function ConversaWhatsApp() {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-2xl shadow-ink/10">
      <div className="flex items-center gap-3 border-b pb-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-success text-white">
          <MessageCircleIcon className="size-4" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-medium">Seu Negócio</p>
          <p className="text-xs text-muted-foreground">WhatsApp</p>
        </div>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-2.5 whitespace-nowrap py-0.5 text-[0.7rem] font-medium text-brand-foreground">
          <span className="size-1.5 rounded-full bg-brand-foreground" />
          Veio do anúncio
        </span>
      </div>
      <div className="mt-4 space-y-2.5 text-sm">
        <p className="max-w-[85%] rounded-2xl rounded-tl-sm border bg-background px-3.5 py-2.5 leading-5">
          Oi! Vi o anúncio no Google. Vocês conseguem vir hoje?
        </p>
        <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-success/15 px-3.5 py-2.5 leading-5">
          Conseguimos sim! Me passa o endereço que eu já te confirmo o horário.
        </p>
      </div>
    </div>
  );
}

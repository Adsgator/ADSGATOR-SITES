"use client";

import { useRef } from "react";
import { SearchIcon } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";

import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { useCiclo } from "@/components/motion/use-ciclo";
import { PaginaCliente } from "@/components/pagina-cliente";
import { segmentos, type Segmento } from "@/config/segmentos";

/**
 * As "telas" do serviço da Adsgator (busca no Google, página no celular e a
 * conversa no WhatsApp), inclinadas em 3D e endireitando com a rolagem, como
 * as telas do produto na referência do Zouti (plano geral, Parte 1). Os
 * segmentos se revezam (eletricista, dentista, advogado, pet shop), para a
 * página geral não parecer de um segmento só. Desenhadas em código, sem dado
 * de cliente nem número que pareça resultado. Com "reduzir animações", o CSS
 * anula o 3D e o deslocamento; a troca de segmento só esmaece.
 */
export function TelasServico() {
  const palco = useRef<HTMLDivElement>(null);
  const s = segmentos[useCiclo(segmentos.length, 7000)];
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
        data-palco
        style={{ rotateX: inclinacao, scale: escala, opacity: opacidade, transformOrigin: "50% 100%" }}
        className="relative h-[38rem] motion-reduce:transform-none! sm:h-[36rem]"
      >
        <motion.div
          style={{ y: subida }}
          className="absolute top-0 left-0 z-10 w-[78%] origin-top-left scale-[0.8] motion-reduce:transform-none! sm:top-4 sm:w-[22rem] sm:scale-100 lg:top-16"
        >
          <BuscaGoogle s={s} />
        </motion.div>
        <div className="absolute top-20 left-1/2 w-[14rem] -translate-x-1/2 sm:top-0 sm:w-[16.5rem]">
          <Celular s={s} />
        </div>
        <motion.div
          style={{ y: subida }}
          className="absolute right-0 bottom-0 z-10 w-[80%] origin-bottom-right scale-[0.8] motion-reduce:transform-none! sm:bottom-2 sm:w-[21rem] sm:scale-100 lg:bottom-16"
        >
          <ConversaWhatsApp s={s} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Troca suave do conteúdo quando o segmento muda. */
function Troca({ chave, children }: { chave: string; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={chave}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function BuscaGoogle({ s, busca }: { s: Segmento; busca?: React.ReactNode }) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-2xl shadow-ink/10">
      <div className="flex items-center gap-3 rounded-full border bg-background px-4 py-2.5 text-sm">
        <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
        {busca ?? s.busca}
      </div>
      <Troca chave={s.id}>
        <p className="mt-5 text-xs font-semibold">Patrocinado</p>
        <div className="mt-2 flex items-center gap-2.5">
          <span
            style={{ background: s.fundo, color: s.destaque }}
            className="flex size-7 items-center justify-center rounded-full"
          >
            <s.icone className="size-3.5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium">{s.nome}</p>
            <p className="text-xs text-muted-foreground">{s.site}</p>
          </div>
        </div>
        <p className="mt-3 font-heading text-xl leading-snug">{s.anuncio}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{s.anuncioTexto}</p>
      </Troca>
    </div>
  );
}

export function Celular({ s }: { s: Segmento }) {
  return (
    <div className="rounded-[2.6rem] bg-ink p-2 shadow-2xl shadow-ink/25">
      <div className="flex aspect-[9/18.5] flex-col overflow-hidden rounded-[2.1rem] bg-paper text-ink">
        <p className="border-b border-ink/10 py-2 text-center font-mono text-[0.6rem] text-ink/60">{s.site}</p>
        <div className="flex-1 overflow-hidden">
          <Troca chave={s.id}>
            <PaginaCliente s={s} />
          </Troca>
        </div>
      </div>
    </div>
  );
}

export function ConversaWhatsApp({ s }: { s: Segmento }) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-2xl shadow-ink/10">
      <div className="flex items-center gap-3 border-b pb-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success text-white">
          <IconeWhatsApp className="size-4" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-medium">{s.nome}</p>
          <p className="text-xs text-muted-foreground">WhatsApp</p>
        </div>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-2.5 py-0.5 text-[0.7rem] font-medium whitespace-nowrap text-brand-foreground">
          <span className="size-1.5 rounded-full bg-brand-foreground" />
          Veio do anúncio
        </span>
      </div>
      <Troca chave={s.id}>
        <div className="mt-4 space-y-2.5 text-sm">
          <p className="max-w-[85%] rounded-2xl rounded-tl-sm border bg-background px-3.5 py-2.5 leading-5">{s.mensagem}</p>
          <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-success/15 px-3.5 py-2.5 leading-5">{s.resposta}</p>
        </div>
      </Troca>
    </div>
  );
}

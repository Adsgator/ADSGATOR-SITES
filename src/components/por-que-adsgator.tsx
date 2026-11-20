"use client";

import Image from "next/image";
import { useRef } from "react";
import { CalendarCheckIcon, CheckIcon, HandshakeIcon, KeyRoundIcon, LockIcon, MessagesSquareIcon, RulerIcon } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";
import { FundoVivo } from "@/components/fundo-vivo";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { segmentos } from "@/config/segmentos";
import { cn } from "@/lib/utils";

// "Por que a Adsgator" (roteiro do site, Início, seção 7). O texto acende
// palavra por palavra com a rolagem e, embaixo, os cinco pontos da posição
// (Base, "Voz e posição") viram cartões grandes que se empilham um sobre o
// outro ao rolar, cada um com um visual próprio (pedido do Lucas, 2026-11-20:
// menos blocado e mais trabalhado). O empilhamento é CSS (`sticky`), leve.

const frase =
  "Feito sob medida para o seu negócio, tudo no seu nome e sem fidelidade. Você fala direto com quem faz o trabalho e, todo mês, sabe exatamente o que chegou.";

const pontos = [
  {
    icone: KeyRoundIcon,
    titulo: "Tudo no seu nome",
    texto: "A conta do Google Ads, a página e o domínio ficam no seu nome. Se um dia você quiser seguir sem a Adsgator, tudo continua seu.",
    visual: <VisualNome />,
    tom: "bg-card",
  },
  {
    icone: HandshakeIcon,
    titulo: "Sem fidelidade",
    texto: "Sem contrato de meses nem multa. Você fica porque está valendo a pena, e pode cancelar quando quiser e voltar quando quiser.",
    visual: <VisualFidelidade />,
    tom: "dark section-ink bg-background text-foreground",
  },
  {
    icone: RulerIcon,
    titulo: "Sob medida",
    texto: "Nada de modelo pronto. A campanha e a página são pensadas para o seu serviço, a sua região e quem você quer atender.",
    visual: <VisualMedida />,
    tom: "bg-card",
  },
  {
    icone: MessagesSquareIcon,
    titulo: "Direto com quem faz",
    texto: "Sem atendente no meio do caminho. Você fala com quem cuida da sua conta e da sua página, pelo WhatsApp.",
    visual: <VisualDireto />,
    tom: "dark section-ink bg-background text-foreground",
  },
  {
    icone: CalendarCheckIcon,
    titulo: "Resumo todo mês",
    texto: "Todo mês, um resumo claro do que chegou: quantas pessoas viram e quantas tocaram no WhatsApp, explicado sem complicação.",
    visual: <VisualResumo />,
    tom: "bg-card",
  },
];

function Palavra({ progresso, faixa, children }: { progresso: MotionValue<number>; faixa: [number, number]; children: string }) {
  const opacidade = useTransform(progresso, faixa, [0.15, 1]);
  return <motion.span style={{ opacity: opacidade }}>{children} </motion.span>;
}

export function PorQueAdsgator() {
  const texto = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: texto, offset: ["start 0.85", "end 0.45"] });
  const palavras = frase.split(" ");

  return (
    <FundoVivo className="py-28">
      <div className="mx-auto max-w-5xl px-4">
        <Eyebrow>Por que a Adsgator</Eyebrow>
        <p ref={texto} className="mt-8 font-heading text-3xl leading-[1.2] tracking-tight sm:text-5xl">
          {palavras.map((palavra, i) => (
            <Palavra key={i} progresso={scrollYProgress} faixa={[i / palavras.length, (i + 1) / palavras.length]}>
              {palavra}
            </Palavra>
          ))}
        </p>
        <div className="mt-20 space-y-6">
          {pontos.map(({ icone: Icone, titulo, texto: descricao, visual, tom }, i) => (
            <article
              key={titulo}
              style={{ top: `calc(6rem + ${i * 1.25}rem)` }}
              className={cn(
                "sticky grid items-center gap-8 overflow-hidden rounded-[2rem] border p-8 shadow-[0_30px_60px_-40px_rgb(31_39_27/0.6)] sm:p-12 md:min-h-[22rem] md:grid-cols-[1fr_1.05fr]",
                tom,
              )}
            >
              <div>
                <div className="flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
                    <Icone className="size-6" />
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">0{i + 1} / 05</span>
                </div>
                <h3 className="mt-6 font-heading text-3xl leading-tight sm:text-4xl">{titulo}</h3>
                <p className="mt-4 max-w-md text-lg leading-8 text-muted-foreground">{descricao}</p>
              </div>
              <div aria-hidden="true" className="relative">{visual}</div>
            </article>
          ))}
        </div>
      </div>
    </FundoVivo>
  );
}

function VisualNome() {
  return (
    <div className="space-y-3">
      {["Conta do Google Ads", "Domínio seunegocio.com.br", "Página e arquivos"].map((item) => (
        <div key={item} className="flex items-center gap-3 rounded-2xl border bg-background/70 p-4">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <LockIcon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item}</p>
            <p className="text-xs text-muted-foreground">Titular: Seu Negócio</p>
          </div>
          <CheckIcon className="size-4 text-brand" />
        </div>
      ))}
    </div>
  );
}

function VisualFidelidade() {
  return (
    <div className="rounded-3xl border bg-background/60 p-6">
      <p className="font-mono text-xs text-muted-foreground">Seu plano</p>
      <div className="mt-4 flex items-center justify-between rounded-2xl border px-4 py-3">
        <span className="text-sm">Renova todo mês, sem prazo mínimo</span>
        <span className="flex h-6 w-11 items-center rounded-full bg-brand p-0.5">
          <span className="ml-auto size-5 rounded-full bg-white shadow" />
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm">
        <span>Multa para cancelar</span>
        <span className="font-heading text-xl text-brand">Nenhuma</span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Cancele quando quiser. Volte quando quiser.</p>
    </div>
  );
}

function VisualMedida() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {segmentos.map((s) => (
        <div key={s.id} style={{ background: s.fundo }} className="rounded-2xl p-4 text-white">
          <span style={{ background: s.destaque, color: s.fundo }} className="flex size-8 items-center justify-center rounded-lg">
            <s.icone className="size-4" />
          </span>
          <p className="mt-6 text-sm font-semibold">{s.nome}</p>
          <span style={{ background: s.destaque }} className="mt-2 block h-1 w-10 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function VisualDireto() {
  return (
    <div className="rounded-3xl border bg-background/60 p-5">
      <div className="flex items-center gap-3 border-b pb-3">
        <span className="relative size-10 overflow-hidden rounded-full">
          <Image src="/sobre/lucas.jpg" alt="" fill sizes="40px" className="object-cover" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-medium">Lucas · Adsgator</p>
          <p className="text-xs text-muted-foreground">online</p>
        </div>
        <IconeWhatsApp className="ml-auto size-5 text-success" />
      </div>
      <div className="mt-4 space-y-2.5 text-sm">
        <p className="max-w-[85%] rounded-2xl rounded-tl-sm border px-3.5 py-2.5">Lucas, dá para mudar o horário no anúncio?</p>
        <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-success/20 px-3.5 py-2.5">Dá sim! Já ajusto e te aviso quando estiver no ar.</p>
      </div>
    </div>
  );
}

function VisualResumo() {
  return (
    <div className="rounded-3xl border bg-background/60 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Resumo do mês</p>
        <IconeWhatsApp className="size-5 text-success" />
      </div>
      <p className="text-xs text-muted-foreground">Toques no WhatsApp, semana a semana</p>
      <div className="mt-5 flex h-28 items-end gap-3">
        {[0.35, 0.55, 0.5, 0.75, 0.65, 0.9].map((altura, i) => (
          <span key={i} style={{ height: `${altura * 100}%` }} className="flex-1 rounded-t-lg bg-brand/80" />
        ))}
      </div>
    </div>
  );
}

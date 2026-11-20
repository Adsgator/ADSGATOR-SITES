"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CalendarCheckIcon, CheckIcon, HandshakeIcon, KeyRoundIcon, LockIcon, MessagesSquareIcon, RulerIcon } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";
import { FundoVivo } from "@/components/fundo-vivo";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { NumeroQueSobe, useApareceu } from "@/components/motion/numero-que-sobe";
import { portfolio } from "@/config/portfolio";
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
              <div aria-hidden="true" className="relative min-w-0">{visual}</div>
            </article>
          ))}
        </div>
      </div>
    </FundoVivo>
  );
}

// Os visuais se animam quando o cartão aparece na tela (pedido do Lucas,
// 2026-11-20: estavam parados). Transições do CSS e tempo do JavaScript: rodam
// também com "reduzir animações" ligado.

function VisualNome() {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);
  return (
    <div ref={caixa} data-visual="nome" className="space-y-3">
      {["Conta do Google Ads", "Domínio seunegocio.com.br", "Página e arquivos"].map((item, i) => (
        <div
          key={item}
          style={{ transitionDelay: `${i * 250}ms` }}
          className={cn(
            "flex items-center gap-3 rounded-2xl border bg-background/70 p-4 transition-all duration-500",
            apareceu ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
          )}
        >
          <span
            style={{ transitionDelay: `${i * 250 + 300}ms` }}
            className={cn(
              "flex size-9 items-center justify-center rounded-xl transition-colors duration-300",
              apareceu ? "bg-brand text-brand-foreground" : "bg-brand/15 text-brand",
            )}
          >
            <LockIcon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item}</p>
            <p className="text-xs text-muted-foreground">Titular: Seu Negócio</p>
          </div>
          <CheckIcon
            data-marcado={apareceu ? "" : undefined}
            style={{ transitionDelay: `${i * 250 + 450}ms` }}
            className={cn("size-4 text-brand transition-transform duration-300", apareceu ? "scale-100" : "scale-0")}
          />
        </div>
      ))}
    </div>
  );
}

function VisualFidelidade() {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);
  return (
    <div ref={caixa} data-visual="fidelidade" className="rounded-3xl border bg-background/60 p-6">
      <p className="font-mono text-xs text-muted-foreground">Seu plano</p>
      <div className="mt-4 flex items-center justify-between rounded-2xl border px-4 py-3">
        <span className="text-sm">Renova todo mês, sem prazo mínimo</span>
        <span
          data-ligado={apareceu ? "" : undefined}
          className={cn("flex h-6 w-11 items-center rounded-full p-0.5 transition-colors delay-300 duration-500", apareceu ? "bg-brand" : "bg-muted")}
        >
          <span className={cn("size-5 rounded-full bg-white shadow transition-transform delay-300 duration-500", apareceu ? "translate-x-5" : "translate-x-0")} />
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm">
        <span>Multa para cancelar</span>
        <span
          className={cn(
            "font-heading text-xl text-brand transition-all delay-1000 duration-500",
            apareceu ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          Nenhuma
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Cancele quando quiser. Volte quando quiser.</p>
    </div>
  );
}

// Sob medida: páginas de verdade do portfólio, cada uma com a identidade do
// cliente (pedido do Lucas: os blocos de cor eram genéricos). Três celulares
// que entram em leque e vão trocando de página, cada um no seu tempo.
const TROCA_MEDIDA_MS = 2800;

function VisualMedida() {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);
  const [rodada, setRodada] = useState(0);
  useEffect(() => {
    if (!apareceu) return;
    const id = setInterval(() => setRodada((r) => r + 1), TROCA_MEDIDA_MS);
    return () => clearInterval(id);
  }, [apareceu]);

  return (
    <div ref={caixa} data-visual="medida" className="flex items-end justify-center gap-3 sm:gap-4">
      {[0, 1, 2].map((celular) => {
        // Cada celular anda pela lista a partir de um ponto, sem repetir os vizinhos.
        const pagina = portfolio[(celular * 3 + rodada) % portfolio.length];
        return (
          <div
            key={celular}
            style={{ transitionDelay: `${celular * 180}ms` }}
            className={cn(
              "w-[30%] max-w-36 min-w-0 transition-all duration-700 ease-(--ease-out)",
              apareceu ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
              apareceu && celular === 0 && "-rotate-6",
              apareceu && celular === 1 && "-translate-y-4",
              apareceu && celular === 2 && "rotate-6",
            )}
          >
            <div className="relative aspect-[390/844] overflow-hidden rounded-[1.1rem] border-4 border-ink bg-ink shadow-xl">
              {portfolio.map(({ id }) => (
                <Image
                  key={id}
                  src={`/portfolio/${id}-cel.jpg`}
                  alt=""
                  fill
                  sizes="9rem"
                  data-pagina-medida={id === pagina.id ? celular : undefined}
                  className={cn("rounded-[0.8rem] object-cover object-top transition-opacity duration-700", id === pagina.id ? "opacity-100" : "opacity-0")}
                />
              ))}
            </div>
            <p className="mt-2 truncate text-center font-mono text-[0.65rem] text-muted-foreground">{pagina.segmento}</p>
          </div>
        );
      })}
    </div>
  );
}

// Direto com quem faz: a pergunta chega, o "digitando" e a resposta.
function VisualDireto() {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);
  const [etapa, setEtapa] = useState(0);
  useEffect(() => {
    if (!apareceu) return;
    const tempos = [400, 1400, 1300];
    if (etapa >= tempos.length) return;
    const id = setTimeout(() => setEtapa((e) => e + 1), tempos[etapa]);
    return () => clearTimeout(id);
  }, [apareceu, etapa]);

  return (
    <div ref={caixa} data-visual="direto" className="rounded-3xl border bg-background/60 p-5">
      <div className="flex items-center gap-3 border-b pb-3">
        <span className="relative size-10 overflow-hidden rounded-full">
          <Image src="/sobre/lucas.jpg" alt="" fill sizes="40px" className="object-cover" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-medium">Lucas · Adsgator</p>
          <p className="text-xs text-muted-foreground">{etapa === 2 ? "digitando…" : "online"}</p>
        </div>
        <IconeWhatsApp className="ml-auto size-5 text-success" />
      </div>
      <div className="mt-4 min-h-[7.5rem] space-y-2.5 text-sm">
        <p
          className={cn(
            "max-w-[85%] rounded-2xl rounded-tl-sm border px-3.5 py-2.5 transition-all duration-500",
            etapa >= 1 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          Lucas, dá para mudar o horário no anúncio?
        </p>
        {etapa === 2 ? (
          <span className="ml-auto flex w-14 items-center justify-center gap-1 rounded-2xl bg-success/20 px-3 py-3">
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ animationDelay: `${i * 150}ms` }} className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
            ))}
          </span>
        ) : (
          <p
            data-resposta={etapa >= 3 ? "" : undefined}
            className={cn(
              "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-success/20 px-3.5 py-2.5 transition-all duration-500",
              etapa >= 3 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            Dá sim! Já ajusto e te aviso quando estiver no ar.
          </p>
        )}
      </div>
    </div>
  );
}

// Resumo todo mês: as barras crescem e o total sobe.
const semanas = [0.35, 0.55, 0.5, 0.75, 0.65, 0.9];

function VisualResumo() {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);
  return (
    <div ref={caixa} data-visual="resumo" className="rounded-3xl border bg-background/60 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Resumo do mês</p>
        <IconeWhatsApp className="size-5 text-success" />
      </div>
      <p className="text-xs text-muted-foreground">Toques no WhatsApp, semana a semana · exemplo</p>
      <div className="mt-5 flex h-28 items-end gap-3">
        {semanas.map((altura, i) => (
          <span
            key={i}
            data-barra
            style={{ height: apareceu ? `${altura * 100}%` : "4%", transitionDelay: `${i * 120}ms` }}
            className="flex-1 rounded-t-lg bg-brand/80 transition-[height] duration-700 ease-(--ease-out)"
          />
        ))}
      </div>
      <p className="mt-4 flex items-baseline justify-between text-sm text-muted-foreground">
        No mês
        <span className="font-heading text-3xl text-foreground">
          <NumeroQueSobe valor={41} ativo={apareceu} duracao={1600} /> contatos
        </span>
      </p>
    </div>
  );
}

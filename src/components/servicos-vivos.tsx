"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRightIcon, CheckIcon, LockIcon, MessageCircleIcon, SearchIcon } from "lucide-react";
import { AnimatePresence, motion, MotionConfig, useScroll, useTransform } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";
import { FundoVivo } from "@/components/fundo-vivo";
import { MotionPauseButton, MotionScope, useMotionPaused } from "@/components/motion/motion-scope";
import { useDigitacao } from "@/components/motion/use-digitacao";
import { PaginaCliente } from "@/components/pagina-cliente";
import { cn } from "@/lib/utils";

// "O que a Adsgator faz" (roteiro do site, Início, seção 6): grade de cartões
// vivos, como os do Zouti (imagens que o Lucas mandou em 2026-11-20). Cada
// cartão mostra o serviço funcionando, sem número que pareça resultado. As
// colunas sobem e descem em ritmos diferentes com a rolagem. O que roda
// sozinho para no botão de pausar; com "reduzir animações", sem deslocamento.

export function ServicosVivos() {
  const area = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: area, offset: ["start end", "end start"] });
  const colunas = [
    useTransform(scrollYProgress, [0, 1], [60, -60]),
    useTransform(scrollYProgress, [0, 1], [0, 0]),
    useTransform(scrollYProgress, [0, 1], [110, -110]),
  ];

  const cartoes = [
    [
      { titulo: "Seu anúncio no topo", texto: "Para quem procura o seu serviço, na sua região, agora.", href: "/google-ads", visual: <AnuncioVivo /> },
      { titulo: "Tudo no seu nome", texto: "A conta, o domínio e a página são seus.", href: "/como-funciona", visual: <ChavesVivas /> },
    ],
    [
      { titulo: "Uma página que convence", texto: "Rápida no celular, feita para virar conversa.", href: "/landing-page", visual: <PaginaViva /> },
      { titulo: "Contatos chegando", texto: "Direto no seu WhatsApp, sabendo que vieram do anúncio.", href: "/google-ads", visual: <ContatosVivos /> },
    ],
    [
      { titulo: "Sempre no ar", texto: "Conferimos a sua página o dia todo.", href: "/manutencao", visual: <NoArVivo /> },
      { titulo: "Resumo do mês", texto: "O que chegou, explicado de um jeito claro, no WhatsApp.", href: "/como-funciona", visual: <ResumoVivo /> },
    ],
  ];

  return (
    <MotionConfig reducedMotion="user">
      <MotionScope>
        <FundoVivo className="py-28">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-end justify-between gap-6">
              <div>
                <Eyebrow>O que a Adsgator faz</Eyebrow>
                <h2 className="mt-6 font-heading text-4xl leading-[1.05] tracking-tight sm:text-6xl">
                  Do anúncio ao WhatsApp.
                  <br />
                  <span className="text-muted-foreground">Cuidado de ponta a ponta.</span>
                </h2>
              </div>
              <MotionPauseButton />
            </div>
            <div ref={area} className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
              {cartoes.map((coluna, i) => (
                <motion.div key={i} style={{ y: colunas[i] }} className="space-y-5 motion-reduce:transform-none!">
                  {coluna.map((cartao) => (
                    <Cartao key={cartao.titulo} {...cartao} />
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </FundoVivo>
      </MotionScope>
    </MotionConfig>
  );
}

function Cartao({ titulo, texto, href, visual }: { titulo: string; texto: string; href: string; visual: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-3xl border bg-card/80 p-6 shadow-[0_20px_50px_-30px_rgb(31_39_27/0.45)] backdrop-blur transition-[translate,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(31_39_27/0.55)]"
    >
      <div aria-hidden="true" className="relative h-52 overflow-hidden rounded-2xl border bg-background/70">
        {visual}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl">{titulo}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{texto}</p>
        </div>
        <ArrowUpRightIcon className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
      </div>
    </Link>
  );
}

/** Repete um ciclo enquanto a área não está pausada (para os cartões vivos). */
function useCiclo(passos: number, intervalo: number) {
  const pausado = useMotionPaused();
  const [passo, setPasso] = useState(0);
  useEffect(() => {
    if (pausado) return;
    const id = setInterval(() => setPasso((p) => (p + 1) % passos), intervalo);
    return () => clearInterval(id);
  }, [pausado, passos, intervalo]);
  return passo;
}

const anuncios = [
  { busca: "eletricista em campinas", site: "voltcampinas.com.br", titulo: "Eletricista em Campinas · Atendimento hoje" },
  { busca: "dentista perto de mim", site: "clinicasorrir.com.br", titulo: "Dentista no Cambuí · Agende sua avaliação" },
  { busca: "advogado trabalhista", site: "silvaadvocacia.com.br", titulo: "Advogado Trabalhista · Fale com um especialista" },
];
const buscasDoAnuncio = anuncios.map((a) => a.busca);

function AnuncioVivo() {
  const { texto, indice, pronto, visivel } = useDigitacao(buscasDoAnuncio, { inicio: 600, espera: 2600 });
  const anuncio = anuncios[indice];
  return (
    <div className="flex h-full flex-col gap-2.5 p-4">
      <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-xs">
        <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="min-h-4">{visivel ? texto : ""}</span>
        <span className="-ml-1.5 inline-block h-3.5 w-px animate-pulse bg-foreground" />
      </div>
      <motion.div
        animate={{ opacity: pronto ? 1 : 0, y: pronto ? 0 : 12 }}
        transition={{ duration: 0.45 }}
        className="rounded-xl border border-brand/50 bg-card p-3"
      >
        <p className="text-[0.65rem] font-semibold">Patrocinado · {anuncio.site}</p>
        <p className="mt-1 font-heading text-sm">{anuncio.titulo}</p>
      </motion.div>
      {[0, 1].map((n) => (
        <div key={n} className="rounded-xl border bg-card/50 p-3 opacity-50">
          <span className="block h-2 w-1/3 rounded-full bg-muted" />
          <span className="mt-2 block h-2.5 w-3/4 rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

function PaginaViva() {
  const pausado = useMotionPaused();
  return (
    <div className="mx-auto mt-4 h-full w-40 rounded-t-[1.6rem] bg-ink p-1.5 pb-0">
      <div className="h-full overflow-hidden rounded-t-[1.2rem] bg-paper">
        <motion.div
          animate={pausado ? undefined : { y: ["0%", "-62%", "0%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-[240px] origin-top-left scale-[0.615]">
            <PaginaCliente />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const contatos = [
  "Oi! Vi o anúncio. Vocês atendem hoje?",
  "Bom dia! Queria um orçamento.",
  "Vocês atendem na minha região?",
  "Quanto fica para fazer na semana que vem?",
];

function ContatosVivos() {
  const passo = useCiclo(contatos.length, 2200);
  const visiveis = [0, 1, 2].map((n) => (passo + n) % contatos.length);
  return (
    <div className="flex h-full flex-col justify-end gap-2 p-4">
      <AnimatePresence initial={false} mode="popLayout">
        {visiveis.map((indice, posicao) => (
          <motion.div
            key={indice}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: posicao === 2 ? 1 : 0.45, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 rounded-xl border bg-card p-2.5"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <MessageCircleIcon className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-medium">Novo contato · veio do anúncio</p>
              <p className="truncate text-xs text-muted-foreground">{contatos[indice]}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const itensNome = ["Conta do Google Ads", "Domínio", "Página e arquivos"];

function ChavesVivas() {
  const passo = useCiclo(itensNome.length + 2, 1200);
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 p-4">
      {itensNome.map((item, i) => {
        const ligado = passo > i;
        return (
          <div key={item} className="flex items-center justify-between rounded-xl border bg-card px-3 py-2.5">
            <span className="flex items-center gap-2 text-xs">
              <LockIcon className={cn("size-3.5 transition-colors", ligado ? "text-brand" : "text-muted-foreground")} />
              {item}
            </span>
            <span className={cn("flex h-5 w-9 items-center rounded-full p-0.5 transition-colors duration-300", ligado ? "bg-brand" : "bg-muted")}>
              <motion.span animate={{ x: ligado ? 16 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="size-4 rounded-full bg-white shadow" />
            </span>
          </div>
        );
      })}
      <p className="text-center font-mono text-[0.65rem] text-muted-foreground">no seu nome</p>
    </div>
  );
}

const conferencias = ["Página no ar", "Botão do WhatsApp", "Medição dos contatos", "Certificado de segurança"];

function NoArVivo() {
  const passo = useCiclo(conferencias.length + 2, 900);
  const pausado = useMotionPaused();
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-2.5 rounded-xl border bg-card px-3 py-2.5">
        <span className="relative flex size-2.5">
          <motion.span
            animate={pausado ? undefined : { scale: [1, 2.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-success"
          />
          <span className="relative size-2.5 rounded-full bg-success" />
        </span>
        <span className="text-xs font-medium">seunegocio.com.br</span>
        <span className="ml-auto font-mono text-[0.65rem] text-success">no ar</span>
      </div>
      <ul className="space-y-2">
        {conferencias.map((item, i) => (
          <li key={item} className="flex items-center gap-2 text-xs">
            <motion.span
              animate={{ scale: passo > i ? 1 : 0.6, opacity: passo > i ? 1 : 0.3 }}
              className="flex size-4 items-center justify-center rounded-full bg-brand text-ink"
            >
              <CheckIcon className="size-2.5" />
            </motion.span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResumoVivo() {
  const pausado = useMotionPaused();
  return (
    <div className="flex h-full flex-col justify-center p-4">
      <div className="rounded-2xl rounded-tl-sm border bg-card p-3">
        <p className="text-[0.7rem] font-medium">Resumo do mês</p>
        <p className="text-[0.65rem] text-muted-foreground">Toques no WhatsApp, semana a semana</p>
        <div className="mt-3 flex h-20 items-end gap-2">
          {[0.35, 0.5, 0.45, 0.7, 0.6, 0.85].map((altura, i) => (
            // Em onda: cada barra sobe e desce devagar, um pouco depois da anterior.
            <motion.span
              key={i}
              initial={{ height: `${altura * 45}%` }}
              animate={pausado ? undefined : { height: [`${altura * 45}%`, `${altura * 100}%`, `${altura * 45}%`] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.22 }}
              className="flex-1 rounded-t-md bg-brand/80"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

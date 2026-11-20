"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";
import { motion, useScroll } from "motion/react";

import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { buttonVariants } from "@/components/ui/button";
import { linkWhatsApp } from "@/config/site";
import { cn } from "@/lib/utils";

// Termos e Privacidade (pedido do Lucas, 2026-11-20: no visual do site e
// funcionais). O sumário sai dos títulos do próprio texto (h2 com id, do
// mdx-components.tsx) e acompanha a leitura: fixo ao lado no computador, numa
// barra que abre no celular. Barra de progresso no topo e, no fim, a dúvida
// pelo WhatsApp e o outro documento.

type Secao = { id: string; texto: string };

export function DocumentoLegal({
  children,
  assunto,
  outro,
}: {
  children: React.ReactNode;
  /** Para a mensagem pronta do WhatsApp: "os Termos de Serviço". */
  assunto: string;
  outro: { href: string; rotulo: string };
}) {
  const artigo = useRef<HTMLElement>(null);
  const [secoes, setSecoes] = useState<Secao[]>([]);
  const [atual, setAtual] = useState("");
  const [aberto, setAberto] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const titulos = [...(artigo.current?.querySelectorAll<HTMLHeadingElement>("h2[id]") ?? [])];
    // Fora do corpo do efeito: a lista só existe depois de o texto estar na tela.
    const quadro = requestAnimationFrame(() =>
      setSecoes(titulos.map((h) => ({ id: h.id, texto: (h.dataset.titulo ?? h.textContent ?? "").trim() }))),
    );
    // A seção atual é a do último título que já subiu acima de um terço da
    // tela, a cada rolagem (uma faixa observada perdia os saltos longos).
    let agendado = 0;
    const marcar = () => {
      agendado = 0;
      const linha = window.innerHeight / 3;
      const passou = titulos.filter((h) => h.getBoundingClientRect().top <= linha).at(-1);
      setAtual(passou?.id ?? "");
    };
    const aoRolar = () => {
      if (!agendado) agendado = requestAnimationFrame(marcar);
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();
    return () => {
      cancelAnimationFrame(quadro);
      cancelAnimationFrame(agendado);
      window.removeEventListener("scroll", aoRolar);
    };
  }, []);

  const tituloAtual = secoes.find((s) => s.id === atual)?.texto ?? "Ver as seções";

  const lista = (aoEscolher?: () => void) => (
    <ol className="space-y-1">
      {secoes.map(({ id, texto }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            onClick={aoEscolher}
            aria-current={id === atual ? "location" : undefined}
            className={cn(
              "block rounded-lg border-l-2 py-1.5 pr-2 pl-3 text-sm leading-snug transition-colors",
              id === atual ? "border-brand bg-brand/10 font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {texto}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <motion.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-brand" />
      <div className="mx-auto max-w-6xl px-4 pt-28 pb-24 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:pt-36">
        <aside className="hidden lg:block">
          <nav aria-label="Nesta página" className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pb-6">
            <p className="mb-3 font-mono text-xs text-muted-foreground">Nesta página</p>
            {lista()}
          </nav>
        </aside>

        <div className="min-w-0">
          {/* No celular: a seção atual numa barra que abre a lista. */}
          <div className="sticky top-20 z-30 mb-8 lg:hidden">
            <button
              type="button"
              onClick={() => setAberto((a) => !a)}
              aria-expanded={aberto}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border bg-card/95 px-4 py-3 text-left text-sm shadow-lg shadow-ink/5 backdrop-blur"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.65rem] text-muted-foreground">Nesta página</span>
                <span className="block truncate font-medium">{tituloAtual}</span>
              </span>
              <ChevronDownIcon className={cn("size-4 shrink-0 transition-transform", aberto && "rotate-180")} />
            </button>
            {aberto && (
              <nav aria-label="Nesta página, no celular" className="mt-2 max-h-[60svh] overflow-y-auto rounded-2xl border bg-card p-3 shadow-xl">
                {lista(() => setAberto(false))}
              </nav>
            )}
          </div>

          <article ref={artigo} className="documento-legal max-w-[70ch]">
            {children}
          </article>

          <section className="mt-16 grid max-w-[70ch] gap-6 rounded-3xl border bg-card p-8 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h2 className="font-heading text-2xl">Ficou alguma dúvida?</h2>
              <p className="mt-2 leading-7 text-muted-foreground">Fale direto com a Adsgator pelo WhatsApp, no horário de atendimento.</p>
              <Link href={outro.href} className="mt-4 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline">
                {outro.rotulo}
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
            <a
              href={linkWhatsApp(`Olá! Tenho uma dúvida sobre ${assunto} da Adsgator.`)}
              className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full bg-brand px-6 text-base text-brand-foreground hover:bg-brand/90")}
            >
              <IconeWhatsApp className="size-4" />
              Tirar a dúvida
            </a>
          </section>
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { ChamadaFinal } from "@/components/chamada-final";
import { PaginasNoAr } from "@/components/colunas-subindo";
import { Eyebrow } from "@/components/eyebrow";
import { FundoVivo } from "@/components/fundo-vivo";
import { MotionPauseButton, MotionScope } from "@/components/motion/motion-scope";
import { Reveal } from "@/components/motion/reveal";
import { PortfolioCaso } from "@/components/portfolio-caso";
import { buttonVariants } from "@/components/ui/button";
import { paginasNoAr, portfolio } from "@/config/portfolio";
import { linkWhatsApp, mensagemDaPagina } from "@/config/site";
import { cn } from "@/lib/utils";

// Página Portfólio, na ordem do roteiro do site (ADSGATOR-PAINEL,
// DOCS/ROTEIRO-SITE.md, "Portfólio"), aprovado pelo Lucas em 2026-11-20: a
// pessoa vê a qualidade com os próprios olhos. As páginas e os mini casos sem
// números (decisão 3 A) estão em config/portfolio.ts.

export const metadata: Metadata = {
  title: "Portfólio",
  description:
    "Landing pages feitas pela Adsgator e no ar: adestramento, creche canina, escritório virtual e móveis planejados. Passe o mouse para ver cada página inteira.",
  alternates: { canonical: "/portfolio" },
};

const whatsapp = linkWhatsApp(mensagemDaPagina("/portfolio"));
const anteriores = portfolio.filter((p) => !p.site);

const botaoMarca = cn(
  buttonVariants({ size: "lg" }),
  "h-12 rounded-full bg-brand px-7 text-base text-brand-foreground hover:bg-brand/90",
);

export default function Page() {
  return (
    <>
      {/* Topo: as páginas dos clientes subindo ao fundo. */}
      <MotionScope>
        <FundoVivo className="overflow-x-clip">
          <PaginasNoAr />
          {/* Véu: as fotos têm texto e contraste, então atrás do texto ficam
              quase apagadas; no celular, onde o texto ocupa a largura toda,
              viram só textura. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-background/85 lg:bg-transparent lg:bg-[linear-gradient(to_right,var(--background)_42%,transparent_78%)]"
          />
          {/* O pattern da Adsgator no lado do texto, para o fundo não ficar liso
              (pedido do Lucas, 2026-11-20), sumindo antes dos celulares. */}
          <div
            aria-hidden="true"
            data-pattern
            className="pointer-events-none absolute inset-0 -z-10 bg-[url(/brand/padrao-claro.png)] bg-[length:114px_114px] opacity-50 [mask-image:linear-gradient(to_bottom,black_40%,transparent)] lg:[mask-image:linear-gradient(to_right,black_25%,transparent_60%)] dark:bg-[url(/brand/padrao-escuro.png)] dark:opacity-40"
          />
          <div className="relative mx-auto max-w-6xl px-4 pt-32 pb-24 lg:pt-40 lg:pb-32">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                Portfólio
              </p>
              <h1 className="mt-7 font-heading text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl">
                Páginas que já estão <span className="highlight">no ar</span>.
              </h1>
              <p className="mt-7 text-lg leading-8 text-muted-foreground">
                Cada uma feita para o negócio do cliente, com o jeito dele e o WhatsApp a um toque. Abra, role, compare:
                é o mesmo cuidado que a sua vai ter.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a href={whatsapp} className={botaoMarca}>
                  Quero um diagnóstico grátis
                  <ArrowRightIcon />
                </a>
                <MotionPauseButton />
              </div>
            </div>
          </div>
        </FundoVivo>
      </MotionScope>

      {/* As páginas no ar, cada uma com o mini caso. */}
      <section id="no-ar" className="mx-auto max-w-6xl px-4 py-24">
        <h2 className="sr-only">Páginas no ar</h2>
        <ul className="grid gap-x-10 gap-y-20 md:grid-cols-2">
          {paginasNoAr.map((pagina) => (
            <PortfolioCaso key={pagina.id} pagina={pagina} />
          ))}
        </ul>
      </section>

      {/* Projetos anteriores: feitos pela Adsgator e que não estão mais no ar. */}
      <section id="anteriores" className="mx-auto max-w-6xl px-4 pb-24">
        <Eyebrow>Projetos anteriores</Eyebrow>
        <h2 className="mt-6 max-w-3xl font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
          Outras páginas feitas pela Adsgator. <span className="text-muted-foreground">Hoje fora do ar.</span>
        </h2>
        <ul className="mt-14 grid gap-x-10 gap-y-20 md:grid-cols-2">
          {anteriores.map((pagina) => (
            <PortfolioCaso key={pagina.id} pagina={pagina} />
          ))}
        </ul>
      </section>

      {/* A próxima pode ser a sua. */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Reveal className="grid gap-6 rounded-3xl border bg-card p-8 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-heading text-3xl leading-tight sm:text-4xl">A próxima página aqui pode ser a sua.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              Sob medida, rápida no celular e no seu nome, pronta em até 14 dias úteis depois do material.
            </p>
          </div>
          <Link
            href="/landing-page"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 rounded-full bg-transparent px-7 text-base")}
          >
            Ver a landing page
          </Link>
        </Reveal>
      </section>

      <ChamadaFinal
        titulo={
          <>
            Gostou do que viu?
            <br />
            Vamos fazer a sua.
          </>
        }
        mensagem={mensagemDaPagina("/portfolio")}
      />
    </>
  );
}

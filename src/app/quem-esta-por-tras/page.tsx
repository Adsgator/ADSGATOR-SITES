import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

import { BumerangueFrame } from "@/components/bumerangue";
import { ChamadaFinal } from "@/components/chamada-final";
import { TrajetoriaNoAr } from "@/components/colunas-subindo";
import { Eyebrow } from "@/components/eyebrow";
import { FundoVivo } from "@/components/fundo-vivo";
import { ListaQueSeMarca } from "@/components/lista-que-se-marca";
import { MotionPauseButton, MotionScope } from "@/components/motion/motion-scope";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { linkWhatsApp, mensagemDaPagina } from "@/config/site";
import { cn } from "@/lib/utils";

// Página "Quem está por trás", na ordem do roteiro do site (ADSGATOR-PAINEL,
// DOCS/ROTEIRO-SITE.md, "Quem está por trás"), aprovado pelo Lucas em
// 2026-11-20: a pessoa sabe com quem vai falar e confia. A trajetória e o
// "por que faço" são as respostas dele no roteiro (seção 6); a frase em
// destaque é dele, literal. Sem fingir equipe (Base): a marca na frente e o
// Lucas aqui. A foto é a do perfil do WhatsApp Business, por enquanto.

export const metadata: Metadata = {
  title: "Quem está por trás",
  description:
    "Lucas, da Adsgator: Google Ads desde 2020 e web design há mais de 10 anos. Você fala direto com quem cuida do seu anúncio e da sua página.",
  alternates: { canonical: "/quem-esta-por-tras" },
};

const whatsapp = linkWhatsApp(mensagemDaPagina("/quem-esta-por-tras"));

const titulo = "font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl";
const botaoMarca = cn(
  buttonVariants({ size: "lg" }),
  "h-12 rounded-full bg-brand px-7 text-base text-brand-foreground hover:bg-brand/90",
);

const trajetoria = [
  { titulo: "Aos 15 anos, ajudante de serralheiro", texto: "O primeiro trabalho: aprender fazendo, com as mãos." },
  {
    titulo: "Mecânico de manutenção e torneiro",
    texto: "Sete anos na indústria, numa fábrica de implementos agrícolas e depois numa empresa de alimentos.",
  },
  {
    titulo: "Apaixonado por tecnologia",
    texto: "Manutenção de computadores, programação e estudo, desde sempre.",
  },
  { titulo: "2010, o primeiro curso de web design", texto: "Na época em que os sites ainda eram feitos em Flash." },
  { titulo: "2020, nasce a Adsgator", texto: "Google Ads e landing pages para negócios locais." },
];

const pontos = [
  {
    titulo: "Tudo no seu nome",
    texto:
      "A conta do Google Ads, a página e o domínio ficam no seu nome. Quero que você continue porque está valendo a pena, não porque está preso.",
  },
  {
    titulo: "Sem fidelidade",
    texto: "Sem contrato de meses nem multa. Você pode sair quando quiser e voltar quando quiser.",
  },
  {
    titulo: "Sob medida",
    texto: "Não uso modelo pronto. A campanha e a página nascem do seu serviço, da sua região e de quem você quer atender.",
  },
  {
    titulo: "Direto comigo",
    texto: "Quem responde o seu WhatsApp sou eu, que mexo na sua conta e na sua página. Sem atendente no meio do caminho.",
  },
  {
    titulo: "Resumo todo mês",
    texto: "Todo mês você recebe o que chegou e o que eu fiz na sua conta, explicado sem complicação.",
  },
];

export default function Page() {
  return (
    <>
      {/* Topo: a apresentação e a foto. */}
      <MotionScope>
        <FundoVivo className="overflow-x-clip">
          <TrajetoriaNoAr />
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-28 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-36">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                Quem está por trás
              </p>
              <h1 className="mt-7 font-heading text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl">
                Oi, eu sou o <span className="highlight">Lucas</span>.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
                Faço Google Ads desde 2020, quando nasceu a Adsgator, e web design há mais de 10 anos. Junto as duas
                coisas: o anúncio que faz quem procura encontrar você e a página que faz essa pessoa chamar no seu
                WhatsApp.
              </p>
              <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
                E você fala direto comigo, do primeiro oi ao resumo do mês.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a href={whatsapp} className={botaoMarca}>
                  Quero um diagnóstico grátis
                  <ArrowRightIcon />
                </a>
                <MotionPauseButton />
              </div>
            </div>
            <Reveal className="relative mx-auto w-full max-w-sm">
              <BumerangueFrame>
                <div className="relative aspect-square overflow-hidden rounded-3xl">
                  <Image
                    src="/sobre/lucas.jpg"
                    alt="Lucas, da Adsgator"
                    fill
                    priority
                    sizes="(min-width: 1024px) 24rem, 90vw"
                    className="object-cover"
                  />
                </div>
              </BumerangueFrame>
              <p className="absolute -bottom-5 -left-4 rounded-2xl border bg-card px-4 py-3 text-sm shadow-xl shadow-ink/10 sm:-left-8">
                <span className="block font-mono text-xs text-muted-foreground">Adsgator</span>
                desde 2020
              </p>
            </Reveal>
          </div>
        </FundoVivo>
      </MotionScope>

      {/* De onde eu venho. */}
      <section className="border-t">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 md:grid-cols-[1fr_1.1fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <Eyebrow>De onde eu venho</Eyebrow>
            <h2 className={cn(titulo, "mt-6")}>Comecei trabalhando com as mãos.</h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">
              Antes da agência, foram anos de oficina e de indústria. A tecnologia sempre esteve junto, e virou o meu
              trabalho.
            </p>
          </div>
          <ListaQueSeMarca
            itens={trajetoria}
            final={{
              titulo: "Hoje: design, Google Ads e IA",
              texto: "Estudando marketing na internet, criação de sites e inteligência artificial, para entregar mais com o mesmo cuidado.",
            }}
          />
        </div>
      </section>

      {/* Por que eu faço isso: a frase dele, literal. */}
      <section className="dark section-ink bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-4 py-28 text-center">
          <Eyebrow className="justify-center">Por que eu faço isso</Eyebrow>
          <Reveal>
            <blockquote className="mt-10 font-heading text-4xl leading-[1.15] tracking-tight text-balance sm:text-6xl">
              “É o que eu gosto de fazer. Eu sinto prazer em criar <span className="text-brand">coisas digitais</span>.”
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Os cinco pontos, contados por ele. */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Eyebrow>Como eu trabalho</Eyebrow>
        <h2 className={cn(titulo, "mt-6 max-w-3xl")}>
          Cinco coisas que eu não abro mão. <span className="text-muted-foreground">Com nenhum cliente.</span>
        </h2>
        <ol className="mt-14 divide-y border-y">
          {pontos.map(({ titulo: t, texto }, i) => (
            <li key={t}>
              <Reveal className="grid gap-3 py-8 md:grid-cols-[6rem_1fr_1.4fr] md:items-baseline md:gap-8">
                <span className="font-mono text-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-heading text-2xl leading-tight sm:text-3xl">{t}</h3>
                <p className="leading-7 text-muted-foreground">{texto}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <ChamadaFinal
        titulo={
          <>
            Vamos conversar
            <br />
            sobre o seu negócio?
          </>
        }
        mensagem={mensagemDaPagina("/quem-esta-por-tras")}
      />
    </>
  );
}

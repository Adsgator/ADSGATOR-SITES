import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

import { BumerangueFrame } from "@/components/bumerangue";
import { ChamadaFinal } from "@/components/chamada-final";
import { TrajetoriaNoAr } from "@/components/colunas-subindo";
import { EuEOSistema } from "@/components/eu-e-o-sistema";
import { Eyebrow } from "@/components/eyebrow";
import { FundoVivo } from "@/components/fundo-vivo";
import { ListaQueSeMarca } from "@/components/lista-que-se-marca";
import { MotionScope } from "@/components/motion/motion-scope";
import { Reveal } from "@/components/motion/reveal";
import { NumerosEmFaixa } from "@/components/numeros-em-faixa";
import { buttonVariants } from "@/components/ui/button";
import { linkWhatsApp, mensagemDaPagina } from "@/config/site";
import { trajetoria, trajetoriaHoje } from "@/config/trajetoria";
import { cn } from "@/lib/utils";

// Página "Quem está por trás", na ordem do roteiro do site (ADSGATOR-PAINEL,
// DOCS/ROTEIRO-SITE.md, "Quem está por trás"), aprovado pelo Lucas em
// 2026-11-20: a pessoa sabe com quem vai falar e confia. A trajetória e o
// "por que faço" são as respostas dele no roteiro (seção 6); a frase em
// destaque é dele, literal. Sem fingir equipe (Base): a marca na frente e o
// Lucas aqui. A foto é a do perfil do WhatsApp Business, por enquanto.
// Rodada de profundidade (Lucas, 2026-11-20): os números (do painel e da
// trajetória), uma pessoa e um sistema (o que o painel faz o dia inteiro e o
// que fica com o Lucas) e as dúvidas sobre trabalhar com uma pessoa só.

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


// Os números: negócios atendidos, do Lucas (2026-11-20); os anos, da trajetória
// (web design desde 2010; a Adsgator desde 2020).
const numeros = [
  { valor: 30, antes: "+", rotulo: "negócios atendidos desde 2020" },
  { valor: 10, antes: "+", rotulo: "anos criando sites" },
  { valor: new Date().getFullYear() - 2020, rotulo: "anos de Google Ads com a Adsgator" },
];

const objecoes = [
  {
    duvida: "“Uma pessoa só dá conta?”",
    resposta:
      "Dá, porque eu não fico olhando tudo sozinho: o sistema acompanha cada conta e cada página o dia inteiro e me avisa na hora. Eu cuido do que precisa de gente.",
  },
  {
    duvida: "“Uma agência grande não seria melhor?”",
    resposta:
      "Em agência grande, quem vende costuma não ser quem faz. Aqui, quem conversa com você é quem mexe na sua conta e na sua página, e conhece o seu negócio.",
  },
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
    texto: "Quem responde você no WhatsApp, quem mexe na sua conta e na sua página, sou eu. Sem atendente no meio do caminho.",
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
            <h2 className={cn(titulo, "mt-6")}>Da oficina para o digital.</h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">
              Da oficina ficou o jeito de trabalhar: com cuidado em cada detalhe. Do digital, anos aprendendo a fazer
              sites, anúncios e sistemas que funcionam.
            </p>
          </div>
          <ListaQueSeMarca
            itens={trajetoria}
            final={trajetoriaHoje}
          />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-24">
          <NumerosEmFaixa itens={numeros} />
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

      {/* Uma pessoa e um sistema. */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <Eyebrow>Uma pessoa e um sistema</Eyebrow>
        <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
          Eu não fico olhando tudo sozinho. <span className="text-muted-foreground">Eu construí quem olha.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          A Adsgator tem um sistema próprio que acompanha cada conta e cada página o dia inteiro. Ele confere, mede e
          me avisa na hora. Eu fico com o que precisa de gente.
        </p>
        <div className="mt-14">
          <MotionScope>
            <EuEOSistema />
          </MotionScope>
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

      {/* Talvez você esteja pensando. */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Eyebrow>Talvez você esteja pensando</Eyebrow>
        <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
          As dúvidas sobre trabalhar comigo. <span className="text-muted-foreground">E as respostas.</span>
        </h2>
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {objecoes.map(({ duvida, resposta }, i) => (
            <li key={duvida}>
              <Reveal delay={i * 120} className="h-full rounded-3xl border bg-card p-8">
                <p className="font-heading text-2xl leading-tight">{duvida}</p>
                <p className="mt-4 leading-7 text-muted-foreground">{resposta}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Fechamento: um recado do Lucas, antes do convite. */}
      <section data-recado className="mx-auto max-w-3xl px-4 pb-28">
        <Reveal className="relative rounded-3xl border bg-card p-8 sm:p-12">
          <p className="font-mono text-xs text-muted-foreground">Um recado meu</p>
          <p className="mt-6 font-heading text-2xl leading-snug text-balance sm:text-3xl">
            Obrigado por ler até aqui. Escolher quem vai cuidar do seu anúncio é uma decisão importante, e por isso tudo
            começa com uma conversa, sem compromisso.
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            <span className="sm:block">Me conta do seu negócio.</span>{" "}
            <span className="sm:block">Eu olho com calma e te digo com sinceridade o que dá para fazer.</span>
          </p>
          {/* A assinatura: o nome completo com o grifo amarelo, como o "Lucas" do topo. */}
          <div data-assinatura className="mt-10 flex items-center gap-4 border-t pt-8">
            <span className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-brand">
              <Image src="/sobre/lucas.jpg" alt="" fill sizes="4rem" className="object-cover" />
            </span>
            <span className="leading-tight">
              <span className="highlight font-heading text-2xl">Lucas Simões</span>
              <span className="mt-2 block text-sm text-muted-foreground">Fundador da Adsgator, desde 2020</span>
            </span>
          </div>
        </Reveal>
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

import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

import { Eyebrow } from "@/components/eyebrow";
import { Marquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";
import { RotatingWord } from "@/components/motion/rotating-word";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

import { AvisoMovimento } from "./aviso-movimento";

// Página temporária da Fase 1B, só no branch: mostra o movimento proposto e
// compara fontes (decisão 17) e tons (decisão 18). Sai antes de juntar na
// main; o que for aprovado vira tokens e componentes de verdade.
export const metadata: Metadata = {
  title: "Amostra do visual",
  robots: { index: false, follow: false },
};

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

// Só fatos que já estão nos Termos.
const fatos = [
  "Sem fidelidade",
  "Landing page em até 14 dias úteis",
  "Domínio por 3 anos incluso",
  "A landing page é sua",
  "Atendimento de segunda a sexta",
  "Desistência em até 7 dias",
];

const servicos = [
  {
    titulo: "Google Ads",
    texto:
      "Campanhas criadas, otimizadas e acompanhadas na sua conta. A verba vai direto para o Google.",
  },
  {
    titulo: "Landing page",
    texto: "Página rápida e profissional no seu domínio. Depois de entregue, é sua.",
  },
  {
    titulo: "Manutenção",
    texto:
      "Hospedagem, domínio renovado, ajustes de conteúdo e suporte, num plano mensal opcional.",
  },
];

const passos = [
  { titulo: "Você contrata", texto: "Escolhe o serviço e faz o pagamento." },
  {
    titulo: "Envia o material",
    texto: "Responde o briefing e manda textos, imagens e acessos.",
  },
  {
    titulo: "Vai ao ar",
    texto: "A landing page é publicada no seu domínio em até 14 dias úteis.",
  },
];

const botaoMarca = cn(
  buttonVariants({ size: "lg" }),
  "rounded-full bg-brand px-6 text-brand-foreground hover:bg-brand/90",
);
const botaoContorno = cn(
  buttonVariants({ size: "lg", variant: "outline" }),
  "rounded-full px-6",
);

type Tom = {
  fundo: string;
  texto: string;
  apagado: string;
  borda: string;
  cartao: string;
};

export default function Page() {
  return (
    <div className={cn(instrument.variable, jetbrains.variable)}>
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-10">
        <Eyebrow>Fase 1B · página de amostra</Eyebrow>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance">
          Visual novo: movimento, fontes e tons
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          Página só do preview, fora do Google. Primeiro o movimento proposto, a
          partir da referência do plano; depois as opções de fonte (decisão 17)
          e de tons (decisão 18), lado a lado.
        </p>
        <AvisoMovimento />
      </section>

      {/* 1. Movimento: topo no estilo da referência. */}
      <section className="grain bg-grid border-y">
        <div className="mx-auto max-w-5xl px-4 pt-20 pb-12">
          <Eyebrow>Ads &amp; Web Design</Eyebrow>
          <h2 className="mt-6 text-5xl leading-[1.05] font-medium tracking-tight sm:text-7xl">
            Google Ads e landing pages para{" "}
            <RotatingWord
              words={["negócios locais", "clínicas", "lojas", "escritórios"]}
            />
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            As letras surgem do desfoque, os blocos entram quando aparecem na
            tela e a faixa abaixo roda sem parar (pausa com o mouse em cima).
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={site.whatsapp.link} className={botaoMarca}>
              Falar pelo WhatsApp
              <ArrowRightIcon />
            </a>
            <a href="#fontes" className={botaoContorno}>
              Ver as fontes
            </a>
          </div>
        </div>
        <Marquee className="border-t py-6">
          {fatos.map((fato) => (
            <span
              key={fato}
              className="flex items-center gap-6 px-6 text-lg whitespace-nowrap"
            >
              {fato}
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            </span>
          ))}
        </Marquee>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20">
        <Eyebrow>Entradas em cascata</Eyebrow>
        <h2 className="mt-6 text-3xl font-medium tracking-tight sm:text-5xl">
          Tudo o que o seu negócio precisa.
          <br />
          <span className="text-muted-foreground">Nada do que não precisa.</span>
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3">
          {servicos.map((servico, i) => (
            <Reveal key={servico.titulo} delay={i * 120} className="bg-background p-6">
              <p className="font-mono text-xs text-muted-foreground">0{i + 1}</p>
              <h3 className="mt-8 text-xl font-medium">{servico.titulo}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{servico.texto}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Seção escura com linhas diagonais, como a de passos da referência. */}
      <section className="dark grain bg-diagonal bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <Eyebrow>Como funciona</Eyebrow>
          <h2 className="mt-6 text-3xl font-medium tracking-tight sm:text-5xl">
            Três passos.
            <br />
            <span className="text-muted-foreground">Do pedido ao ar.</span>
          </h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            {passos.map((passo, i) => (
              <li key={passo.titulo} className="border-t pt-6">
                <Reveal delay={i * 120}>
                  <p className="font-mono text-xs text-muted-foreground">
                    Passo {i + 1}
                  </p>
                  <h3 className="mt-4 text-xl font-medium">{passo.titulo}</h3>
                  <p className="mt-2 leading-7 text-muted-foreground">{passo.texto}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 2. Fontes (decisão 17). */}
      <section id="fontes" className="mx-auto max-w-5xl scroll-mt-6 px-4 py-20">
        <Eyebrow>Fontes · decisão 17</Eyebrow>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight">
          Qual fonte combina mais com a Adsgator?
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          O mesmo conteúdo com as duas opções. A Servus Slab, da marca, ficou de
          fora: o uso comercial na web só vale com assinatura da Adobe, carregando
          a fonte dos servidores dela (detalhes no plano).
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <AmostraFonte
            opcao="A"
            nome="Geist e Geist Mono"
            detalhe="A fonte de hoje, da Vercel. Recomendada."
          />
          <AmostraFonte
            opcao="B"
            nome="Instrument Sans e JetBrains Mono"
            detalhe="As fontes da referência."
            fontes={
              {
                "--font-geist-sans": "var(--font-instrument)",
                "--font-geist-mono": "var(--font-jetbrains)",
              } as React.CSSProperties
            }
          />
        </div>
      </section>

      {/* 3. Tons (decisão 18). */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <Eyebrow>Tons · decisão 18</Eyebrow>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight">
          Neutros quentes ou frios?
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          Os mesmos elementos com os neutros da referência (quentes) e com os de
          hoje (frios), no claro e no escuro. O amarelo e o verde-escuro da marca
          não mudam.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <AmostraTom
            opcao="A"
            nome="Quentes. Recomendado."
            claro={{
              fundo: "#fafaf9",
              texto: "#080503",
              apagado: "#5e534a",
              borda: "#dad7d0",
              cartao: "#ffffff",
            }}
            escuro={{
              fundo: "#0c0a09",
              texto: "#fafaf9",
              apagado: "#a8a29e",
              borda: "rgb(255 255 255 / 10%)",
              cartao: "#1c1917",
            }}
          />
          <AmostraTom
            opcao="B"
            nome="Frios, como hoje."
            claro={{
              fundo: "oklch(1 0 0)",
              texto: "oklch(0.145 0 0)",
              apagado: "oklch(0.556 0 0)",
              borda: "oklch(0.922 0 0)",
              cartao: "oklch(1 0 0)",
            }}
            escuro={{
              fundo: "oklch(0.145 0 0)",
              texto: "oklch(0.985 0 0)",
              apagado: "oklch(0.708 0 0)",
              borda: "oklch(1 0 0 / 10%)",
              cartao: "oklch(0.17 0 0)",
            }}
          />
        </div>
      </section>
    </div>
  );
}

/** Um cartão por opção de fonte: troca só as variáveis de fonte do Geist. */
function AmostraFonte({
  opcao,
  nome,
  detalhe,
  fontes,
}: {
  opcao: string;
  nome: string;
  detalhe: string;
  fontes?: React.CSSProperties;
}) {
  return (
    <div style={fontes} className="rounded-2xl border p-6 font-sans sm:p-8">
      <p className="font-mono text-xs text-muted-foreground">
        Opção {opcao} · {nome}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{detalhe}</p>
      <Eyebrow className="mt-10">O que fazemos</Eyebrow>
      <p className="mt-4 text-3xl leading-tight font-medium tracking-tight">
        Tudo o que o seu negócio precisa.{" "}
        <span className="text-muted-foreground">Nada do que não precisa.</span>
      </p>
      <p className="mt-4 leading-7 text-muted-foreground">
        A Adsgator cuida dos anúncios no Google e cria landing pages rápidas,
        feitas para quem procura o seu serviço encontrar você.
      </p>
      <div className="mt-8 flex items-end gap-3">
        <span className="text-5xl font-medium tracking-tight">14</span>
        <span className="pb-1 font-mono text-xs text-muted-foreground uppercase">
          dias úteis
          <br />
          para entregar
        </span>
      </div>
    </div>
  );
}

/** Uma coluna por opção de tons: o mesmo painel no claro e no escuro. */
function AmostraTom({
  opcao,
  nome,
  claro,
  escuro,
}: {
  opcao: string;
  nome: string;
  claro: Tom;
  escuro: Tom;
}) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-xs text-muted-foreground">
        Opção {opcao} · {nome}
      </p>
      <PainelTom tom={claro} logo="/brand/logo-light.svg" />
      <PainelTom tom={escuro} logo="/brand/logo-dark.svg" />
    </div>
  );
}

/** Troca só as cores neutras do tema dentro do painel. */
function PainelTom({ tom, logo }: { tom: Tom; logo: string }) {
  const cores = {
    "--background": tom.fundo,
    "--foreground": tom.texto,
    "--muted-foreground": tom.apagado,
    "--border": tom.borda,
    "--card": tom.cartao,
  } as React.CSSProperties;
  return (
    <div
      style={cores}
      className="grain overflow-hidden rounded-2xl border bg-background p-6 text-foreground"
    >
      <Image src={logo} alt="Adsgator" width={130} height={24} unoptimized />
      <Eyebrow className="mt-8">Planos</Eyebrow>
      <p className="mt-3 text-2xl font-medium tracking-tight">
        Simples e transparente.{" "}
        <span className="text-muted-foreground">Sem fidelidade.</span>
      </p>
      <div className="mt-6 rounded-xl border bg-card p-4 text-sm">
        <p className="font-medium">Landing page</p>
        <p className="mt-1 text-muted-foreground">
          Preço único. Depois de entregue, é sua.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <span className={cn(botaoMarca, "h-9 px-4 text-sm")}>Contratar</span>
        <span className={cn(botaoContorno, "h-9 px-4 text-sm")}>Ver detalhes</span>
      </div>
    </div>
  );
}

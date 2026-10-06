import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  LayoutTemplateIcon,
  MousePointerClickIcon,
  ShieldCheckIcon,
  UploadIcon,
} from "lucide-react";

import { AnuncioClique } from "@/components/anuncio-clique";
import { BumerangueFrame } from "@/components/bumerangue";
import { Eyebrow } from "@/components/eyebrow";
import { Faq } from "@/components/faq";
import { Marquee } from "@/components/motion/marquee";
import { MotionPauseButton, MotionScope } from "@/components/motion/motion-scope";
import { Reveal } from "@/components/motion/reveal";
import { RotatingWord } from "@/components/motion/rotating-word";
import { Steps } from "@/components/steps";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

// Amostra 2 da Fase 1B, só no branch: o sistema visual com a marca na frente
// (Servus Slab, verde, amarelo e #F1F1F1), as peças da Adsgator (cursor de
// clique, cantos bumerangue, padrão) e as seções que a página inicial vai ter.
// Sai antes de juntar na main; os textos usam só fatos dos Termos.
export const metadata: Metadata = {
  title: "Amostra do visual",
  robots: { index: false, follow: false },
};

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
    icone: MousePointerClickIcon,
    titulo: "Google Ads",
    texto: "Campanhas criadas, otimizadas e acompanhadas na sua conta.",
    itens: ["Conversões e remarketing", "Imagens para os anúncios", "Relatórios dos resultados"],
  },
  {
    icone: LayoutTemplateIcon,
    titulo: "Landing page",
    texto: "Uma página rápida e profissional, publicada no seu domínio.",
    itens: ["Entrega em até 14 dias úteis", "Domínio por 3 anos incluso", "Depois de entregue, é sua"],
  },
  {
    icone: ShieldCheckIcon,
    titulo: "Manutenção",
    texto: "Hospedagem, suporte e manutenção num plano mensal opcional.",
    itens: ["Hospedagem e domínio renovado", "Ajustes de texto e imagem", "Correções e segurança"],
  },
];

const planos = [
  {
    nome: "Landing page",
    cobranca: "Preço único",
    destaque: false,
    itens: [
      "Página feita para o seu negócio",
      "Domínio em seu nome, por 3 anos",
      "Entrega em até 14 dias úteis",
      "Até 2 rodadas de ajustes",
      "Os arquivos são seus",
    ],
  },
  {
    nome: "Hospedagem, suporte e manutenção",
    cobranca: "Por mês · oferecido na entrega",
    destaque: true,
    itens: [
      "Hospedagem da landing page",
      "Renovação do domínio",
      "Atualização de textos e imagens",
      "Correções e segurança",
      "Suporte de segunda a sexta",
    ],
  },
  {
    nome: "Google Ads",
    cobranca: "Por mês · sem fidelidade",
    destaque: false,
    itens: [
      "Campanhas criadas e otimizadas",
      "Conversões e remarketing",
      "Imagens para os anúncios",
      "Relatórios dos resultados",
      "A conta e a verba são suas",
    ],
  },
];

const perguntas = [
  {
    pergunta: "A landing page é minha?",
    resposta: (
      <>
        Sim. Depois da entrega, a landing page é sua, com o domínio registrado no
        seu nome. Os arquivos são entregues sem custo sempre que você pedir (veja
        os <Link className="font-medium text-foreground underline underline-offset-4" href="/termos#landing-page">Termos</Link>).
      </>
    ),
  },
  {
    pergunta: "Tem fidelidade?",
    resposta:
      "Não. Os planos mensais podem ser cancelados a qualquer momento, sem multa, com aviso de 48 horas antes do próximo vencimento.",
  },
  {
    pergunta: "Quem paga a verba do Google Ads?",
    resposta: "Você, direto ao Google, na sua conta. A verba não passa pela Adsgator.",
  },
  {
    pergunta: "Em quanto tempo a página fica pronta?",
    resposta: "Em até 14 dias úteis depois que você envia todo o material pedido.",
  },
  {
    pergunta: "E se eu desistir?",
    resposta: (
      <>
        Desistindo em até 7 dias da contratação, você recebe de volta tudo o que
        pagou à Adsgator, em até 15 dias úteis (veja{" "}
        <Link className="font-medium text-foreground underline underline-offset-4" href="/termos#reembolso">Reembolso</Link>).
      </>
    ),
  },
];

const botaoMarca = cn(
  buttonVariants({ size: "lg" }),
  "h-12 rounded-full bg-brand px-7 text-base text-brand-foreground hover:bg-brand/90",
);
const botaoContorno = cn(
  buttonVariants({ size: "lg", variant: "outline" }),
  "h-12 rounded-full bg-transparent px-7 text-base",
);

const titulo = "font-heading text-4xl leading-[1.05] tracking-tight sm:text-6xl";

export default function Page() {
  const passos = [
    {
      titulo: "Você contrata",
      texto: "Escolhe o serviço e faz o pagamento. A confirmação chega na hora.",
      visual: <VisualPedido />,
    },
    {
      titulo: "Envia o material",
      texto: "Responde o briefing e manda textos, imagens e acessos.",
      visual: <VisualBriefing />,
    },
    {
      titulo: "Vai ao ar",
      texto: "A landing page é publicada no seu domínio em até 14 dias úteis.",
      visual: <VisualNoAr />,
    },
  ];

  return (
    <>
      <p className="border-b py-2 text-center font-mono text-xs text-muted-foreground">
        Amostra 2 do visual · só no preview, fora do Google
      </p>

      {/* Topo: título na Servus Slab, ilustração do clique e faixa. */}
      <MotionScope>
        <section className="bg-grid">
          <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 pt-20 pb-16 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <Eyebrow>Ads &amp; Web Design</Eyebrow>
              <h1 className="mt-6 font-heading text-5xl leading-[1.02] tracking-tight text-balance sm:text-7xl">
                Google Ads e landing pages para{" "}
                <span className="highlight">
                  <RotatingWord words={["negócios locais", "clínicas", "lojas", "escritórios"]} />
                </span>
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">
                A Adsgator coloca o seu negócio no Google e cria a página que
                transforma o clique em conversa no WhatsApp.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={site.whatsapp.link} className={botaoMarca}>
                  Falar pelo WhatsApp
                  <ArrowRightIcon />
                </a>
                <a href="#planos" className={botaoContorno}>
                  Ver os planos
                </a>
              </div>
            </div>
            <BumerangueFrame className="mx-auto w-full max-w-md lg:max-w-none">
              <AnuncioClique />
            </BumerangueFrame>
          </div>
          <div className="relative border-t bg-background/60 backdrop-blur-sm">
            <Marquee className="py-5 pr-16">
              {fatos.map((fato) => (
                <span key={fato} className="flex items-center gap-6 px-6 text-lg whitespace-nowrap">
                  {fato}
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                </span>
              ))}
            </Marquee>
            <MotionPauseButton className="absolute top-1/2 right-4 -translate-y-1/2" />
          </div>
        </section>
      </MotionScope>

      {/* Serviços, entrando em cascata. */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Eyebrow>O que fazemos</Eyebrow>
        <h2 className={cn(titulo, "mt-6")}>
          Tudo o que o seu negócio precisa.
          <br />
          <span className="text-muted-foreground">Nada do que não precisa.</span>
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {servicos.map(({ icone: Icone, titulo: nome, texto, itens }, i) => (
            <Reveal key={nome} delay={i * 120} className="rounded-3xl border bg-card p-8">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
                <Icone className="size-5" />
              </span>
              <h3 className="mt-8 font-heading text-2xl">{nome}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{texto}</p>
              <ul className="mt-6 space-y-2 border-t pt-6 text-sm">
                {itens.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Como funciona: seção no verde da marca, com o padrão e os passos. */}
      <MotionScope>
        <section className="dark section-ink bg-background bg-pattern-dark text-foreground">
          <div className="mx-auto max-w-6xl px-4 py-24">
            <div className="flex items-end justify-between gap-6">
              <div>
                <Eyebrow>Como funciona</Eyebrow>
                <h2 className={cn(titulo, "mt-6")}>
                  Três passos.
                  <br />
                  <span className="text-muted-foreground">Do pedido ao ar.</span>
                </h2>
              </div>
              <MotionPauseButton />
            </div>
            <div className="mt-14">
              <Steps passos={passos} />
            </div>
          </div>
        </section>
      </MotionScope>

      {/* Planos (preços ainda a definir). */}
      <section id="planos" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24">
        <Eyebrow>Planos</Eyebrow>
        <h2 className={cn(titulo, "mt-6")}>
          Simples e transparente.
          <br />
          <span className="text-muted-foreground">Sem fidelidade.</span>
        </h2>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {planos.map((plano, i) => (
            <Reveal
              key={plano.nome}
              delay={i * 120}
              className={cn(
                "flex flex-col rounded-3xl border p-8",
                plano.destaque
                  ? "dark section-ink bg-background text-foreground lg:-translate-y-4"
                  : "bg-card",
              )}
            >
              <p className="font-mono text-xs text-muted-foreground">{plano.cobranca}</p>
              <h3 className="mt-4 min-h-16 font-heading text-2xl">{plano.nome}</h3>
              <p className="mt-6 font-heading text-5xl">R$ —</p>
              <p className="mt-1 text-xs text-muted-foreground">valor a definir</p>
              <ul className="mt-8 space-y-3 text-sm">
                {plano.itens.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <a
                  href={site.whatsapp.link}
                  className={cn(plano.destaque ? botaoMarca : botaoContorno, "w-full")}
                >
                  Quero este
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Perguntas frequentes. */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <Eyebrow>Perguntas frequentes</Eyebrow>
        <h2 className={cn(titulo, "mt-6")}>Antes de contratar.</h2>
        <div className="mt-12">
          <Faq itens={perguntas} />
        </div>
      </section>

      {/* Chamada final no amarelo da marca, com os cantos em verde. */}
      <section className="bg-brand text-brand-foreground">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <BumerangueFrame
            cantoClassName="text-ink"
            className="grid items-center gap-10 px-6 py-14 sm:px-16 lg:grid-cols-[1fr_auto]"
          >
            <div>
              <h2 className="font-heading text-4xl leading-[1.05] tracking-tight sm:text-6xl">
                Seu negócio no Google.
                <br />
                Com página própria.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8">
                Fale com a Adsgator pelo WhatsApp, de segunda a sexta, das 9h às 12h
                e das 13h30 às 17h.
              </p>
              <a
                href={site.whatsapp.link}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-10 h-12 rounded-full bg-ink px-7 text-base text-paper hover:bg-ink/90",
                )}
              >
                Chamar no WhatsApp
                <ArrowRightIcon />
              </a>
            </div>
            {/* O cursor da marca, em verde, clica duas vezes quando aparece. */}
            <Reveal className="hidden lg:block">
              <span aria-hidden="true" className="brand-cursor click-on-reveal w-40 text-ink" />
            </Reveal>
          </BumerangueFrame>
        </div>
      </section>

      {/* As peças do sistema, para aprovar. */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Eyebrow>Sistema visual</Eyebrow>
        <h2 className={cn(titulo, "mt-6")}>As peças da marca.</h2>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Amarelo", "#FFB100", "bg-brand"],
            ["Verde", "#1F271B", "bg-ink"],
            ["Papel", "#F1F1F1", "bg-paper"],
            ["Cartão", "#FCFBF8", "bg-card"],
            ["Texto apagado", "#5C6356", "bg-muted-foreground"],
            ["Borda", "#D8D7CF", "bg-border"],
          ].map(([nome, hex, classe]) => (
            <div key={nome} className="rounded-2xl border bg-card p-3">
              <div className={cn("h-20 rounded-xl border", classe)} />
              <p className="mt-3 text-sm font-medium">{nome}</p>
              <p className="font-mono text-xs text-muted-foreground">{hex}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border bg-card p-8">
            <p className="font-mono text-xs text-muted-foreground">Servus Slab · títulos</p>
            <p className="mt-6 font-heading text-6xl">Aa</p>
            <p className="mt-4 font-heading text-xl">Leve, regular e seminegrito</p>
          </div>
          <div className="rounded-3xl border bg-card p-8">
            <p className="font-mono text-xs text-muted-foreground">Geist · texto</p>
            <p className="mt-6 text-6xl font-medium">Aa</p>
            <p className="mt-4 leading-7 text-muted-foreground">
              Texto corrido, botões e números: leitura confortável em qualquer tela.
            </p>
          </div>
          <div className="rounded-3xl border bg-card p-8">
            <p className="font-mono text-xs text-muted-foreground">Geist Mono · rótulos</p>
            <p className="mt-6 font-mono text-6xl">Aa</p>
            <p className="mt-4 font-mono text-sm text-muted-foreground">01 · Como funciona</p>
          </div>
        </div>
      </section>
    </>
  );
}

/** Passo 1: pedido confirmado. */
function VisualPedido() {
  return (
    <div className="rounded-3xl border bg-card p-8">
      <p className="font-mono text-xs text-muted-foreground">Pedido confirmado</p>
      <p className="mt-3 font-heading text-3xl">Landing page</p>
      <ul className="mt-8 space-y-4">
        {["Domínio por 3 anos", "Entrega em até 14 dias úteis", "Pagamento aprovado"].map((item) => (
          <li key={item} className="flex items-center gap-3">
            <span className="flex size-6 items-center justify-center rounded-full bg-brand text-brand-foreground">
              <CheckIcon className="size-3.5" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Passo 2: briefing respondido. */
function VisualBriefing() {
  return (
    <div className="rounded-3xl border bg-card p-8">
      <p className="font-mono text-xs text-muted-foreground">Briefing</p>
      <div className="mt-6 space-y-5">
        {["Nome do negócio", "Serviços", "Como o cliente chega até você"].map((campo) => (
          <div key={campo}>
            <p className="text-sm text-muted-foreground">{campo}</p>
            <div className="mt-2 h-10 rounded-xl border bg-background/40" />
          </div>
        ))}
      </div>
      <p className="mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
        <UploadIcon className="size-4 text-brand" />
        fotos.zip enviado
      </p>
    </div>
  );
}

/** Passo 3: a página no ar, no domínio do cliente. */
function VisualNoAr() {
  return (
    <div className="overflow-hidden rounded-3xl border bg-card">
      <div className="flex items-center gap-2 border-b px-5 py-3">
        <span className="size-2.5 rounded-full bg-muted" />
        <span className="size-2.5 rounded-full bg-muted" />
        <span className="size-2.5 rounded-full bg-muted" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">seunegocio.com.br</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-0.5 text-xs font-medium text-brand-foreground">
          <span className="size-1.5 rounded-full bg-brand-foreground" />
          No ar
        </span>
      </div>
      <div className="space-y-4 p-8">
        <div className="h-6 w-2/3 rounded-full bg-muted" />
        <div className="h-3 w-full rounded-full bg-muted/70" />
        <div className="h-3 w-5/6 rounded-full bg-muted/70" />
        <div className="mt-6 h-11 w-44 rounded-full bg-brand" />
      </div>
    </div>
  );
}

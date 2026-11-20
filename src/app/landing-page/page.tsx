import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  CalendarCheckIcon,
  ClipboardCheckIcon,
  CookieIcon,
  FileTextIcon,
  GlobeIcon,
  LinkIcon,
  LockIcon,
  MapPinIcon,
  PaletteIcon,
  PenLineIcon,
  RefreshCwIcon,
  SearchIcon,
  SendIcon,
  SmartphoneIcon,
  XIcon,
} from "lucide-react";

import { ChamadaFinal } from "@/components/chamada-final";
import { PartesNoAr } from "@/components/colunas-subindo";
import { Eyebrow } from "@/components/eyebrow";
import { Faq } from "@/components/faq";
import { FundoVivo } from "@/components/fundo-vivo";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { LinhaDoTempo } from "@/components/linha-do-tempo";
import { MotionScope } from "@/components/motion/motion-scope";
import { Reveal } from "@/components/motion/reveal";
import { PaginaMontando } from "@/components/pagina-montando";
import { PortfolioFaixa } from "@/components/portfolio-faixa";
import { buttonVariants } from "@/components/ui/button";
import { linkWhatsApp, mensagemDaPagina } from "@/config/site";
import { cn } from "@/lib/utils";

// Página de landing page, na ordem do roteiro do site (ADSGATOR-PAINEL,
// DOCS/ROTEIRO-SITE.md, "Landing page"), aprovado pelo Lucas em 2026-11-20.
// O que vem nela e o que não inclui são da Base ("Serviços e preços"). Sem
// preço (decisão de 2026-11-20); o convite é "Quero a minha página".

export const metadata: Metadata = {
  title: "Landing page",
  description:
    "Uma página sob medida, rápida no celular, feita para transformar o clique em conversa no WhatsApp. Domínio no seu nome, pronta em até 14 dias úteis.",
  alternates: { canonical: "/landing-page" },
};

const whatsapp = linkWhatsApp(mensagemDaPagina("/landing-page"));

const titulo = "font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl";
const botaoMarca = cn(
  buttonVariants({ size: "lg" }),
  "h-12 rounded-full bg-brand px-7 text-base text-brand-foreground hover:bg-brand/90",
);
const botaoContorno = cn(
  buttonVariants({ size: "lg", variant: "outline" }),
  "h-12 rounded-full bg-transparent px-7 text-base",
);

const oQueVem = [
  { icone: PenLineIcon, titulo: "Textos escritos para você", texto: "A partir do briefing, com o jeito do seu negócio." },
  { icone: PaletteIcon, titulo: "Design sob medida", texto: "Feita para o seu negócio, não um modelo pronto." },
  { icone: SmartphoneIcon, titulo: "Rápida no celular", texto: "Onde quem clica no anúncio vai abrir a página." },
  { icone: SearchIcon, titulo: "Preparada para o Google e as IAs", texto: "Para quem procura entender o que você faz." },
  { icone: IconeWhatsApp, titulo: "Botão do WhatsApp", texto: "Com a mensagem pronta, a um toque." },
  { icone: BarChart3Icon, titulo: "Medição de visitas e contatos", texto: "Você sabe quantos chegaram e quantos chamaram." },
  { icone: CookieIcon, titulo: "Aviso de cookies", texto: "Como a lei pede." },
  { icone: FileTextIcon, titulo: "Privacidade e termos", texto: "As páginas que todo site precisa ter." },
  { icone: LockIcon, titulo: "Certificado de segurança", texto: "O cadeado no navegador." },
  { icone: GlobeIcon, titulo: "Domínio no seu nome", texto: "Com o primeiro ano incluso." },
  { icone: LinkIcon, titulo: "Árvore de links", texto: "Uma página com os seus links, para a bio das redes." },
  { icone: MapPinIcon, titulo: "Perfil no Google conferido", texto: "Com os dados do seu negócio certos." },
];

const comoFicaPronta = [
  {
    quando: "Primeiro",
    titulo: "Você aprova o roteiro",
    texto: "As seções e a mensagem principal da página, antes de desenhar.",
    icone: <ClipboardCheckIcon className="size-4.5" />,
  },
  {
    quando: "Depois",
    titulo: "A Adsgator desenha",
    texto: "O visual fica por nossa conta, sob medida, em cima do roteiro.",
    icone: <PaletteIcon className="size-4.5" />,
  },
  {
    quando: "Até 14 dias úteis",
    titulo: "A página pronta",
    texto: "Contados depois que você manda todo o material.",
    icone: <CalendarCheckIcon className="size-4.5" />,
  },
  {
    quando: "Se precisar",
    titulo: "Até 2 rodadas de ajustes",
    texto: "Para deixar do jeito certo antes de ir ao ar.",
    icone: <RefreshCwIcon className="size-4.5" />,
  },
  {
    quando: "Na entrega",
    titulo: "No ar",
    texto: "Você recebe as imagens da página no WhatsApp e o registro por e-mail.",
    icone: <SendIcon className="size-4.5" />,
  },
];

const naoInclui = [
  "Fotos profissionais",
  "Logo e identidade visual",
  "E-mail profissional",
  "A manutenção depois da entrega, que é contratada à parte",
];

const perguntas = [
  {
    pergunta: "Quanto custa?",
    resposta:
      "A página tem preço fixo, igual para todos, pago uma vez. Quem contrata também o Google Ads tem desconto na página. Te passo tudo na conversa.",
  },
  {
    pergunta: "A página é minha?",
    resposta: (
      <>
        Sim. O domínio é registrado no seu nome, e os arquivos são entregues sem custo sempre que você pedir (veja
        os{" "}
        <Link className="font-medium text-foreground underline underline-offset-4" href="/termos#landing-page">
          Termos
        </Link>
        ).
      </>
    ),
  },
  { pergunta: "Em quanto tempo fica pronta?", resposta: "Em até 14 dias úteis depois que você manda todo o material pedido." },
  {
    pergunta: "Eu aprovo o visual?",
    resposta:
      "Você aprova o roteiro: as seções e a mensagem principal. O visual fica por conta da Adsgator, que desenha a página para ela ter a cara do seu negócio e funcionar.",
  },
  {
    pergunta: "E se eu quiser mudar alguma coisa?",
    resposta:
      "Antes da entrega, são até 2 rodadas de ajustes. Depois, com a manutenção, você tem até 2 horas de pequenos ajustes por mês.",
  },
  {
    pergunta: "Funciona sem o Google Ads?",
    resposta:
      "Funciona. A página serve para qualquer divulgação: Instagram, indicação, cartão de visita. Com o Google Ads, ela é para onde o anúncio leva.",
  },
  {
    pergunta: "E se eu desistir?",
    resposta: (
      <>
        Desistindo em até 7 dias da contratação, você recebe de volta tudo o que pagou à Adsgator, em até 15 dias
        úteis (veja{" "}
        <Link className="font-medium text-foreground underline underline-offset-4" href="/termos#reembolso">
          Reembolso
        </Link>
        ).
      </>
    ),
  },
];

export default function Page() {
  return (
    <>
      {/* 1. Topo: a página sendo montada seção por seção. */}
      <MotionScope>
        <FundoVivo className="overflow-x-clip">
          <PartesNoAr />
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-28 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-36">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                Landing page sob medida
              </p>
              <h1 className="mt-7 font-heading text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl">
                Uma página feita para transformar o clique em <span className="highlight">conversa</span>.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
                Quem chega entende em segundos o que você faz e chama no seu WhatsApp. Sob medida, rápida no celular e
                no seu nome.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={whatsapp} className={botaoMarca}>
                  Quero a minha página
                  <ArrowRightIcon />
                </a>
                <a href="#como-fica-pronta" className={botaoContorno}>
                  Como fica pronta
                </a>
              </div>
              <p className="mt-8 font-mono text-xs text-muted-foreground">
                Pronta em até 14 dias úteis · Feita sob medida · Domínio no seu nome
              </p>
            </div>
            <PaginaMontando />
          </div>
        </FundoVivo>
      </MotionScope>

      {/* 2. O que vem nela. */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Eyebrow>O que vem nela</Eyebrow>
        <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
          Tudo o que uma página precisa. <span className="text-muted-foreground">Sem você correr atrás de nada.</span>
        </h2>
        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {oQueVem.map(({ icone: Icone, titulo: t, texto }, i) => (
            <li key={t}>
              <Reveal delay={(i % 4) * 90} className="h-full rounded-3xl border bg-card p-6">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand/15">
                  <Icone className="size-4.5" />
                </span>
                <h3 className="mt-5 font-heading text-xl leading-tight">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{texto}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Como fica pronta. */}
      <section id="como-fica-pronta" className="scroll-mt-24 border-t">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Eyebrow>Como fica pronta</Eyebrow>
          <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
            Você aprova o roteiro. <span className="text-muted-foreground">O resto fica com a gente.</span>
          </h2>
          <div className="mt-16">
            <LinhaDoTempo marcos={comoFicaPronta} />
          </div>
        </div>
      </section>

      {/* 4. É sua, e a gente pode cuidar dela. */}
      <section className="dark section-ink bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <Eyebrow>No seu nome</Eyebrow>
              <h2 className={cn(titulo, "mt-6")}>A página é sua. E a gente pode cuidar dela.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                O domínio fica registrado no seu nome. Depois da entrega, você escolhe o que fazer com ela.
              </p>
            </div>
            <Reveal>
              <div aria-hidden="true" className="flex items-center gap-4 rounded-2xl border bg-card/60 px-5 py-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
                  <GlobeIcon className="size-5" />
                </span>
                <div className="min-w-0 leading-snug">
                  <p className="truncate font-mono text-sm">seunegocio.com.br</p>
                  <p className="text-sm text-muted-foreground">Titular: você</p>
                </div>
                <LockIcon className="ml-auto size-4 shrink-0 text-success" />
              </div>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <Reveal className="h-full rounded-3xl border border-brand bg-card/60 p-8">
              <p className="font-mono text-xs text-brand">Com a manutenção</p>
              <h3 className="mt-3 font-heading text-3xl leading-tight">A Adsgator segue cuidando.</h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                Hospedagem, domínio renovado, monitoramento, pequenos ajustes e suporte. Você não precisa pensar nisso.
                É contratada à parte; para quem tem o Google Ads com a Adsgator, já vem incluída.
              </p>
              <Link href="/manutencao" className="mt-6 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
                O que entra na manutenção
                <ArrowRightIcon className="size-4" />
              </Link>
            </Reveal>
            <Reveal delay={120} className="h-full rounded-3xl border bg-card/40 p-8">
              <p className="font-mono text-xs text-muted-foreground">Por sua conta</p>
              <h3 className="mt-3 font-heading text-3xl leading-tight">Você leva a página.</h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                Você recebe os arquivos e a página numa conta no seu nome, para cuidar do jeito que preferir.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Portfólio. */}
      <PortfolioFaixa />

      {/* 6 e 7. Mais páginas e o que não inclui. */}
      <section className="mx-auto grid max-w-6xl gap-14 px-4 py-24 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="rounded-3xl border bg-card p-8 sm:p-10">
          <Eyebrow>Precisa de mais páginas?</Eyebrow>
          <h2 className="mt-6 font-heading text-3xl leading-tight sm:text-4xl">
            Páginas a mais e site institucional de até 5 páginas.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
            No mesmo cuidado e no mesmo visual. A gente combina o que você precisa na conversa.
          </p>
          <a href={whatsapp} className={cn(botaoContorno, "mt-8")}>
            Conversar sobre o meu site
          </a>
        </Reveal>
        <div>
          <h2 className="font-heading text-3xl leading-tight">O que não está incluído</h2>
          <ul className="mt-6 divide-y border-y">
            {naoInclui.map((item) => (
              <li key={item} className="flex gap-4 py-4 leading-7 text-muted-foreground">
                <XIcon className="mt-1 size-5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Perguntas e o convite. */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <Eyebrow>Perguntas frequentes</Eyebrow>
        <h2 className={cn(titulo, "mt-6")}>Antes de chamar.</h2>
        <div className="mt-12">
          <Faq itens={perguntas} />
        </div>
      </section>

      <ChamadaFinal
        titulo={
          <>
            Uma página sob medida,
            <br />
            no seu nome.
          </>
        }
        mensagem={mensagemDaPagina("/landing-page")}
        botao="Quero a minha página"
      />
    </>
  );
}

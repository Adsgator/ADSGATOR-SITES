import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  BellRingIcon,
  CalendarSyncIcon,
  CheckIcon,
  FileBarChartIcon,
  MapPinIcon,
  MousePointerClickIcon,
  RefreshCwIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { AnuncioMontando } from "@/components/anuncio-montando";
import { ChamadaFinal } from "@/components/chamada-final";
import { Eyebrow } from "@/components/eyebrow";
import { Faq } from "@/components/faq";
import { FundoVivo } from "@/components/fundo-vivo";
import { LinhaDoTempo } from "@/components/linha-do-tempo";
import { ListaQueSeMarca } from "@/components/lista-que-se-marca";
import { MotionScope } from "@/components/motion/motion-scope";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { VerbaDireta } from "@/components/verba-direta";
import { linkWhatsApp, mensagemDaPagina } from "@/config/site";
import { cn } from "@/lib/utils";

// Página de Google Ads, na ordem do roteiro do site (ADSGATOR-PAINEL,
// DOCS/ROTEIRO-SITE.md, "Google Ads"), aprovado pelo Lucas em 2026-11-20. Sem
// preço (decisão de 2026-11-20): o investimento é dito na conversa, depois do
// diagnóstico.

export const metadata: Metadata = {
  title: "Gestão de Google Ads",
  description:
    "Apareça no Google para quem está procurando o seu serviço agora, com a verba certa para a sua região. Conta no seu nome, sem fidelidade. Diagnóstico grátis pelo WhatsApp.",
  alternates: { canonical: "/google-ads" },
};

const whatsapp = linkWhatsApp(mensagemDaPagina("/google-ads"));

const titulo = "font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl";
const botaoMarca = cn(
  buttonVariants({ size: "lg" }),
  "h-12 rounded-full bg-brand px-7 text-base text-brand-foreground hover:bg-brand/90",
);
const botaoContorno = cn(
  buttonVariants({ size: "lg", variant: "outline" }),
  "h-12 rounded-full bg-transparent px-7 text-base",
);

const diagnostico = [
  { icone: UsersIcon, titulo: "Quantas pessoas procuram", texto: "o seu serviço, na sua região." },
  { icone: MousePointerClickIcon, titulo: "Quanto custa cada clique", texto: "no seu segmento e na sua cidade." },
  { icone: MapPinIcon, titulo: "Quantos contatos a verba compra", texto: "para você saber o que esperar antes de investir." },
];

const comeco = [
  { titulo: "A conta do Google Ads", texto: "Criada no seu nome, ou conferida, se você já tem uma." },
  { titulo: "O seu perfil no Google", texto: "Criado ou ajustado, com os dados do seu negócio certos." },
  { titulo: "A medição dos contatos", texto: "Cada toque no WhatsApp é contado, para você saber o que o anúncio trouxe." },
  { titulo: "A campanha", texto: "Montada para as buscas de quem quer contratar, na sua região." },
  { titulo: "Os visuais dos anúncios", texto: "As imagens e os textos, com a cara do seu negócio." },
];

const todoMes = [
  {
    quando: "Toda semana",
    titulo: "Revisão com ajustes",
    texto: "A verba vai para as buscas que trazem contato e sai das que não trazem.",
    icone: <RefreshCwIcon className="size-4.5" />,
  },
  {
    quando: "Quando precisar",
    titulo: "Aviso de saldo",
    texto: "Antes de o saldo acabar, você fica sabendo, para o anúncio não parar.",
    icone: <BellRingIcon className="size-4.5" />,
  },
  {
    quando: "Todo mês",
    titulo: "O resumo do mês",
    texto: "No WhatsApp e por e-mail: o que chegou e o que fizemos na sua conta.",
    icone: <FileBarChartIcon className="size-4.5" />,
  },
  {
    quando: "A cada 3 meses",
    titulo: "Uma conversa",
    texto: "Sobre o que mudou no seu negócio, para a campanha mudar junto.",
    icone: <CalendarSyncIcon className="size-4.5" />,
  },
];

const paraQuem = [
  "Cada cliente novo vale muito para o seu negócio.",
  "Você responde rápido quem chama.",
  "Você quer começar com a verba certa e um prazo realista.",
  "Você sabe que o anúncio traz o contato, e quem fecha é você.",
];

const naoInclui = [
  "A verba do Google, que você paga direto ao Google",
  "O atendimento de quem chama no seu WhatsApp",
  "Posts para redes sociais",
  "Anúncios no Instagram e no Facebook (Meta Ads)",
];

const perguntas = [
  {
    pergunta: "Quanto custa?",
    resposta:
      "A gestão tem preço fixo, igual para todos, sem taxa de criação. A verba do Google sai do diagnóstico, para a sua região. Te passo tudo na conversa, com o porquê de cada parte.",
  },
  { pergunta: "Quem paga a verba do Google?", resposta: "Você, direto ao Google, na sua conta. A verba não passa pela Adsgator." },
  { pergunta: "Tem fidelidade?", resposta: "Não. Cancele quando quiser e volte quando quiser." },
  { pergunta: "A conta é minha?", resposta: "Sim. A conta do Google Ads fica no seu nome, e você tem o acesso a ela." },
  {
    pergunta: "Em quanto tempo começa?",
    resposta: "Em até 3 dias úteis depois que você manda os acessos e o briefing.",
  },
  {
    pergunta: "Preciso ter site?",
    resposta: (
      <>
        Não. A Adsgator faz a sua{" "}
        <Link className="font-medium text-foreground underline underline-offset-4" href="/landing-page">
          landing page
        </Link>
        , ou usamos o seu site, com o que os anúncios precisam funcionando.
      </>
    ),
  },
  {
    pergunta: "Vocês garantem resultado?",
    resposta:
      "Ninguém sério garante. Garantimos que quem procura o seu serviço vai encontrar você, e todo mês você vê o que chegou.",
  },
  { pergunta: "Quem atende os contatos?", resposta: "Você. O anúncio traz a conversa; quem fecha é você." },
];

export default function Page() {
  return (
    <>
      {/* 1. Topo: o anúncio se montando na página de resultados. */}
      <MotionScope>
        <FundoVivo className="overflow-x-clip">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-28 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-36">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                Gestão de Google Ads
              </p>
              <h1 className="mt-7 font-heading text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl">
                Apareça para quem está procurando o seu serviço <span className="highlight">agora</span>.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
                Quando alguém na sua cidade digita o que você faz, o seu anúncio aparece, e a conversa começa no seu
                WhatsApp. A conta é sua e a verba vai direto ao Google.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={whatsapp} className={botaoMarca}>
                  Quero um diagnóstico grátis
                  <ArrowRightIcon />
                </a>
                <a href="#comeco" className={botaoContorno}>
                  Como começa
                </a>
              </div>
              <p className="mt-8 font-mono text-xs text-muted-foreground">
                No ar em até 3 dias úteis · Sem fidelidade · Tudo no seu nome
              </p>
            </div>
            <AnuncioMontando />
          </div>
        </FundoVivo>
      </MotionScope>

      {/* 2. Antes de começar, o diagnóstico. */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Eyebrow>Antes de começar</Eyebrow>
        <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
          Primeiro, o diagnóstico. <span className="text-muted-foreground">Grátis, antes de você decidir.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Antes de falar em verba, a gente olha a sua região. Assim você começa com a verba certa para a sua realidade,
          e não com um número chutado.
        </p>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {diagnostico.map(({ icone: Icone, titulo: t, texto }, i) => (
            <Reveal key={t} delay={i * 120}>
              <div className="h-full rounded-3xl border bg-card p-7">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand/15 text-foreground">
                  <Icone className="size-5" />
                </span>
                <h3 className="mt-6 font-heading text-2xl leading-tight">{t}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={360}>
          <div className="mt-5 flex flex-col gap-5 rounded-3xl border bg-card p-7 md:flex-row md:items-center md:justify-between">
            <p className="max-w-md font-heading text-2xl leading-tight">
              A verba é indicada para a sua realidade. <span className="text-muted-foreground">E quem escolhe é você.</span>
            </p>
            <div aria-hidden="true" className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full border px-4 py-2 text-muted-foreground">Começar menor</span>
              <span className="rounded-full bg-brand px-4 py-2 font-medium text-brand-foreground">Indicada para a sua região</span>
              <span className="rounded-full border px-4 py-2 text-muted-foreground">Ir mais longe</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 3. O que fazemos para começar. */}
      <section id="comeco" className="scroll-mt-24 border-t">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 md:grid-cols-[1fr_1.1fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <Eyebrow>Para começar</Eyebrow>
            <h2 className={cn(titulo, "mt-6")}>Tudo pronto em até 3 dias úteis.</h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">
              Contados depois que você manda os acessos e o briefing. Você não precisa mexer em nada: a gente prepara
              cada parte.
            </p>
          </div>
          <ListaQueSeMarca
            itens={comeco}
            final={{ titulo: "No ar.", texto: "Quem procura o seu serviço na sua região já pode encontrar você." }}
          />
        </div>
      </section>

      {/* 4. Todo mês. */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Eyebrow>Depois, todo mês</Eyebrow>
        <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
          A conta não fica largada. <span className="text-muted-foreground">Toda semana tem alguém olhando.</span>
        </h2>
        <div className="mt-16">
          <LinhaDoTempo marcos={todoMes} />
        </div>
      </section>

      {/* 5. Tudo no seu nome. */}
      <section className="dark section-ink bg-background text-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-24 lg:grid-cols-2">
          <div>
            <Eyebrow>Tudo no seu nome</Eyebrow>
            <h2 className={cn(titulo, "mt-6")}>A conta é sua. A verba vai direto ao Google.</h2>
            <ul className="mt-10 space-y-5 text-lg leading-8">
              {[
                "A conta do Google Ads fica no seu nome, com o seu acesso.",
                "Você paga a verba direto ao Google: ela não passa pela Adsgator.",
                "Sem fidelidade. Se um dia você sair, a conta continua sua, com tudo o que foi feito nela.",
              ].map((item) => (
                <li key={item} className="flex gap-4">
                  <CheckIcon className="mt-1.5 size-5 shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <VerbaDireta />
        </div>
      </section>

      {/* 6. Com a página da Adsgator. */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <Reveal>
          <div className="grid gap-6 rounded-3xl border bg-card p-8 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
                Tem a página feita pela Adsgator? A manutenção vem junto.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                Com o Google Ads e a página da Adsgator, a página fica no ar e cuidada, sem custo a mais. Quem clica no
                anúncio chega numa página que funciona.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link href="/landing-page" className={botaoContorno}>
                Ver a landing page
              </Link>
              <Link href="/manutencao" className="inline-flex items-center justify-center gap-2 font-medium underline-offset-4 hover:underline">
                O que entra na manutenção
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 7 e 8. Para quem é e o que não inclui. */}
      <section className="mx-auto grid max-w-6xl gap-14 px-4 py-24 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Eyebrow>Para quem é</Eyebrow>
          <h2 className={cn(titulo, "mt-6")}>É para você se…</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {paraQuem.map((item, i) => (
              <li key={item}>
                <Reveal delay={i * 100} className="flex h-full gap-4 rounded-3xl border bg-card p-6 leading-7">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
                    <CheckIcon className="size-4" />
                  </span>
                  {item}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:pt-24">
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

      {/* 9. Perguntas e o convite. */}
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
            Quem procura você já está no Google.
            <br />
            A gente leva até o seu WhatsApp.
          </>
        }
        mensagem={mensagemDaPagina("/google-ads")}
      />
    </>
  );
}

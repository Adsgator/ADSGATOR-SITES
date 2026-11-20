import type { Metadata } from "next";
import Link from "next/link";
import {
  ActivityIcon,
  ArrowRightIcon,
  BellRingIcon,
  CalendarCheckIcon,
  DatabaseBackupIcon,
  FileBarChartIcon,
  GlobeIcon,
  LockIcon,
  MessageCircleIcon,
  PencilIcon,
  RefreshCwIcon,
  ServerIcon,
  ShieldCheckIcon,
  XIcon,
} from "lucide-react";

import { ChamadaFinal } from "@/components/chamada-final";
import { ConferenciasNoAr } from "@/components/colunas-subindo";
import { Eyebrow } from "@/components/eyebrow";
import { Faq } from "@/components/faq";
import { FundoVivo } from "@/components/fundo-vivo";
import { LinhaDoTempo } from "@/components/linha-do-tempo";
import { MotionScope } from "@/components/motion/motion-scope";
import { Reveal } from "@/components/motion/reveal";
import { PainelSituacao } from "@/components/painel-situacao";
import { buttonVariants } from "@/components/ui/button";
import { linkWhatsApp, mensagemDaPagina } from "@/config/site";
import { cn } from "@/lib/utils";

// Página de manutenção, na ordem do roteiro do site (ADSGATOR-PAINEL,
// DOCS/ROTEIRO-SITE.md, "Manutenção"), aprovado pelo Lucas em 2026-11-20. O
// que entra e o que não entra são da Base ("Serviços e preços"). Sem preço
// (decisão de 2026-11-20). A linha "Enquanto você trabalha" não diz de quanto
// em quanto tempo cada conferência roda, para não ficar errada se a rotina
// mudar.

export const metadata: Metadata = {
  title: "Manutenção de página",
  description:
    "Sua página sempre no ar: hospedagem, cadeado, domínio renovado, monitoramento, cópias de segurança, pequenos ajustes e suporte. Diagnóstico grátis pelo WhatsApp.",
  alternates: { canonical: "/manutencao" },
};

const whatsapp = linkWhatsApp(mensagemDaPagina("/manutencao"));

const titulo = "font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl";
const botaoMarca = cn(
  buttonVariants({ size: "lg" }),
  "h-12 rounded-full bg-brand px-7 text-base text-brand-foreground hover:bg-brand/90",
);
const botaoContorno = cn(
  buttonVariants({ size: "lg", variant: "outline" }),
  "h-12 rounded-full bg-transparent px-7 text-base",
);

const oQueEntra = [
  { icone: ServerIcon, titulo: "Hospedagem", texto: "A página num lugar rápido e seguro." },
  { icone: LockIcon, titulo: "Cadeado de segurança", texto: "O certificado sempre válido." },
  { icone: GlobeIcon, titulo: "Domínio renovado", texto: "Todo ano, antes de vencer." },
  { icone: ActivityIcon, titulo: "Monitoramento", texto: "A página no ar, o botão do WhatsApp e a medição conferidos." },
  { icone: RefreshCwIcon, titulo: "Atualizações", texto: "O que a página usa, sempre em dia." },
  { icone: DatabaseBackupIcon, titulo: "Cópias de segurança", texto: "Se algo der errado, a página volta." },
  { icone: PencilIcon, titulo: "Pequenos ajustes", texto: "Até 2 horas por mês: um texto, uma foto, um horário." },
  { icone: MessageCircleIcon, titulo: "Suporte", texto: "Resposta em até 2 dias úteis." },
  { icone: FileBarChartIcon, titulo: "Resumo a cada 3 meses", texto: "As visitas e os toques no WhatsApp, numa mensagem." },
];

const enquantoVoceTrabalha = [
  {
    quando: "O tempo todo",
    titulo: "A página no ar",
    texto: "Se ela cair, a gente fica sabendo na hora.",
    icone: <BellRingIcon className="size-4.5" />,
  },
  {
    quando: "Todo dia",
    titulo: "A conferência",
    texto: "O botão do WhatsApp, a medição e o cadeado funcionando.",
    icone: <ShieldCheckIcon className="size-4.5" />,
  },
  {
    quando: "Antes de vencer",
    titulo: "O domínio renovado",
    texto: "Você não perde o endereço da sua página.",
    icone: <CalendarCheckIcon className="size-4.5" />,
  },
  {
    quando: "A cada 3 meses",
    titulo: "O resumo",
    texto: "Quantas pessoas visitaram e quantas tocaram no WhatsApp.",
    icone: <FileBarChartIcon className="size-4.5" />,
  },
];

const naoEntra = ["Página nova", "Mudança de layout", "Seção nova"];

const perguntas = [
  {
    pergunta: "Quanto custa?",
    resposta:
      "Um valor fixo por mês, igual para todos. Para quem tem o Google Ads com a Adsgator e a página feita por ela, já vem incluída. Te passo tudo na conversa.",
  },
  {
    pergunta: "Tem fidelidade?",
    resposta:
      "Não. Pode cancelar quando quiser, sem multa, avisando 48 horas antes do próximo vencimento.",
  },
  {
    pergunta: "E se eu cancelar o Google Ads?",
    resposta: "A manutenção passa a ser cobrada à parte, ou você recebe os arquivos da página, como preferir.",
  },
  {
    pergunta: "O que são pequenos ajustes?",
    resposta:
      "Trocar um texto, uma foto, um telefone, um horário. São até 2 horas por mês, que não acumulam. Página nova, mudança de layout e seção nova são combinadas à parte.",
  },
  { pergunta: "Em quanto tempo vocês respondem?", resposta: "Em até 2 dias úteis." },
  {
    pergunta: "Vocês cuidam de um site que eu já tenho?",
    resposta: (
      <>
        A manutenção é para as páginas feitas pela Adsgator. Se você já tem um site, me chama que a gente conversa
        sobre o que dá para fazer, ou sobre uma{" "}
        <Link className="font-medium text-foreground underline underline-offset-4" href="/landing-page">
          landing page nova
        </Link>
        .
      </>
    ),
  },
];

export default function Page() {
  return (
    <>
      {/* 1. Topo: o painel de situação com a conferência do dia. */}
      <MotionScope>
        <FundoVivo className="overflow-x-clip">
          <ConferenciasNoAr />
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-28 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-36">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                Manutenção e suporte
              </p>
              <h1 className="mt-7 font-heading text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl">
                Sua página sempre no ar, sem você se <span className="highlight">preocupar</span>.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
                A gente cuida da hospedagem, do cadeado, do domínio e confere a página todo dia. Você cuida do seu
                negócio.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={whatsapp} className={botaoMarca}>
                  Quero um diagnóstico grátis
                  <ArrowRightIcon />
                </a>
                <a href="#como-contratar" className={botaoContorno}>
                  Como contratar
                </a>
              </div>
              <p className="mt-8 font-mono text-xs text-muted-foreground">
                Sem fidelidade · Suporte em até 2 dias úteis · Inclusa com o Google Ads
              </p>
            </div>
            <PainelSituacao />
          </div>
        </FundoVivo>
      </MotionScope>

      {/* 2. O que entra. */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Eyebrow>O que entra</Eyebrow>
        <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
          Tudo o que mantém a página de pé. <span className="text-muted-foreground">Num serviço só.</span>
        </h2>
        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {oQueEntra.map(({ icone: Icone, titulo: t, texto }, i) => (
            <li key={t}>
              <Reveal delay={(i % 3) * 90} className="flex h-full gap-5 rounded-3xl border bg-card p-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/15">
                  <Icone className="size-4.5" />
                </span>
                <div>
                  <h3 className="font-heading text-xl leading-tight">{t}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{texto}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-24">
          <Eyebrow>Enquanto você trabalha</Eyebrow>
          <h2 className="mt-6 max-w-3xl font-heading text-3xl leading-tight sm:text-4xl">
            A página é conferida sem você precisar lembrar dela.
          </h2>
          <div className="mt-14">
            <LinhaDoTempo marcos={enquantoVoceTrabalha} />
          </div>
        </div>
      </section>

      {/* 3. Como contratar. */}
      <section id="como-contratar" className="dark section-ink scroll-mt-24 bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Eyebrow>Como contratar</Eyebrow>
          <h2 className={cn(titulo, "mt-6 max-w-3xl")}>Depende de como você está com a Adsgator.</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <Reveal className="h-full rounded-3xl border bg-card/40 p-8">
              <p className="font-mono text-xs text-muted-foreground">Só a página</p>
              <h3 className="mt-3 font-heading text-3xl leading-tight">Um serviço mensal, à parte.</h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                Oferecido na entrega da sua landing page. Se preferir cuidar dela por conta própria, você recebe os
                arquivos e a página numa conta no seu nome.
              </p>
              <Link href="/landing-page" className="mt-6 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
                Ver a landing page
                <ArrowRightIcon className="size-4" />
              </Link>
            </Reveal>
            <Reveal delay={120} className="h-full rounded-3xl border border-brand bg-card/60 p-8">
              <p className="font-mono text-xs text-brand">Com o Google Ads</p>
              <h3 className="mt-3 font-heading text-3xl leading-tight">Já vem incluída.</h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                Para quem tem o Google Ads com a Adsgator e a página feita por ela, a manutenção vem junto, sem custo a
                mais. Quem clica no anúncio sempre chega numa página que funciona.
              </p>
              <Link href="/google-ads" className="mt-6 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
                Ver o Google Ads
                <ArrowRightIcon className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. O que não entra. */}
      <section className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-24 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <Eyebrow>O que não entra</Eyebrow>
          <h2 className="mt-6 font-heading text-3xl leading-tight sm:text-4xl">Mudança grande é combinada à parte.</h2>
          <p className="mt-4 max-w-md text-lg leading-8 text-muted-foreground">
            Com o preço fechado na conversa, antes de começar.
          </p>
        </div>
        <ul className="divide-y border-y lg:mt-14">
          {naoEntra.map((item) => (
            <li key={item} className="flex gap-4 py-4 text-lg leading-7 text-muted-foreground">
              <XIcon className="mt-1 size-5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Perguntas e o convite. */}
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
            Sua página no ar.
            <br />
            Você no seu negócio.
          </>
        }
        mensagem={mensagemDaPagina("/manutencao")}
      />
    </>
  );
}

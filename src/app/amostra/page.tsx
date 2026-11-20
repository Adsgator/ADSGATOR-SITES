import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { BumerangueFrame } from "@/components/bumerangue";
import { BuscasCidade } from "@/components/buscas-cidade";
import { CaminhoCliente } from "@/components/caminho-cliente";
import { CliqueAnimado } from "@/components/clique-animado";
import { MapaBuscas } from "@/components/mapa-buscas";
import { HojeComAdsgator } from "@/components/hoje-com-adsgator";
import { PorQueAdsgator } from "@/components/por-que-adsgator";
import { PortfolioFaixa } from "@/components/portfolio-faixa";
import { QuemEstaPorTras } from "@/components/quem-esta-por-tras";
import { ServicosVivos } from "@/components/servicos-vivos";
import { Eyebrow } from "@/components/eyebrow";
import { Faq } from "@/components/faq";
import { Marquee } from "@/components/motion/marquee";
import { MotionPauseButton, MotionScope } from "@/components/motion/motion-scope";
import { TelasServico } from "@/components/telas-servico";
import { buttonVariants } from "@/components/ui/button";
import { linkWhatsApp, mensagemDiagnostico, site } from "@/config/site";
import { cn } from "@/lib/utils";

// Amostra 3 da Fase 1B, só no branch: a amostra 2 (aprovada em 2026-11-20)
// com mais movimento e efeitos de rolagem, seguindo o Zouti, a Vercel e o
// Framer (plano geral, Parte 1). Começa pelo topo com as telas do serviço em
// 3D; as outras peças entram uma por vez. Sai antes de juntar na main.
export const metadata: Metadata = {
  title: "Amostra do visual",
  robots: { index: false, follow: false },
};

// A faixa de confiança do roteiro do site (Início, seção 2).
const fatos = [
  "Tudo no seu nome",
  "Sem fidelidade",
  "Sem taxa de criação",
  "Você fala direto com quem faz",
  "Resumo todo mês",
  "Página pronta em até 14 dias úteis",
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
  return (
    <>
      <p className="border-b py-2 text-center font-mono text-xs text-muted-foreground">
        Amostra 3 do visual · fora do Google · as perguntas e a chamada final
        ainda são da amostra 2 e mudam na Parte 2
      </p>

      {/* Topo: frase de posição da Base e as telas do serviço em 3D. */}
      <MotionScope>
        <section className="relative isolate overflow-x-clip">
          {/* A caixa do mapa termina no topo do celular da hero (TelasServico:
              mt-14 + top-20 no celular; mt-20 + top-0 a partir de sm). */}
          <div className="relative">
          <MapaBuscas className="inset-x-0 top-0 -bottom-[8.5rem] -z-10 sm:-bottom-[5rem]" />
          <div className="mx-auto max-w-4xl px-4 pt-20 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
              Google Ads e landing pages
            </p>
            <h1 className="mt-7 font-heading text-5xl leading-[1.02] tracking-tight text-balance sm:text-7xl">
              Quem procura o seu serviço no Google chega ao seu{" "}
              <span className="highlight">WhatsApp</span>.
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              A Adsgator faz essa conexão com anúncio e página sob medida, tudo no
              seu nome.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a href={linkWhatsApp(mensagemDiagnostico)} className={botaoMarca}>
                Quero um diagnóstico grátis
                <ArrowRightIcon />
              </a>
              <a href="#como-funciona" className={botaoContorno}>
                Como funciona
              </a>
            </div>
          </div>
          </div>
          <TelasServico />
          <div className="relative mt-16 border-t bg-background/60 backdrop-blur-sm">
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

      {/* A ordem do roteiro do site (Início, seções 3 a 9); o portfólio entra
          depois da escolha das páginas. */}
      <>
        <BuscasCidade />
        <HojeComAdsgator />
        <div id="como-funciona" className="scroll-mt-24">
          <CaminhoCliente />
        </div>
        <ServicosVivos />
        <PorQueAdsgator />
        <PortfolioFaixa />
        <QuemEstaPorTras />

        {/* Perguntas frequentes. */}
        <section className="mx-auto max-w-4xl px-4 pb-24">
          <Eyebrow>Perguntas frequentes</Eyebrow>
          <h2 className={cn(titulo, "mt-6")}>Antes de contratar.</h2>
          <div className="mt-12">
            <Faq itens={perguntas} />
          </div>
        </section>
      </>

      {/* Ponte para a chamada final: o fundo passa para o amarelo aos poucos,
          sem corte seco entre as seções. */}
      <div aria-hidden="true" className="h-40 bg-[linear-gradient(to_bottom,transparent,var(--brand))]" />

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
            {/* O cursor da marca clica no anúncio, a página abre e o clique no
                WhatsApp vira conversa (pedido do Lucas, 2026-11-20). */}
            <div className="mx-auto lg:mx-0">
              <CliqueAnimado />
            </div>
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

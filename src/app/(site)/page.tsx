import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { BuscasCidade } from "@/components/buscas-cidade";
import { CaminhoCliente } from "@/components/caminho-cliente";
import { ChamadaFinal } from "@/components/chamada-final";
import { Eyebrow } from "@/components/eyebrow";
import { Faq } from "@/components/faq";
import { HojeComAdsgator } from "@/components/hoje-com-adsgator";
import { MapaBuscas } from "@/components/mapa-buscas";
import { Marquee } from "@/components/motion/marquee";
import { MotionScope } from "@/components/motion/motion-scope";
import { PorQueAdsgator } from "@/components/por-que-adsgator";
import { PortfolioFaixa } from "@/components/portfolio-faixa";
import { QuemEstaPorTras } from "@/components/quem-esta-por-tras";
import { ServicosVivos } from "@/components/servicos-vivos";
import { TelasServico } from "@/components/telas-servico";
import { buttonVariants } from "@/components/ui/button";
import { linkWhatsApp, mensagemDiagnostico } from "@/config/site";
import { cn } from "@/lib/utils";

// Página inicial, na ordem do roteiro do site (ADSGATOR-PAINEL,
// DOCS/ROTEIRO-SITE.md, "Início"): a amostra 3 aprovada peça a peça pelo Lucas
// (2026-11-20), sem a faixa de amostra e sem o "Sistema visual", com as
// perguntas do roteiro (seção "Perguntas frequentes") e a chamada final dele.

export const metadata: Metadata = {
  title: { absolute: "Adsgator · Google Ads e landing pages para negócios locais" },
  description:
    "Quem procura o seu serviço no Google chega ao seu WhatsApp: anúncio no Google Ads e landing page sob medida, tudo no seu nome. Diagnóstico grátis.",
  alternates: { canonical: "/" },
};

// A faixa de confiança do roteiro do site (Início, seção 2).
const fatos = [
  "Tudo no seu nome",
  "Sem fidelidade",
  "Sem taxa de criação",
  "Você fala direto com quem faz",
  "Resumo todo mês",
  "Página pronta em até 7 dias úteis",
];

const link = "font-medium text-foreground underline underline-offset-4";

// As perguntas do roteiro; a do site que a pessoa já tem segue a regra do Lucas
// (análise, e orçamento à parte se precisar refazer).
const perguntas = [
  {
    pergunta: "Quanto custa?",
    resposta:
      "A gestão tem um valor fixo, igual para todos, sem taxa de criação. A verba do Google sai do diagnóstico, para a sua região. Te passo tudo na conversa, com o porquê de cada parte.",
  },
  {
    pergunta: "Quem paga a verba do Google?",
    resposta: "Você, direto ao Google, na sua conta. A verba não passa pela Adsgator.",
  },
  {
    pergunta: "Tem fidelidade?",
    resposta:
      "Não. Os planos mensais podem ser cancelados quando você quiser, sem multa, avisando 48 horas antes do próximo vencimento. E você pode voltar quando quiser.",
  },
  {
    pergunta: "A conta, a página e o domínio são meus?",
    resposta: (
      <>
        Sim, tudo no seu nome. Os arquivos da página são entregues sem custo sempre que você pedir (veja os{" "}
        <Link className={link} href="/termos#landing-page">
          Termos
        </Link>
        ).
      </>
    ),
  },
  {
    pergunta: "Em quanto tempo começa?",
    resposta:
      "O Google Ads entra no ar em até 3 dias úteis depois que chegam os acessos e o formulário. A página fica pronta em até 7 dias úteis depois que chega o material.",
  },
  {
    pergunta: "Preciso ter site?",
    resposta:
      "Não: a Adsgator faz a página. Se você já tem um site, ele passa por uma análise para ver o que precisa para os anúncios funcionarem.",
  },
  {
    pergunta: "Vocês garantem resultado?",
    resposta:
      "Ninguém sério garante. O que a gente garante é que quem procura o seu serviço vai encontrar você, e todo mês você vê o que chegou.",
  },
  {
    pergunta: "Quem atende os contatos?",
    resposta: "Você. O anúncio traz a conversa até o seu WhatsApp, e quem fecha é você.",
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
                Quem procura o seu serviço no Google chega ao seu <span className="highlight">WhatsApp</span>.
              </h1>
              <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
                A Adsgator faz essa conexão com anúncio e página sob medida, tudo no seu nome.
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
            <Marquee className="py-5">
              {fatos.map((fato) => (
                <span key={fato} className="flex items-center gap-6 px-6 text-lg whitespace-nowrap">
                  {fato}
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                </span>
              ))}
            </Marquee>
          </div>
        </section>
      </MotionScope>

      {/* A ordem do roteiro do site (Início, seções 3 a 9). */}
      <BuscasCidade />
      <HojeComAdsgator />
      <div id="como-funciona" className="scroll-mt-24">
        <CaminhoCliente />
      </div>
      <div className="mx-auto -mt-8 max-w-6xl px-4 pb-16">
        <Link href="/como-funciona" className="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
          Ver cada passo, do primeiro oi ao anúncio no ar
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
      <ServicosVivos />
      <PorQueAdsgator />
      <PortfolioFaixa />
      <QuemEstaPorTras />

      {/* Perguntas frequentes. */}
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
        mensagem={mensagemDiagnostico}
      />
    </>
  );
}

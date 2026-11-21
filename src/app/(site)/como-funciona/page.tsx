import type { Metadata } from "next";
import { ArrowRightIcon, CheckIcon } from "lucide-react";

import { ChamadaFinal } from "@/components/chamada-final";
import { EtapasNoAr } from "@/components/colunas-subindo";
import { ConversaComecando } from "@/components/conversa-comecando";
import { Eyebrow } from "@/components/eyebrow";
import { Faq } from "@/components/faq";
import { FundoVivo } from "@/components/fundo-vivo";
import { MotionScope } from "@/components/motion/motion-scope";
import { Reveal } from "@/components/motion/reveal";
import { PassosNaRolagem, type Passo } from "@/components/passos-na-rolagem";
import { PrazoNaConversa } from "@/components/prazo-na-conversa";
import { PrimeiroMes } from "@/components/primeiro-mes";
import { buttonVariants } from "@/components/ui/button";
import { linkWhatsApp, mensagemDaPagina } from "@/config/site";
import { cn } from "@/lib/utils";

// Página "Como funciona", na ordem do roteiro do site (ADSGATOR-PAINEL,
// DOCS/ROTEIRO-SITE.md, "Como funciona"), aprovado pelo Lucas em 2026-11-20:
// tirar o medo do desconhecido, com cada passo, quem faz o quê e quanto tempo
// leva. Prazos da Base ("Serviços e preços"). Rodada de profundidade (Lucas,
// 2026-11-20), com os processos da Base ("Entrada do cliente", "Landing page" e
// "Google Ads"): o que a gente vai te pedir em cada serviço, o prazo com data
// quando chega tudo, o primeiro mês da campanha, as dúvidas e as perguntas.

export const metadata: Metadata = {
  title: "Como funciona",
  description:
    "Do primeiro oi no WhatsApp ao seu anúncio no ar: cada passo, quem faz o quê e quanto tempo leva. Diagnóstico grátis.",
  alternates: { canonical: "/como-funciona" },
};

const whatsapp = linkWhatsApp(mensagemDaPagina("/como-funciona"));

const botaoMarca = cn(
  buttonVariants({ size: "lg" }),
  "h-12 rounded-full bg-brand px-7 text-base text-brand-foreground hover:bg-brand/90",
);
const botaoContorno = cn(
  buttonVariants({ size: "lg", variant: "outline" }),
  "h-12 rounded-full bg-transparent px-7 text-base",
);

const passos: Passo[] = [
  {
    titulo: "Você chama no WhatsApp",
    texto: "Pelo botão do site, com a mensagem pronta. Você fala direto com quem vai cuidar do seu negócio.",
    quem: "Você",
    tempo: "Um minuto",
  },
  {
    titulo: "Conversamos e fazemos o diagnóstico",
    texto: "Você conta do seu negócio. A gente olha quantas pessoas procuram o seu serviço na sua região e quanto custa aparecer.",
    quem: "Juntos",
    tempo: "Uma conversa, grátis",
  },
  {
    titulo: "Você recebe a proposta, por escrito",
    texto: "O que vai ser feito, os prazos e o investimento, tudo claro, para você decidir com calma.",
    quem: "Adsgator",
  },
  {
    titulo: "Você contrata pelo link seguro",
    texto: "Com os Termos aceitos e o pagamento pelo link. Sem fidelidade nos planos mensais.",
    quem: "Você",
  },
  {
    titulo: "Você manda o material e os acessos",
    texto: "Pelo briefing, um formulário simples, e com os guias passo a passo da Central de Ajuda.",
    quem: "Você",
  },
  {
    titulo: "Fazemos a página e a campanha",
    texto: "Contados depois que o material e os acessos chegam. Você aprova o roteiro da página.",
    quem: "Adsgator",
    tempo: "Google Ads em até 3 dias úteis · página em até 14",
  },
  {
    titulo: "No ar",
    texto: "Quem procura o seu serviço já encontra você. A página chega com as imagens no seu WhatsApp.",
    quem: "Adsgator",
  },
  {
    titulo: "Todo mês",
    texto: "A conta monitorada 24 horas, uma revisão completa toda semana, o resumo do mês no WhatsApp e por e-mail, e uma conversa a cada 3 meses.",
    quem: "Juntos",
    tempo: "Enquanto você quiser",
  },
];

const comVoce = [
  "Contar do seu negócio na conversa",
  "Aprovar a proposta e contratar",
  "Mandar o material e os acessos",
  "Aprovar o roteiro da página",
  "Responder rápido quem chama no WhatsApp",
  "Pagar a verba direto ao Google",
];

const comAdsgator = [
  "Fazer o diagnóstico e a proposta",
  "Criar ou conferir a conta e o perfil no Google",
  "Fazer a página e a campanha",
  "Medir os contatos que chegam",
  "Acompanhar a conta todo dia e mandar o resumo do mês",
  "Cuidar da página no ar, com a manutenção",
];

const titulo = "font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl";

const pedidos = [
  {
    servico: "Para a página",
    itens: [
      "O formulário com as perguntas sobre o seu negócio",
      "O logo e as fotos que você tiver",
      "Tudo numa pasta do Drive criada para você",
    ],
  },
  {
    servico: "Para o Google Ads",
    itens: [
      "O formulário da campanha",
      "O acesso à conta do Google Ads. Não tem? A gente cria, no seu nome",
      "O acesso ao seu perfil no Google. Não tem? A gente cria e passa para você",
    ],
  },
];

const objecoes = [
  {
    duvida: "“Não entendo nada de internet.”",
    resposta:
      "Não precisa. Você conta do seu negócio do seu jeito, e cada coisa que a gente pedir vem com um guia passo a passo. O que é técnico fica com a gente.",
  },
  {
    duvida: "“Não tenho tempo para acompanhar.”",
    resposta:
      "A sua parte fica quase toda no começo: a conversa, o material e a aprovação. Depois, a conta é acompanhada por um especialista, e o resumo do mês chega no seu WhatsApp.",
  },
  {
    duvida: "“E se eu chamar e não quiser contratar?”",
    resposta:
      "Tudo bem. O diagnóstico é grátis e sem compromisso: você recebe a proposta por escrito e decide com calma.",
  },
  {
    duvida: "“Vou ter que ficar mandando coisa toda hora?”",
    resposta:
      "Não. O material vai uma vez só, no começo, e o prazo começa quando chega tudo. Depois, só se você quiser mudar algo.",
  },
];

const perguntas = [
  {
    pergunta: "Quanto tempo leva, do primeiro oi ao anúncio no ar?",
    resposta:
      "O Google Ads entra no ar em até 3 dias úteis depois que chegam os acessos e o formulário, sem contar a análise do próprio Google. A página fica pronta em até 14 dias úteis depois que chega o material. Com os dois, a campanha entra logo depois que a página é publicada.",
  },
  {
    pergunta: "Preciso ter CNPJ?",
    resposta:
      "Não. Dá para anunciar como pessoa física. Às vezes o Google pede a verificação do anunciante, com um documento, e a gente te diz exatamente o que mandar.",
  },
  {
    pergunta: "Preciso já ter conta no Google Ads ou perfil no Google?",
    resposta: "Não. Se você não tiver, a gente cria, e os dois ficam no seu nome.",
  },
  {
    pergunta: "E se eu demorar para mandar o material?",
    resposta:
      "Sem problema: o prazo só começa quando chega tudo, e a gente te lembra do que falta. Só um projeto parado há mais de 60 dias pode ser encerrado, como dizem os Termos.",
  },
  {
    pergunta: "Eu aprovo a página antes de ir ao ar?",
    resposta:
      "Sim, em duas vezes: primeiro o roteiro, com as partes e a mensagem principal, e depois a página pronta, com os ajustes que você pedir.",
  },
  {
    pergunta: "Tem fidelidade?",
    resposta:
      "Não. Os planos mensais podem ser cancelados quando você quiser, sem multa, avisando 48 horas antes do próximo vencimento.",
  },
];

export default function Page() {
  return (
    <>
      {/* Topo: a conversa começando. */}
      <MotionScope>
        <FundoVivo className="overflow-x-clip">
          <EtapasNoAr />
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-28 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-36">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                Como funciona
              </p>
              <h1 className="mt-7 font-heading text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl">
                Do primeiro oi ao seu anúncio <span className="highlight">no ar</span>.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
                Cada passo, quem faz o quê e quanto tempo leva. Começa com uma conversa no WhatsApp, sem compromisso.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={whatsapp} className={botaoMarca}>
                  Quero um diagnóstico grátis
                  <ArrowRightIcon />
                </a>
                <a href="#passos" className={botaoContorno}>
                  Ver os passos
                </a>
              </div>
            </div>
            <ConversaComecando />
          </div>
        </FundoVivo>
      </MotionScope>

      {/* Os 8 passos, na fila presa. */}
      <div id="passos" className="scroll-mt-0">
        <PassosNaRolagem
          passos={passos}
          titulo={
            <>
              Oito passos, <span className="text-muted-foreground">e você sabe sempre em qual está.</span>
            </>
          }
        />
      </div>

      {/* O que a gente vai te pedir, e o prazo com data quando chega tudo. */}
      <section id="o-que-pedimos" className="mx-auto max-w-6xl px-4 py-24">
        <Eyebrow>O que a gente vai te pedir</Eyebrow>
        <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
          Você manda tudo uma vez só. <span className="text-muted-foreground">O prazo começa quando chega.</span>
        </h2>
        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            {pedidos.map(({ servico, itens }, i) => (
              <Reveal key={servico} delay={i * 120} className="rounded-3xl border bg-card p-8">
                <p className="font-mono text-xs text-muted-foreground">{servico}</p>
                <ul className="mt-5 space-y-3">
                  {itens.map((item) => (
                    <li key={item} className="flex gap-3 leading-7">
                      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
                        <CheckIcon className="size-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <p className="leading-7 text-muted-foreground">
              Cada pedido vem com um guia passo a passo da Central de Ajuda. Com os dois serviços, primeiro vem só o
              da página, e o do Google Ads depois, sem pedir tudo de uma vez.
            </p>
          </div>
          <div>
            <PrazoNaConversa />
            <p className="mt-5 leading-7 text-muted-foreground">
              Quando chega tudo, você recebe o prazo com a data escrita. Se faltar alguma coisa, a gente te lembra.
            </p>
          </div>
        </div>
      </section>

      {/* O primeiro mês depois que a campanha entra no ar. */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Eyebrow>Depois que entra no ar</Eyebrow>
          <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
            A campanha nova é acompanhada de perto. <span className="text-muted-foreground">Desde o primeiro dia.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            A conta fica monitorada 24 horas e acompanhada por um especialista. Veja como é o primeiro mês do Google
            Ads.
          </p>
          <div className="mt-14">
            <PrimeiroMes />
          </div>
        </div>
      </section>

      {/* O que é com você e o que é com a Adsgator. */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Eyebrow>Quem faz o quê</Eyebrow>
        <h2 className={cn(titulo, "mt-6 max-w-3xl")}>
          A sua parte é pequena. <span className="text-muted-foreground">O resto fica com a gente.</span>
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Reveal className="h-full rounded-3xl border bg-card p-8">
            <p className="font-mono text-xs text-muted-foreground">Com você</p>
            <ul className="mt-6 space-y-4">
              {comVoce.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
                    <CheckIcon className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="dark section-ink h-full rounded-3xl border bg-background p-8 text-foreground">
            <p className="font-mono text-xs text-brand">Com a Adsgator</p>
            <ul className="mt-6 space-y-4">
              {comAdsgator.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
                    <CheckIcon className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Talvez você esteja pensando. */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Eyebrow>Talvez você esteja pensando</Eyebrow>
        <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
          As dúvidas mais comuns. <span className="text-muted-foreground">E as respostas.</span>
        </h2>
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {objecoes.map(({ duvida, resposta }, i) => (
            <li key={duvida}>
              <Reveal delay={(i % 2) * 120} className="h-full rounded-3xl border bg-card p-8">
                <p className="font-heading text-2xl leading-tight">{duvida}</p>
                <p className="mt-4 leading-7 text-muted-foreground">{resposta}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Perguntas e o convite. */}
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
            O primeiro passo
            <br />
            é só uma conversa.
          </>
        }
        mensagem={mensagemDaPagina("/como-funciona")}
      />
    </>
  );
}

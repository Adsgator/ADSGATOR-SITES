import type { Metadata } from "next";
import { ArrowRightIcon, CheckIcon } from "lucide-react";

import { ChamadaFinal } from "@/components/chamada-final";
import { EtapasNoAr } from "@/components/colunas-subindo";
import { ConversaComecando } from "@/components/conversa-comecando";
import { Eyebrow } from "@/components/eyebrow";
import { FundoVivo } from "@/components/fundo-vivo";
import { MotionScope } from "@/components/motion/motion-scope";
import { Reveal } from "@/components/motion/reveal";
import { PassosNaRolagem, type Passo } from "@/components/passos-na-rolagem";
import { buttonVariants } from "@/components/ui/button";
import { linkWhatsApp, mensagemDaPagina } from "@/config/site";
import { cn } from "@/lib/utils";

// Página "Como funciona", na ordem do roteiro do site (ADSGATOR-PAINEL,
// DOCS/ROTEIRO-SITE.md, "Como funciona"), aprovado pelo Lucas em 2026-11-20:
// tirar o medo do desconhecido, com cada passo, quem faz o quê e quanto tempo
// leva. Prazos da Base ("Serviços e preços").

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

      {/* O que é com você e o que é com a Adsgator. */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Eyebrow>Quem faz o quê</Eyebrow>
        <h2 className="mt-6 max-w-3xl font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
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

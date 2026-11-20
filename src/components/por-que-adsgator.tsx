"use client";

import { useRef } from "react";
import { CalendarCheckIcon, HandshakeIcon, KeyRoundIcon, MessagesSquareIcon, RulerIcon } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";
import { FundoVivo } from "@/components/fundo-vivo";
import { Reveal } from "@/components/motion/reveal";

// "Por que a Adsgator" (roteiro do site, Início, seção 7): o texto acende
// palavra por palavra com a rolagem, e os cinco pontos da posição (Base, "Voz
// e posição") entram embaixo. A revelação é por opacidade, igual nos dois
// modos de animação.

const frase =
  "Feito sob medida para o seu negócio, tudo no seu nome e sem fidelidade. Você fala direto com quem faz o trabalho e, todo mês, sabe exatamente o que chegou.";

const pontos = [
  { icone: KeyRoundIcon, titulo: "Tudo no seu nome", texto: "A conta, a página e o domínio são seus." },
  { icone: HandshakeIcon, titulo: "Sem fidelidade", texto: "Cancele quando quiser e volte quando quiser." },
  { icone: RulerIcon, titulo: "Sob medida", texto: "Nada de modelo pronto: feito para o seu negócio." },
  { icone: MessagesSquareIcon, titulo: "Direto com quem faz", texto: "Você fala com quem cuida da sua conta." },
  { icone: CalendarCheckIcon, titulo: "Resumo todo mês", texto: "O que chegou, explicado de um jeito claro." },
];

function Palavra({ progresso, faixa, children }: { progresso: MotionValue<number>; faixa: [number, number]; children: string }) {
  const opacidade = useTransform(progresso, faixa, [0.15, 1]);
  return <motion.span style={{ opacity: opacidade }}>{children} </motion.span>;
}

export function PorQueAdsgator() {
  const texto = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: texto, offset: ["start 0.85", "end 0.45"] });
  const palavras = frase.split(" ");

  return (
    <FundoVivo className="py-28">
      <div className="mx-auto max-w-5xl px-4">
        <Eyebrow>Por que a Adsgator</Eyebrow>
        <p ref={texto} className="mt-8 font-heading text-3xl leading-[1.2] tracking-tight sm:text-5xl">
          {palavras.map((palavra, i) => (
            <Palavra key={i} progresso={scrollYProgress} faixa={[i / palavras.length, (i + 1) / palavras.length]}>
              {palavra}
            </Palavra>
          ))}
        </p>
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pontos.map(({ icone: Icone, titulo, texto: descricao }, i) => (
            <Reveal key={titulo} delay={i * 90} className="rounded-3xl border bg-card/80 p-6 backdrop-blur">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-brand-foreground">
                <Icone className="size-5" />
              </span>
              <h3 className="mt-5 font-heading text-lg">{titulo}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{descricao}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </FundoVivo>
  );
}

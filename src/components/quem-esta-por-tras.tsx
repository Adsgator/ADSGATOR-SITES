import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { BumerangueFrame } from "@/components/bumerangue";
import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/motion/reveal";

// "Quem está por trás" no Início (roteiro do site, Início, seção 9), com a
// trajetória que o Lucas contou em 2026-11-20 numa linha do tempo, e a foto do
// perfil do WhatsApp Business por enquanto. A foto fica presa ao lado enquanto
// a história passa (pedido dele: mais trabalhado e ligado ao resto). A página
// completa vem na Parte 2.

const trajetoria = [
  { quando: "Aos 15 anos", titulo: "Ajudante de serralheiro", texto: "O primeiro trabalho: aprender fazendo, com as mãos." },
  { quando: "7 anos", titulo: "Mecânico de manutenção e torneiro", texto: "Na indústria, numa fábrica de implementos agrícolas e depois numa empresa de alimentos." },
  { quando: "2010", titulo: "O primeiro curso de web design", texto: "Na época em que os sites ainda eram feitos em Flash." },
  { quando: "2020", titulo: "Nasce a Adsgator", texto: "Google Ads e landing pages para negócios locais." },
  { quando: "Hoje", titulo: "Design, Google Ads e IA", texto: "Estudando todo dia para entregar mais, com o mesmo cuidado." },
];

export function QuemEstaPorTras() {
  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-4 py-28 md:grid-cols-[0.85fr_1.15fr]">
      <div className="md:sticky md:top-28 md:self-start">
        <Reveal>
          <BumerangueFrame className="mx-auto w-full max-w-sm">
            <div className="relative aspect-square overflow-hidden rounded-3xl">
              <Image
                src="/sobre/lucas.jpg"
                alt="Lucas, da Adsgator"
                fill
                sizes="(min-width: 768px) 24rem, 90vw"
                className="object-cover"
              />
            </div>
          </BumerangueFrame>
        </Reveal>
      </div>
      <div>
        <Reveal>
          <Eyebrow>Quem está por trás</Eyebrow>
          <h2 className="mt-6 font-heading text-4xl leading-[1.05] tracking-tight sm:text-5xl">Oi, eu sou o Lucas.</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Na Adsgator, você fala direto comigo, que cuido da sua conta e da sua
            página. Faço isso porque gosto de criar coisas digitais que funcionam
            de verdade para quem trabalha. Este é o caminho até aqui:
          </p>
        </Reveal>
        <ol className="relative mt-12 space-y-10 border-l border-foreground/10 pl-8">
          {trajetoria.map(({ quando, titulo, texto }, i) => (
            <li key={titulo} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[2.4rem] size-3.5 rounded-full border-2 border-brand bg-background shadow-[0_0_0_5px_color-mix(in_oklab,var(--brand)_18%,transparent)]"
              />
              <Reveal delay={i * 60}>
                <p className="font-mono text-xs text-brand">{quando}</p>
                <h3 className="mt-1.5 font-heading text-2xl">{titulo}</h3>
                <p className="mt-1.5 leading-7 text-muted-foreground">{texto}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal>
          <Link
            href="/quem-esta-por-tras"
            className="mt-12 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline"
          >
            Conheça a minha história
            <ArrowRightIcon className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

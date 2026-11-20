import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { BumerangueFrame } from "@/components/bumerangue";
import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/motion/reveal";

// Prévia de "Quem está por trás" no Início (roteiro do site, Início, seção 9),
// com a foto do perfil do WhatsApp Business por enquanto (Lucas, 2026-11-20) e
// a história que ele contou no mesmo dia. A página completa vem na Parte 2.
export function QuemEstaPorTras() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-28 md:grid-cols-[0.9fr_1.1fr]">
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
      <Reveal delay={120}>
        <Eyebrow>Quem está por trás</Eyebrow>
        <h2 className="mt-6 font-heading text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          Oi, eu sou o Lucas.
        </h2>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Comecei a trabalhar aos 15 anos, como ajudante de serralheiro, e passei
          7 anos na indústria. Nunca parei de estudar tecnologia: faço sites desde
          2010 e Google Ads desde 2020.
        </p>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Na Adsgator, você fala direto comigo, que cuido da sua conta e da sua
          página. Faço isso porque gosto de criar coisas digitais que funcionam de
          verdade para quem trabalha.
        </p>
        <Link
          href="/quem-esta-por-tras"
          className="mt-8 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline"
        >
          Conheça a minha história
          <ArrowRightIcon className="size-4" />
        </Link>
      </Reveal>
    </section>
  );
}

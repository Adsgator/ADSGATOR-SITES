import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { BumerangueFrame } from "@/components/bumerangue";
import { Eyebrow } from "@/components/eyebrow";
import { ListaQueSeMarca } from "@/components/lista-que-se-marca";
import { Reveal } from "@/components/motion/reveal";
import { trajetoria, trajetoriaHoje } from "@/config/trajetoria";

// "Quem está por trás" no Início (roteiro do site, Início, seção 9): a foto
// presa ao lado enquanto a trajetória se marca com a rolagem (a mesma da
// página, em config/trajetoria.ts), e o link para a página completa.

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
          <h2 className="mt-6 font-heading text-4xl leading-[1.05] tracking-tight sm:text-5xl">Eu sou o Lucas.</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Na Adsgator, você fala direto comigo, que cuido da sua conta e da sua página. Faço isso porque gosto de
            criar coisas digitais que funcionam de verdade para quem trabalha. Este é o caminho até aqui:
          </p>
        </Reveal>
        <div className="mt-12">
          <ListaQueSeMarca itens={trajetoria} final={trajetoriaHoje} />
        </div>
        <Link
          href="/quem-esta-por-tras"
          className="mt-12 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline"
        >
          Conheça a minha história
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </section>
  );
}

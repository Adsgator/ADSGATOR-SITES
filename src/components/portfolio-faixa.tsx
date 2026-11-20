"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";

// O portfólio no Início (roteiro do site, Início, seção 8): páginas feitas
// pela Adsgator, que já estão no ar, numa fila que anda de lado com a rolagem
// e sai pela lateral da tela. As quatro escolhidas em 2026-11-20 (o Lucas
// aprovou; o portfólio todo está autorizado pelos clientes, segundo ele). As
// fotos foram tiradas das páginas no ar em 2026-11-20 (`public/portfolio/`).

const paginas = [
  { id: "adestradora", segmento: "Adestramento canino", site: "juliamartinsadestradora.com.br" },
  { id: "creche", segmento: "Creche e hospedagem canina", site: "natuespacocanino.com.br" },
  { id: "escritorios", segmento: "Escritório virtual e endereço fiscal", site: "wesharescritorios.com.br" },
  { id: "planejados", segmento: "Móveis planejados", site: "oficinadosplanejadosofc.com.br" },
];

export function PortfolioFaixa() {
  const area = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: area, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-38%"]);

  return (
    <section ref={area} className="overflow-x-clip py-28">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-4">
        <div>
          <Eyebrow>Portfólio</Eyebrow>
          <h2 className="mt-6 font-heading text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            Páginas que já estão no ar.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
            Cada uma feita para o negócio do cliente, com o visual dele e o WhatsApp a um toque.
          </p>
        </div>
        <Link href="/portfolio" className="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
          Ver o portfólio
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      <motion.ul style={{ x }} className="mt-16 flex w-max gap-8 px-4">
        {paginas.map(({ id, segmento, site }) => (
          <li key={id} className="w-[85vw] max-w-[36rem]">
            <div className="relative pb-8">
              <div className="overflow-hidden rounded-2xl border bg-card shadow-[0_30px_60px_-35px_rgb(31_39_27/0.6)]">
                <div className="flex items-center gap-1.5 border-b px-4 py-2.5">
                  <span className="size-2.5 rounded-full bg-muted" />
                  <span className="size-2.5 rounded-full bg-muted" />
                  <span className="size-2.5 rounded-full bg-muted" />
                  <span className="ml-3 truncate font-mono text-xs text-muted-foreground">{site}</span>
                </div>
                <Image
                  src={`/portfolio/${id}-pc.jpg`}
                  alt={`Página de ${segmento.toLowerCase()} feita pela Adsgator`}
                  width={1280}
                  height={800}
                  sizes="(min-width: 640px) 36rem, 85vw"
                  className="block h-auto w-full"
                />
              </div>
              <div className="absolute right-4 bottom-0 w-[22%] min-w-20 overflow-hidden rounded-[1.1rem] border-4 border-ink bg-ink shadow-xl">
                <Image
                  src={`/portfolio/${id}-cel.jpg`}
                  alt=""
                  width={390}
                  height={844}
                  sizes="8rem"
                  className="block h-auto w-full rounded-[0.8rem]"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="font-heading text-xl">{segmento}</p>
              <a
                href={`https://${site}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
              >
                Ver a página
                <ArrowUpRightIcon className="size-4" />
              </a>
            </div>
          </li>
        ))}
      </motion.ul>
    </section>
  );
}

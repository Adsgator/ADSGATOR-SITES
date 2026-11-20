"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";

// O portfólio no Início (roteiro do site, Início, seção 8): páginas feitas
// pela Adsgator, que já estão no ar. As quatro escolhidas em 2026-11-20 (o
// Lucas aprovou; o portfólio todo está autorizado pelos clientes, segundo ele).
// Fotos tiradas das páginas no ar em 2026-11-20 (`public/portfolio/`): a
// primeira tela (`-pc`, `-cel`) e a página inteira (`-inteira`, 960 px de
// largura, pelo `scripts/fotos-portfolio.mjs`, que mostra a altura de cada uma).

const paginas = [
  { id: "adestradora", segmento: "Adestramento canino", site: "juliamartinsadestradora.com.br", alturaInteira: 10980 },
  { id: "creche", segmento: "Creche e hospedagem canina", site: "natuespacocanino.com.br", alturaInteira: 8293 },
  { id: "escritorios", segmento: "Escritório virtual e endereço fiscal", site: "wesharescritorios.com.br", alturaInteira: 8660 },
  { id: "planejados", segmento: "Móveis planejados", site: "oficinadosplanejadosofc.com.br", alturaInteira: 3980 },
];

// Parte da rolagem parada no começo e no fim, com a primeira e a última página
// inteiras no lugar.
const PAUSA = 0.1;

/**
 * A seção fica presa no topo enquanto a rolagem leva a fila de lado (pedido
 * do Lucas, 2026-11-20). A distância é medida: a fila começa com a primeira
 * página alinhada ao título e termina com a última inteira na borda direita.
 */
export function PortfolioFaixa() {
  const area = useRef<HTMLElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const fila = useRef<HTMLUListElement>(null);
  const distancia = useMotionValue(0);
  const [alturaExtra, setAlturaExtra] = useState(0);

  useEffect(() => {
    const medir = () => {
      if (!fila.current || !palco.current) return;
      const d = Math.max(0, fila.current.scrollWidth - palco.current.clientWidth);
      distancia.set(d);
      setAlturaExtra(Math.round(d / (1 - 2 * PAUSA)));
    };
    medir();
    const observador = new ResizeObserver(medir);
    if (fila.current) observador.observe(fila.current);
    if (palco.current) observador.observe(palco.current);
    return () => observador.disconnect();
  }, [distancia]);

  const { scrollYProgress } = useScroll({ target: area, offset: ["start start", "end end"] });
  const andado = useTransform(scrollYProgress, [PAUSA, 1 - PAUSA], [0, 1], { clamp: true });
  const x = useTransform(() => -andado.get() * distancia.get());

  return (
    <section ref={area} data-portfolio style={{ height: `calc(100svh + ${alturaExtra}px)` }} className="relative">
      <div ref={palco} className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-16">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-x-6 gap-y-3 px-4">
          <div>
            <Eyebrow>Portfólio</Eyebrow>
            <h2 className="mt-5 font-heading text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              Páginas que já estão no ar.
            </h2>
            <p className="mt-3 max-w-xl text-lg leading-8 text-muted-foreground">
              Cada uma feita para o negócio do cliente. Passe o mouse para ver a página inteira.
            </p>
          </div>
          <Link href="/portfolio" className="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
            Ver o portfólio
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <motion.ul
          ref={fila}
          style={{ x }}
          className="mt-10 flex w-max gap-8 px-[max(1rem,calc((100%-72rem)/2+1rem))]"
        >
          {paginas.map((pagina) => (
            <Cartao key={pagina.id} {...pagina} />
          ))}
        </motion.ul>

        <div aria-hidden="true" className="mx-auto mt-8 h-0.5 w-full max-w-6xl px-4">
          <div className="h-full rounded-full bg-border">
            <motion.div style={{ scaleX: andado }} className="h-full origin-left rounded-full bg-brand" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Uma página do portfólio. Ao passar o mouse (ou focar o link), a foto da
 * página inteira carrega e rola dentro da janela até o fim; ao sair, volta. */
function Cartao({ id, segmento, site, alturaInteira }: (typeof paginas)[number]) {
  const [pediu, setPediu] = useState(false);
  const [carregou, setCarregou] = useState(false);
  const [dentro, setDentro] = useState(false);
  const entrar = () => {
    setPediu(true);
    setDentro(true);
  };
  const sair = () => setDentro(false);
  const rolando = dentro && carregou;
  // Mais longa a página, mais tempo para rolar (a janela mostra 0,625 da largura).
  const segundos = Math.max(3, (alturaInteira / 960 - 0.625) * 0.95);

  return (
    <li
      data-cartao={id}
      onPointerEnter={entrar}
      onPointerLeave={sair}
      onFocus={entrar}
      onBlur={sair}
      className="w-[min(85vw,34rem,calc((100svh-28rem)*1.6))] min-w-64"
    >
      <div className="relative pb-8">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-[0_30px_60px_-35px_rgb(31_39_27/0.6)]">
          <div className="flex items-center gap-1.5 border-b px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-muted" />
            <span className="size-2.5 rounded-full bg-muted" />
            <span className="size-2.5 rounded-full bg-muted" />
            <span className="ml-3 truncate font-mono text-xs text-muted-foreground">{site}</span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden [container-type:size]">
            <Image
              src={`/portfolio/${id}-pc.jpg`}
              alt={`Página de ${segmento.toLowerCase()} feita pela Adsgator`}
              fill
              sizes="(min-width: 640px) 34rem, 85vw"
              className="object-cover object-top"
            />
            {pediu && (
              <Image
                src={`/portfolio/${id}-inteira.jpg`}
                alt=""
                width={960}
                height={alturaInteira}
                sizes="(min-width: 640px) 34rem, 85vw"
                onLoad={() => setCarregou(true)}
                data-inteira={rolando ? "rolando" : ""}
                style={{
                  transform: rolando ? "translateY(calc(-100% + 100cqh))" : "translateY(0)",
                  transition: rolando ? `transform ${segundos}s ease-in-out` : "transform 0.8s var(--ease-out)",
                }}
                className="absolute inset-x-0 top-0 h-auto w-full"
              />
            )}
          </div>
        </div>
        <div className="absolute right-4 bottom-0 w-[22%] min-w-16 overflow-hidden rounded-[1.1rem] border-4 border-ink bg-ink shadow-xl">
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
  );
}

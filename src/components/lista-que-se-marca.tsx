"use client";

import { useRef, useState } from "react";
import { CheckIcon } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, type MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Lista que se marca com a rolagem: a linha amarela desce e cada item fica
 * feito quando ela chega nele, até o último, em destaque (página de Google
 * Ads, "O que fazemos para começar"; serve às outras páginas). Os itens têm
 * alturas parecidas, então a posição de cada um na linha é a fração dele na
 * lista.
 */
export function ListaQueSeMarca({
  itens,
  final,
}: {
  itens: { titulo: string; texto: string }[];
  final: { titulo: string; texto: string };
}) {
  const lista = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: lista, offset: ["start 0.7", "end 0.55"] });
  const feitos = useFeitos(scrollYProgress, itens.length + 1);

  return (
    <ol ref={lista} className="relative space-y-10 pl-16">
      <span aria-hidden="true" className="absolute top-5 bottom-5 left-[1.1875rem] w-0.5 rounded-full bg-border">
        <motion.span style={{ scaleY: scrollYProgress }} className="block h-full origin-top rounded-full bg-brand" />
      </span>
      {itens.map((item, i) => (
        <Item key={item.titulo} numero={i + 1} feito={i < feitos} {...item} />
      ))}
      <Item numero={itens.length + 1} feito={feitos > itens.length} destaque {...final} />
    </ol>
  );
}

/** Quantos dos `total` pontos a rolagem já alcançou (o primeiro no começo, o
 * último no fim). */
export function useFeitos(progresso: MotionValue<number>, total: number) {
  const calcular = (p: number) =>
    p <= 0 ? 0 : Array.from({ length: total }, (_, i) => i / (total - 1)).filter((ponto) => p >= ponto - 0.02).length;
  const [feitos, setFeitos] = useState(0);
  useMotionValueEvent(progresso, "change", (p) => setFeitos(calcular(p)));
  return feitos;
}

function Item({
  numero,
  titulo,
  texto,
  feito,
  destaque = false,
}: {
  numero: number;
  titulo: string;
  texto: string;
  feito: boolean;
  destaque?: boolean;
}) {
  return (
    <li data-feito={feito ? "" : undefined} className="relative">
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0 -left-16 flex size-10 items-center justify-center rounded-full border font-mono text-sm transition-all duration-500 ease-(--ease-out)",
          feito ? "scale-110 border-brand bg-brand text-brand-foreground" : "bg-card text-muted-foreground",
        )}
      >
        {feito ? <CheckIcon className="size-5" /> : numero}
      </span>
      <div className={cn("transition-opacity duration-500", feito ? "opacity-100" : "opacity-45")}>
        <h3 className={cn("font-heading leading-tight", destaque ? "text-3xl sm:text-4xl" : "text-2xl")}>
          {destaque && (
            <span
              aria-hidden="true"
              className={cn("mr-3 inline-block size-3 rounded-full align-middle", feito ? "animate-pulse bg-success" : "bg-border")}
            />
          )}
          {titulo}
        </h3>
        <p className="mt-2 max-w-md leading-7 text-muted-foreground">{texto}</p>
      </div>
    </li>
  );
}

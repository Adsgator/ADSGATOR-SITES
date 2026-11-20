"use client";

import { useRef } from "react";
import { SearchIcon } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";
import { FundoVivo } from "@/components/fundo-vivo";

// "Você já é procurado" (roteiro do site, Início, seção 3): fileiras de buscas
// que entram e saem pela lateral, cada uma num sentido, indo e voltando com a
// rolagem, como os cartões do Zouti. Serviços genéricos, sem cliente.

const buscas = [
  "dentista perto de mim",
  "eletricista em campinas",
  "advogado trabalhista",
  "conserto de ar-condicionado",
  "nutricionista em valinhos",
  "fisioterapia em sumaré",
  "pet shop aberto agora",
  "contador para mei",
  "escola de inglês em hortolândia",
  "chaveiro 24 horas",
  "clínica de estética",
  "auto elétrica perto de mim",
  "psicólogo online",
  "buffet infantil em campinas",
  "móveis planejados",
];

function Fileira({ itens, x }: { itens: string[]; x: MotionValue<string> }) {
  return (
    <motion.ul style={{ x }} className="flex w-max gap-4 motion-reduce:transform-none!">
      {[...itens, ...itens].map((busca, i) => (
        <li
          key={`${busca}-${i}`}
          className="flex items-center gap-3 rounded-full border bg-card/80 px-5 py-3.5 text-lg whitespace-nowrap shadow-[0_12px_30px_-20px_rgb(31_39_27/0.5)] backdrop-blur"
        >
          <SearchIcon className="size-4 text-muted-foreground" />
          {busca}
          <span className="font-mono text-xs text-brand">agora</span>
        </li>
      ))}
    </motion.ul>
  );
}

export function BuscasCidade() {
  const area = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: area, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-40%", "-5%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["-10%", "-45%"]);

  return (
    <FundoVivo ref={area} className="overflow-x-clip py-28">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <Eyebrow className="justify-center">Você já é procurado</Eyebrow>
        <h2 className="mt-6 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
          Agora mesmo, alguém na sua cidade está digitando o seu serviço no Google.
        </h2>
      </div>
      <div aria-hidden="true" className="mt-16 space-y-4">
        <Fileira itens={buscas.slice(0, 5)} x={x1} />
        <Fileira itens={buscas.slice(5, 10)} x={x2} />
        <Fileira itens={buscas.slice(10)} x={x3} />
      </div>
      <p className="mx-auto mt-14 max-w-xl px-4 text-center text-lg leading-8 text-muted-foreground">
        Se ele não encontra você, encontra o concorrente. A Adsgator faz o seu
        negócio aparecer nessa hora.
      </p>
    </FundoVivo>
  );
}

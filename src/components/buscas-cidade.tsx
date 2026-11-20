"use client";

import { SearchIcon } from "lucide-react";
import { motion } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";
import { FundoVivo } from "@/components/fundo-vivo";
import { MotionPauseButton, MotionScope } from "@/components/motion/motion-scope";
import { useDigitacao } from "@/components/motion/use-digitacao";
import { cn } from "@/lib/utils";

// "Você já é procurado" (roteiro do site, Início, seção 3): buscas sendo
// digitadas em pontos diferentes da área, que ficam um instante com o selo
// "agora", somem e dão lugar a outras, cada uma no seu ritmo, como pesquisas
// acontecendo na cidade (pedido do Lucas, 2026-11-20). Serviços genéricos.
// Para no botão de pausar.

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
  "encanador urgente",
];

// Onde cada busca aparece. As da direita se prendem pela direita, para não
// passarem da tela no celular; as últimas só aparecem em telas maiores.
const lugares = [
  { estilo: { left: "4%", top: "4%" }, classe: "" },
  { estilo: { right: "4%", top: "14%" }, classe: "" },
  { estilo: { left: "16%", top: "40%" }, classe: "" },
  { estilo: { right: "10%", top: "56%" }, classe: "" },
  { estilo: { left: "6%", top: "78%" }, classe: "hidden sm:flex" },
  { estilo: { right: "26%", top: "84%" }, classe: "hidden md:flex" },
];

function Busca({ n }: { n: number }) {
  const { texto, pronto, visivel } = useDigitacao(buscas, {
    inicio: n * 650,
    deslocamento: n * 3,
    passo: lugares.length - 1,
    velocidade: 45,
    espera: 1600 + (n % 3) * 500,
    intervalo: 500 + (n % 2) * 700,
  });
  return (
    <motion.div
      animate={{ opacity: visivel ? 1 : 0, scale: visivel ? 1 : 0.94 }}
      transition={{ duration: 0.35 }}
      style={lugares[n].estilo}
      className={cn(
        "absolute flex max-w-[88%] items-center gap-3 rounded-full border bg-card/85 px-5 py-3.5 text-base shadow-[0_16px_36px_-22px_rgb(31_39_27/0.55)] backdrop-blur sm:text-lg",
        lugares[n].classe,
      )}
    >
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{texto}</span>
      <span className={cn("-ml-2 h-5 w-px shrink-0 bg-foreground", pronto ? "opacity-0" : "animate-pulse")} />
      <motion.span
        animate={{ opacity: pronto ? 1 : 0, x: pronto ? 0 : -6 }}
        className="shrink-0 font-mono text-xs text-brand"
      >
        agora
      </motion.span>
    </motion.div>
  );
}

export function BuscasCidade() {
  return (
    <MotionScope>
      <FundoVivo className="py-28">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Eyebrow className="justify-center">Você já é procurado</Eyebrow>
          <h2 className="mt-6 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
            Agora mesmo, alguém na sua cidade está digitando o seu serviço no Google.
          </h2>
        </div>
        <div aria-hidden="true" className="relative mx-auto mt-12 h-[22rem] max-w-6xl sm:h-[24rem]">
          {lugares.map((_, n) => (
            <Busca key={n} n={n} />
          ))}
        </div>
        <div className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-4 px-4">
          <p className="text-center text-lg leading-8 text-muted-foreground">
            Se ele não encontra você, encontra o concorrente. A Adsgator faz o seu
            negócio aparecer nessa hora.
          </p>
          <MotionPauseButton className="shrink-0" />
        </div>
      </FundoVivo>
    </MotionScope>
  );
}

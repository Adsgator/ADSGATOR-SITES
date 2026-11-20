"use client";

import { useRef, useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";

import { Eyebrow } from "@/components/eyebrow";
import { cn } from "@/lib/utils";

// "O que acontece hoje" (roteiro do site, Início, seção 4): três cartões que
// viram, em 3D, de "hoje" para "com a Adsgator" conforme a rolagem, um depois
// do outro. Gira também com "reduzir animações" (Lucas, 2026-11-20).

const cartoes = [
  {
    hoje: { titulo: "Você não aparece.", texto: "Quem procura o seu serviço encontra o concorrente primeiro." },
    depois: { titulo: "Você aparece no topo.", texto: "Para quem está procurando agora, perto de você." },
  },
  {
    hoje: { titulo: "A página não convence.", texto: "A pessoa chega, não entende o que você faz e vai embora." },
    depois: { titulo: "Uma página que vira conversa.", texto: "Clara, rápida no celular, com o WhatsApp a um toque." },
  },
  {
    hoje: { titulo: "O contato se perde.", texto: "Você não sabe de onde veio nem se o anúncio valeu a pena." },
    depois: { titulo: "Você sabe o que chegou.", texto: "Cada toque no WhatsApp é medido, e todo mês vem o resumo." },
  },
];

export function HojeComAdsgator() {
  const area = useRef<HTMLDivElement>(null);
  const [virados, setVirados] = useState(0);
  const { scrollYProgress } = useScroll({ target: area, offset: ["start 0.8", "end 0.5"] });
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setVirados(cartoes.filter((_, i) => p > 0.25 + i * 0.22).length),
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-28">
      <Eyebrow>O que acontece hoje</Eyebrow>
      <h2 className="mt-6 max-w-3xl font-heading text-4xl leading-[1.05] tracking-tight sm:text-6xl">
        Se ele não encontra você,
        <br />
        <span className="text-muted-foreground">encontra o concorrente.</span>
      </h2>
      <div ref={area} className="mt-16 grid grid-cols-1 gap-5 perspective-distant md:grid-cols-3">
        {cartoes.map(({ hoje, depois }, i) => {
          const virado = i < virados;
          return (
            <div
              key={hoje.titulo}
              data-virado={virado ? "" : undefined}
              className={cn(
                "relative h-64 transition-transform duration-700 ease-(--ease-out) transform-3d",
                virado && "rotate-y-180",
              )}
            >
              <Face lado="hoje" visivel={!virado} {...hoje} />
              <Face lado="depois" visivel={virado} {...depois} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Face({
  lado,
  visivel,
  titulo,
  texto,
}: {
  lado: "hoje" | "depois";
  visivel: boolean;
  titulo: string;
  texto: string;
}) {
  const depois = lado === "depois";
  return (
    <div
      aria-hidden={!visivel}
      className={cn(
        "absolute inset-0 flex flex-col justify-between rounded-3xl border p-7 backface-hidden",
        depois ? "dark section-ink rotate-y-180 bg-background text-foreground" : "bg-card",
      )}
    >
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          depois ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {depois ? <CheckIcon className="size-5" /> : <XIcon className="size-5" />}
      </span>
      <div>
        <p className="font-mono text-xs text-muted-foreground">{depois ? "Com a Adsgator" : "Hoje"}</p>
        <h3 className="mt-2 font-heading text-2xl leading-tight">{titulo}</h3>
        <p className="mt-2 leading-7 text-muted-foreground">{texto}</p>
      </div>
    </div>
  );
}

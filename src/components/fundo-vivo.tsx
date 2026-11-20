"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

// Fundo vivo das seções (pedido do Lucas, 2026-11-20, a partir do Zouti):
// manchas de luz da marca, desfocadas, passeando devagar atrás do conteúdo,
// no lugar do fundo sólido. Decorativo. Com "reduzir animações", o CSS anula o
// passeio e as manchas ficam paradas.

const manchas = [
  { classe: "top-[10%] -left-[10%] size-[32rem] bg-brand/20", x: [0, 120, 0], y: [0, 60, 0], duracao: 26 },
  { classe: "top-[40%] -right-[12%] size-[28rem] bg-brand/15", x: [0, -100, 0], y: [0, -80, 0], duracao: 31 },
  { classe: "-bottom-[15%] left-[30%] size-[24rem] bg-brand/10", x: [0, 80, 0], y: [0, -50, 0], duracao: 37 },
];

export function FundoVivo({ className, children, ...resto }: React.ComponentProps<"section">) {
  return (
    <section className={cn("relative isolate", className)} {...resto}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(transparent,#000_18%,#000_82%,transparent)]">
        {manchas.map(({ classe, x, y, duracao }) => (
          <motion.span
            key={classe}
            animate={{ x, y }}
            transition={{ duration: duracao, repeat: Infinity, ease: "easeInOut" }}
            className={cn("absolute rounded-full blur-3xl motion-reduce:transform-none!", classe)}
          />
        ))}
      </div>
      {children}
    </section>
  );
}

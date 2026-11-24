"use client";

import { motion } from "motion/react";

import { BumerangueFrame } from "@/components/bumerangue";

// O que já se sabe, para a pessoa confirmar: um retângulo amarelo bem leve que abre
// entre os cantos da marca, como um holograma (ideia do Lucas, 2026-11-24). Não parece
// um cartão de tocar, que confundia com as opções.

const curva = [0.22, 1, 0.36, 1] as const;

export function ValorConhecido({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pt-3 pb-8 sm:px-5" data-valor-conhecido>
      <motion.div
        initial={{ opacity: 0, scaleX: 0.55 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.5, ease: curva, delay: 0.15 }}
        className="w-fit max-w-full"
      >
        <BumerangueFrame cantoClassName="size-5 sm:size-6">
          <div className="relative px-4 py-2 sm:px-5 sm:py-3">
            <motion.span
              aria-hidden="true"
              initial={{ clipPath: "inset(50% 0% 50% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 0.55, ease: curva, delay: 0.45 }}
              className="holograma absolute -inset-3 overflow-hidden sm:-inset-4"
            >
              {/* A luz que passa uma vez, de cima a baixo. */}
              <motion.span
                initial={{ top: "-40%", opacity: 0 }}
                animate={{ top: "110%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.75 }}
                className="absolute inset-x-0 h-2/5 bg-linear-to-b from-transparent via-brand/35 to-transparent"
              />
            </motion.span>
            <motion.p
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="relative font-heading text-2xl leading-snug lining-nums [overflow-wrap:anywhere] text-balance sm:text-3xl"
            >
              {children}
            </motion.p>
          </div>
        </BumerangueFrame>
      </motion.div>
    </div>
  );
}

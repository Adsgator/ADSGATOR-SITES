"use client";

import { useEffect, useState } from "react";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

import { MotionPauseButton, useMotionPaused } from "@/components/motion/motion-scope";
import { segmentos } from "@/config/segmentos";
import { cn } from "@/lib/utils";

// Topo da página de manutenção (roteiro do site, Manutenção, seção 1): o
// painel de situação da página do cliente, com "No ar" e a conferência do dia
// passando item por item; pronta, fica um tempo e passa ao próximo cliente
// fictício. Sem números. Tamanho fixo: a conferência não mexe no resto da
// página. Inclinado, fica de frente com a rolagem; vale também com "reduzir
// animações" (decisão do Lucas, 2026-11-20). Precisa estar dentro de um
// MotionScope (botão de pausar).

const conferencia = [
  "A página abre",
  "Cadeado de segurança válido",
  "Botão do WhatsApp funcionando",
  "Medição dos contatos ativa",
  "Domínio em dia",
  "Cópia de segurança feita",
];

export function PainelSituacao() {
  const pausado = useMotionPaused();
  const [{ indice, conferidos }, setEstado] = useState({ indice: 0, conferidos: 0 });
  const s = segmentos[indice];
  const pronta = conferidos === conferencia.length;

  const { scrollY } = useScroll();
  const giroY = useTransform(scrollY, [0, 420], [-16, 0]);
  const giroX = useTransform(scrollY, [0, 420], [8, 0]);

  // Um item a cada 0,9 s; pronta, fica 3,5 s e passa ao próximo cliente.
  useEffect(() => {
    if (pausado) return;
    const id = setTimeout(
      () => setEstado(pronta ? { indice: (indice + 1) % segmentos.length, conferidos: 0 } : { indice, conferidos: conferidos + 1 }),
      pronta ? 3500 : 900,
    );
    return () => clearTimeout(id);
  }, [indice, conferidos, pronta, pausado]);

  return (
    <div className="relative [perspective:1400px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-1/4 h-64 rounded-full bg-success/25 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        data-situacao
        style={{ rotateY: giroY, rotateX: giroX }}
        className="relative rounded-3xl border bg-card p-6 shadow-2xl shadow-ink/15 sm:p-7"
      >
        <div className="flex items-center gap-3">
          <span
            style={{ background: s.fundo, color: s.destaque }}
            className="flex size-10 shrink-0 items-center justify-center rounded-full"
          >
            <s.icone className="size-4.5" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-medium">{s.nome}</p>
            <p data-site className="truncate font-mono text-xs text-muted-foreground">
              {s.site}
            </p>
          </div>
          <span className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-sm font-medium">
            <span className="relative flex size-2.5">
              {/* A classe do Tailwind vence a regra de pausa do CSS: some ao pausar. */}
              {!pausado && <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />}
              <span className="relative size-2.5 rounded-full bg-success" />
            </span>
            No ar
          </span>
        </div>

        {/* Os últimos 30 dias, todos no ar: só a forma, sem número. */}
        <div className="mt-6">
          <p className="font-mono text-xs text-muted-foreground">Últimos 30 dias</p>
          <div className="mt-2 flex h-7 gap-[3px]">
            {Array.from({ length: 30 }, (_, i) => (
              <span key={i} className="flex-1 rounded-sm bg-success/70" />
            ))}
          </div>
        </div>

        <div className="mt-6 border-t pt-5">
          <p className="font-mono text-xs text-muted-foreground">Conferência de hoje</p>
          <ul className="mt-3 space-y-2.5 text-sm">
            {conferencia.map((item, i) => {
              const feito = i < conferidos;
              const conferindo = i === conferidos && !pausado;
              return (
                <li key={item} data-conferido={feito ? "" : undefined} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                      feito ? "border-success bg-success text-white" : "text-muted-foreground",
                    )}
                  >
                    {feito ? (
                      <CheckIcon className="size-3" />
                    ) : conferindo ? (
                      <LoaderCircleIcon className="size-3 animate-spin" />
                    ) : null}
                  </span>
                  <span className={cn("transition-colors duration-300", !feito && "text-muted-foreground")}>{item}</span>
                </li>
              );
            })}
          </ul>
          <p
            className={cn(
              "mt-5 rounded-xl bg-success/10 px-4 py-2.5 text-sm transition-opacity duration-500",
              pronta ? "opacity-100" : "opacity-0",
            )}
          >
            Tudo certo. A próxima conferência é amanhã.
          </p>
        </div>
      </motion.div>
      <MotionPauseButton className="absolute -bottom-4 right-4" />
    </div>
  );
}

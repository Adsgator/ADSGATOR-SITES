"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { BrandMark } from "@/components/brand";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { MotionPauseButton, useMotionPaused } from "@/components/motion/motion-scope";
import { cn } from "@/lib/utils";

// Topo de "Como funciona": o primeiro passo, a conversa no WhatsApp começando.
// As mensagens aparecem uma por vez, com o "digitando" antes; no fim, fica um
// tempo e recomeça. Ilustrativa: mostra que começar é só uma conversa, sem
// falar de verba (ela só aparece quando o cliente pergunta, Base, "Como
// conversar"). Tamanho fixo: não mexe no resto da página. Precisa estar dentro
// de um MotionScope (botão de pausar).

const mensagens = [
  { de: "cliente", texto: "Oi! Vim pelo site da Adsgator e queria um diagnóstico grátis." },
  { de: "adsgator", texto: "Oi! Que bom que você chamou. Me conta: qual é o seu serviço e em que cidade você atende?" },
  { de: "cliente", texto: "Sou eletricista, aqui em Campinas." },
  { de: "adsgator", texto: "Ótimo. Vou olhar quantas pessoas procuram eletricista na sua região e já te mostro o que dá para fazer." },
] as const;

export function ConversaComecando() {
  const pausado = useMotionPaused();
  // Quantas mensagens já apareceram; `digitando` é a espera antes da próxima.
  const [{ vistas, digitando }, setEstado] = useState({ vistas: 0, digitando: false });
  const { scrollY } = useScroll();
  const giroY = useTransform(scrollY, [0, 420], [-16, 0]);
  const giroX = useTransform(scrollY, [0, 420], [8, 0]);

  useEffect(() => {
    if (pausado) return;
    const fim = vistas === mensagens.length;
    const id = setTimeout(
      () =>
        setEstado(
          fim ? { vistas: 0, digitando: false } : digitando ? { vistas: vistas + 1, digitando: false } : { vistas, digitando: true },
        ),
      fim ? 4000 : digitando ? 1400 : vistas === 0 ? 700 : 900,
    );
    return () => clearTimeout(id);
  }, [vistas, digitando, pausado]);

  const proxima = mensagens[vistas];

  return (
    <div className="relative [perspective:1400px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-1/4 h-64 rounded-full bg-brand/35 blur-3xl" />
      <motion.div
        aria-hidden="true"
        data-conversa
        style={{ rotateY: giroY, rotateX: giroX }}
        className="relative overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-ink/15"
      >
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <BrandMark className="size-9 rounded-full" />
          <div className="leading-tight">
            <p className="font-medium">Adsgator</p>
            <p className="text-xs text-muted-foreground">{digitando && proxima?.de === "adsgator" ? "digitando…" : "online"}</p>
          </div>
          <span className="ml-auto flex size-8 items-center justify-center rounded-full bg-success text-white">
            <IconeWhatsApp className="size-4" />
          </span>
        </div>
        <div className="flex h-[23rem] flex-col gap-3 bg-muted/40 p-5 text-sm">
          {mensagens.slice(0, vistas).map((m, i) => (
            <motion.p
              key={i}
              data-mensagem
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 leading-6",
                m.de === "cliente" ? "ml-auto rounded-tr-sm bg-success/15" : "rounded-tl-sm border bg-background",
              )}
            >
              {m.texto}
            </motion.p>
          ))}
          {digitando && proxima && (
            <span
              className={cn(
                "flex w-16 items-center justify-center gap-1 rounded-2xl px-3 py-3",
                proxima.de === "cliente" ? "ml-auto bg-success/15" : "border bg-background",
              )}
            >
              {[0, 1, 2].map((i) => (
                // A classe do Tailwind vence a regra de pausa do CSS: só pula sem pausa.
                <span
                  key={i}
                  style={{ animationDelay: `${i * 150}ms` }}
                  className={cn("size-1.5 rounded-full bg-muted-foreground", !pausado && "animate-bounce")}
                />
              ))}
            </span>
          )}
        </div>
      </motion.div>
      <MotionPauseButton className="absolute right-4 -bottom-4" />
    </div>
  );
}

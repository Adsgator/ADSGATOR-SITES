"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";

import { Desenho, type BlocosDoDesenho } from "@/components/briefing/desenho";
import type { Passeio } from "@/components/briefing/rascunho-da-pagina";
import { BumerangueFrame } from "@/components/bumerangue";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { fraseDoVisual } from "@/lib/briefing/temas";

// O fim do briefing (pedido do Lucas, 2026-11-24): a página pronta, com o visual que a
// pessoa escolheu, rola devagar até o fim e volta; o cursor da marca clica no botão do
// WhatsApp e a conversa abre. Recomeça sozinha enquanto está à vista.

export type Mensagem = { de: "cliente" | "negocio"; texto: string };

type Etapa = "pronta" | "refinando" | "passeando" | "voltando" | "indo" | "clique" | "conversa" | "saindo";

/** Quanto cada etapa dura. A conversa depende das mensagens. */
const TEMPOS: Record<Exclude<Etapa, "conversa">, number> = {
  pronta: 1700,
  refinando: 3200,
  passeando: 11500,
  voltando: 3000,
  indo: 1500,
  clique: 650,
  saindo: 1100,
};
const SEGUINTE: Record<Etapa, Etapa> = {
  pronta: "refinando",
  refinando: "passeando",
  passeando: "voltando",
  voltando: "indo",
  indo: "clique",
  clique: "conversa",
  conversa: "saindo",
  saindo: "pronta",
};
/** Quanto a conversa pronta fica na tela antes de recomeçar. */
const PAUSA = 4200;

const DESCER: Passeio = { para: "fim", segundos: 10.5 };
const SUBIR: Passeio = { para: "topo", segundos: 2.6 };

export function CenaFinal({ desenho, nome, mensagens }: { desenho: BlocosDoDesenho; nome: string; mensagens: Mensagem[] }) {
  const [etapa, setEtapa] = useState<Etapa>("pronta");
  // Quantas mensagens já chegaram; entre uma e outra, alguém está digitando.
  const [chegaram, setChegaram] = useState(0);
  const [alvo, setAlvo] = useState({ x: 160, y: 220 });
  const caixa = useRef<HTMLDivElement>(null);
  const aVista = useInView(caixa, { amount: 0.35 });

  useEffect(() => {
    if (!aVista) return;
    const falta = etapa === "conversa" && chegaram < mensagens.length;
    const ms = etapa !== "conversa" ? TEMPOS[etapa] : falta ? (chegaram === 0 ? 900 : 1600) : PAUSA;
    const t = setTimeout(() => {
      if (falta) return setChegaram(chegaram + 1);
      if (etapa === "voltando") {
        const b = caixa.current?.querySelector("[data-botao-do-desenho]")?.getBoundingClientRect();
        const c = caixa.current?.getBoundingClientRect();
        if (b && c) setAlvo({ x: b.left - c.left + b.width * 0.62, y: b.top - c.top + b.height * 0.5 });
      }
      if (etapa === "saindo") setChegaram(0);
      setEtapa(SEGUINTE[etapa]);
    }, ms);
    return () => clearTimeout(t);
  }, [aVista, etapa, chegaram, mensagens.length]);

  const digitando = etapa === "conversa" && chegaram < mensagens.length ? mensagens[chegaram].de : null;
  const b = desenho.tipo === "pagina" ? desenho.blocos : null;
  const frase = b ? fraseDoVisual(b.estilos, b.cores, b.sensacoes) : "";

  return (
    <div className="mx-auto w-full max-w-[23rem]" data-cena-final={etapa} data-mensagens={chegaram}>
      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute -inset-10 rounded-full bg-brand/15 blur-3xl" />
        <BumerangueFrame>
          <div ref={caixa} className="relative overflow-hidden rounded-2xl shadow-2xl">
            <Desenho desenho={desenho} passeio={etapa === "passeando" ? DESCER : SUBIR} refinado={etapa !== "pronta"} janela altura="h-[30rem] sm:h-[33rem]" />
            {/* O toque da Adsgator: a luz passa e a página ganha o acabamento. */}
            <AnimatePresence>
              {etapa === "refinando" && (
                <motion.div key="toque" exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
                  <motion.span
                    initial={{ y: "-60%" }}
                    animate={{ y: "260%" }}
                    transition={{ duration: 2.4, ease: [0.45, 0, 0.35, 1] }}
                    className="absolute inset-x-0 h-2/5 bg-linear-to-b from-transparent via-brand/40 to-transparent"
                  />
                  <motion.span
                    initial={{ opacity: 0, y: 14, scale: 0.92 }}
                    animate={{ opacity: [0, 1, 1, 0], y: [14, 0, 0, -8], scale: 1 }}
                    transition={{ duration: 3, times: [0, 0.2, 0.78, 1] }}
                    className="absolute inset-x-0 bottom-5 mx-auto flex w-fit items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper shadow-xl"
                  >
                    <span className="brand-cursor h-5 text-brand" />
                    O toque da Adsgator
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {(etapa === "indo" || etapa === "clique") && (
                <motion.span
                  key="cursor"
                  initial={{ x: 320, y: 440, opacity: 0 }}
                  animate={{ x: alvo.x, y: alvo.y, opacity: 1, scale: etapa === "clique" ? [1, 0.72, 1] : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: etapa === "clique" ? 0.4 : 1.3, ease: [0.3, 0.05, 0.2, 1] }}
                  className="absolute top-0 left-0 z-20"
                  aria-hidden="true"
                >
                  <span className="brand-cursor block h-10 text-ink drop-shadow-[0_0_2px_#fff]" />
                  {etapa === "clique" && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0.8 }}
                      animate={{ scale: 2.6, opacity: 0 }}
                      transition={{ duration: 0.55 }}
                      className="absolute -top-3 -left-3 size-8 rounded-full border-2 border-brand"
                    />
                  )}
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {etapa === "conversa" && (
                <motion.div
                  key="conversa"
                  initial={{ opacity: 0, y: "9%", scale: 0.97, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)", transition: { duration: 1 } }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 z-10 flex flex-col bg-[#efe9de] text-ink"
                  aria-hidden="true"
                  data-conversa
                >
                  <div className="flex items-center gap-3 bg-[#12523f] px-4 py-3.5 text-white">
                    <ArrowLeftIcon className="size-4.5" />
                    <span className="flex size-9 items-center justify-center rounded-full bg-white/15">
                      <IconeWhatsApp className="size-5" />
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block truncate font-medium">{nome}</span>
                      <span className="block text-xs opacity-80">{digitando === "negocio" ? "digitando..." : "online"}</span>
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-end gap-2.5 overflow-hidden p-4">
                    {mensagens.slice(0, chegaram).map((m, j) => (
                      <motion.p
                        key={j}
                        layout
                        initial={{ opacity: 0, y: 14, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className={
                          m.de === "cliente"
                            ? "max-w-[84%] self-end [overflow-wrap:anywhere] rounded-2xl rounded-br-sm bg-[#d8f3c9] px-4 py-3 text-[0.9rem] leading-snug shadow-sm"
                            : "max-w-[84%] self-start [overflow-wrap:anywhere] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-[0.9rem] leading-snug shadow-sm"
                        }
                      >
                        {m.texto}
                      </motion.p>
                    ))}
                    {digitando && chegaram > 0 && (
                      <span
                        className={
                          digitando === "cliente"
                            ? "flex gap-1 self-end rounded-2xl bg-[#d8f3c9] px-4 py-3"
                            : "flex gap-1 self-start rounded-2xl bg-white px-4 py-3"
                        }
                      >
                        {[0, 1, 2].map((j) => (
                          <motion.span
                            key={j}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.7, repeat: Infinity, delay: j * 0.12 }}
                            className="size-1.5 rounded-full bg-ink/40"
                          />
                        ))}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </BumerangueFrame>
      </div>
      <p className="mt-7 flex min-h-12 items-start justify-center text-center font-heading text-lg leading-snug text-balance" aria-hidden="true">
        {frase}
      </p>
    </div>
  );
}

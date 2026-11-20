"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

import { useMotionPaused } from "@/components/motion/motion-scope";
import { PARTES_DA_PAGINA, PaginaCliente } from "@/components/pagina-cliente";
import { segmentos } from "@/config/segmentos";
import { cn } from "@/lib/utils";

// Topo da página de landing page (roteiro do site, Landing page, seção 1): a
// página de um cliente fictício se monta seção por seção dentro do celular,
// seguindo o roteiro aprovado, que vai sendo marcado ao lado (o cliente aprova
// o roteiro; o visual é da Adsgator). A tela desce até a parte que acabou de
// entrar; pronta, fica no fim, com o rodapé e o botão flutuante entrando
// (antes voltava direto ao topo e o rodapé nunca aparecia, visto pelo Lucas em
// 2026-11-20), volta ao topo e passa ao próximo cliente. Tamanho fixo: a
// montagem não mexe no resto da página. Inclinada, fica de frente com a
// rolagem; vale também com "reduzir animações" (decisão do Lucas,
// 2026-11-20). Precisa estar dentro de um MotionScope (botão de pausar).

const roteiro = [
  "Topo com a mensagem principal",
  "Serviços",
  "Quem somos",
  "Como funciona",
  "Depoimentos",
  "Perguntas frequentes",
  "Onde atendemos",
  "Chamada para o WhatsApp",
  "Rodapé",
];

export function PaginaMontando() {
  const pausado = useMotionPaused();
  // `noTopo`: pronta, a tela já voltou ao topo (depois de mostrar o fim).
  const [{ indice, montados, noTopo }, setEstado] = useState({ indice: 0, montados: 0, noTopo: false });
  const tela = useRef<HTMLDivElement>(null);
  const pagina = useRef<HTMLDivElement>(null);
  const s = segmentos[indice];

  const { scrollY } = useScroll();
  const giroY = useTransform(scrollY, [0, 420], [16, 0]);
  const giroX = useTransform(scrollY, [0, 420], [8, 0]);

  // Uma parte a cada 0,9 s; pronta, fica 1,8 s no fim, volta ao topo, fica
  // 2,5 s e passa ao próximo cliente.
  useEffect(() => {
    if (pausado) return;
    const pronta = montados === PARTES_DA_PAGINA;
    const id = setTimeout(
      () =>
        setEstado(
          !pronta
            ? { indice, montados: montados + 1, noTopo: false }
            : !noTopo
              ? { indice, montados, noTopo: true }
              : { indice: (indice + 1) % segmentos.length, montados: 0, noTopo: false },
        ),
      !pronta ? 900 : !noTopo ? 1800 : 2500,
    );
    return () => clearTimeout(id);
  }, [indice, montados, noTopo, pausado]);

  // A tela desce até a última parte montada; pronta, mostra o fim e depois
  // volta ao topo.
  useEffect(() => {
    const t = tela.current;
    const p = pagina.current;
    if (!t || !p) return;
    const parte = p.querySelector<HTMLElement>(`[data-parte="${montados - 1}"]`);
    const limite = p.scrollHeight - t.clientHeight;
    const y =
      montados === 0 || noTopo || !parte
        ? 0
        : montados === PARTES_DA_PAGINA
          ? limite
          : Math.min(limite, Math.max(0, parte.offsetTop - 60));
    p.style.transform = `translateY(${-y}px)`;
  }, [montados, indice, noTopo]);

  return (
    <div className="relative mx-auto h-[34rem] w-full max-w-md [perspective:1400px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-1/4 h-72 rounded-full bg-brand/35 blur-3xl"
      />
      <motion.div aria-hidden="true" data-montando style={{ rotateY: giroY, rotateX: giroX }} className="relative h-full">
        <div className="absolute top-0 right-0 w-[15.5rem] sm:right-4 sm:w-[16.5rem]">
          <div className="rounded-[2.6rem] bg-ink p-2 shadow-2xl shadow-ink/25">
            <div className="flex aspect-[9/18.5] flex-col overflow-hidden rounded-[2.1rem] bg-paper text-ink">
              <p className="border-b border-ink/10 py-2 text-center font-mono text-[0.6rem] text-ink/60">{s.site}</p>
              <div ref={tela} className="relative flex-1 overflow-hidden">
                <div ref={pagina} className="transition-transform duration-1000 ease-(--ease-out)">
                  <PaginaCliente s={s} montados={montados} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 z-10 w-56 rounded-3xl border bg-card p-5 shadow-2xl shadow-ink/15 sm:w-64">
          <p className="font-mono text-xs text-muted-foreground">Roteiro aprovado</p>
          <ol className="mt-3 space-y-1.5 text-[0.8rem]">
            {roteiro.map((parte, i) => {
              const feita = i < montados;
              return (
                <li key={parte} data-roteiro-feito={feita ? "" : undefined} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                      feita ? "border-brand bg-brand text-brand-foreground" : "text-transparent",
                    )}
                  >
                    <CheckIcon className="size-3" />
                  </span>
                  <span className={cn("transition-colors duration-300", !feita && "text-muted-foreground")}>{parte}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </motion.div>
    </div>
  );
}

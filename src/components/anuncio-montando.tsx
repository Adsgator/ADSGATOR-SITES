"use client";

import { SearchIcon } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform, type Variants } from "motion/react";

import { MotionPauseButton } from "@/components/motion/motion-scope";
import { useDigitacao } from "@/components/motion/use-digitacao";
import { segmentos } from "@/config/segmentos";

// Topo da página de Google Ads (roteiro do site, Google Ads, seção 1): a busca
// é digitada e o anúncio se monta na página de resultados, peça por peça,
// empurrando os resultados comuns para baixo. Os clientes fictícios se
// revezam. Inclinada em 3D, fica de frente com a rolagem; vale também com
// "reduzir animações" (decisão do Lucas, 2026-11-20). Precisa estar dentro de
// um MotionScope (botão de pausar).

const buscas = segmentos.map((s) => s.busca);

const montagem: Variants = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.22, delayChildren: 0.25 } },
};
const peca: Variants = {
  oculto: { opacity: 0, y: 10, filter: "blur(6px)" },
  visivel: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function AnuncioMontando() {
  const busca = useDigitacao(buscas, { inicio: 500, intervalo: 600, velocidade: 65, espera: 4600 });
  const s = segmentos[busca.indice];
  const { scrollY } = useScroll();
  const giroY = useTransform(scrollY, [0, 420], [-18, 0]);
  const giroX = useTransform(scrollY, [0, 420], [10, 0]);

  return (
    <div className="relative [perspective:1400px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-1/4 h-64 rounded-full bg-brand/35 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        data-resultados
        style={{ rotateY: giroY, rotateX: giroX }}
        className="relative overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-ink/15"
      >
        <div className="flex items-center gap-1.5 border-b px-5 py-3">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="ml-3 font-mono text-[0.7rem] text-muted-foreground">google.com.br</span>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex h-11 items-center gap-3 rounded-full border bg-background px-4 text-sm">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            <span data-busca className="truncate">
              {busca.texto}
            </span>
            {busca.fase === "digitando" && <span className="-ml-2.5 h-4 w-px animate-pulse bg-foreground" />}
          </div>
          <div className="mt-4 flex gap-5 border-b text-xs text-muted-foreground">
            <span className="border-b-2 border-foreground pb-2 text-foreground">Todas</span>
            <span>Maps</span>
            <span>Imagens</span>
            <span>Notícias</span>
          </div>

          <AnimatePresence initial={false}>
            {busca.pronto && (
              <motion.div
                key={s.id}
                data-anuncio
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <motion.div variants={montagem} initial="oculto" animate="visivel" className="relative pt-5">
                  <motion.span
                    variants={peca}
                    className="absolute top-4 right-0 inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-0.5 text-[0.7rem] font-medium text-brand-foreground"
                  >
                    <span className="size-1.5 rounded-full bg-brand-foreground" />
                    Seu anúncio
                  </motion.span>
                  <motion.p variants={peca} className="text-xs font-semibold">
                    Patrocinado
                  </motion.p>
                  <motion.div variants={peca} className="mt-2 flex items-center gap-2.5">
                    <span
                      style={{ background: s.fundo, color: s.destaque }}
                      className="flex size-7 items-center justify-center rounded-full"
                    >
                      <s.icone className="size-3.5" />
                    </span>
                    <div className="leading-tight">
                      <p className="text-sm font-medium">{s.nome}</p>
                      <p className="text-xs text-muted-foreground">{s.site}</p>
                    </div>
                  </motion.div>
                  <motion.p variants={peca} className="mt-3 font-heading text-xl leading-snug text-[#1a4fb8] dark:text-[#8ab4f8]">
                    {s.anuncio}
                  </motion.p>
                  <motion.p variants={peca} className="mt-1 text-sm leading-6 text-muted-foreground">
                    {s.anuncioTexto}
                  </motion.p>
                  <motion.div variants={peca} className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border px-3 py-1">{s.cta}</span>
                    <span className="rounded-full border px-3 py-1">Ver serviços</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Os resultados comuns, só como formas: o que importa é o anúncio. */}
          <div className="mt-6 space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-2 w-28 rounded-full bg-muted" />
                <div className="h-3.5 w-3/4 rounded-full bg-muted-foreground/25" />
                <div className="h-2 w-full rounded-full bg-muted" />
                <div className="h-2 w-5/6 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <MotionPauseButton className="absolute -bottom-4 right-4" />
    </div>
  );
}

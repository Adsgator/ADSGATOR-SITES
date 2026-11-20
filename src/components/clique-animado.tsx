"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";

import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { MotionScope, useMotionPaused } from "@/components/motion/motion-scope";
import { PaginaCliente } from "@/components/pagina-cliente";
import { segmentos } from "@/config/segmentos";

// A cena da chamada final (pedido do Lucas, 2026-11-20): o cursor da marca
// entra pela lateral, clica no anúncio, o anúncio vira a página do cliente, o
// cursor clica no botão do WhatsApp e abre a conversa; depois recomeça com
// outro segmento. Feita em código (nítida em qualquer tela, leve e ajustável).
// O cursor mede a posição do título do anúncio e do botão na hora, para
// acertar em qualquer tamanho. O cursor é a seta branca da marca, e no clique as
// 3 linhas da ponta aparecem em amarelo e o elemento clicado reage.

type Etapa = "entrando" | "clicaAnuncio" | "pagina" | "indoWhats" | "clicaWhats" | "conversa" | "saindo";

// Tempos de cada etapa, mais lentos a pedido do Lucas (2026-11-20).
const roteiro: { etapa: Etapa; ms: number }[] = [
  { etapa: "entrando", ms: 2200 },
  { etapa: "clicaAnuncio", ms: 650 },
  { etapa: "pagina", ms: 1300 },
  { etapa: "indoWhats", ms: 1700 },
  { etapa: "clicaWhats", ms: 650 },
  { etapa: "conversa", ms: 4200 },
  { etapa: "saindo", ms: 900 },
];
/** Quanto o cursor leva para andar até o alvo (segundos). */
const PASSADA = 1.3;

// A ponta da seta fica a 27% da largura e da altura do desenho (globals.css).
const CURSOR = { largura: 42, ponta: 0.27, proporcao: 779 / 517 };

export function CliqueAnimado() {
  return (
    <MotionScope className="relative">
      <Cena />
    </MotionScope>
  );
}

function Cena() {
  const pausado = useMotionPaused();
  const [passo, setPasso] = useState(0);
  const [volta, setVolta] = useState(0);
  const cena = useRef<HTMLDivElement>(null);
  const [alvo, setAlvo] = useState({ x: 420, y: 330 });
  const { etapa } = roteiro[passo];
  const s = segmentos[volta % segmentos.length];
  const naPagina = etapa === "pagina" || etapa === "indoWhats" || etapa === "clicaWhats";

  // Só começa quando a pessoa chega até a seção (metade da cena na tela), e
  // para enquanto ela estiver fora da tela (pedido do Lucas, 2026-11-20).
  const naTela = useInView(cena, { amount: 0.5 });

  useEffect(() => {
    if (pausado || !naTela) return;
    const id = setTimeout(() => {
      if (passo === roteiro.length - 1) setVolta((v) => v + 1);
      setPasso((p) => (p + 1) % roteiro.length);
    }, roteiro[passo].ms);
    return () => clearTimeout(id);
  }, [passo, pausado, naTela]);

  // Onde o cursor vai em cada etapa: medido na cena. Quando a tela troca, o
  // conteúdo novo só entra depois de o antigo sair (0,35 s); então tenta de
  // novo a cada quadro até o alvo existir (sem isso, o cursor ficava parado na
  // entrada e só andava na hora do clique; visto no teste de 2026-11-20).
  useLayoutEffect(() => {
    let quadro = 0;
    let tentativas = 0;
    const medir = () => {
      const caixa = cena.current?.getBoundingClientRect();
      if (!caixa) return;
      const centroDe = (seletor: string) => {
        const r = cena.current?.querySelector(seletor)?.getBoundingClientRect();
        return r ? { x: r.left - caixa.left + r.width * 0.55, y: r.top - caixa.top + r.height * 0.55 } : null;
      };
      const fora = { x: caixa.width + 60, y: caixa.height * 0.8 };
      const seletor = !naTela
        ? null
        : etapa === "entrando" || etapa === "clicaAnuncio"
          ? "[data-titulo-anuncio]"
          : etapa === "indoWhats" || etapa === "clicaWhats"
            ? "[data-cta-whatsapp]"
            : null;
      if (!seletor) {
        setAlvo(naTela && etapa === "pagina" ? { x: caixa.width * 0.75, y: caixa.height * 0.3 } : fora);
        return;
      }
      const destino = centroDe(seletor);
      if (destino) setAlvo(destino);
      else if (tentativas++ < 60) quadro = requestAnimationFrame(medir);
    };
    medir();
    return () => cancelAnimationFrame(quadro);
  }, [etapa, volta, naTela]);

  const clicando = etapa === "clicaAnuncio" || etapa === "clicaWhats";
  const altura = CURSOR.largura * CURSOR.proporcao;

  return (
    <div
      ref={cena}
      aria-hidden="true"
      // O elemento clicado reage (globals.css, .cena-clique): o anúncio afunda e
      // ganha destaque; o botão do WhatsApp aperta.
      data-clique={etapa === "clicaAnuncio" ? "anuncio" : etapa === "clicaWhats" ? "whats" : undefined}
      className="cena-clique relative h-[26rem] w-[20rem] overflow-hidden rounded-[2rem] bg-paper text-ink shadow-[0_40px_80px_-40px_rgb(31_39_27/0.7)] sm:w-[22rem]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {etapa === "entrando" || etapa === "clicaAnuncio" ? (
          <motion.div key={`anuncio-${s.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.08 }} transition={{ duration: 0.35 }} className="p-5">
            <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm">
              <SearchIcon className="size-4 text-ink/50" />
              {s.busca}
            </div>
            <div data-anuncio className="mt-4 rounded-2xl border border-brand/60 bg-white p-4">
              <p className="text-[0.7rem] font-semibold">Patrocinado · {s.site}</p>
              <p data-titulo-anuncio className="mt-2 font-heading text-lg leading-snug">{s.anuncio}</p>
              <p className="mt-1 text-xs leading-5 text-ink/60">{s.anuncioTexto}</p>
            </div>
            {[0, 1].map((n) => (
              <div key={n} className="mt-3 rounded-2xl border border-ink/10 bg-white/60 p-4 opacity-60">
                <span className="block h-2 w-1/3 rounded-full bg-ink/10" />
                <span className="mt-2.5 block h-2.5 w-3/4 rounded-full bg-ink/10" />
              </div>
            ))}
          </motion.div>
        ) : naPagina ? (
          <motion.div key={`pagina-${s.id}`} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
            <p className="border-b border-ink/10 py-2 text-center font-mono text-[0.65rem] text-ink/50">{s.site}</p>
            <PaginaCliente s={s} />
          </motion.div>
        ) : (
          <motion.div key={`conversa-${s.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="flex h-full flex-col bg-[#ECE5DD]">
            <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
              <span style={{ background: s.destaque, color: s.fundo }} className="flex size-8 items-center justify-center rounded-full">
                <s.icone className="size-4" />
              </span>
              <p className="text-sm font-medium">{s.nome}</p>
              <IconeWhatsApp className="ml-auto size-5" />
            </div>
            <div className="flex-1 space-y-2 p-4 text-sm">
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-[#DCF8C6] px-3 py-2">
                {s.mensagem}
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="max-w-[85%] rounded-xl rounded-tl-sm bg-white px-3 py-2">
                {s.resposta}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-10"
        initial={false}
        animate={{ x: alvo.x - CURSOR.largura * CURSOR.ponta, y: alvo.y - altura * CURSOR.ponta }}
        transition={{ duration: etapa === "saindo" ? 0.01 : PASSADA, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* A seta branca da marca, com um contorno escuro fino para aparecer no
            fundo claro e no amarelo; no clique, ela aperta e as 3 linhas da
            ponta aparecem em amarelo (pedido do Lucas, 2026-11-20). */}
        <motion.span
          animate={{ scale: clicando ? 0.85 : 1 }}
          transition={{ duration: 0.15 }}
          style={{ width: CURSOR.largura, transformOrigin: "27% 27%" }}
          className="relative block aspect-[517/779]"
        >
          <span
            data-seta
            className="absolute inset-0 bg-[url(/brand/cursor-seta-branca.svg)] bg-contain bg-no-repeat [filter:drop-shadow(0_0_1px_#1F271B)_drop-shadow(0_0_1px_#1F271B)_drop-shadow(0_4px_6px_rgb(0_0_0/0.3))]"
          />
          {clicando && (
            <motion.span
              key={`${etapa}-${volta}`}
              data-linhas
              className="absolute inset-0 bg-[url(/brand/cursor-linhas.svg)] bg-contain bg-no-repeat"
              style={{ transformOrigin: "27% 27%" }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.7, 1.5, 1.35, 1.35] }}
              transition={{ duration: 0.65, times: [0, 0.25, 0.7, 1], ease: "easeOut" }}
            />
          )}
        </motion.span>
      </motion.div>
    </div>
  );
}

"use client";

import { ClockIcon, MapPinIcon, MessageCircleIcon, PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { estilos, semEstilo } from "@/lib/briefing/estilos";
import { emTexto, visiveis, type Briefing, type Papel, type Respostas } from "@/lib/briefing/regras";
import { cn } from "@/lib/utils";

// O desenho da página que vai tomando forma com as respostas: aparece na
// abertura, ao lado das perguntas (no computador) e entre os passos. É um
// esboço de blocos, não a página de verdade, e quem usa diz isso na legenda.

export type Blocos = {
  nome?: string;
  whatsapp?: boolean;
  lugar?: boolean;
  horarios?: boolean;
  servicos?: string[];
  clientes?: boolean;
  historia?: boolean;
  duvidas?: number;
  estilo?: string;
};

export function blocosDasRespostas(briefing: Briefing, respostas: Respostas): Blocos {
  const prontas = visiveis(briefing, respostas).filter((p) => p.papel && emTexto(p, briefing, respostas).length);
  const com = (papel: Papel) => prontas.find((p) => p.papel === papel);
  const nome = com("nome");
  const duvidas = com("duvidas");
  const estilo = com("estilo");
  return {
    nome: nome && emTexto(nome, briefing, respostas)[0],
    whatsapp: Boolean(com("whatsapp")),
    lugar: Boolean(com("lugar")),
    horarios: Boolean(com("horarios")),
    servicos: prontas.filter((p) => p.papel === "servicos").flatMap((p) => respostas[p.id].opcoes ?? []),
    clientes: Boolean(com("clientes")),
    historia: Boolean(com("historia")),
    duvidas: duvidas && emTexto(duvidas, briefing, respostas).length,
    estilo: estilo && respostas[estilo.id].opcoes?.[0],
  };
}

const entrada = {
  initial: { opacity: 0, y: 14, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

function Linha({ largura, forte, cor }: { largura: string; forte?: boolean; cor: string }) {
  return (
    <span
      className={cn("block rounded-full", forte ? "h-2" : "h-1.5")}
      style={{ width: largura, background: cor, opacity: forte ? 0.6 : 0.22 }}
    />
  );
}

/** Um bloco da página: tracejado enquanto a resposta não vem. */
function Bloco({
  ativo,
  vazio,
  className,
  children,
}: {
  ativo: boolean;
  vazio: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {ativo ? (
        <motion.div key="cheio" {...entrada} exit={{ opacity: 0 }} className={className} data-bloco={vazio}>
          {children}
        </motion.div>
      ) : (
        <motion.div
          key="vazio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex h-9 items-center justify-center rounded-lg border border-dashed text-[0.65rem]"
          style={{ borderColor: "color-mix(in oklab, currentColor 25%, transparent)" }}
        >
          <span className="opacity-60">{vazio}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RascunhoDaPagina({ blocos, className }: { blocos: Blocos; className?: string }) {
  const e = estilos.find((x) => x.nome === blocos.estilo) ?? semEstilo;
  const caixa = { borderRadius: e.raio, background: `color-mix(in oklab, ${e.tinta} 7%, transparent)` };
  return (
    <div
      aria-hidden="true"
      data-rascunho
      className={cn(
        "overflow-hidden rounded-2xl border shadow-[0_30px_60px_-35px_rgb(31_39_27/0.6)] transition-colors duration-700",
        className,
      )}
      style={{ background: e.fundo, color: e.tinta }}
    >
      <div className="flex gap-1.5 px-4 pt-3.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-current opacity-20" />
        ))}
      </div>
      <div className="space-y-3 p-4">
        <Bloco ativo={Boolean(blocos.nome)} vazio="o seu nome" className="space-y-2.5 pt-2 pb-1 text-center">
          <p
            className={cn("text-lg leading-tight text-balance", e.maiusculas && "text-base tracking-widest uppercase")}
            style={{ fontFamily: e.fonte }}
          >
            {blocos.nome}
          </p>
          <span className="flex flex-col items-center gap-1.5">
            <Linha largura="70%" cor={e.tinta} />
            <Linha largura="46%" cor={e.tinta} />
          </span>
        </Bloco>
        <Bloco ativo={Boolean(blocos.whatsapp)} vazio="o seu WhatsApp" className="flex justify-center">
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[0.7rem] font-semibold transition-colors duration-700"
            style={{ background: e.destaque, color: e.sobre, borderRadius: e.raio }}
          >
            <MessageCircleIcon className="size-3" />
            Chamar no WhatsApp
          </span>
        </Bloco>
        <Bloco ativo={Boolean(blocos.servicos?.length)} vazio="o que você oferece" className="grid grid-cols-2 gap-2">
          {(blocos.servicos ?? []).slice(0, 4).map((s) => (
            <div key={s} className="min-w-0 space-y-1.5 p-2.5" style={caixa}>
              <span className="block size-2 rounded-full" style={{ background: e.destaque }} />
              <p className="truncate text-[0.65rem] font-medium">{s}</p>
              <Linha largura="85%" cor={e.tinta} />
            </div>
          ))}
        </Bloco>
        <Bloco ativo={Boolean(blocos.clientes)} vazio="para quem é" className="space-y-1.5 py-2">
          <Linha largura="55%" forte cor={e.destaque} />
          <Linha largura="92%" cor={e.tinta} />
          <Linha largura="78%" cor={e.tinta} />
        </Bloco>
        <Bloco ativo={Boolean(blocos.duvidas)} vazio="as dúvidas respondidas" className="space-y-1.5">
          {Array.from({ length: Math.min(blocos.duvidas ?? 0, 3) }, (_, i) => (
            <div key={i} className="flex items-center justify-between px-2.5 py-2" style={caixa}>
              <Linha largura={`${60 - i * 9}%`} cor={e.tinta} />
              <PlusIcon className="size-2.5 opacity-50" />
            </div>
          ))}
        </Bloco>
        <Bloco ativo={Boolean(blocos.historia)} vazio="a sua história" className="flex items-center gap-3 py-1">
          <span className="size-10 shrink-0 rounded-full opacity-50" style={{ background: e.destaque }} />
          <span className="flex-1 space-y-1.5">
            <Linha largura="50%" forte cor={e.tinta} />
            <Linha largura="90%" cor={e.tinta} />
            <Linha largura="72%" cor={e.tinta} />
          </span>
        </Bloco>
        <Bloco
          ativo={Boolean(blocos.lugar || blocos.horarios)}
          vazio="onde e quando"
          className="flex justify-center gap-4 pt-1 text-[0.65rem]"
        >
          {blocos.lugar && (
            <span className="inline-flex items-center gap-1 opacity-75">
              <MapPinIcon className="size-3" /> Onde atende
            </span>
          )}
          {blocos.horarios && (
            <span className="inline-flex items-center gap-1 opacity-75">
              <ClockIcon className="size-3" /> Horários
            </span>
          )}
        </Bloco>
      </div>
    </div>
  );
}

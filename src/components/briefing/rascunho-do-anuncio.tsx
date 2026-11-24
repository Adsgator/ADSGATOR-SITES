"use client";

import { BanIcon, ClockIcon, MapPinIcon, SearchIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { emTexto, visiveis, type Briefing, type Papel, type Respostas } from "@/lib/briefing/regras";
import { cn } from "@/lib/utils";

// O desenho do anúncio que vai tomando forma com as respostas do briefing do Google
// Ads: a busca, o anúncio, onde e quando aparece e o que fica bloqueado. É um esboço,
// e quem usa diz isso na legenda.

export type BlocosDoAnuncio = {
  nome?: string;
  site?: string;
  servicos?: string[];
  busca?: string;
  cidades?: string[];
  horarios?: string;
  bloqueadas?: string[];
};

export function blocosDoAnuncio(briefing: Briefing, respostas: Respostas): BlocosDoAnuncio {
  const prontas = visiveis(briefing, respostas).filter((p) => p.papel && emTexto(p, briefing, respostas).length);
  const com = (papel: Papel) => {
    const p = prontas.find((x) => x.papel === papel);
    return p && { linhas: emTexto(p, briefing, respostas), opcoes: respostas[p.id].opcoes ?? [] };
  };
  const horarios = com("horarios")?.linhas;
  return {
    nome: briefing.jaSabemos?.nome,
    site: com("site")?.linhas[0] ?? briefing.jaSabemos?.site,
    servicos: com("servicos")?.opcoes ?? briefing.jaSabemos?.servicos,
    busca: com("procuram")?.opcoes[0],
    cidades: com("cidades")?.opcoes,
    horarios: horarios && (horarios.length > 1 ? "Nos seus horários" : horarios[0]),
    bloqueadas: com("naoQuer")?.opcoes,
  };
}

const entrada = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

function Parte({
  ativa,
  vazio,
  className,
  children,
}: {
  ativa: boolean;
  vazio: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {ativa ? (
        <motion.div key="cheia" {...entrada} className={className}>
          {children}
        </motion.div>
      ) : (
        <motion.div
          key="vazia"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex h-9 items-center justify-center rounded-lg border border-dashed border-ink/25 text-[0.65rem]"
        >
          <span className="opacity-60">{vazio}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RascunhoDoAnuncio({ blocos, className }: { blocos: BlocosDoAnuncio; className?: string }) {
  const { nome, site, servicos, busca, cidades, horarios, bloqueadas } = blocos;
  const titulo = servicos?.[0];
  return (
    <div
      aria-hidden="true"
      data-rascunho
      className={cn(
        "space-y-3 overflow-hidden rounded-2xl border [overflow-wrap:anywhere] bg-[#fcfbf8] p-4 text-ink shadow-[0_30px_60px_-35px_rgb(31_39_27/0.6)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-2 text-xs">
        <SearchIcon className="size-3.5 shrink-0 opacity-60" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={busca ?? ""} {...entrada} className={cn("truncate", !busca && "opacity-50")}>
            {busca ?? "o que a pessoa digita"}
          </motion.span>
        </AnimatePresence>
      </div>
      <Parte ativa={Boolean(titulo)} vazio="o seu anúncio" className="space-y-2 rounded-xl border border-ink/10 bg-white p-3.5">
        <p className="text-[0.65rem] font-semibold">Patrocinado</p>
        <p className="truncate text-[0.7rem] opacity-70">{site ?? "seu site"}</p>
        <p className="line-clamp-3 text-base leading-snug font-medium text-balance text-[#1a4fa3]">
          {titulo}
          {(cidades?.[0] ?? nome) && ` · ${cidades?.[0] ?? nome}`}
        </p>
        <span className="block h-1.5 w-[92%] rounded-full bg-ink/15" />
        <span className="block h-1.5 w-[70%] rounded-full bg-ink/15" />
        {(servicos?.length ?? 0) > 1 && (
          <p className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[0.65rem] text-[#1a4fa3]">
            {servicos!.slice(1, 4).map((s) => (
              <span key={s} className="line-clamp-1">{s}</span>
            ))}
          </p>
        )}
        <span data-botao-do-desenho className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[0.65rem] font-semibold">
          <IconeWhatsApp className="size-3" />
          Chamar no WhatsApp
        </span>
      </Parte>
      <Parte ativa={Boolean(cidades?.length)} vazio="onde aparece" className="flex items-start gap-2 text-[0.7rem]">
        <MapPinIcon className="mt-px size-3.5 shrink-0" />
        <span className="line-clamp-2 min-w-0">{cidades?.join(", ")}</span>
      </Parte>
      <Parte ativa={Boolean(bloqueadas?.length)} vazio="o que fica de fora" className="space-y-1.5 rounded-xl bg-ink/5 p-3">
        {bloqueadas?.slice(0, 3).map((b) => (
          <p key={b} className="flex items-center gap-2 text-[0.65rem]">
            <BanIcon className="size-3 shrink-0 text-destructive" />
            <span className="truncate line-through opacity-70">{b}</span>
          </p>
        ))}
      </Parte>
      <Parte ativa={Boolean(horarios)} vazio="quando aparece" className="flex items-center gap-2 text-[0.7rem]">
        <ClockIcon className="size-3.5 shrink-0" />
        <span className="truncate">{horarios}</span>
      </Parte>
    </div>
  );
}

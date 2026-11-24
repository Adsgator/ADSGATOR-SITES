"use client";

import { useEffect, useRef, useState } from "react";
import { BanIcon, MapPinIcon, SearchIcon } from "lucide-react";
import { animate, AnimatePresence, motion } from "motion/react";

import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { useDigitacao } from "@/components/motion/use-digitacao";
import { Parte, Quadros, trecho, type Passeio } from "@/components/briefing/rascunho-da-pagina";
import { Traco } from "@/components/briefing/topo-da-pagina";
import { iconesDoNegocio, type IconeDoNegocio } from "@/lib/briefing/icones";
import { emTexto, semanaDe, visiveis, type Briefing, type Horario, type Papel, type Respostas } from "@/lib/briefing/regras";
import { temaDe } from "@/lib/briefing/temas";
import { cn } from "@/lib/utils";

// O desenho da campanha que vai tomando forma com as respostas do briefing do Google Ads:
// a busca sendo digitada (as do diagnóstico), o anúncio com as variações, onde e quando aparece
// e o que fica de fora. É um esboço, e a legenda diz isso.

export type BlocosDoAnuncio = {
  nome?: string;
  site?: string;
  servicos?: string[];
  principal?: string;
  buscas?: string[];
  destaques?: string[];
  cidades?: string[];
  horarios?: Horario[];
  bloqueadas?: string[];
  icone?: IconeDoNegocio;
};

export function blocosDoAnuncio(briefing: Briefing, respostas: Respostas): BlocosDoAnuncio {
  const prontas = visiveis(briefing, respostas).filter((p) => p.papel && emTexto(p, briefing, respostas).length);
  const r = (papel: Papel) => {
    // A última pergunta da parte: "em outros horários" vale mais que a confirmação.
    const p = prontas.findLast((x) => x.papel === papel);
    return p && !respostas[p.id].nada ? respostas[p.id] : undefined;
  };
  const sabemos = briefing.jaSabemos;
  const horarios = r("horarios");
  return {
    nome: sabemos?.nome,
    site: sabemos?.site,
    servicos: r("servicos")?.opcoes ?? sabemos?.servicos,
    principal: r("principal")?.opcoes?.[0] ?? sabemos?.principal,
    buscas: sabemos?.buscas,
    destaques: r("destaques")?.opcoes,
    cidades: r("cidades")?.opcoes,
    // Quem responde nos mesmos horários já tinha contado quais.
    horarios: horarios && (horarios.horarios ?? sabemos?.horarios),
    bloqueadas: r("naoQuer")?.opcoes,
    icone: briefing.icone,
  };
}

const AZUL = "#1a4fa3";
const tema = { ...temaDe(), raio: "0.75rem" };
const tinta = tema.tinta;

/** A caixa de busca, com as buscas da pessoa sendo digitadas. */
function Busca({ buscas }: { buscas: string[] }) {
  const { texto, visivel } = useDigitacao(buscas, { inicio: 300, velocidade: 60, espera: 2600, intervalo: 350 });
  return (
    <span className="truncate">
      {visivel ? texto : ""}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="ml-px inline-block h-3 w-px translate-y-0.5 bg-ink"
      />
    </span>
  );
}

/** Os títulos que o anúncio alterna, feitos com as palavras da pessoa. */
function titulosDe(b: BlocosDoAnuncio): string[] {
  const servico = b.principal ?? b.servicos?.[0];
  const cidade = b.cidades?.[0]?.replace(/^Toda a região de /, "Região de ");
  return [
    servico && cidade ? `${servico} · ${cidade}` : servico,
    b.nome && servico ? `${b.nome} · ${servico}` : b.nome,
    b.destaques?.[0] && servico ? `${servico} · ${b.destaques[0]}` : undefined,
  ]
    .filter((t) => t !== undefined)
    .map((t) => trecho(t, 70));
}

function Titulo({ titulos }: { titulos: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (titulos.length < 2) return;
    const t = setInterval(() => setI((n) => n + 1), 3200);
    return () => clearInterval(t);
  }, [titulos.length]);
  const atual = titulos[i % titulos.length];
  return (
    <div className="relative min-h-11">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={atual}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={{ duration: 0.4 }}
          className="line-clamp-2 text-[1.02rem] leading-snug font-medium text-balance"
          style={{ color: AZUL }}
          data-titulo-do-anuncio
        >
          {atual}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// Lugares do mapa, em volta do centro.
const PINOS = [
  { x: 50, y: 48 },
  { x: 24, y: 32 },
  { x: 76, y: 28 },
  { x: 30, y: 74 },
  { x: 74, y: 72 },
];

function Mapa({ cidades }: { cidades: string[] }) {
  return (
    <div className="relative h-36 overflow-hidden rounded-xl border border-ink/10 bg-[#eef1ea]">
      <svg viewBox="0 0 200 110" preserveAspectRatio="none" className="absolute inset-0 size-full" fill="none" stroke="#1f271b" strokeOpacity="0.1">
        <path d="M0 30Q60 12 110 40T200 30M0 82Q70 98 120 70T200 88M40 0Q52 50 34 110M128 0Q112 50 142 110M0 56H200" strokeWidth="3" />
      </svg>
      <motion.span
        animate={{ scale: [1, 1.14, 1], opacity: [0.32, 0.18, 0.32] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
      />
      {cidades.slice(0, PINOS.length).map((c, i) => (
        <motion.span
          key={c}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.15 + i * 0.14 }}
          className="absolute flex max-w-[44%] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${PINOS[i].x}%`, top: `${PINOS[i].y}%` }}
        >
          <MapPinIcon className="size-4.5 fill-brand text-ink" />
          <span className="mt-0.5 max-w-full truncate rounded-full bg-white/90 px-1.5 py-px text-[0.56rem] font-medium shadow-sm">{c}</span>
        </motion.span>
      ))}
    </div>
  );
}

/** A semana em colunas, com as horas em que o anúncio aparece. */
function SemanaPequena({ horarios }: { horarios: Horario[] }) {
  const minutos = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3));
  return (
    <div className="grid grid-cols-7 gap-1">
      {semanaDe(horarios).map(({ dia, periodo }, i) => (
        <span key={dia} className="text-center">
          <span className="relative block h-14 overflow-hidden rounded bg-ink/7">
            {periodo && (
              <motion.span
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 origin-top rounded-sm bg-brand"
                style={{ top: `${(minutos(periodo.de) / 1440) * 100}%`, height: `${((minutos(periodo.ate) - minutos(periodo.de)) / 1440) * 100}%` }}
              />
            )}
          </span>
          <span className="text-[0.52rem]">{dia.slice(0, 3)}</span>
        </span>
      ))}
    </div>
  );
}

export function RascunhoDoAnuncio({
  blocos,
  foco,
  passeio,
  refinado,
  janela,
  altura = "h-[25rem]",
  className,
}: {
  blocos: BlocosDoAnuncio;
  foco?: Papel;
  passeio?: Passeio;
  refinado?: boolean;
  janela?: boolean;
  altura?: string;
  className?: string;
}) {
  const titulos = titulosDe(blocos);
  const servico = blocos.principal ?? blocos.servicos?.[0];
  const outros = (blocos.servicos ?? []).filter((s) => s !== servico);
  const Icone = blocos.icone ? iconesDoNegocio[blocos.icone] : undefined;
  const noAnuncio = foco && ["servicos", "principal", "destaques"].includes(foco);

  const moldura = useRef<HTMLDivElement>(null);
  const folha = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const m = moldura.current;
    const f = folha.current;
    if (!janela || !m || !f) return;
    const sobra = Math.max(0, f.offsetHeight - m.clientHeight);
    if (passeio) {
      const a = animate(f, { y: passeio.para === "fim" ? -sobra : 0 }, { duration: passeio.segundos, ease: [0.45, 0.05, 0.35, 1] });
      return () => a.stop();
    }
    const alvo = f.querySelector<HTMLElement>("[data-em-foco]");
    const y = alvo ? Math.min(sobra, Math.max(0, alvo.offsetTop - m.clientHeight / 2 + alvo.offsetHeight / 2)) : 0;
    const a = animate(f, { y: -y }, { duration: 0.8, ease: [0.22, 1, 0.36, 1] });
    return () => a.stop();
  }, [foco, passeio, janela, blocos]);

  const comum = { foco, tema, refinado };
  return (
    <div
      aria-hidden="true"
      data-rascunho
      className={cn(
        "overflow-hidden rounded-2xl border border-ink/10 bg-[#fcfbf8] [overflow-wrap:anywhere] text-ink shadow-[0_30px_60px_-35px_rgb(31_39_27/0.6)]",
        className,
      )}
    >
      {/* A busca fica sempre à vista. */}
      <div
        className="relative z-10 border-b border-ink/10 bg-white px-3 pt-3 pb-2"
        data-parte="procuram"
        data-ativa={Boolean(blocos.buscas)}
      >
        <span className="flex items-center gap-2 rounded-full border border-ink/15 px-3 py-2 text-xs shadow-sm">
          <SearchIcon className="size-3.5 shrink-0 opacity-60" />
          {blocos.buscas ? <Busca key={blocos.buscas.join()} buscas={blocos.buscas} /> : <span className="opacity-50">o que a pessoa digita</span>}
        </span>
        <span className="mt-2 flex gap-3 px-1 text-[0.56rem] opacity-55">
          <span className="border-b-2 border-brand pb-1 font-semibold opacity-100">Tudo</span>
          <span>Mapas</span>
          <span>Imagens</span>
          <span>Vídeos</span>
        </span>
      </div>
      <div ref={moldura} className={cn("relative overflow-hidden", janela && altura)} data-janela={janela || undefined}>
        <div ref={folha} className="relative">
          {blocos.cidades?.[0] && (
            <p className="flex items-center gap-1 px-4 pt-2.5 text-[0.56rem] opacity-60">
              <MapPinIcon className="size-2.5" /> Resultados perto de {trecho(blocos.cidades[0].replace(/^Toda a região de /, ""), 30)}
            </p>
          )}

          {/* O anúncio */}
          <div className={cn("transition-all duration-700", refinado ? "px-4 py-4" : "px-4 py-3")} data-parte="anuncio" data-ativa={Boolean(servico)} data-em-foco={noAnuncio || undefined}>
            {servico ? (
              <motion.div
                initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={cn("space-y-2 rounded-2xl bg-white p-4 transition-shadow duration-700", refinado ? "shadow-[0_18px_40px_-24px_rgb(31_39_27/0.6)]" : "border border-ink/10")}
                style={noAnuncio ? { boxShadow: "0 0 0 1.5px var(--brand)" } : undefined}
              >
                <p className="text-[0.62rem] font-semibold">Patrocinado</p>
                <div className="flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand/25">
                    {Icone ? <Icone className="size-3.5" /> : <span className="size-2 rounded-full bg-ink/40" />}
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-[0.72rem] font-medium">{blocos.nome ?? "Seu negócio"}</span>
                    <span className="block truncate text-[0.6rem] opacity-60">{blocos.site ?? "seunegocio.com.br"}</span>
                  </span>
                </div>
                <Titulo key={titulos.join()} titulos={titulos} />
                <span className="block space-y-1.5 py-0.5">
                  <Traco largura="94%" cor={tinta} />
                  <Traco largura="66%" cor={tinta} />
                </span>
                {blocos.destaques && blocos.destaques.length > 0 && (
                  <p className="text-[0.64rem] leading-relaxed opacity-80">{blocos.destaques.slice(0, 4).map((d) => trecho(d, 34)).join(" · ")}</p>
                )}
                {outros.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-ink/10 pt-2.5">
                    {outros.slice(0, 4).map((s) => (
                      <motion.span key={s} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
                        <span className="block truncate text-[0.68rem] font-medium" style={{ color: AZUL }}>
                          {s}
                        </span>
                        <Traco largura="80%" cor={tinta} />
                      </motion.span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span
                    data-botao-do-desenho
                    className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-brand px-3.5 py-2 text-[0.66rem] font-semibold [&_svg]:shrink-0"
                  >
                    {refinado && (
                      <motion.span
                        animate={{ x: ["-150%", "420%"] }}
                        transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
                        className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-white/40"
                      />
                    )}
                    <IconeWhatsApp className="size-3" />
                    Chamar no WhatsApp
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-2.5 rounded-2xl border border-dashed border-ink/25 p-4">
                <p className="font-mono text-[0.58rem] opacity-70">o seu anúncio</p>
                <Traco largura="45%" cor={tinta} />
                <Traco largura="88%" cor={tinta} forte />
                <Traco largura="70%" cor={tinta} />
              </div>
            )}
          </div>

          {/* O resultado comum, embaixo. */}
          <div className="space-y-1.5 px-5 pb-3 opacity-50">
            <Traco largura="38%" cor={tinta} />
            <Traco largura="72%" cor={tinta} forte />
            <Traco largura="90%" cor={tinta} />
          </div>

          <Parte
            {...comum}
            papel={["cidades"]}
            rotulo="onde aparece"
            nome="Onde aparece"
            faixa
            ativa={Boolean(blocos.cidades?.length)}
            planta={<Quadros n={1} cor={tinta} altura="h-16" />}
          >
            <Mapa cidades={blocos.cidades ?? []} />
          </Parte>

          <Parte
            {...comum}
            papel={["horarios"]}
            rotulo="quando aparece"
            nome="Quando aparece"
            ativa={Boolean(blocos.horarios)}
            planta={<Quadros n={7} cor={tinta} altura="h-9" />}
          >
            {blocos.horarios && <SemanaPequena horarios={blocos.horarios} />}
          </Parte>

          <Parte
            {...comum}
            papel={["naoQuer"]}
            rotulo="o que fica de fora"
            nome="O que fica de fora"
            ativa={Boolean(blocos.bloqueadas?.length)}
            planta={
              <span className="block space-y-2">
                <Traco largura="62%" cor={tinta} />
                <Traco largura="48%" cor={tinta} />
              </span>
            }
          >
            <ul className="space-y-1.5">
              {blocos.bloqueadas?.slice(0, 5).map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-2 text-[0.66rem]"
                >
                  <BanIcon className="size-3 shrink-0 text-destructive" />
                  <span className="truncate line-through opacity-70">{b}</span>
                </motion.li>
              ))}
            </ul>
          </Parte>
        </div>
      </div>
    </div>
  );
}

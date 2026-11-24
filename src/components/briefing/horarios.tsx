"use client";

import { CoffeeIcon, PlusIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Seletor } from "@/components/checkout/campo";
import {
  DE_SEGUNDA_A_SEXTA,
  DIAS_UTEIS,
  HORA_MARCADA,
  HORARIOS_INICIAIS,
  semanaDe,
  type Horario,
  type Periodo,
  type Resposta,
} from "@/lib/briefing/regras";
import { cn } from "@/lib/utils";

// Os dias e horários: de segunda a sexta num lugar só, com os dias que têm outro
// horário acrescentados dentro dele, e a semana inteira desenhada embaixo, para a
// pessoa ver o que marcou (pedido do Lucas, 2026-11-24).

/** De meia em meia hora, das 5:00 às 23:30. */
const PRIMEIRA_HORA = 5;
const horas = Array.from({ length: 38 }, (_, i) => {
  const minutos = PRIMEIRA_HORA * 60 + i * 30;
  return `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;
});

const suave = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

function Abre({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={suave}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

function Hora({ rotulo, valor, mudar }: { rotulo: string; valor: string; mudar: (v: string) => void }) {
  return (
    <div className="min-w-0 flex-1">
      <Seletor aria-label={rotulo} value={valor} onChange={(e) => mudar(e.target.value)} className="tabular-nums">
        {horas.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </Seletor>
    </div>
  );
}

/** "das 08:00 às 18:00", com o intervalo quando tem. */
function PeriodoDoDia({ nome, valor, mudar }: { nome: string; valor: Periodo; mudar: (p: Partial<Periodo>) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="w-7 shrink-0">das</span>
        <Hora rotulo={`${nome}, começa`} valor={valor.de} mudar={(de) => mudar({ de })} />
        <span className="shrink-0">às</span>
        <Hora rotulo={`${nome}, termina`} valor={valor.ate} mudar={(ate) => mudar({ ate })} />
      </div>
      <AnimatePresence initial={false} mode="wait">
        {valor.pausa ? (
          <Abre key="pausa">
            <div className="flex items-center gap-2 text-sm">
              <CoffeeIcon className="size-4 w-7 shrink-0 text-muted-foreground" aria-hidden="true" />
              <Hora
                rotulo={`${nome}, o intervalo começa`}
                valor={valor.pausa.de}
                mudar={(de) => mudar({ pausa: { ...valor.pausa!, de } })}
              />
              <span className="shrink-0">às</span>
              <Hora
                rotulo={`${nome}, o intervalo termina`}
                valor={valor.pausa.ate}
                mudar={(ate) => mudar({ pausa: { ...valor.pausa!, ate } })}
              />
              <button
                type="button"
                aria-label={`Tirar o intervalo de ${nome.toLowerCase()}`}
                onClick={() => mudar({ pausa: undefined })}
                className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-muted"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </button>
            </div>
          </Abre>
        ) : (
          <Abre key="sem-pausa">
            <button
              type="button"
              onClick={() => mudar({ pausa: { de: "12:00", ate: "13:00" } })}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <CoffeeIcon className="size-4" aria-hidden="true" />
              Paro no meio do dia
            </button>
          </Abre>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Os dias de segunda a sexta que fogem do horário de sempre. */
function DiasDiferentes({ linha, mudar }: { linha: Horario; mudar: (h: Partial<Horario>) => void }) {
  const diferentes = linha.diferentes ?? [];
  const trocar = (dia: string, mudanca: Partial<Horario> & { fechado?: boolean }) =>
    mudar({ diferentes: diferentes.map((d) => (d.dia === dia ? { ...d, ...mudanca } : d)) });
  const livres = DIAS_UTEIS.filter((d) => !diferentes.some((x) => x.dia === d));
  return (
    <div className="space-y-3 border-t pt-4">
      <AnimatePresence initial={false}>
        {DIAS_UTEIS.filter((d) => diferentes.some((x) => x.dia === d)).map((dia) => {
          const d = diferentes.find((x) => x.dia === dia)!;
          return (
            <Abre key={dia}>
              <div className="rounded-xl bg-brand/15 p-3" data-dia-diferente={dia}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">
                    {dia} <span className="font-normal text-muted-foreground">é diferente</span>
                  </p>
                  <button
                    type="button"
                    aria-label={`${dia} volta ao horário de sempre`}
                    onClick={() => mudar({ diferentes: diferentes.filter((x) => x.dia !== dia) })}
                    className="flex size-11 items-center justify-center rounded-full hover:bg-muted"
                  >
                    <XIcon className="size-4" aria-hidden="true" />
                  </button>
                </div>
                {!d.fechado && <PeriodoDoDia nome={dia} valor={d} mudar={(p) => trocar(dia, p)} />}
                <label className="mt-1 flex min-h-11 cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={d.fechado ?? false}
                    onChange={(e) => trocar(dia, { fechado: e.target.checked })}
                    className="size-5 accent-ink"
                  />
                  Não atendo na {dia.toLowerCase()}
                </label>
              </div>
            </Abre>
          );
        })}
      </AnimatePresence>
      {livres.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground">
            {diferentes.length ? "Mais algum dia diferente?" : "Algum dia tem outro horário? Toque nele."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {livres.map((dia) => (
              <button
                key={dia}
                type="button"
                aria-label={`${dia} tem outro horário`}
                onClick={() => mudar({ diferentes: [...diferentes, { dia, de: linha.de, ate: linha.ate }] })}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-dashed border-ring px-4 text-sm hover:border-solid hover:bg-background"
              >
                <PlusIcon className="size-3.5" aria-hidden="true" />
                {dia}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const emMinutos = (hora: string) => Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3));
const INICIO = PRIMEIRA_HORA * 60;
const TOTAL = 24 * 60 - INICIO;

/** A semana desenhada: uma coluna por dia, com as horas preenchidas. */
export function Semana({ horarios }: { horarios: Horario[] }) {
  const semana = semanaDe(horarios);
  const diferentes = horarios.flatMap((h) => h.diferentes?.map((d) => d.dia) ?? []);
  return (
    <div className="rounded-xl border bg-card p-4" aria-hidden="true" data-semana>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium">Sua semana fica assim</p>
        {diferentes.length > 0 && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2.5 rounded-sm bg-ink" />
            dia diferente
          </p>
        )}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {semana.map(({ dia, periodo }) => {
          const blocos = !periodo
            ? []
            : periodo.pausa
              ? [
                  { de: periodo.de, ate: periodo.pausa.de },
                  { de: periodo.pausa.ate, ate: periodo.ate },
                ]
              : [periodo];
          return (
            <div key={dia} className="min-w-0 text-center" data-dia={dia} data-aberto={Boolean(periodo)}>
              <p className={cn("text-xs", periodo ? "font-semibold" : "text-muted-foreground")}>{dia.slice(0, 3)}</p>
              <div className="relative mt-1.5 h-24 overflow-hidden rounded-md bg-muted/70">
                {blocos.map((b, i) => (
                  <motion.span
                    key={i}
                    initial={false}
                    animate={{
                      top: `${((emMinutos(b.de) - INICIO) / TOTAL) * 100}%`,
                      height: `${Math.max(0, ((emMinutos(b.ate) - emMinutos(b.de)) / TOTAL) * 100)}%`,
                    }}
                    transition={suave}
                    className={cn("absolute inset-x-0 rounded-sm", diferentes.includes(dia) ? "bg-ink" : "bg-brand")}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-[0.65rem] leading-tight tabular-nums">
                {periodo ? (
                  <>
                    {periodo.de}
                    <br />
                    {periodo.ate}
                  </>
                ) : (
                  <span className="text-muted-foreground">não</span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CampoDosHorarios({ r, mudar }: { r: Resposta | undefined; mudar: (r: Resposta) => void }) {
  const lista = r?.horarios ?? HORARIOS_INICIAIS;
  const horaMarcada = r?.opcoes?.includes(HORA_MARCADA) ?? false;
  const trocar = (i: number, mudanca: Partial<Horario>) =>
    mudar({ opcoes: r?.opcoes, horarios: lista.map((h, j) => (j === i ? { ...h, ...mudanca } : h)) });
  return (
    <div className="space-y-2.5">
      {lista.map((h, i) => (
        <div
          key={h.dias}
          className={cn("rounded-xl border bg-card transition-colors", h.aberto ? "border-ink" : "border-input")}
        >
          <button
            type="button"
            role="switch"
            aria-checked={h.aberto}
            onClick={() => trocar(i, { aberto: !h.aberto })}
            className="flex min-h-13 w-full items-center justify-between gap-3 rounded-xl px-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <span className="font-medium">{h.dias}</span>
            <span
              className={cn("relative h-6 w-11 rounded-full transition-colors", h.aberto ? "bg-ink" : "bg-ring/40")}
              aria-hidden="true"
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 size-5 rounded-full transition-transform",
                  h.aberto ? "translate-x-5 bg-brand" : "bg-white",
                )}
              />
            </span>
          </button>
          <AnimatePresence initial={false}>
            {h.aberto && (
              <Abre key="aberto">
                <div className="space-y-3 px-4 pb-4">
                  <PeriodoDoDia nome={h.dias} valor={h} mudar={(p) => trocar(i, p)} />
                  {h.dias === DE_SEGUNDA_A_SEXTA && <DiasDiferentes linha={h} mudar={(m) => trocar(i, m)} />}
                </div>
              </Abre>
            )}
          </AnimatePresence>
        </div>
      ))}
      <button
        type="button"
        role="checkbox"
        aria-checked={horaMarcada}
        onClick={() => mudar({ horarios: lista, opcoes: horaMarcada ? [] : [HORA_MARCADA] })}
        className={cn(
          "flex min-h-13 w-full items-center gap-3 rounded-xl border px-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
          horaMarcada ? "border-ink bg-brand/20" : "border-input bg-card hover:border-ring",
        )}
      >
        <span
          className={cn("size-5 shrink-0 rounded-md border", horaMarcada ? "border-ink bg-ink" : "border-ring/50")}
          aria-hidden="true"
        />
        {HORA_MARCADA}
      </button>
      <AnimatePresence initial={false}>
        {lista.some((h) => h.aberto) && (
          <Abre key="semana">
            <Semana horarios={lista} />
          </Abre>
        )}
      </AnimatePresence>
    </div>
  );
}

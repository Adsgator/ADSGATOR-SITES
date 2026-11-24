"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";

import { CampoDosHorarios } from "@/components/briefing/horarios";
import { SugestoesDaRegiao } from "@/components/briefing/cidades";
import { CampoDasCores } from "@/components/briefing/cores";
import { CampoDoEndereco } from "@/components/briefing/endereco";
import { ValorConhecido } from "@/components/briefing/valor-conhecido";
import { TopoDaPagina } from "@/components/briefing/topo-da-pagina";
import { iconeDaOpcao } from "@/lib/briefing/icones";
import { estilos, falasDaSensacao, temaDe } from "@/lib/briefing/temas";
import {
  cidadeDe,
  opcoesDa,
  type Briefing,
  type Pergunta,
  type Resposta,
  type Respostas,
} from "@/lib/briefing/regras";
import { cn } from "@/lib/utils";

// Um campo por tipo de pergunta. Todos recebem a resposta e avisam a mudança; o
// único estado próprio é o do que ainda está sendo digitado.

export type PropsDoCampo = {
  p: Pergunta;
  briefing: Briefing;
  respostas: Respostas;
  mudar: (r: Resposta) => void;
  /** Escolheu a opção única: avança sem precisar do botão. */
  escolheu: (r: Resposta) => void;
  comErro: boolean;
};

const estiloDoCampo =
  "w-full rounded-xl border border-input bg-card px-4 text-base outline-none transition-colors placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive";

/** Textarea que cresce com o texto. */
function TextoLongo({ valor, ...props }: { valor: string } & Omit<React.ComponentProps<"textarea">, "value">) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [valor]);
  return (
    <textarea ref={ref} value={valor} {...props} className={cn(estiloDoCampo, "resize-none py-3 leading-7", props.className)} />
  );
}

function Opcao({
  marcada,
  bloqueada,
  papel,
  onClick,
  explica,
  children,
}: {
  marcada: boolean;
  bloqueada?: boolean;
  papel: "radio" | "checkbox";
  onClick: () => void;
  /** Uma linha embaixo da opção, para quem está escolhendo. */
  explica?: string;
  children: string;
}) {
  const icone = iconeDaOpcao(children);
  return (
    <button
      type="button"
      role={papel}
      aria-label={children}
      aria-checked={marcada}
      disabled={bloqueada}
      onClick={onClick}
      className={cn(
        "flex min-h-13 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-base transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.99] disabled:opacity-40",
        marcada
          ? "border-ink bg-brand/20 shadow-[inset_0_0_0_1px_var(--ink)]"
          : "border-input bg-card hover:border-ring",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center border transition-colors",
          papel === "radio" ? "rounded-full" : "rounded-md",
          marcada ? "border-ink bg-ink text-brand" : "border-ring/50",
        )}
        aria-hidden="true"
      >
        {marcada && <CheckIcon className="size-3.5" strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1 leading-tight [overflow-wrap:anywhere]">
        {children}
        {explica && <span className="mt-0.5 block text-sm text-muted-foreground">{explica}</span>}
      </span>
      {/* O cursor da marca clica na opção escolhida, no lugar do ícone dela. */}
      {marcada ? (
        <span aria-hidden="true" className="brand-cursor cursor-clica mr-1 h-5 shrink-0 text-ink" />
      ) : (
        icone && createElement(icone, { className: "size-5 shrink-0 text-muted-foreground/70", "aria-hidden": true })
      )}
    </button>
  );
}

/** Campo com o botão de adicionar (a opção que não está na lista, a cidade). */
function Adicionar({ rotulo, aoAdicionar }: { rotulo: string; aoAdicionar: (texto: string) => void }) {
  const [texto, setTexto] = useState("");
  const adicionar = () => {
    if (!texto.trim()) return;
    aoAdicionar(texto.trim());
    setTexto("");
  };
  return (
    <div className="flex gap-2">
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          adicionar();
        }}
        // Quem digita e toca em Continuar sem tocar em Adicionar não perde o que escreveu.
        onBlur={adicionar}
        aria-label={rotulo}
        placeholder={rotulo}
        maxLength={300}
        enterKeyHint="done"
        className={cn(estiloDoCampo, "h-13")}
      />
      <button
        type="button"
        onClick={adicionar}
        aria-label={`Adicionar ${rotulo.toLowerCase()}`}
        className="inline-flex h-13 shrink-0 items-center gap-1.5 rounded-xl border border-ink/60 px-4 text-sm font-medium hover:bg-muted"
      >
        <PlusIcon className="size-4" aria-hidden="true" />
        Adicionar
      </button>
    </div>
  );
}

function Texto({ p, respostas, mudar, comErro }: PropsDoCampo) {
  return (
    <input
      aria-label={p.titulo}
      aria-invalid={comErro}
      value={respostas[p.id]?.valor ?? ""}
      onChange={(e) => mudar({ valor: e.target.value })}
      placeholder={p.exemplo}
      maxLength={1000}
      enterKeyHint="next"
      className={cn(estiloDoCampo, "h-14")}
    />
  );
}

function Longo({ p, respostas, mudar, comErro }: PropsDoCampo) {
  return (
    <TextoLongo
      aria-label={p.titulo}
      aria-invalid={comErro}
      valor={respostas[p.id]?.valor ?? ""}
      onChange={(e) => mudar({ valor: e.target.value })}
      placeholder={p.exemplo ?? "Conte do seu jeito"}
      maxLength={20000}
      rows={4}
    />
  );
}

function Escolha({ p, briefing, respostas, mudar, escolheu }: PropsDoCampo) {
  const marcada = respostas[p.id]?.opcoes?.[0];
  const opcoes = opcoesDa(p, briefing, respostas);
  const todas = marcada && !p.opcoesDe && !opcoes.includes(marcada) ? [...opcoes, marcada] : opcoes;
  return (
    <div className="space-y-2.5">
      <div role="radiogroup" aria-label={p.titulo} className="space-y-2.5">
        {todas.map((o) => (
          <Opcao key={o} papel="radio" marcada={marcada === o} onClick={() => escolheu({ opcoes: [o] })}>
            {o}
          </Opcao>
        ))}
      </div>
      {p.outra && <Adicionar rotulo={p.outra} aoAdicionar={(o) => mudar({ opcoes: [o] })} />}
    </div>
  );
}

function Multipla({ p, briefing, respostas, mudar }: PropsDoCampo) {
  const marcadas = respostas[p.id]?.opcoes ?? [];
  const opcoes = opcoesDa(p, briefing, respostas);
  const todas = [...opcoes, ...marcadas.filter((o) => !opcoes.includes(o))];
  const cheia = Boolean(p.max && marcadas.length >= p.max);
  const trocar = (o: string) =>
    mudar({ opcoes: marcadas.includes(o) ? marcadas.filter((x) => x !== o) : [...marcadas, o] });
  const acrescentar = (texto: string) => {
    const opcao = todas.find((x) => x.toLowerCase() === texto.toLowerCase()) ?? texto;
    if (!marcadas.includes(opcao)) mudar({ opcoes: [...marcadas, opcao] });
  };
  return (
    <div className="space-y-2.5">
      <div role="group" aria-label={p.titulo} className="grid gap-2.5 sm:grid-cols-2">
        {todas.map((o) => (
          <Opcao
            key={o}
            papel="checkbox"
            marcada={marcadas.includes(o)}
            bloqueada={cheia && !marcadas.includes(o)}
            onClick={() => trocar(o)}
            explica={p.papel === "sensacao" ? falasDaSensacao[o] : undefined}
          >
            {o}
          </Opcao>
        ))}
      </div>
      {p.outra && !cheia && <Adicionar rotulo={p.outra} aoAdicionar={acrescentar} />}
      {p.max && <Contagem marcadas={marcadas.length} max={p.max} />}
    </div>
  );
}

function Contagem({ marcadas, max }: { marcadas: number; max: number }) {
  return (
    <p className="text-sm text-muted-foreground" aria-live="polite">
      {marcadas} de {max}
    </p>
  );
}

function Confirmar({ p, respostas, mudar, escolheu, comErro }: PropsDoCampo) {
  const r = respostas[p.id];
  const outro = r?.opcoes?.includes("outro") ?? false;
  return (
    <div className="space-y-2.5">
      <ValorConhecido>{p.valorConhecido}</ValorConhecido>
      <div role="radiogroup" aria-label={p.titulo} className="space-y-2.5">
        <Opcao papel="radio" marcada={r?.opcoes?.includes("sim") ?? false} onClick={() => escolheu({ opcoes: ["sim"] })}>
          Sim, é isso mesmo
        </Opcao>
        <Opcao papel="radio" marcada={outro} onClick={() => mudar({ opcoes: ["outro"], valor: r?.valor ?? "", itens: r?.itens })}>
          {p.rotuloDoOutro ?? "É outro"}
        </Opcao>
      </div>
      {outro && p.tipo === "endereco" && <CampoDoEndereco r={r} mudar={mudar} />}
      {outro && p.tipo !== "endereco" && (
        <input
          autoFocus
          aria-label={p.rotuloDoOutro ?? "Escreva o certo"}
          aria-invalid={comErro}
          value={r?.valor ?? ""}
          onChange={(e) => mudar({ opcoes: ["outro"], valor: e.target.value })}
          placeholder={p.exemplo}
          maxLength={1000}
          enterKeyHint="next"
          className={cn(estiloDoCampo, "h-14")}
        />
      )}
    </div>
  );
}

function Etiquetas({ p, briefing, respostas, mudar }: PropsDoCampo) {
  const marcadas = respostas[p.id]?.opcoes ?? [];
  const adicionar = (texto: string) => {
    const novas = texto.split(/[,;\n]/).map((t) => t.trim());
    const unicas = [...new Set(novas)].filter((t) => t && !marcadas.includes(t));
    if (unicas.length) mudar({ opcoes: [...marcadas, ...unicas] });
  };
  return (
    <div className="space-y-3">
      {marcadas.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {marcadas.map((o) => (
            <li key={o} className="inline-flex min-h-11 max-w-full items-center gap-1 rounded-3xl bg-ink py-1 pr-1 pl-4 text-sm [overflow-wrap:anywhere] text-paper">
              {o}
              <button
                type="button"
                aria-label={`Tirar ${o}`}
                onClick={() => mudar({ opcoes: marcadas.filter((x) => x !== o) })}
                className="flex size-9 items-center justify-center rounded-full hover:bg-white/10"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <SugestoesDaRegiao
        cidade={p.sugereRegiao ? cidadeDe(briefing, respostas) : undefined}
        marcadas={marcadas}
        extras={p.opcoes ?? []}
        aoTocar={adicionar}
      />
      <Adicionar rotulo="Cidade, bairro ou estado" aoAdicionar={adicionar} />
    </div>
  );
}

function Detalhes({ p, briefing, respostas, mudar }: PropsDoCampo) {
  const itens = respostas[p.id]?.itens ?? {};
  return (
    <div className="space-y-5">
      {opcoesDa(p, briefing, respostas).map((o) => (
        <label key={o} className="block space-y-2">
          <span className="flex items-center gap-2 font-medium [overflow-wrap:anywhere]">
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full transition-colors",
                itens[o]?.trim() ? "bg-ink text-brand" : "bg-ring/25 text-transparent",
              )}
              aria-hidden="true"
            >
              <CheckIcon className="size-3" strokeWidth={3} />
            </span>
            {o}
          </span>
          <TextoLongo
            valor={itens[o] ?? ""}
            onChange={(e) => mudar({ itens: { ...itens, [o]: e.target.value } })}
            placeholder={p.exemplos?.[o] ?? "O que é e para quem serve"}
            maxLength={10000}
            rows={2}
          />
        </label>
      ))}
    </div>
  );
}

function Horarios({ p, respostas, mudar }: PropsDoCampo) {
  return <CampoDosHorarios r={respostas[p.id]} mudar={mudar} />;
}

const exemplosDeRede: Record<string, string> = {
  Instagram: "@seunegocio",
  Facebook: "O nome da página ou o link",
  TikTok: "@seunegocio",
  YouTube: "O nome do canal ou o link",
  "E-mail": "contato@seunegocio.com.br",
  "Outro telefone": "(00) 0000-0000",
};

function Redes({ p, respostas, mudar }: PropsDoCampo) {
  const itens = respostas[p.id]?.itens ?? {};
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(p.opcoes ?? []).map((o) => (
        <label key={o} className="block space-y-1.5">
          <span className="text-sm font-medium">{o}</span>
          <input
            value={itens[o] ?? ""}
            onChange={(e) => mudar({ itens: { ...itens, [o]: e.target.value } })}
            placeholder={p.exemplos?.[o] ?? exemplosDeRede[o]}
            maxLength={1000}
            autoCapitalize="none"
            className={cn(estiloDoCampo, "h-13")}
          />
        </label>
      ))}
    </div>
  );
}

function Duvidas({ p, respostas, mudar }: PropsDoCampo) {
  const itens = respostas[p.id]?.itens ?? {};
  const [abertas, setAbertas] = useState<string[]>(Object.keys(itens));
  const [novas, setNovas] = useState<string[]>(Object.keys(itens).filter((d) => !p.opcoes?.includes(d)));
  return (
    <div className="space-y-2.5">
      {[...(p.opcoes ?? []), ...novas].map((d) => {
        const aberta = abertas.includes(d);
        return (
          <div key={d} className={cn("rounded-xl border bg-card transition-colors", aberta ? "border-ink" : "border-input")}>
            <button
              type="button"
              aria-expanded={aberta}
              onClick={() => setAbertas(aberta ? abertas.filter((x) => x !== d) : [...abertas, d])}
              className="flex min-h-13 w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <span className="min-w-0 font-medium break-words">{d}</span>
              {itens[d]?.trim() ? (
                <CheckIcon
                  className="size-5 shrink-0 rounded-full bg-ink p-1 text-brand"
                  strokeWidth={4}
                  aria-label="respondida"
                  role="img"
                />
              ) : (
                <PlusIcon className={cn("size-4 shrink-0 transition-transform", aberta && "rotate-45")} aria-hidden="true" />
              )}
            </button>
            {aberta && (
              <div className="px-3 pb-3">
                <TextoLongo
                  aria-label={`Resposta para ${d}`}
                  valor={itens[d] ?? ""}
                  onChange={(e) => mudar({ itens: { ...itens, [d]: e.target.value } })}
                  placeholder="O que você responde"
                  maxLength={10000}
                  rows={2}
                />
              </div>
            )}
          </div>
        );
      })}
      {p.outra && (
        <Adicionar
          rotulo={p.outra}
          aoAdicionar={(d) => {
            if ([...(p.opcoes ?? []), ...novas].includes(d)) return;
            setNovas([...novas, d]);
            setAbertas([...abertas, d]);
          }}
        />
      )}
    </div>
  );
}

/** Cada estilo é um topo de página em miniatura, com a composição, a letra e as cores dele. */
function Estilos({ p, briefing, respostas, mudar }: PropsDoCampo) {
  const marcadas = respostas[p.id]?.opcoes ?? [];
  const cheia = Boolean(p.max && marcadas.length >= p.max);
  return (
    <div className="space-y-2.5">
      <div role="group" aria-label={p.titulo} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {estilos.map((e) => {
          const marcada = marcadas.includes(e.nome);
          return (
            <button
              key={e.nome}
              type="button"
              role="checkbox"
              aria-checked={marcada}
              aria-label={e.nome}
              disabled={cheia && !marcada}
              onClick={() => mudar({ opcoes: marcada ? marcadas.filter((x) => x !== e.nome) : [...marcadas, e.nome] })}
              className={cn(
                "relative overflow-hidden rounded-xl border-2 bg-card text-left transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.98] disabled:opacity-40",
                marcada ? "border-ink shadow-lg" : "border-transparent hover:border-ring/50",
              )}
            >
              <span className="block h-28 overflow-hidden" aria-hidden="true" style={{ background: e.fundo }}>
                <span className="block w-[160%] origin-top-left scale-[0.625]">
                  <TopoDaPagina tema={temaDe([e.nome])} titulo={e.nome} comBotao={false} icone={briefing.icone} className="min-h-45" />
                </span>
              </span>
              <span className="block px-3 py-2.5 leading-tight">
                <span className="block text-sm font-medium">{e.nome}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{e.fala}</span>
              </span>
              {marcada && (
                <CheckIcon
                  className="absolute top-2 right-2 size-6 rounded-full bg-ink p-1 text-brand"
                  strokeWidth={3}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
      {p.max && <Contagem marcadas={marcadas.length} max={p.max} />}
    </div>
  );
}

function Cores({ p, respostas, mudar }: PropsDoCampo) {
  return <CampoDasCores p={p} r={respostas[p.id]} mudar={mudar} />;
}

const porTipo = {
  texto: Texto,
  longo: Longo,
  escolha: Escolha,
  multipla: Multipla,
  confirmar: Confirmar,
  endereco: Confirmar,
  etiquetas: Etiquetas,
  detalhes: Detalhes,
  horarios: Horarios,
  redes: Redes,
  duvidas: Duvidas,
  cores: Cores,
  estilo: Estilos,
} satisfies Record<Pergunta["tipo"], React.ComponentType<PropsDoCampo>>;

export function CampoDaPergunta(props: PropsDoCampo) {
  const Campo = porTipo[props.p.tipo];
  return <Campo {...props} />;
}

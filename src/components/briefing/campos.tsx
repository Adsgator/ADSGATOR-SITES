"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";

import { Seletor } from "@/components/checkout/campo";
import { estilos } from "@/lib/briefing/estilos";
import {
  HORA_MARCADA,
  HORARIOS_INICIAIS,
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
  children,
}: {
  marcada: boolean;
  bloqueada?: boolean;
  papel: "radio" | "checkbox";
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role={papel}
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
      <span className="min-w-0 break-words">{children}</span>
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
        maxLength={120}
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
      maxLength={300}
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
      maxLength={5000}
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
      <p className="rounded-xl border-l-4 border-brand bg-card px-5 py-4 font-heading text-xl break-words sm:text-2xl">
        {p.valorConhecido}
      </p>
      <div role="radiogroup" aria-label={p.titulo} className="space-y-2.5">
        <Opcao papel="radio" marcada={r?.opcoes?.includes("sim") ?? false} onClick={() => escolheu({ opcoes: ["sim"] })}>
          Sim, é isso mesmo
        </Opcao>
        <Opcao papel="radio" marcada={outro} onClick={() => mudar({ opcoes: ["outro"], valor: r?.valor ?? "" })}>
          {p.rotuloDoOutro ?? "É outro"}
        </Opcao>
      </div>
      {outro && (
        <input
          autoFocus
          aria-label={p.rotuloDoOutro ?? "Escreva o certo"}
          aria-invalid={comErro}
          value={r?.valor ?? ""}
          onChange={(e) => mudar({ opcoes: ["outro"], valor: e.target.value })}
          placeholder={p.exemplo}
          maxLength={300}
          enterKeyHint="next"
          className={cn(estiloDoCampo, "h-14")}
        />
      )}
    </div>
  );
}

function Etiquetas({ p, respostas, mudar }: PropsDoCampo) {
  const marcadas = respostas[p.id]?.opcoes ?? [];
  const sugestoes = (p.opcoes ?? []).filter((o) => !marcadas.includes(o));
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
            <li key={o} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-ink pr-1 pl-4 text-sm text-paper">
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
      {sugestoes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {sugestoes.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => adicionar(o)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-dashed border-ring px-4 text-sm hover:border-solid hover:bg-card"
            >
              <PlusIcon className="size-3.5" aria-hidden="true" />
              {o}
            </button>
          ))}
        </div>
      )}
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
          <span className="flex items-center gap-2 font-medium">
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
            placeholder="O que é e para quem serve"
            maxLength={2000}
            rows={2}
          />
        </label>
      ))}
    </div>
  );
}

/** De meia em meia hora, das 5:00 às 23:30. */
const horas = Array.from({ length: 38 }, (_, i) => {
  const minutos = 5 * 60 + i * 30;
  return `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;
});

function Horarios({ p, respostas, mudar }: PropsDoCampo) {
  const r = respostas[p.id];
  const lista = r?.horarios ?? HORARIOS_INICIAIS;
  const marcada = r?.opcoes?.includes(HORA_MARCADA) ?? false;
  const trocar = (i: number, mudanca: Partial<(typeof lista)[number]>) =>
    mudar({ ...r, horarios: lista.map((h, j) => (j === i ? { ...h, ...mudanca } : h)) });
  return (
    <div className="space-y-2.5">
      {lista.map((h, i) => (
        <div key={h.dias} className={cn("rounded-xl border bg-card transition-colors", h.aberto ? "border-ink" : "border-input")}>
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
          {h.aberto && (
            <div className="flex items-center gap-2 px-4 pb-4 text-sm">
              <span>das</span>
              <div className="flex-1">
                <Seletor aria-label={`${h.dias}, começa`} value={h.de} onChange={(e) => trocar(i, { de: e.target.value })}>
                  {horas.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </Seletor>
              </div>
              <span>às</span>
              <div className="flex-1">
                <Seletor aria-label={`${h.dias}, termina`} value={h.ate} onChange={(e) => trocar(i, { ate: e.target.value })}>
                  {horas.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </Seletor>
              </div>
            </div>
          )}
        </div>
      ))}
      <Opcao
        papel="checkbox"
        marcada={marcada}
        onClick={() => mudar({ ...r, horarios: lista, opcoes: marcada ? [] : [HORA_MARCADA] })}
      >
        {HORA_MARCADA}
      </Opcao>
    </div>
  );
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
            placeholder={exemplosDeRede[o]}
            maxLength={300}
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
                  maxLength={2000}
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

function Estilos({ p, respostas, mudar }: PropsDoCampo) {
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
                "relative overflow-hidden rounded-xl border-2 text-left transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.98] disabled:opacity-40",
                marcada ? "border-ink shadow-lg" : "border-transparent hover:border-ring/50",
              )}
            >
              <span className="block space-y-2.5 p-4" style={{ background: e.fundo, color: e.tinta }}>
                <span
                  className={cn("flex h-5 items-center leading-none", e.maiusculas ? "text-sm tracking-widest uppercase" : "text-lg")}
                  style={{ fontFamily: e.fonte }}
                >
                  {e.nome}
                </span>
                <span className="block h-1.5 w-3/4 rounded-full bg-current opacity-20" />
                <span className="block h-1.5 w-1/2 rounded-full bg-current opacity-20" />
                <span className="block h-5 w-16" style={{ background: e.destaque, borderRadius: e.raio }} />
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

const porTipo = {
  texto: Texto,
  longo: Longo,
  escolha: Escolha,
  multipla: Multipla,
  confirmar: Confirmar,
  etiquetas: Etiquetas,
  detalhes: Detalhes,
  horarios: Horarios,
  redes: Redes,
  duvidas: Duvidas,
  estilo: Estilos,
} satisfies Record<Pergunta["tipo"], React.ComponentType<PropsDoCampo>>;

export function CampoDaPergunta(props: PropsDoCampo) {
  const Campo = porTipo[props.p.tipo];
  return <Campo {...props} />;
}

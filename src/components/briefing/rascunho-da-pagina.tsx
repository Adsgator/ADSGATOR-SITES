"use client";

import { useEffect, useRef } from "react";
import { CheckIcon, ClockIcon, MapPinIcon, PlusIcon, HeartIcon } from "lucide-react";
import { animate, AnimatePresence, motion } from "motion/react";

import { Traco, TopoDaPagina } from "@/components/briefing/topo-da-pagina";
import { numeroEmPartes } from "@/lib/briefing/fatos";
import { iconesDoNegocio, type IconeDoNegocio } from "@/lib/briefing/icones";
import { emTexto, visiveis, type Briefing, type Papel, type Respostas } from "@/lib/briefing/regras";
import { temaDe, type Tema } from "@/lib/briefing/temas";
import { cn } from "@/lib/utils";

// O desenho da página que vai tomando forma com as respostas: as palavras são as da
// pessoa, e o estilo, as cores e as sensações mudam a composição. Antes das respostas,
// é uma planta (tracejada, com o nome de cada parte). Na janela, a página rola até a
// parte que está sendo respondida. É um esboço, e quem usa diz isso na legenda.

export type Blocos = {
  nome?: string;
  whatsapp?: boolean;
  servicos?: string[];
  /** O que a pessoa explicou de cada serviço. */
  detalhes?: Record<string, string>;
  principal?: string;
  passos?: string[];
  numeros?: [string, string][];
  facilita?: string[];
  diferente?: string;
  preco?: string;
  redes?: string[];
  registro?: string;
  dominio?: string;
  elogio?: string;
  /** A frase de quem procura, ou os casos que a pessoa quer atender. */
  clientes?: string[];
  duvidas?: string[];
  historia?: string;
  lugar?: string;
  /** As cidades onde atende. */
  atende?: string[];
  horarios?: string;
  estilos?: string[];
  cores?: string[];
  sensacoes?: string[];
  icone?: IconeDoNegocio;
  /** As partes que este briefing pergunta (as outras nem aparecem na planta). */
  partes?: Papel[];
};

export function blocosDasRespostas(briefing: Briefing, respostas: Respostas): Blocos {
  const prontas = visiveis(briefing, respostas).filter((p) => p.papel && emTexto(p, briefing, respostas).length);
  const com = (papel: Papel) => prontas.find((p) => p.papel === papel);
  const linhas = (papel: Papel) => {
    const p = com(papel);
    return p ? emTexto(p, briefing, respostas) : undefined;
  };
  // Uma resposta de "não tenho" não vira bloco.
  const itens = (papel: Papel) => {
    const p = com(papel);
    const r = p && respostas[p.id];
    return r && !r.nada ? Object.entries(r.itens ?? {}).filter(([, v]) => v.trim()) : [];
  };
  const opcoes = (papel: Papel) => {
    const p = com(papel);
    return (p && respostas[p.id].opcoes) ?? [];
  };
  const horarios = linhas("horarios");
  const passos = itens("passos");
  const numeros = itens("numeros").filter(([k]) => !/link/i.test(k));
  return {
    nome: linhas("nome")?.[0],
    whatsapp: Boolean(com("whatsapp")),
    servicos: prontas.filter((p) => p.papel === "servicos").flatMap((p) => respostas[p.id].opcoes ?? []),
    detalhes: Object.assign({}, ...visiveis(briefing, respostas).filter((p) => p.tipo === "detalhes" && p.opcoesDe).map((p) => respostas[p.id]?.itens ?? {})),
    principal: linhas("principal")?.[0],
    passos: passos.length ? passos.map(([, v]) => v.trim()) : undefined,
    numeros: numeros.length ? (numeros.map(([k, v]) => (k === "Outro número" ? numeroEmPartes(v) : [v.trim(), k[0].toLowerCase() + k.slice(1)])) as [string, string][]) : undefined,
    facilita: opcoes("facilita"),
    diferente: linhas("diferente")?.[0],
    preco: linhas("preco")?.[0],
    redes: itens("redes").map(([k]) => k),
    registro: com("registro") && !respostas[com("registro")!.id].nada ? linhas("registro")?.[0] : undefined,
    dominio: linhas("dominio")?.[0],
    partes: visiveis(briefing, respostas).flatMap((p) => (p.papel ? [p.papel] : [])),
    elogio: linhas("elogio")?.[0],
    clientes: com("clientes") && (opcoes("clientes").length ? opcoes("clientes") : linhas("clientes")),
    duvidas: itens("duvidas").map(([k]) => k),
    historia: linhas("historia")?.[0],
    lugar: linhas("lugar")?.[0],
    atende: prontas.filter((p) => p.tipo === "etiquetas" && p.papel === "lugar").map((p) => respostas[p.id].opcoes)[0],
    horarios: horarios && (horarios.length > 1 ? "Horários da semana" : horarios[0]),
    estilos: opcoes("estilo"),
    cores: opcoes("cores"),
    sensacoes: opcoes("sensacao"),
    icone: briefing.icone,
  };
}

export type Passeio = { para: "topo" | "fim"; segundos: number };

const entrada = {
  initial: { opacity: 0, y: 14, filter: "blur(5px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/** Uma parte da página: planta tracejada até a resposta vir. */
export function Parte({
  papel,
  foco,
  rotulo,
  ativa,
  tema,
  planta,
  refinado,
  nome,
  faixa,
  comTitulo,
  children,
}: {
  papel: Papel[];
  foco?: Papel;
  rotulo: string;
  ativa: boolean;
  tema: Tema;
  /** O esqueleto que aparece antes da resposta. */
  planta: React.ReactNode;
  refinado?: boolean;
  /** O título da seção, quando a página está refinada. */
  nome?: string;
  /** Com o título sempre, e não só na página refinada. */
  comTitulo?: boolean;
  /** Seção com o fundo de apoio, quando a página está refinada. */
  faixa?: boolean;
  children: React.ReactNode;
}) {
  const emFoco = foco !== undefined && papel.includes(foco);
  return (
    <section
      className={cn("relative transition-all duration-700", refinado ? "px-5 py-6" : "px-4 py-3.5")}
      style={{ background: refinado && faixa ? `color-mix(in oklab, ${tema.apoio} 45%, ${tema.fundo})` : undefined }}
      data-parte={papel[0]}
      data-ativa={ativa}
      data-em-foco={emFoco || undefined}
    >
      {(refinado || comTitulo) && nome && ativa && (
        <motion.div
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="mb-3 space-y-1.5"
        >
          <p
            className={cn("text-[0.95rem] leading-tight", tema.maiusculas && "uppercase", tema.italico && "italic")}
            style={{ fontFamily: tema.fonte, fontWeight: tema.peso }}
          >
            {nome}
          </p>
          <span className="block h-0.5 w-7" style={{ background: tema.destaque, borderRadius: tema.raio }} />
        </motion.div>
      )}
      {emFoco && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-1 rounded-lg"
          style={{ boxShadow: `inset 0 0 0 1.5px ${tema.destaque}` }}
        />
      )}
      <AnimatePresence mode="wait" initial={false}>
        {ativa ? (
          <motion.div key="cheia" {...entrada} exit={{ opacity: 0 }}>
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="planta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative rounded-md border border-dashed p-2.5 pt-4"
            style={{ borderColor: `color-mix(in oklab, ${tema.tinta} 26%, transparent)` }}
          >
            <span
              className="absolute -top-2 left-2 px-1.5 font-mono text-[0.58rem] transition-colors duration-700"
              style={{ background: tema.fundo, color: `color-mix(in oklab, ${tema.tinta} 70%, ${tema.fundo})` }}
            >
              {rotulo}
            </span>
            {planta}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** O começo do texto, sem cortar palavra. */
export const trecho = (texto: string, limite: number) =>
  texto.length > limite ? `${texto.slice(0, limite).replace(/\s+\S*$/, "")}…` : texto;

/** Os 3 quadrinhos de uma planta de colunas. */
export function Quadros({ n, cor, altura }: { n: number; cor: string; altura: string }) {
  return (
    <span className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className={cn("rounded-sm", altura)} style={{ background: cor, opacity: 0.1 }} />
      ))}
    </span>
  );
}

export function RascunhoDaPagina({
  blocos,
  foco,
  passeio,
  refinado,
  janela,
  altura = "h-[25rem]",
  className,
}: {
  blocos: Blocos;
  /** A parte que está sendo respondida. */
  foco?: Papel;
  /** A página rola devagar até o fim ou de volta ao topo (no lugar do foco). */
  passeio?: Passeio;
  /** Depois do toque da Adsgator: respiro, luz, títulos e rodapé. */
  refinado?: boolean;
  /** Mostra a página numa janela, que rola até a parte em foco. */
  janela?: boolean;
  altura?: string;
  className?: string;
}) {
  const tema = temaDe(blocos.estilos, blocos.cores);
  const { tinta } = tema;
  const cartao: React.CSSProperties = {
    borderRadius: tema.raio,
    background: tema.apoio,
    ...(refinado && { boxShadow: `0 10px 22px -16px color-mix(in oklab, ${tema.tinta} 70%, transparent), inset 0 0 0 1px color-mix(in oklab, ${tema.tinta} 7%, transparent)` }),
  };
  const reto = tema.raio === "0rem";
  const titulo = { fontFamily: tema.fonte, fontWeight: tema.peso, fontStyle: tema.italico ? "italic" : undefined };
  const Icone = blocos.icone ? iconesDoNegocio[blocos.icone] : undefined;
  const servicos = blocos.servicos ?? [];
  // O principal vem primeiro e maior.
  const ordenados = blocos.principal ? [blocos.principal, ...servicos.filter((s) => s !== blocos.principal)] : servicos;

  const nota = blocos.numeros?.find(([, k]) => /nota/i.test(k))?.[0];
  const pergunta = (papel: Papel) => blocos.partes?.includes(papel) ?? false;
  const chamada = blocos.detalhes?.[ordenados[0]]?.trim();

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

  return (
    <div
      aria-hidden="true"
      data-rascunho
      className={cn(
        "overflow-hidden rounded-2xl border border-ink/10 [overflow-wrap:anywhere] shadow-[0_30px_60px_-35px_rgb(31_39_27/0.6)] transition-colors duration-700",
        className,
      )}
      style={{ background: tema.fundo, color: tinta }}
    >
      {/* A barra do navegador. */}
      <div className="relative z-10 flex items-center gap-2 border-b border-ink/10 bg-[#f4f3ee] px-3 py-2 text-ink">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1.5 rounded-full bg-ink/20" />
          ))}
        </span>
        <span className="flex-1 truncate rounded-full bg-white px-2.5 py-0.5 text-center text-[0.58rem] text-ink/60">
          {blocos.dominio ?? blocos.nome ?? "a sua página"}
        </span>
      </div>
      <div ref={moldura} className={cn("relative overflow-hidden", janela && altura)} data-janela={janela || undefined}>
        <div ref={folha} className="relative">
          {/* Cabeçalho */}
          <div
            className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-3 transition-colors duration-700"
            style={{ color: tema.topo === "cheio" ? tema.sobre : tinta }}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              {Icone && <Icone className="size-3.5 shrink-0" />}
              <span className={cn("truncate text-[0.62rem]", tema.maiusculas && "tracking-widest uppercase")} style={titulo}>
                {blocos.nome ?? "Seu negócio"}
              </span>
            </span>
            <span className="flex gap-1.5">
              {[12, 16].map((w) => (
                <span key={w} className="h-1 self-center rounded-full bg-current opacity-30" style={{ width: w }} />
              ))}
              <span
                className="h-3 w-7"
                style={{ background: tema.topo === "cheio" ? tema.sobre : tema.destaque, borderRadius: tema.raio }}
              />
            </span>
          </div>

          {/* Topo */}
          <div data-parte="nome" data-ativa={Boolean(blocos.nome)} data-em-foco={["nome", "whatsapp", "principal", "estilo", "cores", "sensacao", "dominio"].includes(foco ?? "") || undefined}>
            <TopoDaPagina
              tema={tema}
              titulo={trecho(blocos.principal ?? servicos[0] ?? blocos.nome ?? "A mensagem principal", 60)}
              chamada={chamada && trecho(chamada, 90)}
              className="pt-12"
              lugar={blocos.atende?.[0] && trecho(blocos.atende[0], 26)}
              prova={nota && nota.length <= 6 ? nota : undefined}
              comBotao={Boolean(blocos.whatsapp)}
              icone={blocos.icone}
              sensacoes={blocos.sensacoes}
              refinado={refinado}
            />
          </div>

          <Parte
            papel={["numeros"]} refinado={refinado} faixa
            foco={foco}
            rotulo="os seus números"
            ativa={Boolean(blocos.numeros)}
            tema={tema}
            planta={<Quadros n={3} cor={tinta} altura="h-5" />}
          >
            <div className="flex justify-around gap-2 text-center">
              {blocos.numeros?.slice(0, 3).map(([valor, nome]) => (
                <span key={nome} className="min-w-0">
                  <span className="block truncate text-base leading-tight lining-nums" style={{ ...titulo, color: tema.destaque }}>
                    {valor}
                  </span>
                  <span className="block text-[0.56rem] leading-tight opacity-70">{nome}</span>
                </span>
              ))}
            </div>
          </Parte>

          <Parte
            papel={["servicos", "principal"]} refinado={refinado} nome="O que eu faço"
            foco={foco}
            rotulo="o que você oferece"
            ativa={ordenados.length > 0}
            tema={tema}
            planta={<Quadros n={2} cor={tinta} altura="h-10" />}
          >
            <div className="grid grid-cols-2 gap-2">
              {ordenados.slice(0, 5).map((s, i) => (
                <motion.div
                  layout
                  key={s}
                  className={cn("min-w-0 space-y-1.5 p-2.5 transition-colors duration-700", i === 0 && (blocos.principal || ordenados.length % 2) && "col-span-2")}
                  style={i === 0 && blocos.principal ? { borderRadius: tema.raio, background: tema.destaque, color: tema.sobre } : cartao}
                >
                  <p className="truncate text-[0.66rem]" style={titulo}>
                    {s}
                  </p>
                  {blocos.detalhes?.[s]?.trim() ? (
                    <p className="line-clamp-3 text-[0.56rem] leading-snug opacity-80">{blocos.detalhes[s]}</p>
                  ) : (
                    <>
                      <Traco largura="88%" cor="currentColor" />
                      <Traco largura="60%" cor="currentColor" />
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </Parte>

          {(blocos.preco || pergunta("preco")) && (
            <Parte papel={["preco"]} refinado={refinado} nome="Valores" foco={foco} rotulo="os valores" ativa={Boolean(blocos.preco)} tema={tema} planta={<Traco largura="55%" cor={tinta} forte />}>
              <p className="line-clamp-3 px-3 py-2.5 text-[0.66rem] leading-snug" style={cartao}>
                {blocos.preco && trecho(blocos.preco, 140)}
              </p>
            </Parte>
          )}

          {pergunta("facilita") && (
            <Parte
              papel={["facilita"]} refinado={refinado}
              foco={foco}
              rotulo="as facilidades"
              ativa={Boolean(blocos.facilita?.length)}
              tema={tema}
              planta={<Quadros n={3} cor={tinta} altura="h-4" />}
            >
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[0.62rem] leading-snug">
                {blocos.facilita?.slice(0, 6).map((f) => (
                  <li key={f} className="flex items-start gap-1.5">
                    <CheckIcon className="mt-px size-3 shrink-0" strokeWidth={3} style={{ color: tema.destaque }} />
                    <span className="line-clamp-2 min-w-0">{f}</span>
                  </li>
                ))}
              </ul>
            </Parte>
          )}

          <Parte
            papel={["clientes"]} refinado={refinado} faixa
            foco={foco}
            rotulo="para quem é"
            ativa={Boolean(blocos.clientes?.length)}
            tema={tema}
            planta={
              <span className="block space-y-1.5">
                <Traco largura="60%" cor={tinta} forte />
                <Traco largura="90%" cor={tinta} />
              </span>
            }
          >
            {blocos.clientes?.length === 1 ? (
              // A mensagem de quem chega, sem o texto: é conversa, e não vai para a página.
              <span className="flex w-4/5 flex-col gap-1.5 p-3" style={{ borderRadius: "0.9rem 0.9rem 0.9rem 0.2rem", background: tema.apoio }}>
                <Traco largura="88%" cor={tinta} forte />
                <Traco largura="64%" cor={tinta} />
              </span>
            ) : (
              <ul className="flex flex-wrap gap-1.5">
                {blocos.clientes?.map((c) => (
                  <li
                    key={c}
                    className="border px-2 py-1 text-[0.6rem]"
                    style={{ borderRadius: reto ? "0" : "999px", borderColor: tema.destaque }}
                  >
                    {trecho(c, 60)}
                  </li>
                ))}
              </ul>
            )}
          </Parte>

          <Parte
            papel={["passos"]} refinado={refinado} nome="Como funciona"
            foco={foco}
            rotulo="como funciona"
            ativa={Boolean(blocos.passos)}
            tema={tema}
            planta={<Quadros n={3} cor={tinta} altura="h-8" />}
          >
            <ol className="space-y-2">
              {blocos.passos?.slice(0, 3).map((texto, i) => (
                <li key={i} className="flex items-start gap-2 text-[0.64rem] leading-snug">
                  <span
                    className="flex size-4.5 shrink-0 items-center justify-center text-[0.56rem] font-bold"
                    style={{ background: tema.destaque, color: tema.sobre, borderRadius: reto ? "0" : "999px" }}
                  >
                    {i + 1}
                  </span>
                  <span className="line-clamp-2 min-w-0 pt-0.5">{texto}</span>
                </li>
              ))}
            </ol>
          </Parte>

          {pergunta("diferente") && (
            <Parte
              papel={["diferente"]} refinado={refinado}
              foco={foco}
              rotulo="o seu diferencial"
              ativa={Boolean(blocos.diferente)}
              tema={tema}
              planta={
                <span className="block space-y-1.5">
                  <Traco largura="72%" cor={tinta} forte />
                  <Traco largura="48%" cor={tinta} />
                </span>
              }
            >
              <div className="p-3.5" style={{ borderRadius: tema.raio, background: tema.destaque, color: tema.sobre }}>
                <p className="line-clamp-4 text-[0.78rem] leading-snug text-balance" style={titulo}>
                  {blocos.diferente && trecho(blocos.diferente, 150)}
                </p>
              </div>
            </Parte>
          )}

          <Parte
            papel={["elogio"]} refinado={refinado} nome="O jeito de atender" faixa
            foco={foco}
            rotulo="o que falam de você"
            ativa={Boolean(blocos.elogio)}
            tema={tema}
            planta={<Traco largura="80%" cor={tinta} forte />}
          >
            <div className="p-3" style={cartao}>
              {/* Sem o texto nem aspas: elogio contado pela pessoa não vira depoimento. */}
              <HeartIcon className="size-4" style={{ color: tema.destaque, fill: tema.destaque }} />
              <span className="mt-2.5 block space-y-1.5">
                <Traco largura="92%" cor={tinta} forte />
                <Traco largura="58%" cor={tinta} />
              </span>
            </div>
          </Parte>

          <Parte
            papel={["historia"]} refinado={refinado} nome="Quem está por trás"
            foco={foco}
            rotulo="a sua história"
            ativa={Boolean(blocos.historia)}
            tema={tema}
            planta={
              <span className="flex items-center gap-2">
                <span className="size-7 shrink-0 rounded-full" style={{ background: tinta, opacity: 0.1 }} />
                <span className="flex-1 space-y-1.5">
                  <Traco largura="50%" cor={tinta} forte />
                  <Traco largura="88%" cor={tinta} />
                </span>
              </span>
            }
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 size-9 shrink-0"
                style={{ borderRadius: reto ? "0" : "999px", background: `linear-gradient(150deg, ${tema.apoio}, ${tema.destaque})` }}
              />
              <p className="line-clamp-4 min-w-0 text-[0.64rem] leading-relaxed">{blocos.historia && trecho(blocos.historia, 170)}</p>
            </div>
          </Parte>

          <Parte
            papel={["duvidas"]} refinado={refinado} nome="Dúvidas de sempre" faixa
            foco={foco}
            rotulo="as dúvidas respondidas"
            ativa={Boolean(blocos.duvidas?.length)}
            tema={tema}
            planta={
              <span className="block space-y-2">
                <Traco largura="90%" cor={tinta} />
                <Traco largura="76%" cor={tinta} />
              </span>
            }
          >
            <div className="space-y-1.5">
              {blocos.duvidas?.slice(0, 3).map((d) => (
                <p key={d} className="flex items-center justify-between gap-2 px-2.5 py-2 text-[0.62rem]" style={cartao}>
                  <span className="truncate">{d}</span>
                  <PlusIcon className="size-2.5 shrink-0" style={{ color: tema.destaque }} />
                </p>
              ))}
            </div>
          </Parte>

          <Parte
            papel={["lugar", "horarios", "redes", "registro"]} refinado={refinado} nome="Onde e quando"
            foco={foco}
            rotulo="onde e quando"
            ativa={Boolean(blocos.lugar || blocos.horarios || blocos.redes?.length || blocos.registro)}
            tema={tema}
            planta={<Quadros n={2} cor={tinta} altura="h-6" />}
          >
            <div className="space-y-1.5 border-t pt-3 text-[0.62rem]" style={{ borderColor: `color-mix(in oklab, ${tinta} 18%, transparent)` }}>
              {blocos.lugar && (
                <p className="flex items-center gap-1.5">
                  <MapPinIcon className="size-3 shrink-0" style={{ color: tema.destaque }} />
                  <span className="truncate">{blocos.lugar}</span>
                </p>
              )}
              {blocos.horarios && (
                <p className="flex items-center gap-1.5">
                  <ClockIcon className="size-3 shrink-0" style={{ color: tema.destaque }} />
                  <span className="truncate">{blocos.horarios}</span>
                </p>
              )}
              {blocos.redes && blocos.redes.length > 0 && (
                <p className="flex flex-wrap gap-1.5 pt-1">
                  {blocos.redes.map((r) => (
                    <span key={r} className="px-2 py-0.5" style={{ borderRadius: "999px", background: tema.apoio }}>
                      {r}
                    </span>
                  ))}
                </p>
              )}
              {blocos.registro && <p className="pt-1 opacity-70">{trecho(blocos.registro, 70)}</p>}
            </div>
          </Parte>
        </div>
      </div>
    </div>
  );
}

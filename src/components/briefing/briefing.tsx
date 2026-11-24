"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CloudCheckIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { BrandLogo } from "@/components/brand";
import { CampoDaPergunta } from "@/components/briefing/campos";
import { Desenho, desenhoDe, LegendaDoDesenho } from "@/components/briefing/desenho";
import { Olho } from "@/components/briefing/olho";
import { blocosDasRespostas } from "@/components/briefing/rascunho-da-pagina";
import { TopoDaPagina } from "@/components/briefing/topo-da-pagina";
import { Abertura, Fim, Material, OutroAparelho, Passo, Revisao, Volta } from "@/components/briefing/telas";
import { Eyebrow } from "@/components/eyebrow";
import { FundoVivo } from "@/components/fundo-vivo";
import {
  problema,
  progresso,
  respondida,
  visiveis,
  type Briefing,
  type Papel,
  type Resposta,
  type Respostas,
} from "@/lib/briefing/regras";
import type { Exemplo } from "@/lib/briefing/amostra-preenchida";
import { guardarAmostra, lerAmostra, type Guardado } from "@/lib/briefing/guardado-da-amostra";
import { encontroDosEstilos, fraseDoVisual, temaDe } from "@/lib/briefing/temas";
import { MINIMO_COLADO, type Colados } from "@/lib/briefing/sinais";
import { cn } from "@/lib/utils";

// O briefing: uma pergunta por tela, com o que vem depois dependendo da resposta
// (src/lib/briefing/regras.ts). Cada resposta é guardada na hora; quem volta
// continua de onde parou. O botão Voltar do celular leva à pergunta anterior, não
// para fora do briefing.
// Nesta amostra, as respostas ficam só neste navegador (localStorage); na versão
// final, ficam no painel (plano geral, Parte 5, decisão 1 A).

type Tela =
  | { tipo: "aparelho" | "abertura" | "volta" | "revisao" | "material" | "fim" }
  // daRevisao: o que já faltava quando a pessoa abriu a edição (não é cobrado nela).
  | { tipo: "pergunta"; id: string; daRevisao?: string[] }
  | { tipo: "passo"; secao: number };

const semAssinatura = () => () => {};

/** Só depois de montar no navegador, porque o começo depende do que está guardado nele. */
type Comeco = "normal" | "aparelho" | "revisao" | "material" | "fim";

export function BriefingDaAmostra(props: { briefing: Briefing; comeco: Comeco; exemplo?: Exemplo }) {
  const noNavegador = useSyncExternalStore(semAssinatura, () => true, () => false);
  return noNavegador ? <Player {...props} /> : <div className="min-h-dvh" />;
}

function Player({ briefing, comeco, exemplo }: { briefing: Briefing; comeco: Comeco; exemplo?: Exemplo }) {
  // O exemplo preenchido recomeça inteiro a cada vez que abre.
  const [guardado] = useState(() =>
    exemplo ? { ...exemplo, enviado: false, materialMandado: false } : lerAmostra(briefing.slug),
  );
  useEffect(() => {
    if (exemplo) guardarAmostra(briefing.slug, { ...exemplo, enviado: false });
  }, [briefing.slug, exemplo]);
  const [respostas, setRespostas] = useState(guardado.respostas);
  const [enviado, setEnviado] = useState(guardado.enviado);
  const [materialMandado, setMaterialMandado] = useState(guardado.materialMandado ?? false);
  const [colados, setColados] = useState<Colados>(guardado.colados);
  const [salvo, setSalvo] = useState(false);
  const [vendo, setVendo] = useState(false);
  const [jaViu, setJaViu] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [direcao, setDirecao] = useState(1);
  const [tela, setTela] = useState<Tela>(() => {
    if (comeco !== "normal") return { tipo: comeco };
    return inicio(guardado, briefing);
  });
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined);

  const lista = visiveis(briefing, respostas);
  const { feitas, total, porcento } = progresso(briefing, respostas);

  function guardar(novas: Respostas, mais: { enviado?: boolean; colados?: Colados; materialMandado?: boolean } = {}) {
    setRespostas(novas);
    setSalvo(guardarAmostra(briefing.slug, { respostas: novas, enviado, colados, materialMandado, ...mais }));
  }

  /** Um texto longo chegou de uma vez (sinais.ts). */
  function chegouDeUmaVez(id: string, texto: string) {
    if (texto.trim().length < MINIMO_COLADO || colados[id]?.includes(texto)) return;
    const novos = { ...colados, [id]: [...(colados[id] ?? []), texto.slice(0, 20000)].slice(-5) };
    setColados(novos);
    guardarAmostra(briefing.slug, { respostas, enviado, colados: novos, materialMandado });
  }

  function ir(destino: Tela, sentido = 1) {
    clearTimeout(espera.current);
    setErro(null);
    setDirecao(sentido);
    setTela(destino);
    window.history.pushState({ briefing: destino }, "");
  }

  // O desenho aberto pelo olho também entra no histórico: o Voltar do celular o fecha.
  function verDesenho() {
    setVendo(true);
    setJaViu(true);
    window.history.pushState({ briefing: tela }, "");
  }

  // O Voltar do navegador (e o gesto do celular) anda dentro do briefing.
  useEffect(() => {
    window.history.replaceState({ ...window.history.state, briefing: tela }, "");
    const aoVoltar = (e: PopStateEvent) => {
      const destino = (e.state as { briefing?: Tela } | null)?.briefing;
      if (!destino) return;
      clearTimeout(espera.current);
      setErro(null);
      setVendo(false);
      setDirecao(-1);
      setTela(destino);
    };
    window.addEventListener("popstate", aoVoltar);
    return () => {
      window.removeEventListener("popstate", aoVoltar);
      clearTimeout(espera.current);
    };
    // Só a primeira tela entra aqui; as outras entram no histórico em ir().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** A pergunta seguinte (ou a tela entre os passos, ou a revisão). */
  function seguinte(id: string, com: Respostas, daRevisao?: string[]) {
    const agora = visiveis(briefing, com);
    if (daRevisao) {
      // A mudança pode ter aberto perguntas (ou deixado outra incompleta): passa por elas antes.
      const nova = agora.find((p) => !daRevisao.includes(p.id) && !respondida(p, briefing, com));
      return ir(nova ? { tipo: "pergunta", id: nova.id, daRevisao } : { tipo: "revisao" });
    }
    const i = agora.findIndex((p) => p.id === id);
    const proxima = agora[i + 1];
    if (!proxima) return ir({ tipo: "revisao" });
    if (proxima.secao !== agora[i].secao) return ir({ tipo: "passo", secao: agora[i].secao });
    ir({ tipo: "pergunta", id: proxima.id });
  }

  function anterior(id: string, daRevisao?: string[]) {
    if (daRevisao) return ir({ tipo: "revisao" }, -1);
    const i = lista.findIndex((p) => p.id === id);
    ir(i > 0 ? { tipo: "pergunta", id: lista[i - 1].id } : { tipo: "abertura" }, -1);
  }

  /** Onde a pessoa parou: a primeira pergunta sem resposta. */
  function continuar() {
    const falta = lista.find((p) => !respondida(p, briefing, respostas));
    ir(falta ? { tipo: "pergunta", id: falta.id } : { tipo: "revisao" });
  }

  const pergunta = tela.tipo === "pergunta" ? lista.find((p) => p.id === tela.id) : undefined;
  const daRevisao = tela.tipo === "pergunta" ? tela.daRevisao : undefined;
  // O que já se sabe aparece marcado, e só vira resposta quando a pessoa confirma.
  const naTela =
    pergunta?.marcadas && !respostas[pergunta.id] ? { ...respostas, [pergunta.id]: { opcoes: pergunta.marcadas } } : respostas;

  function responder(id: string, r: Resposta) {
    const novas = { ...respostas, [id]: r };
    guardar(novas);
    setErro(null);
    return novas;
  }

  function confirmar() {
    if (!pergunta) return;
    const falta = problema(pergunta, briefing, naTela);
    if (falta) return setErro(falta);
    if (naTela !== respostas) guardar(naTela);
    seguinte(pergunta.id, naTela, daRevisao);
  }

  /** Escolha única: mostra a marca por um instante e segue. */
  function escolheu(id: string, r: Resposta) {
    const novas = responder(id, r);
    clearTimeout(espera.current);
    espera.current = setTimeout(() => seguinte(id, novas, daRevisao), 560);
  }

  // Nas primeiras respostas, o lugar do Salvo conta para que serve o olho.
  const convidar = tela.tipo === "pergunta" && !jaViu && feitas >= 1 && feitas <= 3;
  const emPergunta = tela.tipo === "pergunta" && pergunta;
  const chave = tela.tipo === "pergunta" ? `pergunta-${tela.id}` : tela.tipo === "passo" ? `passo-${tela.secao}` : tela.tipo;

  // Voltar (do navegador) para uma pergunta que deixou de aparecer.
  if (tela.tipo === "pergunta" && !pergunta) return <SemPergunta aoContinuar={continuar} />;

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-background">
      {!["abertura", "fim", "aparelho", "material"].includes(tela.tipo) && (
        <header
          className={cn(
            "sticky top-0 z-20 border-b bg-background/95 text-foreground backdrop-blur transition-colors duration-300",
            tela.tipo === "passo" && "dark section-ink",
          )}
          data-cabecalho
        >
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
            <BrandLogo className="h-5 w-[108px] sm:h-6 sm:w-[130px]" />
            <div className="flex items-center gap-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
                {convidar ? (
                  <span className="lg:hidden" data-convite-do-olho>
                    veja como está ficando
                  </span>
                ) : (
                  salvo && (
                    <>
                      <CloudCheckIcon className="size-4" aria-hidden="true" />
                      Salvo
                    </>
                  )
                )}
              </p>
              <Olho feitas={feitas} aoAbrir={verDesenho} />
            </div>
          </div>
          <div
            className="mx-auto flex max-w-6xl gap-1.5 px-4 pb-2.5"
            role="progressbar"
            aria-label="Quanto do briefing já foi respondido"
            aria-valuenow={porcento}
            aria-valuemin={0}
            aria-valuemax={100}
            data-porcento={porcento}
          >
            {briefing.secoes.map((s, i) => {
              const doPasso = lista.filter((p) => p.secao === i);
              const prontas = doPasso.filter((p) => respondida(p, briefing, respostas)).length;
              return (
                <span key={s} className="h-1.5 flex-1 overflow-hidden rounded-full bg-ring/20">
                  <span
                    className="block h-full rounded-full bg-brand transition-[width] duration-700 ease-(--ease-out)"
                    style={{ width: `${(prontas / doPasso.length) * 100}%` }}
                  />
                </span>
              );
            })}
          </div>
        </header>
      )}

      <AnimatePresence mode="wait" initial={false} custom={direcao}>
        <motion.div
          key={chave}
          custom={direcao}
          variants={{
            entra: (d: number) => ({ opacity: 0, x: 28 * d }),
            fica: { opacity: 1, x: 0 },
            sai: (d: number) => ({ opacity: 0, x: -28 * d }),
          }}
          initial="entra"
          animate="fica"
          exit="sai"
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col"
          data-tela={tela.tipo}
        >
          {tela.tipo === "aparelho" && (
            <OutroAparelho aoConfirmar={() => ir(inicio({ enviado, respostas, materialMandado }, briefing))} />
          )}
          {tela.tipo === "abertura" && (
            <Abertura briefing={briefing} aoComecar={() => (feitas ? continuar() : ir({ tipo: "pergunta", id: lista[0].id }))} />
          )}
          {tela.tipo === "volta" && (
            <Volta
              briefing={briefing}
              respostas={respostas}
              aoContinuar={continuar}
              aoRever={() => ir({ tipo: "revisao" })}
              aoRecomecar={() => {
                setColados({});
                guardar({}, { colados: {} });
                ir({ tipo: "abertura" });
              }}
            />
          )}
          {tela.tipo === "passo" && (
            <Passo
              briefing={briefing}
              secao={tela.secao}
              respostas={respostas}
              aoVoltar={() => {
                const doPasso = lista.filter((p) => p.secao === tela.secao);
                ir({ tipo: "pergunta", id: doPasso[doPasso.length - 1].id }, -1);
              }}
              aoContinuar={() => {
                const proxima = lista.find((p) => p.secao > tela.secao);
                ir(proxima ? { tipo: "pergunta", id: proxima.id } : { tipo: "revisao" });
              }}
            />
          )}
          {tela.tipo === "revisao" && (
            <Revisao
              briefing={briefing}
              respostas={respostas}
              aoMudar={(id) => ir({ tipo: "pergunta", id, daRevisao: lista.filter((p) => !respondida(p, briefing, respostas)).map((p) => p.id) })}
              aoResponder={(id) => ir({ tipo: "pergunta", id, daRevisao: [] })}
              aoEnviar={() => {
                setEnviado(true);
                guardar(respostas, { enviado: true });
                ir({ tipo: briefing.pastaDoMaterial ? "material" : "fim" });
              }}
            />
          )}
          {tela.tipo === "material" && (
            <Material
              briefing={briefing}
              respostas={respostas}
              aoTerminar={(mandou) => {
                setMaterialMandado(mandou);
                guardar(respostas, { enviado: true, materialMandado: mandou });
                ir({ tipo: "fim" });
              }}
            />
          )}
          {tela.tipo === "fim" && (
            <Fim
              briefing={briefing}
              respostas={respostas}
              faltaMaterial={Boolean(briefing.pastaDoMaterial) && !materialMandado}
              aoMandar={() => ir({ tipo: "material" }, -1)}
            />
          )}

          {emPergunta && (
            <FundoVivo className="flex flex-1 flex-col [&>div:first-child]:opacity-40 sm:[&>div:first-child]:opacity-80" aria-label={pergunta.titulo}>
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  confirmar();
                }}
                onPaste={(e) => {
                  if (e.target instanceof HTMLTextAreaElement) chegouDeUmaVez(pergunta.id, e.clipboardData.getData("text"));
                }}
                onInput={(e) => {
                  // O teclado do celular às vezes cola sem avisar que colou.
                  const { inputType, data } = e.nativeEvent as InputEvent;
                  if (e.target instanceof HTMLTextAreaElement && inputType === "insertText" && data) chegouDeUmaVez(pergunta.id, data);
                }}
                className="bg-pattern-light flex flex-1 flex-col"
              >
                <div className="mx-auto grid w-full max-w-6xl flex-1 gap-14 px-4 pt-8 pb-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_18rem]">
                  <div className="mx-auto w-full max-w-2xl lg:mx-0">
                    <Eyebrow>
                      <span data-secao>
                        {briefing.secoes[pergunta.secao]} · {pergunta.secao + 1} de {briefing.secoes.length}
                      </span>
                    </Eyebrow>
                    <Titulo
                      key={pergunta.id}
                      texto={pergunta.titulo}
                      destaque={pergunta.destaque}
                      digita={pergunta.tipo === "texto" || pergunta.tipo === "longo"}
                    />
                    {pergunta.ajuda && (
                      <p className="mt-3 text-base leading-7 text-pretty text-muted-foreground">{pergunta.ajuda}</p>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-7 sm:mt-9"
                    >
                      {pergunta.papel && AO_VIVO.includes(pergunta.papel) && <AoVivo briefing={briefing} respostas={naTela} />}
                      <CampoDaPergunta
                        p={pergunta}
                        briefing={briefing}
                        respostas={naTela}
                        mudar={(r) => responder(pergunta.id, r)}
                        escolheu={(r) => escolheu(pergunta.id, r)}
                        comErro={Boolean(erro)}
                      />
                      {pergunta.nada && (
                        <button
                          type="button"
                          aria-pressed={respostas[pergunta.id]?.nada ?? false}
                          onClick={() => escolheu(pergunta.id, { nada: true })}
                          className={cn(
                            "mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm transition-colors",
                            respostas[pergunta.id]?.nada
                              ? "border-ink bg-brand/20 font-medium"
                              : "border-dashed border-ring bg-background/60 hover:border-solid hover:bg-card",
                          )}
                        >
                          {respostas[pergunta.id]?.nada && <CheckIcon className="size-4" aria-hidden="true" />}
                          {pergunta.nada}
                        </button>
                      )}
                    </motion.div>
                    <p role="alert" className="mt-3 min-h-6 text-sm font-medium text-destructive" data-erro>
                      {erro}
                    </p>
                  </div>
                  <aside className="hidden lg:block" aria-hidden="true">
                    <div className="sticky top-28">
                      <Desenho desenho={desenhoDe(briefing, naTela)} foco={pergunta.papel} janela />
                      <LegendaDoDesenho tipo={briefing.tipo} desenho={desenhoDe(briefing, naTela)} />
                    </div>
                  </aside>
                </div>
                <div className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur" data-rodape>
                  <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => anterior(pergunta.id, daRevisao)}
                      className="group inline-flex h-12 items-center gap-2 rounded-full border border-input px-4 text-sm font-medium hover:bg-muted sm:px-5"
                    >
                      <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                      Voltar
                    </button>
                    <span className="flex-1 text-center font-mono text-xs text-muted-foreground" data-contagem>
                      {feitas} de {total}
                    </span>
                    <button
                      type="submit"
                      className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-transform hover:brightness-95 active:scale-[0.98] sm:px-8"
                    >
                      {daRevisao ? "Pronto" : "Continuar"}
                      {daRevisao ? (
                        <CheckIcon className="size-4" aria-hidden="true" />
                      ) : (
                        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </FundoVivo>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {vendo && (
          <VerDesenho aoFechar={() => window.history.back()}>
            <Desenho desenho={desenhoDe(briefing, respostas)} />
            <LegendaDoDesenho tipo={briefing.tipo} desenho={desenhoDe(briefing, respostas)} />
          </VerDesenho>
        )}
      </AnimatePresence>
    </div>
  );
}

/** As perguntas do visual: no celular, o topo da página acompanha a escolha na hora. */
const AO_VIVO: Papel[] = ["estilo", "cores", "sensacao"];

function AoVivo({ briefing, respostas }: { briefing: Briefing; respostas: Respostas }) {
  const b = blocosDasRespostas(briefing, respostas);
  const frase = fraseDoVisual(b.estilos, b.cores, b.sensacoes);
  const encontro = encontroDosEstilos(b.estilos);
  return (
    <div
      className="sticky top-[5.1rem] z-10 mb-5 overflow-hidden rounded-xl border border-ink/10 shadow-xl lg:hidden"
      aria-hidden="true"
      data-ao-vivo
    >
      <TopoDaPagina
        tema={temaDe(b.estilos, b.cores)}
        titulo={b.principal ?? b.servicos?.[0] ?? b.nome ?? "Sua página"}
        comBotao
        icone={b.icone}
        sensacoes={b.sensacoes}
        compacto
      />
      {frase && (
        <p key={frase} className="char-in block! bg-card px-4 py-2 text-center text-sm leading-snug text-balance">
          <span data-frase-do-visual>{frase}</span>
          {encontro && <span className="block text-xs text-muted-foreground">{encontro}</span>}
        </p>
      )}
    </div>
  );
}

/** O desenho aberto pelo olho, por cima de tudo. */
function VerDesenho({ aoFechar, children }: { aoFechar: () => void; children: React.ReactNode }) {
  const fechar = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const quemAbriu = document.activeElement;
    fechar.current?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") window.history.back();
      // Só há um botão para focar enquanto o desenho está aberto.
      if (e.key === "Tab") e.preventDefault();
    };
    document.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
      if (quemAbriu instanceof HTMLElement) quemAbriu.focus({ preventScroll: true });
    };
  }, []);
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Como está ficando"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="dark section-ink bg-pattern-dark fixed! inset-0 z-50 overflow-y-auto bg-background text-foreground"
      data-ver-desenho
    >
      <div className="mx-auto flex min-h-full max-w-md flex-col px-5 py-4">
        <div className="flex h-12 items-center justify-between">
          <p className="font-heading text-2xl">Está ficando assim</p>
          <button
            ref={fechar}
            type="button"
            onClick={aoFechar}
            aria-label="Fechar e voltar a responder"
            className="flex size-11 items-center justify-center rounded-full border border-input hover:bg-muted"
          >
            <XIcon className="size-5" aria-hidden="true" />
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-6"
        >
          {children}
        </motion.div>
        <button
          type="button"
          onClick={aoFechar}
          className="mb-3 min-h-12 rounded-full bg-brand text-sm font-semibold text-brand-foreground"
          tabIndex={-1}
        >
          Voltar a responder
        </button>
      </div>
    </motion.div>
  );
}

/** Enviado sem o material, a pessoa volta direto para mandar. */
function inicio({ enviado, respostas, materialMandado }: Pick<Guardado, "enviado" | "respostas" | "materialMandado">, briefing: Briefing): Tela {
  if (enviado) return { tipo: briefing.pastaDoMaterial && !materialMandado ? "material" : "fim" };
  return { tipo: Object.keys(respostas).length ? "volta" : "abertura" };
}

/** O título da pergunta entra palavra por palavra e o destaque ganha o marca-texto.
 * Recebe o foco quando aparece (leitor de tela); no computador, o campo de escrever já
 * vem pronto para digitar. No celular, não: o teclado cobriria a pergunta. */
function Titulo({ texto, destaque, digita }: { texto: string; destaque?: string; digita: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const campo =
      digita && window.matchMedia("(pointer: fine)").matches
        ? ref.current?.closest("form")?.querySelector<HTMLElement>("input, textarea")
        : null;
    (campo ?? ref.current)?.focus({ preventScroll: true });
  }, [digita]);
  const corte = destaque ? texto.indexOf(destaque) : -1;
  const partes =
    destaque && corte >= 0
      ? [
          { trecho: texto.slice(0, corte), marcado: false },
          { trecho: destaque, marcado: true },
          { trecho: texto.slice(corte + destaque.length), marcado: false },
        ]
      : [{ trecho: texto, marcado: false }];
  const antes = partes.map((_, i) => partes.slice(0, i).reduce((n, p) => n + p.trecho.split(/\s+/).filter(Boolean).length, 0));
  return (
    <h1
      ref={ref}
      tabIndex={-1}
      className="mt-4 font-heading text-[1.75rem] leading-[1.18] tracking-tight lining-nums text-balance outline-none sm:text-[2.6rem]"
      data-titulo
    >
      {partes.map(({ trecho, marcado }, i) => (
        <span key={i} className={marcado ? "highlight highlight-desenha" : undefined}>
          {trecho.split(/(\s+)/).map((palavra, j) =>
            palavra.trim() ? (
              <span
                key={j}
                className="char-in"
                style={{ "--char-delay": `${(antes[i] + Math.floor(j / 2)) * 45}ms` } as React.CSSProperties}
              >
                {palavra}
              </span>
            ) : (
              palavra
            ),
          )}
        </span>
      ))}
    </h1>
  );
}

function SemPergunta({ aoContinuar }: { aoContinuar: () => void }) {
  useEffect(() => {
    aoContinuar();
    // Só uma vez: leva à primeira pergunta sem resposta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div className="min-h-dvh" />;
}

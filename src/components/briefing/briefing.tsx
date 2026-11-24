"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CloudCheckIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { BrandLogo } from "@/components/brand";
import { CampoDaPergunta } from "@/components/briefing/campos";
import { blocosDasRespostas, RascunhoDaPagina } from "@/components/briefing/rascunho-da-pagina";
import { Abertura, Fim, OutroAparelho, Passo, Revisao, Volta } from "@/components/briefing/telas";
import {
  problema,
  progresso,
  respondida,
  visiveis,
  type Briefing,
  type Resposta,
  type Respostas,
} from "@/lib/briefing/regras";
import { cn } from "@/lib/utils";

// O briefing: uma pergunta por tela, com o que vem depois dependendo da resposta
// (src/lib/briefing/regras.ts). Cada resposta é guardada na hora; quem volta
// continua de onde parou. O botão Voltar do celular leva à pergunta anterior, não
// para fora do briefing.
// Nesta amostra, as respostas ficam só neste navegador (localStorage); na versão
// final, ficam no painel (plano geral, Parte 5, decisão 1 A).

type Tela =
  | { tipo: "aparelho" | "abertura" | "volta" | "revisao" | "fim" }
  | { tipo: "pergunta"; id: string; daRevisao?: boolean }
  | { tipo: "passo"; secao: number };

type Guardado = { respostas: Respostas; enviado: boolean };

const chaveDe = (slug: string) => `amostra-briefing:${slug}`;

function lerGuardado(slug: string): Guardado {
  try {
    const texto = localStorage.getItem(chaveDe(slug));
    if (texto) return JSON.parse(texto) as Guardado;
  } catch {
    // Navegador sem armazenamento: a amostra funciona, só não guarda.
  }
  return { respostas: {}, enviado: false };
}

const semAssinatura = () => () => {};

/** Só depois de montar no navegador, porque o começo depende do que está guardado nele. */
export function BriefingDaAmostra(props: { briefing: Briefing; outroAparelho: boolean }) {
  const noNavegador = useSyncExternalStore(semAssinatura, () => true, () => false);
  return noNavegador ? <Player {...props} /> : <div className="min-h-dvh" />;
}

function Player({ briefing, outroAparelho }: { briefing: Briefing; outroAparelho: boolean }) {
  const [guardado] = useState(() => lerGuardado(briefing.slug));
  const [respostas, setRespostas] = useState(guardado.respostas);
  const [enviado, setEnviado] = useState(guardado.enviado);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [direcao, setDirecao] = useState(1);
  const [tela, setTela] = useState<Tela>(() => {
    if (outroAparelho) return { tipo: "aparelho" };
    return inicio(guardado.enviado, guardado.respostas);
  });
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined);

  const lista = visiveis(briefing, respostas);
  const { feitas, total, porcento } = progresso(briefing, respostas);

  function guardar(novas: Respostas, jaEnviado = enviado) {
    setRespostas(novas);
    setSalvo(true);
    try {
      localStorage.setItem(chaveDe(briefing.slug), JSON.stringify({ respostas: novas, enviado: jaEnviado }));
    } catch {
      setSalvo(false);
    }
  }

  function ir(destino: Tela, sentido = 1) {
    clearTimeout(espera.current);
    setErro(null);
    setDirecao(sentido);
    setTela(destino);
    window.history.pushState({ briefing: destino }, "");
  }

  // O Voltar do navegador (e o gesto do celular) anda dentro do briefing.
  useEffect(() => {
    window.history.replaceState({ ...window.history.state, briefing: tela }, "");
    const aoVoltar = (e: PopStateEvent) => {
      const destino = (e.state as { briefing?: Tela } | null)?.briefing;
      if (!destino) return;
      clearTimeout(espera.current);
      setErro(null);
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
  function seguinte(id: string, com: Respostas, daRevisao?: boolean) {
    if (daRevisao) return ir({ tipo: "revisao" });
    const agora = visiveis(briefing, com);
    const i = agora.findIndex((p) => p.id === id);
    const proxima = agora[i + 1];
    if (!proxima) return ir({ tipo: "revisao" });
    if (proxima.secao !== agora[i].secao) return ir({ tipo: "passo", secao: agora[i].secao });
    ir({ tipo: "pergunta", id: proxima.id });
  }

  function anterior(id: string, daRevisao?: boolean) {
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

  function responder(id: string, r: Resposta) {
    const novas = { ...respostas, [id]: r };
    guardar(novas);
    setErro(null);
    return novas;
  }

  function confirmar() {
    if (!pergunta) return;
    const falta = problema(pergunta, briefing, respostas);
    if (falta) return setErro(falta);
    seguinte(pergunta.id, respostas, daRevisao);
  }

  /** Escolha única: mostra a marca por um instante e segue. */
  function escolheu(id: string, r: Resposta) {
    const novas = responder(id, r);
    clearTimeout(espera.current);
    espera.current = setTimeout(() => seguinte(id, novas, daRevisao), 380);
  }

  const emPergunta = tela.tipo === "pergunta" && pergunta;
  const chave = tela.tipo === "pergunta" ? `pergunta-${tela.id}` : tela.tipo === "passo" ? `passo-${tela.secao}` : tela.tipo;

  // Voltar (do navegador) para uma pergunta que deixou de aparecer.
  if (tela.tipo === "pergunta" && !pergunta) return <SemPergunta aoContinuar={continuar} />;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {tela.tipo !== "abertura" && tela.tipo !== "fim" && tela.tipo !== "aparelho" && (
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur" data-cabecalho>
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
            <BrandLogo className="h-5 w-[108px]" />
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
              {salvo && (
                <>
                  <CloudCheckIcon className="size-4" aria-hidden="true" />
                  Salvo
                </>
              )}
            </p>
          </div>
          <div
            className="h-1.5 bg-ring/15"
            role="progressbar"
            aria-label="Quanto do briefing já foi respondido"
            aria-valuenow={porcento}
            aria-valuemin={0}
            aria-valuemax={100}
            data-porcento={porcento}
          >
            <div
              className="h-full rounded-r-full bg-brand transition-[width] duration-700 ease-(--ease-out)"
              style={{ width: `${Math.max(porcento, 2)}%` }}
            />
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
            <OutroAparelho aoConfirmar={() => ir(inicio(enviado, respostas))} />
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
                guardar({});
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
              aoMudar={(id) => ir({ tipo: "pergunta", id, daRevisao: true })}
              aoEnviar={() => {
                setEnviado(true);
                guardar(respostas, true);
                ir({ tipo: "fim" });
              }}
            />
          )}
          {tela.tipo === "fim" && <Fim briefing={briefing} respostas={respostas} />}

          {emPergunta && (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                confirmar();
              }}
              className="flex flex-1 flex-col"
            >
              <div className="mx-auto grid w-full max-w-6xl flex-1 gap-14 px-4 pt-7 pb-10 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="mx-auto w-full max-w-2xl lg:mx-0">
                  <p className="text-sm text-muted-foreground" data-secao>
                    <span className="font-medium text-foreground">{briefing.secoes[pergunta.secao]}</span>
                    <span aria-hidden="true"> · </span>
                    <span>
                      passo {pergunta.secao + 1} de {briefing.secoes.length}
                    </span>
                  </p>
                  <Titulo key={pergunta.id} digita={pergunta.tipo === "texto" || pergunta.tipo === "longo"}>
                    {pergunta.titulo}
                  </Titulo>
                  {pergunta.ajuda && <p className="mt-3 text-base leading-7 text-pretty text-muted-foreground">{pergunta.ajuda}</p>}
                  <div className="mt-6 sm:mt-8">
                    <CampoDaPergunta
                      p={pergunta}
                      briefing={briefing}
                      respostas={respostas}
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
                            : "border-dashed border-ring hover:border-solid hover:bg-card",
                        )}
                      >
                        {respostas[pergunta.id]?.nada && <CheckIcon className="size-4" aria-hidden="true" />}
                        {pergunta.nada}
                      </button>
                    )}
                  </div>
                  <p role="alert" className="mt-3 min-h-6 text-sm font-medium text-destructive" data-erro>
                    {erro}
                  </p>
                </div>
                <aside className="hidden lg:block" aria-hidden="true">
                  <div className="sticky top-24">
                    <RascunhoDaPagina blocos={blocosDasRespostas(briefing, respostas)} />
                    <p className="mt-3 text-center text-xs text-balance text-muted-foreground">
                      Só um desenho para acompanhar. O visual de verdade é com a gente.
                    </p>
                  </div>
                </aside>
              </div>
              <div className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur" data-rodape>
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => anterior(pergunta.id, daRevisao)}
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-input px-4 text-sm font-medium hover:bg-muted sm:px-5"
                  >
                    <ArrowLeftIcon className="size-4" aria-hidden="true" />
                    Voltar
                  </button>
                  <span className="flex-1 text-center text-xs text-muted-foreground" data-contagem>
                    {feitas} de {total}
                  </span>
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-transform hover:brightness-95 active:scale-[0.98] sm:px-8"
                  >
                    {daRevisao ? "Pronto" : "Continuar"}
                    {daRevisao ? (
                      <CheckIcon className="size-4" aria-hidden="true" />
                    ) : (
                      <ArrowRightIcon className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function inicio(enviado: boolean, respostas: Respostas): Tela {
  if (enviado) return { tipo: "fim" };
  return { tipo: Object.keys(respostas).length ? "volta" : "abertura" };
}

/** O título da pergunta recebe o foco quando ela aparece (leitor de tela); no
 * computador, o campo de escrever já vem pronto para digitar. No celular, não: o
 * teclado cobriria a pergunta. */
function Titulo({ digita, children }: { digita: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const campo = digita && window.matchMedia("(pointer: fine)").matches
      ? ref.current?.closest("form")?.querySelector<HTMLElement>("input, textarea")
      : null;
    (campo ?? ref.current)?.focus({ preventScroll: true });
  }, [digita]);
  return (
    <h1
      ref={ref}
      tabIndex={-1}
      className="mt-3 font-heading text-[1.7rem] leading-[1.15] tracking-tight text-balance outline-none sm:text-4xl"
      data-titulo
    >
      {children}
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

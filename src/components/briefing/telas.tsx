"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, DownloadIcon, ExternalLinkIcon, FolderUpIcon, PencilIcon } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";

import { BrandLogo } from "@/components/brand";
import { Desenho, desenhoDe, LegendaDoDesenho, type BlocosDoDesenho } from "@/components/briefing/desenho";
import { BumerangueFrame } from "@/components/bumerangue";
import { Eyebrow } from "@/components/eyebrow";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { linkWhatsApp, site } from "@/config/site";
import { emTexto, progresso, respondida, visiveis, type Briefing, type Respostas, type TipoDeBriefing } from "@/lib/briefing/regras";
import { cn } from "@/lib/utils";

// As telas em volta das perguntas: a abertura, a volta de quem já começou, o fim
// de cada passo, a revisão, o fim e a confirmação em outro aparelho.

const botao =
  "inline-flex min-h-13 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold transition-transform active:scale-[0.98]";
const botaoAmarelo = cn(botao, "bg-brand text-brand-foreground hover:brightness-95");
const botaoContorno = cn(botao, "border border-input font-medium hover:bg-muted");

/** Título que recebe o foco quando a tela aparece. */
function TituloDaTela({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    ref.current?.focus({ preventScroll: true });
  }, []);
  return (
    <h1
      ref={ref}
      tabIndex={-1}
      className={cn("font-heading text-4xl leading-[1.08] tracking-tight text-balance outline-none sm:text-5xl", className)}
      data-titulo
    >
      {children}
    </h1>
  );
}

// Textos de cada briefing ---------------------------------------------------------------------

const jeitoDeResponder = [
  { titulo: "Conte do seu jeito.", texto: "Como você conta para um cliente. Escrever bonito é com a gente." },
  { titulo: "Responda aos poucos.", texto: "Fica tudo salvo, é só voltar por este link." },
];

const textos = {
  pagina: {
    rotulo: "O briefing da sua página",
    titulo: (nome: string) => `Que bom ter você aqui, ${nome}`,
    texto:
      "As suas respostas são o ponto de partida da sua página. Quanto mais a gente souber do seu negócio, mais ela vai ter a sua cara.",
    combinados: [
      ...jeitoDeResponder,
      { titulo: "Quanto mais seu, melhor.", texto: "Um caso real ou uma frase sua valem mais que um texto pronto." },
    ],
    frases: ["Já dá para ver começando", "Está tomando forma", "Agora tem a voz dos seus clientes", "Só falta o jeito dela"],
    depois: [
      { titulo: "A gente lê tudo com calma", texto: "Se ficar alguma dúvida, chamamos você no WhatsApp." },
      { titulo: "Monta o roteiro da página", texto: "As seções e a mensagem principal, para você aprovar." },
      { titulo: "Cria a sua página", texto: "Com o seu jeito de falar e o visual pensado para você." },
    ],
    mensagem: "Oi, vi a sua página!",
  },
  google_ads: {
    rotulo: "O briefing do seu Google Ads",
    titulo: (nome: string) => `Vamos preparar os seus anúncios, ${nome}`,
    texto:
      "Com as suas respostas, a gente escolhe em quais buscas você vai aparecer e quem vai chamar no seu WhatsApp.",
    combinados: [
      ...jeitoDeResponder,
      { titulo: "Os seus valores não são publicados.", texto: "Servem para a gente calcular o retorno dos anúncios." },
    ],
    frases: ["A gente já sabe quem procurar", "O anúncio está tomando forma"],
    depois: [
      { titulo: "A gente lê tudo com calma", texto: "Se ficar alguma dúvida, chamamos você no WhatsApp." },
      { titulo: "Monta a campanha", texto: "As buscas, os anúncios e o que fica bloqueado." },
      { titulo: "Coloca no ar e avisa você", texto: "Assim que a conta e os acessos estiverem prontos." },
    ],
    mensagem: "Oi, vi o anúncio no Google!",
  },
} satisfies Record<TipoDeBriefing, unknown>;

// Abertura ----------------------------------------------------------------------------------

const cenas: Record<TipoDeBriefing, { texto: string; bloco: object }[]> = {
  pagina: [
    { texto: "O nome é esse mesmo", bloco: { nome: "Seu negócio" } },
    { texto: "Pode ser neste WhatsApp", bloco: { whatsapp: true } },
    { texto: "Faço quatro serviços", bloco: { servicos: ["O principal", "O mais pedido", "O novo", "O especial"] } },
    { texto: "Atendo mais famílias daqui", bloco: { clientes: true } },
    { texto: "Sempre me perguntam isto", bloco: { duvidas: 3 } },
    { texto: "Comecei há dez anos", bloco: { historia: true, lugar: true, horarios: true } },
  ],
  google_ads: [
    { texto: "Procuram assim", bloco: { busca: "o seu serviço perto de mim" } },
    { texto: "O principal é este", bloco: { servicos: ["O seu serviço"], site: "seunegocio.com.br" } },
    { texto: "Atendo a cidade toda", bloco: { cidades: ["Sua cidade e região"] } },
    { texto: "Faço outros dois também", bloco: { servicos: ["O seu serviço", "O mais pedido", "O novo"] } },
    { texto: "Esses pedidos eu não quero", bloco: { bloqueadas: ["curso", "vaga de emprego", "de graça"] } },
    { texto: "Respondo em horário comercial", bloco: { horarios: "Segunda a sexta" } },
  ],
};

/** As respostas virando a página (ou o anúncio), uma vez só (6 respostas, perto de 5 segundos), quando
 * a cena está à vista: no celular, ela fica embaixo do texto. */
function CenaDaAbertura({ tipo }: { tipo: TipoDeBriefing }) {
  const respostasDaCena = cenas[tipo];
  const ref = useRef<HTMLDivElement>(null);
  const aVista = useInView(ref, { amount: 0.4 });
  // Passa uma da última resposta, para o balão sair no fim.
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!aVista || n > respostasDaCena.length) return;
    const t = setTimeout(() => setN(n + 1), n === 0 ? 700 : 800);
    return () => clearTimeout(t);
  }, [n, aVista, respostasDaCena.length]);
  const desenho = { tipo, blocos: Object.assign({}, ...respostasDaCena.slice(0, n).map((r) => r.bloco)) } as BlocosDoDesenho;
  const atual = respostasDaCena[n - 1];
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[19rem]" aria-hidden="true" data-cena={n}>
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-brand/20 blur-3xl" />
      <BumerangueFrame>
        <Desenho desenho={desenho} className="relative" />
      </BumerangueFrame>
      <AnimatePresence>
        {atual && (
          <motion.p
            key={n}
            initial={{ opacity: 0, x: -36, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.85 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -left-3 top-[38%] rounded-2xl rounded-bl-sm bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground shadow-xl sm:-left-14"
          >
            {atual.texto}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Abertura({ briefing, aoComecar }: { briefing: Briefing; aoComecar: () => void }) {
  return (
    <main className="dark section-ink bg-pattern-dark flex flex-1 flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6">
        <BrandLogo />
      </div>
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Eyebrow className="text-brand">{textos[briefing.tipo].rotulo}</Eyebrow>
          <TituloDaTela className="mt-4">{textos[briefing.tipo].titulo(briefing.nome)}</TituloDaTela>
          <p className="mt-5 max-w-lg text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {textos[briefing.tipo].texto}
          </p>
          <ul className="mt-7 max-w-lg space-y-4">
            {textos[briefing.tipo].combinados.map((c) => (
              <li key={c.titulo} className="flex gap-3 text-base leading-7">
                <CheckIcon className="mt-1 size-5 shrink-0 text-brand" aria-hidden="true" />
                <span className="text-pretty text-muted-foreground">
                  <strong className="font-medium text-foreground">{c.titulo}</strong> {c.texto}
                </span>
              </li>
            ))}
          </ul>
          <button type="button" onClick={aoComecar} className={cn(botaoAmarelo, "mt-9 w-full sm:w-auto")}>
            Começar
            <ArrowRightIcon className="size-5" aria-hidden="true" />
          </button>
          <p className="mt-4 max-w-lg text-xs leading-5 text-muted-foreground">
            As respostas são guardadas enquanto você responde, para você poder continuar depois. Veja a{" "}
            <a href={`${site.url}/privacidade`} target="_blank" rel="noopener" className="underline underline-offset-2">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
        <CenaDaAbertura tipo={briefing.tipo} />
      </div>
    </main>
  );
}

// Volta -------------------------------------------------------------------------------------

export function Volta({
  briefing,
  respostas,
  aoContinuar,
  aoRever,
  aoRecomecar,
}: {
  briefing: Briefing;
  respostas: Respostas;
  aoContinuar: () => void;
  aoRever: () => void;
  aoRecomecar: () => void;
}) {
  const [confirmando, setConfirmando] = useState(false);
  const { feitas, total } = progresso(briefing, respostas);
  const lista = visiveis(briefing, respostas);
  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 content-start gap-12 px-4 py-10 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="max-w-2xl">
        <TituloDaTela>Que bom te ver de novo, {briefing.nome}</TituloDaTela>
        <p className="mt-4 text-lg leading-8 text-pretty text-muted-foreground">
          Você já respondeu <strong className="font-semibold text-foreground">{feitas} de {total}</strong> e está tudo
          guardado.
        </p>
        <ul className="mt-7 space-y-3">
          {briefing.secoes.map((s, i) => {
            const daSecao = lista.filter((p) => p.secao === i);
            const prontas = daSecao.filter((p) => respondida(p, briefing, respostas)).length;
            const tudo = prontas === daSecao.length;
            return (
              <li key={s} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    tudo ? "bg-ink text-brand" : prontas ? "bg-brand text-brand-foreground" : "bg-ring/20",
                  )}
                  aria-hidden="true"
                >
                  {tudo ? <CheckIcon className="size-4" strokeWidth={3} /> : i + 1}
                </span>
                <span className="flex-1">{s}</span>
                <span className="text-sm text-muted-foreground">
                  {prontas} de {daSecao.length}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={aoContinuar} className={botaoAmarelo}>
            Continuar de onde parei
            <ArrowRightIcon className="size-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={aoRever} className={botaoContorno}>
            Rever o que já respondi
          </button>
        </div>
        <div className="mt-6 min-h-11">
          {confirmando ? (
            <div className="rounded-xl border bg-card p-4" role="alertdialog" aria-label="Começar de novo">
              <p className="font-medium">Começar de novo apaga as {feitas} respostas. Quer apagar mesmo?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmando(false)}
                  className="min-h-11 rounded-full bg-ink px-5 text-sm font-medium text-paper"
                >
                  Não, quero guardar
                </button>
                <button
                  type="button"
                  onClick={aoRecomecar}
                  className="min-h-11 rounded-full border border-destructive/40 px-5 text-sm font-medium text-destructive"
                >
                  Apagar e começar de novo
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="min-h-11 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Começar de novo
            </button>
          )}
        </div>
      </div>
      <Desenho desenho={desenhoDe(briefing, respostas)} className="hidden self-start lg:block" />
    </main>
  );
}

// Fim de um passo ---------------------------------------------------------------------------

export function Passo({
  briefing,
  secao,
  respostas,
  aoVoltar,
  aoContinuar,
}: {
  briefing: Briefing;
  secao: number;
  respostas: Respostas;
  aoVoltar: () => void;
  aoContinuar: () => void;
}) {
  // O desenho entra sem o que veio neste passo e depois se completa.
  const [completo, setCompleto] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setCompleto(true), 500);
    return () => clearTimeout(t);
  }, []);
  const antes = Object.fromEntries(
    visiveis(briefing, respostas)
      .filter((p) => p.secao < secao)
      .map((p) => [p.id, respostas[p.id]])
      .filter(([, r]) => r),
  ) as Respostas;
  return (
    <main className="dark section-ink bg-pattern-dark flex flex-1 flex-col bg-background text-foreground">
      <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-8 px-4 py-8 lg:grid-cols-[1fr_18rem] lg:gap-16">
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.15 }}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-brand-foreground"
          >
            <CheckIcon className="size-4" strokeWidth={3} aria-hidden="true" />
            Passo {secao + 1} de {briefing.secoes.length} pronto
          </motion.p>
          <TituloDaTela className="mt-3 text-3xl sm:text-5xl">{textos[briefing.tipo].frases[secao] ?? "Está tomando forma"}</TituloDaTela>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            A seguir, <strong className="font-medium text-foreground">{briefing.secoes[secao + 1]?.toLowerCase()}</strong>.
          </p>
          <div className="mt-8 hidden gap-3 lg:flex">
            <BotoesDoPasso aoVoltar={aoVoltar} aoContinuar={aoContinuar} />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[16rem] pt-2 sm:max-w-[17rem]">
          <BumerangueFrame>
            <Desenho desenho={desenhoDe(briefing, completo ? respostas : antes)} className="relative" />
          </BumerangueFrame>
          <LegendaDoDesenho tipo={briefing.tipo} />
        </div>
      </div>
      <div className="sticky bottom-0 flex gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <BotoesDoPasso aoVoltar={aoVoltar} aoContinuar={aoContinuar} />
      </div>
    </main>
  );
}

function BotoesDoPasso({ aoVoltar, aoContinuar }: { aoVoltar: () => void; aoContinuar: () => void }) {
  return (
    <>
      <button type="button" onClick={aoVoltar} className={cn(botaoContorno, "min-h-12 px-5 text-sm")}>
        <ArrowLeftIcon className="size-4" aria-hidden="true" />
        Voltar
      </button>
      <button type="button" onClick={aoContinuar} className={cn(botaoAmarelo, "min-h-12 flex-1 text-sm lg:flex-none")}>
        Continuar
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </button>
    </>
  );
}

// Revisão -----------------------------------------------------------------------------------

export function Revisao({
  briefing,
  respostas,
  aoMudar,
  aoEnviar,
}: {
  briefing: Briefing;
  respostas: Respostas;
  aoMudar: (id: string) => void;
  aoEnviar: () => void;
}) {
  const lista = visiveis(briefing, respostas);
  const faltam = lista.filter((p) => !respondida(p, briefing, respostas));
  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-14">
        <TituloDaTela>{faltam.length ? "O que você já contou" : "Confira antes de enviar"}</TituloDaTela>
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground">
          {faltam.length
            ? `${faltam.length === 1 ? "Falta 1 resposta" : `Faltam ${faltam.length} respostas`} para poder enviar.`
            : "Está tudo aqui. Se quiser trocar algo, toque em Mudar."}
        </p>
        <div className="mt-9 space-y-10">
          {briefing.secoes.map((s, i) => (
            <section key={s} aria-label={s}>
              <h2 className="font-heading text-2xl">{s}</h2>
              <ul className="mt-4 divide-y rounded-2xl border bg-card">
                {lista
                  .filter((p) => p.secao === i)
                  .map((p) => {
                    const linhas = emTexto(p, briefing, respostas);
                    return (
                      <li key={p.id} className="flex items-start gap-3 px-4 py-4 sm:px-5" data-revisao={p.id}>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm text-muted-foreground">{p.titulo}</h3>
                          {linhas.length ? (
                            linhas.map((l, j) => (
                              <p key={j} className="mt-1 break-words whitespace-pre-wrap">
                                {l}
                              </p>
                            ))
                          ) : (
                            <p className="mt-1 font-medium text-destructive">Ainda sem resposta</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => aoMudar(p.id)}
                          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium hover:bg-muted"
                        >
                          <PencilIcon className="size-3.5" aria-hidden="true" />
                          {linhas.length ? "Mudar" : "Responder"}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl px-4 py-3">
          <button
            type="button"
            onClick={() => (faltam.length ? aoMudar(faltam[0].id) : aoEnviar())}
            className={cn(botaoAmarelo, "min-h-12 w-full text-sm sm:ml-auto sm:w-auto")}
          >
            {faltam.length ? "Responder o que falta" : "Enviar as respostas"}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </main>
  );
}

// Fim ---------------------------------------------------------------------------------------

export function Fim({ briefing, respostas }: { briefing: Briefing; respostas: Respostas }) {
  const [aviso, setAviso] = useState(false);
  return (
    <main className="dark section-ink bg-pattern-dark flex flex-1 flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6">
        <BrandLogo />
      </div>
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Eyebrow className="text-brand">Respostas enviadas</Eyebrow>
          <TituloDaTela className="mt-4">
            Recebemos tudo, {briefing.nome}. <span className="highlight">Obrigado!</span>
          </TituloDaTela>
          <ol className="mt-8 max-w-lg space-y-5">
            {textos[briefing.tipo].depois.map((d, i) => (
              <li key={d.titulo} className="flex gap-4">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="leading-7">
                  <strong className="block font-medium">{d.titulo}</strong>
                  <span className="block text-pretty text-muted-foreground">{d.texto}</span>
                </span>
              </li>
            ))}
          </ol>
          {briefing.pastaDoMaterial && (
            <div className="mt-8 max-w-lg rounded-2xl border border-brand/50 bg-card p-5" data-material>
              <p className="flex items-center gap-3 font-heading text-xl">
                <FolderUpIcon className="size-6 shrink-0 text-brand" aria-hidden="true" />
                Agora só falta o material
              </p>
              <p className="mt-2 text-sm leading-6 text-pretty text-muted-foreground">
                Coloque na sua pasta o logo, as fotos e os depoimentos que você tiver. O prazo começa quando chegar tudo.
              </p>
              <a href={briefing.pastaDoMaterial} target="_blank" rel="noopener" className={cn(botaoAmarelo, "mt-4 min-h-12 w-full text-sm sm:w-auto")}>
                Abrir a minha pasta
                <ExternalLinkIcon className="size-4" aria-hidden="true" />
              </a>
            </div>
          )}
          <div className="mt-7">
            <button type="button" onClick={() => setAviso(true)} className={cn(botaoContorno, "w-full sm:w-auto")}>
              <DownloadIcon className="size-5" aria-hidden="true" />
              Guardar as minhas respostas
            </button>
            <p className="mt-3 min-h-5 text-sm text-muted-foreground" aria-live="polite">
              {aviso && "Nesta amostra o arquivo ainda não sai. Na versão final, baixa o PDF das respostas."}
            </p>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[19rem]">
          <BumerangueFrame>
            <Desenho desenho={desenhoDe(briefing, respostas)} className="relative" />
          </BumerangueFrame>
          {/* O que a página (ou o anúncio) vai trazer: alguém chamando no WhatsApp. */}
          <motion.p
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1.1 }}
            className="absolute -right-2 -bottom-9 flex items-center gap-2.5 rounded-2xl rounded-br-sm bg-white px-4 py-3 text-sm font-medium text-ink shadow-2xl sm:-right-10"
            aria-hidden="true"
          >
            <IconeWhatsApp className="size-5 text-[#1fa855]" />
            {textos[briefing.tipo].mensagem}
          </motion.p>
        </div>
      </div>
    </main>
  );
}

// Outro aparelho ----------------------------------------------------------------------------

const TENTATIVAS = 5;
/** Os 4 últimos números do WhatsApp inventado da amostra; na versão final, quem confere é o painel. */
const FINAL_DA_AMOSTRA = "0000";

export function OutroAparelho({ aoConfirmar }: { aoConfirmar: () => void }) {
  const [digitos, setDigitos] = useState("");
  const [erros, setErros] = useState(0);
  const travado = erros >= TENTATIVAS;
  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6">
        <BrandLogo />
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        {travado ? (
          <>
            <TituloDaTela className="text-3xl sm:text-4xl">Vamos liberar para você</TituloDaTela>
            <p className="mt-4 leading-7 text-pretty text-muted-foreground">
              Os números não bateram, e a gente travou por segurança. Fale com a gente que liberamos rapidinho. As suas
              respostas continuam guardadas.
            </p>
            <a
              href={linkWhatsApp("Olá! Não consegui abrir o meu briefing e preciso que vocês liberem.")}
              className={cn(botaoAmarelo, "mt-7")}
            >
              <IconeWhatsApp className="size-5" />
              Chamar no WhatsApp
            </a>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (digitos === FINAL_DA_AMOSTRA) return aoConfirmar();
              setErros(erros + 1);
              setDigitos("");
            }}
          >
            <TituloDaTela className="text-3xl sm:text-4xl">Só para confirmar que é você</TituloDaTela>
            <p className="mt-4 leading-7 text-pretty text-muted-foreground">
              Este briefing foi começado em outro aparelho. Para continuar aqui, escreva os{" "}
              <strong className="font-medium text-foreground">4 últimos números</strong> do seu WhatsApp.
            </p>
            <input
              value={digitos}
              onChange={(e) => setDigitos(e.target.value.replace(/\D/g, "").slice(0, 4))}
              inputMode="numeric"
              autoComplete="off"
              aria-label="Os 4 últimos números do seu WhatsApp"
              placeholder="0000"
              className="mt-7 h-16 w-full rounded-xl border border-input bg-card text-center font-mono text-3xl tracking-[0.5em] outline-none placeholder:text-muted-foreground/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
            <p role="alert" className="mt-2 min-h-6 text-sm font-medium text-destructive">
              {erros > 0 && "Não bateu. Confira os números e tente de novo."}
            </p>
            <button
              type="submit"
              disabled={digitos.length < 4}
              className={cn(botaoAmarelo, "mt-3 w-full disabled:opacity-50")}
            >
              Continuar
              <ArrowRightIcon className="size-5" aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

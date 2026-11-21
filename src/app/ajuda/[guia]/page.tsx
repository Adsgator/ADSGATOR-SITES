import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, ChevronRightIcon, CircleCheckIcon, ClockIcon, LightbulbIcon } from "lucide-react";

import { CapturaDeTela } from "@/components/ajuda/captura-de-tela";
import { CopiarEmail } from "@/components/ajuda/copiar-email";
import { iconeDoGuia } from "@/components/ajuda/icone-do-guia";
import { IndiceAoLado, IndiceQueAbre, type ItemDoIndice } from "@/components/ajuda/indice-da-pagina";
import { MenuLateral } from "@/components/ajuda/menu-lateral";
import { BarraDoProgresso, MarcarPasso, NumeroDoPasso, ProgressoDoGuia } from "@/components/ajuda/progresso-do-guia";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { linkWhatsApp } from "@/config/site";
import {
  EMAIL_DA_ADSGATOR,
  categoriaPorId,
  guiaPorSlug,
  guias,
  mensagemDeTerminei,
  mensagemDoGuia,
  type Guia,
  type GuiaDeExplicacao,
  type GuiaDePassos,
  type Parte,
} from "@/content/ajuda";

export function generateStaticParams() {
  return guias.map(({ slug }) => ({ guia: slug }));
}

export async function generateMetadata({ params }: PageProps<"/ajuda/[guia]">): Promise<Metadata> {
  const guia = guiaPorSlug((await params).guia);
  if (!guia) return {};
  return { title: guia.curto, description: guia.resumo, alternates: { canonical: `/${guia.slug}` } };
}

// Links dentro do texto dos guias (para outro guia ou para o Google).
const textoComLinks = "[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4";
// O cabeçalho é fixo: o título que o índice abre fica abaixo dele.
const alvo = "scroll-mt-24";

const idDaParte = (parte: Parte, i: number) => (parte.titulo ? `parte-${i + 1}` : "passo-a-passo");
const idDaSecao = (i: number) => `secao-${i + 1}`;

/** O índice "Nesta página": as partes ou as seções, e o que vem no fim. */
function itensDoIndice(guia: Guia): ItemDoIndice[] {
  const corpo =
    guia.tipo === "passos"
      ? guia.partes.map((parte, i) => ({ id: idDaParte(parte, i), titulo: parte.titulo ?? "Passo a passo" }))
      : guia.secoes.map((secao, i) => ({ id: idDaSecao(i), titulo: secao.titulo }));
  return [
    ...corpo,
    ...(guia.tipo === "passos" ? [{ id: "terminou", titulo: "Terminou?" }] : []),
    ...(guia.duvidas ? [{ id: "duvidas", titulo: "Dúvidas" }] : []),
    ...(guia.relacionados?.length ? [{ id: "veja-tambem", titulo: guia.tipo === "passos" ? "Próximo passo" : "Veja também" }] : []),
  ];
}

/** Os passos de uma parte, numerados, com o "Fiz este passo" e a barra. */
function PassosDaParte({ parte, id }: { parte: Parte; id: string }) {
  return (
    <ProgressoDoGuia total={parte.passos.length}>
      <section id={id} className={`mt-12 first:mt-0 ${alvo}`}>
        {parte.titulo && <h2 className="font-heading text-2xl sm:text-3xl">{parte.titulo}</h2>}
        {parte.intro && <p className={`mt-3 leading-7 text-muted-foreground ${textoComLinks}`}>{parte.intro}</p>}
        <div className="mt-6">
          <BarraDoProgresso />
        </div>
        <ol className="space-y-10">
          {parte.passos.map((passo, i) => (
            <li key={passo.titulo} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4">
              <NumeroDoPasso passo={i + 1} />
              <div className="min-w-0 pt-1">
                <h3 className="font-heading text-xl leading-snug">{passo.titulo}</h3>
                <div className={`mt-2 leading-7 text-muted-foreground ${textoComLinks}`}>{passo.texto}</div>
                {passo.captura && <CapturaDeTela captura={passo.captura} />}
                {passo.dica && (
                  <p className="mt-4 flex gap-3 rounded-2xl bg-muted/60 p-4 text-sm leading-6">
                    <LightbulbIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span>{passo.dica}</span>
                  </p>
                )}
                <MarcarPasso passo={i + 1} />
              </div>
            </li>
          ))}
        </ol>
      </section>
    </ProgressoDoGuia>
  );
}

function CorpoDePassos({ guia }: { guia: GuiaDePassos }) {
  return (
    <>
      {(guia.antes || guia.emailDaAdsgator) && (
        <div className="mt-8 space-y-4">
          {guia.antes && (
            <div className="rounded-2xl border bg-card p-5">
              <p className="font-medium">Tenha à mão</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 leading-7 text-muted-foreground">
                {guia.antes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {guia.emailDaAdsgator && <CopiarEmail email={EMAIL_DA_ADSGATOR} />}
        </div>
      )}

      <div className="mt-12">
        {guia.partes.map((parte, i) => (
          <PassosDaParte key={idDaParte(parte, i)} parte={parte} id={idDaParte(parte, i)} />
        ))}
      </div>

      <section id="terminou" className={`mt-14 rounded-3xl border border-brand/40 bg-brand/5 p-6 sm:p-8 ${alvo}`}>
        <h2 className="flex items-center gap-2 font-heading text-2xl">
          <CircleCheckIcon className="size-6 text-brand" />
          Terminou?
        </h2>
        <p className="mt-2 leading-7">{guia.pronto}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={linkWhatsApp(mensagemDeTerminei(guia.curto))}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 font-medium text-brand-foreground hover:bg-brand/90"
          >
            <IconeWhatsApp className="size-4" />
            Avisar que terminei
          </a>
          <a href={linkWhatsApp(mensagemDoGuia(guia.curto))} className="inline-flex h-12 items-center rounded-full border bg-background px-6 font-medium hover:bg-muted">
            Travei em um passo
          </a>
        </div>
      </section>
    </>
  );
}

function CorpoDeExplicacao({ guia }: { guia: GuiaDeExplicacao }) {
  return (
    <>
      <div className="mt-12 space-y-12">
        {guia.secoes.map((secao, i) => (
          <section key={secao.titulo} id={idDaSecao(i)} className={`grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 ${alvo}`}>
            <span aria-hidden="true" className="mt-2 h-6 w-1 rounded-full bg-brand/70" />
            <div className="min-w-0">
              <h2 className="font-heading text-2xl leading-snug">{secao.titulo}</h2>
              <div className={`mt-3 leading-7 text-muted-foreground ${textoComLinks}`}>{secao.texto}</div>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-14 grid gap-5 rounded-3xl border bg-card p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
        <div>
          <h2 className="font-heading text-2xl">Ficou alguma dúvida?</h2>
          <p className="mt-2 leading-7 text-muted-foreground">Pergunta para a gente no WhatsApp. A gente explica olhando a sua campanha.</p>
        </div>
        <a
          href={linkWhatsApp(mensagemDoGuia(guia.curto))}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 font-medium text-brand-foreground hover:bg-brand/90"
        >
          <IconeWhatsApp className="size-4" />
          Perguntar
        </a>
      </section>
    </>
  );
}

export default async function PaginaDoGuia({ params }: PageProps<"/ajuda/[guia]">) {
  const guia = guiaPorSlug((await params).guia);
  if (!guia) notFound();
  const categoria = categoriaPorId(guia.grupo);
  const Icone = iconeDoGuia[guia.slug];
  const relacionados = (guia.relacionados ?? []).map((slug) => guiaPorSlug(slug)).filter((g) => g !== undefined);
  const indice = itensDoIndice(guia);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-8 pb-24 lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[14rem_minmax(0,1fr)_12rem]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-y-auto pb-6">
          <MenuLateral atual={guia.slug} />
        </div>
      </aside>

      <article className="min-w-0 max-w-3xl">
        <nav aria-label="Onde você está" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Central de Ajuda
          </Link>
          <ChevronRightIcon className="size-3.5" />
          <Link href={`/#${categoria.id}`} className="hover:text-foreground">
            {categoria.nome}
          </Link>
        </nav>

        <header className="mt-6">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Icone className="size-5" />
          </span>
          <h1 className="mt-4 font-heading text-3xl tracking-tight text-balance sm:text-5xl">{guia.titulo}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{guia.resumo}</p>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
            <ClockIcon className="size-4" />
            {guia.tipo === "passos" ? `Leva ${guia.tempo}` : guia.tempo}
          </p>
        </header>

        <div className="mt-6 xl:hidden">
          <IndiceQueAbre itens={indice} />
        </div>

        {guia.tipo === "passos" ? <CorpoDePassos guia={guia} /> : <CorpoDeExplicacao guia={guia} />}

        {guia.duvidas && (
          <section id="duvidas" className={`mt-14 ${alvo}`}>
            <h2 className="font-heading text-2xl">Dúvidas</h2>
            <div className="mt-4 divide-y rounded-3xl border bg-card">
              {guia.duvidas.map(({ pergunta, resposta }) => (
                <details key={pergunta} className="group px-6 py-4">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {pergunta}
                    <span aria-hidden="true" className="text-xl text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-2 leading-7 text-muted-foreground">{resposta}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {relacionados.length > 0 && (
          <section id="veja-tambem" className={`mt-14 ${alvo}`}>
            <h2 className="font-heading text-2xl">{guia.tipo === "passos" ? "Próximo passo" : "Veja também"}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {relacionados.map((outro) => {
                const IconeOutro = iconeDoGuia[outro.slug];
                return (
                  <li key={outro.slug}>
                    <Link href={`/${outro.slug}`} className="group flex h-full items-center gap-4 rounded-3xl border bg-card p-5 hover:border-brand/60">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                        <IconeOutro className="size-5" />
                      </span>
                      <span className="flex-1 font-heading text-lg leading-snug">{outro.curto}</span>
                      <ArrowRightIcon className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <Link href={`/#${categoria.id}`} className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium hover:underline lg:hidden">
          Ver todos os guias de {categoria.nome}
          <ArrowRightIcon className="size-4" />
        </Link>
      </article>

      <aside className="hidden xl:block">
        <IndiceAoLado itens={indice} />
      </aside>
    </div>
  );
}

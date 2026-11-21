import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, CircleCheckIcon, ClockIcon, LightbulbIcon } from "lucide-react";

import { CapturaDeTela } from "@/components/ajuda/captura-de-tela";
import { CopiarEmail } from "@/components/ajuda/copiar-email";
import { EscolhaDoCaminho } from "@/components/ajuda/escolha-do-caminho";
import { iconeDoGuia } from "@/components/ajuda/icone-do-guia";
import { BarraDoProgresso, MarcarPasso, NumeroDoPasso, ProgressoDoGuia } from "@/components/ajuda/progresso-do-guia";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { linkWhatsApp } from "@/config/site";
import {
  EMAIL_DA_ADSGATOR,
  guiaPorSlug,
  guias,
  mensagemDeTerminei,
  mensagemDoGuia,
  type Parte,
} from "@/content/ajuda";

export function generateStaticParams() {
  return guias.map(({ slug }) => ({ guia: slug }));
}

export async function generateMetadata({ params }: PageProps<"/ajuda/[guia]">): Promise<Metadata> {
  const guia = guiaPorSlug((await params).guia);
  if (!guia) return {};
  return {
    title: guia.curto,
    description: guia.resumo,
    alternates: { canonical: `/${guia.slug}` },
  };
}

/** Os passos de uma parte, numerados, com o "Fiz este passo" e a barra. */
function PassosDaParte({ parte, mostrarTitulo }: { parte: Parte; mostrarTitulo: boolean }) {
  return (
    <ProgressoDoGuia total={parte.passos.length}>
      <section className="mt-10 first:mt-0">
        {mostrarTitulo && parte.titulo && <h2 className="font-heading text-2xl sm:text-3xl">{parte.titulo}</h2>}
        {parte.intro && <p className="mt-3 leading-7 text-muted-foreground">{parte.intro}</p>}
        <div className="mt-6">
          <BarraDoProgresso />
        </div>
        <ol className="space-y-10">
          {parte.passos.map((passo, i) => (
            <li key={passo.titulo} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4">
              <NumeroDoPasso passo={i + 1} />
              <div className="min-w-0 pt-1">
                <h3 className="font-heading text-xl leading-snug">{passo.titulo}</h3>
                <div className="mt-2 leading-7 text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">{passo.texto}</div>
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

export default async function PaginaDoGuia({ params }: PageProps<"/ajuda/[guia]">) {
  const guia = guiaPorSlug((await params).guia);
  if (!guia) notFound();
  const Icone = iconeDoGuia[guia.slug];
  const proximo = guia.proximo && guiaPorSlug(guia.proximo);

  return (
    <article className="mx-auto max-w-3xl px-4 pt-10 pb-24 sm:pt-14">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon className="size-4" />
        Todos os guias
      </Link>

      <header className="mt-8">
        <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Icone className="size-4 text-brand" />
          {guia.grupo}
        </p>
        <h1 className="mt-3 font-heading text-3xl tracking-tight text-balance sm:text-5xl">{guia.titulo}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{guia.resumo}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ClockIcon className="size-4" />
            Leva {guia.tempo}
          </span>
          <span>Telas conferidas com a ajuda do Google em {guia.conferido}</span>
        </p>
      </header>

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
        {guia.escolha ? (
          <EscolhaDoCaminho
            pergunta={guia.escolha.pergunta}
            respostas={guia.escolha.respostas}
            caminhos={guia.partes.map((parte) => (
              <PassosDaParte key={parte.titulo} parte={parte} mostrarTitulo={false} />
            ))}
          />
        ) : (
          guia.partes.map((parte, i) => <PassosDaParte key={parte.titulo ?? i} parte={parte} mostrarTitulo />)
        )}
      </div>

      <section className="mt-14 rounded-3xl border border-brand/40 bg-brand/5 p-6 sm:p-8">
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

      {proximo && (
        <Link href={`/${proximo.slug}`} className="group mt-6 flex items-center justify-between gap-4 rounded-3xl border bg-card p-6 hover:border-brand/60">
          <span>
            <span className="block font-mono text-xs text-muted-foreground">Próximo guia</span>
            <span className="mt-1 block font-heading text-xl">{proximo.curto}</span>
          </span>
          <ArrowRightIcon className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}

      {guia.duvidas && (
        <section className="mt-14">
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

      <footer className="mt-14 border-t pt-6 text-sm text-muted-foreground">
        <p>Baseado na ajuda oficial do Google:</p>
        <ul className="mt-2 space-y-1">
          {guia.fontes.map(({ titulo, href }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">
                {titulo}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
}

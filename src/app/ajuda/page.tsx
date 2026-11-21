import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "lucide-react";

import { BuscaDaAjuda } from "@/components/ajuda/busca";
import { iconeDoGuia } from "@/components/ajuda/icone-do-guia";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { linkWhatsApp } from "@/config/site";
import { categorias, guias, itensDaBusca, mensagemDaAjuda } from "@/content/ajuda";

export const metadata: Metadata = {
  title: { absolute: "Central de Ajuda da Adsgator" },
  description: "Guias da Adsgator: configurar o Google Ads, dar acesso ao perfil no Google, pagar e adicionar saldo, e entender os resultados da campanha.",
  alternates: { canonical: "/" },
};

export default function CentralDeAjuda() {
  return (
    <>
      <section className="border-b bg-pattern-light">
        <div className="mx-auto max-w-3xl px-4 pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
          <h1 className="font-heading text-4xl tracking-tight text-balance sm:text-6xl">Como podemos ajudar?</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
            Passo a passo para configurar a sua conta e respostas para entender a sua campanha.
          </p>
          <div id="busca" className="mx-auto mt-8 max-w-xl scroll-mt-24 text-left">
            <BuscaDaAjuda itens={itensDaBusca} grande />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-14 pb-24">
        <section aria-labelledby="titulo-categorias">
          <h2 id="titulo-categorias" className="font-heading text-2xl">
            Categorias
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categorias.map(({ id, nome, descricao, icone: Icone }) => {
              const quantos = guias.filter((g) => g.grupo === id).length;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="flex h-full flex-col rounded-3xl border bg-card p-5 transition-[border-color,box-shadow] duration-200 hover:border-brand/60 hover:shadow-xl hover:shadow-ink/5"
                  >
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                      <Icone className="size-5" />
                    </span>
                    <span className="mt-4 font-heading text-lg leading-snug">{nome}</span>
                    <span className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">{descricao}</span>
                    <span className="mt-3 font-mono text-xs text-muted-foreground">
                      {quantos} {quantos === 1 ? "guia" : "guias"}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        {categorias.map(({ id, nome, icone: Icone }) => (
          <section key={id} id={id} aria-labelledby={`titulo-${id}`} className="mt-16 scroll-mt-24">
            <h2 id={`titulo-${id}`} className="flex items-center gap-3 font-heading text-2xl">
              <Icone className="size-5 text-brand" />
              {nome}
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guias
                .filter((g) => g.grupo === id)
                .map((guia) => {
                  const IconeDoGuia = iconeDoGuia[guia.slug];
                  return (
                    <li key={guia.slug}>
                      <Link
                        href={`/${guia.slug}`}
                        className="group flex h-full flex-col rounded-3xl border bg-card p-6 transition-[border-color,box-shadow] duration-200 hover:border-brand/60 hover:shadow-xl hover:shadow-ink/5"
                      >
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                          <IconeDoGuia className="size-5" />
                        </span>
                        <span className="mt-5 font-heading text-xl leading-snug">{guia.curto}</span>
                        <span className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{guia.resumo}</span>
                        <span className="mt-5 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <ClockIcon className="size-3.5" />
                            {guia.tempo}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            {guia.tipo === "passos" ? "Ver o passo a passo" : "Ler"}
                            <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}

        <section className="mt-16 grid gap-6 rounded-3xl border bg-card p-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <h2 className="font-heading text-2xl">Não achou o que procurava?</h2>
            <p className="mt-2 leading-7 text-muted-foreground">Fale com a Adsgator no WhatsApp. A gente te ajuda pelo melhor caminho.</p>
          </div>
          <a
            href={linkWhatsApp(mensagemDaAjuda)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-base font-medium text-brand-foreground hover:bg-brand/90"
          >
            <IconeWhatsApp className="size-4" />
            Falar com a gente
          </a>
        </section>
      </div>
    </>
  );
}

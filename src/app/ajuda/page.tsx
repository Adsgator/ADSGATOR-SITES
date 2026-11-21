import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "lucide-react";

import { iconeDoGuia } from "@/components/ajuda/icone-do-guia";
import { Eyebrow } from "@/components/eyebrow";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { linkWhatsApp } from "@/config/site";
import { grupos, guias, mensagemDaAjuda } from "@/content/ajuda";

export const metadata: Metadata = {
  title: { absolute: "Central de Ajuda da Adsgator" },
  description: "Passo a passo para aceitar o convite, configurar o pagamento, dar acesso ao perfil no Google e adicionar saldo no Google Ads.",
  alternates: { canonical: "/" },
};

export default function CentralDeAjuda() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-14 pb-24 sm:pt-20">
      <Eyebrow>Central de Ajuda</Eyebrow>
      <h1 className="mt-4 max-w-2xl font-heading text-4xl tracking-tight text-balance sm:text-5xl">
        Passo a passo para a sua conta
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        Os guias que a gente manda no WhatsApp e no e-mail ficam todos aqui, com as telas do Google. Travou em algum passo? É só chamar.
      </p>

      {grupos.map((grupo) => {
        const doGrupo = guias.filter((g) => g.grupo === grupo);
        if (!doGrupo.length) return null;
        return (
          <section key={grupo} className="mt-14">
            <h2 className="font-heading text-2xl">{grupo}</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {doGrupo.map((guia) => {
                const Icone = iconeDoGuia[guia.slug];
                return (
                  <li key={guia.slug}>
                    <Link
                      href={`/${guia.slug}`}
                      className="group flex h-full flex-col rounded-3xl border bg-card p-6 transition-[border-color,box-shadow] duration-200 hover:border-brand/60 hover:shadow-xl hover:shadow-ink/5"
                    >
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                        <Icone className="size-5" />
                      </span>
                      <span className="mt-5 font-heading text-xl leading-snug">{guia.curto}</span>
                      <span className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{guia.resumo}</span>
                      <span className="mt-5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <ClockIcon className="size-3.5" />
                          {guia.tempo}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          Ver o guia
                          <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section className="mt-16 grid gap-6 rounded-3xl border bg-card p-8 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <h2 className="font-heading text-2xl">Não achou o que procurava?</h2>
          <p className="mt-2 leading-7 text-muted-foreground">Fale com a Adsgator no WhatsApp. A gente te ajuda pelo caminho mais curto.</p>
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
  );
}

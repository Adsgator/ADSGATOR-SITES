import type { Metadata } from "next";

import { Eyebrow } from "@/components/eyebrow";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Adsgator · Google Ads e landing pages para negócios locais" },
  alternates: { canonical: "/" },
};

// Página simples até a Fase 3 (decisão 15 do plano): o que a Adsgator faz e
// como falar com ela.
export default function Home() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:py-28">
      <Eyebrow>Ads &amp; Web Design</Eyebrow>
      <h1 className="mt-6 font-heading text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
        Google Ads e landing pages para negócios locais
      </h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">
        A Adsgator cuida dos anúncios do seu negócio no Google e cria landing
        pages rápidas e profissionais, feitas para quem procura o seu serviço
        encontrar você e entrar em contato.
      </p>
      {/* Links com cara de botão: <a> comum, para continuarem sendo links
          (o Button do Base UI marcaria role="button"). O cn resolve as
          classes em conflito (ex.: bg-primary x bg-brand). */}
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={site.whatsapp.link}
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 rounded-full bg-brand px-7 text-base text-brand-foreground hover:bg-brand/90",
          )}
        >
          Falar pelo WhatsApp
        </a>
        <a
          href={`mailto:${site.email}`}
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "h-12 rounded-full bg-transparent px-7 text-base",
          )}
        >
          Enviar e-mail
        </a>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Atendimento: {site.horario.toLowerCase()}.
      </p>
    </section>
  );
}

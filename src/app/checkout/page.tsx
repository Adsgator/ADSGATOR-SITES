import { FormularioDoCheckout } from "@/components/checkout/formulario";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { Eyebrow } from "@/components/eyebrow";
import { mensagemDoCheckout } from "@/config/checkout";
import { linkWhatsApp } from "@/config/site";
import { servicosDoLink } from "@/lib/checkout/catalogo";

// O link traz os serviços fechados na proposta (?s=google-ads,landing-page) e
// a tela mostra só eles (Lucas, 2026-11-21): para mudar, a pessoa fala com a
// Adsgator, que manda um link novo.

export default async function PaginaDoCheckout({ searchParams }: PageProps<"/checkout">) {
  const escolhidos = servicosDoLink((await searchParams).s);

  return (
    <>
      <div className="dark section-ink bg-pattern-dark bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:pt-14 sm:pb-28">
          <Eyebrow>Contratação</Eyebrow>
          <h1 className="mt-4 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
            Falta pouco para <span className="highlight">começar</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Confira o que foi combinado, preencha os seus dados e escolha como pagar.
          </p>
        </div>
      </div>

      {/* relative: por cima da faixa, que tem posição própria (o padrão da marca). */}
      <div className="relative mx-auto -mt-14 max-w-6xl px-4 pb-14 sm:-mt-16">
        {escolhidos.length > 0 ? (
          <FormularioDoCheckout escolhidos={escolhidos} />
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm" data-link-vazio>
            <h2 className="text-lg font-semibold">Este link não traz o que contratar</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              O link de contratação é montado com o que foi combinado com você. Fale com a gente para receber o seu.
            </p>
            <a
              href={linkWhatsApp(mensagemDoCheckout)}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
            >
              <IconeWhatsApp className="size-4" />
              Falar no WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}

import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { ConteudoDaFaixa, Faixa } from "@/components/checkout/faixa";
import { mensagemDoCheckout } from "@/config/checkout";
import { linkWhatsApp } from "@/config/site";

// O endereço do checkout sem o código do link: o link certo é gerado na ficha
// do cliente, no painel, e abre em /<código> (src/app/checkout/[codigo]).

export default function PaginaDoCheckout() {
  return (
    <>
      <Faixa
        rotulo="Contratação"
        titulo={
          <>
            Falta pouco para <span className="highlight">começar</span>
          </>
        }
      />
      <ConteudoDaFaixa>
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
      </ConteudoDaFaixa>
    </>
  );
}

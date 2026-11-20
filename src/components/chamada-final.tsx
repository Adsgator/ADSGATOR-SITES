import { ArrowRightIcon } from "lucide-react";

import { BumerangueFrame } from "@/components/bumerangue";
import { CliqueAnimado } from "@/components/clique-animado";
import { buttonVariants } from "@/components/ui/button";
import { linkWhatsApp } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Chamada final de todas as páginas, no amarelo da marca: o convite do
 * diagnóstico grátis com a mensagem pronta da página e a cena do cursor
 * clicando no anúncio (roteiro do site, seção 1 e Início, seção 11). Antes
 * dela, o fundo passa para o amarelo aos poucos, sem corte seco.
 */
export function ChamadaFinal({
  titulo,
  mensagem,
  botao = "Quero um diagnóstico grátis",
}: {
  titulo: React.ReactNode;
  mensagem: string;
  botao?: string;
}) {
  return (
    <>
      <div aria-hidden="true" className="h-40 bg-[linear-gradient(to_bottom,transparent,var(--brand))]" />
      <section className="bg-brand text-brand-foreground">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <BumerangueFrame
            cantoClassName="text-ink"
            className="grid items-center gap-10 px-6 py-14 sm:px-16 lg:grid-cols-[1fr_auto]"
          >
            <div>
              <h2 className="font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
                {titulo}
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8">
                O diagnóstico é grátis e sem compromisso. Fale com a Adsgator pelo
                WhatsApp, de segunda a sexta, das 9h às 12h e das 13h30 às 17h.
              </p>
              <a
                href={linkWhatsApp(mensagem)}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-10 h-12 rounded-full bg-ink px-7 text-base text-paper hover:bg-ink/90",
                )}
              >
                {botao}
                <ArrowRightIcon />
              </a>
            </div>
            <div className="mx-auto lg:mx-0">
              <CliqueAnimado />
            </div>
          </BumerangueFrame>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { BrandLogo } from "@/components/brand";
import { RodapeLogo } from "@/components/rodape-logo";
import { paginas, servicos } from "@/config/navegacao";
import { linkWhatsApp, mensagemDiagnostico, site } from "@/config/site";

const colunas = [
  { titulo: "Serviços", links: servicos.map(({ href, titulo }) => ({ href, rotulo: titulo })) },
  { titulo: "A Adsgator", links: [...paginas] },
  {
    titulo: "Ajuda",
    links: [
      { href: "/ajuda", rotulo: "Central de Ajuda" },
      { href: "/termos", rotulo: "Termos de Serviço" },
      { href: "/privacidade", rotulo: "Política de Privacidade" },
    ],
  },
];

/** Rodapé no verde da marca (tema escuro local, com o padrão da identidade
 * visual por baixo), em colunas e com o logo de ponta a ponta no fim, como o
 * do Zouti (roteiro do site, seção 5). A razão social fica nos Termos e na
 * Privacidade. */
export function SiteFooter() {
  return (
    <footer className="dark section-ink overflow-hidden bg-background bg-pattern-dark text-sm text-foreground">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-20 pb-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr]">
        <div className="space-y-5 sm:col-span-2 lg:col-span-1">
          <BrandLogo className="h-7 w-[150px]" />
          <p className="max-w-xs leading-6 text-muted-foreground">
            Quem procura o seu serviço no Google chega ao seu WhatsApp.
          </p>
          <a
            href={linkWhatsApp(mensagemDiagnostico)}
            className="inline-flex items-center gap-2 font-medium text-brand hover:underline"
          >
            Pedir um diagnóstico grátis
            <ArrowRightIcon className="size-4" />
          </a>
        </div>
        {colunas.map(({ titulo, links }) => (
          <div key={titulo} className="space-y-3">
            <h2 className="font-mono text-xs tracking-wide text-muted-foreground">{titulo}</h2>
            <ul className="space-y-2">
              {links.map(({ href, rotulo }) => (
                <li key={href}>
                  <Link className="hover:text-brand" href={href}>
                    {rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="space-y-3">
          <h2 className="font-mono text-xs tracking-wide text-muted-foreground">
            Atendimento
          </h2>
          <ul className="space-y-2">
            <li>
              <a className="hover:text-brand" href={site.whatsapp.link}>
                WhatsApp {site.whatsapp.exibicao}
              </a>
            </li>
            <li>
              <a className="hover:text-brand" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li className="text-muted-foreground">{site.horario}</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.nome} · CNPJ {site.cnpj}
        </p>
      </div>
      <div className="px-4 pt-4 pb-10">
        <RodapeLogo />
      </div>
    </footer>
  );
}

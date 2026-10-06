import Link from "next/link";

import { BrandLogo } from "@/components/brand";
import { site } from "@/config/site";

const links = [
  { href: "/termos", rotulo: "Termos de Serviço" },
  { href: "/privacidade", rotulo: "Política de Privacidade" },
  { href: "/ajuda", rotulo: "Central de Ajuda" },
];

/** Rodapé no verde da marca (tema escuro local, com o padrão da identidade
 * visual por baixo). A razão social fica nos Termos e na Privacidade. */
export function SiteFooter() {
  return (
    <footer className="dark section-ink bg-background bg-pattern-dark text-sm text-foreground">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <BrandLogo className="h-7 w-[150px]" />
          <p className="max-w-xs leading-6 text-muted-foreground">{site.descricao}</p>
        </div>
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
        <div className="space-y-3">
          <h2 className="font-mono text-xs tracking-wide text-muted-foreground">Links</h2>
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
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.nome} · CNPJ {site.cnpj}
        </p>
      </div>
    </footer>
  );
}

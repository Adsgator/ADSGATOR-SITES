import Link from "next/link";

import { BrandLogo } from "@/components/brand";
import { site } from "@/config/site";

const links = [
  { href: "/termos", rotulo: "Termos de Serviço" },
  { href: "/privacidade", rotulo: "Política de Privacidade" },
  { href: "/ajuda", rotulo: "Central de Ajuda" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40 text-sm">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div className="space-y-3">
          <BrandLogo />
          <p className="text-muted-foreground">{site.descricao}</p>
        </div>
        <div className="space-y-2">
          <h2 className="font-medium">Atendimento</h2>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <a className="hover:text-foreground" href={site.whatsapp.link}>
                WhatsApp {site.whatsapp.exibicao}
              </a>
            </li>
            <li>
              <a className="hover:text-foreground" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>{site.horario}</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="font-medium">Links</h2>
          <ul className="space-y-1 text-muted-foreground">
            {links.map(({ href, rotulo }) => (
              <li key={href}>
                <Link className="hover:text-foreground" href={href}>
                  {rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-5xl px-4 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.nome} · CNPJ {site.cnpj}
        </p>
      </div>
    </footer>
  );
}

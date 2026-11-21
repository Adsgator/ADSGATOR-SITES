import type { Metadata } from "next";
import Link from "next/link";

import { BrandLogo } from "@/components/brand";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { ThemeToggle } from "@/components/theme-toggle";
import { AJUDA_OFICIAL } from "@/config/ajuda-enderecos";
import { linkWhatsApp, site } from "@/config/site";
import { mensagemDaAjuda } from "@/content/ajuda";

// Central de Ajuda em ajuda.adsgator.com.br (plano geral, Parte 3; decisão do
// Lucas, 2026-11-20): separada do site, com a mesma identidade, sem medição e
// sem aviso de cookies. Por dentro fica em /ajuda; o next.config.ts leva o
// endereço ajuda. para cá e tira os endereços /ajuda do www.

export const metadata: Metadata = {
  metadataBase: new URL(AJUDA_OFICIAL),
  title: {
    default: "Central de Ajuda da Adsgator",
    template: "%s · Ajuda Adsgator",
  },
  description: "Passo a passo para configurar e acompanhar a sua conta do Google Ads e o seu perfil no Google, com a Adsgator.",
  openGraph: { siteName: "Central de Ajuda da Adsgator", locale: "pt_BR", type: "website" },
};

export default function LayoutDaAjuda({ children }: LayoutProps<"/ajuda">) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <Link href="/" aria-label="Central de Ajuda da Adsgator, início" className="flex min-w-0 items-center gap-3">
            <BrandLogo />
            <span className="border-l pl-3 font-mono text-xs whitespace-nowrap text-muted-foreground">Ajuda</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <a
              href={linkWhatsApp(mensagemDaAjuda)}
              className="ml-1 inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-sm font-medium text-brand-foreground hover:bg-brand/90"
            >
              <IconeWhatsApp className="size-4" />
              <span className="hidden sm:inline">Falar com a gente</span>
              <span className="sm:hidden">Falar</span>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="font-medium text-foreground">Adsgator</p>
            <p>Atendimento no WhatsApp: {site.horario.toLowerCase()}.</p>
          </div>
          <nav aria-label="Links da Adsgator" className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={site.url} className="hover:text-foreground">Site da Adsgator</a>
            <a href={`${site.url}/termos`} className="hover:text-foreground">Termos</a>
            <a href={`${site.url}/privacidade`} className="hover:text-foreground">Privacidade</a>
          </nav>
        </div>
      </footer>
    </>
  );
}

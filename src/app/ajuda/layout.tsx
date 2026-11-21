import type { Metadata } from "next";
import Link from "next/link";
import { MailIcon, SearchIcon } from "lucide-react";

import { BuscaDaAjuda } from "@/components/ajuda/busca";
import { BrandLogo } from "@/components/brand";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { ThemeToggle } from "@/components/theme-toggle";
import { AJUDA_OFICIAL } from "@/config/ajuda-enderecos";
import { linkWhatsApp, site } from "@/config/site";
import { categorias, itensDaBusca, mensagemDaAjuda } from "@/content/ajuda";

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
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Link href="/" aria-label="Central de Ajuda da Adsgator, início" className="flex min-w-0 shrink-0 items-center gap-3">
            <BrandLogo />
            <span className="border-l pl-3 font-mono text-xs whitespace-nowrap text-muted-foreground">
              <span className="hidden sm:inline">Central de </span>Ajuda
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <div className="mr-2 hidden w-64 md:block">
              <BuscaDaAjuda itens={itensDaBusca} />
            </div>
            <Link href="/#busca" aria-label="Buscar" className="flex size-10 items-center justify-center rounded-full hover:bg-muted md:hidden">
              <SearchIcon className="size-4" />
            </Link>
            <ThemeToggle />
            <a
              href={linkWhatsApp(mensagemDaAjuda)}
              aria-label="Falar com a Adsgator no WhatsApp"
              className="ml-1 inline-flex h-10 items-center gap-2 rounded-full bg-brand px-3 text-sm font-medium text-brand-foreground hover:bg-brand/90 sm:px-4"
            >
              <IconeWhatsApp className="size-4" />
              <span className="hidden lg:inline">Falar com a gente</span>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="dark section-ink bg-background bg-pattern-dark text-sm text-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <BrandLogo className="h-7 w-[150px]" />
            <p className="max-w-xs leading-6 text-muted-foreground">Gestão de Google Ads e landing pages para quem quer ser encontrado no Google.</p>
          </div>
          <div className="space-y-3">
            <h2 className="font-mono text-xs tracking-wide text-muted-foreground">Categorias</h2>
            <ul className="space-y-2">
              {categorias.map(({ id, nome }) => (
                <li key={id}>
                  <Link href={`/#${id}`} className="hover:text-brand">
                    {nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="font-mono text-xs tracking-wide text-muted-foreground">Atendimento</h2>
            <ul className="space-y-2">
              <li>
                <a href={linkWhatsApp(mensagemDaAjuda)} className="inline-flex items-center gap-2 hover:text-brand">
                  <IconeWhatsApp className="size-4 text-muted-foreground" />
                  WhatsApp {site.whatsapp.exibicao}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-brand">
                  <MailIcon className="size-4 text-muted-foreground" />
                  {site.email}
                </a>
              </li>
              <li className="text-muted-foreground">{site.horario}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-6 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {site.nome} · CNPJ {site.cnpj}
            </p>
            <nav aria-label="Links da Adsgator" className="flex flex-wrap gap-x-5 gap-y-2">
              <a href={site.url} className="hover:text-foreground">
                Site da Adsgator
              </a>
              <a href={`${site.url}/termos`} className="hover:text-foreground">
                Termos
              </a>
              <a href={`${site.url}/privacidade`} className="hover:text-foreground">
                Privacidade
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}

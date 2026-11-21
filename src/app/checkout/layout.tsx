import type { Metadata } from "next";
import { LockIcon, MailIcon, RadarIcon } from "lucide-react";

import { BrandLogo } from "@/components/brand";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { CHECKOUT_OFICIAL, mensagemDoCheckout } from "@/config/checkout";
import { linkWhatsApp, site } from "@/config/site";

// Checkout em checkout.adsgator.com.br (plano geral, Parte 4; decisões do
// Lucas de 2026-11-21): 100% da Adsgator, sem etapa do Asaas, que só processa
// o pagamento. Abre pelo link que o Lucas manda, fora do Google; sem medição
// nem aviso de cookies (CSP no next.config.ts).

export const metadata: Metadata = {
  metadataBase: new URL(CHECKOUT_OFICIAL),
  title: { default: "Contratação · Adsgator", template: "%s · Adsgator" },
  description: "Contrate os serviços da Adsgator.",
  robots: { index: false, follow: false },
};

export default function LayoutDoCheckout({ children }: LayoutProps<"/checkout">) {
  return (
    <>
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <a href={site.url} aria-label="Site da Adsgator" className="flex shrink-0 items-center">
            <BrandLogo />
          </a>
          <ul className="flex items-center gap-5 text-xs text-muted-foreground sm:gap-8">
            <li className="hidden items-center gap-2 sm:flex">
              <RadarIcon className="size-5 text-brand" aria-hidden="true" />
              <span className="leading-tight">
                <strong className="block font-medium text-foreground">Monitorado</strong>
                24 horas
              </span>
            </li>
            <li className="flex items-center gap-2">
              <LockIcon className="size-5 text-brand" aria-hidden="true" />
              <span className="leading-tight">
                <strong className="block font-medium text-foreground">Pagamento</strong>
                seguro
              </span>
            </li>
          </ul>
        </div>
      </header>

      {/* PRÉVIA: sai quando o checkout passar a cobrar de verdade. */}
      <p className="bg-brand/15 px-4 py-2 text-center text-xs text-foreground">
        Prévia do checkout: nada é cobrado nesta versão.
      </p>

      <main className="flex-1 bg-muted/40">{children}</main>

      <footer className="border-t bg-background text-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-10 text-center">
          <div className="space-y-1">
            <p className="flex items-center justify-center gap-2 font-medium">
              <LockIcon className="size-4 text-brand" aria-hidden="true" />
              Pagamento processado pelo Asaas
            </p>
            <p className="max-w-md text-xs leading-5 text-muted-foreground">
              As cobranças são feitas pelo Asaas, a plataforma de pagamentos usada pela Adsgator. Os dados do
              cartão são enviados a ele em conexão segura e não ficam guardados com a gente.
            </p>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted-foreground">
            <li>
              <a href={linkWhatsApp(mensagemDoCheckout)} className="inline-flex items-center gap-2 hover:text-foreground">
                <IconeWhatsApp className="size-4" />
                {site.whatsapp.exibicao}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-foreground">
                <MailIcon className="size-4" />
                {site.email}
              </a>
            </li>
          </ul>
          <nav aria-label="Documentos" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <a href={`${site.url}/termos`} target="_blank" rel="noopener" className="hover:text-foreground">
              Termos de Serviço
            </a>
            <a href={`${site.url}/privacidade`} target="_blank" rel="noopener" className="hover:text-foreground">
              Política de Privacidade
            </a>
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {site.nome} · CNPJ {site.cnpj}
          </p>
        </div>
      </footer>
    </>
  );
}

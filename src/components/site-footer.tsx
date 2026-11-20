import Link from "next/link";
import {
  ArrowRightIcon,
  ClockIcon,
  FileTextIcon,
  LayoutGridIcon,
  LifeBuoyIcon,
  MailIcon,
  RouteIcon,
  ShieldCheckIcon,
  UserRoundIcon,
  type LucideIcon,
} from "lucide-react";

import { BrandLogo } from "@/components/brand";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { LinkConvite } from "@/components/link-convite";
import { IconeGoogle, IconeInstagram, IconeLinkedIn } from "@/components/icones-redes";
import { RodapeLogo } from "@/components/rodape-logo";
import { servicos } from "@/config/navegacao";
import { site } from "@/config/site";

const colunas: { titulo: string; links: { href: string; rotulo: string; icone: LucideIcon }[] }[] = [
  { titulo: "Serviços", links: servicos.map(({ href, titulo, icone }) => ({ href, rotulo: titulo, icone })) },
  {
    titulo: "A Adsgator",
    links: [
      { href: "/como-funciona", rotulo: "Como funciona", icone: RouteIcon },
      { href: "/portfolio", rotulo: "Portfólio", icone: LayoutGridIcon },
      { href: "/quem-esta-por-tras", rotulo: "Quem está por trás", icone: UserRoundIcon },
    ],
  },
  {
    titulo: "Ajuda",
    links: [
      { href: "/ajuda", rotulo: "Central de Ajuda", icone: LifeBuoyIcon },
      { href: "/termos", rotulo: "Termos de Serviço", icone: FileTextIcon },
      { href: "/privacidade", rotulo: "Política de Privacidade", icone: ShieldCheckIcon },
    ],
  },
];

// Os endereços das redes vêm do Lucas depois (2026-11-20): por enquanto, só os
// ícones, sem link.
const redes = [
  { nome: "Instagram", icone: IconeInstagram },
  { nome: "LinkedIn", icone: IconeLinkedIn },
  { nome: "Perfil no Google", icone: IconeGoogle },
];

/** Rodapé de ponta a ponta no verde da marca (pedido do Lucas, 2026-11-20):
 * o convite do diagnóstico no topo, as colunas separadas por linhas e com
 * ícones, o atendimento com a Central de Ajuda em destaque, as redes e o logo
 * de ponta a ponta no fim, como o do Zouti. A razão social fica nos Termos e
 * na Privacidade. */
export function SiteFooter() {
  return (
    <footer className="dark section-ink overflow-hidden bg-background bg-pattern-dark text-sm text-foreground">
      <div className="mx-auto max-w-[96rem] px-4 pt-20 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border bg-white/[0.03] p-8 sm:p-10 md:flex-row md:items-center">
          <div>
            <p className="font-heading text-3xl leading-tight sm:text-4xl">Pronto para ser encontrado?</p>
            <p className="mt-2 text-base text-muted-foreground">
              Conte sobre o seu negócio e receba um diagnóstico grátis pelo WhatsApp.
            </p>
          </div>
          <LinkConvite
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-brand px-6 text-base font-medium text-brand-foreground transition-colors hover:bg-brand/90"
          >
            <IconeWhatsApp className="size-5" />
            Quero um diagnóstico grátis
          </LinkConvite>
        </div>

        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.5fr] lg:gap-0 lg:divide-x lg:divide-white/10">
          <div className="space-y-5 sm:col-span-2 lg:col-span-1 lg:pr-10">
            <BrandLogo className="h-7 w-[150px]" />
            <p className="max-w-xs leading-6 text-muted-foreground">
              Quem procura o seu serviço no Google chega ao seu WhatsApp.
            </p>
            <div className="flex gap-2">
              {redes.map(({ nome, icone: Icone }) => (
                <span
                  key={nome}
                  title={`${nome} (em breve)`}
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground"
                >
                  <Icone className="size-4" />
                  <span className="sr-only">{nome} (em breve)</span>
                </span>
              ))}
            </div>
          </div>
          {colunas.map(({ titulo, links }) => (
            <div key={titulo} className="space-y-4 lg:px-10">
              <h2 className="font-mono text-xs tracking-wide text-muted-foreground">{titulo}</h2>
              <ul className="space-y-3">
                {links.map(({ href, rotulo, icone: Icone }) => (
                  <li key={href}>
                    <Link className="group inline-flex items-center gap-2.5 transition-colors hover:text-brand" href={href}>
                      <Icone aria-hidden="true" className="size-4 text-muted-foreground transition-colors group-hover:text-brand" />
                      {rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1 lg:pl-10">
            <h2 className="font-mono text-xs tracking-wide text-muted-foreground">Atendimento</h2>
            <ul className="space-y-3">
              <li>
                <a className="inline-flex items-center gap-2.5 hover:text-brand" href={site.whatsapp.link}>
                  <IconeWhatsApp className="size-4 text-muted-foreground" />
                  WhatsApp {site.whatsapp.exibicao}
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2.5 hover:text-brand" href={`mailto:${site.email}`}>
                  <MailIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <ClockIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                {site.horario}
              </li>
            </ul>
            <Link
              href="/ajuda"
              className="group block rounded-2xl border border-brand/40 bg-brand/10 p-5 transition-colors hover:bg-brand/15"
            >
              <span className="flex items-center gap-2 font-medium text-brand">
                <LifeBuoyIcon aria-hidden="true" className="size-4" />
                Precisa de ajuda?
              </span>
              <span className="mt-2 block leading-6 text-muted-foreground">
                Guias passo a passo: criar a conta do Google Ads, dar acesso e adicionar saldo.
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 font-medium">
                Ver os guias
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-white/10">
        <p className="mx-auto max-w-[96rem] px-4 py-6 text-xs text-muted-foreground sm:px-8 lg:px-12">
          © {new Date().getFullYear()} {site.nome} · CNPJ {site.cnpj}
        </p>
      </div>
      <div className="px-4 pt-4 pb-10">
        <RodapeLogo />
      </div>
    </footer>
  );
}

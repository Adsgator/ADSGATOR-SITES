"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { MenuIcon } from "lucide-react";

import { BrandLogo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

// Navegação do topo; cresce com as seções da página inicial (Fase 3).
const navegacao = [{ href: "/ajuda", rotulo: "Ajuda" }];

// Menu do celular: tudo o que o site tem hoje.
const menu = [
  { href: "/", rotulo: "Início" },
  { href: "/ajuda", rotulo: "Central de Ajuda" },
  { href: "/termos", rotulo: "Termos de Serviço" },
  { href: "/privacidade", rotulo: "Política de Privacidade" },
];

const botaoMarca = cn(
  buttonVariants(),
  "h-9 rounded-full bg-brand px-4 text-brand-foreground hover:bg-brand/90",
);

function assinarRolagem(avisar: () => void) {
  window.addEventListener("scroll", avisar, { passive: true });
  return () => window.removeEventListener("scroll", avisar);
}

/**
 * Cabeçalho fixo. No topo da página ocupa a largura; ao rolar, vira uma barra
 * flutuante arredondada, com fundo translúcido e desfocado (como o da Apple).
 * No celular, a navegação abre numa gaveta.
 */
export function SiteHeader() {
  const rolou = useSyncExternalStore(
    assinarRolagem,
    () => window.scrollY > 16,
    () => false,
  );
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3">
      <div
        data-rolou={rolou ? "" : undefined}
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-full border border-transparent px-4 transition-all duration-500 ease-(--ease-out) data-rolou:mt-3 data-rolou:h-14 data-rolou:max-w-5xl data-rolou:border-border data-rolou:bg-background/75 data-rolou:shadow-[0_12px_32px_-16px_rgb(31_39_27/0.35)] data-rolou:backdrop-blur-xl"
      >
        <Link href="/" aria-label="Adsgator, página inicial" className="shrink-0">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navegacao.map(({ href, rotulo }) => (
            <Link
              key={href}
              href={href}
              className={cn(buttonVariants({ variant: "ghost" }), "h-9 rounded-full px-4")}
            >
              {rotulo}
            </Link>
          ))}
          <ThemeToggle />
          <a href={site.whatsapp.link} className={cn(botaoMarca, "ml-1")}>
            Fale conosco
          </a>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
                />
              }
            >
              <MenuIcon />
              <span className="sr-only">Abrir o menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-full gap-0 p-6 pt-16 sm:max-w-sm">
              <SheetTitle className="font-mono text-xs tracking-wide text-muted-foreground">
                Menu
              </SheetTitle>
              <nav className="mt-6 flex flex-col">
                {/* Links comuns (o SheetClose do Base UI os marcaria como
                    botão); o clique fecha a gaveta pelo estado. */}
                {menu.map(({ href, rotulo }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuAberto(false)}
                    className="border-b py-4 font-heading text-2xl"
                  >
                    {rotulo}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-3 pt-10 text-sm text-muted-foreground">
                <a href={site.whatsapp.link} className={cn(botaoMarca, "h-11 w-full")}>
                  Fale conosco pelo WhatsApp
                </a>
                <p>{site.horario}</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

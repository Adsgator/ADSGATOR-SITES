import Link from "next/link";

import type { GuiaSlug } from "@/config/ajuda-enderecos";
import { categorias, guias } from "@/content/ajuda";
import { cn } from "@/lib/utils";

/** Todas as categorias e os guias de cada uma, com o guia aberto marcado. */
export function MenuLateral({ atual }: { atual: GuiaSlug }) {
  return (
    <nav aria-label="Categorias e guias" className="space-y-6">
      {categorias.map(({ id, nome, icone: Icone }) => (
        <div key={id}>
          <Link href={`/#${id}`} className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground">
            <Icone className="size-3.5" />
            {nome}
          </Link>
          <ul className="mt-2 space-y-0.5">
            {guias
              .filter((g) => g.grupo === id)
              .map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/${g.slug}`}
                    aria-current={g.slug === atual ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-1.5 text-sm leading-snug transition-colors",
                      g.slug === atual ? "bg-brand/10 font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {g.curto}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

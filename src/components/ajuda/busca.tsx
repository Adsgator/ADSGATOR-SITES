"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";

import { iconeDoGuia } from "@/components/ajuda/icone-do-guia";
import type { GuiaSlug } from "@/config/ajuda-enderecos";
import { cn } from "@/lib/utils";

export type ItemDaBusca = { slug: GuiaSlug; curto: string; resumo: string; categoria: string; texto: string };

/** Sem acento e em minúsculas: "Métricas" e "metricas" se acham. */
const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/**
 * Busca da central: filtra os guias enquanto a pessoa digita (título, resumo,
 * categoria e palavras do dia a dia), com as setas e o Enter para escolher.
 * Tudo na tela, sem mandar a pesquisa para lugar nenhum.
 */
export function BuscaDaAjuda({ itens, grande = false }: { itens: ItemDaBusca[]; grande?: boolean }) {
  const router = useRouter();
  const id = useId();
  const campo = useRef<HTMLInputElement>(null);
  const [termo, setTermo] = useState("");
  const [aberta, setAberta] = useState(false);
  const [marcado, setMarcado] = useState(0);

  const resultados = useMemo(() => {
    const palavras = normalizar(termo).split(/\s+/).filter(Boolean);
    if (!palavras.length) return [];
    return itens
      .map((item) => {
        const titulo = normalizar(item.curto);
        const tudo = normalizar(`${item.curto} ${item.resumo} ${item.categoria} ${item.texto}`);
        if (!palavras.every((p) => tudo.includes(p))) return null;
        // O que bate no título vem primeiro.
        return { item, pontos: palavras.filter((p) => titulo.includes(p)).length };
      })
      .filter((r) => r !== null)
      .sort((a, b) => b.pontos - a.pontos)
      .map((r) => r.item);
  }, [itens, termo]);

  const ir = (slug: GuiaSlug) => {
    setAberta(false);
    router.push(`/${slug}`);
  };

  const mostrar = aberta && termo.trim().length > 0;

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center gap-3 rounded-full border bg-card px-4 transition-colors focus-within:border-brand",
          grande ? "h-14 shadow-xl shadow-ink/5" : "h-10",
        )}
      >
        <SearchIcon className={cn("shrink-0 text-muted-foreground", grande ? "size-5" : "size-4")} />
        <input
          ref={campo}
          type="search"
          role="combobox"
          aria-expanded={mostrar}
          aria-controls={`${id}-lista`}
          aria-activedescendant={mostrar && resultados[marcado] ? `${id}-${resultados[marcado].slug}` : undefined}
          aria-label="Buscar na Central de Ajuda"
          placeholder={grande ? "Busque por saldo, convite, nota fiscal…" : "Buscar"}
          value={termo}
          onChange={(e) => {
            setTermo(e.target.value);
            setMarcado(0);
            setAberta(true);
          }}
          onFocus={() => setAberta(true)}
          onBlur={() => setTimeout(() => setAberta(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setMarcado((m) => Math.min(m + 1, resultados.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setMarcado((m) => Math.max(m - 1, 0));
            } else if (e.key === "Enter" && resultados[marcado]) {
              e.preventDefault();
              ir(resultados[marcado].slug);
            } else if (e.key === "Escape") {
              setAberta(false);
            }
          }}
          className={cn("min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden", grande ? "text-base" : "text-sm")}
        />
        {termo && (
          <button
            type="button"
            aria-label="Limpar a busca"
            onClick={() => {
              setTermo("");
              campo.current?.focus();
            }}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      {mostrar && (
        <div
          id={`${id}-lista`}
          role="listbox"
          aria-label="Guias encontrados"
          className={cn("absolute inset-x-0 z-50 mt-2 overflow-hidden rounded-3xl border bg-card p-2 shadow-2xl shadow-ink/10", !grande && "min-w-80 right-0 left-auto")}
        >
          {resultados.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">Nenhum guia com &ldquo;{termo.trim()}&rdquo;. Fale com a gente no WhatsApp que a gente ajuda.</p>
          ) : (
            resultados.slice(0, 6).map((item, i) => {
              const Icone = iconeDoGuia[item.slug];
              return (
                <button
                  key={item.slug}
                  id={`${id}-${item.slug}`}
                  type="button"
                  role="option"
                  aria-selected={i === marcado}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setMarcado(i)}
                  onClick={() => ir(item.slug)}
                  className={cn("flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left", i === marcado && "bg-muted")}
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icone className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{item.curto}</span>
                    <span className="block truncate text-xs text-muted-foreground">{item.categoria}</span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

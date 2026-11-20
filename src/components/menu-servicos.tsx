"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { LinkConvite } from "@/components/link-convite";
import { servicos } from "@/config/navegacao";
import { cn } from "@/lib/utils";

/**
 * "Serviços" no topo: abre um painel ao passar o mouse ou clicar, como o menu
 * do Zouti (pedido do Lucas, 2026-11-20). Fecha ao sair com o mouse, com Esc
 * ou ao escolher um item; fechado, o painel fica fora do teclado (`inert`).
 */
export function MenuServicos() {
  const [aberto, setAberto] = useState(false);
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Com o mouse, passar por cima já abre: o clique só mantém aberto (senão
  // ele fecharia o que acabou de abrir). No teclado e no toque, alterna.
  const ponteiro = useRef<string>("");

  const abrir = () => {
    clearTimeout(espera.current);
    setAberto(true);
  };
  const fecharLogo = () => {
    espera.current = setTimeout(() => setAberto(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={abrir}
      onMouseLeave={fecharLogo}
      onKeyDown={(e) => e.key === "Escape" && setAberto(false)}
    >
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls="menu-servicos"
        onPointerDown={(e) => (ponteiro.current = e.pointerType)}
        onClick={() => {
          // Lido antes: o React roda a função do setAberto só depois.
          const comMouse = ponteiro.current === "mouse";
          ponteiro.current = "";
          setAberto((a) => (comMouse ? true : !a));
        }}
        className={cn(buttonVariants({ variant: "ghost" }), "h-9 gap-1 rounded-full px-4")}
      >
        Serviços
        <ChevronDownIcon className={cn("size-4 transition-transform duration-300", aberto && "rotate-180")} />
      </button>
      <div
        id="menu-servicos"
        inert={!aberto}
        data-aberto={aberto ? "" : undefined}
        className="pointer-events-none absolute top-full left-1/2 w-[44rem] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-[opacity,translate] duration-300 ease-(--ease-out) data-aberto:pointer-events-auto data-aberto:translate-y-0 data-aberto:opacity-100"
      >
        <div className="rounded-3xl border bg-background/95 p-3 shadow-[0_24px_48px_-24px_rgb(31_39_27/0.45)] backdrop-blur-xl">
          <div className="grid grid-cols-3 gap-2">
            {servicos.map(({ href, titulo, linha, icone: Icone }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setAberto(false)}
                className="group rounded-2xl p-4 transition-colors hover:bg-muted"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-brand-foreground transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Icone className="size-5" />
                </span>
                <p className="mt-4 font-heading text-lg">{titulo}</p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">{linha}</p>
              </Link>
            ))}
          </div>
          <LinkConvite
            className="mt-2 flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3 text-sm transition-colors hover:bg-muted"
          >
            <span>
              <span className="font-medium">Não sabe por onde começar?</span>{" "}
              <span className="text-muted-foreground">Peça um diagnóstico grátis.</span>
            </span>
            <ArrowRightIcon className="size-4" />
          </LinkConvite>
        </div>
      </div>
    </div>
  );
}

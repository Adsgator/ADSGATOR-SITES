"use client";

import Image from "next/image";
import { useState } from "react";

import type { PaginaPortfolio } from "@/config/portfolio";

/**
 * Passar o mouse ou focar algo dentro do cartão (o link, pelo teclado). O
 * cartão espalha `eventos` e passa `ativo` para a JanelaPagina.
 */
export function usePassarMouse() {
  const [ativo, setAtivo] = useState(false);
  const entrar = () => setAtivo(true);
  const sair = () => setAtivo(false);
  return { ativo, eventos: { onPointerEnter: entrar, onPointerLeave: sair, onFocus: entrar, onBlur: sair } };
}

/**
 * Uma página do portfólio numa janela de navegador, com o celular por cima.
 * Ativa (mouse em cima ou foco), a foto da página inteira carrega e rola até o
 * fim; ao sair, volta. A foto inteira só carrega na primeira vez que é pedida,
 * para não pesar a página.
 */
export function JanelaPagina({
  pagina: { id, segmento, site, alturaInteira },
  ativo,
  sizes,
}: {
  pagina: PaginaPortfolio;
  ativo: boolean;
  sizes: string;
}) {
  const [pediu, setPediu] = useState(false);
  const [carregou, setCarregou] = useState(false);
  if (ativo && !pediu) setPediu(true);
  const rolando = ativo && carregou;
  // Mais longa a página, mais tempo para rolar (a janela mostra 0,625 da largura).
  const segundos = Math.max(3, (alturaInteira / 960 - 0.625) * 0.95);

  return (
    <div className="relative pb-8">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-[0_30px_60px_-35px_rgb(31_39_27/0.6)]">
        <div className="flex items-center gap-1.5 border-b px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-muted" />
          <span className="size-2.5 rounded-full bg-muted" />
          <span className="size-2.5 rounded-full bg-muted" />
          <span className="ml-3 truncate font-mono text-xs text-muted-foreground">{site ?? "projeto anterior"}</span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden [container-type:size]">
          <Image
            src={`/portfolio/${id}-pc.jpg`}
            alt={`Página de ${segmento.toLowerCase()} feita pela Adsgator`}
            fill
            sizes={sizes}
            className="object-cover object-top"
          />
          {pediu && (
            <Image
              src={`/portfolio/${id}-inteira.jpg`}
              alt=""
              width={960}
              height={alturaInteira}
              sizes={sizes}
              onLoad={() => setCarregou(true)}
              data-inteira={rolando ? "rolando" : ""}
              style={{
                transform: rolando ? "translateY(calc(-100% + 100cqh))" : "translateY(0)",
                transition: rolando ? `transform ${segundos}s ease-in-out` : "transform 0.8s var(--ease-out)",
              }}
              className="absolute inset-x-0 top-0 h-auto w-full"
            />
          )}
        </div>
      </div>
      <div className="absolute right-4 bottom-0 w-[22%] min-w-16 overflow-hidden rounded-[1.1rem] border-4 border-ink bg-ink shadow-xl">
        <Image
          src={`/portfolio/${id}-cel.jpg`}
          alt=""
          width={390}
          height={844}
          sizes="8rem"
          className="block h-auto w-full rounded-[0.8rem]"
        />
      </div>
    </div>
  );
}

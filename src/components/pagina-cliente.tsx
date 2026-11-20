import { MenuIcon } from "lucide-react";

import { IconeWhatsApp } from "@/components/icone-whatsapp";

import type { Segmento } from "@/config/segmentos";

// Landing page de um cliente fictício (config/segmentos.ts), desenhada para
// caber dentro dos celulares do site (pedido do Lucas, 2026-11-20: uma página
// mais elaborada, para não passar impressão de algo simples). Cada segmento
// tem a sua paleta, para mostrar que cada página é sob medida. Fluida, de 200
// a 270 px de largura; o celular pequeno dos cartões reduz com `scale`.

export function PaginaCliente({ s }: { s: Segmento }) {
  const { icone: Icone } = s;
  const cores = { "--fundo": s.fundo, "--destaque": s.destaque } as React.CSSProperties;
  return (
    <div style={cores} className="relative w-full min-w-[200px] bg-[#F5F7FA] text-[#0B1F3A]">
      <div className="flex items-center justify-between bg-(--fundo) px-3 py-2.5 text-white">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="flex size-5 items-center justify-center rounded-md bg-(--destaque) text-(--fundo)">
            <Icone className="size-3" />
          </span>
          {s.nome}
        </span>
        <MenuIcon className="size-3.5 opacity-80" />
      </div>

      <div className="relative overflow-hidden bg-(--fundo) px-3 pt-3 pb-4 text-white">
        <div className="absolute -top-10 -right-12 size-40 rounded-full bg-(--destaque) opacity-25 blur-2xl" />
        <span className="relative inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[8px]">
          <span className="size-1.5 rounded-full bg-(--destaque)" />
          {s.selo}
        </span>
        <p className="relative mt-2 text-[19px] leading-[1.1] font-bold tracking-tight">
          {s.titulo} <span className="text-(--destaque)">{s.tituloDestaque}</span>
        </p>
        <p className="relative mt-1.5 text-[9px] leading-[1.45] text-white/70">{s.sub}</p>
        <span className="relative mt-3 flex h-7 items-center justify-center gap-1.5 rounded-full bg-[#25D366] text-[9px] font-semibold text-[#0B1F3A]">
          <IconeWhatsApp className="size-3" />
          {s.cta}
        </span>
        <div className="relative mt-3 h-24 overflow-hidden rounded-xl bg-[linear-gradient(135deg,rgb(255_255_255/0.14),transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_23px,rgb(255_255_255/0.06)_24px),linear-gradient(90deg,transparent_23px,rgb(255_255_255/0.06)_24px)] bg-[size:24px_24px]" />
          <Icone className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-(--destaque) opacity-80" />
          <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[7px] font-semibold text-[#0B1F3A]">
            {s.fotoSelo}
          </span>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-hidden px-3 py-2.5 text-[7.5px] font-medium">
        {s.chips.map((item) => (
          <span key={item} className="shrink-0 rounded-full border border-[#0B1F3A]/10 bg-white px-2 py-1">
            {item}
          </span>
        ))}
      </div>

      <div className="px-3 pb-3">
        <p className="text-[12px] font-bold">O que fazemos</p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {s.servicos.map(({ icone: IconeServico, titulo }) => (
            <div key={titulo} className="rounded-lg border border-[#0B1F3A]/8 bg-white p-2 shadow-sm">
              <IconeServico className="size-3.5 text-(--fundo)" />
              <p className="mt-1.5 text-[8.5px] font-semibold">{titulo}</p>
              <span className="mt-1 block h-1 w-4/5 rounded-full bg-[#0B1F3A]/10" />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-3 rounded-xl bg-white p-2.5 shadow-sm">
        <p className="text-[12px] font-bold">Como funciona</p>
        {s.passos.map((passo, i) => (
          <div key={passo} className="mt-2 flex items-center gap-2 text-[8.5px]">
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-(--fundo) text-[7px] font-bold text-white">
              {i + 1}
            </span>
            {passo}
          </div>
        ))}
      </div>

      <div className="m-3 rounded-xl bg-(--fundo) p-3 text-center text-white">
        <p className="text-[11px] font-bold">{s.chamada}</p>
        <span className="mt-2 inline-flex h-6 items-center gap-1 rounded-full bg-[#25D366] px-3 text-[8.5px] font-semibold text-[#0B1F3A]">
          <IconeWhatsApp className="size-2.5" />
          Chamar no WhatsApp
        </span>
      </div>

      <p className="px-3 pb-4 text-center text-[7px] text-[#0B1F3A]/50">{s.nome} · {s.site}</p>

      <span className="absolute right-2 bottom-10 flex size-8 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg">
        <IconeWhatsApp className="size-4" />
      </span>
    </div>
  );
}

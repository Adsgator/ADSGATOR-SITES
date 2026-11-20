import { ArrowRightIcon, CheckIcon, MapPinIcon, MenuIcon, PlusIcon, StarIcon } from "lucide-react";

import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { IconeInstagram } from "@/components/icones-redes";
import type { Segmento } from "@/config/segmentos";
import { cn } from "@/lib/utils";

// Landing page de um cliente fictício (config/segmentos.ts), desenhada para
// caber dentro dos celulares do site. Refeita em 2026-11-20 a pedido do Lucas
// (os exemplos pareciam simples e genéricos): foto de verdade na abertura,
// logotipo e paleta próprios, títulos com ou sem serifa conforme o segmento e
// mais seções, como uma página real da Adsgator; na rodada de profundidade
// (2026-11-20, "parece simples demais"), ganhou quem somos, depoimentos,
// perguntas e a área atendida, as 9 partes de uma página completa. Fluida, de 200 a 270 px de
// largura; o celular pequeno dos cartões reduz com `scale`.
//
// `montados` (página de landing page, topo): mostra só as primeiras partes; as
// outras ficam como contorno tracejado, ocupando o mesmo lugar (a página não
// muda de altura enquanto se monta). Sem ele, tudo aparece. `destaque`
// (página de landing page, "A página por dentro"): contorna a parte da vez.

/** Quantas partes a página tem, para quem a monta aos poucos. */
export const PARTES_DA_PAGINA = 9;

export function PaginaCliente({ s, montados, destaque }: { s: Segmento; montados?: number; destaque?: number }) {
  const cores = { "--fundo": s.fundo, "--destaque": s.destaque } as React.CSSProperties;
  const titulo = s.serifa ? "font-heading font-normal tracking-tight" : "font-extrabold tracking-[-0.02em] uppercase";
  const tituloSecao = cn("mt-1 text-[13px] leading-tight", s.serifa ? "font-heading" : "font-bold");
  const rotulo = "text-[7px] font-semibold tracking-[0.18em] text-(--fundo) uppercase";
  return (
    <div style={cores} className="relative w-full min-w-[200px] bg-[#F7F6F3] text-[#141414]">
      <Parte i={0} montados={montados} destaque={destaque}>
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-3 py-2.5 text-white">
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full border border-(--destaque) text-[9px] font-bold text-(--destaque)",
              s.serifa && "font-heading font-normal",
            )}
          >
            {s.sigla}
          </span>
          <span className={cn("text-[10px] leading-none", s.serifa ? "font-heading" : "font-bold tracking-wide uppercase")}>
            {s.nome}
          </span>
        </span>
        <MenuIcon className="size-3.5 opacity-90" />
      </div>

      <div className="relative overflow-hidden bg-(--fundo) px-3 pt-12 pb-5 text-white">
        <div style={{ backgroundImage: `url(${s.foto})` }} className="absolute inset-0 bg-cover bg-center opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--fundo)_55%,transparent)_0%,var(--fundo)_92%)]" />
        <span className="relative inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/20 px-2 py-0.5 text-[7.5px] backdrop-blur">
          <span className="size-1.5 rounded-full bg-(--destaque)" />
          {s.selo}
        </span>
        <p className={cn("relative mt-3 text-[19px] leading-[1.08]", titulo)}>
          {s.titulo} <span className="text-(--destaque)">{s.tituloDestaque}</span>
        </p>
        <p className="relative mt-2 text-[8.5px] leading-[1.5] text-white/80">{s.sub}</p>
        <div className="relative mt-3.5 flex flex-col gap-1.5">
          <span data-cta-whatsapp className="flex h-7 items-center justify-center gap-1.5 rounded-full bg-[#25D366] text-[8.5px] font-semibold text-[#0B2A17]">
            <IconeWhatsApp className="size-3" />
            {s.cta}
          </span>
          <span className="flex h-6 items-center justify-center gap-1 rounded-full border border-white/30 text-[8px]">
            Conhecer os serviços
            <ArrowRightIcon className="size-2.5" />
          </span>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-x-2.5 gap-y-1 text-[7.5px] text-white/85">
          {s.diferenciais.map((item) => (
            <span key={item} className="flex items-center gap-1">
              <CheckIcon className="size-2.5 text-(--destaque)" />
              {item}
            </span>
          ))}
        </div>
      </div>
      </Parte>

      <Parte i={1} montados={montados} destaque={destaque}>
      <div className="px-3 pt-4 pb-3">
        <p className={rotulo}>O que fazemos</p>
        <p className={tituloSecao}>{s.titulos.servicos}</p>
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          {s.servicos.map(({ icone: Icone, titulo: nome, texto }) => (
            <div key={nome} className="rounded-xl bg-white p-2 shadow-[0_4px_12px_-6px_rgb(0_0_0/0.25)]">
              <span className="flex size-5 items-center justify-center rounded-md bg-(--fundo) text-(--destaque)">
                <Icone className="size-3" />
              </span>
              <p className="mt-1.5 text-[8px] font-semibold">{nome}</p>
              <p className="mt-0.5 text-[6.5px] leading-[1.4] text-[#141414]/60">{texto}</p>
            </div>
          ))}
        </div>
      </div>
      </Parte>

      <Parte i={2} montados={montados} destaque={destaque}>
      <div className="px-3 pt-1 pb-3">
        <p className={cn(tituloSecao, "mb-2")}>{s.titulos.sobre}</p>
        <div className="flex gap-2.5 rounded-xl bg-white p-2.5 shadow-[0_4px_12px_-6px_rgb(0_0_0/0.25)]">
          <div style={{ backgroundImage: `url(${s.foto})` }} className="size-12 shrink-0 rounded-lg bg-cover bg-center" />
          <div>
            <p className={rotulo}>Quem somos</p>
            <p className="mt-1 text-[7.5px] leading-[1.45] text-[#141414]/75">{s.sobre}</p>
          </div>
        </div>
      </div>
      </Parte>

      <Parte i={3} montados={montados} destaque={destaque}>
      <div className="mx-3 overflow-hidden rounded-xl bg-(--fundo) text-white">
        <div style={{ backgroundImage: `url(${s.foto})` }} className="h-16 bg-cover bg-center opacity-80" />
        <div className="p-2.5">
          <p className={cn("text-[11px]", s.serifa ? "font-heading" : "font-bold")}>Como funciona</p>
          {s.passos.map((passo, i) => (
            <div key={passo} className="mt-1.5 flex items-center gap-2 text-[8px]">
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-(--destaque) text-[7px] font-bold text-(--fundo)">
                {i + 1}
              </span>
              {passo}
            </div>
          ))}
        </div>
      </div>
      </Parte>

      <Parte i={4} montados={montados} destaque={destaque}>
      <div className="px-3 pt-4 pb-2">
        <p className={rotulo}>Depoimentos</p>
        <p className={tituloSecao}>{s.titulos.depoimentos}</p>
        <div className="mt-2 space-y-1.5">
          {s.depoimentos.map(({ nome, texto }) => (
            <div key={nome} className="rounded-xl bg-white p-2 shadow-[0_4px_12px_-6px_rgb(0_0_0/0.25)]">
              <span className="flex gap-0.5 text-[#E8A317]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <StarIcon key={i} className="size-2 fill-current" />
                ))}
              </span>
              <p className="mt-1 text-[7.5px] leading-[1.45]">“{texto}”</p>
              <p className="mt-0.5 text-[6.5px] text-[#141414]/55">{nome}</p>
            </div>
          ))}
        </div>
      </div>
      </Parte>

      <Parte i={5} montados={montados} destaque={destaque}>
      <div className="px-3 pt-2 pb-2">
        <p className={tituloSecao}>Perguntas frequentes</p>
        <div className="mt-1.5 divide-y divide-[#141414]/10 border-y border-[#141414]/10">
          {s.perguntas.map((pergunta) => (
            <div key={pergunta} className="flex items-center justify-between gap-2 py-1.5 text-[7.5px]">
              {pergunta}
              <PlusIcon className="size-2.5 shrink-0 text-(--fundo)" />
            </div>
          ))}
        </div>
      </div>
      </Parte>

      <Parte i={6} montados={montados} destaque={destaque}>
      <div className="mx-3 mt-1 rounded-xl border border-(--fundo)/15 bg-white p-2.5">
        <p className={cn("flex items-center gap-1 text-[9px]", s.serifa ? "font-heading" : "font-bold")}>
          <MapPinIcon className="size-2.5 text-(--fundo)" />
          Onde atendemos
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {s.area.map((lugar) => (
            <span key={lugar} className="rounded-full bg-(--fundo)/10 px-1.5 py-0.5 text-[7px]">
              {lugar}
            </span>
          ))}
        </div>
      </div>
      </Parte>

      <Parte i={7} montados={montados} destaque={destaque}>
      <div className="m-3 rounded-xl border border-(--fundo)/15 bg-white p-3 text-center">
        <p className={cn("text-[12px] leading-tight", s.serifa ? "font-heading" : "font-bold")}>{s.chamada}</p>
        <span className="mt-2 inline-flex h-6 items-center gap-1 rounded-full bg-[#25D366] px-3 text-[8px] font-semibold text-[#0B2A17]">
          <IconeWhatsApp className="size-2.5" />
          Chamar no WhatsApp
        </span>
      </div>
      </Parte>

      <Parte i={8} montados={montados} destaque={destaque}>
      {/* O rodapé completo, montado como o das páginas reais da Adsgator: a
          frase do negócio, o contato rápido, onde e quando atende, os links,
          os serviços e as páginas legais. O botão flutuante entra com ele. */}
      <div className="relative bg-(--fundo) px-3 pt-4 pb-3 text-white">
        <span className="absolute -top-11 right-2 flex size-8 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg">
          <IconeWhatsApp className="size-4" />
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full border border-(--destaque) text-[8px] font-bold text-(--destaque)",
              s.serifa && "font-heading font-normal",
            )}
          >
            {s.sigla}
          </span>
          <span className={cn("text-[9px] leading-none", s.serifa ? "font-heading" : "font-bold tracking-wide uppercase")}>
            {s.nome}
          </span>
        </span>
        <p className="mt-2 text-[7px] leading-[1.5] text-white/70">{s.rodape.descricao}</p>
        <div className="mt-2.5 rounded-lg bg-white/10 p-2">
          <p className="text-[7px] font-semibold">Contato rápido</p>
          <p className="mt-0.5 text-[6.5px] text-white/65">Tire suas dúvidas e peça o seu orçamento.</p>
          <span className="mt-1.5 flex h-5 items-center justify-center gap-1 rounded-full bg-[#25D366] text-[7px] font-semibold text-[#0B2A17]">
            <IconeWhatsApp className="size-2.5" />
            Falar pelo WhatsApp
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-[6.5px] leading-[1.6] text-white/75">
          <div>
            <p className="mb-0.5 text-[6px] font-semibold tracking-[0.14em] text-(--destaque) uppercase">Atendimento</p>
            <p>{s.area.slice(0, 3).join(" · ")}</p>
            <p>{s.rodape.horario}</p>
          </div>
          <div>
            <p className="mb-0.5 text-[6px] font-semibold tracking-[0.14em] text-(--destaque) uppercase">Navegar</p>
            {["Serviços", "Quem somos", "Depoimentos", "Perguntas"].map((link) => (
              <p key={link}>{link}</p>
            ))}
          </div>
        </div>
        <p className="mt-3 border-t border-white/15 pt-2 text-[6px] text-white/55">{s.servicos.map((x) => x.titulo).join(" • ")}</p>
        <div className="mt-2 flex items-center justify-between gap-2 text-[5.5px] text-white/45">
          <span className="flex items-center gap-1.5">
            <IconeInstagram className="size-2.5" />
            <MapPinIcon className="size-2.5" />
            {s.cidade}
          </span>
          <span>Privacidade · Termos de Uso</span>
        </div>
        <p className="mt-1 text-[5.5px] text-white/40">© 2026 {s.nome}. Todos os direitos reservados.</p>
      </div>
      </Parte>
    </div>
  );
}

/** Uma parte da página. Ainda não montada, o conteúdo fica invisível no mesmo
 * lugar e um contorno tracejado mostra onde ele vai entrar. */
function Parte({
  i,
  montados,
  destaque,
  children,
}: {
  i: number;
  montados?: number;
  destaque?: number;
  children: React.ReactNode;
}) {
  const montada = montados === undefined || i < montados;
  return (
    <div data-parte={i} data-destaque={i === destaque ? "" : undefined} className="relative">
      {i === destaque && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0.5 z-20 rounded-lg ring-2 ring-[#FFB100]" />
      )}
      <div className={cn("transition-all duration-700 ease-(--ease-out)", !montada && "translate-y-2 opacity-0 blur-[2px]")}>
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-1.5 rounded-lg border border-dashed border-[#141414]/30 bg-[#141414]/[0.03] p-2 transition-opacity duration-500",
          montada && "opacity-0",
        )}
      >
        <span className="block h-1.5 w-1/3 rounded-full bg-[#141414]/15" />
        <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-[#141414]/10" />
      </div>
    </div>
  );
}

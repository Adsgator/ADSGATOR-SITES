import { ClockIcon, LightbulbIcon, MenuIcon, MessageCircleIcon, PlugIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";

// Landing page de um cliente fictício ("Volt Elétrica"), desenhada para caber
// dentro dos celulares do site (pedido do Lucas, 2026-11-20: uma página mais
// elaborada, para não passar impressão de algo simples). Paleta própria do
// cliente, para mostrar que cada página é sob medida. Fluida, de 200 a 270 px de
// largura; o celular pequeno dos cartões reduz com `scale`.

const servicos = [
  { icone: PlugIcon, titulo: "Tomadas e quadros" },
  { icone: LightbulbIcon, titulo: "Iluminação" },
  { icone: ZapIcon, titulo: "Instalações" },
  { icone: ShieldCheckIcon, titulo: "Manutenção" },
];

export function PaginaCliente() {
  return (
    <div className="relative w-full min-w-[200px] bg-[#F5F7FA] text-[#0B1F3A]">
      <div className="flex items-center justify-between bg-[#0B1F3A] px-3 py-2.5 text-white">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="flex size-5 items-center justify-center rounded-md bg-[#22D3EE] text-[#0B1F3A]">
            <ZapIcon className="size-3" />
          </span>
          Volt Elétrica
        </span>
        <MenuIcon className="size-3.5 opacity-80" />
      </div>

      <div className="relative overflow-hidden bg-[#0B1F3A] px-3 pt-3 pb-4 text-white">
        <div className="absolute -top-10 -right-12 size-40 rounded-full bg-[#22D3EE]/25 blur-2xl" />
        <span className="relative inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[8px]">
          <ClockIcon className="size-2.5 text-[#22D3EE]" />
          Atendimento hoje em Campinas
        </span>
        <p className="relative mt-2 text-[19px] leading-[1.1] font-bold tracking-tight">
          Eletricista em Campinas, <span className="text-[#22D3EE]">no mesmo dia</span>
        </p>
        <p className="relative mt-1.5 text-[9px] leading-[1.45] text-white/70">
          Instalações, reparos e quadros com segurança, para casa e empresa.
        </p>
        <span className="relative mt-3 flex h-7 items-center justify-center gap-1.5 rounded-full bg-[#25D366] text-[9px] font-semibold text-[#0B1F3A]">
          <MessageCircleIcon className="size-3" />
          Pedir orçamento no WhatsApp
        </span>
        <div className="relative mt-3 h-24 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#123B6B,#0B1F3A_60%)]">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_23px,rgb(255_255_255/0.06)_24px),linear-gradient(90deg,transparent_23px,rgb(255_255_255/0.06)_24px)] bg-[size:24px_24px]" />
          <ZapIcon className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-[#22D3EE]/70" />
          <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[7px] font-semibold text-[#0B1F3A]">
            Técnicos com NR-10
          </span>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-hidden px-3 py-2.5 text-[7.5px] font-medium">
        {["Orçamento sem custo", "Garantia no serviço", "Nota fiscal"].map((item) => (
          <span key={item} className="shrink-0 rounded-full border border-[#0B1F3A]/10 bg-white px-2 py-1">
            {item}
          </span>
        ))}
      </div>

      <div className="px-3 pb-3">
        <p className="text-[12px] font-bold">O que fazemos</p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {servicos.map(({ icone: Icone, titulo }) => (
            <div key={titulo} className="rounded-lg border border-[#0B1F3A]/8 bg-white p-2 shadow-sm">
              <Icone className="size-3.5 text-[#0EA5C6]" />
              <p className="mt-1.5 text-[8.5px] font-semibold">{titulo}</p>
              <span className="mt-1 block h-1 w-4/5 rounded-full bg-[#0B1F3A]/10" />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-3 rounded-xl bg-white p-2.5 shadow-sm">
        <p className="text-[12px] font-bold">Como funciona</p>
        {["Você chama no WhatsApp", "A gente passa o orçamento", "O técnico vai até você"].map((passo, i) => (
          <div key={passo} className="mt-2 flex items-center gap-2 text-[8.5px]">
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#0B1F3A] text-[7px] font-bold text-white">
              {i + 1}
            </span>
            {passo}
          </div>
        ))}
      </div>

      <div className="m-3 rounded-xl bg-[#0B1F3A] p-3 text-center text-white">
        <p className="text-[11px] font-bold">Precisa de um eletricista hoje?</p>
        <span className="mt-2 inline-flex h-6 items-center gap-1 rounded-full bg-[#25D366] px-3 text-[8.5px] font-semibold text-[#0B1F3A]">
          <MessageCircleIcon className="size-2.5" />
          Chamar no WhatsApp
        </span>
      </div>

      <p className="px-3 pb-4 text-center text-[7px] text-[#0B1F3A]/50">Volt Elétrica · Campinas e região</p>

      <span className="absolute right-2 bottom-10 flex size-8 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg">
        <MessageCircleIcon className="size-4" />
      </span>
    </div>
  );
}

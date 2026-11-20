import { MapPinIcon, SearchIcon, XIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

// O diagnóstico de exemplo na página de Google Ads (rodada de profundidade,
// Lucas, 2026-11-20): o que o diagnóstico olha, num cliente fictício (a Ampère
// Elétrica de config/segmentos.ts). Sem números (roteiro do site, seção 1: nas
// telas desenhadas, nada que pareça resultado); as formas mostram o que é
// medido. As buscas que não interessam são as negativas do processo de Google
// Ads (Base).

const buscas = ["eletricista em campinas", "eletricista 24 horas", "troca de disjuntor", "instalação de chuveiro", "eletricista perto de mim"];
const foraDoAlvo = ["curso de eletricista", "vaga de eletricista", "como trocar tomada sozinho"];
const cidades = ["Campinas", "Valinhos", "Sumaré", "Hortolândia"];
const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
// Intensidade de 0 a 3 por faixa do dia (manhã, almoço, tarde, noite): só a forma.
const procura = [
  [2, 1, 3, 1],
  [3, 1, 3, 1],
  [2, 1, 2, 1],
  [3, 2, 3, 1],
  [2, 1, 3, 2],
  [3, 2, 1, 0],
  [1, 0, 1, 0],
];
const tons = ["bg-muted", "bg-brand/25", "bg-brand/55", "bg-brand"];

export function DiagnosticoExemplo() {
  return (
    <Reveal className="rounded-3xl border bg-card p-6 shadow-2xl shadow-ink/10 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-5">
        <div>
          <p className="font-mono text-xs text-muted-foreground">Diagnóstico · exemplo</p>
          <p className="mt-1 font-heading text-2xl">Ampère Elétrica</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm">
          <MapPinIcon className="size-3.5" />
          Campinas (SP)
        </span>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs text-muted-foreground">O que as pessoas digitam</p>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {buscas.map((b) => (
              <li key={b} className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1.5">
                <SearchIcon className="size-3" />
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-xs text-muted-foreground">O que não interessa (fica de fora)</p>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
            {foraDoAlvo.map((b) => (
              <li key={b} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 line-through decoration-muted-foreground/50">
                <XIcon className="size-3 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs text-muted-foreground">Quando procuram</p>
          <div aria-hidden="true" className="mt-3 grid grid-cols-[2.25rem_repeat(4,1fr)] gap-1 text-[0.65rem] text-muted-foreground">
            <span />
            {["Manhã", "Almoço", "Tarde", "Noite"].map((f) => (
              <span key={f} className="text-center">
                {f}
              </span>
            ))}
            {dias.map((d, i) => (
              <div key={d} className="contents">
                <span className="self-center">{d}</span>
                {procura[i].map((n, j) => (
                  <span key={j} className={`h-4 rounded-sm ${tons[n]}`} />
                ))}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Cruzado com os horários em que você atende.</p>
          <p className="mt-6 font-mono text-xs text-muted-foreground">Onde anunciar</p>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {cidades.map((c, i) => (
              <li key={c} className={i === 0 ? "rounded-full bg-ink px-3 py-1.5 text-paper" : "rounded-full border px-3 py-1.5"}>
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">Com verba menor, começa pela cidade principal.</p>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <p className="font-mono text-xs text-muted-foreground">A verba, para a sua realidade</p>
        <div aria-hidden="true" className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
          <span className="rounded-2xl border px-4 py-3">
            <span className="block font-medium">Começar menor</span>
            <span className="text-xs text-muted-foreground">Uma cidade, o horário principal</span>
          </span>
          <span className="rounded-2xl bg-brand px-4 py-3 text-brand-foreground">
            <span className="block font-medium">Indicada</span>
            <span className="text-xs">Para a procura da sua região</span>
          </span>
          <span className="rounded-2xl border px-4 py-3">
            <span className="block font-medium">Ir mais longe</span>
            <span className="text-xs text-muted-foreground">Mais cidades e mais horários</span>
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Você vê o que cada uma compra, e quem escolhe é você.</p>
      </div>
    </Reveal>
  );
}

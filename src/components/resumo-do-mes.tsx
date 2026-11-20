import { BrandMark } from "@/components/brand";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { Reveal } from "@/components/motion/reveal";

// O resumo do mês como chega no WhatsApp (rodada de profundidade, Lucas,
// 2026-11-20), do cliente fictício eletricista: os números (só as barras, sem
// valor: nas telas desenhadas, nada que pareça resultado) e o "O que fizemos",
// que o painel monta com o que mudou na conta (plano de qualidade, Fase 5).

const numeros = [
  { rotulo: "Pessoas que viram o anúncio", largura: "w-[88%]" },
  { rotulo: "Visitas à página", largura: "w-[56%]" },
  { rotulo: "Toques no WhatsApp", largura: "w-[30%]" },
];

const fizemos = [
  "Cortamos buscas de quem procurava curso, não o serviço",
  "Os anúncios passaram a aparecer só no seu horário de atendimento",
  "Testamos um título novo com “atendimento hoje”",
];

export function ResumoDoMes() {
  return (
    <Reveal className="overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-ink/10">
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <BrandMark className="size-9 rounded-full" />
        <div className="leading-tight">
          <p className="font-medium">Adsgator</p>
          <p className="text-xs text-muted-foreground">no seu WhatsApp e por e-mail</p>
        </div>
        <span className="ml-auto flex size-8 items-center justify-center rounded-full bg-success text-white">
          <IconeWhatsApp className="size-4" />
        </span>
      </div>
      <div aria-hidden="true" className="bg-muted/40 p-5">
        <div className="max-w-[92%] rounded-2xl rounded-tl-sm border bg-background p-4 text-sm leading-6">
          <p className="font-semibold">Resumo do mês · Ampère Elétrica</p>
          <div className="mt-3 space-y-2.5">
            {numeros.map(({ rotulo, largura }) => (
              <div key={rotulo}>
                <p className="text-xs text-muted-foreground">{rotulo}</p>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div className={`h-full rounded-full bg-brand ${largura}`} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-semibold">O que fizemos</p>
          <ul className="mt-1 space-y-1">
            {fizemos.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-brand">•</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { ClipboardPasteIcon, MessageCircleQuestionIcon } from "lucide-react";

import { BolinhasDeCor } from "@/components/briefing/cores";
import { Desenho, desenhoDe } from "@/components/briefing/desenho";
import type { Exemplo } from "@/lib/briefing/amostra-preenchida";
import { lerAmostra } from "@/lib/briefing/guardado-da-amostra";
import { emTexto, progresso, visiveis, type Briefing } from "@/lib/briefing/regras";
import { sinalDa, type Sinal } from "@/lib/briefing/sinais";
import { fraseDoVisual } from "@/lib/briefing/temas";
import { cn } from "@/lib/utils";

// Só na amostra: como a agência vai ver as respostas, com os sinais. A tela de
// verdade é do painel.

const sinais: Record<Sinal, { rotulo: string; texto: string; icone: typeof ClipboardPasteIcon }> = {
  colada: { rotulo: "Chegou pronta", texto: "O texto entrou de uma vez. Vale ler com mais cuidado.", icone: ClipboardPasteIcon },
  colada_e_mexida: { rotulo: "Chegou pronta e foi mexida", texto: "Parte do texto entrou de uma vez.", icone: ClipboardPasteIcon },
  curta: { rotulo: "Curta", texto: "Pode render uma boa pergunta no WhatsApp.", icone: MessageCircleQuestionIcon },
};

const semAssinatura = () => () => {};

export function VisaoDaAgencia({ briefing, exemplo }: { briefing: Briefing; exemplo?: Exemplo }) {
  const noNavegador = useSyncExternalStore(semAssinatura, () => true, () => false);
  if (!noNavegador) return null;
  const { respostas, colados, enviado } = lerAmostra(briefing.slug, exemplo);
  const desenho = desenhoDe(briefing, respostas);
  const { feitas, total, porcento } = progresso(briefing, respostas);
  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-[minmax(0,1fr)] items-start gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
      <p className="text-sm text-muted-foreground">Só na amostra, como você vai ver</p>
      <h1 className="mt-2 font-heading text-3xl">{briefing.segmento}</h1>
      <p className="mt-2 text-muted-foreground">
        {enviado ? "Enviado" : `Respondendo, ${porcento}%`} · {feitas} de {total} respostas
      </p>
      {briefing.secoes.map((s, i) => (
        <section key={s} className="mt-8">
          <h2 className="font-heading text-xl">{s}</h2>
          <ul className="mt-3 divide-y rounded-2xl border bg-card">
            {visiveis(briefing, respostas)
              .filter((p) => p.secao === i)
              .map((p) => {
                const linhas = emTexto(p, briefing, respostas);
                const sinal = sinalDa(p, respostas, colados);
                const visual = sinal && sinais[sinal];
                return (
                  <li key={p.id} className="px-5 py-4" data-resposta={p.id} data-sinal={sinal ?? ""}>
                    <p className="text-sm text-muted-foreground">{p.titulo}</p>
                    {linhas.length ? (
                      linhas.map((l, j) => (
                        <p key={j} className="mt-1 [overflow-wrap:anywhere] whitespace-pre-wrap">
                          {l}
                        </p>
                      ))
                    ) : (
                      <p className="mt-1 text-muted-foreground">Ainda sem resposta</p>
                    )}
                    {p.tipo === "cores" && linhas.length > 0 && <BolinhasDeCor opcoes={respostas[p.id].opcoes ?? []} />}
                    {visual && (
                      <p
                        className={cn(
                          "mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-sm",
                          sinal === "curta" ? "bg-muted" : "bg-brand/20",
                        )}
                      >
                        <visual.icone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <span>
                          <strong className="font-medium">{visual.rotulo}.</strong> {visual.texto}
                        </span>
                      </p>
                    )}
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
      </div>
      {/* A página (ou o anúncio) que a pessoa viu se montando, com o visual que escolheu. */}
      <aside className="lg:sticky lg:top-6" data-desenho-da-agencia>
        <p className="mb-3 text-sm font-medium">{briefing.tipo === "pagina" ? "A página que se montou" : "O anúncio que se montou"}</p>
        <div className="max-h-[75vh] overflow-y-auto overscroll-contain rounded-2xl">
          <Desenho desenho={desenho} refinado />
        </div>
        {desenho.tipo === "pagina" && (
          <p className="mt-4 text-center font-heading text-lg leading-snug text-balance">
            {fraseDoVisual(desenho.blocos.estilos, desenho.blocos.cores, desenho.blocos.sensacoes)}
          </p>
        )}
      </aside>
    </main>
  );
}

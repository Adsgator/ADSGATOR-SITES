"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  BarChart3Icon,
  BellRingIcon,
  CheckIcon,
  ClipboardListIcon,
  GlobeIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  PenToolIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from "lucide-react";

import { useMotionPaused } from "@/components/motion/motion-scope";
import { useApareceu } from "@/components/motion/numero-que-sobe";
import { cn } from "@/lib/utils";

// "Quem está por trás", uma pessoa e um sistema (rodada de profundidade, Lucas,
// 2026-11-20): o que o painel da Adsgator faz o dia inteiro (sistema, Fases 5 e
// 6 e plano de qualidade: números do Google Ads o dia todo, a conferência de
// cada página, o aviso quando um site cai ou um anúncio é reprovado, a revisão
// da semana preparada) e o que fica com o Lucas. Sem fingir equipe (Base): o
// sistema não é gente. O registro ao lado é um exemplo, que anda sozinho
// quando aparece na tela e para no botão de pausar (precisa de um MotionScope).

const registro = [
  { texto: "Página conferida: botões, número, cookies e cadeado", icone: ShieldCheckIcon },
  { texto: "Números do Google Ads atualizados", icone: BarChart3Icon },
  { texto: "Site no ar, respondendo normal", icone: GlobeIcon },
  { texto: "Nenhum anúncio reprovado pelo Google", icone: MegaphoneIcon },
  { texto: "Revisão da semana pronta para eu analisar", icone: ClipboardListIcon },
  { texto: "Saldo da conta conferido", icone: BellRingIcon },
];

const comigo = [
  { texto: "Decido o que mudar na campanha", icone: BarChart3Icon },
  { texto: "Escrevo os anúncios e desenho a página", icone: PenToolIcon },
  { texto: "Resolvo o que o sistema encontra", icone: WrenchIcon },
  { texto: "Converso com você no WhatsApp", icone: MessageCircleIcon },
];

const VISIVEIS = 4;
const INTERVALO_MS = 1800;

export function EuEOSistema() {
  const caixa = useRef<HTMLDivElement>(null);
  const apareceu = useApareceu(caixa);
  const pausado = useMotionPaused();
  // Quantos registros já entraram; os últimos VISIVEIS aparecem, o mais novo em cima.
  const [entrados, setEntrados] = useState(VISIVEIS);

  useEffect(() => {
    if (!apareceu || pausado) return;
    const id = setInterval(() => setEntrados((n) => n + 1), INTERVALO_MS);
    return () => clearInterval(id);
  }, [apareceu, pausado]);

  const visiveis = Array.from({ length: VISIVEIS }, (_, i) => entrados - 1 - i);

  return (
    <div ref={caixa} data-eu-e-o-sistema className="grid gap-5 lg:grid-cols-2">
      <div className="dark section-ink relative rounded-3xl border bg-background p-8 text-foreground">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-xs text-brand">O sistema, o dia inteiro</p>
          <span className="rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">exemplo</span>
        </div>
        <p className="mt-3 font-heading text-2xl leading-snug">Acompanha cada conta e cada página, e me avisa na hora.</p>
        <ul className="mt-6 space-y-2.5">
          {visiveis.map((n, i) => {
            const { texto, icone: Icone } = registro[n % registro.length];
            return (
              <motion.li
                key={n}
                layout
                data-registro
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: i === 0 ? 1 : 0.75 - i * 0.15, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 rounded-xl border bg-card/40 px-3.5 py-2.5 text-sm"
              >
                <Icone className="size-4 shrink-0 text-brand" />
                <span className="min-w-0 flex-1">{texto}</span>
                <span className="shrink-0 font-mono text-[0.65rem] text-muted-foreground">{i === 0 ? "agora" : `há ${i * 3} min`}</span>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <div className="rounded-3xl border bg-card p-8">
        <p className="font-mono text-xs text-muted-foreground">Eu, no que precisa de gente</p>
        <p className="mt-3 font-heading text-2xl leading-snug">Olho o que o sistema mostra e faço o trabalho.</p>
        <ul className="mt-6 space-y-4">
          {comigo.map(({ texto, icone: Icone }, i) => (
            <li key={texto} className="flex items-center gap-3 leading-7">
              <span
                data-comigo-marcado={apareceu ? "" : undefined}
                style={{ transitionDelay: `${i * 200}ms` }}
                className={cn(
                  "relative flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300",
                  apareceu ? "border-brand bg-brand text-brand-foreground" : "text-muted-foreground",
                )}
              >
                <Icone className="size-4" />
                <span
                  aria-hidden="true"
                  style={{ transitionDelay: `${i * 200 + 150}ms` }}
                  className={cn(
                    "absolute -right-1.5 -bottom-1.5 flex size-4 items-center justify-center rounded-full bg-success text-white transition-transform duration-300",
                    apareceu ? "scale-100" : "scale-0",
                  )}
                >
                  <CheckIcon className="size-2.5" />
                </span>
              </span>
              {texto}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

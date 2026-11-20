import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Fundo da hero da página de Google Ads (pedido do Lucas, 2026-11-20): buscas
// de vários serviços subindo devagar em colunas, cada uma num ritmo, como as
// buscas acontecendo agora. Aparecem do lado do Google e ficam bem apagadas
// atrás do texto, para não atrapalhar a leitura. Só
// CSS (classe `subir` no globals.css): para no botão de pausar da área
// (MotionScope). Decorativo.

const buscas = [
  "eletricista em campinas",
  "dentista perto de mim",
  "advogado trabalhista",
  "encanador 24 horas",
  "pet shop aberto agora",
  "conserto de ar condicionado",
  "nutricionista online",
  "móveis planejados",
  "adestrador de cães",
  "clínica de estética",
  "chaveiro perto de mim",
  "fisioterapeuta em sorocaba",
  "contador para mei",
  "dedetização residencial",
  "psicólogo online",
  "desentupidora",
  "oficina mecânica",
  "creche para cães",
  "vidraçaria em jundiaí",
  "veterinário 24h",
  "escola de inglês",
  "pintor residencial",
  "marmoraria",
  "academia perto de mim",
];

// Duração da volta e o ponto em que cada coluna começa, para não andarem juntas.
const colunas = [
  { duracao: 70, atraso: -12 },
  { duracao: 54, atraso: -40 },
  { duracao: 82, atraso: -5 },
  { duracao: 62, atraso: -30 },
  { duracao: 76, atraso: -50 },
  { duracao: 58, atraso: -20 },
];

export function BuscasNoAr({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(transparent,#000_15%,#000_75%,transparent)]",
        className,
      )}
    >
      <div className="flex h-full justify-between gap-4 px-4 [mask-image:linear-gradient(to_right,rgb(0_0_0/0.1),rgb(0_0_0/0.1)_48%,#000_72%)] max-lg:[mask-image:linear-gradient(rgb(0_0_0/0.12),rgb(0_0_0/0.12)_50%,#000_80%)]">
        {colunas.map(({ duracao, atraso }, c) => {
          // Cada coluna mostra uma parte diferente da lista.
          const daColuna = buscas.filter((_, i) => i % colunas.length === c).concat(buscas.filter((_, i) => i % colunas.length === (c + 3) % colunas.length));
          return (
            <div key={c} className={cn("w-52 shrink-0", c >= 3 && "max-sm:hidden", c >= 4 && "max-lg:hidden")}>
              <div
                style={{ "--subir-duracao": `${duracao}s`, animationDelay: `${atraso}s` } as React.CSSProperties}
                className="motion-loop subir flex flex-col gap-7"
              >
                {/* A lista duas vezes, para a volta não ter emenda. */}
                {[...daColuna, ...daColuna].map((busca, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-2 text-xs whitespace-nowrap text-muted-foreground/80"
                  >
                    <SearchIcon className="size-3 shrink-0" />
                    {busca}
                    {i % 5 === 2 && <span className="ml-auto size-1.5 shrink-0 rounded-full bg-brand" />}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

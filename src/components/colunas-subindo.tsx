import Image from "next/image";
import { CheckIcon, SearchIcon, StarIcon } from "lucide-react";

import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { portfolio } from "@/config/portfolio";
import { cn } from "@/lib/utils";

// Fundo das heros das páginas de serviço (pedido do Lucas, 2026-11-20): peças
// subindo devagar em colunas, cada uma num ritmo. Aparecem do lado do visual e
// ficam bem apagadas atrás do texto, para não atrapalhar a leitura. Só CSS
// (classe `subir` no globals.css): para no botão de pausar da área
// (MotionScope). Decorativo. Cada página escolhe as peças: as buscas
// acontecendo (Google Ads), as partes de uma página (landing page), as
// conferências feitas (manutenção), as etapas andando (como funciona) ou as
// páginas do portfólio no celular (portfólio) ou a trajetória do Lucas (quem
// está por trás).

// Duração da volta e o ponto em que cada coluna começa, para não andarem juntas.
const colunas = [
  { duracao: 70, atraso: -12 },
  { duracao: 54, atraso: -40 },
  { duracao: 82, atraso: -5 },
  { duracao: 62, atraso: -30 },
  { duracao: 76, atraso: -50 },
  { duracao: 58, atraso: -20 },
];

/**
 * `minimo`: quantas peças cada metade da coluna precisa ter. A volta só não tem
 * buraco se a metade for mais alta que a área do topo (no celular, ~1.450 px);
 * com peças baixas (textos), a lista da coluna se repete até chegar lá
 * (`tests/fundos.mjs` mede). Peças altas (os celulares do portfólio) pedem menos.
 */
function ColunasSubindo({ pecas, espaco = "gap-7", minimo = 28 }: { pecas: React.ReactNode[]; espaco?: string; minimo?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(transparent,#000_15%,#000_75%,transparent)]"
    >
      <div className="flex h-full justify-between gap-4 px-4 [mask-image:linear-gradient(to_right,rgb(0_0_0/0.1),rgb(0_0_0/0.1)_48%,#000_72%)] max-lg:[mask-image:linear-gradient(rgb(0_0_0/0.12),rgb(0_0_0/0.12)_50%,#000_80%)]">
        {colunas.map(({ duracao, atraso }, c) => {
          // Cada coluna mostra uma parte diferente da lista.
          const daColuna = pecas
            .filter((_, i) => i % colunas.length === c)
            .concat(pecas.filter((_, i) => i % colunas.length === (c + 3) % colunas.length));
          const vezes = Math.max(1, Math.ceil(minimo / daColuna.length));
          const metade = Array.from({ length: vezes }, () => daColuna).flat();
          // Mais repetições, volta mais longa: a velocidade fica a mesma.
          return (
            <div key={c} className={cn("w-52 shrink-0", c >= 3 && "max-sm:hidden", c >= 4 && "max-lg:hidden")}>
              <div
                style={{ "--subir-duracao": `${duracao * vezes}s`, animationDelay: `${atraso * vezes}s` } as React.CSSProperties}
                className={cn("motion-loop subir flex flex-col", espaco)}
              >
                {/* A metade duas vezes, para a volta não ter emenda. */}
                {[...metade, ...metade].map((peca, i) => (
                  <div key={i}>{peca}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

/** Google Ads: as buscas acontecendo agora. */
export function BuscasNoAr() {
  return (
    <ColunasSubindo
      pecas={buscas.map((busca, i) => (
        <span
          key={busca}
          className="flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-2 text-xs whitespace-nowrap text-muted-foreground/80"
        >
          <SearchIcon className="size-3 shrink-0" />
          {busca}
          {i % 5 === 2 && <span className="ml-auto size-1.5 shrink-0 rounded-full bg-brand" />}
        </span>
      ))}
    />
  );
}

/** Landing page: as partes de uma página, em contorno, como num rascunho. */
export function PartesNoAr() {
  const linha = "block h-1.5 rounded-full bg-muted-foreground/20";
  const caixa = (rotulo: string, conteudo: React.ReactNode) => (
    <div key={rotulo} className="rounded-2xl border border-dashed border-muted-foreground/35 bg-card/50 p-3.5">
      <p className="font-mono text-[0.65rem] text-muted-foreground/80">{rotulo}</p>
      <div className="mt-2.5">{conteudo}</div>
    </div>
  );
  const partes = [
    caixa(
      "Topo",
      <>
        <span className={cn(linha, "h-2.5 w-4/5")} />
        <span className={cn(linha, "mt-1.5 w-3/5")} />
        <span className="mt-3 block h-5 w-24 rounded-full bg-brand/50" />
      </>,
    ),
    caixa(
      "Serviços",
      <div className="grid grid-cols-2 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="block h-8 rounded-lg bg-muted-foreground/12" />
        ))}
      </div>,
    ),
    caixa(
      "Depoimentos",
      <>
        <span className="flex gap-0.5 text-brand/70">
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} className="size-3 fill-current" />
          ))}
        </span>
        <span className={cn(linha, "mt-2 w-full")} />
        <span className={cn(linha, "mt-1.5 w-2/3")} />
      </>,
    ),
    caixa(
      "WhatsApp",
      <span className="flex h-6 items-center justify-center gap-1.5 rounded-full bg-success/45 text-[0.6rem] text-white">
        <IconeWhatsApp className="size-3" />
        Chamar agora
      </span>,
    ),
    caixa(
      "Como funciona",
      <div className="space-y-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="size-3 shrink-0 rounded-full bg-brand/45" />
            <span className={cn(linha, "w-3/4")} />
          </span>
        ))}
      </div>,
    ),
    caixa(
      "Perguntas",
      <div className="space-y-2">
        {[0, 1].map((i) => (
          <span key={i} className="flex items-center justify-between">
            <span className={cn(linha, "w-2/3")} />
            <span className="text-[0.65rem] text-muted-foreground/70">+</span>
          </span>
        ))}
      </div>,
    ),
  ];
  // Duas vezes, para as 6 colunas terem peças diferentes em ordens diferentes.
  return <ColunasSubindo pecas={[...partes, ...partes.slice(3), ...partes.slice(0, 3)]} espaco="gap-6" />;
}

const conferencias = [
  "Página no ar",
  "Cadeado em dia",
  "Domínio renovado",
  "Cópia de segurança feita",
  "WhatsApp funcionando",
  "Medição ativa",
];
const sites = ["ampereeletrica.com.br", "lumiereodonto.com.br", "valentemoraes.adv.br"];

/** Manutenção: as conferências feitas, uma página de cada vez. */
export function ConferenciasNoAr() {
  return (
    <ColunasSubindo
      espaco="gap-6"
      pecas={Array.from({ length: 18 }, (_, i) => (
        <span key={i} className="flex flex-col gap-1 rounded-2xl border bg-card/60 px-3.5 py-2.5 text-xs text-muted-foreground/80">
          <span className="flex items-center gap-2">
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-success/60 text-white">
              <CheckIcon className="size-2.5" />
            </span>
            {conferencias[i % conferencias.length]}
          </span>
          <span className="pl-6 font-mono text-[0.65rem] opacity-80">{sites[Math.floor(i / conferencias.length) % sites.length]}</span>
        </span>
      ))}
    />
  );
}

const etapas = [
  "Diagnóstico feito",
  "Proposta enviada",
  "Contrato aceito",
  "Briefing recebido",
  "Campanha no ar",
  "Página entregue",
  "Revisão da semana",
  "Resumo do mês enviado",
];
const negocios = ["Ampère Elétrica", "Lumière Odontologia", "Valente & Moraes"];

/** Como funciona: as etapas andando, um negócio de cada vez. */
export function EtapasNoAr() {
  return (
    <ColunasSubindo
      espaco="gap-6"
      pecas={Array.from({ length: etapas.length * negocios.length }, (_, i) => (
        <span key={i} className="flex flex-col gap-1 rounded-2xl border bg-card/60 px-3.5 py-2.5 text-xs text-muted-foreground/80">
          <span className="flex items-center gap-2">
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/60 text-brand-foreground">
              <CheckIcon className="size-2.5" />
            </span>
            {etapas[i % etapas.length]}
          </span>
          <span className="pl-6 text-[0.65rem] opacity-80">{negocios[Math.floor(i / etapas.length) % negocios.length]}</span>
        </span>
      ))}
    />
  );
}

/** Portfólio: as páginas dos clientes no celular, o trabalho de verdade. */
export function PaginasNoAr() {
  const celulares = portfolio.map(({ id }) => (
    <div key={id} className="overflow-hidden rounded-[1.6rem] border-4 border-ink bg-ink shadow-lg">
      <Image src={`/portfolio/${id}-cel.jpg`} alt="" width={390} height={844} sizes="13rem" className="block h-auto w-full rounded-[1.2rem]" />
    </div>
  ));
  return <ColunasSubindo pecas={[...celulares, ...celulares.slice(2), ...celulares.slice(0, 2)]} espaco="gap-6" minimo={1} />;
}

const trajetoria = [
  "Serralheria",
  "Torno",
  "Manutenção industrial",
  "Manutenção de computadores",
  "Flash, em 2010",
  "Web design",
  "Programação",
  "Google Ads",
  "Landing pages",
  "Medição de contatos",
  "Inteligência artificial",
  "Design",
];

/** Quem está por trás: o que o Lucas aprendeu pelo caminho. */
export function TrajetoriaNoAr() {
  return (
    <ColunasSubindo
      pecas={trajetoria.map((item, i) => (
        <span
          key={item}
          className="flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-2 text-xs whitespace-nowrap text-muted-foreground/80"
        >
          <span className={i % 4 === 1 ? "size-1.5 shrink-0 rounded-full bg-brand" : "size-1.5 shrink-0 rounded-full bg-muted-foreground/40"} />
          {item}
        </span>
      ))}
    />
  );
}

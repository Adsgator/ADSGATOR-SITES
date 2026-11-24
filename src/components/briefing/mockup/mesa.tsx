"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { Cartaz, Galeria, luzes, type Fatos, type Visual } from "@/components/briefing/mockup/cena";
import { letras, type NomeDaLetra } from "@/components/briefing/mockup/letras";
import { paletas, semEstilo, textoSobre } from "@/lib/briefing/temas";
import { cn } from "@/lib/utils";

// A mesa para olhar as composições (só no `next dev`): trocar o negócio, a cor, a letra e a
// luz, e ver a cena se montando do começo.

const negocios: Record<string, Fatos> = {
  Helena: {
    nome: "Helena Prado Advocacia",
    lugar: "Campinas e todo o estado",
    principal: "Verbas rescisórias",
    servicos: ["Horas extras", "Rescisão indireta", "Trabalho sem carteira"],
    numero: ["9 anos", "de experiência"],
    foto: "/forms/previa/balanca.webp",
  },
  Rafa: {
    nome: "Rafa Adestramento",
    lugar: "Campinas e Valinhos",
    principal: "Comportamento",
    servicos: ["Filhotes", "Adestramento básico", "Consultoria online"],
    numero: ["250", "famílias atendidas"],
    foto: "/forms/previa/cao.webp",
  },
  "Sem foto": {
    nome: "Bia Andrade",
    lugar: "Campinas",
    principal: "Limpeza de pele",
    servicos: ["Massagem relaxante", "Design de sobrancelha", "Drenagem"],
    numero: ["5 anos", "de experiência"],
  },
};

const DAS_CENAS: Record<"Galeria" | "Cartaz", { cor: Record<string, string>; letra: NomeDaLetra }> = {
  Galeria: { cor: { Helena: "Rosa e vinho", Rafa: "Verde-petróleo", "Sem foto": "Pêssego e café" }, letra: "Fina" },
  Cartaz: { cor: { Helena: "Azul confiança", Rafa: "Azul e laranja", "Sem foto": "Coral e lilás" }, letra: "Alta" },
};

const neutro = { fundo: semEstilo.fundo, tinta: semEstilo.tinta, destaque: semEstilo.destaque, apoio: semEstilo.apoio };

/** As respostas chegando, na ordem do briefing. */
const passos: (keyof Fatos)[][] = [[], ["nome", "foto"], ["lugar"], ["principal", "servicos"], ["numero"]];

function Escolha<T extends string>({ rotulo, opcoes, valor, mudar }: { rotulo: string; opcoes: T[]; valor: T | undefined; mudar: (v: T) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-20 text-sm text-muted-foreground">{rotulo}</span>
      {opcoes.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={o === valor}
          onClick={() => mudar(o)}
          className={cn("min-h-9 rounded-full border px-3 text-sm", o === valor ? "border-ink bg-ink text-paper" : "border-input bg-card hover:border-ring")}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Mesa() {
  const noNavegador = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [quem, setQuem] = useState("Helena");
  const [cor, setCor] = useState<string>();
  const [letra, setLetra] = useState<NomeDaLetra>();
  const [luz, setLuz] = useState<Visual["luz"]>("Luz do dia");
  // Além das respostas, um passo a mais: o estilo e as cores, que são as últimas perguntas.
  const [passo, setPasso] = useState(passos.length);
  useEffect(() => {
    if (passo >= passos.length) return;
    const t = setTimeout(() => setPasso(passo + 1), 1700);
    return () => clearTimeout(t);
  }, [passo]);
  if (!noNavegador) return null;

  const chegou = passos.slice(0, passo + 1).flat();
  const fatos = Object.fromEntries(Object.entries(negocios[quem]).filter(([k]) => chegou.includes(k as keyof Fatos))) as Fatos;
  const visualDe = (cena: keyof typeof DAS_CENAS): Visual => {
    const paleta = passo < passos.length ? neutro : paletas.find((p) => p.nome === (cor ?? DAS_CENAS[cena].cor[quem]))!;
    const { fundo, tinta, destaque, apoio } = paleta;
    return { fundo, tinta, destaque, apoio, sobre: textoSobre(destaque), letra: letra ?? DAS_CENAS[cena].letra, luz };
  };
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="font-heading text-3xl">Duas composições</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Negócios inventados. Troque a cor, a letra e a luz por cima, e veja montar do começo.</p>
      <div className="mt-6 space-y-2.5">
        <Escolha rotulo="Negócio" opcoes={Object.keys(negocios)} valor={quem} mudar={setQuem} />
        <Escolha rotulo="Cor" opcoes={paletas.map((p) => p.nome)} valor={cor} mudar={(v) => setCor(v === cor ? undefined : v)} />
        <Escolha rotulo="Letra" opcoes={Object.keys(letras) as NomeDaLetra[]} valor={letra} mudar={(v) => setLetra(v === letra ? undefined : v)} />
        <Escolha rotulo="Luz" opcoes={Object.keys(luzes) as Visual["luz"][]} valor={luz} mudar={setLuz} />
        <button type="button" onClick={() => setPasso(0)} className="min-h-11 rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground">
          Montar do começo
        </button>
      </div>
      <div className="mt-8 grid justify-items-center gap-10 md:grid-cols-2">
        <figure className="w-full max-w-[23rem]" data-cena="galeria">
          <Galeria fatos={fatos} visual={visualDe("Galeria")} />
          <figcaption className="mt-4 text-center text-sm text-muted-foreground">
            <strong className="block font-heading text-xl font-normal text-foreground">Galeria</strong>
            Para elegante, clássico, delicado e luxuoso
          </figcaption>
        </figure>
        <figure className="w-full max-w-[23rem]" data-cena="cartaz">
          <Cartaz fatos={fatos} visual={visualDe("Cartaz")} />
          <figcaption className="mt-4 text-center text-sm text-muted-foreground">
            <strong className="block font-heading text-xl font-normal text-foreground">Cartaz</strong>
            Para forte, jovem, vibrante e divertido
          </figcaption>
        </figure>
      </div>
    </main>
  );
}

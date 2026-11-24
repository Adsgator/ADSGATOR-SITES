"use client";

import { useRef, useState } from "react";
import { CheckIcon, ImageUpIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { coresDaImagem, lerCores, MAXIMO_DE_CORES } from "@/lib/briefing/ler-cores";
import type { Pergunta, Resposta } from "@/lib/briefing/regras";
import { corDe, coresSoltas, paletas, textoSobre } from "@/lib/briefing/temas";
import { cn } from "@/lib/utils";

// As cores da marca: quem sabe cola os códigos do jeito que vieram, quem tem no logo
// escolhe a imagem (que não sai do aparelho) ou aponta as cores, e quem não tem escolhe
// uma combinação pronta.

type Props = { p: Pergunta; r: Resposta | undefined; mudar: (r: Resposta) => void };

const MAXIMO = 3;

/** As cores reconhecidas. Tocar numa abre o ajuste do aparelho. */
function Reconhecidas({ cores, aoAjustar, aoTirar }: { cores: string[]; aoAjustar: (i: number, cor: string) => void; aoTirar?: (i: number) => void }) {
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" aria-label="Cores reconhecidas" data-reconhecidas>
      <AnimatePresence initial={false}>
        {cores.map((cor, i) => (
          <motion.li
            key={i}
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-xl border border-ink/15 bg-card"
          >
            <label className="block cursor-pointer" title="Toque para ajustar">
              <span className="flex h-16 items-end p-2 transition-colors" style={{ background: cor, color: textoSobre(cor) }}>
                <span className="text-xs opacity-80">{i === 0 ? "principal" : ""}</span>
              </span>
              <span className="block px-2.5 py-2 font-mono text-sm uppercase">{cor}</span>
              <input
                type="color"
                value={cor}
                onChange={(e) => aoAjustar(i, e.target.value)}
                aria-label={`Ajustar a cor ${cor}`}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
            {aoTirar && (
              <button
                type="button"
                onClick={() => aoTirar(i)}
                aria-label={`Tirar a cor ${cor}`}
                className="absolute top-1 right-1 flex size-9 items-center justify-center rounded-full bg-white/75 text-ink"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </button>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

/** Um campo só, para colar os códigos do jeito que vieram. */
function Codigos({ p, r, mudar }: Props) {
  const texto = r?.valor ?? "";
  const lidas = lerCores(texto);
  const trocar = (novo: string) => mudar({ valor: novo, opcoes: lerCores(novo).map((c) => c.cor) });
  return (
    <div className="space-y-4">
      <textarea
        value={texto}
        onChange={(e) => trocar(e.target.value)}
        aria-label={p.titulo}
        placeholder={"#8A1C5B\nRGB 20, 35, 74\nCMYK 10, 90, 30, 5"}
        rows={4}
        maxLength={2000}
        autoCapitalize="none"
        spellCheck={false}
        className="w-full resize-none rounded-xl border border-input bg-card px-4 py-3 font-mono text-base leading-7 outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
      />
      <DaImagem
        rotulo="Tenho uma imagem com as cores"
        cores={lidas.map((c) => c.cor)}
        mudar={(cores) => {
          // O que veio da imagem entra no texto, sem apagar o que a pessoa escreveu.
          const novas = cores.filter((c) => !lidas.some((l) => l.cor === c));
          if (novas.length) trocar([texto.trim(), novas.join(" ")].filter(Boolean).join("\n"));
        }}
      />
      {lidas.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-sm text-muted-foreground">
            {lidas.length === 1 ? "Reconhecemos esta cor." : `Reconhecemos estas ${lidas.length} cores.`} Toque para ajustar.
          </p>
          <Reconhecidas
            cores={lidas.map((c) => c.cor)}
            aoAjustar={(i, cor) => trocar(`${texto.slice(0, lidas[i].inicio)}${cor}${texto.slice(lidas[i].fim)}`)}
          />
        </div>
      )}
      {texto.trim().length > 3 && lidas.length === 0 && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Não reconhecemos o código, mas ele chega para a gente do jeito que você escreveu.
        </p>
      )}
    </div>
  );
}

const LADO = 320;

/** A imagem do logo: as cores saem dela, sem enviar nada, e tocar num ponto pega a cor. */
function DaImagem({ rotulo = "Escolher a imagem do logo", cores, mudar }: { rotulo?: string; cores: string[]; mudar: (cores: string[]) => void }) {
  const tela = useRef<HTMLCanvasElement>(null);
  const [aberta, setAberta] = useState(false);
  const [erro, setErro] = useState(false);

  async function abrir(arquivo: File | undefined) {
    if (!arquivo) return;
    setErro(false);
    const endereco = URL.createObjectURL(arquivo);
    try {
      const imagem = new Image();
      imagem.src = endereco;
      await imagem.decode();
      const c = tela.current;
      const ctx = c?.getContext("2d", { willReadFrequently: true });
      if (!c || !ctx) throw new Error("sem canvas");
      const escala = Math.min(1, LADO / Math.max(imagem.naturalWidth || LADO, imagem.naturalHeight || LADO));
      c.width = Math.max(1, Math.round((imagem.naturalWidth || LADO) * escala));
      c.height = Math.max(1, Math.round((imagem.naturalHeight || LADO) * escala));
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(imagem, 0, 0, c.width, c.height);
      setAberta(true);
      mudar(coresDaImagem(ctx.getImageData(0, 0, c.width, c.height)));
    } catch {
      setErro(true);
      setAberta(false);
    } finally {
      URL.revokeObjectURL(endereco);
    }
  }

  function pegar(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = e.currentTarget;
    const caixa = c.getBoundingClientRect();
    const x = Math.floor(((e.clientX - caixa.left) / caixa.width) * c.width);
    const y = Math.floor(((e.clientY - caixa.top) / caixa.height) * c.height);
    const [r, g, b, a] = c.getContext("2d", { willReadFrequently: true })?.getImageData(x, y, 1, 1).data ?? [];
    if (!a) return;
    const cor = `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    if (!cores.includes(cor)) mudar([...cores, cor].slice(-MAXIMO_DE_CORES));
  }

  return (
    <div className="space-y-3 rounded-2xl border border-ink/15 bg-card/60 p-4">
      <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed border-ring bg-card px-4 text-base font-medium hover:border-solid has-focus-visible:ring-3 has-focus-visible:ring-ring/40">
        <ImageUpIcon className="size-5" aria-hidden="true" />
        {aberta ? "Trocar a imagem" : rotulo}
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => void abrir(e.target.files?.[0])} data-imagem-do-logo />
      </label>
      <p className="text-sm text-pretty text-muted-foreground">
        As cores saem sozinhas. A imagem fica só no seu aparelho, e o arquivo você manda no fim, pela pasta.
      </p>
      {erro && <p className="text-sm font-medium text-destructive">Não deu para abrir esse arquivo. Tente um PNG ou JPG, ou toque nas cores abaixo.</p>}
      <div className={cn("overflow-hidden rounded-xl bg-white p-3", !aberta && "hidden")}>
        <canvas ref={tela} onPointerDown={pegar} aria-label="Toque na imagem para pegar uma cor" className="mx-auto max-h-44 max-w-full cursor-crosshair touch-manipulation" />
        <p className="mt-2 text-center text-xs text-ink/60">Toque na imagem para pegar outra cor</p>
      </div>
    </div>
  );
}

function DoLogo({ p, r, mudar }: Props) {
  const marcadas = r?.opcoes ?? [];
  const daImagem = marcadas.filter((c) => c.startsWith("#"));
  return (
    <div className="space-y-5">
      <DaImagem cores={daImagem} mudar={(cores) => mudar({ opcoes: cores })} />
      {daImagem.length > 0 ? (
        <Reconhecidas
          cores={daImagem}
          aoAjustar={(i, cor) => mudar({ opcoes: daImagem.map((c, j) => (j === i ? cor : c)) })}
          aoTirar={(i) => mudar({ opcoes: daImagem.filter((_, j) => j !== i) })}
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Sem o logo à mão? Toque nas cores dele, começando pela principal.</p>
          <div role="group" aria-label={p.titulo} className="grid grid-cols-4 gap-x-2 gap-y-3 sm:grid-cols-6">
            {coresSoltas.map(({ nome, cor }) => {
              const ordem = marcadas.indexOf(nome);
              const marcada = ordem >= 0;
              return (
                <button
                  key={nome}
                  type="button"
                  role="checkbox"
                  aria-checked={marcada}
                  aria-label={nome}
                  disabled={!marcada && marcadas.length >= MAXIMO}
                  onClick={() => mudar({ opcoes: marcada ? marcadas.filter((x) => x !== nome) : [...marcadas, nome] })}
                  className="group flex flex-col items-center gap-1.5 text-xs outline-none disabled:opacity-35"
                >
                  <span
                    className={cn(
                      "flex size-14 items-center justify-center rounded-full font-mono text-base font-semibold transition-all duration-200 group-focus-visible:ring-3 group-focus-visible:ring-ring/50 group-active:scale-95",
                      marcada && "ring-2 ring-ink ring-offset-3 ring-offset-background",
                    )}
                    style={{ background: cor, color: textoSobre(cor) }}
                  >
                    {marcada && ordem + 1}
                  </span>
                  {nome}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Combinacoes({ p, r, mudar }: Props) {
  const marcada = r?.opcoes?.[0];
  return (
    <div role="radiogroup" aria-label={p.titulo} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {paletas.map((c) => {
        const ativa = marcada === c.nome;
        return (
          <button
            key={c.nome}
            type="button"
            role="radio"
            aria-checked={ativa}
            aria-label={c.nome}
            onClick={() => mudar({ opcoes: [c.nome] })}
            className={cn(
              "relative overflow-hidden rounded-xl border-2 bg-card text-left transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.98]",
              ativa ? "border-ink shadow-lg" : "border-transparent hover:border-ring/50",
            )}
          >
            <span className="flex h-20">
              <span className="flex-[1.3]" style={{ background: c.destaque }} />
              <span className="flex-1" style={{ background: c.tinta }} />
              <span className="flex-1" style={{ background: c.apoio }} />
              <span className="flex-[0.8]" style={{ background: c.fundo }} />
            </span>
            <span className="block px-3 py-2.5 text-sm font-medium">{c.nome}</span>
            {ativa && (
              <CheckIcon className="absolute top-2 right-2 size-6 rounded-full bg-ink p-1 text-brand" strokeWidth={3} aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function CampoDasCores(props: Props) {
  if (props.p.modo === "exatas") return <Codigos {...props} />;
  if (props.p.modo === "logo") return <DoLogo {...props} />;
  return <Combinacoes {...props} />;
}

/** As bolinhas das cores de uma resposta, para a revisão e para a agência. */
export function BolinhasDeCor({ opcoes }: { opcoes: string[] }) {
  const paleta = paletas.find((p) => p.nome === opcoes[0]);
  const cores = paleta
    ? [paleta.destaque, paleta.tinta, paleta.apoio, paleta.fundo]
    : opcoes.map(corDe).filter((c) => c !== undefined);
  return (
    <span className="mt-2 flex gap-1.5" aria-hidden="true">
      {cores.map((c) => (
        <span key={c} className="size-7 rounded-full border border-ink/15" style={{ background: c }} />
      ))}
    </span>
  );
}

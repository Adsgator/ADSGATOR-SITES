import type { Pergunta, Respostas } from "@/lib/briefing/regras";

// Sinais para a agência ler a resposta com mais cuidado (pedido do Lucas,
// 2026-11-24): texto longo que chegou de uma vez e resposta curta que rende uma
// conversa. Não bloqueiam nada, não provam nada e o cliente não os vê.

/** Os trechos longos que chegaram de uma vez, por pergunta. */
export type Colados = Record<string, string[]>;

/** Menos que isto colado não chama atenção (um link, um endereço, um número). */
export const MINIMO_COLADO = 120;
const CURTA = 60;

export type Sinal = "colada" | "colada_e_mexida" | "curta";

const frases = (texto: string) =>
  texto
    .split(/[.!?\n]+/)
    .map((f) => f.replace(/\s+/g, " ").trim())
    .filter((f) => f.length >= 25);

export function sinalDa(p: Pergunta, respostas: Respostas, colados: Colados): Sinal | null {
  const r = respostas[p.id];
  if (!r || r.nada) return null;
  const final = [r.valor ?? "", ...Object.values(r.itens ?? {})].join("\n").replace(/[^\S\n]+/g, " ");
  const trechos = frases((colados[p.id] ?? []).join("\n"));
  if (trechos.length) {
    // Quanto do que foi colado continua igual: quem cola e reescreve não fica marcado.
    const iguais = trechos.filter((f) => final.includes(f)).length / trechos.length;
    if (iguais >= 0.8) return "colada";
    if (iguais >= 0.2) return "colada_e_mexida";
  }
  return p.tipo === "longo" && p.obrigatoria && final.trim().length < CURTA ? "curta" : null;
}

/** A pessoa respondeu o que já tem de material e não marcou nenhuma foto. */
export function semFotos(respostas: Respostas) {
  const material = respostas.material?.opcoes;
  return Boolean(material?.length) && !material!.some((m) => m.startsWith("Fotos"));
}

import "server-only";

import type { Briefing, Respostas } from "@/lib/briefing/regras";
import type { Colados } from "@/lib/briefing/sinais";

// A conversa do briefing com o painel, só no servidor (plano geral, Parte 5). Usa o segredo e o
// endereço que o checkout já tem; o painel confere o código e o aparelho a cada pedido.

const TEMPO_LIMITE_MS = 8_000;

export type BriefingDoPainel =
  | { precisa_digitos: true; travado: boolean; tipo: Briefing["tipo"] }
  | {
      precisa_digitos?: undefined;
      tipo: Briefing["tipo"];
      conteudo: Omit<Briefing, "tipo">;
      respostas: Respostas;
      colados: Colados;
      enviado: boolean;
      material_mandado: boolean;
      pasta: string;
    };

/** O painel recusou o conteúdo: não adianta tentar de novo. */
export class ConteudoRecusado extends Error {}

async function chamar<T>(corpo: Record<string, unknown>): Promise<T> {
  const url = process.env.PAINEL_URL;
  const segredo = process.env.CHECKOUT_PAINEL_SEGREDO;
  if (!url || !segredo) throw new Error("PAINEL_URL ou CHECKOUT_PAINEL_SEGREDO não configurado");
  const r = await fetch(`${url}/api/briefing/site`, {
    method: "POST",
    headers: { "x-checkout-segredo": segredo, "content-type": "application/json" },
    body: JSON.stringify(corpo),
    signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    cache: "no-store",
  });
  if (r.status === 400) throw new ConteudoRecusado(`o painel recusou ${corpo.acao}`);
  if (!r.ok) throw new Error(`o painel respondeu ${r.status} em ${corpo.acao}`);
  return ((await r.json()) as { resposta: T }).resposta;
}

export const CODIGO = /^[A-HJ-NP-Z2-9]{10}$/i;

type Quem = { codigo: string; token: string };

export const lerBriefing = (quem: Quem) => chamar<BriefingDoPainel | null>({ acao: "ler", ...quem });
export const conferirDigitos = (quem: Quem, digitos: string) =>
  chamar<{ ok: boolean; travado: boolean; restam: number } | null>({ acao: "digitos", ...quem, digitos });
export const guardarBriefing = (
  quem: Quem,
  mudancas: { respostas: Respostas; colados: Colados; recomecar: boolean; feitas: number; total: number },
) => chamar<boolean>({ acao: "guardar", ...quem, mudancas });
export const enviarBriefing = (quem: Quem, feitas: number, total: number) =>
  chamar<{ ok: boolean } | null>({ acao: "enviar", ...quem, feitas, total });
export const marcarMaterial = (quem: Quem, mandou: boolean) => chamar<boolean>({ acao: "material", ...quem, mandou });
export const criarSemCodigo = (dados: { tipo: Briefing["tipo"]; nome: string; whatsapp: string; conteudo: unknown; ip: string }) =>
  chamar<string | null>({ acao: "sem_codigo", ...dados });

// Um pagamento por vez em cada link (plano geral, Parte 4, proteção do checkout;
// decisões do Lucas, 2026-11-23). Antes de falar com o Asaas, o checkout reserva a
// vez do link no painel (que também conta os cartões recusados) e, no fim, diz como
// terminou. Se não dá para saber se o Asaas cobrou (tempo esgotado, servidor caído),
// a próxima tentativa confere pela referência do link antes de cobrar: o Asaas manda
// consultar antes de repetir (docs.asaas.com, "Cobranças via cartão de crédito").

import * as asaas from "./asaas";
import { gravarResultado, reservarVez, type MotivoDaRecusa } from "./painel";
import type { Forma } from "./pedido";

/** Situações do Asaas que contam como pago. */
export const SITUACOES_PAGAS = ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"];

type Recusa = { ok: false; status: number; erro: string };

const RECUSAS: Record<MotivoDaRecusa, { status: number; erro: string }> = {
  invalido: { status: 400, erro: "Este link não é válido. Fale com a gente no WhatsApp para receber o link certo." },
  vencido: { status: 410, erro: "Este link venceu. Fale com a gente no WhatsApp para receber um novo." },
  pago: { status: 409, erro: "Este pagamento já foi feito. Se precisar de algo, fale com a gente no WhatsApp." },
  em_andamento: {
    status: 409,
    erro: "Já existe um pagamento em andamento neste link. Espere uns 2 minutos e tente de novo, ou fale com a gente no WhatsApp.",
  },
  cartao_travado: {
    status: 429,
    erro: "O cartão não foi aceito nas últimas tentativas. Pague no Pix ou fale com a gente no WhatsApp.",
  },
  muitas_tentativas: {
    status: 429,
    erro: "Foram muitas tentativas com cartão. Pague no Pix, espere uma hora ou fale com a gente no WhatsApp.",
  },
};

const INCERTO: Recusa = {
  ok: false,
  status: 503,
  erro: "Não conseguimos confirmar se o pagamento passou. Para não cobrar duas vezes, espere uns 2 minutos e tente de novo. A gente confere antes de cobrar.",
};

export type Vez =
  | { ok: true; cobranca: asaas.Cobranca; jaExistia: boolean; terminar: (registrado: boolean) => Promise<void> }
  | Recusa;

/** As cobranças deste link que valem, sem as que a assinatura gera nos outros meses. */
export async function cobrancasDoLink(referencia: string) {
  const todas = await asaas.cobrancasPorReferencia(referencia);
  return todas
    .filter((c) => !c.deleted && !c.subscription && !["REFUNDED", "REFUND_REQUESTED"].includes(c.status))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

/** A cobrança que já resolve o pedido, se houver; a que não serve mais é apagada. */
async function aproveitar(referencia: string, forma: Forma): Promise<asaas.Cobranca | null> {
  const existentes = await cobrancasDoLink(referencia);
  const firme = existentes.find((c) => SITUACOES_PAGAS.includes(c.status) || c.billingType === "CREDIT_CARD");
  if (firme) return firme;
  let mesmoPix: asaas.Cobranca | null = null;
  for (const c of existentes) {
    if (forma === "pix" && c.status === "PENDING" && !mesmoPix) mesmoPix = c;
    // Pix vencido ou trocado pelo cartão: sai antes, para não ficar um segundo valor a pagar.
    else await asaas.apagarCobranca(c.id);
  }
  return mesmoPix;
}

const espera = (ms: number) => new Promise((ok) => setTimeout(ok, ms));

/**
 * Reserva a vez do link e cobra, ou devolve a cobrança que já existe. Quem chama avisa o painel
 * e termina com `terminar(registrado)`. Erro do Asaas na criação (400) sobe como ErroDoAsaas.
 */
export async function cobrarUmaVez(p: {
  codigo: string;
  forma: Forma;
  ip: string;
  referencia: string;
  /** O que vem antes da cobrança (achar ou criar o cliente); falha aqui não conta como recusa. */
  preparar: () => Promise<string>;
  criar: (cliente: string) => Promise<asaas.Cobranca>;
}): Promise<Vez> {
  const reserva = await reservarVez(p.codigo, p.forma, p.ip);
  if (!reserva.ok) return { ok: false, ...RECUSAS[reserva.motivo] };
  const { tentativa } = reserva;
  const fim = (cobranca: asaas.Cobranca, jaExistia: boolean): Vez => ({
    ok: true,
    cobranca,
    jaExistia,
    // Sem o registro no painel, fica incerta: a próxima confere e registra.
    terminar: (registrado) => gravarResultado(tentativa, registrado ? "criada" : "incerta", cobranca.id, registrado ? "" : "o painel não registrou"),
  });

  let cliente: string;
  try {
    const existente = reserva.conferir ? await aproveitar(p.referencia, p.forma) : null;
    if (existente) return fim(existente, true);
    cliente = await p.preparar();
  } catch (e) {
    await gravarResultado(tentativa, "erro", null, String(e));
    throw e;
  }

  try {
    return fim(await p.criar(cliente), false);
  } catch (e) {
    // 4xx: o Asaas respondeu e nada foi criado.
    if (e instanceof asaas.ErroDoAsaas && e.status < 500) {
      await gravarResultado(tentativa, p.forma === "cartao" && e.status === 400 ? "recusada" : "erro", null, e.descricao);
      throw e;
    }
    // Sem resposta (ou 5xx): pode ter cobrado. Confere antes de dizer qualquer coisa.
    console.error("checkout: cobrança sem resposta", { referencia: p.referencia, erro: String(e) });
    await espera(2000);
    const achada = await cobrancasDoLink(p.referencia).then((c) => c[0] ?? null, () => null);
    if (achada) return fim(achada, true);
    await gravarResultado(tentativa, "incerta", null, String(e));
    return INCERTO;
  }
}

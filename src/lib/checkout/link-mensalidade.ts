// O link da mensalidade (combo depois da aprovação da página, manutenção
// depois da entrega): o Lucas gera e manda no WhatsApp; o cliente abre, lê o
// que contrata e a data da renovação e paga (decisão do Lucas, 2026-11-21).
//
// O link leva o cliente do Asaas, o serviço e o dia em que foi gerado, com uma
// assinatura (HMAC-SHA256) feita com CHECKOUT_LINK_SEGREDO: ninguém troca o
// cliente nem o serviço, e o endereço não mostra dado pessoal. Vale 15 dias.
//
// Só usa node:crypto (sem os atalhos "@/"), para scripts/link-mensalidade.mjs
// rodar este arquivo direto no Node.

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type DadosDoLink = {
  /** Cliente no Asaas (cus_...). */
  cliente: string;
  /** Serviço mensal do catálogo (google-ads ou manutencao). */
  servico: string;
  /** Dia em que o link foi gerado (aaaa-mm-dd, São Paulo): é o dia das próximas. */
  gerado: string;
  /** Identifica este link, para não ativar a mesma mensalidade duas vezes. */
  id: string;
};

export const SERVICOS_DO_LINK = ["google-ads", "manutencao"];
export const VALIDADE_DO_LINK_DIAS = 15;

function segredo() {
  const s = process.env.CHECKOUT_LINK_SEGREDO ?? "";
  if (s.length < 32) throw new Error("CHECKOUT_LINK_SEGREDO ausente ou curto (mínimo 32 caracteres)");
  return s;
}

function assinatura(corpo: string) {
  return createHmac("sha256", segredo()).update(corpo).digest("base64url");
}

export function criarLink(cliente: string, servico: string, gerado: string): string {
  if (!/^cus_\w+$/.test(cliente)) throw new Error(`cliente do Asaas inválido: ${cliente}`);
  if (!SERVICOS_DO_LINK.includes(servico)) throw new Error(`serviço sem mensalidade pelo link: ${servico}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(gerado)) throw new Error(`data inválida: ${gerado}`);
  const dados: DadosDoLink = { cliente, servico, gerado, id: randomBytes(6).toString("base64url") };
  const corpo = Buffer.from(JSON.stringify(dados)).toString("base64url");
  return `${corpo}.${assinatura(corpo)}`;
}

/** Os dados do link, ou null se ele foi alterado ou não é um link nosso. */
export function lerLink(token: string): DadosDoLink | null {
  const [corpo, recebida, ...resto] = (token ?? "").split(".");
  if (!corpo || !recebida || resto.length > 0 || corpo.length > 400) return null;
  const esperada = Buffer.from(assinatura(corpo));
  const veio = Buffer.from(recebida);
  if (esperada.length !== veio.length || !timingSafeEqual(esperada, veio)) return null;
  try {
    const d = JSON.parse(Buffer.from(corpo, "base64url").toString("utf8")) as DadosDoLink;
    const ok =
      /^cus_\w+$/.test(d.cliente) &&
      SERVICOS_DO_LINK.includes(d.servico) &&
      /^\d{4}-\d{2}-\d{2}$/.test(d.gerado) &&
      typeof d.id === "string";
    return ok ? d : null;
  } catch {
    return null;
  }
}

/** Dias corridos entre duas datas aaaa-mm-dd. */
export function diasEntre(de: string, ate: string) {
  return Math.round((Date.parse(`${ate}T00:00:00Z`) - Date.parse(`${de}T00:00:00Z`)) / 86_400_000);
}

export function linkVencido(d: DadosDoLink, hoje: string) {
  return diasEntre(d.gerado, hoje) > VALIDADE_DO_LINK_DIAS || diasEntre(d.gerado, hoje) < 0;
}

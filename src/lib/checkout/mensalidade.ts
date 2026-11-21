// A mensalidade pelo link (combo depois da aprovação da página, manutenção
// depois da entrega), no servidor. Decisões do Lucas (2026-11-21): a 1ª vence
// em 3 dias a partir do dia em que o link foi gerado, e esse dia é o das
// próximas; o cliente paga lendo o que contrata, e a assinatura nasce no
// Asaas. Os Termos já foram aceitos na contratação.

import * as asaas from "./asaas";
import { soDigitos } from "./campos";
import { servicoPorSlug } from "./catalogo";
import {
  ativarMensalidade,
  cartaoParaOAsaas,
  dataIso,
  mesmoDiaNoMesSeguinte,
  respostaDaCobranca,
  type RespostaDaContratacao,
} from "./contratacao";
import { linkVencido, lerLink, type DadosDoLink } from "./link-mensalidade";
import { DIAS_PARA_VENCER, hojeEmSaoPaulo, somarDias, type Data, type Forma } from "./pedido";
import { cartaoVazio, validarCartao, type Cartao } from "./validacao";

function data(iso: string): Data {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return { ano, mes, dia };
}

/** As datas da mensalidade deste link: a 1ª no Pix (3 dias depois de gerado,
 * nunca antes de hoje), o dia das próximas e o vencimento da 2ª. */
export function datasDaMensalidade(link: DadosDoLink, hoje = dataIso(hojeEmSaoPaulo())) {
  const noPix = dataIso(somarDias(data(link.gerado), DIAS_PARA_VENCER));
  return {
    vencimentoNoPix: noPix < hoje ? hoje : noPix,
    hoje,
    diaDaRenovacao: data(link.gerado).dia,
    proximo: dataIso(mesmoDiaNoMesSeguinte(data(link.gerado))),
  };
}

export const referenciaDoLink = (link: DadosDoLink) => `mensalidade:${link.id}`;

export type SituacaoDoLink =
  | { tipo: "invalido" }
  | { tipo: "vencido" }
  /** Já ativado; se a 1ª no Pix ainda não foi paga, ela volta para pagar. */
  | { tipo: "ativado"; link: DadosDoLink; pixPendente?: asaas.Cobranca }
  | { tipo: "pronto"; link: DadosDoLink; cliente: asaas.ClienteDoAsaas };

/** Confere o link: assinatura, validade, cliente no Asaas e se já foi ativado. */
export async function situacaoDoLink(token: string): Promise<SituacaoDoLink> {
  const link = lerLink(token);
  if (!link) return { tipo: "invalido" };
  if (linkVencido(link, dataIso(hojeEmSaoPaulo()))) return { tipo: "vencido" };
  const cliente = await asaas.clientePorId(link.cliente).catch(() => null);
  if (!cliente || cliente.deleted) return { tipo: "invalido" };
  const ref = referenciaDoLink(link);
  const jaTem = (await asaas.assinaturasDoCliente(link.cliente)).some((a) => a.externalReference === ref && !a.deleted);
  if (!jaTem) return { tipo: "pronto", link, cliente };
  const pixPendente = (await asaas.cobrancasDoCliente(link.cliente)).find(
    (c) => c.externalReference === ref && !c.deleted && c.billingType === "PIX" && c.status === "PENDING",
  );
  return { tipo: "ativado", link, pixPendente };
}

export type PedidoDaMensalidade = { token: string; forma: Forma; cartao: Cartao };

export function lerPedidoDaMensalidade(corpo: unknown): PedidoDaMensalidade | null {
  if (!corpo || typeof corpo !== "object") return null;
  const c = corpo as Record<string, unknown>;
  if (typeof c.token !== "string" || (c.forma !== "pix" && c.forma !== "cartao")) return null;
  const k = (c.cartao ?? {}) as Record<string, unknown>;
  const cartao = Object.fromEntries(
    Object.keys(cartaoVazio).map((campo) => [campo, typeof k[campo] === "string" ? (k[campo] as string).slice(0, 100).trim() : ""]),
  ) as Cartao;
  return { token: c.token.slice(0, 600), forma: c.forma, cartao };
}

const MENSAGENS: Record<Exclude<SituacaoDoLink["tipo"], "pronto">, { status: number; erro: string }> = {
  invalido: { status: 400, erro: "Este link não é válido. Fale com a gente no WhatsApp para receber um novo." },
  vencido: { status: 410, erro: "Este link venceu. Fale com a gente no WhatsApp para receber um novo." },
  ativado: { status: 409, erro: "Esta mensalidade já foi ativada. Se precisar mudar algo, fale com a gente no WhatsApp." },
};

export async function pagarMensalidade(
  p: PedidoDaMensalidade,
  ip: string,
): Promise<{ status: number; corpo: RespostaDaContratacao }> {
  const situacao = await situacaoDoLink(p.token);
  // Voltou ao link depois de gerar o Pix: o mesmo Pix, para pagar.
  if (situacao.tipo === "ativado" && situacao.pixPendente && p.forma === "pix") {
    const c = situacao.pixPendente;
    return respostaDaCobranca(c, "pix", Math.round(c.value * 100), 1, c.dueDate);
  }
  if (situacao.tipo !== "pronto") {
    const { status, erro } = MENSAGENS[situacao.tipo];
    return { status, corpo: { ok: false, erro } };
  }

  const noCartao = p.forma === "cartao";
  if (noCartao) {
    const campos = validarCartao(p.cartao);
    if (Object.keys(campos).length > 0)
      return { status: 400, corpo: { ok: false, erro: "Confira os dados do cartão.", campos } };
  }

  const { link, cliente } = situacao;
  const servico = servicoPorSlug(link.servico);
  if (!servico || servico.tipo !== "mensal") return { status: 400, corpo: { ok: false, erro: MENSAGENS.invalido.erro } };

  const datas = datasDaMensalidade(link);
  const vencimento = noCartao ? datas.hoje : datas.vencimentoNoPix;
  const cartao = noCartao
    ? cartaoParaOAsaas(
        p.cartao,
        {
          name: cliente.name,
          email: cliente.email ?? "",
          cpfCnpj: cliente.cpfCnpj,
          postalCode: soDigitos(cliente.postalCode ?? ""),
          addressNumber: cliente.addressNumber ?? "",
          addressComplement: cliente.complement || undefined,
          mobilePhone: soDigitos(cliente.mobilePhone || cliente.phone || ""),
        },
        ip,
      )
    : {};

  const cobranca = await ativarMensalidade({
    cliente: cliente.id,
    slugs: [servico.slug],
    total: servico.preco[p.forma],
    billingType: noCartao ? "CREDIT_CARD" : "PIX",
    vencimento,
    proximo: datas.proximo,
    referencia: referenciaDoLink(link),
    cartao,
  });
  return respostaDaCobranca(cobranca, p.forma, servico.preco[p.forma], 1, vencimento);
}

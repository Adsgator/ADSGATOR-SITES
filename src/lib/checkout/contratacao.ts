// A contratação no servidor: confere tudo de novo, recalcula o preço pelo
// catálogo (o valor nunca vem do navegador) e cria no Asaas o cliente e as
// cobranças de hoje (plano geral, Parte 4; decisões do Lucas, 2026-11-21).
//
// - Criação (página ou site): uma cobrança, no Pix com vencimento em 3 dias ou
//   no cartão em até 12x sem juros, cobrado na hora.
// - Só o plano mensal (Google Ads ou manutenção): a 1ª mensalidade é uma
//   cobrança avulsa (Pix em 3 dias ou cartão na hora) e a assinatura começa no
//   mesmo dia do mês seguinte, para as próximas caírem no dia da contratação
//   (Termos, seção 7). No cartão, a assinatura cobra o mesmo cartão sozinha.
// - A mensalidade do combo e a manutenção depois da entrega não são cobradas
//   aqui: vão pelo link que o Lucas manda depois.
//
// O registro do aceite e o aviso ao painel vêm na etapa seguinte do plano.

import { randomUUID } from "node:crypto";

import * as asaas from "./asaas";
import { soDigitos } from "./campos";
import { servicosDoLink } from "./catalogo";
import { hojeEmSaoPaulo, montarPedido, type Data, type Forma } from "./pedido";
import { cartaoVazio, dadosVazios, validarDados, type Cartao, type Dados } from "./validacao";

export type PedidoDeContratacao = {
  servicos: string[];
  forma: Forma;
  parcelas: number;
  semCnpj: boolean;
  dados: Dados;
  cartao: Cartao;
  aceite: boolean;
};

export type RespostaDaContratacao =
  | {
      ok: true;
      forma: "pix";
      cobranca: string;
      valor: number;
      vencimento: string;
      /** null quando o Asaas não devolveu o QR; aí vale o link da cobrança. */
      pix: { imagem: string; copiaECola: string } | null;
      linkDaCobranca?: string;
    }
  | { ok: true; forma: "cartao"; situacao: "aprovado" | "em_analise"; valor: number; parcelas: number }
  | { ok: false; erro: string; campos?: Record<string, string> };

/** Situações do Asaas que contam como pago. */
export const SITUACOES_PAGAS = ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"];

/** Nome na descrição da cobrança. A taxa de gestão aparece por escrito em toda
 * cobrança do Google Ads (regra do Google; Base, "Serviços e preços"). */
const nomeNaCobranca: Record<string, string> = {
  "google-ads": "Taxa de gestão de Google Ads",
  "landing-page": "Landing page",
  "site-institucional": "Site institucional",
  manutencao: "Manutenção e suporte",
};

function texto(valor: unknown, max = 200) {
  return typeof valor === "string" ? valor.slice(0, max) : "";
}

/** Lê o corpo do pedido sem confiar em nada: o que não for do tipo certo vira vazio. */
export function lerPedido(corpo: unknown): PedidoDeContratacao | null {
  if (!corpo || typeof corpo !== "object") return null;
  const c = corpo as Record<string, unknown>;
  if (!Array.isArray(c.servicos) || (c.forma !== "pix" && c.forma !== "cartao")) return null;
  const d = (c.dados ?? {}) as Record<string, unknown>;
  const k = (c.cartao ?? {}) as Record<string, unknown>;
  const dados = Object.fromEntries(Object.keys(dadosVazios).map((campo) => [campo, texto(d[campo]).trim()])) as Dados;
  const cartao = Object.fromEntries(Object.keys(cartaoVazio).map((campo) => [campo, texto(k[campo]).trim()])) as Cartao;
  return {
    servicos: c.servicos.map((s) => texto(s, 40)).slice(0, 10),
    forma: c.forma,
    parcelas: Number.isInteger(c.parcelas) ? (c.parcelas as number) : 1,
    semCnpj: c.semCnpj === true,
    dados,
    cartao,
    aceite: c.aceite === true,
  };
}

function dataIso(d: Data) {
  return `${d.ano}-${String(d.mes).padStart(2, "0")}-${String(d.dia).padStart(2, "0")}`;
}

/** O mesmo dia no mês seguinte; se o dia não existe (ex.: 31), o último dia do mês (Termos, seção 7). */
export function mesmoDiaNoMesSeguinte(d: Data): Data {
  const ano = d.mes === 12 ? d.ano + 1 : d.ano;
  const mes = d.mes === 12 ? 1 : d.mes + 1;
  const ultimo = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  return { ano, mes, dia: Math.min(d.dia, ultimo) };
}

/** IP de quem está comprando (o Asaas pede o do comprador, não o do servidor). */
export function ipDoComprador(headers: Headers) {
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "";
  if (!ip || ip === "::1" || ip === "::ffff:127.0.0.1") return "127.0.0.1";
  return ip.replace(/^::ffff:/, "");
}

const reaisDoAsaas = (centavos: number) => centavos / 100;

export async function contratar(
  p: PedidoDeContratacao,
  ip: string,
): Promise<{ status: number; corpo: RespostaDaContratacao }> {
  const slugs = servicosDoLink(p.servicos.join(","));
  if (slugs.length === 0 || slugs.length !== new Set(p.servicos).size)
    return { status: 400, corpo: { ok: false, erro: "Este link de contratação não é válido. Fale com a gente no WhatsApp." } };
  if (!p.aceite) return { status: 400, corpo: { ok: false, erro: "Para contratar, aceite os Termos de Serviço." } };

  const campos = validarDados(p.dados, p.cartao, p.semCnpj, p.forma);
  if (Object.keys(campos).length > 0)
    return { status: 400, corpo: { ok: false, erro: "Confira os dados destacados.", campos } };

  const pedido = montarPedido(slugs, p.forma);
  if (p.parcelas < 1 || p.parcelas > pedido.maxParcelas)
    return { status: 400, corpo: { ok: false, erro: "Confira o número de parcelas." } };

  const d = p.dados;
  const documento = soDigitos(p.semCnpj ? d.cpf : d.cnpj);
  const telefone = soDigitos(d.whatsapp);
  const cep = soDigitos(d.cep);
  const observacoes = [`Responsável: ${d.nome}`, d.indicacao && `Indicado por: ${d.indicacao}`, "Cadastro pelo checkout"]
    .filter(Boolean)
    .join(" · ");

  const cliente =
    (await asaas.clientePorDocumento(documento)) ??
    (await asaas.criarCliente({
      name: p.semCnpj ? d.nome : d.empresa,
      company: p.semCnpj ? undefined : d.empresa,
      cpfCnpj: documento,
      email: d.email,
      mobilePhone: telefone,
      postalCode: cep,
      address: d.endereco,
      addressNumber: d.numero,
      complement: d.complemento || undefined,
      province: d.bairro,
      observations: observacoes,
    }));

  const noCartao = p.forma === "cartao";
  const [mes, ano] = p.cartao.validade.split("/");
  const cartao: Partial<asaas.CartaoDoAsaas> = noCartao
    ? {
        creditCard: {
          holderName: p.cartao.nome,
          number: soDigitos(p.cartao.numero),
          expiryMonth: mes,
          expiryYear: `20${ano}`,
          ccv: p.cartao.codigo,
        },
        creditCardHolderInfo: {
          name: d.nome,
          email: d.email,
          cpfCnpj: documento,
          postalCode: cep,
          addressNumber: d.numero,
          addressComplement: d.complemento || undefined,
          mobilePhone: telefone,
        },
        remoteIp: ip,
      }
    : {};

  const hoje = hojeEmSaoPaulo();
  const referencia = `checkout:${randomUUID()}`;
  const billingType = noCartao ? "CREDIT_CARD" : "PIX";
  // No cartão, cobra na hora; no Pix, vence em 3 dias.
  const vencimento = dataIso(noCartao ? hoje : pedido.vencimento);

  const criacoes = pedido.hoje.filter((l) => !l.mensal);
  const mensais = pedido.hoje.filter((l) => l.mensal);
  // As regras do pedido nunca juntam as duas coisas hoje (o combo começa a
  // mensalidade na aprovação); se um dia juntarem, este fluxo precisa mudar.
  if (criacoes.length > 0 && mensais.length > 0) throw new Error("pedido com criação e mensalidade no mesmo dia");

  let cobranca: asaas.Cobranca;
  if (criacoes.length > 0) {
    const total = criacoes.reduce((s, l) => s + l.valor, 0);
    cobranca = await asaas.criarCobranca({
      customer: cliente,
      billingType,
      dueDate: vencimento,
      description: `${criacoes.map((l) => nomeNaCobranca[l.slug] ?? l.nome).join(" + ")} · Adsgator`,
      externalReference: referencia,
      ...(noCartao && p.parcelas > 1
        ? { installmentCount: p.parcelas, totalValue: reaisDoAsaas(total) }
        : { value: reaisDoAsaas(total) }),
      ...cartao,
    });
  } else {
    const total = mensais.reduce((s, l) => s + l.valor, 0);
    const nomes = mensais.map((l) => nomeNaCobranca[l.slug] ?? l.nome).join(" + ");
    cobranca = await asaas.criarCobranca({
      customer: cliente,
      billingType,
      dueDate: vencimento,
      description: `${nomes} · 1ª mensalidade · Adsgator`,
      externalReference: referencia,
      value: reaisDoAsaas(total),
      ...cartao,
    });
    try {
      await asaas.criarAssinatura({
        customer: cliente,
        billingType,
        value: reaisDoAsaas(total),
        nextDueDate: dataIso(mesmoDiaNoMesSeguinte(hoje)),
        cycle: "MONTHLY",
        description: `${nomes} · mensalidade · Adsgator`,
        externalReference: referencia,
        ...cartao,
      });
    } catch (e) {
      // A 1ª mensalidade já foi criada (e, no cartão, paga): a pessoa não pode
      // ver erro. O Lucas cria a assinatura à mão pelo registro do servidor.
      console.error("checkout: assinatura não criada", { cliente, cobranca: cobranca.id, referencia, erro: String(e) });
    }
  }

  if (noCartao) {
    return {
      status: 200,
      corpo: {
        ok: true,
        forma: "cartao",
        situacao: SITUACOES_PAGAS.includes(cobranca.status) ? "aprovado" : "em_analise",
        valor: pedido.totalHoje,
        parcelas: p.parcelas,
      },
    };
  }

  let pix: { imagem: string; copiaECola: string } | null = null;
  try {
    const qr = await asaas.qrCodeDoPix(cobranca.id);
    pix = { imagem: qr.encodedImage, copiaECola: qr.payload };
  } catch (e) {
    console.error("checkout: QR do Pix indisponível", { cobranca: cobranca.id, erro: String(e) });
  }
  return {
    status: 200,
    corpo: {
      ok: true,
      forma: "pix",
      cobranca: cobranca.id,
      valor: pedido.totalHoje,
      vencimento,
      pix,
      linkDaCobranca: pix ? undefined : cobranca.invoiceUrl,
    },
  };
}

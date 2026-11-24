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
// Um pagamento por vez em cada link, com a mesma referência: ver vez.ts.

import { VERSAO_DOS_TERMOS } from "@/config/checkout";

import * as asaas from "./asaas";
import { soDigitos } from "./campos";
import { servicosDoLink } from "./catalogo";
import { avisarAssinaturaQueFalhou, avisarContratacao, linkDoPainel } from "./painel";
import { pontosDosTermos } from "./termos";
import { hojeEmSaoPaulo, montarPedido, type Data, type Forma } from "./pedido";
import { cartaoVazio, dadosVazios, validarDados, type Cartao, type Dados } from "./validacao";
import { cobrarUmaVez, SITUACOES_PAGAS } from "./vez";

export type PedidoDeContratacao = {
  /** O código do link gerado no painel: é dele que vêm os serviços. */
  codigo: string;
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
      /** Vencimento da próxima mensalidade (aaaa-mm-dd), quando há assinatura. */
      proxima?: string;
    }
  | {
      ok: true;
      forma: "cartao";
      situacao: "aprovado" | "em_analise";
      valor: number;
      parcelas: number;
      proxima?: string;
    }
  | { ok: false; erro: string; campos?: Record<string, string> };

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
  if (typeof c.codigo !== "string" || (c.forma !== "pix" && c.forma !== "cartao")) return null;
  const d = (c.dados ?? {}) as Record<string, unknown>;
  const k = (c.cartao ?? {}) as Record<string, unknown>;
  const dados = Object.fromEntries(Object.keys(dadosVazios).map((campo) => [campo, texto(d[campo]).trim()])) as Dados;
  const cartao = Object.fromEntries(Object.keys(cartaoVazio).map((campo) => [campo, texto(k[campo]).trim()])) as Cartao;
  return {
    codigo: texto(c.codigo, 10).trim().toUpperCase(),
    forma: c.forma,
    parcelas: Number.isInteger(c.parcelas) ? (c.parcelas as number) : 1,
    semCnpj: c.semCnpj === true,
    dados,
    cartao,
    aceite: c.aceite === true,
  };
}

export function dataIso(d: Data) {
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

export const reaisDoAsaas = (centavos: number) => centavos / 100;

export async function contratar(
  p: PedidoDeContratacao,
  ip: string,
  navegador: string,
): Promise<{ status: number; corpo: RespostaDaContratacao }> {
  // Os serviços vêm do link guardado no painel, nunca do navegador.
  const link = await linkDoPainel(p.codigo);
  if (!link || link.tipo !== "contratacao")
    return { status: 400, corpo: { ok: false, erro: "Este link de contratação não é válido. Fale com a gente no WhatsApp." } };
  if (!link.valido)
    return { status: 410, corpo: { ok: false, erro: "Este link venceu. Fale com a gente no WhatsApp para receber um novo." } };
  if (link.pago)
    return { status: 409, corpo: { ok: false, erro: "Esta contratação já foi feita. Se precisar de algo, fale com a gente no WhatsApp." } };
  const slugs = servicosDoLink(link.servicos.join(","));
  if (slugs.length === 0)
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

  const acharOuCriarCliente = async () =>
    (await asaas.clientePorDocumento(documento)) ??
    asaas.criarCliente({
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
    });

  const noCartao = p.forma === "cartao";
  const cartao = noCartao
    ? cartaoParaOAsaas(
        p.cartao,
        {
          name: d.nome,
          email: d.email,
          cpfCnpj: documento,
          postalCode: cep,
          addressNumber: d.numero,
          addressComplement: d.complemento || undefined,
          mobilePhone: telefone,
        },
        ip,
      )
    : {};

  const hoje = hojeEmSaoPaulo();
  // Fixa por link: é por ela que uma nova tentativa acha a cobrança que já existe.
  const referencia = `checkout:${p.codigo}`;
  const billingType = noCartao ? "CREDIT_CARD" : "PIX";
  // No cartão, cobra na hora; no Pix, vence em 3 dias.
  const vencimento = dataIso(noCartao ? hoje : pedido.vencimento);

  const criacoes = pedido.hoje.filter((l) => !l.mensal);
  const mensais = pedido.hoje.filter((l) => l.mensal);
  // As regras do pedido nunca juntam as duas coisas hoje (o combo começa a
  // mensalidade na aprovação); se um dia juntarem, este fluxo precisa mudar.
  if (criacoes.length > 0 && mensais.length > 0) throw new Error("pedido com criação e mensalidade no mesmo dia");

  const totalMensal = mensais.reduce((s, l) => s + l.valor, 0);
  const proxima = mensais.length > 0 ? dataIso(mesmoDiaNoMesSeguinte(hoje)) : undefined;
  let cliente = "";
  const vez = await cobrarUmaVez({
    codigo: p.codigo,
    forma: p.forma,
    ip,
    referencia,
    preparar: acharOuCriarCliente,
    criar: (doAsaas) => {
      cliente = doAsaas;
      if (mensais.length > 0) {
        return criarPrimeiraMensalidade({ cliente, slugs: mensais.map((l) => l.slug), total: totalMensal, billingType, vencimento, referencia, cartao });
      }
      const total = criacoes.reduce((s, l) => s + l.valor, 0);
      return asaas.criarCobranca({
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
    },
  });
  if (!vez.ok) return { status: vez.status, corpo: { ok: false, erro: vez.erro } };
  const { cobranca } = vez;
  cliente ||= cobranca.customer;
  // A cobrança que já existia pode ser de outra forma (ex.: Pix já pago e agora o cartão).
  const forma: Forma = cobranca.billingType === "PIX" ? "pix" : "cartao";

  let semAssinatura = "";
  if (mensais.length > 0 && proxima) {
    semAssinatura = await garantirAssinatura({
      cliente,
      slugs: mensais.map((l) => l.slug),
      total: totalMensal,
      billingType,
      proximo: proxima,
      referencia,
      cartao,
      conferir: vez.jaExistia,
    });
  }

  // O painel registra o cliente, o aceite e, se já pagou, começa a Entrada. Se ele
  // não responder, a tentativa fica incerta: a próxima acha a cobrança e registra.
  const registrado = await avisarContratacao({
    codigo: p.codigo,
    servicos: slugs,
    forma,
    parcelas: p.parcelas,
    valor: reaisDoAsaas(pedido.totalHoje),
    asaas_cliente: cliente,
    asaas_cobranca: cobranca.id,
    pago: SITUACOES_PAGAS.includes(cobranca.status),
    dados: {
      empresa: p.semCnpj ? "" : d.empresa,
      documento,
      nome: d.nome,
      whatsapp: d.whatsapp,
      email: d.email,
      cep: d.cep,
      endereco: d.endereco,
      numero: d.numero,
      complemento: d.complemento,
      bairro: d.bairro,
      cidade: d.cidade,
      uf: d.uf,
      indicacao: d.indicacao,
    },
    aceite: {
      em: new Date().toISOString(),
      ip,
      navegador: navegador.slice(0, 300),
      termos_versao: VERSAO_DOS_TERMOS,
      // Os mesmos pontos da janela de aceite que a pessoa leu.
      pontos: pontosDosTermos(pedido, p.forma),
    },
  });

  await vez.terminar(registrado);
  if (semAssinatura && proxima) {
    await avisarAssinaturaQueFalhou({
      codigo: p.codigo,
      asaas_cliente: cliente,
      asaas_cobranca: cobranca.id,
      valor: reaisDoAsaas(totalMensal),
      proximo: proxima,
      forma: p.forma,
      motivo: semAssinatura,
    });
  }
  // O Pix que já existia mantém o vencimento dele.
  return respostaDaCobranca(cobranca, forma, pedido.totalHoje, p.parcelas, vez.jaExistia ? cobranca.dueDate : vencimento, proxima);
}

/** O cartão no formato do Asaas, com quem é o titular e o IP de quem compra. */
export function cartaoParaOAsaas(
  c: Cartao,
  titular: asaas.CartaoDoAsaas["creditCardHolderInfo"],
  ip: string,
): asaas.CartaoDoAsaas {
  const [mes, ano] = c.validade.split("/");
  return {
    creditCard: { holderName: c.nome, number: soDigitos(c.numero), expiryMonth: mes, expiryYear: `20${ano}`, ccv: c.codigo },
    creditCardHolderInfo: titular,
    remoteIp: ip,
  };
}

type Mensalidade = {
  cliente: string;
  slugs: string[];
  /** Em centavos. */
  total: number;
  billingType: "PIX" | "CREDIT_CARD";
  referencia: string;
  cartao: Partial<asaas.CartaoDoAsaas>;
};

const nomesNaCobranca = (slugs: string[]) => slugs.map((s) => nomeNaCobranca[s] ?? s).join(" + ");

/** A 1ª mensalidade numa cobrança avulsa (Pix com vencimento, cartão na hora). Usada
 * pela contratação (só o plano mensal) e pelo link da mensalidade (combo e manutenção
 * depois da entrega); as próximas são da assinatura (garantirAssinatura). */
export function criarPrimeiraMensalidade(m: Mensalidade & { vencimento: string }) {
  return asaas.criarCobranca({
    customer: m.cliente,
    billingType: m.billingType,
    dueDate: m.vencimento,
    description: `${nomesNaCobranca(m.slugs)} · 1ª mensalidade · Adsgator`,
    externalReference: m.referencia,
    value: reaisDoAsaas(m.total),
    ...m.cartao,
  });
}

/**
 * A assinatura com as próximas mensalidades, a partir de `proximo`. A 1ª já foi criada (e, no
 * cartão, paga), então a pessoa nunca vê erro: tenta 3 vezes e devolve o motivo se não nasceu
 * (vazio quando deu certo), para o painel avisar o Lucas (decisão 3 A, 2026-11-23).
 */
export async function garantirAssinatura(m: Mensalidade & { proximo: string; conferir: boolean }): Promise<string> {
  let motivo = "";
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      // Depois de uma falha, pode ter nascido sem a resposta chegar.
      if (m.conferir || tentativa > 1) {
        const doCliente = await asaas.assinaturasDoCliente(m.cliente);
        if (doCliente.some((a) => a.externalReference === m.referencia && !a.deleted)) return "";
      }
      await asaas.criarAssinatura({
        customer: m.cliente,
        billingType: m.billingType,
        value: reaisDoAsaas(m.total),
        nextDueDate: m.proximo,
        cycle: "MONTHLY",
        description: `${nomesNaCobranca(m.slugs)} · mensalidade · Adsgator`,
        externalReference: m.referencia,
        ...m.cartao,
      });
      return "";
    } catch (e) {
      motivo = e instanceof Error ? e.message : String(e);
      console.error("checkout: assinatura não criada", { cliente: m.cliente, referencia: m.referencia, tentativa, erro: motivo });
      // O que o Asaas recusou (cartão, dado) não muda tentando de novo.
      if (e instanceof asaas.ErroDoAsaas && e.status < 500) break;
      await new Promise((ok) => setTimeout(ok, 1000 * tentativa));
    }
  }
  return motivo || "sem resposta do Asaas";
}

/** O que a tela recebe depois da cobrança: o QR do Pix ou a situação do cartão. */
export async function respostaDaCobranca(
  cobranca: asaas.Cobranca,
  forma: Forma,
  valor: number,
  parcelas: number,
  vencimento: string,
  proxima?: string,
): Promise<{ status: number; corpo: RespostaDaContratacao }> {
  if (forma === "cartao") {
    return {
      status: 200,
      corpo: {
        ok: true,
        forma: "cartao",
        situacao: SITUACOES_PAGAS.includes(cobranca.status) ? "aprovado" : "em_analise",
        valor,
        parcelas,
        proxima,
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
      valor,
      vencimento,
      pix,
      linkDaCobranca: pix ? undefined : cobranca.invoiceUrl,
      proxima,
    },
  };
}

// Regras do pedido do checkout. As mesmas na tela e no servidor: a tela mostra,
// o servidor confere (o preço nunca vem do navegador).
//
// Combinado com o Lucas (2026-11-21) e na Base ("Serviços e preços"):
// - Combo: Google Ads com a criação (página ou site) tem o preço menor na
//   criação. Hoje se paga só a criação; a mensalidade do Google Ads começa
//   quando o cliente aprova a página, por um link que o Lucas manda.
// - Só o Google Ads (ou só a manutenção): a primeira mensalidade vence em 3
//   dias, e as seguintes no dia da contratação (Termos, seção 7).
// - Manutenção: incluída para quem tem o Google Ads (página da Adsgator);
//   junto com a criação, sem o Google Ads, a primeira vence um mês depois da
//   entrega.
// - Pix: preço menor na criação. Cartão: até 12 vezes sem juros na criação; a
//   mensalidade não parcela.

import { catalogo, type Servico } from "./catalogo";

export type Forma = "pix" | "cartao";

export type LinhaDeHoje = {
  slug: string;
  nome: string;
  valor: number;
  /** Preço sem o combo, quando o combo baixou o valor. */
  valorCheio?: number;
  mensal: boolean;
};

export type InicioDaMensalidade = "hoje" | "aprovacao" | "entrega" | "incluida";

export type Mensalidade = {
  slug: string;
  nome: string;
  valor: number;
  inicio: InicioDaMensalidade;
};

export type Pedido = {
  servicos: Servico[];
  combo: boolean;
  hoje: LinhaDeHoje[];
  totalHoje: number;
  economiaNoCombo: number;
  mensalidades: Mensalidade[];
  maxParcelas: number;
  /** Vencimento do que se paga hoje (3 dias). */
  vencimento: Data;
  /** Dia do mês das próximas mensalidades, quando uma começa hoje. */
  diaDaRenovacao: number;
};

/** Data no calendário de São Paulo, sem hora. */
export type Data = { ano: number; mes: number; dia: number };

export const DIAS_PARA_VENCER = 3;

export function hojeEmSaoPaulo(agora = new Date()): Data {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(agora);
  const [ano, mes, dia] = partes.split("-").map(Number);
  return { ano, mes, dia };
}

export function somarDias(data: Data, dias: number): Data {
  const d = new Date(Date.UTC(data.ano, data.mes - 1, data.dia + dias));
  return { ano: d.getUTCFullYear(), mes: d.getUTCMonth() + 1, dia: d.getUTCDate() };
}

export function montarPedido(slugs: string[], forma: Forma, agora = new Date()): Pedido {
  const servicos = catalogo.filter((s) => slugs.includes(s.slug));
  const temAds = servicos.some((s) => s.slug === "google-ads");
  const criacoes = servicos.filter((s) => s.tipo === "unico");
  const combo = temAds && criacoes.some((s) => s.precoNoCombo);

  const hoje: LinhaDeHoje[] = criacoes.map((s) => {
    const noCombo = combo && s.precoNoCombo ? s.precoNoCombo[forma] : undefined;
    return {
      slug: s.slug,
      nome: s.nome,
      valor: noCombo ?? s.preco[forma],
      valorCheio: noCombo !== undefined ? s.preco[forma] : undefined,
      mensal: false,
    };
  });

  const mensalidades: Mensalidade[] = servicos
    .filter((s) => s.tipo === "mensal")
    .map((s) => {
      let inicio: InicioDaMensalidade;
      if (s.slug === "manutencao" && temAds) inicio = "incluida";
      else if (criacoes.length > 0) inicio = s.slug === "google-ads" ? "aprovacao" : "entrega";
      else inicio = "hoje";
      return { slug: s.slug, nome: s.nome, valor: inicio === "incluida" ? 0 : s.preco[forma], inicio };
    });

  for (const m of mensalidades) {
    if (m.inicio === "hoje") hoje.push({ slug: m.slug, nome: m.nome, valor: m.valor, mensal: true });
  }

  const totalHoje = hoje.reduce((soma, l) => soma + l.valor, 0);
  const economiaNoCombo = hoje.reduce((soma, l) => soma + (l.valorCheio ? l.valorCheio - l.valor : 0), 0);
  const soCriacao = hoje.length > 0 && hoje.every((l) => !l.mensal);
  const maxParcelas = forma === "cartao" && soCriacao ? Math.min(...criacoes.map((s) => s.maxParcelas)) : 1;
  const dataDeHoje = hojeEmSaoPaulo(agora);

  return {
    servicos,
    combo,
    hoje,
    totalHoje,
    economiaNoCombo,
    mensalidades,
    maxParcelas,
    vencimento: somarDias(dataDeHoje, DIAS_PARA_VENCER),
    diaDaRenovacao: dataDeHoje.dia,
  };
}

export function reais(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function dataCurta(data: Data) {
  return `${String(data.dia).padStart(2, "0")}/${String(data.mes).padStart(2, "0")}`;
}

/** Valor aproximado de cada parcela, em centavos, para mostrar na tela. */
export function valorDaParcela(total: number, parcelas: number) {
  return Math.round(total / parcelas);
}

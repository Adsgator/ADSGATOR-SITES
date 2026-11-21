// Serviços que o checkout vende (plano geral, Parte 4; decisões do Lucas de
// 2026-11-21). PROVISÓRIO: enquanto a tela de Serviços do painel não existe,
// a lista fica aqui, com os preços da Base ("Serviços e preços") e os do
// cartão novos (R$ 1.600 e R$ 1.250 no combo, Lucas, 2026-11-21). Quando o
// painel tiver o cadastro, o checkout passa a ler de lá e este arquivo sai.

/** Preço em centavos, para a conta não ter erro de arredondamento. */
export type Preco = { cartao: number; pix: number };

export type Servico = {
  slug: string;
  nome: string;
  resumo: string;
  tipo: "unico" | "mensal";
  preco: Preco;
  /** Preço da criação para quem contrata junto com o Google Ads (combo). */
  precoNoCombo?: Preco;
  /** Parcelas sem juros no cartão (só para pagamento único). */
  maxParcelas: number;
  /** "link": só aparece quando vem no link (casos sob proposta). */
  visivel: "sempre" | "link";
};

export const catalogo: Servico[] = [
  {
    slug: "google-ads",
    nome: "Gestão de Google Ads",
    resumo: "Campanhas criadas e acompanhadas por nós, com resumo todo mês. A verba é paga por você direto ao Google.",
    tipo: "mensal",
    preco: { cartao: 50000, pix: 50000 },
    maxParcelas: 1,
    visivel: "sempre",
  },
  {
    slug: "landing-page",
    nome: "Landing page",
    resumo: "Página sob medida, rápida no celular, com o domínio no seu nome. Pronta em até 14 dias úteis.",
    tipo: "unico",
    preco: { cartao: 160000, pix: 140000 },
    precoNoCombo: { cartao: 125000, pix: 110000 },
    maxParcelas: 12,
    visivel: "sempre",
  },
  {
    // Valores da Base; a conferir com o Lucas depois da mudança do cartão.
    slug: "site-institucional",
    nome: "Site institucional",
    resumo: "Site de até 5 páginas, sob medida, com o domínio no seu nome. Pronto em até 25 dias úteis.",
    tipo: "unico",
    preco: { cartao: 300000, pix: 280000 },
    precoNoCombo: { cartao: 240000, pix: 224000 },
    maxParcelas: 12,
    visivel: "sempre",
  },
  {
    slug: "manutencao",
    nome: "Manutenção e suporte",
    resumo: "Hospedagem, renovação do domínio, monitoramento e até 2 horas de ajustes por mês.",
    tipo: "mensal",
    preco: { cartao: 15000, pix: 15000 },
    maxParcelas: 1,
    visivel: "sempre",
  },
];

export function servicoPorSlug(slug: string) {
  return catalogo.find((s) => s.slug === slug);
}

/** Os serviços que vêm no link (?s=google-ads,landing-page), na ordem do
 * catálogo; o que não existe é ignorado. */
export function servicosDoLink(valor: string | string[] | undefined) {
  const pedidos = new Set(
    (Array.isArray(valor) ? valor.join(",") : (valor ?? ""))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  return catalogo.filter((s) => pedidos.has(s.slug)).map((s) => s.slug);
}

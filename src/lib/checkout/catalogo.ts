// Serviços que o checkout vende (plano geral, Parte 4; decisões do Lucas de
// 2026-11-21). PROVISÓRIO: enquanto a tela de Serviços do painel não existe,
// a lista fica aqui, com os preços da Base ("Serviços e preços", mudada em
// 2026-11-21). Quando o painel tiver o cadastro, o checkout passa a ler de lá
// e este arquivo sai. O checkout mostra só o que vem no link, que é montado
// conforme o que foi fechado na proposta (Lucas, 2026-11-21).

/** Preço em centavos, para a conta não ter erro de arredondamento. */
export type Preco = { cartao: number; pix: number };

export type Servico = {
  slug: string;
  nome: string;
  /** Linha curta embaixo do nome, no resumo (ex.: o prazo). Só quando ajuda. */
  nota?: string;
  tipo: "unico" | "mensal";
  preco: Preco;
  /** Preço da criação para quem contrata junto com o Google Ads (combo). */
  precoNoCombo?: Preco;
  /** Parcelas sem juros no cartão (só para pagamento único). */
  maxParcelas: number;
};

export const catalogo: Servico[] = [
  {
    slug: "google-ads",
    nome: "Gestão de Google Ads",
    tipo: "mensal",
    preco: { cartao: 50000, pix: 50000 },
    maxParcelas: 1,
  },
  {
    slug: "landing-page",
    nome: "Landing page",
    nota: "Pronta em até 7 dias úteis.",
    tipo: "unico",
    preco: { cartao: 160000, pix: 140000 },
    precoNoCombo: { cartao: 125000, pix: 110000 },
    maxParcelas: 12,
  },
  {
    slug: "site-institucional",
    nome: "Site institucional",
    nota: "Pronto em até 25 dias úteis.",
    tipo: "unico",
    preco: { cartao: 320000, pix: 280000 },
    precoNoCombo: { cartao: 255000, pix: 225000 },
    maxParcelas: 12,
  },
  {
    slug: "manutencao",
    nome: "Manutenção e suporte",
    tipo: "mensal",
    preco: { cartao: 15000, pix: 15000 },
    maxParcelas: 1,
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

// Páginas do portfólio: feitas pela Adsgator e no ar. As quatro escolhidas em
// 2026-11-20 (o Lucas aprovou; o portfólio todo está autorizado pelos
// clientes, segundo ele). Usadas pela faixa do Início e pela página
// Portfólio. Fotos tiradas das páginas no ar em 2026-11-20
// (`public/portfolio/`): a primeira tela (`-pc`, `-cel`) e a página inteira
// (`-inteira`, 960 px de largura, pelo `scripts/fotos-portfolio.mjs`, que
// mostra a altura de cada uma). A cidade e o que cada uma oferece vêm do texto
// público das páginas (2026-11-20); os serviços, do painel. O mini caso, sem
// números (decisão 3 A do roteiro), é rascunho do Claude para o Lucas conferir.
// Projetos anteriores (pedido do Lucas, 2026-11-20): páginas feitas pela
// Adsgator que não estão mais no ar, sem `site` (sem link) e, quando a página
// não dizia, sem `cidade`. Fotos das imagens guardadas da época, pelo
// `scripts/fotos-portfolio-arquivo.mjs`; o texto, do que aparece nelas.

export type PaginaPortfolio = {
  id: string;
  segmento: string;
  /** Endereço da página no ar; sem ele, é um projeto anterior. */
  site?: string;
  cidade?: string;
  alturaInteira: number;
  servicos: ("Landing page" | "Google Ads" | "Manutenção")[];
  caso: { negocio: string; precisava: string; feito: string };
};

export const portfolio: PaginaPortfolio[] = [
  {
    id: "adestradora",
    segmento: "Adestramento canino",
    site: "juliamartinsadestradora.com.br",
    cidade: "Itajubá e Piranguçu (MG)",
    alturaInteira: 10980,
    servicos: ["Landing page", "Manutenção"],
    caso: {
      negocio: "Adestradora com treinamento, filhotes, grupos, canicross e mentoria.",
      precisava: "Mostrar o método dela e organizar os vários serviços, para cada pessoa achar o seu.",
      feito: "A página com o método, os serviços em cartões, as histórias de clientes e o WhatsApp a um toque.",
    },
  },
  {
    id: "creche",
    segmento: "Creche e hospedagem canina",
    site: "natuespacocanino.com.br",
    cidade: "Piranguçu (MG)",
    alturaInteira: 8293,
    servicos: ["Landing page", "Manutenção"],
    caso: {
      negocio: "Creche educativa e hospedagem para cães.",
      precisava: "Explicar que é mais do que uma creche e mostrar a rotina e a estrutura.",
      feito: "A página com a creche e a hospedagem lado a lado, a rotina dos cães, as fotos do espaço e o mapa.",
    },
  },
  {
    id: "escritorios",
    segmento: "Escritório virtual e endereço fiscal",
    site: "wesharescritorios.com.br",
    cidade: "São José dos Campos (SP)",
    alturaInteira: 8660,
    servicos: ["Landing page", "Google Ads", "Manutenção"],
    caso: {
      negocio: "Endereço fiscal, escritórios privativos e salas de reunião.",
      precisava: "Aparecer para quem procura endereço fiscal na cidade e mostrar os planos e o espaço com clareza.",
      feito: "A página com os planos, as fotos do espaço e as perguntas frequentes, e a campanha do Google Ads levando até ela.",
    },
  },
  {
    id: "planejados",
    segmento: "Móveis planejados",
    site: "oficinadosplanejadosofc.com.br",
    cidade: "Contagem (MG)",
    alturaInteira: 3980,
    servicos: ["Landing page", "Manutenção"],
    caso: {
      negocio: "Móveis planejados sob medida para casa.",
      precisava: "Mostrar os ambientes e os projetos já feitos, para quem está pensando em planejar.",
      feito: "A página com os ambientes, a galeria de projetos e as dúvidas frequentes.",
    },
  },
  {
    id: "sob-medida",
    segmento: "Móveis sob medida",
    alturaInteira: 4491,
    servicos: ["Landing page"],
    caso: {
      negocio: "Planejamento, fabricação e instalação de móveis sob medida.",
      precisava: "Mostrar a experiência e os ambientes já feitos, para quem quer pedir um orçamento.",
      feito: "A página com os ambientes, o processo, a história da empresa, os projetos já feitos e o orçamento pelo WhatsApp.",
    },
  },
  {
    id: "provedor",
    segmento: "Provedor de internet",
    alturaInteira: 2377,
    servicos: ["Landing page", "Google Ads"],
    caso: {
      negocio: "Internet fibra e internet móvel, revendedor autorizado de uma operadora.",
      precisava: "Mostrar muitos planos de um jeito fácil de comparar e lançar a internet móvel.",
      feito: "A página com os planos em cartões, o simulador de chips, o indique e ganhe e a assinatura pelo WhatsApp, e a campanha do Google Ads levando até ela.",
    },
  },
];

/** As páginas que estão no ar, com link: as da faixa do Início. */
export const paginasNoAr = portfolio.filter((p) => p.site);

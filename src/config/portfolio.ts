// Páginas do portfólio, feitas pela Adsgator (o portfólio todo está autorizado
// pelos clientes, segundo o Lucas). Usadas pela página Portfólio, pelo fundo do
// topo dela e, as 5 primeiras, pela faixa do Início. Sem link para as páginas
// (decisão do Lucas, 2026-11-20: link direto leva tráfego desqualificado; quem
// quiser ver tem o endereço na janela), e sem separar as que estão no ar das que
// não estão: o portfólio mostra a qualidade da entrega.
//
// Fotos em `public/portfolio/`: a primeira tela (`-pc`, `-cel`) e a página
// inteira (`-inteira`, 960 px de largura), pelo `scripts/fotos-portfolio.mjs`
// (as páginas no ar e as que rodam no computador) ou pelo
// `scripts/fotos-portfolio-arquivo.mjs` (das imagens guardadas da época). A
// cidade e o que cada uma oferece vêm do texto das páginas e do que o Lucas
// contou; os serviços, do painel. O mini caso, sem números (decisão 3 A do
// roteiro), é rascunho do Claude para o Lucas conferir. A de móveis sob medida
// não é de cliente: foi feita pela Adsgator como demonstração, e aparece
// marcada como conceito (decisão do Lucas, 2026-11-20).

export type PaginaPortfolio = {
  id: string;
  segmento: string;
  /** O endereço, mostrado na janela (sem link). */
  site: string;
  cidade: string;
  /** Página de demonstração, sem cliente real. */
  conceito?: boolean;
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
    id: "nutricionista",
    segmento: "Nutrição",
    site: "anaesternutricionista.com.br",
    cidade: "Poços de Caldas (MG)",
    alturaInteira: 6621,
    servicos: ["Landing page", "Google Ads"],
    caso: {
      negocio: "Nutricionista com acompanhamento individual, presencial e online.",
      precisava: "Mostrar um atendimento diferente das dietas restritivas e passar confiança para a primeira consulta.",
      feito: "A página com o jeito dela de atender, como funciona o acompanhamento, as avaliações do Google, o consultório e o mapa.",
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
    id: "multas",
    segmento: "Recursos de multas de trânsito",
    site: "cancelamulta.com.br",
    cidade: "Online, em todo o Brasil",
    alturaInteira: 4088,
    servicos: ["Landing page", "Google Ads"],
    caso: {
      negocio: "Recursos administrativos de multas e defesa da CNH, com atendimento online.",
      precisava: "Explicar cada situação de um jeito simples, para quem levou multa ou pode ter a CNH suspensa.",
      feito: "A página com as situações em cartões, por que confiar, os valores de cada recurso e as perguntas frequentes, e a campanha do Google Ads levando até ela.",
    },
  },
  {
    id: "mentoria",
    segmento: "Mentoria de adestramento",
    site: "mentoria.abeak9adestramento.com.br",
    cidade: "Online, em todo o Brasil",
    alturaInteira: 7016,
    servicos: ["Landing page", "Google Ads", "Manutenção"],
    caso: {
      negocio: "Mentoria individual e online de adestramento, para tutores e profissionais.",
      precisava: "Mostrar o método da mentoria e separar o que ela oferece para tutores e para profissionais.",
      feito: "A página com o método em etapas, os planos de sessões, as perguntas frequentes e o formulário de análise.",
    },
  },
  {
    id: "provedor",
    segmento: "Internet fibra e móvel",
    site: "neoredevendas.com.br",
    cidade: "Santo Amaro da Imperatriz (SC)",
    alturaInteira: 2377,
    servicos: ["Landing page", "Google Ads"],
    caso: {
      negocio: "Revenda autorizada de internet fibra e internet móvel.",
      precisava: "Mostrar muitos planos de um jeito fácil de comparar e lançar a internet móvel.",
      feito: "A página com os planos em cartões, o simulador de chips, o indique e ganhe e a assinatura pelo WhatsApp, e a campanha do Google Ads levando até ela.",
    },
  },
  {
    id: "sob-medida",
    segmento: "Móveis sob medida",
    site: "sobmedidamoveis.com.br",
    cidade: "São Paulo (SP)",
    conceito: true,
    alturaInteira: 4491,
    servicos: ["Landing page"],
    caso: {
      negocio: "Uma marcenaria de planejamento, fabricação e instalação de móveis sob medida.",
      precisava: "Mostrar a experiência e os ambientes já feitos, para quem quer pedir um orçamento.",
      feito: "A página com os ambientes, o processo, a história da empresa, os projetos já feitos e o orçamento pelo WhatsApp.",
    },
  },
];

/** As da faixa do Início: as 5 primeiras, para a fila não ficar longa demais. */
export const destaques = portfolio.slice(0, 5);

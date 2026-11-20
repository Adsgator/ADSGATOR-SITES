import {
  ClockIcon,
  FileTextIcon,
  HardHatIcon,
  LightbulbIcon,
  PlugIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SmileIcon,
  SparklesIcon,
  StethoscopeIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";

// Clientes fictícios de segmentos diferentes, que se revezam na hero, no
// caminho do cliente, nos cartões e na chamada final (pedido do Lucas,
// 2026-11-20: a página geral não pode parecer feita para um segmento só, e os
// exemplos precisam ter cara de marca de verdade). Nomes, sites e conversas
// inventados; nenhum é cliente da Adsgator. Fotos do Pexels (licença grátis
// para uso comercial, sem crédito obrigatório; conferida em 2026-11-20):
// 257736 (quadro elétrico), 3845810 (consultório) e 7876040 (escritório). O
// pet shop saiu porque não havia foto grátis confiável.

export type Segmento = {
  id: string;
  busca: string;
  nome: string;
  /** Sigla ou letra do logotipo. */
  sigla: string;
  site: string;
  icone: LucideIcon;
  foto: string;
  /** Títulos com serifa (mais elegante) ou sem serifa (mais forte). */
  serifa: boolean;
  /** Cores da página do cliente: fundo escuro e destaque. */
  fundo: string;
  destaque: string;
  anuncio: string;
  anuncioTexto: string;
  mensagem: string;
  resposta: string;
  selo: string;
  titulo: string;
  tituloDestaque: string;
  sub: string;
  cta: string;
  diferenciais: string[];
  servicos: { icone: LucideIcon; titulo: string; texto: string }[];
  passos: string[];
  chamada: string;
  cidade: string;
  /** As seções a mais de uma página completa (rodada de profundidade, Lucas,
   * 2026-11-20: a página de exemplo parecia simples demais). */
  sobre: string;
  depoimentos: { nome: string; texto: string }[];
  perguntas: string[];
  area: string[];
  /** Títulos com a personalidade do negócio, como nas páginas reais da
   * Adsgator (Lucas, 2026-11-20: nada de título genérico). */
  titulos: { servicos: string; sobre: string; depoimentos: string };
  /** O rodapé completo, como o das páginas reais: a frase do negócio e o
   * horário (sem telefone nem @ inventados, que podem existir de verdade). */
  rodape: { descricao: string; horario: string };
};

export const segmentos: Segmento[] = [
  {
    id: "eletricista",
    busca: "eletricista em campinas",
    nome: "Ampère Elétrica",
    sigla: "A",
    site: "ampereeletrica.com.br",
    icone: ZapIcon,
    foto: "/exemplos/eletricista.jpg",
    serifa: false,
    fundo: "#0A1A2F",
    destaque: "#38BDF8",
    anuncio: "Eletricista em Campinas · Atendimento hoje",
    anuncioTexto: "Orçamento pelo WhatsApp. Atendemos Campinas e região.",
    mensagem: "Oi! Vi o anúncio no Google. Vocês conseguem vir hoje?",
    resposta: "Conseguimos sim! Me passa o endereço que eu já te confirmo o horário.",
    selo: "Atendimento hoje em Campinas",
    titulo: "Eletricista em Campinas,",
    tituloDestaque: "no mesmo dia",
    sub: "Instalações, reparos e quadros com segurança, para casa e empresa.",
    cta: "Pedir orçamento no WhatsApp",
    diferenciais: ["Técnicos com NR-10", "Garantia no serviço", "Nota fiscal"],
    servicos: [
      { icone: PlugIcon, titulo: "Tomadas e quadros", texto: "Troca e adequação com segurança." },
      { icone: LightbulbIcon, titulo: "Iluminação", texto: "Projetos e instalação de LED." },
      { icone: ZapIcon, titulo: "Instalações", texto: "Obras novas e reformas." },
      { icone: ShieldCheckIcon, titulo: "Manutenção", texto: "Preventiva para empresas." },
    ],
    passos: ["Você chama no WhatsApp", "A gente passa o orçamento", "O técnico vai até você"],
    chamada: "Precisa de um eletricista hoje?",
    cidade: "Campinas · SP",
    sobre: "Eletricistas com NR-10 atendendo casas e empresas de Campinas, com pontualidade e segurança.",
    depoimentos: [
      { nome: "Mariana S.", texto: "Vieram no mesmo dia e resolveram o quadro que vivia desarmando." },
      { nome: "Paulo R.", texto: "Orçamento rápido pelo WhatsApp e serviço limpo. Recomendo." },
    ],
    perguntas: ["Vocês atendem no mesmo dia?", "Dão garantia no serviço?", "Emitem nota fiscal?"],
    area: ["Campinas", "Valinhos", "Sumaré", "Hortolândia"],
    titulos: {
      servicos: "Do chuveiro ao quadro, resolvido com segurança",
      sobre: "Quem entra na sua casa tem NR-10",
      depoimentos: "Chamou, a gente foi. Quem já chamou conta",
    },
    rodape: {
      descricao: "Instalações e reparos elétricos com segurança, para casa e empresa em Campinas e região.",
      horario: "Segunda a sábado, das 7h às 19h",
    },
  },
  {
    id: "dentista",
    busca: "dentista perto de mim",
    nome: "Lumière Odontologia",
    sigla: "L",
    site: "lumiereodonto.com.br",
    icone: SmileIcon,
    foto: "/exemplos/dentista.jpg",
    serifa: true,
    fundo: "#0E3B43",
    destaque: "#E7CFA1",
    anuncio: "Dentista no Cambuí · Agende sua avaliação",
    anuncioTexto: "Horários à noite e aos sábados. Agende pelo WhatsApp.",
    mensagem: "Oi! Vi vocês no Google. Tem horário essa semana?",
    resposta: "Temos sim! Prefere de manhã ou à tarde?",
    selo: "Horários à noite e aos sábados",
    titulo: "O sorriso que você quer,",
    tituloDestaque: "com cuidado de verdade",
    sub: "Avaliação, clareamento, lentes e implantes, com atendimento humanizado.",
    cta: "Agendar avaliação no WhatsApp",
    diferenciais: ["Atendimento humanizado", "Parcelamos", "Estacionamento"],
    servicos: [
      { icone: SparklesIcon, titulo: "Clareamento", texto: "Resultado natural e seguro." },
      { icone: SmileIcon, titulo: "Lentes de contato", texto: "Planejamento do sorriso." },
      { icone: ShieldCheckIcon, titulo: "Implantes", texto: "Com tecnologia digital." },
      { icone: StethoscopeIcon, titulo: "Ortodontia", texto: "Aparelhos e alinhadores." },
    ],
    passos: ["Você chama no WhatsApp", "Agendamos a sua avaliação", "Você é atendido no horário"],
    chamada: "Vamos planejar o seu sorriso?",
    cidade: "Cambuí · Campinas",
    sobre: "Uma clínica no Cambuí com atendimento humanizado, do primeiro exame ao sorriso pronto.",
    depoimentos: [
      { nome: "Camila T.", texto: "Perdi o medo de dentista. Atendimento calmo e tudo explicado." },
      { nome: "Renato M.", texto: "Fiz as lentes e ficou natural. Equipe muito atenciosa." },
    ],
    perguntas: ["A avaliação tem custo?", "Vocês parcelam o tratamento?", "Atendem aos sábados?"],
    area: ["Cambuí", "Centro", "Taquaral", "Guanabara"],
    titulos: {
      servicos: "Um tratamento para cada momento do seu sorriso",
      sobre: "Aqui, o medo de dentista fica na porta",
      depoimentos: "Sorrisos que mudaram",
    },
    rodape: {
      descricao: "Odontologia com atendimento humanizado no Cambuí, em Campinas.",
      horario: "Segunda a sexta, das 8h às 20h · sábado, das 8h às 13h",
    },
  },
  {
    id: "advogado",
    busca: "advogado trabalhista",
    nome: "Valente & Moraes",
    sigla: "VM",
    site: "valentemoraes.adv.br",
    icone: ScaleIcon,
    foto: "/exemplos/advogado.jpg",
    serifa: true,
    fundo: "#241815",
    destaque: "#C9A46A",
    anuncio: "Advogado Trabalhista · Fale com um especialista",
    anuncioTexto: "Análise do seu caso pelo WhatsApp, com sigilo.",
    mensagem: "Boa tarde! Fui demitido e queria entender os meus direitos.",
    resposta: "Boa tarde! Consigo te ajudar sim. Quando foi a demissão?",
    selo: "Advocacia trabalhista · OAB/SP",
    titulo: "Seus direitos trabalhistas,",
    tituloDestaque: "defendidos com firmeza",
    sub: "Rescisão, horas extras e acidente de trabalho, do primeiro contato ao fim do processo.",
    cta: "Falar com um advogado",
    diferenciais: ["Atendimento online", "Sigilo", "Todo o estado de SP"],
    servicos: [
      { icone: FileTextIcon, titulo: "Rescisão", texto: "Verbas e cálculos conferidos." },
      { icone: ClockIcon, titulo: "Horas extras", texto: "Jornada e adicionais." },
      { icone: HardHatIcon, titulo: "Acidente de trabalho", texto: "Estabilidade e indenização." },
      { icone: ScaleIcon, titulo: "Ações trabalhistas", texto: "Do acordo à sentença." },
    ],
    passos: ["Você conta o seu caso", "Analisamos com você", "Seguimos juntos até o fim"],
    chamada: "Ficou com dúvida sobre os seus direitos?",
    cidade: "Campinas · SP",
    sobre: "Escritório dedicado ao direito do trabalho, com atendimento próximo e linguagem simples.",
    depoimentos: [
      { nome: "Juliana P.", texto: "Explicaram os meus direitos sem complicação e me acompanharam até o fim." },
      { nome: "Carlos A.", texto: "Atendimento rápido pelo WhatsApp e muito transparente." },
    ],
    perguntas: ["A primeira conversa tem custo?", "Vocês atendem online?", "Quanto tempo leva um processo?"],
    area: ["Campinas", "Jundiaí", "Sorocaba", "Todo o estado de SP"],
    titulos: {
      servicos: "Os casos que mais chegam até nós",
      sobre: "Direito do trabalho, explicado sem juridiquês",
      depoimentos: "Quem confiou o seu caso a nós",
    },
    rodape: {
      descricao: "Advocacia trabalhista com atendimento próximo, em Campinas e em todo o estado de SP.",
      horario: "Segunda a sexta, das 9h às 18h",
    },
  },
];

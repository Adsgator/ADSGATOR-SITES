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
  },
];

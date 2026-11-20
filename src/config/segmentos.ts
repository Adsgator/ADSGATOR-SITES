import {
  BathIcon,
  CarIcon,
  ClockIcon,
  FileTextIcon,
  HardHatIcon,
  LightbulbIcon,
  PawPrintIcon,
  PlugIcon,
  ScaleIcon,
  ScissorsIcon,
  ShieldCheckIcon,
  SmileIcon,
  SparklesIcon,
  StethoscopeIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";

// Clientes fictícios de segmentos diferentes, que se revezam na hero, no
// caminho do cliente e nos cartões (pedido do Lucas, 2026-11-20: a página
// geral não pode parecer feita só para eletricista). Nomes, sites e conversas
// inventados; nenhum é cliente da Adsgator.

export type Segmento = {
  id: string;
  busca: string;
  nome: string;
  site: string;
  icone: LucideIcon;
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
  fotoSelo: string;
  chips: string[];
  servicos: { icone: LucideIcon; titulo: string }[];
  passos: string[];
  chamada: string;
};

export const segmentos: Segmento[] = [
  {
    id: "eletricista",
    busca: "eletricista em campinas",
    nome: "Volt Elétrica",
    site: "voltcampinas.com.br",
    icone: ZapIcon,
    fundo: "#0B1F3A",
    destaque: "#22D3EE",
    anuncio: "Eletricista em Campinas · Atendimento hoje",
    anuncioTexto: "Orçamento pelo WhatsApp. Atendemos Campinas e região.",
    mensagem: "Oi! Vi o anúncio no Google. Vocês conseguem vir hoje?",
    resposta: "Conseguimos sim! Me passa o endereço que eu já te confirmo o horário.",
    selo: "Atendimento hoje em Campinas",
    titulo: "Eletricista em Campinas,",
    tituloDestaque: "no mesmo dia",
    sub: "Instalações, reparos e quadros com segurança, para casa e empresa.",
    cta: "Pedir orçamento no WhatsApp",
    fotoSelo: "Técnicos com NR-10",
    chips: ["Orçamento sem custo", "Garantia no serviço", "Nota fiscal"],
    servicos: [
      { icone: PlugIcon, titulo: "Tomadas e quadros" },
      { icone: LightbulbIcon, titulo: "Iluminação" },
      { icone: ZapIcon, titulo: "Instalações" },
      { icone: ShieldCheckIcon, titulo: "Manutenção" },
    ],
    passos: ["Você chama no WhatsApp", "A gente passa o orçamento", "O técnico vai até você"],
    chamada: "Precisa de um eletricista hoje?",
  },
  {
    id: "dentista",
    busca: "dentista perto de mim",
    nome: "Clínica Sorrir",
    site: "clinicasorrir.com.br",
    icone: SmileIcon,
    fundo: "#0F3D3E",
    destaque: "#5EEAD4",
    anuncio: "Dentista no Cambuí · Agende sua avaliação",
    anuncioTexto: "Horários à noite e aos sábados. Agende pelo WhatsApp.",
    mensagem: "Oi! Vi vocês no Google. Tem horário essa semana?",
    resposta: "Temos sim! Prefere de manhã ou à tarde?",
    selo: "Horários à noite e aos sábados",
    titulo: "Seu sorriso cuidado",
    tituloDestaque: "perto de você",
    sub: "Avaliação, limpeza, clareamento e implantes, com atendimento humanizado.",
    cta: "Agendar pelo WhatsApp",
    fotoSelo: "Atendimento humanizado",
    chips: ["Primeira avaliação", "Parcelamos", "Estacionamento"],
    servicos: [
      { icone: SparklesIcon, titulo: "Clareamento" },
      { icone: SmileIcon, titulo: "Limpeza" },
      { icone: ShieldCheckIcon, titulo: "Implantes" },
      { icone: StethoscopeIcon, titulo: "Ortodontia" },
    ],
    passos: ["Você chama no WhatsApp", "Agendamos a sua avaliação", "Você é atendido no horário"],
    chamada: "Vamos cuidar do seu sorriso?",
  },
  {
    id: "advogado",
    busca: "advogado trabalhista",
    nome: "Silva Advocacia",
    site: "silvaadvocacia.com.br",
    icone: ScaleIcon,
    fundo: "#2A1E1A",
    destaque: "#D4A373",
    anuncio: "Advogado Trabalhista · Fale com um especialista",
    anuncioTexto: "Análise do seu caso pelo WhatsApp, com sigilo.",
    mensagem: "Boa tarde! Fui demitido e queria entender os meus direitos.",
    resposta: "Boa tarde! Consigo te ajudar sim. Quando foi a demissão?",
    selo: "Atendimento com sigilo",
    titulo: "Seus direitos trabalhistas",
    tituloDestaque: "garantidos",
    sub: "Rescisão, horas extras e acidente de trabalho, do primeiro contato ao fim do processo.",
    cta: "Falar com um advogado",
    fotoSelo: "OAB/SP",
    chips: ["Atendimento online", "Sigilo", "Todo o estado de SP"],
    servicos: [
      { icone: FileTextIcon, titulo: "Rescisão" },
      { icone: ClockIcon, titulo: "Horas extras" },
      { icone: HardHatIcon, titulo: "Acidente de trabalho" },
      { icone: ScaleIcon, titulo: "Ações trabalhistas" },
    ],
    passos: ["Você conta o seu caso", "Analisamos com você", "Seguimos juntos até o fim"],
    chamada: "Ficou com dúvida sobre os seus direitos?",
  },
  {
    id: "pet",
    busca: "banho e tosa perto de mim",
    nome: "Patas & Cia",
    site: "patasecia.com.br",
    icone: PawPrintIcon,
    fundo: "#3B0764",
    destaque: "#F0ABFC",
    anuncio: "Banho e Tosa em Valinhos · Leva e traz",
    anuncioTexto: "Agende pelo WhatsApp. Buscamos e levamos o seu pet.",
    mensagem: "Oi! Vocês buscam em casa? Queria marcar um banho pro meu cachorro.",
    resposta: "Buscamos sim! Qual o porte dele e o seu endereço?",
    selo: "Leva e traz em Valinhos",
    titulo: "Banho e tosa com carinho,",
    tituloDestaque: "sem sair de casa",
    sub: "Buscamos o seu pet, cuidamos com calma e devolvemos cheiroso.",
    cta: "Agendar pelo WhatsApp",
    fotoSelo: "Equipe treinada",
    chips: ["Leva e traz", "Produtos hipoalergênicos", "Câmera ao vivo"],
    servicos: [
      { icone: BathIcon, titulo: "Banho" },
      { icone: ScissorsIcon, titulo: "Tosa" },
      { icone: SparklesIcon, titulo: "Hidratação" },
      { icone: CarIcon, titulo: "Leva e traz" },
    ],
    passos: ["Você agenda no WhatsApp", "Buscamos o seu pet", "Devolvemos cheiroso"],
    chamada: "Seu pet merece um dia de spa?",
  },
];

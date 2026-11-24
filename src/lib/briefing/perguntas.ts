import type { Pergunta } from "@/lib/briefing/regras";

// As perguntas que valem para qualquer negócio. O briefing padrão (padrao.ts) e os adaptados
// (amostra.ts) são montados com elas.

export const secoesDaPagina = ["Seu negócio", "O que você oferece", "Seus clientes", "Por que confiar em você", "O jeito da página"];

const MATERIAL = ["O logo", "Fotos minhas", "Fotos do lugar", "Fotos do trabalho", "Fotos da equipe", "Vídeos", "Depoimentos de clientes", "Manual da marca", "Ainda não tenho nada"];

export const oJeitoDaPagina = (
  evitar: Pick<Pergunta, "titulo" | "destaque" | "ajuda">,
  /** O domínio sugerido e o material que não cabe na profissão. */
  { dominio, semMaterial = [] }: { dominio?: string; semMaterial?: string[] } = {},
): Pergunta[] => [
  {
    id: "estilo",
    secao: 4,
    tipo: "estilo",
    titulo: "Qual jeito combina mais com o seu negócio?",
    destaque: "combina",
    ajuda: "Escolha até 3. A gente junta o melhor de cada um.",
    obrigatoria: true,
    max: 3,
    papel: "estilo",
  },
  {
    id: "cores_tem",
    secao: 4,
    tipo: "escolha",
    titulo: "Você já tem as cores da sua marca?",
    destaque: "as cores",
    obrigatoria: true,
    opcoes: ["Tenho e sei quais são", "Tenho, estão no meu logo", "Tenho um manual da marca", "Ainda não tenho"],
  },
  {
    id: "cores_exatas",
    secao: 4,
    tipo: "cores",
    modo: "exatas",
    titulo: "Quais são as suas cores?",
    destaque: "as suas cores",
    ajuda: "Cole do jeito que você tem, com o código ou com o nome. Comece pela principal.",
    obrigatoria: true,
    se: [{ pergunta: "cores_tem", tem: ["Tenho e sei quais são"] }],
    papel: "cores",
  },
  {
    id: "cores_logo",
    secao: 4,
    tipo: "cores",
    modo: "logo",
    titulo: "Quais cores aparecem no seu logo?",
    destaque: "no seu logo",
    ajuda: "Escolha a imagem e a gente encontra as cores.",
    obrigatoria: true,
    se: [{ pergunta: "cores_tem", tem: ["Tenho, estão no meu logo"] }],
    papel: "cores",
  },
  {
    id: "cores_novas",
    secao: 4,
    tipo: "cores",
    modo: "combinacoes",
    titulo: "Qual combinação tem mais a sua cara?",
    destaque: "a sua cara",
    ajuda: "É o nosso ponto de partida para as suas cores.",
    obrigatoria: true,
    se: [{ pergunta: "cores_tem", tem: ["Ainda não tenho"] }],
    papel: "cores",
  },
  {
    id: "sensacao",
    secao: 4,
    tipo: "multipla",
    papel: "sensacao",
    titulo: "O que você gostaria que a pessoa sentisse ao abrir a página?",
    destaque: "sentisse",
    ajuda: "Escolha até 3.",
    obrigatoria: true,
    max: 3,
    opcoes: [
      "Confiança",
      "Acolhimento",
      "Profissionalismo",
      "Calma",
      "Leveza",
      "Energia",
      "Alegria",
      "Inspiração",
      "Cuidado",
      "Exclusividade",
      "Clareza",
      "Ousadia",
    ],
  },
  {
    id: "admira",
    secao: 4,
    tipo: "longo",
    titulo: "Tem alguma página que você acha bonita?",
    destaque: "bonita",
    ajuda: "Pode ser de qualquer área. Cole o link ou escreva o nome.",
    exemplo: "Gosto da página...",
    nada: "Não lembro de nenhuma",
  },
  {
    id: "evitar",
    secao: 4,
    tipo: "longo",
    ...evitar,
    nada: "Não, nada em especial",
  },
  {
    id: "material",
    secao: 4,
    tipo: "multipla",
    titulo: "Qual material você já tem pronto?",
    destaque: "já tem pronto",
    ajuda: "Marque tudo o que tiver. No fim a gente te mostra onde colocar.",
    obrigatoria: true,
    opcoes: MATERIAL.filter((m) => !semMaterial.includes(m)),
  },
  {
    id: "dominio",
    secao: 4,
    tipo: "escolha",
    titulo: "Você já tem um endereço de site?",
    destaque: "endereço de site",
    ajuda: "É o domínio, aquele que termina em .com.br.",
    obrigatoria: true,
    opcoes: ["Já tenho", "Já tenho e uso e-mail com ele", "Ainda não tenho"],
  },
  {
    id: "dominio_qual",
    papel: "dominio",
    secao: 4,
    tipo: "texto",
    titulo: "Qual é o endereço do seu site?",
    exemplo: "seunegocio.com.br",
    obrigatoria: true,
    se: [{ pergunta: "dominio", tem: ["Já tenho", "Já tenho e uso e-mail com ele"] }],
  },
  dominio
    ? {
        id: "dominio_novo",
        papel: "dominio",
        secao: 4,
        tipo: "confirmar",
        titulo: "Que tal este endereço?",
        destaque: "este endereço",
        ajuda: "A gente confere se está livre antes de registrar, no seu nome.",
        obrigatoria: true,
        valorConhecido: dominio,
        rotuloDoOutro: "Prefiro outro",
        exemplo: "seunegocio.com.br",
        se: [{ pergunta: "dominio", tem: ["Ainda não tenho"] }],
      }
    : {
        id: "dominio_novo",
        papel: "dominio",
        secao: 4,
        tipo: "texto",
        titulo: "Qual endereço você gostaria de ter?",
        destaque: "gostaria de ter",
        ajuda: "A gente confere se está livre antes de registrar, no seu nome.",
        obrigatoria: true,
        exemplo: "seunegocio.com.br",
        se: [{ pergunta: "dominio", tem: ["Ainda não tenho"] }],
      },
  {
    id: "mais",
    secao: 4,
    tipo: "longo",
    titulo: "Quer contar mais alguma coisa?",
    destaque: "mais alguma coisa",
    ajuda: "Uma frase sua, uma ideia para a página, um detalhe que a gente não perguntou. O espaço é livre.",
    nada: "Não, já contei tudo",
  },
];

export const nome = (valor?: string): Pergunta => ({
  id: "nome",
  secao: 0,
  destaque: "o nome",
  obrigatoria: true,
  papel: "nome",
  ...(valor
    ? {
        tipo: "confirmar",
        titulo: "É assim que o nome deve aparecer na página?",
        valorConhecido: valor,
        rotuloDoOutro: "É de outro jeito",
        exemplo: "Como você quer que apareça",
      }
    : { tipo: "texto", titulo: "Qual é o nome que deve aparecer na página?", exemplo: "O nome do seu negócio" }),
});

export const whatsapp = (numero?: string): Pergunta => ({
  id: "whatsapp",
  secao: 0,
  obrigatoria: true,
  papel: "whatsapp",
  exemplo: "(00) 00000-0000",
  ...(numero
    ? {
        tipo: "confirmar",
        titulo: "Os contatos da página chegam neste WhatsApp?",
        destaque: "neste WhatsApp",
        valorConhecido: numero,
        rotuloDoOutro: "É outro número",
      }
    : { tipo: "texto", titulo: "Em qual WhatsApp chegam os contatos da página?", destaque: "qual WhatsApp" }),
});

/** A única pergunta que convida a colar conversa: sempre "sem nomes". */
export const quemChega = (exemplo: string, porque: string, secao = 2): Pergunta => ({
  id: "quem_chega",
  papel: "clientes",
  secao,
  tipo: "longo",
  titulo: "O que a pessoa costuma escrever na primeira mensagem?",
  destaque: "primeira mensagem",
  ajuda: `Tente lembrar das palavras dela, sem nomes. ${porque}`,
  exemplo,
  obrigatoria: true,
});

export const redes: Pergunta = {
  id: "redes",
  papel: "redes",
  secao: 0,
  tipo: "redes",
  titulo: "Onde mais as pessoas encontram você?",
  destaque: "encontram você",
  ajuda: "Preencha só o que você usa e quer mostrar na página.",
  opcoes: ["Instagram", "Facebook", "TikTok", "YouTube", "E-mail", "Outro telefone"],
  nada: "Por enquanto, só no WhatsApp",
};

/** O que falta para uma página completa, igual em todos os segmentos. */
export const comoFunciona = (titulo: string, exemplos: Record<string, string>): Pergunta => ({
  id: "passos",
  secao: 1,
  tipo: "detalhes",
  titulo,
  destaque: "Como funciona",
  ajuda: "Conte cada parte com o detalhe que quiser.",
  obrigatoria: true,
  opcoes: ["Primeiro", "Depois", "No fim"],
  exemplos,
  papel: "passos",
});

export const facilita = (opcoes: string[]): Pergunta => ({
  id: "facilita",
  papel: "facilita",
  secao: 1,
  tipo: "multipla",
  titulo: "O que facilita a vida de quem fecha com você?",
  destaque: "facilita",
  ajuda: "Marque o que faz parte do seu atendimento.",
  obrigatoria: true,
  opcoes,
  outra: "Outra facilidade",
});

export const objecao = (opcoes: string[]): Pergunta => ({
  id: "objecao",
  secao: 2,
  tipo: "multipla",
  titulo: "O que costuma deixar a pessoa em dúvida antes de fechar?",
  destaque: "em dúvida",
  ajuda: "Assim a página já responde antes mesmo de a pessoa perguntar.",
  obrigatoria: true,
  opcoes,
  outra: "Outro motivo",
});

export const diferente: Pergunta = {
  id: "diferente",
  papel: "diferente",
  secao: 3,
  tipo: "longo",
  titulo: "O que a pessoa encontra em você e dificilmente encontra em outro lugar?",
  destaque: "encontra em você",
  ajuda: "Pode ser um jeito de atender, um cuidado, algo que você não abre mão.",
  exemplo: "Eu sempre...",
  obrigatoria: true,
};

const NUMEROS: Record<string, string> = {
  "Anos de experiência": "8 anos",
  "Pessoas atendidas": "Mais de 300",
  "Nota no Google": "4,9",
  "Link do seu perfil no Google": "Cole o link",
};

/** O que qualquer profissão pode mostrar, também as que o conselho limita. */
export const NUMEROS_SEM_RESTRICAO = ["Anos de experiência", "Link do seu perfil no Google"];
export const MATERIAL_RESTRITO = ["Depoimentos de clientes"];

export const numeros = (opcoes = Object.keys(NUMEROS)): Pergunta => ({
  id: "numeros",
  secao: 3,
  tipo: "redes",
  titulo: "Tem algum número que mostra a sua experiência?",
  destaque: "a sua experiência",
  ajuda: "Preencha os que você tiver. Eles passam confiança logo de cara.",
  opcoes,
  exemplos: NUMEROS,
  nada: "Ainda não tenho números",
  papel: "numeros",
});

// Google Ads ----------------------------------------------------------------------------------

// Só o que ajuda na meta e na estratégia, e que só a pessoa sabe (lista aprovada pelo Lucas,
// 2026-11-24). As buscas, os meses fortes e o site vêm do diagnóstico, da proposta e da ficha;
// os serviços e os diferenciais, do briefing da página ou do site. O que a conversa já contou
// chega marcado, ou como "confirmar".

export const secoesDoAds = ["Quem vai procurar", "O que anunciar", "O seu atendimento"];
/** Quem já fez o da página já contou o que anunciar. */
export const secoesDoAdsComPagina = ["Quem vai procurar", "O seu atendimento"];

export const cidadesDosAnuncios = (marcadas?: string[]): Pergunta => ({
  id: "cidades",
  secao: 0,
  tipo: "etiquetas",
  ...(marcadas
    ? {
        titulo: "É para quem está nestes lugares que o anúncio deve aparecer?",
        destaque: "nestes lugares",
        ajuda: "Tire o que não compensa atender e acrescente o que faltar, uma cidade, um bairro ou a região toda.",
        marcadas,
      }
    : {
        titulo: "Em quais lugares o seu anúncio deve aparecer?",
        destaque: "quais lugares",
        ajuda: "Só onde compensa atender. Pode ser uma cidade, um bairro ou a região toda.",
      }),
  obrigatoria: true,
  sugereRegiao: true,
  papel: "cidades",
});

/** Com os pedidos do negócio dele para marcar; no padrão, a pessoa escreve. */
export const naoQuer = (pedidos?: string[]): Pergunta => ({
  id: "nao_quer",
  secao: 0,
  tipo: pedidos ? "multipla" : "etiquetas",
  titulo: "Que tipo de pedido chega até você e não faz sentido atender?",
  destaque: "não faz sentido",
  ajuda: "Com isso a gente evita essas buscas, e a sua verba rende mais.",
  opcoes: pedidos,
  outra: pedidos ? "Outro pedido" : "Um tipo de pedido",
  nada: "Nenhum, atendo todos os que chegam",
  papel: "naoQuer",
});

export const oSeuAtendimento = (
  secao: number,
  valor: Pick<Pergunta, "titulo" | "destaque" | "exemplo">,
  vagas: string[],
  horarios: Pergunta[],
): Pergunta[] => [
  {
    id: "valor",
    secao,
    tipo: "texto",
    ...valor,
    ajuda: "Um valor aproximado. Não é publicado, serve para a gente calcular o retorno dos anúncios.",
    obrigatoria: true,
  },
  {
    id: "fecha",
    secao,
    tipo: "escolha",
    titulo: "De cada 10 pessoas que chamam, quantas costumam fechar com você?",
    destaque: "De cada 10",
    ajuda: "Com isso a gente calcula até quanto vale a pena pagar por um contato.",
    obrigatoria: true,
    opcoes: ["Uma ou duas", "De três a cinco", "Mais da metade", "Ainda não sei dizer"],
  },
  {
    id: "capacidade",
    secao,
    tipo: "escolha",
    titulo: "Quantos clientes novos cabem no seu mês?",
    destaque: "cabem no seu mês",
    ajuda: "É por aí que a gente ajusta o ritmo dos anúncios, sem deixar ninguém esperando.",
    obrigatoria: true,
    opcoes: vagas,
  },
  ...horarios.map((p) => ({ ...p, secao })),
  {
    id: "anunciou",
    secao,
    tipo: "longo",
    titulo: "Você já anunciou no Google? Conta como foi.",
    destaque: "já anunciou",
    ajuda: "O que funcionou, o que não funcionou e por que você acha que foi assim.",
    nada: "Ainda não anunciei no Google",
  },
  {
    id: "mais",
    secao,
    tipo: "longo",
    titulo: "Quer contar mais alguma coisa?",
    destaque: "mais alguma coisa",
    ajuda: "Uma novidade chegando, uma meta sua, algo que você prefere que os anúncios não digam. O espaço é livre.",
    nada: "Não, já contei tudo",
  },
];

export const respondeOWhatsapp: Pergunta = {
  id: "responde",
  secao: 0,
  tipo: "horarios",
  titulo: "Em quais horários você consegue responder o WhatsApp?",
  destaque: "consegue responder",
  ajuda: "É nesses horários que vale a pena aparecer. Quem responde rápido sai na frente.",
  obrigatoria: true,
  semHoraMarcada: true,
  papel: "horarios",
};

const OUTROS_HORARIOS = "Não, em outros horários";

/** Quem já contou os horários de atendimento só confirma. */
export const respondeNosMesmos = (horarios: string): Pergunta[] => [
  {
    id: "responde_mesmo",
    secao: 0,
    tipo: "escolha",
    titulo: "Nesses horários você também consegue responder o WhatsApp?",
    destaque: "responder o WhatsApp",
    ajuda: `Você contou que atende ${horarios}. É nas horas em que você responde que vale a pena aparecer.`,
    obrigatoria: true,
    opcoes: ["Sim, nos mesmos horários", OUTROS_HORARIOS],
    papel: "horarios",
  },
  { ...respondeOWhatsapp, se: [{ pergunta: "responde_mesmo", tem: [OUTROS_HORARIOS] }] },
];

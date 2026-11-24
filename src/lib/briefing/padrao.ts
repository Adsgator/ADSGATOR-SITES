import {
  cidadesDosAnuncios,
  comoFunciona,
  diferente,
  facilita,
  MATERIAL_RESTRITO,
  naoQuer,
  nome,
  numeros,
  NUMEROS_SEM_RESTRICAO,
  objecao,
  oJeitoDaPagina,
  oSeuAtendimento,
  quemChega,
  redes,
  respondeNosMesmos,
  respondeOWhatsapp,
  secoesDaPagina,
  secoesDoAds,
  secoesDoAdsComPagina,
  whatsapp,
} from "@/lib/briefing/perguntas";
import type { Briefing } from "@/lib/briefing/regras";

// O briefing padrão, para quando não houver um adaptado ao cliente. Serve a qualquer
// profissão: as opções não falam de preço, pagamento, desconto, gratuidade nem de resultado,
// que os conselhos (OAB, saúde) limitam. Quem quiser, escreve.

type Cliente = Pick<Briefing, "slug" | "nome" | "segmento" | "cidade"> & {
  /** O que o cadastro já sabe; o que faltar vira pergunta. */
  negocio?: string;
};

const FACILIDADES = [
  "Atendimento no mesmo dia",
  "Horário à noite ou no fim de semana",
  "Atendimento por vídeo",
  "Vou até o cliente",
  "Dúvidas pelo WhatsApp",
  "Lugar fácil de estacionar",
  "Acesso para cadeira de rodas",
];

export const padraoDaPagina = ({ negocio, whatsapp: numero, ...cliente }: Cliente & { whatsapp?: string; pastaDoMaterial?: string }): Briefing => ({
  ...cliente,
  tipo: "pagina",
  secoes: secoesDaPagina,
  perguntas: [
    nome(negocio),
    whatsapp(numero),
    {
      id: "atende",
      secao: 0,
      tipo: "multipla",
      titulo: "Como você atende?",
      destaque: "atende",
      ajuda: "Marque todos os jeitos.",
      obrigatoria: true,
      opcoes: ["No meu endereço", "Vou até o cliente", "Por vídeo ou telefone"],
      outra: "Outro jeito",
    },
    {
      id: "endereco",
      secao: 0,
      tipo: "endereco",
      titulo: "Qual é o endereço?",
      destaque: "o endereço",
      obrigatoria: true,
      se: [{ pergunta: "atende", tem: ["No meu endereço"] }],
      papel: "lugar",
    },
    {
      id: "cidades",
      secao: 0,
      tipo: "etiquetas",
      titulo: "Em quais cidades ou regiões você atende?",
      destaque: "cidades ou regiões",
      ajuda: "Toque nas sugestões ou escreva do seu jeito.",
      obrigatoria: true,
      opcoes: ["Brasil todo"],
      sugereRegiao: true,
      se: [{ pergunta: "atende", tem: ["Vou até o cliente", "Por vídeo ou telefone"] }],
      papel: "lugar",
    },
    {
      id: "horarios",
      secao: 0,
      tipo: "horarios",
      titulo: "Em quais dias e horários você atende?",
      destaque: "dias e horários",
      obrigatoria: true,
      papel: "horarios",
    },
    redes,
    {
      id: "servicos",
      secao: 1,
      tipo: "etiquetas",
      titulo: "O que você oferece e gostaria de ver na página?",
      destaque: "gostaria de ver",
      ajuda: "Escreva um de cada vez, com o nome que o seu cliente usa.",
      outra: "Um serviço ou produto",
      obrigatoria: true,
      papel: "servicos",
    },
    {
      id: "detalhes",
      secao: 1,
      tipo: "detalhes",
      titulo: "Como você explica cada um para um cliente?",
      destaque: "explica",
      ajuda: "Do jeito que você falaria no WhatsApp. O espaço é livre.",
      obrigatoria: true,
      opcoesDe: ["servicos"],
    },
    {
      id: "principal",
      secao: 1,
      tipo: "escolha",
      titulo: "Qual deles você busca mais?",
      destaque: "busca mais",
      ajuda: "O que você quer que mais gente procure. Ele ganha mais espaço na página.",
      obrigatoria: true,
      opcoesDe: ["servicos"],
      se: [{ pergunta: "servicos", maisDeUma: true }],
      papel: "principal",
    },
    comoFunciona("Como funciona, do primeiro contato até o fim?", {
      Primeiro: "A pessoa me chama no WhatsApp e conta o que precisa",
      Depois: "O que você faz em seguida",
      "No fim": "Como fica para ela",
    }),
    facilita(FACILIDADES),
    quemChega("Oi, queria saber se você...", "Elas valem ouro na página."),
    {
      id: "quem_quer",
      secao: 2,
      tipo: "longo",
      titulo: "Lembra de um cliente que você adorou atender? Conta como foi.",
      destaque: "adorou atender",
      ajuda: "O momento da pessoa, o que ela precisava e como foi com você, sem nomes. É para a gente conhecer quem você quer atender, não vai para a página.",
      obrigatoria: true,
    },
    {
      id: "elogio",
      secao: 2,
      tipo: "longo",
      titulo: "O que os seus clientes mais falam de você?",
      destaque: "mais falam",
      ajuda: "Aquilo que você já ouviu mais de uma vez, sem nomes.",
      obrigatoria: true,
      papel: "elogio",
    },
    objecao([
      "Acha que vai ser caro",
      "Não sabe se serve para o caso dela",
      "Experiência ruim com outra pessoa",
      "Falta de tempo",
      "Medo ou vergonha",
      "Precisa falar com alguém antes",
    ]),
    {
      id: "duvidas",
      secao: 2,
      tipo: "duvidas",
      titulo: "Quais perguntas sempre te fazem antes de fechar?",
      destaque: "sempre te fazem",
      ajuda: "Toque na pergunta e responda como você responde no WhatsApp.",
      obrigatoria: true,
      opcoes: ["Como funciona o atendimento?", "Quanto tempo leva?", "Você atende a minha região?", "O que eu preciso ter em mãos?"],
      outra: "Outra pergunta",
      papel: "duvidas",
    },
    {
      id: "historia",
      secao: 3,
      tipo: "longo",
      titulo: "Como você começou a trabalhar com isso?",
      destaque: "começou",
      ajuda: "Conte como contaria para alguém que acabou de conhecer.",
      obrigatoria: true,
      papel: "historia",
    },
    diferente,
    numeros(NUMEROS_SEM_RESTRICAO),
    {
      id: "registro",
      secao: 3,
      tipo: "texto",
      titulo: "A sua profissão tem um registro ou conselho?",
      destaque: "registro ou conselho",
      ajuda: "O número vai no rodapé da página.",
      exemplo: "O nome e o número",
      nada: "Não tem",
      papel: "registro",
    },
    ...oJeitoDaPagina(
      {
        titulo: "Tem algo que você prefere não ver na página?",
        destaque: "prefere não ver",
        ajuda: "Uma cor, uma palavra, um assunto ou uma regra da sua profissão. Conte também o que usar no lugar.",
      },
      { semMaterial: MATERIAL_RESTRITO },
    ),
  ],
});

/** O que o briefing da página já contou; com ele, o do Google Ads pergunta só o que falta. */
type DaPagina = { servicos: string[]; principal?: string; cidades: string[]; horarios: NonNullable<Briefing["jaSabemos"]>["horarios"]; horariosEmTexto: string };

export const padraoDoGoogleAds = ({ negocio, site, ...cliente }: Cliente & { site?: string }, pagina?: DaPagina): Briefing => {
  const valor = { titulo: "Em média, quanto um cliente novo representa para você?", destaque: "um cliente novo", exemplo: "Perto de R$..." };
  const vagas = ["Até 5", "De 6 a 10", "De 11 a 20", "Quantos vierem"];
  const comum = { ...cliente, tipo: "google_ads" as const };
  if (pagina)
    return {
      ...comum,
      secoes: secoesDoAdsComPagina,
      jaSabemos: { nome: negocio, site, servicos: pagina.servicos, principal: pagina.principal, horarios: pagina.horarios },
      perguntas: [
        cidadesDosAnuncios(pagina.cidades),
        naoQuer(),
        ...oSeuAtendimento(1, valor, vagas, respondeNosMesmos(pagina.horariosEmTexto)),
      ],
    };
  return {
    ...comum,
    secoes: secoesDoAds,
    jaSabemos: { nome: negocio, site },
    perguntas: [
      cidadesDosAnuncios(),
      quemChega("Oi, queria saber se você...", "Elas mostram como as pessoas procuram você.", 0),
      naoQuer(),
      ...(site
        ? []
        : [
            {
              id: "site",
              secao: 1,
              tipo: "texto" as const,
              titulo: "Qual é o site que vai receber os anúncios?",
              destaque: "o site",
              exemplo: "seunegocio.com.br",
              obrigatoria: true as const,
              papel: "site" as const,
            },
          ]),
      {
        id: "servicos",
        secao: 1,
        tipo: "etiquetas",
        titulo: "O que você gostaria de anunciar?",
        destaque: "anunciar",
        ajuda: "Escreva um de cada vez, com o nome que o seu cliente usa.",
        outra: "Um serviço ou produto",
        obrigatoria: true,
        papel: "servicos",
      },
      {
        id: "principal",
        secao: 1,
        tipo: "escolha",
        titulo: "E se a gente começasse por um, qual seria?",
        destaque: "começasse por um",
        ajuda: "A campanha começa por ele e cresce a partir daí.",
        obrigatoria: true,
        opcoesDe: ["servicos"],
        se: [{ pergunta: "servicos", maisDeUma: true }],
        papel: "principal",
      },
      {
        id: "destaques",
        secao: 1,
        tipo: "multipla",
        titulo: "O que vale destacar logo no anúncio?",
        destaque: "destacar",
        ajuda: "Escolha até 4, o que mais pesa para quem está decidindo.",
        obrigatoria: true,
        max: 4,
        opcoes: [...FACILIDADES.slice(0, 5), "Anos de experiência"],
        outra: "Outro destaque",
        papel: "destaques",
      },
      ...oSeuAtendimento(2, valor, vagas, [respondeOWhatsapp]),
    ],
  };
};

import type { Respostas } from "@/lib/briefing/regras";
import type { Colados } from "@/lib/briefing/sinais";

// Os briefings da amostra já respondidos, para ver como fica um de verdade (pedido do
// Lucas, 2026-11-24). Pessoas, respostas e números inventados.

export type Exemplo = { respostas: Respostas; colados: Colados };

const sim = { opcoes: ["sim"] };

const textoPronto =
  "Ofereço um atendimento personalizado e humanizado, com foco na excelência e na satisfação total do cliente. Utilizo técnicas modernas e eficazes, sempre buscando os melhores resultados para cada família.";

export const exemplos: Record<string, Exemplo> = {
  trabalhista: {
    colados: {},
    respostas: {
      nome: sim,
      whatsapp: sim,
      atende: { opcoes: ["No escritório", "Por vídeo ou telefone"] },
      endereco: {
        opcoes: ["outro"],
        itens: {
          cep: "00000-000",
          rua: "Rua das Acácias",
          numero: "120",
          complemento: "Sala 4",
          bairro: "Centro",
          cidade: "Campinas",
          uf: "SP",
          referencia: "Em cima da padaria, entrada pela lateral",
        },
      },
      cidades: { opcoes: ["Todo o estado de São Paulo"] },
      horarios: {
        horarios: [
          {
            dias: "Segunda a sexta",
            aberto: true,
            de: "09:00",
            ate: "18:00",
            pausa: { de: "12:00", ate: "13:30" },
            diferentes: [{ dia: "Terça", de: "13:00", ate: "20:00" }],
          },
          { dias: "Sábado", aberto: true, de: "09:00", ate: "12:00" },
          { dias: "Domingo", aberto: false, de: "08:00", ate: "12:00" },
        ],
      },
      redes: { itens: { Instagram: "@helenaprado.adv (exemplo)", "E-mail": "contato@helenapradoadvocacia.com.br" } },
      lado: { opcoes: ["O trabalhador"] },
      areas_trabalhador: { opcoes: ["Verbas rescisórias", "Horas extras", "Rescisão indireta", "Trabalho sem carteira"] },
      detalhes: {
        itens: {
          "Verbas rescisórias": "Quando a pessoa sai da empresa e não recebe tudo, ou recebe errado. Eu refaço a conta e vou atrás do que faltou.",
          "Horas extras": "Para quem fica além do horário, almoça correndo ou responde mensagem do chefe de noite e nunca viu isso no holerite.",
          "Rescisão indireta": "É quando a empresa erra tanto que a pessoa pode sair com os direitos de quem foi mandado embora.",
          "Trabalho sem carteira": "Trabalhou meses ou anos sem registro. Dá para pedir o vínculo e tudo o que vinha junto.",
        },
      },
      principal: { opcoes: ["Verbas rescisórias"] },
      passos: {
        itens: {
          Primeiro: "Você me conta o que aconteceu pelo WhatsApp, no seu tempo",
          Depois: "Eu olho os documentos e explico o que dá para pedir, sem enrolar",
          "No fim": "Acompanho até o dinheiro cair e aviso cada passo",
        },
      },
      facilita: { opcoes: ["Atendimento por vídeo", "Primeira conversa sem custo", "Explico sem juridiquês", "Acompanhamento pelo WhatsApp"] },
      quem_chega: { valor: "Oi doutora, me mandaram embora faz um mês e até hoje não recebi nada. Tenho direito a quê?" },
      quem_quer: {
        valor: "Uma moça que trabalhou seis anos numa loja de roupas. Saiu sem receber as férias e achava que não ia dar em nada.",
      },
      elogio: { valor: "Que eu respondo. Falam que o outro advogado sumia e que comigo sabiam o que estava acontecendo." },
      objecao: { opcoes: ["Medo de não dar certo", "Medo de se expor na empresa", "Não sabe se tem direito"] },
      duvidas: {
        itens: {
          "Quanto tempo demora?": "Depende da cidade e se a empresa faz acordo. Eu te digo a média da sua vara antes de começar.",
          "Preciso ir até o escritório?": "Não precisa. Dá para fazer tudo por vídeo e mandar os documentos pelo WhatsApp.",
          "Quais documentos eu preciso?": "Carteira de trabalho, os holerites que tiver e as conversas com a empresa. O resto eu te ajudo a conseguir.",
        },
      },
      historia: {
        valor: "Meu pai foi motorista a vida toda e se aposentou sem nunca ter recebido uma hora extra. Eu vi o que isso fez com a nossa casa. Quando entrei na faculdade já sabia de que lado eu queria ficar.",
      },
      diferente: {
        valor: "Eu mando um áudio toda sexta contando o que andou no processo, mesmo quando não andou nada. Ninguém fica sem notícia.",
      },
      numeros: { itens: { "Anos de experiência": "9 anos", "Pessoas atendidas": "Mais de 400", "Nota no Google": "4,9" } },
      oab: { valor: "OAB/SP 000.000" },
      estilo: { opcoes: ["Elegante", "Acolhedor"] },
      cores_tem: { opcoes: ["Tenho, estão no meu logo"] },
      cores_logo: { opcoes: ["Vinho", "Bege"] },
      sensacao: { opcoes: ["Confiança", "Acolhimento", "Clareza"] },
      admira: { valor: "Gosto de página clara, com pouca coisa na tela. Nada de martelo e balança em todo canto." },
      evitar: { valor: "Não usar a palavra causa ganha. E nada de vermelho forte." },
      material: { opcoes: ["O logo", "Fotos minhas", "Fotos do lugar"] },
      dominio: { opcoes: ["Ainda não tenho"] },
      dominio_novo: sim,
      mais: { valor: "Queria que a pessoa lesse e pensasse que finalmente alguém vai explicar direito para ela." },
    },
  },

  adestramento: {
    colados: { elogio: [textoPronto] },
    respostas: {
      nome: sim,
      whatsapp: sim,
      atende: { opcoes: ["Na casa do cliente", "Online"] },
      cidades: { opcoes: ["Campinas", "Valinhos", "Vinhedo"] },
      horarios: {
        horarios: [
          { dias: "Segunda a sexta", aberto: true, de: "07:00", ate: "19:00", diferentes: [{ dia: "Quarta", de: "07:00", ate: "19:00", fechado: true }] },
          { dias: "Sábado", aberto: true, de: "08:00", ate: "13:00" },
          { dias: "Domingo", aberto: false, de: "08:00", ate: "12:00" },
        ],
        opcoes: ["Só com hora marcada"],
      },
      redes: { itens: { Instagram: "@rafaadestramento (exemplo)", TikTok: "@rafaadestramento (exemplo)" } },
      servicos: { opcoes: ["Adestramento básico", "Filhotes", "Comportamento", "Consultoria online"] },
      detalhes: {
        itens: {
          "Adestramento básico": "Andar sem puxar, vir quando chama, esperar. O que faz o dia a dia ficar leve.",
          Filhotes: "Xixi no lugar, mordida, medo. Quanto antes começa, menos problema depois.",
          Comportamento: "Cão que avança, late demais ou tem medo de tudo. Primeiro entendo o porquê.",
          "Consultoria online": "Para quem mora longe. Vejo o cão por vídeo e monto o plano.",
        },
      },
      principal: { opcoes: ["Comportamento"] },
      dono: { opcoes: ["Sempre"] },
      passos: {
        itens: {
          Primeiro: "Visito a casa e conheço o cão e a rotina",
          Depois: "Monto o plano e a gente treina junto toda semana",
          "No fim": "A família segue sozinha e eu fico no WhatsApp",
        },
      },
      facilita: { opcoes: ["Parcela no cartão", "Suporte pelo WhatsApp entre as aulas", "Vídeos para treinar em casa"] },
      preco: { opcoes: ["Não, prefiro passar no WhatsApp"] },
      quem_quer: { opcoes: ["Avança em gente ou em outros cães", "Tem medo de tudo", "Puxa a guia no passeio"] },
      antes_depois: {
        valor: "Um vira-lata que não deixava ninguém entrar em casa. A dona parou de receber visita. Em três meses ele dormia no tapete com a sala cheia.",
      },
      elogio: { valor: textoPronto },
      objecao: { opcoes: ["Já tentou com outra pessoa", "Acha que o cão não tem jeito", "Medo de o cão sofrer"] },
      duvidas: {
        itens: {
          "Cão adulto ainda aprende?": "Aprende sim. Às vezes até mais rápido que filhote, porque já consegue prestar atenção.",
          "Quantas aulas são?": "Depende do caso, mas na primeira visita eu já te digo uma média.",
        },
      },
      historia: {
        valor: "Adotei um cão que mordia. Três pessoas me falaram para devolver. Fui estudar para não precisar devolver, e nunca mais parei.",
      },
      diferente: { valor: "Não treino o cão longe do dono." },
      numeros: { itens: { "Anos de experiência": "7 anos", "Pessoas atendidas": "Mais de 250 famílias", "Nota no Google": "5,0" } },
      cursos: { nada: true },
      estilo: { opcoes: ["Natural", "Divertido"] },
      cores_tem: { opcoes: ["Ainda não tenho"] },
      cores_novas: { opcoes: ["Verde-petróleo"] },
      sensacao: { opcoes: ["Acolhimento", "Alegria", "Confiança"] },
      admira: { nada: true },
      evitar: { valor: "Não usar a palavra dominar." },
      material: { opcoes: ["Fotos do trabalho", "Vídeos", "Depoimentos de clientes"] },
      dominio: { opcoes: ["Já tenho e uso e-mail com ele"] },
      dominio_qual: { valor: "rafaadestramento.com.br" },
      mais: { nada: true },
    },
  },

  "trabalhista-ads": {
    colados: {},
    respostas: {
      cidades: { opcoes: ["Toda a região de Campinas"] },
      cidades_nao: { nada: true },
      procuram: { opcoes: ["fui demitido e não recebi", "advogado trabalhista perto de mim", "como receber horas extras"] },
      outros_nomes: { opcoes: ["advogado do trabalhador", "doutora trabalhista"] },
      momento: { opcoes: ["Acabou de ser mandado embora", "Ainda trabalha e quer sair"] },
      nao_quer: { opcoes: ["Cálculo de rescisão", "Vaga de estágio", "Outra área do direito"] },
      principal: { opcoes: ["Verbas rescisórias"] },
      destaques: { opcoes: ["Só defendo o trabalhador", "Resposta no mesmo dia", "Atendimento por vídeo"] },
      concorrentes: { nada: true },
      fecha: { opcoes: ["De três a cinco"] },
      capacidade: { opcoes: ["De 3 a 5"] },
      epocas: { opcoes: ["Janeiro", "Fevereiro", "Dezembro"] },
      quem_responde: { opcoes: ["Eu respondo quando consigo parar"] },
      contato: { opcoes: ["Só pelo WhatsApp"] },
      valor: { valor: "Perto de R$ 2.500" },
      responde: {
        horarios: [
          { dias: "Segunda a sexta", aberto: true, de: "08:00", ate: "20:00" },
          { dias: "Sábado", aberto: true, de: "09:00", ate: "13:00" },
          { dias: "Domingo", aberto: false, de: "08:00", ate: "12:00" },
        ],
      },
      anunciou: { opcoes: ["Já, e não deu certo"] },
      anunciou_como: { valor: "Fiz sozinha em 2024. Chegava muita gente querendo só calcular a rescisão e o dinheiro acabava antes do meio-dia." },
      mais: { nada: true },
    },
  },

  "adestramento-ads": {
    colados: {},
    respostas: {
      cidades: { opcoes: ["Campinas", "Valinhos"] },
      cidades_nao: { opcoes: ["Elias Fausto"] },
      quem_quer: { opcoes: ["Avança em gente ou em outros cães", "Tem medo de tudo"] },
      procuram: { opcoes: ["cachorro avança nas visitas", "adestrador perto de mim", "adestramento em casa"] },
      outros_nomes: { opcoes: ["treinador de cachorro", "educador canino"] },
      momento: { opcoes: ["O cão mordeu ou avançou em alguém", "Já tentou com outra pessoa"] },
      nao_quer: { opcoes: ["Curso para virar adestrador", "Banho e tosa", "Hotel para cães"] },
      destaques: { opcoes: ["Vou até a casa", "O dono aprende junto", "Parcela no cartão"] },
      detalhes: {
        itens: {
          Comportamento: "Cão que avança, late demais ou tem medo de tudo. Primeiro entendo o porquê.",
          Filhotes: "Xixi no lugar, mordida e medo. Quanto antes começa, melhor.",
          "Adestramento básico": "Andar sem puxar, vir quando chama, esperar.",
        },
      },
      diferente: { valor: "Não treino o cão longe do dono. A família aprende junto e segue sem depender de mim." },
      numeros: { itens: { "Anos de experiência": "7 anos", "Pessoas atendidas": "Mais de 250 famílias", "Nota no Google": "5,0" } },
      concorrentes: { opcoes: ["Dois adestradores da cidade"] },
      material: { opcoes: ["Fotos do trabalho", "Vídeos"] },
      fecha: { opcoes: ["Mais da metade"] },
      capacidade: { opcoes: ["Até 2"] },
      epocas: { opcoes: ["Janeiro", "Julho", "Dezembro"] },
      quem_responde: { opcoes: ["Eu respondo, quase na hora"] },
      contato: { opcoes: ["Pelo WhatsApp e por ligação"] },
      site: sim,
      servicos: { opcoes: ["Comportamento", "Filhotes", "Adestramento básico"] },
      principal: { opcoes: ["Comportamento"] },
      valor: { valor: "Perto de R$ 900 por mês" },
      regras: { valor: "Não prometer que o cão muda em uma aula." },
      responde: {
        horarios: [
          { dias: "Segunda a sexta", aberto: true, de: "07:00", ate: "21:00" },
          { dias: "Sábado", aberto: true, de: "08:00", ate: "18:00" },
          { dias: "Domingo", aberto: false, de: "08:00", ate: "12:00" },
        ],
      },
      anunciou: { opcoes: ["Nunca"] },
      mais: { nada: true },
    },
  },
};

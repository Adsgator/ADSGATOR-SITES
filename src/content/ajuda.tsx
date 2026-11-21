import type { GuiaSlug } from "@/config/ajuda-enderecos";

// Os guias da Central de Ajuda (plano geral, Parte 3). Os passos seguem a
// ajuda oficial do Google, lida em 2026-11-20 (os links ficam em `fontes`), e
// o processo da Base do painel (Entrada e Google Ads). Os nomes de menu estão
// como o Google escreve. As capturas são do Lucas (decisão dele: telas reais,
// sem alterar, só com o destaque); `captura.numero` é o número da lista que
// ele recebeu, e o arquivo fica em public/capturas/<número>.png.
// Ao mudar uma tela do Google: conferir a ajuda oficial, trocar o texto e a
// captura e atualizar `conferido`.

export type Captura = {
  numero: number;
  /** O que a imagem mostra (texto alternativo e legenda). */
  descricao: string;
  /** Largura e altura do arquivo, quando ele existir. */
  tamanho?: [largura: number, altura: number];
};

export type Passo = {
  titulo: string;
  texto: React.ReactNode;
  captura?: Captura;
  dica?: React.ReactNode;
};

export type Parte = {
  /** Quando o guia tem caminhos diferentes ("Se você já tinha conta"). */
  titulo?: string;
  intro?: React.ReactNode;
  passos: Passo[];
};

export type Guia = {
  slug: GuiaSlug;
  titulo: string;
  /** Título curto, para o cartão da lista. */
  curto: string;
  resumo: string;
  grupo: "Começar no Google Ads" | "Perfil no Google" | "No dia a dia";
  tempo: string;
  /** O que ter à mão antes de começar. */
  antes?: React.ReactNode[];
  /** Mostra o e-mail da Adsgator com o botão de copiar. */
  emailDaAdsgator?: boolean;
  partes: Parte[];
  /** Quando as partes são caminhos alternativos: a pergunta que o cliente
   * responde para ver só o dele (o título de cada parte é a resposta). */
  escolha?: { pergunta: string; respostas: string[] };
  pronto: React.ReactNode;
  duvidas?: { pergunta: string; resposta: React.ReactNode }[];
  /** Próximo guia, quando um leva ao outro. */
  proximo?: GuiaSlug;
  conferido: string;
  fontes: { titulo: string; href: string }[];
};

/** E-mail que o cliente adiciona no perfil (decisão do Lucas, 2026-11-20: no
 * guia, com o botão de copiar). */
export const EMAIL_DA_ADSGATOR = "agenciaadsgator@gmail.com";

/** Mensagem pronta do WhatsApp na central (o guia aberto vai junto). */
export const mensagemDaAjuda = "Olá! Estou na Central de Ajuda da Adsgator e preciso de ajuda.";
export const mensagemDoGuia = (titulo: string) => `Olá! Estou no guia "${titulo}" da Central de Ajuda da Adsgator e preciso de ajuda.`;
export const mensagemDeTerminei = (titulo: string) => `Olá! Terminei o guia "${titulo}" da Central de Ajuda da Adsgator.`;

const b = (texto: string) => <strong className="font-semibold text-foreground">{texto}</strong>;

export const guias: Guia[] = [
  {
    slug: "aceitar-convite",
    titulo: "Aceitar o convite da Adsgator no Google Ads",
    curto: "Aceitar o convite da Adsgator",
    resumo:
      "Para a gente cuidar dos seus anúncios, a sua conta do Google Ads precisa estar ligada à Adsgator. É só aceitar o convite que mandamos.",
    grupo: "Começar no Google Ads",
    tempo: "2 minutos",
    partes: [
      {
        titulo: "Se a Adsgator criou a sua conta",
        intro: "Mandamos o convite para o seu e-mail. Aceitando, você entra na conta como administrador, com acesso a tudo.",
        passos: [
          {
            titulo: "Abra o e-mail do Google Ads",
            texto: (
              <>Procure na caixa de entrada um e-mail do Google Ads com o convite para acessar a conta. Se não estiver lá, olhe no spam e na aba Promoções.</>
            ),
            captura: { numero: 1, descricao: "O e-mail do convite do Google Ads, com o botão para aceitar" },
          },
          {
            titulo: "Aceite o convite",
            texto: (
              <>Clique no botão do e-mail. Se o Google pedir, entre com a Conta do Google desse mesmo e-mail. Se esse e-mail ainda não tem Conta do Google, o próprio Google mostra como criar.</>
            ),
            captura: { numero: 2, descricao: "A tela que abre depois do clique, com o botão para aceitar o convite" },
          },
          {
            titulo: "Pronto, a conta abre",
            texto: <>A conta é sua e fica no seu nome. Falta só cadastrar o pagamento, no próximo guia.</>,
          },
        ],
      },
      {
        titulo: "Se você já tinha uma conta",
        intro: "Você nos mandou o número da conta e a Adsgator pediu para ligar a conta dela à sua. A conta continua sua: você vê tudo e pode desfazer a ligação quando quiser.",
        passos: [
          {
            titulo: "Entre no Google Ads",
            texto: (
              <>
                Acesse <a href="https://ads.google.com" target="_blank" rel="noreferrer">ads.google.com</a> com o e-mail da sua conta.
              </>
            ),
          },
          {
            titulo: "Abra Acesso e segurança",
            texto: <>No menu da esquerda, clique em {b("Administrador")} e depois em {b("Acesso e segurança")}.</>,
            captura: { numero: 3, descricao: "O menu Administrador aberto, com Acesso e segurança" },
          },
          {
            titulo: "Aceite o pedido da Adsgator",
            texto: (
              <>Clique na aba {b("Administradores")}. Em {b("Pedido de vinculação")} aparece a Adsgator. Na coluna {b("Ações")}, clique em {b("Aceitar")}.</>
            ),
            captura: { numero: 4, descricao: "A aba Administradores com o pedido de vinculação e o botão Aceitar" },
            dica: <>Também chega um e-mail do Google com o botão {b("Aceitar solicitação")}. Ele faz a mesma coisa.</>,
          },
        ],
      },
    ],
    escolha: { pergunta: "Como é a sua conta?", respostas: ["A Adsgator criou", "Eu já tinha conta"] },
    pronto: <>Avise a gente no WhatsApp que aceitou. A gente confere a conta e segue com a campanha.</>,
    proximo: "configurar-pagamento",
    conferido: "20/11/2026",
    fontes: [
      { titulo: "Gerenciar o acesso à conta do Google Ads", href: "https://support.google.com/google-ads/answer/6372672?hl=pt-BR" },
      { titulo: "Vincular contas às contas de administrador", href: "https://support.google.com/google-ads/answer/7459601?hl=pt-BR" },
    ],
  },
  {
    slug: "configurar-pagamento",
    titulo: "Configurar o pagamento e verificar a empresa",
    curto: "Configurar o pagamento",
    resumo:
      "Com a conta pronta, falta você cadastrar como vai pagar o Google e confirmar os dados da sua empresa. O pagamento vai direto para o Google, no seu nome.",
    grupo: "Começar no Google Ads",
    tempo: "10 minutos",
    antes: [
      <>Os dados da empresa como estão no cartão do CNPJ ou no certificado do MEI. Se a conta for no seu nome, os do seu RG ou CNH.</>,
      <>O cartão, se for pagar no cartão.</>,
    ],
    partes: [
      {
        titulo: "Cadastrar o pagamento",
        passos: [
          {
            titulo: "Abra o faturamento",
            texto: (
              <>
                Entre no Google Ads. No menu da esquerda, clique em {b("Faturamento")} e depois em {b("Configurações")}. Na primeira vez, o Google abre a tela{" "}
                {b("Insira os detalhes da sua conta e forma de pagamento")}.
              </>
            ),
            captura: { numero: 5, descricao: "A tela de detalhes da conta e forma de pagamento" },
          },
          {
            titulo: "Escolha o país e o tipo de perfil",
            texto: (
              <>
                Em {b("País de faturamento")}, escolha Brasil. Em {b("Tipo de perfil")}, escolha {b("Organização")} se a empresa tem CNPJ ou MEI, ou {b("Pessoa física")} se a conta fica no seu CPF.
              </>
            ),
            captura: { numero: 6, descricao: "O perfil para pagamentos, com o tipo de perfil, o nome e o endereço" },
          },
          {
            titulo: "Preencha nome e endereço como nos documentos",
            texto: (
              <>Escreva o nome e o endereço exatamente como estão no cartão do CNPJ, no MEI ou no seu documento. O Google confere isso depois, na verificação.</>
            ),
          },
          {
            titulo: "Escolha como pagar",
            texto: (
              <>
                <span className="block">
                  {b("Cartão:")} o Google cobra depois que os anúncios rodam, no começo do mês ou quando o gasto chega a um valor. A campanha não para por falta de saldo.
                </span>
                <span className="mt-2 block">
                  {b("Pix:")} você coloca saldo antes e os anúncios rodam enquanto ele durar. A gente avisa antes de acabar.
                </span>
              </>
            ),
            captura: { numero: 7, descricao: "As formas de pagamento para escolher" },
            dica: <>O boleto não está disponível para contas novas no Brasil (regra do Google).</>,
          },
          {
            titulo: "Salve",
            texto: <>Clique em {b("Enviar")}. Se escolheu Pix, coloque o primeiro saldo pelo guia de adicionar saldo.</>,
          },
        ],
      },
      {
        titulo: "Verificar a empresa",
        intro: (
          <>O Google pede a todo anunciante que confirme quem é. O pedido pode vir na hora ou dias depois, num aviso no alto da conta ou por e-mail. A Adsgator acompanha: se o Google pedir documento, a gente te avisa pelo WhatsApp.</>
        ),
        passos: [
          {
            titulo: "Abra as tarefas da verificação",
            texto: (
              <>Clique em {b("Administrador")}, depois em {b("Política")} e em {b("Conta")}. Cada tarefa tem o botão {b("Iniciar tarefa")}.</>
            ),
            captura: { numero: 8, descricao: "A página Conta, em Política, com as tarefas da verificação" },
          },
          {
            titulo: "Responda e envie o que o Google pedir",
            texto: (
              <>
                <span className="block">{b("Empresa:")} o cartão do CNPJ ou o certificado do MEI, e um documento com foto seu (RG ou CNH).</span>
                <span className="mt-2 block">{b("Pessoa física:")} RG ou CNH. Às vezes, também um comprovante de endereço dos últimos 60 dias.</span>
                <span className="mt-2 block">Mande a foto colorida e nítida do documento original, dentro da validade. Print, cópia e foto em preto e branco não valem.</span>
              </>
            ),
            dica: <>Se aparecer a tarefa do vídeo com selfie, ela é sua: o Google pede o rosto de quem é dono do pagamento.</>,
          },
        ],
      },
    ],
    pronto: (
      <>Quando terminar, avise a gente no WhatsApp. A análise do Google leva até 5 dias úteis (raramente, até 30), e a gente acompanha até o fim.</>
    ),
    duvidas: [
      {
        pergunta: "Por que o pagamento fica no meu nome?",
        resposta: <>A conta e a verba são suas: o Google cobra direto de você, e a Adsgator não recebe nem repassa esse dinheiro. Assim você vê cada centavo no Google.</>,
      },
      {
        pergunta: "E se eu não fizer a verificação?",
        resposta: <>Quando o Google pede, ele dá um prazo e não prorroga. Se o prazo passa, a conta para até a verificação terminar. Por isso a gente acompanha de perto.</>,
      },
    ],
    conferido: "20/11/2026",
    fontes: [
      { titulo: "Adicionar uma nova forma de pagamento", href: "https://support.google.com/google-ads/answer/2375375?hl=pt-BR" },
      { titulo: "Sobre as formas de pagamento", href: "https://support.google.com/google-ads/answer/2375433?hl=pt-BR" },
      { titulo: "Verificação do anunciante", href: "https://support.google.com/adspolicy/answer/9703665?hl=pt-BR" },
    ],
  },
  {
    slug: "id-da-conta",
    titulo: "Onde fica o número (ID) da sua conta do Google Ads",
    curto: "Achar o número da sua conta",
    resumo: "Se você já tem conta no Google Ads, a gente precisa do número dela para mandar o convite. Não tem conta? A gente cria para você.",
    grupo: "Começar no Google Ads",
    tempo: "1 minuto",
    partes: [
      {
        passos: [
          {
            titulo: "Entre no Google Ads",
            texto: (
              <>
                Acesse <a href="https://ads.google.com" target="_blank" rel="noreferrer">ads.google.com</a> com o e-mail da sua conta.
              </>
            ),
          },
          {
            titulo: "Veja o número no alto da tela",
            texto: (
              <>O número fica no canto superior direito, perto da sua foto: são 10 algarismos, assim: 123-456-7890. Se não aparecer, clique na sua foto, e ele aparece abaixo do nome da conta.</>
            ),
            captura: { numero: 9, descricao: "O canto superior direito do Google Ads, com o número da conta" },
          },
          {
            titulo: "Mande o número para a gente",
            texto: <>Copie e mande no WhatsApp. Em seguida chega o convite da Adsgator, e o próximo guia mostra como aceitar.</>,
          },
        ],
      },
    ],
    pronto: <>Com o número, a gente manda o convite no mesmo dia.</>,
    proximo: "aceitar-convite",
    conferido: "20/11/2026",
    fontes: [{ titulo: "Encontrar seu ID de cliente do Google Ads", href: "https://support.google.com/google-ads/answer/1704344?hl=pt-BR" }],
  },
  {
    slug: "acesso-ao-perfil",
    titulo: "Dar acesso ao seu perfil no Google",
    curto: "Dar acesso ao seu perfil no Google",
    resumo:
      "O perfil da empresa é o que aparece no Google Maps e na pesquisa, com endereço, horário e avaliações. Com acesso, a gente confere o perfil e liga ele aos anúncios.",
    grupo: "Perfil no Google",
    tempo: "3 minutos",
    emailDaAdsgator: true,
    partes: [
      {
        passos: [
          {
            titulo: "Abra o seu perfil",
            texto: (
              <>
                Acesse <a href="https://business.google.com" target="_blank" rel="noreferrer">business.google.com</a> com o e-mail dono do perfil e abra o perfil da sua empresa.
              </>
            ),
          },
          {
            titulo: "Abra Pessoas e acesso",
            texto: <>Clique em {b("Mais")} (os três pontinhos), depois em {b("Configurações do Perfil da Empresa")} e em {b("Pessoas e acesso")}.</>,
            captura: { numero: 10, descricao: "O menu do perfil com Configurações do Perfil da Empresa" },
          },
          {
            titulo: "Adicione o e-mail da Adsgator",
            texto: <>Clique em {b("Adicionar")} e cole o e-mail da Adsgator, que está no alto desta página.</>,
            captura: { numero: 11, descricao: "Pessoas e acesso, com o botão Adicionar" },
          },
          {
            titulo: "Escolha Administrador e convide",
            texto: <>Em {b("Acesso")}, escolha {b("Administrador")} e clique em {b("Convidar")}.</>,
            captura: { numero: 12, descricao: "A janela do convite, com o e-mail e o acesso Administrador" },
            dica: <>O perfil continua seu. Como administradora, a Adsgator não consegue tirar você do perfil nem apagá-lo.</>,
          },
        ],
      },
    ],
    pronto: <>A Adsgator aparece como pendente até aceitar o convite. A gente aceita e te avisa no WhatsApp.</>,
    duvidas: [
      {
        pergunta: "E se eu não tiver perfil?",
        resposta: <>A gente cria, deixa tudo configurado e te passa o acesso de proprietário. O perfil fica no seu nome.</>,
      },
    ],
    conferido: "20/11/2026",
    fontes: [{ titulo: "Gerenciar proprietários e administradores do Perfil da Empresa", href: "https://support.google.com/business/answer/3403100?hl=pt-BR" }],
  },
  {
    slug: "adicionar-saldo",
    titulo: "Adicionar saldo no Google Ads",
    curto: "Adicionar saldo",
    resumo:
      "Se você paga por Pix, os anúncios rodam enquanto há saldo e param quando ele acaba. A gente avisa antes de acabar, e você coloca mais por aqui.",
    grupo: "No dia a dia",
    tempo: "2 minutos",
    partes: [
      {
        passos: [
          {
            titulo: "Abra o resumo do faturamento",
            texto: <>Entre no Google Ads. No menu da esquerda, clique em {b("Faturamento")} e depois em {b("Resumo")}.</>,
            captura: { numero: 13, descricao: "O Resumo do faturamento, com o quadro Fundos disponíveis" },
          },
          {
            titulo: "Clique em Adicionar fundos",
            texto: (
              <>No quadro {b("Fundos disponíveis")}, clique em {b("Adicionar fundos")}. Escolha {b("Pix")}, digite o valor e clique em {b("Efetuar pagamento")}.</>
            ),
            captura: { numero: 14, descricao: "A tela de adicionar fundos, com o Pix e o valor" },
          },
          {
            titulo: "Pague o Pix",
            texto: <>Leia o QR code com o app do seu banco ou copie o código e cole no Pix Copia e Cola.</>,
            captura: { numero: 15, descricao: "O QR code do Pix gerado pelo Google" },
          },
        ],
      },
    ],
    pronto: <>Quando o Google confirma o pagamento, o saldo aparece em {b("Fundos disponíveis")} e os anúncios voltam a rodar.</>,
    duvidas: [
      {
        pergunta: "Quanto devo colocar?",
        resposta: <>O valor que você combinou com a gente para o mês, de uma vez ou em partes. Se tiver dúvida, chama a gente no WhatsApp.</>,
      },
      {
        pergunta: "Posso pagar no cartão?",
        resposta: <>Pode. Na mesma tela, escolha o cartão no lugar do Pix. Os anúncios costumam voltar logo depois; em alguns casos, em até 24 horas.</>,
      },
      {
        pergunta: "E o boleto?",
        resposta: <>O Google não oferece mais boleto para contas novas no Brasil. Se a sua conta ainda mostra o boleto, ele vale a partir de R$ 40 e leva até 3 dias úteis para entrar.</>,
      },
    ],
    conferido: "20/11/2026",
    fontes: [
      { titulo: "Sobre as formas de pagamento (Pix)", href: "https://support.google.com/google-ads/answer/2375433?hl=pt-BR" },
      { titulo: "Sobre os tempos de processamento de pagamentos", href: "https://support.google.com/google-ads/answer/9436113?hl=pt-BR" },
    ],
  },
];

export const grupos = ["Começar no Google Ads", "Perfil no Google", "No dia a dia"] as const;

export function guiaPorSlug(slug: string) {
  return guias.find((g) => g.slug === slug);
}

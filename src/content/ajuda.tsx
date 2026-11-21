import type { StaticImageData } from "next/image";
import { ChartNoAxesColumnIcon, LayoutTemplateIcon, RocketIcon, StoreIcon, WalletCardsIcon, type LucideIcon } from "lucide-react";

import {
  AvisoDeCookiesAnimado,
  CartaoOuPix,
  EtapasDaVerificacao,
  FunilDasMetricas,
  LeilaoAnimado,
  LinhaDosPrimeirosDias,
  OrcamentoDoDia,
} from "@/components/ajuda/desenhos";
import { ResumoDoMes } from "@/components/resumo-do-mes";
import type { GuiaSlug } from "@/config/ajuda-enderecos";

import convAceitar from "./capturas/convite-aceitar.png";
import convAcesso from "./capturas/convite-acesso-e-seguranca.png";
import convAdministradores from "./capturas/convite-administradores.png";
import idDaConta from "./capturas/id-da-conta.png";
import perfilAdicionar from "./capturas/perfil-adicionar.png";
import perfilConfiguracoes from "./capturas/perfil-configuracoes.png";
import perfilPessoas from "./capturas/perfil-pessoas-e-acesso.png";
import perfilPontinhos from "./capturas/perfil-tres-pontinhos.png";
import perfilVer from "./capturas/perfil-ver-seu-perfil.png";
import saldoAdicionar from "./capturas/saldo-adicionar-fundos.png";
import saldoResumo from "./capturas/saldo-resumo.png";

// Os guias da Central de Ajuda (plano geral, Parte 3). São públicos e lidos
// pelo cliente: nada de nota interna no texto (correção do Lucas, 2026-11-21).
// Os fatos vêm da ajuda oficial do Google, lida em 2026-11-20/21 (as fontes
// ficam nos comentários de cada guia, não na página), e da Base do painel.
// Capturas só onde o cliente precisa achar onde clicar; são as da ajuda antiga
// (2024 e 2025, com o destaque do Lucas), sem alteração. Ao mudar uma tela do
// Google: trocar a captura e o texto.

export type Captura = { imagem: StaticImageData; descricao: string };

export type Passo = {
  titulo: string;
  texto: React.ReactNode;
  captura?: Captura;
  dica?: React.ReactNode;
};

export type Parte = {
  titulo?: string;
  intro?: React.ReactNode;
  passos: Passo[];
};

export type Secao = { titulo: string; texto: React.ReactNode };

/** As categorias da central, na ordem da página inicial. */
export const categorias = [
  { id: "comecar", nome: "Começar no Google Ads", descricao: "Ligar a sua conta à Adsgator e deixar tudo pronto para anunciar.", icone: RocketIcon },
  { id: "perfil", nome: "Perfil no Google", descricao: "O perfil da sua empresa no Google Maps e na pesquisa.", icone: StoreIcon },
  { id: "pagamento", nome: "Pagamento", descricao: "Formas de pagar, saldo, notas fiscais e a verificação do Google.", icone: WalletCardsIcon },
  { id: "resultados", nome: "Entender os resultados", descricao: "O que cada número quer dizer e como a campanha funciona.", icone: ChartNoAxesColumnIcon },
  { id: "pagina", nome: "Sua página", descricao: "O que fica na sua landing page e por quê.", icone: LayoutTemplateIcon },
] as const satisfies readonly { id: string; nome: string; descricao: string; icone: LucideIcon }[];

export type CategoriaId = (typeof categorias)[number]["id"];

export const categoriaPorId = (id: CategoriaId) => categorias.find((c) => c.id === id)!;

/** Palavras que o cliente pode digitar na busca além do título e do resumo. */
export const palavrasDaBusca: Record<GuiaSlug, string> = {
  "aceitar-convite": "convite acesso vincular vinculação ligar conta email e-mail administrador",
  "configurar-pagamento": "pagamento faturamento cartão pix cnpj mei cpf perfil de pagamentos cadastro configurar conta nova",
  "id-da-conta": "id número numero conta código codigo cliente já tenho conta criar conta",
  "acesso-ao-perfil": "google meu negócio negocio perfil da empresa maps mapa acesso administrador gerente convidar",
  "adicionar-saldo": "saldo recarregar recarga crédito credito pix boleto fundos pagar acabou parou",
  "cartao-ou-pix": "cartão cartao pix boleto mercado pago automático manual nota fiscal notas fatura comprovante",
  "verificacao-do-anunciante": "verificação verificacao documento documentos rg cnh cnpj selfie identidade conta pausada",
  "resumo-do-mes": "resumo relatório relatorio mês mes números numeros resultados toques whatsapp custo",
  "primeiros-dias": "começo inicio início primeira semana aprendizado poucos contatos demora",
  "nao-vejo-meu-anuncio": "não aparece nao aparece sumiu anúncio anuncio pesquisei não vejo",
  metricas: "métricas metricas impressões cliques ctr cpc conversão conversao custo",
  leilao: "leilão leilao lance preço preco clique caro posição posicao concorrência",
  "cookies-e-lgpd": "lgpd cookies aviso lei privacidade dados medição",
};

type Base = {
  slug: GuiaSlug;
  titulo: string;
  /** Título curto, para o cartão da lista e as mensagens. */
  curto: string;
  resumo: string;
  grupo: CategoriaId;
  tempo: string;
  duvidas?: { pergunta: string; resposta: React.ReactNode }[];
  /** Outros guias que ajudam depois deste (o primeiro é o "próximo"). */
  relacionados?: GuiaSlug[];
};

/** Guia de passo a passo: partes com passos numerados e o "Fiz este passo". */
export type GuiaDePassos = Base & {
  tipo: "passos";
  antes?: React.ReactNode[];
  /** Mostra o e-mail da Adsgator com o botão de copiar. */
  emailDaAdsgator?: boolean;
  partes: Parte[];
  pronto: React.ReactNode;
};

/** Guia de explicação: seções com título. */
export type GuiaDeExplicacao = Base & { tipo: "explicacao"; secoes: Secao[] };

export type Guia = GuiaDePassos | GuiaDeExplicacao;

/** E-mail que o cliente adiciona no perfil (decisão do Lucas, 2026-11-20). */
export const EMAIL_DA_ADSGATOR = "agenciaadsgator@gmail.com";

/** Mensagens prontas do WhatsApp na central. */
export const mensagemDaAjuda = "Olá! Estou na Central de Ajuda da Adsgator e preciso de ajuda.";
export const mensagemDoGuia = (titulo: string) => `Olá! Estou no guia "${titulo}" da Central de Ajuda da Adsgator e tenho uma dúvida.`;
export const mensagemDeTerminei = (titulo: string) => `Olá! Terminei o guia "${titulo}" da Central de Ajuda da Adsgator.`;

const b = (texto: string) => <strong className="font-semibold text-foreground">{texto}</strong>;
const p = (...linhas: React.ReactNode[]) =>
  linhas.map((linha, i) => (
    <span key={i} className="mt-3 block first:mt-0">
      {linha}
    </span>
  ));
const lista = (itens: React.ReactNode[]) => (
  <span className="mt-3 block space-y-2">
    {itens.map((item, i) => (
      <span key={i} className="flex gap-3">
        <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
        <span>{item}</span>
      </span>
    ))}
  </span>
);
const link = (href: string, texto: string) => (
  <a href={href} target="_blank" rel="noreferrer">
    {texto}
  </a>
);

export const guias: Guia[] = [
  // Fontes: support.google.com/google-ads/answer/6372672 (aceitar o convite) e
  // 7459601 (pedido de vinculação: Administrador > Acesso e segurança >
  // Administradores > Aceitar).
  {
    tipo: "passos",
    slug: "aceitar-convite",
    titulo: "Aceitar o convite da Adsgator no Google Ads",
    curto: "Aceitar o convite da Adsgator",
    resumo: "Se você já tinha conta no Google Ads, a Adsgator manda um pedido para ligar a conta dela à sua. É só aceitar.",
    grupo: "comecar",
    tempo: "2 minutos",
    // Só para quem já tinha conta (Lucas, 2026-11-21): a conta criada pela
    // Adsgator tem o convite avisado pelo WhatsApp.
    partes: [
      {
        intro: "A conta continua sua: você vê tudo e pode desfazer a ligação quando quiser.",
        passos: [
          {
            titulo: "Entre no Google Ads",
            texto: <>Acesse {link("https://ads.google.com", "ads.google.com")} com o e-mail da sua conta.</>,
          },
          {
            titulo: "Abra Acesso e segurança",
            texto: <>No menu da esquerda, clique em {b("Adm.")} e depois em {b("Acesso e segurança")}.</>,
            captura: { imagem: convAcesso, descricao: "O menu Adm. aberto, com Acesso e segurança" },
          },
          {
            titulo: "Abra a aba Administradores",
            texto: <>No alto da tela, clique em {b("Administradores")}.</>,
            captura: { imagem: convAdministradores, descricao: "As abas de Acesso e segurança, com Administradores" },
          },
          {
            titulo: "Aceite o pedido da Adsgator",
            texto: <>Em {b("Pedido de vinculação")} aparece a Adsgator. Na coluna {b("Ações")}, clique em {b("Aceitar")}.</>,
            captura: { imagem: convAceitar, descricao: "O pedido de vinculação da Adsgator, com o botão Aceitar" },
            dica: <>Também chega um e-mail do Google com o botão {b("Aceitar solicitação")}. Ele faz a mesma coisa.</>,
          },
        ],
      },
    ],
    pronto: <>Avise a gente no WhatsApp que aceitou. A gente confere a conta e segue com a sua campanha.</>,
    relacionados: ["configurar-pagamento"],
  },

  // Fontes: answer/2375375 (primeira configuração: País de faturamento, Tipo
  // de perfil Organização/Pessoa física, nome, endereço, forma de pagamento,
  // Enviar), 2375433 (Pix só no pré-pagamento; boleto indisponível para contas
  // novas no Brasil) e adspolicy/answer/15577076 (Administrador > Política >
  // Conta, Iniciar tarefa).
  {
    tipo: "passos",
    slug: "configurar-pagamento",
    titulo: "Configurar o pagamento e verificar a empresa",
    curto: "Configurar o pagamento",
    resumo: "Com a conta pronta, falta cadastrar como você vai pagar o Google e confirmar os dados da sua empresa. O pagamento vai direto para o Google, no seu nome.",
    grupo: "comecar",
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
            texto: <>Entre no Google Ads. No menu da esquerda, clique em {b("Faturamento")}. Na primeira vez, o Google já abre a tela para preencher os dados da conta e a forma de pagamento.</>,
          },
          {
            titulo: "Escolha o país e o tipo de perfil",
            texto: (
              <>
                Em {b("País de faturamento")}, escolha Brasil. Em {b("Tipo de perfil")}, escolha {b("Organização")} se a empresa tem CNPJ ou MEI, ou {b("Pessoa física")} se a conta fica no seu CPF.
              </>
            ),
          },
          {
            titulo: "Preencha nome e endereço como nos documentos",
            texto: <>Escreva o nome e o endereço exatamente como estão no cartão do CNPJ, no MEI ou no seu documento. O Google confere isso depois.</>,
          },
          {
            titulo: "Escolha como pagar e envie",
            texto: (
              <>
                {b("Cartão")} (pagamento automático) ou {b("Pix")} (você coloca saldo antes). Na dúvida, o guia{" "}
                <a href="/cartao-ou-pix">Cartão ou Pix</a> explica a diferença. Depois, clique em {b("Enviar")}.
              </>
            ),
          },
        ],
      },
      {
        titulo: "Verificar a empresa",
        intro: <>O Google pede a todo anunciante que confirme quem é. O pedido pode vir na hora ou dias depois, num aviso no alto da conta ou por e-mail.</>,
        passos: [
          {
            titulo: "Abra as tarefas da verificação",
            texto: <>Clique em {b("Adm.")}, depois em {b("Política")} e em {b("Conta")}. Em cada tarefa, clique em {b("Iniciar tarefa")}.</>,
          },
          {
            titulo: "Responda e envie o que o Google pedir",
            texto: (
              <>
                Normalmente são algumas perguntas sobre a empresa e a foto de um documento. O guia <a href="/verificacao-do-anunciante">Verificação do anunciante</a> mostra
                quais documentos valem.
              </>
            ),
          },
        ],
      },
    ],
    pronto: <>Avise a gente no WhatsApp quando terminar. Se o Google pedir algum documento, a gente te ajuda a enviar.</>,
    duvidas: [
      {
        pergunta: "Por que o pagamento fica no meu nome?",
        resposta: <>A conta e a verba são suas: o Google cobra direto de você, e a Adsgator não recebe nem repassa esse dinheiro. Assim você vê cada centavo no Google.</>,
      },
    ],
    relacionados: ["cartao-ou-pix", "verificacao-do-anunciante"],
  },

  // Fonte: answer/1704344 (o ID fica no alto, à direita; ou clicando na foto).
  {
    tipo: "passos",
    slug: "id-da-conta",
    titulo: "Onde fica o número (ID) da sua conta do Google Ads",
    curto: "Achar o número da sua conta",
    resumo: "Se você já tem conta no Google Ads, a gente precisa do número dela para mandar o convite. Não tem conta? A gente cria para você.",
    grupo: "comecar",
    tempo: "1 minuto",
    partes: [
      {
        passos: [
          {
            titulo: "Entre no Google Ads",
            texto: <>Acesse {link("https://ads.google.com", "ads.google.com")} com o e-mail da sua conta.</>,
          },
          {
            titulo: "Veja o número no alto da tela",
            texto: <>O número fica no canto superior direito, ao lado do nome da conta: são 10 algarismos, assim: 123-456-7890. Se não aparecer, clique na sua foto.</>,
            captura: { imagem: idDaConta, descricao: "O alto da tela do Google Ads, com o número da conta" },
          },
          {
            titulo: "Mande o número para a gente",
            texto: <>Copie e mande no WhatsApp. Em seguida chega o convite da Adsgator.</>,
          },
        ],
      },
    ],
    pronto: <>Com o número, a gente manda o convite no mesmo dia.</>,
    relacionados: ["aceitar-convite"],
  },

  // Fonte: support.google.com/business/answer/3403100 (Pessoas e acesso >
  // Adicionar > e-mail > Acesso: Proprietário ou Administrador > Convidar;
  // administrador não remove usuários). Capturas de 2025 da ajuda antiga; a
  // janela do convite ficou de fora porque ainda dizia "Gerente".
  {
    tipo: "passos",
    slug: "acesso-ao-perfil",
    titulo: "Dar acesso ao seu perfil no Google",
    curto: "Dar acesso ao seu perfil no Google",
    resumo: "O perfil da empresa é o que aparece no Google Maps e na pesquisa, com endereço, horário e avaliações. Com acesso, a gente confere o perfil e liga ele aos anúncios.",
    grupo: "perfil",
    tempo: "3 minutos",
    emailDaAdsgator: true,
    partes: [
      {
        passos: [
          {
            titulo: "Abra o seu perfil",
            texto: (
              <>
                Acesse {link("https://business.google.com", "business.google.com")} com o e-mail dono do perfil. Se aparecer a lista das suas empresas, clique em {b("Ver seu perfil")}.
              </>
            ),
            captura: { imagem: perfilVer, descricao: "A lista de empresas, com Ver seu perfil" },
          },
          {
            titulo: "Clique nos três pontinhos",
            texto: <>No quadro do seu perfil, clique nos três pontinhos ao lado de {b("Força do perfil")}.</>,
            captura: { imagem: perfilPontinhos, descricao: "O perfil da empresa no Google, com os três pontinhos" },
          },
          {
            titulo: "Abra as configurações",
            texto: <>Clique em {b("Configurações do Perfil da Empresa")}.</>,
            captura: { imagem: perfilConfiguracoes, descricao: "O menu com Configurações do Perfil da Empresa" },
          },
          {
            titulo: "Abra Pessoas e acesso",
            texto: <>Clique em {b("Pessoas e acesso")}.</>,
            captura: { imagem: perfilPessoas, descricao: "As configurações do perfil, com Pessoas e acesso" },
          },
          {
            titulo: "Convide a Adsgator",
            texto: (
              <>
                Clique em {b("Adicionar")}, cole o e-mail da Adsgator (no alto desta página), escolha {b("Administrador")} em {b("Acesso")} e clique em {b("Convidar")}.
              </>
            ),
            captura: { imagem: perfilAdicionar, descricao: "Pessoas e acesso, com o botão Adicionar" },
            dica: <>O perfil continua seu. Como administradora, a Adsgator não consegue tirar você do perfil nem apagá-lo.</>,
          },
        ],
      },
    ],
    pronto: <>Avise a gente no WhatsApp. A gente aceita o convite e confere o seu perfil.</>,
    duvidas: [
      {
        pergunta: "E se eu não tiver perfil?",
        resposta: <>A gente cria, deixa tudo configurado e te passa o acesso de proprietário. O perfil fica no seu nome.</>,
      },
    ],
  },

  // Fontes: answer/2375433 (Pix: Faturamento > Resumo > Adicionar fundos > Pix
  // > valor > Efetuar pagamento > QR code ou código; boleto indisponível para
  // contas novas no Brasil) e 9436113 (cartão: em geral logo, às vezes até 24
  // h; boleto a partir de R$ 40, até 3 dias úteis).
  {
    tipo: "passos",
    slug: "adicionar-saldo",
    titulo: "Adicionar saldo no Google Ads",
    curto: "Adicionar saldo",
    resumo: "Se você paga com saldo, os anúncios rodam enquanto ele durar e param quando acaba. A gente avisa antes de acabar, e você coloca mais por aqui.",
    grupo: "pagamento",
    tempo: "2 minutos",
    partes: [
      {
        passos: [
          {
            titulo: "Abra o resumo do faturamento",
            texto: <>Entre no Google Ads. No menu da esquerda, clique em {b("Faturamento")} e depois em {b("Resumo")}.</>,
            captura: { imagem: saldoResumo, descricao: "O menu Faturamento, com Resumo" },
          },
          {
            titulo: "Clique em Adicionar fundos",
            texto: <>No quadro {b("Fundos disponíveis")}, clique em {b("Adicionar fundos")}.</>,
            captura: { imagem: saldoAdicionar, descricao: "O quadro Fundos disponíveis, com Adicionar fundos" },
          },
          {
            titulo: "Escolha o Pix, o valor e pague",
            texto: <>Escolha {b("Pix")}, digite o valor e clique em {b("Efetuar pagamento")}. Pague pelo QR code ou pelo Pix Copia e Cola, no app do seu banco.</>,
          },
        ],
      },
    ],
    pronto: <>Quando o Google confirma o pagamento, o saldo aparece em {b("Fundos disponíveis")} e os anúncios voltam a rodar.</>,
    duvidas: [
      {
        pergunta: "Quanto devo colocar?",
        resposta: <>O valor que você combinou com a gente para o mês, de uma vez ou em partes.</>,
      },
      {
        pergunta: "Posso pagar no cartão?",
        resposta: <>Pode. Na mesma tela, escolha o cartão no lugar do Pix. Os anúncios costumam voltar logo depois; em alguns casos, em até 24 horas.</>,
      },
      {
        pergunta: "E o boleto?",
        resposta: <>O Google não oferece boleto para contas novas no Brasil. Nas contas antigas que ainda têm, ele vale a partir de R$ 40 e leva até 3 dias úteis para entrar.</>,
      },
    ],
    relacionados: ["cartao-ou-pix"],
  },

  // Fontes: answer/1704418 (pós-pagamento: cobrança no 1º dia do mês ou ao
  // atingir o limite; pré-pagamento: para quando acaba; trocar em Faturamento >
  // Configurações > Como você fará o pagamento), 2375433 (Pix só no
  // pré-pagamento) e 1723045 (Faturamento > Documentos > Documentos fiscais e
  // legais, PDF, a partir do 5º dia útil do mês seguinte; no pré-pagamento,
  // uma fatura a cada pagamento; comprovante em Faturamento > Resumo).
  {
    tipo: "explicacao",
    slug: "cartao-ou-pix",
    titulo: "Cartão ou Pix: como pagar o Google Ads",
    curto: "Cartão ou Pix",
    resumo: "Dá para pagar o Google de dois jeitos: no cartão, depois que os anúncios rodam, ou com saldo colocado antes, por Pix. Veja qual combina com você.",
    grupo: "pagamento",
    tempo: "3 minutos de leitura",
    secoes: [
      {
        titulo: "Os dois jeitos, lado a lado",
        texto: <CartaoOuPix />,
      },
      {
        titulo: "Cartão: o Google cobra depois",
        texto: p(
          <>O Google cobra o que os anúncios gastaram no primeiro dia de cada mês, ou antes, quando o gasto chega a um valor combinado com ele.</>,
          <>A vantagem é que a campanha não para por falta de saldo. É o jeito mais tranquilo para quem não quer se preocupar com isso.</>,
        ),
      },
      {
        titulo: "Pix: você coloca saldo antes",
        texto: p(
          <>Você coloca um valor na conta e os anúncios rodam enquanto ele durar. Quando o saldo acaba, os anúncios param até você colocar mais.</>,
          <>
            A vantagem é ter controle total do quanto sai por vez. A gente avisa antes de o saldo acabar, e o guia <a href="/adicionar-saldo">Adicionar saldo</a> mostra
            como colocar mais. Nesse jeito também dá para usar cartão ou Mercado Pago.
          </>,
        ),
      },
      {
        titulo: "Dá para trocar depois?",
        texto: p(
          <>
            Dá. Em {b("Faturamento")}, {b("Configurações")}, na parte {b("Como você fará o pagamento")}. Se tiver dúvida, chama a gente antes de trocar.
          </>,
        ),
      },
      {
        titulo: "Notas fiscais e comprovantes",
        texto: p(
          <>
            As notas ficam na própria conta, em {b("Faturamento")}, {b("Documentos")}, na aba {b("Documentos fiscais e legais")}. Marque as que quiser e baixe em PDF.
          </>,
          <>Os documentos de um mês ficam prontos a partir do 5º dia útil do mês seguinte. Com saldo, o Google gera uma nota a cada pagamento.</>,
          <>O comprovante de um pagamento fica em {b("Faturamento")}, {b("Resumo")}: abra o mês e clique no pagamento.</>,
        ),
      },
    ],
    relacionados: ["adicionar-saldo"],
  },

  // Fontes: adspolicy/answer/9703665, 15577076, 9872280 e 15588490
  // (Administrador > Política > Conta; tarefas; documentos aceitos no Brasil;
  // prazo sem prorrogação; análise em até 5 dias úteis, raramente 30; selfie só
  // pelo administrador do perfil para pagamentos).
  {
    tipo: "explicacao",
    slug: "verificacao-do-anunciante",
    titulo: "Verificação do anunciante: o que é e o que enviar",
    curto: "Verificação do anunciante",
    resumo: "O Google pede a todo anunciante que confirme quem é. Veja o que ele pede, quais documentos valem e quanto tempo leva.",
    grupo: "pagamento",
    tempo: "3 minutos de leitura",
    secoes: [
      {
        titulo: "Por que o Google pede",
        texto: p(
          <>É uma conferência para mostrar às pessoas quem está por trás de cada anúncio. Vale para todo mundo que anuncia, grande ou pequeno.</>,
          <>O pedido chega num aviso no alto da conta ou por e-mail. As tarefas ficam em {b("Adm.")}, {b("Política")}, {b("Conta")}.</>,
        ),
      },
      {
        titulo: "O que ele pede",
        texto: lista([
          <>Algumas perguntas sobre a empresa e sobre quem paga os anúncios.</>,
          <>{b("Empresa:")} o cartão do CNPJ ou o certificado do MEI, e um documento com foto do responsável.</>,
          <>{b("Pessoa física:")} RG, CNH, passaporte ou carteira de trabalho. Às vezes, também um comprovante de endereço dos últimos 60 dias, como conta de luz, água ou internet.</>,
          <>Às vezes, a confirmação de um código por telefone ou um vídeo com selfie. A selfie só quem é dono do pagamento consegue fazer.</>,
        ]),
      },
      {
        titulo: "Como mandar o documento",
        texto: p(
          <>Foto colorida e nítida do documento original, dentro da validade. Print, cópia e foto em preto e branco não valem.</>,
          <>O nome e o endereço precisam ser iguais aos que estão no pagamento da conta. É aí que a maioria das verificações trava.</>,
        ),
      },
      {
        titulo: "Quanto tempo leva",
        texto: (
          <>
            {p(
              <>A análise leva até 5 dias úteis; em casos raros, até 30. Os anúncios continuam rodando enquanto isso.</>,
              <>Quando o Google dá um prazo, ele não prorroga. Se o prazo passar, a conta para até a verificação terminar. Por isso, se chegar o aviso, faça logo ou chama a gente.</>,
            )}
            <EtapasDaVerificacao />
          </>
        ),
      },
    ],
    relacionados: ["configurar-pagamento"],
  },

  // Fonte: Base do painel (Resumo do mês: mensagem e e-mail, toques no
  // WhatsApp, custo por toque, o que fizemos; o Google conta menos que o
  // WhatsApp porque quem recusa os cookies não entra na conta).
  {
    tipo: "explicacao",
    slug: "resumo-do-mes",
    titulo: "Como ler o resumo do mês",
    curto: "Como ler o resumo do mês",
    resumo: "Todo mês você recebe os números da sua campanha e o que a gente fez nela. Veja o que cada número quer dizer.",
    grupo: "resultados",
    tempo: "3 minutos de leitura",
    secoes: [
      {
        titulo: "O que chega",
        texto: (
          <>
            {p(<>Uma mensagem curta no WhatsApp, com o principal, e o resumo completo por e-mail. Um exemplo, com números inventados:</>)}
            <div className="mt-5">
              <ResumoDoMes
                titulo="Resumo do mês · exemplo"
                numeros={[
                  { rotulo: "Pessoas que viram o anúncio", valor: 4812, fracao: 0.88 },
                  { rotulo: "Visitas à página", valor: 386, fracao: 0.56 },
                  { rotulo: "Toques no WhatsApp", valor: 41, fracao: 0.3 },
                ]}
                fizemos={["Cortamos buscas de quem procurava curso, não o serviço", "Os anúncios passaram a aparecer só no seu horário de atendimento"]}
              />
            </div>
          </>
        ),
      },
      {
        titulo: "Toques no WhatsApp: o número que mais importa",
        texto: p(
          <>É quantas pessoas chegaram pelo anúncio e tocaram no botão do WhatsApp da sua página. É gente procurando o seu serviço e querendo falar com você.</>,
          <>A mensagem delas chega com &ldquo;vi o anúncio no Google&rdquo;, para você saber de onde veio.</>,
        ),
      },
      {
        titulo: "Investido e custo por toque",
        texto: p(
          <>{b("Investido")} é quanto o Google cobrou no período.</>,
          <>{b("Custo por toque")} é o investido dividido pelos toques. Ele mostra quanto custa, em média, cada pessoa que te chama pelo anúncio.</>,
        ),
      },
      {
        titulo: "Por que o WhatsApp recebe mais do que o resumo mostra",
        texto: p(
          <>
            Pela lei de proteção de dados, a sua página pergunta se a pessoa aceita os cookies. Quem recusa não entra na conta do Google, mas te chama do mesmo jeito.
            Por isso, o normal é você receber mais contatos do que o resumo mostra.
          </>,
        ),
      },
      {
        titulo: "O que fizemos",
        texto: p(<>No fim vem o que a gente ajustou no período: pesquisas bloqueadas por não terem a ver com você, anúncios melhorados, horários e cidades ajustados.</>),
      },
    ],
    relacionados: ["metricas", "cookies-e-lgpd"],
  },

  // Fontes: answer/13020501 (aprendizado nunca passa de 7 dias; os anúncios
  // rodam normalmente; avaliar depois de 2 semanas; mudanças grandes de meta ou
  // estratégia reiniciam) e 9208915 (anúncios revisados em 24 a 48 h, contas
  // novas até 5 dias úteis). Da Base: a conferência de 48 h.
  {
    tipo: "explicacao",
    slug: "primeiros-dias",
    titulo: "Os primeiros dias da sua campanha",
    curto: "Os primeiros dias da campanha",
    resumo: "Nos primeiros dias o Google ainda está aprendendo quem é o seu cliente. Veja o que esperar e por que os contatos começam aos poucos.",
    grupo: "resultados",
    tempo: "3 minutos de leitura",
    secoes: [
      {
        titulo: "As duas primeiras semanas",
        texto: <LinhaDosPrimeirosDias />,
      },
      {
        titulo: "Primeiro, a análise dos anúncios",
        texto: p(<>Todo anúncio novo passa pela análise do Google. A maioria sai em 24 a 48 horas; em conta nova, pode levar até 5 dias úteis.</>),
      },
      {
        titulo: "Depois, o Google aprende",
        texto: p(
          <>Na primeira semana, o Google testa os anúncios em pesquisas, horários e lugares diferentes para descobrir onde estão os seus clientes. Os anúncios aparecem normalmente nesse tempo.</>,
          <>Por isso os contatos começam aos poucos e o custo pode oscilar. É normal.</>,
        ),
      },
      {
        titulo: "O que a gente faz nesse tempo",
        texto: lista([
          <>Confere a campanha nos dois primeiros dias: anúncios aprovados, gasto e as primeiras pesquisas.</>,
          <>Bloqueia as pesquisas que não têm a ver com o seu serviço.</>,
          <>Evita mudanças grandes, que fariam o Google recomeçar o aprendizado.</>,
        ]),
      },
      {
        titulo: "Quando dá para avaliar",
        texto: p(<>Depois de umas duas semanas os números ficam mais firmes. O primeiro resumo do mês já mostra como a campanha está indo.</>),
      },
      {
        titulo: "Como você ajuda",
        texto: lista([
          <>Responda rápido quem chamar: quem procura no Google costuma chamar mais de um lugar.</>,
          <>Se chegar contato que não tem nada a ver com o seu serviço, conta para a gente. Isso ajuda a ajustar as pesquisas.</>,
        ]),
      },
    ],
    relacionados: ["nao-vejo-meu-anuncio", "resumo-do-mes"],
  },

  // Fontes: answer/9208915 (motivos de não exibir: orçamento, programação,
  // segmentação, lance e classificação, análise, conta e faturamento) e 148778
  // (Ferramentas > Solução de problemas > Diagnóstico e visualização de
  // anúncios: mostra a prévia sem somar impressões).
  {
    tipo: "explicacao",
    slug: "nao-vejo-meu-anuncio",
    titulo: "Pesquisei e não vi o meu anúncio. E agora?",
    curto: "Pesquisei e não vi meu anúncio",
    resumo: "Não ver o anúncio quando você pesquisa não quer dizer que ele não está aparecendo para os seus clientes. Veja por que acontece.",
    grupo: "resultados",
    tempo: "3 minutos de leitura",
    secoes: [
      {
        titulo: "Os motivos mais comuns",
        texto: lista([
          <>{b("O orçamento do dia já foi usado.")} O Google distribui os anúncios ao longo do dia; quando o valor do dia acaba, eles voltam no dia seguinte.</>,
          <>{b("Fora do horário.")} Os anúncios aparecem no horário em que você atende.</>,
          <>{b("Fora da região.")} Eles aparecem para quem está nas cidades da campanha. Se você pesquisou de outro lugar, não vê.</>,
          <>{b("A pesquisa foi diferente.")} O anúncio aparece para as pesquisas escolhidas para o seu serviço, não para qualquer uma.</>,
          <>{b("O leilão muda a cada pesquisa.")} Cada busca é uma disputa nova entre os anunciantes, então o anúncio não aparece em todas.</>,
          <>{b("Anúncio em análise ou saldo no fim.")} Anúncio novo leva de 24 a 48 horas para ser aprovado; e, se você paga com saldo, os anúncios param quando ele acaba.</>,
        ]),
      },
      {
        titulo: "O mais comum: o orçamento do dia",
        texto: (
          <>
            {p(<>Se você pesquisa no fim da tarde e o orçamento do dia já foi usado, o anúncio só volta no dia seguinte. Ele apareceu para quem pesquisou mais cedo.</>)}
            <OrcamentoDoDia />
          </>
        ),
      },
      {
        titulo: "Por que não vale ficar pesquisando",
        texto: p(
          <>Cada vez que o anúncio aparece para você, conta nos números da campanha como se fosse um cliente que não se interessou. E, se você clicar, o Google cobra o clique.</>,
        ),
      },
      {
        titulo: "Como ver o seu anúncio sem atrapalhar",
        texto: p(
          <>Pede para a gente: a gente usa a ferramenta de prévia do próprio Google e te manda como o anúncio aparece.</>,
          <>
            Se quiser ver sozinho, ela fica no Google Ads, em {b("Ferramentas")}, {b("Solução de problemas")}, {b("Diagnóstico e visualização de anúncios")}.
          </>,
        ),
      },
    ],
    relacionados: ["leilao", "primeiros-dias"],
  },

  // Fontes: answer/6320 (impressões), 2615875 (CTR), 14074 (CPC médio),
  // 2684489 (taxa de conversão) e 6396841 (custo por conversão).
  {
    tipo: "explicacao",
    slug: "metricas",
    titulo: "As principais métricas do Google Ads, sem complicação",
    curto: "As principais métricas",
    resumo: "Impressões, cliques, CTR, CPC, conversão: o que cada número quer dizer, em palavras simples.",
    grupo: "resultados",
    tempo: "4 minutos de leitura",
    secoes: [
      {
        titulo: "O caminho, em números",
        texto: (
          <>
            {p(<>Cada número mostra uma parte do caminho entre o anúncio e a mensagem no seu WhatsApp:</>)}
            <FunilDasMetricas />
          </>
        ),
      },
      { titulo: "Impressões", texto: p(<>Quantas vezes o seu anúncio apareceu para alguém. Conta uma a cada aparição.</>) },
      { titulo: "Cliques", texto: p(<>Quantas vezes alguém clicou no anúncio e foi para a sua página.</>) },
      {
        titulo: "CTR (taxa de cliques)",
        texto: p(<>De cada 100 pessoas que viram o anúncio, quantas clicaram. Se 100 viram e 5 clicaram, o CTR é de 5%. CTR alto quer dizer que o anúncio chama a atenção de quem procura.</>),
      },
      {
        titulo: "CPC médio (custo por clique)",
        texto: p(<>Quanto custou, em média, cada clique. É o valor gasto dividido pelo número de cliques.</>),
      },
      {
        titulo: "Conversões",
        texto: p(<>É a ação que importa para o seu negócio. Na sua campanha, a conversão é o toque no botão do WhatsApp da sua página.</>),
      },
      {
        titulo: "Taxa de conversão",
        texto: p(<>De cada 100 pessoas que clicaram no anúncio, quantas tocaram no WhatsApp. Ela mostra se a página convence quem chega.</>),
      },
      {
        titulo: "Custo por conversão",
        texto: p(<>Quanto custou, em média, cada toque no WhatsApp. No resumo do mês, é o custo por toque.</>),
      },
      {
        titulo: "Qual olhar primeiro",
        texto: p(<>Os toques no WhatsApp e o custo por toque. Os outros números explicam o caminho até eles, e é com eles que a gente ajusta a campanha.</>),
      },
    ],
    relacionados: ["resumo-do-mes", "leilao"],
  },

  // Fontes: answer/142918 (leilão a cada pesquisa), 1752122 (classificação:
  // lance, qualidade do anúncio e da página, mínimo, concorrência, contexto,
  // recursos) e 6297 (CPC real em geral menor que o máximo, às vezes muito: o
  // mínimo para superar o anunciante de baixo).
  {
    tipo: "explicacao",
    slug: "leilao",
    titulo: "Como funciona o leilão do Google",
    curto: "Como funciona o leilão",
    resumo: "Cada pesquisa no Google é uma disputa rápida entre os anunciantes. Veja o que decide quem aparece e quanto custa cada clique.",
    grupo: "resultados",
    tempo: "3 minutos de leitura",
    secoes: [
      {
        titulo: "Um leilão a cada pesquisa",
        texto: p(
          <>Quando alguém pesquisa, o Google separa os anúncios que combinam com a pesquisa, tira os que não podem aparecer ali e mostra os mais bem classificados. Tudo em uma fração de segundo.</>,
          <>Como isso acontece a cada pesquisa, a posição do anúncio muda de uma busca para outra. É normal.</>,
        ),
      },
      {
        titulo: "O que decide quem aparece",
        texto: lista([
          <>{b("O lance:")} quanto a campanha aceita pagar por um clique.</>,
          <>{b("A qualidade:")} se o anúncio e a página respondem bem ao que a pessoa procurou.</>,
          <>{b("O contexto:")} onde a pessoa está, o horário, o aparelho e o que ela pesquisou.</>,
          <>{b("Os complementos do anúncio:")} telefone, links extras e outras informações que ajudam a pessoa a decidir.</>,
        ]),
      },
      {
        titulo: "Quem paga mais nem sempre aparece primeiro",
        texto: (
          <>
            {p(
              <>Um anúncio bom, com uma página boa, pode ficar acima de um concorrente que paga mais, pagando menos que ele.</>,
              <>E o clique custa, em geral, menos que o máximo da campanha: o Google cobra só o necessário para passar o anunciante logo abaixo.</>,
            )}
            <LeilaoAnimado />
          </>
        ),
      },
      {
        titulo: "O que deixa o clique mais caro",
        texto: lista([
          <>Muita concorrência na mesma pesquisa e na mesma cidade.</>,
          <>Anúncio ou página que não respondem bem à pesquisa.</>,
        ]),
      },
      {
        titulo: "O que a gente faz",
        texto: p(<>Escreve anúncios ligados a cada pesquisa, cuida da sua página e bloqueia as pesquisas que não trazem cliente. Assim você disputa com qualidade, e não só com preço.</>),
      },
    ],
    relacionados: ["metricas", "nao-vejo-meu-anuncio"],
  },

  // Fonte: Base do painel (as páginas da Adsgator saem com o aviso de cookies;
  // a medição respeita a escolha; quem recusa não entra na conta do Google).
  {
    tipo: "explicacao",
    slug: "cookies-e-lgpd",
    titulo: "LGPD e o aviso de cookies na sua página",
    curto: "LGPD e o aviso de cookies",
    resumo: "Por que a sua página pergunta se a pessoa aceita os cookies e o que isso muda nos números da campanha.",
    grupo: "pagina",
    tempo: "2 minutos de leitura",
    secoes: [
      {
        titulo: "O que é a LGPD",
        texto: p(
          <>É a Lei Geral de Proteção de Dados, de 2018. Ela diz que um site precisa da permissão da pessoa antes de usar cookies que medem o que ela faz, como os do Google Ads e do Google Analytics.</>,
        ),
      },
      {
        titulo: "O aviso da sua página",
        texto: p(
          <>As páginas feitas pela Adsgator já saem com o aviso de cookies. A medição só começa depois que a pessoa toca em {b("Aceitar")}. Se ela recusar, a página funciona normalmente.</>,
        ),
      },
      {
        titulo: "O que muda nos números",
        texto: (
          <>
            {p(
              <>Quem recusa os cookies não entra na conta do Google, mas pode te chamar no WhatsApp do mesmo jeito. Por isso o resumo do mês mostra menos contatos do que você recebe de verdade.</>,
            )}
            <AvisoDeCookiesAnimado />
          </>
        ),
      },
      {
        titulo: "Por que vale a pena",
        texto: p(<>A sua página respeita quem visita e fica dentro da lei. E as pessoas confiam mais em quem pergunta antes.</>),
      },
    ],
    relacionados: ["resumo-do-mes"],
  },
];

export function guiaPorSlug(slug: string) {
  return guias.find((g) => g.slug === slug);
}

/** O que a busca precisa de cada guia (só texto: vai para o navegador). */
export const itensDaBusca = guias.map((g) => ({
  slug: g.slug,
  curto: g.curto,
  resumo: g.resumo,
  categoria: categoriaPorId(g.grupo).nome,
  texto: `${g.titulo} ${palavrasDaBusca[g.slug]}`,
}));

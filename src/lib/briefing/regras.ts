// O briefing é uma lista de perguntas que vem pronta para cada cliente (plano
// geral, Parte 5). Aqui ficam os tipos de pergunta e as regras: o que aparece,
// o que conta como respondido, a porcentagem e a resposta em texto. Nada de
// conteúdo de cliente: as perguntas chegam de fora.

import type { IconeDoNegocio } from "@/lib/briefing/icones";

export type TipoDePergunta =
  | "texto"
  | "longo"
  | "escolha"
  | "multipla"
  | "confirmar"
  | "endereco"
  | "etiquetas"
  | "detalhes"
  | "horarios"
  | "redes"
  | "duvidas"
  | "cores"
  | "meses"
  | "estilo";

/** A pergunta só aparece quando todas as condições valem. */
export type Condicao = {
  pergunta: string;
  /** Alguma destas opções foi marcada. */
  tem?: string[];
  /** Mais de uma opção foi marcada. */
  maisDeUma?: true;
};

/** O que a resposta faz aparecer no desenho da página (rascunho-da-pagina.tsx). */
export type Papel =
  | "nome"
  | "whatsapp"
  | "lugar"
  | "horarios"
  | "servicos"
  | "clientes"
  | "duvidas"
  | "historia"
  | "principal"
  | "passos"
  | "numeros"
  | "elogio"
  | "estilo"
  | "cores"
  | "sensacao"
  | "facilita"
  | "diferente"
  | "redes"
  | "registro"
  | "preco"
  | "dominio"
  | "nomes"
  | "momento"
  | "destaques"
  | "fora"
  | "epocas"
  | "contato"
  | "site"
  | "cidades"
  | "procuram"
  | "naoQuer";

export type Pergunta = {
  id: string;
  secao: number;
  tipo: TipoDePergunta;
  titulo: string;
  /** Pedaço do título que leva o marca-texto da marca. */
  destaque?: string;
  ajuda?: string;
  /** Texto de exemplo dentro do campo. */
  exemplo?: string;
  obrigatoria?: true;
  /** Nas opcionais, a resposta de quem não tem ("Não uso redes sociais"). */
  nada?: string;
  se?: Condicao[];
  opcoes?: string[];
  /** O exemplo de cada campo, quando a pergunta tem vários. */
  exemplos?: Record<string, string>;
  /** Como a pergunta das cores é respondida. */
  modo?: "exatas" | "logo" | "combinacoes";
  /** As opções são as respostas destas perguntas (das que aparecem). */
  opcoesDe?: string[];
  max?: number;
  /** Sugere a cidade do cliente e as vizinhas de verdade (src/lib/regiao.ts). */
  sugereRegiao?: true;
  /** Deixa escrever uma opção que não está na lista. */
  outra?: string;
  /** Para confirmar o que já se sabe. */
  valorConhecido?: string;
  rotuloDoOutro?: string;
  papel?: Papel;
};

/** Um período de atendimento, com o intervalo no meio quando tem. */
export type Periodo = { de: string; ate: string; pausa?: { de: string; ate: string } };

/** Um dia de segunda a sexta com horário próprio (ou sem atendimento). */
export type DiaDiferente = Periodo & { dia: string; fechado?: boolean };

export type Horario = Periodo & { dias: string; aberto: boolean; diferentes?: DiaDiferente[] };

export type Resposta = {
  /** Marcou a resposta de quem não tem. */
  nada?: boolean;
  valor?: string;
  opcoes?: string[];
  itens?: Record<string, string>;
  horarios?: Horario[];
};

export type Respostas = Record<string, Resposta>;

export type TipoDeBriefing = "pagina" | "google_ads";

export type Briefing = {
  slug: string;
  tipo: TipoDeBriefing;
  /** O primeiro nome, para a saudação. */
  nome: string;
  segmento: string;
  secoes: string[];
  perguntas: Pergunta[];
  /** A cidade do cadastro. */
  cidade?: { nome: string; uf: string };
  /** O ícone do negócio, no desenho da página. */
  icone?: IconeDoNegocio;
  /** O nome do negócio, quando não veio do briefing da página. */
  negocio?: string;
  /** A pasta do cliente no Drive, para o material (logo, fotos). */
  pastaDoMaterial?: string;
  /** O que já veio do briefing da página, para o desenho do anúncio. */
  jaSabemos?: { nome: string; site: string; servicos: string[] };
};

/** Textos longos obrigatórios precisam dizer alguma coisa. */
export const MINIMO_DO_LONGO = 20;

export const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export const DIAS_UTEIS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
export const SEMANA = [...DIAS_UTEIS, "Sábado", "Domingo"];
export const DE_SEGUNDA_A_SEXTA = "Segunda a sexta";

export const HORARIOS_INICIAIS: Horario[] = [
  { dias: DE_SEGUNDA_A_SEXTA, aberto: false, de: "08:00", ate: "18:00" },
  { dias: "Sábado", aberto: false, de: "08:00", ate: "12:00" },
  { dias: "Domingo", aberto: false, de: "08:00", ate: "12:00" },
];

const PARTES_DO_ENDERECO: [string, string][] = [
  ["rua", "a rua"],
  ["numero", "o número"],
  ["bairro", "o bairro"],
  ["cidade", "a cidade"],
  ["uf", "o estado"],
];

export const HORA_MARCADA = "Só com hora marcada";

const cheio = (texto?: string) => Boolean(texto?.trim());

/** O período de cada dia da semana (null quando não atende). */
export function semanaDe(horarios: Horario[]): { dia: string; periodo: Periodo | null }[] {
  return SEMANA.map((dia) => {
    const linha = horarios.find((h) => h.dias === dia) ?? horarios.find((h) => h.dias === DE_SEGUNDA_A_SEXTA);
    if (!linha?.aberto) return { dia, periodo: null };
    const proprio = linha.diferentes?.find((d) => d.dia === dia);
    return { dia, periodo: proprio ? (proprio.fechado ? null : proprio) : linha };
  });
}

function problemaDoPeriodo(nome: string, p: Periodo): string | null {
  if (p.ate <= p.de) return `${nome} termina antes de começar. Confira as horas.`;
  if (p.pausa && (p.pausa.de <= p.de || p.pausa.ate >= p.ate || p.pausa.ate <= p.pausa.de))
    return `${nome} tem um intervalo fora do horário. Confira as horas.`;
  return null;
}

const textoDoPeriodo = (p: Periodo) =>
  p.pausa ? `das ${p.de} às ${p.pausa.de} e das ${p.pausa.ate} às ${p.ate}` : `das ${p.de} às ${p.ate}`;

/** Os horários em linhas, com os dias iguais juntos ("Segunda, quarta e sexta, das 08:00 às 18:00"). */
function textoDosHorarios(horarios: Horario[]): string[] {
  const grupos = new Map<string, string[]>();
  for (const { dia, periodo } of semanaDe(horarios)) {
    if (!periodo) continue;
    const texto = textoDoPeriodo(periodo);
    grupos.set(texto, [...(grupos.get(texto) ?? []), dia]);
  }
  return [...grupos].map(([texto, dias]) => {
    const juntos =
      dias.join() === DIAS_UTEIS.join()
        ? DE_SEGUNDA_A_SEXTA
        : dias.length === 1
          ? dias[0]
          : `${dias.slice(0, -1).join(", ")} e ${dias[dias.length - 1]}`;
    return `${juntos[0]}${juntos.slice(1).toLowerCase()}, ${texto}`;
  });
}

function condicaoVale(c: Condicao, respostas: Respostas) {
  const marcadas = respostas[c.pergunta]?.opcoes ?? [];
  if (c.tem && !c.tem.some((o) => marcadas.includes(o))) return false;
  return !(c.maisDeUma && marcadas.length < 2);
}

/** As perguntas que aparecem com as respostas de agora. Uma pergunta que depende
 * de outra que sumiu também some. */
export function visiveis(briefing: Briefing, respostas: Respostas): Pergunta[] {
  const aparecem = new Set<string>();
  return briefing.perguntas.filter((p) => {
    const vale = (p.se ?? []).every((c) => aparecem.has(c.pergunta) && condicaoVale(c, respostas));
    if (vale) aparecem.add(p.id);
    return vale;
  });
}

/** As opções de uma pergunta: as dela ou as que a pessoa marcou em outra. */
export function opcoesDa(p: Pergunta, briefing: Briefing, respostas: Respostas): string[] {
  if (!p.opcoesDe) return p.opcoes ?? [];
  const aparecem = new Set(visiveis(briefing, respostas).map((v) => v.id));
  return p.opcoesDe.filter((id) => aparecem.has(id)).flatMap((id) => respostas[id]?.opcoes ?? []);
}

/** O que falta para a resposta valer; null quando está respondida. */
export function problema(p: Pergunta, briefing: Briefing, respostas: Respostas): string | null {
  const r = respostas[p.id];
  if (p.nada && r?.nada) return null;
  switch (p.tipo) {
    case "texto":
      return cheio(r?.valor) ? null : "Escreva a sua resposta para continuar.";
    case "longo":
      if (!cheio(r?.valor)) return "Escreva a sua resposta para continuar.";
      return p.obrigatoria && (r?.valor ?? "").trim().length < MINIMO_DO_LONGO ? "Conte um pouquinho mais." : null;
    case "escolha": {
      const marcada = r?.opcoes?.[0];
      // A opção pode ter sumido, quando a lista veio de outra pergunta que mudou.
      const existe = marcada && (!p.opcoesDe || opcoesDa(p, briefing, respostas).includes(marcada));
      return existe ? null : "Escolha uma opção para continuar.";
    }
    case "cores":
      // O código que a gente não reconhece vale também: chega do jeito que foi escrito.
      if (p.modo === "exatas") return cheio(r?.valor) ? null : "Escreva ou cole pelo menos uma cor.";
      return r?.opcoes?.length ? null : "Escolha pelo menos uma cor.";
    case "meses":
      return r?.opcoes?.length ? null : "Marque pelo menos um mês.";
    case "multipla":
    case "estilo":
      return r?.opcoes?.length ? null : "Escolha pelo menos uma opção.";
    case "etiquetas":
      return r?.opcoes?.length ? null : "Adicione pelo menos uma.";
    case "confirmar":
      return r?.opcoes?.includes("sim") || cheio(r?.valor) ? null : "Confirme ou escreva o certo para continuar.";
    case "endereco": {
      if (r?.opcoes?.includes("sim")) return null;
      if (!r?.opcoes?.includes("outro")) return "Confirme ou escreva o certo para continuar.";
      const i = r.itens ?? {};
      if ((i.cep ?? "").replace(/\D/g, "").length !== 8) return "Falta o CEP. Se não souber, toque em Não sei o CEP.";
      const falta = PARTES_DO_ENDERECO.find(([chave]) => !cheio(i[chave]));
      return falta ? `Falta ${falta[1]}.` : null;
    }
    case "detalhes": {
      const opcoes = opcoesDa(p, briefing, respostas);
      // Antes de a pessoa escolher os itens, ainda não há o que contar.
      if (!opcoes.length) return "Escolha antes o que vai na página.";
      const falta = opcoes.find((o) => !cheio(r?.itens?.[o]));
      return falta ? `Falta contar sobre ${falta}.` : null;
    }
    case "horarios": {
      const semana = semanaDe(r?.horarios ?? []);
      const ruim = semana.map((d) => d.periodo && problemaDoPeriodo(d.dia, d.periodo)).find(Boolean);
      if (ruim) return ruim;
      return semana.some((d) => d.periodo) || r?.opcoes?.includes(HORA_MARCADA) ? null : "Marque pelo menos um dia.";
    }
    case "redes":
      return Object.values(r?.itens ?? {}).some(cheio) ? null : "Preencha pelo menos um.";
    case "duvidas":
      return Object.values(r?.itens ?? {}).some(cheio) ? null : "Responda pelo menos uma.";
  }
}

/** A cidade para sugerir a região: a do endereço que a pessoa escreveu ou a do cadastro. */
export function cidadeDe(briefing: Briefing, respostas: Respostas) {
  const p = briefing.perguntas.find((x) => x.tipo === "endereco");
  const r = p && respostas[p.id];
  const i = r?.opcoes?.includes("outro") ? r.itens : undefined;
  return i?.cidade && i.uf ? { nome: i.cidade, uf: i.uf } : briefing.cidade;
}

export const respondida = (p: Pergunta, briefing: Briefing, respostas: Respostas) =>
  problema(p, briefing, respostas) === null;

export function progresso(briefing: Briefing, respostas: Respostas) {
  const lista = visiveis(briefing, respostas);
  const feitas = lista.filter((p) => respondida(p, briefing, respostas)).length;
  return { feitas, total: lista.length, porcento: Math.round((feitas / lista.length) * 100) };
}

/** A resposta em linhas de texto, para a revisão. */
export function emTexto(p: Pergunta, briefing: Briefing, respostas: Respostas): string[] {
  const r = respostas[p.id];
  if (!r || !respondida(p, briefing, respostas)) return [];
  if (r.nada && p.nada) return [p.nada];
  const itens = r.itens ?? {};
  switch (p.tipo) {
    case "confirmar":
      return [(r.opcoes?.includes("sim") ? p.valorConhecido : r.valor?.trim()) ?? ""];
    case "endereco": {
      if (r.opcoes?.includes("sim")) return [p.valorConhecido ?? ""];
      const { rua, numero, complemento, bairro, cidade, uf, cep, referencia } = itens;
      return [
        [rua, numero, complemento].filter(cheio).join(", "),
        `${bairro}, ${cidade}, ${uf}, CEP ${cep}`,
        ...(cheio(referencia) ? [referencia] : []),
      ];
    }
    case "detalhes":
      return opcoesDa(p, briefing, respostas).map((o) => `${o} · ${itens[o].trim()}`);
    case "redes":
    case "duvidas":
      return Object.entries(itens)
        .filter(([, v]) => cheio(v))
        .map(([k, v]) => `${k} · ${v.trim()}`);
    case "cores":
      return cheio(r.valor) ? [r.valor!.trim()] : [(r.opcoes ?? []).join(", ")];
    case "horarios":
      return [...textoDosHorarios(r.horarios ?? []), ...(r.opcoes ?? [])];
    case "multipla":
    case "escolha":
    case "etiquetas":
    case "meses":
    case "estilo":
      return [(r.opcoes ?? []).join(", ")];
    default:
      return [(r.valor ?? "").trim()];
  }
}

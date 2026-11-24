// O briefing é uma lista de perguntas que vem pronta para cada cliente (plano
// geral, Parte 5). Aqui ficam os tipos de pergunta e as regras: o que aparece,
// o que conta como respondido, a porcentagem e a resposta em texto. Nada de
// conteúdo de cliente: as perguntas chegam de fora.

export type TipoDePergunta =
  | "texto"
  | "longo"
  | "escolha"
  | "multipla"
  | "confirmar"
  | "etiquetas"
  | "detalhes"
  | "horarios"
  | "redes"
  | "duvidas"
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
  | "estilo";

export type Pergunta = {
  id: string;
  secao: number;
  tipo: TipoDePergunta;
  titulo: string;
  ajuda?: string;
  /** Texto de exemplo dentro do campo. */
  exemplo?: string;
  obrigatoria?: true;
  /** Nas opcionais, a resposta de quem não tem ("Não uso redes sociais"). */
  nada?: string;
  se?: Condicao[];
  opcoes?: string[];
  /** As opções são as respostas destas perguntas (das que aparecem). */
  opcoesDe?: string[];
  max?: number;
  /** Deixa escrever uma opção que não está na lista. */
  outra?: string;
  /** Para confirmar o que já se sabe. */
  valorConhecido?: string;
  rotuloDoOutro?: string;
  papel?: Papel;
};

export type Horario = { dias: string; aberto: boolean; de: string; ate: string };

export type Resposta = {
  /** Marcou a resposta de quem não tem. */
  nada?: boolean;
  valor?: string;
  opcoes?: string[];
  itens?: Record<string, string>;
  horarios?: Horario[];
};

export type Respostas = Record<string, Resposta>;

export type Briefing = {
  slug: string;
  /** O primeiro nome, para a saudação. */
  nome: string;
  segmento: string;
  secoes: string[];
  perguntas: Pergunta[];
};

/** Textos longos obrigatórios precisam dizer alguma coisa. */
export const MINIMO_DO_LONGO = 20;

export const HORARIOS_INICIAIS: Horario[] = [
  { dias: "Segunda a sexta", aberto: false, de: "08:00", ate: "18:00" },
  { dias: "Sábado", aberto: false, de: "08:00", ate: "12:00" },
  { dias: "Domingo", aberto: false, de: "08:00", ate: "12:00" },
];

export const HORA_MARCADA = "Só com hora marcada";

const cheio = (texto?: string) => Boolean(texto?.trim());

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
    case "multipla":
    case "estilo":
      return r?.opcoes?.length ? null : "Escolha pelo menos uma opção.";
    case "etiquetas":
      return r?.opcoes?.length ? null : "Adicione pelo menos uma.";
    case "confirmar":
      return r?.opcoes?.includes("sim") || cheio(r?.valor) ? null : "Confirme ou escreva o certo para continuar.";
    case "detalhes": {
      const falta = opcoesDa(p, briefing, respostas).find((o) => !cheio(r?.itens?.[o]));
      return falta ? `Falta contar sobre ${falta}.` : null;
    }
    case "horarios":
      return r?.horarios?.some((h) => h.aberto) || r?.opcoes?.includes(HORA_MARCADA)
        ? null
        : "Marque pelo menos um dia.";
    case "redes":
      return Object.values(r?.itens ?? {}).some(cheio) ? null : "Preencha pelo menos um.";
    case "duvidas":
      return Object.values(r?.itens ?? {}).some(cheio) ? null : "Responda pelo menos uma.";
  }
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
    case "detalhes":
      return opcoesDa(p, briefing, respostas).map((o) => `${o} · ${itens[o].trim()}`);
    case "redes":
    case "duvidas":
      return Object.entries(itens)
        .filter(([, v]) => cheio(v))
        .map(([k, v]) => `${k} · ${v.trim()}`);
    case "horarios":
      return [
        ...(r.horarios ?? []).filter((h) => h.aberto).map((h) => `${h.dias}, das ${h.de} às ${h.ate}`),
        ...(r.opcoes ?? []),
      ];
    case "multipla":
    case "escolha":
    case "etiquetas":
    case "estilo":
      return [(r.opcoes ?? []).join(", ")];
    default:
      return [(r.valor ?? "").trim()];
  }
}

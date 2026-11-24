// A conversa com o painel (painel.adsgator.com.br; plano geral, Parte 4, item
// 3), só no servidor: o checkout pergunta o que o link traz e avisa a
// contratação e a mensalidade. Autoriza com o cabeçalho x-checkout-segredo
// (CHECKOUT_PAINEL_SEGREDO, o mesmo nos dois projetos; nunca vai ao navegador).

const TEMPO_LIMITE_MS = 8_000;

export type LinkDoPainel = {
  tipo: "contratacao" | "mensalidade";
  servicos: string[];
  /** Dia em que o link foi gerado (aaaa-mm-dd): na mensalidade, o dia das próximas. */
  dia_gerado: string;
  valido: boolean;
  pago: boolean;
  cliente: { nome: string; empresa: string; asaas_id: string | null };
};

async function chamar(metodo: "GET" | "POST", caminho: string, corpo?: unknown) {
  const url = process.env.PAINEL_URL;
  const segredo = process.env.CHECKOUT_PAINEL_SEGREDO;
  if (!url || !segredo) throw new Error("PAINEL_URL ou CHECKOUT_PAINEL_SEGREDO não configurado");
  return fetch(url + caminho, {
    method: metodo,
    headers: { "x-checkout-segredo": segredo, "content-type": "application/json" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
    signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    cache: "no-store",
  });
}

/** O link pelo código; null se não existe. Lança erro se o painel não respondeu. */
export async function linkDoPainel(codigo: string): Promise<LinkDoPainel | null> {
  if (!/^[A-Za-z0-9]{6}$/.test(codigo)) return null;
  const r = await chamar("GET", `/api/checkout/link/${codigo.toUpperCase()}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`painel respondeu ${r.status} ao ler o link`);
  return (await r.json()) as LinkDoPainel;
}

export type MotivoDaRecusa = "invalido" | "vencido" | "pago" | "em_andamento" | "cartao_travado" | "muitas_tentativas";

/** Reserva a vez do link (um pagamento por vez). Sem o painel, não cobra: lança erro. */
export async function reservarVez(
  codigo: string,
  forma: "pix" | "cartao",
  ip: string,
): Promise<{ ok: true; tentativa: string; conferir: boolean } | { ok: false; motivo: MotivoDaRecusa }> {
  const r = await chamar("POST", "/api/checkout/tentativa", { acao: "reservar", codigo, forma, ip });
  if (!r.ok) throw new Error(`painel respondeu ${r.status} ao reservar a vez`);
  return r.json();
}

/** Diz ao painel como a tentativa terminou. Se ele não responder, ela vira incerta lá. */
export async function gravarResultado(
  tentativa: string,
  resultado: "criada" | "recusada" | "erro" | "incerta",
  cobranca: string | null,
  motivo: string,
): Promise<void> {
  await avisar("/api/checkout/tentativa", { acao: "resultado", tentativa, resultado, cobranca, motivo: motivo.slice(0, 300) });
}

/** Avisa o painel, tentando de novo se ele não respondeu (a cobrança já foi feita:
 * não pode se perder). Erro de conteúdo (4xx) não adianta repetir. */
async function avisar(caminho: string, corpo: unknown) {
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      const r = await chamar("POST", caminho, corpo);
      if (r.ok) return true;
      if (r.status >= 400 && r.status < 500) {
        console.error(`checkout: o painel recusou ${caminho}`, r.status, await r.text());
        return false;
      }
    } catch (e) {
      console.error(`checkout: o painel não respondeu ${caminho} (tentativa ${tentativa})`, String(e));
    }
    await new Promise((ok) => setTimeout(ok, 800 * tentativa));
  }
  return false;
}

export type AvisoDeContratacao = {
  codigo: string;
  servicos: string[];
  forma: "pix" | "cartao";
  parcelas: number;
  /** Em reais. */
  valor: number;
  asaas_cliente: string;
  asaas_cobranca: string;
  pago: boolean;
  dados: Record<string, string>;
  aceite: { em: string; ip: string; navegador: string; termos_versao: string; pontos: string[] };
};

export const avisarContratacao = (aviso: AvisoDeContratacao) => avisar("/api/checkout/contratacao", aviso);

/** A 1ª mensalidade existe, mas a assinatura não nasceu: o painel avisa o Lucas e abre a tarefa. */
export const avisarAssinaturaQueFalhou = (falha: {
  codigo: string;
  asaas_cliente: string;
  asaas_cobranca: string;
  /** Em reais. */
  valor: number;
  proximo: string;
  forma: "pix" | "cartao";
  motivo: string;
}) => avisar("/api/checkout/assinatura", falha);

export const avisarMensalidade = (aviso: { codigo: string; asaas_cobranca: string; pago: boolean }) =>
  avisar("/api/checkout/mensalidade", aviso);

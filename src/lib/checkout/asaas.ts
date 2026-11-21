// Conversa com o Asaas, só no servidor (plano geral, Parte 4). A chave fica no
// .env.local e na Vercel, sem NEXT_PUBLIC_, e nunca vai ao navegador. O
// checkout é da Adsgator; o Asaas só processa (decisão do Lucas, 2026-11-21).
//
// Conferido na documentação (docs.asaas.com) e no sandbox em 2026-11-21:
// - o cartão é cobrado na hora; recusado, volta HTTP 400 com errors[] e nada é
//   criado;
// - parcelado com totalValue: o Asaas arredonda as parcelas para baixo e põe a
//   diferença na última;
// - a assinatura gera uma cobrança só ao ser criada (a do primeiro vencimento);
// - o QR do Pix precisa de uma chave Pix ativa na conta;
// - a assinatura no cartão aceita remoteIp 127.0.0.1 no sandbox;
// - o Asaas pede tempo limite de pelo menos 60 segundos no cartão.

const TEMPO_LIMITE_MS = 60_000;

export class ErroDoAsaas extends Error {
  constructor(
    readonly status: number,
    readonly descricao: string,
    readonly codigo?: string,
  ) {
    super(`Asaas ${status}: ${codigo ?? ""} ${descricao}`);
  }
}

/** true quando o checkout fala com a conta de testes do Asaas. */
export function noSandbox() {
  return (process.env.ASAAS_API_URL ?? "").includes("sandbox");
}

async function chamar<T>(metodo: "GET" | "POST", caminho: string, corpo?: unknown): Promise<T> {
  const url = process.env.ASAAS_API_URL;
  const chave = process.env.ASAAS_API_KEY;
  if (!url || !chave) throw new Error("ASAAS_API_URL ou ASAAS_API_KEY não configurada");

  const r = await fetch(url + caminho, {
    method: metodo,
    headers: { access_token: chave, "content-type": "application/json", "user-agent": "adsgator-checkout" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
    signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    cache: "no-store",
  });
  const j = (await r.json().catch(() => ({}))) as { errors?: { code?: string; description?: string }[] };
  if (!r.ok) {
    const e = j.errors?.[0];
    throw new ErroDoAsaas(r.status, e?.description ?? "resposta sem descrição", e?.code);
  }
  return j as T;
}

export type DadosDoCliente = {
  name: string;
  cpfCnpj: string;
  email: string;
  mobilePhone: string;
  postalCode: string;
  address: string;
  addressNumber: string;
  complement?: string;
  province: string;
  company?: string;
  observations?: string;
  externalReference?: string;
};

export type CartaoDoAsaas = {
  creditCard: { holderName: string; number: string; expiryMonth: string; expiryYear: string; ccv: string };
  creditCardHolderInfo: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement?: string;
    mobilePhone: string;
  };
  remoteIp: string;
};

export type Cobranca = {
  id: string;
  status: string;
  value: number;
  dueDate: string;
  invoiceUrl?: string;
  installment?: string;
};

export type Assinatura = { id: string; status: string; nextDueDate: string };

export type QrCodeDoPix = { encodedImage: string; payload: string; expirationDate: string };

/** O cliente que já existe com este CPF ou CNPJ (o Asaas aceita duplicados). */
export async function clientePorDocumento(cpfCnpj: string) {
  const r = await chamar<{ data: { id: string }[] }>("GET", `/customers?cpfCnpj=${cpfCnpj}&limit=1`);
  return r.data[0]?.id;
}

export async function criarCliente(dados: DadosDoCliente) {
  return (await chamar<{ id: string }>("POST", "/customers", dados)).id;
}

export async function criarCobranca(dados: {
  customer: string;
  billingType: "PIX" | "CREDIT_CARD";
  dueDate: string;
  description: string;
  externalReference: string;
  value?: number;
  installmentCount?: number;
  totalValue?: number;
} & Partial<CartaoDoAsaas>) {
  return chamar<Cobranca>("POST", "/payments", dados);
}

export async function criarAssinatura(dados: {
  customer: string;
  billingType: "PIX" | "CREDIT_CARD";
  value: number;
  nextDueDate: string;
  cycle: "MONTHLY";
  description: string;
  externalReference: string;
} & Partial<CartaoDoAsaas>) {
  return chamar<Assinatura>("POST", "/subscriptions", dados);
}

export async function qrCodeDoPix(cobranca: string) {
  return chamar<QrCodeDoPix>("GET", `/payments/${cobranca}/pixQrCode`);
}

export async function situacaoDaCobranca(cobranca: string) {
  return (await chamar<{ status: string }>("GET", `/payments/${cobranca}`)).status;
}

// Apaga do SANDBOX do Asaas o que os testes do checkout criaram: os clientes
// com "[TESTE]" no nome, com as assinaturas e as cobranças deles. Cobrança de
// cartão já paga não pode ser apagada: é estornada (o parcelamento inteiro de
// uma vez). Recusa rodar se a chave não for a da conta de testes. Rodar depois
// de tests/checkout.mjs.
// Uso: node tests/checkout-limpar.mjs [cus_... de um cliente já apagado]

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd(), false, { info() {}, error: console.error });

const URL_ = process.env.ASAAS_API_URL ?? "";
const CHAVE = process.env.ASAAS_API_KEY ?? "";
if (!URL_.includes("sandbox") || !CHAVE.startsWith("$aact_hmlg_")) {
  console.error("Recusado: a chave do .env.local não é a do sandbox do Asaas.");
  process.exit(1);
}

async function api(metodo, caminho) {
  const r = await fetch(URL_ + caminho, {
    method: metodo,
    headers: { access_token: CHAVE, "content-type": "application/json", "user-agent": "adsgator-checkout" },
    body: metodo === "POST" ? "{}" : undefined,
  });
  return { status: r.status, j: await r.json().catch(() => ({})) };
}

async function todos(caminho) {
  const itens = [];
  for (let offset = 0; ; offset += 100) {
    const { j } = await api("GET", `${caminho}${caminho.includes("?") ? "&" : "?"}limit=100&offset=${offset}`);
    itens.push(...(j.data ?? []));
    if (!j.hasMore) return itens;
  }
}

const PAGAS = ["CONFIRMED", "RECEIVED"];
const clientes = (await todos("/customers")).filter((c) => c.name?.includes("[TESTE]"));
for (const id of process.argv.slice(2)) clientes.push({ id, name: "(cliente já apagado)", jaApagado: true });

let assinaturas = 0;
let apagadas = 0;
let estornos = 0;
const falhas = [];
for (const c of clientes) {
  for (const a of await todos(`/subscriptions?customer=${c.id}`)) {
    if ((await api("DELETE", `/subscriptions/${a.id}`)).status === 200) assinaturas++;
  }
  const parcelamentos = new Set();
  for (const p of await todos(`/payments?customer=${c.id}`)) {
    if (p.status === "REFUNDED" || p.deleted) continue;
    const paga = PAGAS.includes(p.status);
    let r;
    if (!paga) r = await api("DELETE", `/payments/${p.id}`);
    else if (p.installment) {
      if (parcelamentos.has(p.installment)) continue;
      parcelamentos.add(p.installment);
      r = await api("POST", `/installments/${p.installment}/refund`);
    } else r = await api("POST", `/payments/${p.id}/refund`);
    if (r.status !== 200) falhas.push(`${p.id}: ${r.status} ${JSON.stringify(r.j.errors ?? "")}`);
    else if (paga) estornos++;
    else apagadas++;
  }
  if (!c.jaApagado) {
    const r = await api("DELETE", `/customers/${c.id}`);
    console.log(`${c.name} (${c.id}): ${r.status === 200 ? "apagado" : `não apagado (${r.status})`}`);
  }
}

console.log(
  `\n${clientes.length} cliente(s), ${assinaturas} assinatura(s), ${apagadas} cobrança(s) apagadas e ${estornos} estorno(s) no sandbox.`,
);
if (falhas.length) {
  console.log(`Não limpou ${falhas.length}:\n${falhas.slice(0, 5).join("\n")}`);
  process.exit(1);
}

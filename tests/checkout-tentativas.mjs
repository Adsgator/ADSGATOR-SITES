// O que o servidor do checkout aguenta sem a tela (plano geral, Parte 4), no SANDBOX do Asaas:
// dois pedidos ao mesmo tempo no mesmo link e o Pix pedido de novo (uma cobrança só). Os cartões
// recusados ficam em checkout-falhas.mjs: em 2026-11-23 o sandbox aprovou os cartões de recusa da
// documentação. Cria clientes "[TESTE] Checkout" no painel e
// apaga no fim; o que fica no sandbox sai com tests/checkout-limpar.mjs.
// O painel (PAINEL_URL) e o site precisam estar rodando.
// Uso: node tests/checkout-tentativas.mjs [checkout]   (padrão: http://checkout.localhost:3005)
import { createRequire } from "node:module";

import { criarCliente, criarLink, limparPainel } from "./painel-de-teste.mjs";

createRequire(import.meta.url)("@next/env").loadEnvConfig(process.cwd(), false, { info() {}, error: console.error });
if (!(process.env.ASAAS_API_URL ?? "").includes("sandbox")) throw new Error("Recusado: não é o sandbox do Asaas.");
const asaas = (caminho) =>
  fetch(process.env.ASAAS_API_URL + caminho, { headers: { access_token: process.env.ASAAS_API_KEY, "user-agent": "adsgator-checkout" } }).then((x) => x.json());

const CHECKOUT = process.argv[2] ?? "http://checkout.localhost:3005";
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}
const marca = `[TESTE] Tentativas ${Date.now()}`;
// CPFs válidos e inventados, um por caso, para contar as cobranças de cada cliente no Asaas.
function cpf(semente) {
  const n = String(100000000 + (semente % 899999999)).slice(0, 9).split("").map(Number);
  for (const t of [10, 11]) {
    const s = n.reduce((a, d, i) => a + d * (t - i), 0);
    n.push(((s * 10) % 11) % 10);
  }
  return n.join("");
}
const dados = (doc) => ({
  whatsapp: "(19) 99999-0000", email: "teste@exemplo.com.br", cpf: doc, nome: marca,
  cep: "01001-000", endereco: "Praça da Sé", numero: "100", bairro: "Sé", cidade: "São Paulo", uf: "SP",
});
const bom = { numero: "4444 4444 4444 4444", nome: "PESSOA DE TESTE", validade: "12/30", codigo: "123" };
const enviar = (corpo) =>
  fetch(`${CHECKOUT}/contratar`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) }).then(
    async (x) => ({ status: x.status, j: await x.json().catch(() => ({})) }),
  );
async function cobrancasDe(doc) {
  const { data } = await asaas(`/customers?cpfCnpj=${doc}`);
  const todas = [];
  for (const c of data ?? []) todas.push(...((await asaas(`/payments?customer=${c.id}&limit=100`)).data ?? []));
  return { clientes: (data ?? []).length, cobrancas: todas.filter((p) => !p.deleted) };
}

try {
  const cliente = await criarCliente("Tentativas");
  let s = Date.now() % 800000000;
  for (const forma of ["cartao", "pix"]) {
    const doc = cpf(s++);
    const codigo = await criarLink(cliente, "contratacao", ["landing-page"]);
    const pedido = { codigo, forma, parcelas: 1, semCnpj: true, dados: dados(doc), cartao: forma === "cartao" ? bom : {}, aceite: true };
    const r = await Promise.all([enviar(pedido), enviar(pedido)]);
    const { clientes, cobrancas } = await cobrancasDe(doc);
    check(`${forma}: dois pedidos ao mesmo tempo criam uma cobrança só`, cobrancas.length === 1, `${r.map((x) => x.status).join(" e ")}; ${cobrancas.length} cobranças, ${clientes} clientes no Asaas`);
  }
  {
    const doc = cpf(s++);
    const codigo = await criarLink(cliente, "contratacao", ["landing-page"]);
    const pedido = { codigo, forma: "pix", parcelas: 1, semCnpj: true, dados: dados(doc), cartao: {}, aceite: true };
    const primeira = await enviar(pedido);
    const segunda = await enviar(pedido);
    const { cobrancas } = await cobrancasDe(doc);
    check("pix: pedir de novo depois devolve o mesmo Pix", cobrancas.length === 1 && primeira.j.cobranca === segunda.j.cobranca, `${cobrancas.length} cobranças`);
  }
} finally {
  await limparPainel();
}
console.log(falhas === 0 ? "\nTudo certo" : `\n${falhas} falha(s)`);
process.exit(falhas ? 1 : 0);

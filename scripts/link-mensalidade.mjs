// Gera o link da mensalidade para mandar ao cliente no WhatsApp: no combo,
// quando ele aprova a página; na manutenção, 30 dias depois da entrega
// (decisões do Lucas, 2026-11-21). O dia de hoje vira o dia das próximas
// mensalidades, e a 1ª vence em 3 dias. O link vale 15 dias.
// Enquanto o painel não tem o botão (próxima etapa do plano), é por aqui.
//
// Uso: node scripts/link-mensalidade.mjs <cus_... | CPF/CNPJ> <google-ads | manutencao> [--producao]
//   Usa o Asaas e o segredo do .env.local; --producao monta o endereço oficial.

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd(), false, { info() {}, error: console.error });
const { criarLink, SERVICOS_DO_LINK } = await import("../src/lib/checkout/link-mensalidade.ts");

const [quem, servico] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const producao = process.argv.includes("--producao");
if (!quem || !SERVICOS_DO_LINK.includes(servico)) {
  console.error(`Uso: node scripts/link-mensalidade.mjs <cus_... | CPF/CNPJ> <${SERVICOS_DO_LINK.join(" | ")}> [--producao]`);
  process.exit(1);
}

async function asaas(caminho) {
  const r = await fetch(process.env.ASAAS_API_URL + caminho, {
    headers: { access_token: process.env.ASAAS_API_KEY, "user-agent": "adsgator-checkout" },
  });
  if (!r.ok) throw new Error(`Asaas respondeu ${r.status} em ${caminho}`);
  return r.json();
}

// Confere no Asaas quem é o cliente, para não mandar o link errado.
const cliente = quem.startsWith("cus_")
  ? await asaas(`/customers/${quem}`)
  : (await asaas(`/customers?cpfCnpj=${quem.replace(/\D/g, "")}&limit=1`)).data?.[0];
if (!cliente || cliente.deleted) {
  console.error(`Cliente não encontrado no Asaas: ${quem}`);
  process.exit(1);
}

const hoje = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
const base = producao ? "https://checkout.adsgator.com.br" : "http://checkout.localhost:3005";
const token = criarLink(cliente.id, servico, hoje);

console.log(`Cliente: ${cliente.name} (${cliente.id})`);
console.log(`Serviço: ${servico} · gerado hoje (${hoje}): a 1ª vence em 3 dias, e as próximas caem neste dia do mês.`);
console.log(`\n${base}/mensalidade?l=${token}\n`);
const noSandbox = process.env.ASAAS_API_URL.includes("sandbox");
if (noSandbox === producao) console.warn("Atenção: o Asaas do .env.local não combina com o endereço (sandbox x produção).");

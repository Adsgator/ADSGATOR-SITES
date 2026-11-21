// O link da mensalidade (src/lib/checkout/link-mensalidade.ts): o que foi
// gerado é lido de volta; alterado ou assinado com outro segredo, é recusado;
// a validade de 15 dias. Usa um segredo de teste, só na memória deste teste.
// Uso: node tests/link-mensalidade.mjs

import { randomBytes } from "node:crypto";

process.env.CHECKOUT_LINK_SEGREDO = randomBytes(32).toString("base64url");
const { criarLink, lerLink, linkVencido } = await import("../src/lib/checkout/link-mensalidade.ts");

let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}

const token = criarLink("cus_000010071539", "google-ads", "2026-11-21");
const lido = lerLink(token);
check("o link gerado é lido de volta", lido?.cliente === "cus_000010071539" && lido?.servico === "google-ads" && lido?.gerado === "2026-11-21");
check("o endereço não mostra dado pessoal além do id do Asaas", !/[@\s]/.test(token));

const [corpo, assinatura] = token.split(".");
const trocado = Buffer.from(JSON.stringify({ ...lido, cliente: "cus_000000000001" })).toString("base64url");
check("trocar o cliente invalida o link", lerLink(`${trocado}.${assinatura}`) === null);
check("assinatura alterada invalida o link", lerLink(`${corpo}.${assinatura.slice(0, -2)}xx`) === null);
check("lixo não quebra", lerLink("") === null && lerLink("abc") === null && lerLink("a.b.c") === null);

const original = process.env.CHECKOUT_LINK_SEGREDO;
process.env.CHECKOUT_LINK_SEGREDO = randomBytes(32).toString("base64url");
check("com outro segredo, o link não vale", lerLink(token) === null);
process.env.CHECKOUT_LINK_SEGREDO = original;

check("serviço sem mensalidade não gera link", (() => { try { criarLink("cus_1", "landing-page", "2026-11-21"); return false; } catch { return true; } })());
check("vale no 15º dia", !linkVencido(lido, "2026-12-06"));
check("vence no 16º dia", linkVencido(lido, "2026-12-07"));
check("data no futuro não vale", linkVencido(lido, "2026-11-20"));

process.env.CHECKOUT_LINK_SEGREDO = "curto";
check("sem o segredo certo, recusa gerar", (() => { try { criarLink("cus_1", "google-ads", "2026-11-21"); return false; } catch { return true; } })());

console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);

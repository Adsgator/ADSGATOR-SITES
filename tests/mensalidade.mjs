// O link da mensalidade (checkout.adsgator.com.br/<código>, gerado no painel),
// no SANDBOX do Asaas:
// - o resumo (serviço, valor, "Para:" e a data da renovação) e o texto da 1ª no
//   cartão (hoje) e no Pix (3 dias depois do link);
// - o cartão até "A mensalidade está ativa", com a assinatura no Asaas no dia
//   em que o link foi gerado, e o mesmo link depois mostra "já está ativa";
// - o Pix, e o mesmo link de novo devolve o mesmo Pix, sem cobrança a mais;
// - link alterado, vencido e o título da manutenção;
// - o servidor recusa link alterado e cartão errado, sem passar pela tela;
// - o painel marca o link como pago (cartão) e guarda a cobrança (Pix);
// - celular sem rolagem para o lado, nenhum pedido ao Google, nenhum cookie,
//   console sem erros, nos dois modos de animação.
// Cria um cliente "[TESTE]" no Asaas (rode tests/checkout-limpar.mjs no fim) e
// um "[TESTE] Checkout" no painel (apagado no fim; o painel precisa estar rodando).
// Uso: node tests/mensalidade.mjs [checkout]   (padrão: http://checkout.localhost:3005)

import { createRequire } from "node:module";
import { chromium } from "playwright-core";

import { criarCliente, criarLink, limparPainel, umDoPainel } from "./painel-de-teste.mjs";

createRequire(import.meta.url)("@next/env").loadEnvConfig(process.cwd(), false, { info() {}, error: console.error });
if (!(process.env.ASAAS_API_URL ?? "").includes("sandbox")) {
  console.error("Recusado: este teste só roda com o sandbox do Asaas.");
  process.exit(1);
}

const CHECKOUT = process.argv[2] ?? "http://checkout.localhost:3005";
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}
const asaas = (metodo, caminho, corpo) =>
  fetch(process.env.ASAAS_API_URL + caminho, {
    method: metodo,
    headers: { access_token: process.env.ASAAS_API_KEY, "content-type": "application/json", "user-agent": "adsgator-checkout" },
    body: corpo ? JSON.stringify(corpo) : undefined,
  }).then((r) => r.json());

const hoje = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
const somar = (iso, dias) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
};
const [ano, mes, dia] = hoje.split("-").map(Number);
const ultimo = new Date(Date.UTC(mes === 12 ? ano + 1 : ano, mes === 12 ? 1 : mes, 0)).getUTCDate();
const proximo = `${mes === 12 ? ano + 1 : ano}-${String(mes === 12 ? 1 : mes + 1).padStart(2, "0")}-${String(Math.min(dia, ultimo)).padStart(2, "0")}`;
const noPix = somar(hoje, 3);
const ddmm = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

const cliente = await asaas("POST", "/customers", {
  name: "[TESTE] Cliente da Mensalidade",
  cpfCnpj: "52998224725",
  email: "teste@exemplo.com.br",
  mobilePhone: "19999990000",
  postalCode: "01001000",
  address: "Praça da Sé",
  addressNumber: "100",
  province: "Sé",
  notificationDisabled: true,
});
check("sandbox: cliente de teste criado", Boolean(cliente.id), JSON.stringify(cliente.errors ?? ""));
// O mesmo cliente no painel, ligado ao Asaas (como quem já contratou).
const clienteDoPainel = await criarCliente("Mensalidade", { asaasId: cliente.id });
const codigo = (servico = "google-ads", gerado = hoje) => criarLink(clienteDoPainel, "mensalidade", [servico], { diaGerado: gerado });
const link = async (servico, gerado) => `${CHECKOUT}/${await codigo(servico, gerado)}`;
const cobrancasComRef = async (ref) =>
  ((await asaas("GET", `/payments?customer=${cliente.id}&limit=100`)).data ?? []).filter((p) => p.externalReference === ref && !p.deleted);

// O servidor confere sem a tela.
const enviar = (corpo) =>
  fetch(`${CHECKOUT}/mensalidade/pagar`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) })
    .then(async (x) => ({ status: x.status, j: await x.json() }));
const codigoBom = await codigo();
const alterado = await enviar({ codigo: "ZZZZZZ", forma: "pix" });
check("servidor: código que não existe, recusa", alterado.status === 400 && !alterado.j.ok, JSON.stringify(alterado.j));
const vencido = await enviar({ codigo: await codigo("google-ads", somar(hoje, -16)), forma: "pix" });
check("servidor: link vencido, recusa", vencido.status === 410, JSON.stringify(vencido.j));
const cartaoRuim = await enviar({ codigo: codigoBom, forma: "cartao", cartao: { numero: "4111 1111 1111 1112", nome: "X", validade: "12/30", codigo: "1" } });
check("servidor: cartão errado, recusa com os campos", cartaoRuim.status === 400 && cartaoRuim.j.campos?.["cartao-numero"], JSON.stringify(cartaoRuim.j));

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const reducedMotion of ["reduce", "no-preference"]) {
    for (const tela of [
      { nome: "computador", width: 1366, height: 900 },
      { nome: "celular", width: 390, height: 844 },
    ]) {
      const rotulo = `${tela.nome}, animações ${reducedMotion === "reduce" ? "reduzidas" : "normais"}`;
      const ctx = await browser.newContext({ viewport: { width: tela.width, height: tela.height }, reducedMotion });
      const p = await ctx.newPage();
      const erros = [];
      const doGoogle = [];
      // No modo de desenvolvimento, o Next repete no navegador o que o servidor
      // registra (com a marca "Server"), como o QR do Pix que o sandbox não gera.
      // Isso não é erro da página.
      p.on("console", (m) => m.type() === "error" && !/ Server /.test(m.text()) && erros.push(m.text()));
      p.on("pageerror", (e) => erros.push(e.message));
      p.on("request", (q) => /google|doubleclick|gtm/.test(new URL(q.url()).hostname) && doGoogle.push(q.url()));

      // Avisos.
      await p.goto(await link("google-ads", somar(hoje, -16)), { waitUntil: "networkidle" });
      check(`${rotulo}: link vencido mostra o aviso`, (await p.locator('[data-aviso-link="vencido"]').count()) === 1);
      await p.goto(`${CHECKOUT}/ZZZZZZ`, { waitUntil: "networkidle" });
      check(`${rotulo}: link alterado mostra o aviso`, (await p.locator('[data-aviso-link="invalido"]').count()) === 1);
      await p.goto(await link("manutencao"), { waitUntil: "networkidle" });
      check(`${rotulo}: título da manutenção`, /Sua página segue cuidada/.test(await p.locator("h1").innerText()));

      // Google Ads no cartão.
      const urlCartao = await link();
      await p.goto(urlCartao, { waitUntil: "networkidle" });
      check(`${rotulo}: título do Google Ads`, /Agora é a vez do Google Ads/.test(await p.locator("h1").innerText()));
      const resumo = (await p.locator("[data-resumo]").innerText()).replace(/\s+/g, " ");
      check(`${rotulo}: resumo com o valor e o nome do cliente`, /R\$ 500,00\/mês/.test(resumo) && /Para: \[TESTE\] Cliente da Mensalidade/.test(resumo), resumo.slice(0, 160));
      check(`${rotulo}: no cartão, a 1ª é cobrada hoje`, new RegExp(`cobrada hoje no cartão; as próximas, todo dia ${dia}`).test(resumo));
      await p.locator('[data-forma="pix"]').check();
      check(`${rotulo}: no Pix, a 1ª vence 3 dias depois do link`, (await p.locator("[data-primeira]").innerText()).includes(`vence em ${ddmm(noPix)}`), await p.locator("[data-primeira]").innerText());
      await p.locator('[data-forma="cartao"]').check();
      if (tela.nome === "celular") {
        const largura = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        check(`${rotulo}: sem rolagem para o lado`, largura <= 0, `${largura}px`);
      }
      await p.locator("[data-ativar]").click();
      check(`${rotulo}: cartão vazio mostra os erros`, (await p.locator("[aria-invalid=true]").count()) === 4);
      await p.locator("#cartao-numero").fill("4444 4444 4444 4444");
      await p.locator("#cartao-nome").fill("PESSOA DE TESTE");
      await p.locator("#cartao-validade").fill("12/30");
      await p.locator("#cartao-codigo").fill("123");
      await p.locator("[data-ativar]").click();
      await p.locator('[data-resultado="cartao"], [data-erro-envio]').first().waitFor({ timeout: 70000 }).catch(() => {});
      const aprovado = (await p.locator('[data-resultado="cartao"]').innerText().catch(() => "")).replace(/\s+/g, " ");
      check(`${rotulo}: a faixa diz "Mensalidade ativada"`, /Mensalidade ativada/.test(await p.locator("[data-titulo]").innerText().catch(() => "")));
      check(`${rotulo}: a próxima cobrança no resumo`, aprovado.includes(`${proximo.slice(8, 10)}/${proximo.slice(5, 7)}/${proximo.slice(0, 4)}`), aprovado.slice(0, 200));
      check(`${rotulo}: cartão aprovado e a mensalidade ativa`, /A mensalidade está ativa/.test(aprovado) && new RegExp(`todo dia ${dia}`).test(aprovado), aprovado.slice(0, 140));
      const ref = `mensalidade:${new URL(urlCartao).pathname.slice(1)}`;
      const assinatura = ((await asaas("GET", `/subscriptions?customer=${cliente.id}&limit=100`)).data ?? []).find((a) => a.externalReference === ref);
      const daAssinatura = assinatura ? ((await asaas("GET", `/subscriptions/${assinatura.id}/payments`)).data ?? []).map((x) => x.dueDate) : [];
      check(`${rotulo}: no Asaas, a assinatura no cartão no dia do link`, assinatura?.billingType === "CREDIT_CARD" && daAssinatura.includes(proximo), `${proximo} · ${daAssinatura.join(", ")}`);
      const primeira = await cobrancasComRef(ref);
      check(`${rotulo}: no Asaas, a 1ª paga no cartão`, primeira.some((x) => !x.subscription && ["CONFIRMED", "RECEIVED"].includes(x.status)), primeira.map((x) => x.status).join(", "));
      const linkNoPainel = await umDoPainel("select pago_em, asaas_cobranca from public.checkout_links where codigo = $1", [new URL(urlCartao).pathname.slice(1)]);
      check(`${rotulo}: painel: o link fica pago, com a cobrança`, linkNoPainel?.pago_em && /^pay_/.test(linkNoPainel.asaas_cobranca ?? ""), JSON.stringify(linkNoPainel));
      await p.goto(urlCartao, { waitUntil: "networkidle" });
      check(`${rotulo}: o mesmo link depois diz que já está ativa`, (await p.locator('[data-aviso-link="ativado"]').count()) === 1);

      // Pix (uma vez por modo, no computador): o mesmo link devolve o mesmo Pix.
      if (tela.nome === "computador") {
        const urlPix = await link();
        await p.goto(urlPix, { waitUntil: "networkidle" });
        await p.locator('[data-forma="pix"]').check();
        await p.locator("[data-ativar]").click();
        await p.locator('[data-resultado="pix"], [data-erro-envio]').first().waitFor({ timeout: 70000 }).catch(() => {});
        check(`${rotulo}: tela do Pix`, (await p.locator('[data-resultado="pix"]').count()) === 1, await p.locator("[data-erro-envio]").innerText().catch(() => ""));
        const refPix = `mensalidade:${new URL(urlPix).pathname.slice(1)}`;
        const pixNoPainel = await umDoPainel("select pago_em, asaas_cobranca from public.checkout_links where codigo = $1", [new URL(urlPix).pathname.slice(1)]);
        check(`${rotulo}: painel: no Pix, o link guarda a cobrança e espera o pagamento`, !pixNoPainel?.pago_em && /^pay_/.test(pixNoPainel?.asaas_cobranca ?? ""), JSON.stringify(pixNoPainel));
        await p.goto(urlPix, { waitUntil: "networkidle" });
        check(`${rotulo}: o mesmo link devolve o mesmo Pix`, (await p.locator('[data-resultado="pix"]').count()) === 1);
        const doPix = (await cobrancasComRef(refPix)).filter((x) => !x.subscription);
        check(`${rotulo}: sem cobrança a mais`, doPix.length === 1 && doPix[0].dueDate === noPix, doPix.map((x) => x.dueDate).join(", "));
      }

      check(`${rotulo}: nenhum pedido ao Google`, doGoogle.length === 0, doGoogle[0]);
      check(`${rotulo}: nenhum cookie`, (await ctx.cookies()).length === 0);
      check(`${rotulo}: console sem erros`, erros.length === 0, erros[0]);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  console.log(`(painel: ${await limparPainel()} cliente(s) de teste apagado(s))`);
}
console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);

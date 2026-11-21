// Medição do site (GTM-KWN4R48, no padrão das landing pages): o consentimento
// começa negado e o GTM carrega; nenhum cookie antes de aceitar; "Recusar"
// mantém negado; "Aceitar" libera; a escolha fica guardada e o rodapé reabre o
// aviso; o clique no WhatsApp vira o evento contato_wpp; e a CSP não bloqueia
// nada do Google. No notebook e no celular.
// Uso: node tests/medicao.mjs [endereço]   (padrão: http://localhost:3005/)

import { chromium } from "playwright-core";

const URL_PAGINA = process.argv[2] ?? "http://localhost:3005/";
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}

// O dataLayer guarda os comandos do gtag como "arguments"; vira lista comum para ler.
const lerDataLayer = (page) =>
  page.evaluate(() => (window.dataLayer ?? []).map((item) => (item && typeof item === "object" && "length" in item && !Array.isArray(item) ? [...item] : item)));
const consentimentos = (dl) => dl.filter((c) => Array.isArray(c) && c[0] === "consent").map((c) => `${c[1]}:${c[2].analytics_storage}/${c[2].ad_storage}`);

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const tela of [{ nome: "notebook", width: 1366, height: 768 }, { nome: "celular", width: 390, height: 844 }]) {
    const ctx = await browser.newContext({ viewport: { width: tela.width, height: tela.height } });
    const page = await ctx.newPage();
    const bloqueados = [];
    page.on("console", (m) => /Content Security Policy|Refused to/i.test(m.text()) && bloqueados.push(m.text().slice(0, 160)));
    const gtm = [];
    page.on("request", (r) => r.url().includes("googletagmanager.com/gtm.js") && gtm.push(r.url()));
    // O WhatsApp não abre de verdade no teste.
    await ctx.route("https://wa.me/**", (rota) => rota.abort());

    await page.goto(URL_PAGINA, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const aviso = page.locator("[data-aviso-cookies]");
    let dl = await lerDataLayer(page);
    check(
      `${tela.nome}: o GTM certo carrega, com o consentimento negado por padrão, e o aviso aparece`,
      gtm.some((u) => u.includes("id=GTM-KWN4R48")) && consentimentos(dl)[0] === "default:denied/denied" && (await aviso.isVisible()),
      `${gtm.length} gtm.js, ${consentimentos(dl).join(" ")}`,
    );
    check(`${tela.nome}: nenhum cookie antes de aceitar`, (await ctx.cookies()).length === 0, (await ctx.cookies()).map((c) => c.name).join(", "));
    const cabe = await aviso.evaluate((el) => el.getBoundingClientRect().right <= window.innerWidth && el.getBoundingClientRect().left >= 0);
    check(`${tela.nome}: o aviso cabe na tela`, cabe);

    // Recusar: some, guarda e mantém negado; sem cookie.
    await aviso.getByRole("button", { name: "Recusar" }).click();
    await page.waitForTimeout(1500);
    dl = await lerDataLayer(page);
    const escolha = await page.evaluate(() => localStorage.getItem("cookie-consent"));
    check(
      `${tela.nome}: "Recusar" fecha o aviso, guarda a escolha e mantém negado, sem cookie`,
      !(await aviso.count()) && escolha === "rejected" && consentimentos(dl).at(-1) === "update:denied/denied" && (await ctx.cookies()).length === 0,
      `${escolha}, ${consentimentos(dl).join(" ")}, ${(await ctx.cookies()).length} cookies`,
    );

    // Recarregando, o aviso não volta; o rodapé reabre.
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const voltou = await aviso.count();
    await page.getByRole("button", { name: "Preferências de cookies" }).click();
    await page.waitForTimeout(300);
    check(`${tela.nome}: a escolha fica guardada e "Preferências de cookies" reabre o aviso`, voltou === 0 && (await aviso.isVisible()));

    // Aceitar: libera.
    await aviso.getByRole("button", { name: "Aceitar" }).click();
    await page.waitForTimeout(800);
    dl = await lerDataLayer(page);
    check(
      `${tela.nome}: "Aceitar" fecha o aviso e libera a medição`,
      !(await aviso.count()) && consentimentos(dl).at(-1) === "update:granted/granted",
      consentimentos(dl).join(" "),
    );
    // Com a medição liberada, o Google mantém requisições abertas: espera o carregamento.
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(1500);
    dl = await lerDataLayer(page);
    check(`${tela.nome}: na visita seguinte, a permissão vale desde o começo`, consentimentos(dl).slice(0, 2).join(" ") === "default:denied/denied update:granted/granted", consentimentos(dl).join(" "));

    // O clique no WhatsApp vira contato_wpp.
    // O link abre o WhatsApp na mesma aba: o teste segura a navegação (depois
    // de o site registrar o evento) para conseguir ler o dataLayer.
    await page.evaluate(() => document.addEventListener("click", (e) => e.target.closest?.("a[href^='https://wa.me/']") && e.preventDefault()));
    await page.locator("main a[href^='https://wa.me/']").first().click();
    await page.waitForTimeout(500);
    dl = await lerDataLayer(page);
    const evento = dl.find((e) => e && e.event === "contato_wpp");
    check(`${tela.nome}: o clique no WhatsApp vira o evento contato_wpp`, !!evento && evento.page_path === "/", JSON.stringify(evento));

    check(`${tela.nome}: a CSP não bloqueia nada`, bloqueados.length === 0, bloqueados.join(" | "));
    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);

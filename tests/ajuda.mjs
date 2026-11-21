// Central de Ajuda (ajuda.adsgator.com.br; plano geral, Parte 3):
// - os 5 endereços antigos, que estão nas mensagens e nos e-mails já enviados,
//   clicados de verdade, abrem o guia certo; o /ajuda do site (e do
//   adsgator.com.br, no rodapé dos e-mails) abre a central;
// - a lista, o guia, a escolha do caminho, o "Fiz este passo" até "Tudo
//   feito!" e o copiar do e-mail;
// - nenhum cookie, nenhum pedido ao Google e nenhum aviso de cookies;
// - celular sem rolagem para o lado, console sem erros, nos dois modos de
//   animação; e nenhuma captura faltando (o quadro provisório).
// Uso: node tests/ajuda.mjs [site] [central]
//   padrão: http://localhost:3005 http://ajuda.localhost:3005
//   produção: node tests/ajuda.mjs https://www.adsgator.com.br https://ajuda.adsgator.com.br

import { chromium } from "playwright-core";

const SITE = process.argv[2] ?? "http://localhost:3005";
const AJUDA = process.argv[3] ?? "http://ajuda.localhost:3005";
const producao = SITE.startsWith("https://");
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}

const guias = {
  "aceitar-convite": "Aceitar o convite da Adsgator no Google Ads",
  "configurar-pagamento": "Configurar o pagamento e verificar a empresa",
  "id-da-conta": "Onde fica o número (ID) da sua conta do Google Ads",
  "acesso-ao-perfil": "Dar acesso ao seu perfil no Google",
  "adicionar-saldo": "Adicionar saldo no Google Ads",
};
const antigos = {
  "como-criar-uma-conta-no-google-ads": "id-da-conta",
  "como-configurar-sua-conta-no-google-ads": "configurar-pagamento",
  "como-conceder-acesso-do-google-ads-para-a-adsgator": "aceitar-convite",
  "como-conceder-acesso-do-seu-google-meu-negocio": "acesso-ao-perfil",
  "como-adicionar-saldo-no-google-ads": "adicionar-saldo",
};

const browser = await chromium.launch({ channel: "chrome" });
try {
  // Os endereços antigos e o /ajuda do site, como links numa mensagem: clicados.
  const page = await browser.newPage();
  const links = [
    ...Object.entries(antigos).map(([antigo, novo]) => [`${AJUDA}/ajuda/${antigo}/`, `${AJUDA}/${novo}`, guias[novo]]),
    [`${SITE}/ajuda`, `${AJUDA}/`, "Passo a passo para a sua conta"],
    ...(producao ? [["https://adsgator.com.br/ajuda", `${AJUDA}/`, "Passo a passo para a sua conta"]] : []),
    [`${AJUDA}/ajuda/um-artigo-que-saiu/`, `${AJUDA}/`, "Passo a passo para a sua conta"],
  ];
  for (const [de, para, titulo] of links) {
    await page.goto("about:blank");
    await page.setContent(`<a href="${de}">abrir</a>`);
    await page.click("a");
    await page.waitForURL((u) => u.protocol.startsWith("http"), { waitUntil: "load" });
    const h1 = (await page.locator("h1").first().textContent())?.trim();
    check(`clique em ${de.replace(/^https?:\/\//, "")}`, page.url().replace(/\/$/, "") === para.replace(/\/$/, "") && h1 === titulo, `${page.url()} · ${h1}`);
  }

  // As páginas do site no endereço da ajuda levam ao site; guia que não existe dá 404.
  const termos = await fetch(`${AJUDA}/termos`, { redirect: "manual" });
  check("ajuda./termos leva ao site", termos.status === 308 && termos.headers.get("location") === "https://www.adsgator.com.br/termos", `${termos.status} ${termos.headers.get("location")}`);
  const inexistente = await page.goto(`${AJUDA}/guia-que-nao-existe`);
  check("guia que não existe: 404 da central", inexistente.status() === 404 && (await page.locator("h1").textContent()) === "Guia não encontrado", String(inexistente.status()));

  // O link "Central de Ajuda" do rodapé do site.
  await page.goto(SITE + "/termos", { waitUntil: "domcontentloaded" });
  await Promise.all([page.waitForURL(`${AJUDA}/**`), page.locator("footer").getByRole("link", { name: "Central de Ajuda" }).click()]);
  check("rodapé do site: Central de Ajuda abre a central", page.url().replace(/\/$/, "") === AJUDA, page.url());
  await page.close();

  for (const reducedMotion of ["reduce", "no-preference"]) {
    for (const tela of [
      { nome: "notebook", width: 1366, height: 768 },
      { nome: "celular", width: 390, height: 844 },
    ]) {
      const rotulo = `${tela.nome}, animações ${reducedMotion === "reduce" ? "reduzidas" : "normais"}`;
      const ctx = await browser.newContext({ viewport: { width: tela.width, height: tela.height }, reducedMotion });
      await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: AJUDA });
      const p = await ctx.newPage();
      const erros = [];
      const doGoogle = [];
      p.on("console", (m) => m.type() === "error" && erros.push(m.text()));
      p.on("pageerror", (e) => erros.push(e.message));
      p.on("request", (r) => /google|doubleclick|gtm/.test(new URL(r.url()).hostname) && doGoogle.push(r.url()));

      // A lista: os 5 guias; clicar num cartão abre o guia.
      await p.goto(AJUDA, { waitUntil: "networkidle" });
      const cartoes = await p.locator("main a[href^='/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
      check(`${rotulo}: a lista tem os 5 guias`, Object.keys(guias).every((s) => cartoes.includes(`/${s}`)), cartoes.join(" "));
      await p.getByRole("link", { name: /Adicionar saldo/ }).click();
      await p.waitForURL(`${AJUDA}/adicionar-saldo`);
      check(`${rotulo}: o cartão abre o guia`, (await p.locator("h1").textContent()) === guias["adicionar-saldo"]);

      let faltando = [];
      for (const [slug, titulo] of Object.entries(guias)) {
        await p.goto(`${AJUDA}/${slug}`, { waitUntil: "networkidle" });
        const largura = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        check(`${rotulo}, ${slug}: título e sem rolagem para o lado`, (await p.locator("h1").textContent()) === titulo && largura <= 0, `sobra ${largura}px`);
        faltando.push(...(await p.locator("[data-captura-faltando]").evaluateAll((fs) => fs.map((f) => f.dataset.capturaFaltando))));

        // "Fiz este passo" em todos os passos visíveis do primeiro caminho até "Tudo feito!".
        const barra = p.getByText(/passos feitos|Tudo feito!/).first();
        const passos = p.locator("ol").first().getByRole("button", { name: "Fiz este passo" });
        const total = await passos.count();
        for (let i = 0; i < total; i++) await passos.first().click();
        check(`${rotulo}, ${slug}: marcar os ${total} passos chega em "Tudo feito!"`, total > 0 && (await barra.textContent()) === "Tudo feito!", await barra.textContent());
      }
      // Os dois caminhos do convite: trocar mostra os outros passos.
      await p.goto(`${AJUDA}/aceitar-convite`, { waitUntil: "networkidle" });
      await p.getByRole("button", { name: "Eu já tinha conta" }).click();
      check(`${rotulo}: "Eu já tinha conta" mostra o pedido de vinculação`, await p.getByRole("heading", { name: "Aceite o pedido da Adsgator" }).isVisible());
      faltando.push(...(await p.locator("[data-captura-faltando]").evaluateAll((fs) => fs.map((f) => f.dataset.capturaFaltando))));
      faltando = [...new Set(faltando.map(Number))].sort((a, b) => a - b);
      check(`${rotulo}: nenhuma captura faltando`, faltando.length === 0, faltando.length ? `faltam ${faltando.join(", ")}` : "");

      // Copiar o e-mail da Adsgator.
      await p.goto(`${AJUDA}/acesso-ao-perfil`, { waitUntil: "networkidle" });
      await p.getByRole("button", { name: "Copiar" }).click();
      const copiado = await p.evaluate(() => navigator.clipboard.readText());
      check(`${rotulo}: copiar o e-mail`, copiado === "agenciaadsgator@gmail.com" && (await p.getByRole("button", { name: "Copiado" }).isVisible()), copiado);

      // Sem medição: nenhum cookie, nenhum pedido ao Google, nenhum aviso de cookies.
      const cookies = await ctx.cookies();
      check(`${rotulo}: nenhum cookie`, cookies.length === 0, cookies.map((c) => c.name).join(", "));
      check(`${rotulo}: nenhum pedido ao Google`, doGoogle.length === 0, doGoogle.slice(0, 2).join(" "));
      check(`${rotulo}: sem aviso de cookies`, (await p.getByRole("button", { name: /Aceitar|Recusar/ }).count()) === 0);
      check(`${rotulo}: console sem erros`, erros.length === 0, erros.slice(0, 2).join(" | "));
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}

console.log(falhas ? `\n${falhas} falha(s)` : "\ntudo certo");
process.exit(falhas ? 1 : 0);

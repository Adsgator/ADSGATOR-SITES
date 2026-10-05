// Testes do site: por HTTP e com cliques reais no Chrome instalado.
// BASE: endereço do site (padrão http://localhost:3000). Em produção:
//   BASE=https://www.adsgator.com.br SEM_WWW=https://adsgator.com.br node tests/site.mjs
// SEM_WWW confere também os links dos e-mails, que usam o domínio sem www.
// Imagens das telas em tests/.saida/ (fora do Git).
import { createHash } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";

import { chromium } from "playwright-core";

const BASE = process.env.BASE ?? "http://localhost:3000";
const SEM_WWW = process.env.SEM_WWW;
const saida = new URL("./.saida/", import.meta.url);
await mkdir(saida, { recursive: true });

const resultados = [];
const check = (nome, ok, extra = "") =>
  resultados.push(`${ok ? "PASSOU" : "FALHOU"} | ${nome}${extra ? " | " + extra : ""}`);
const hash = (buf) => createHash("sha256").update(buf).digest("hex");

// Segue redirecionamentos um a um, guardando código e destino de cada salto.
async function seguir(url) {
  const saltos = [];
  let atual = url;
  for (let i = 0; i < 6; i++) {
    const r = await fetch(atual, { redirect: "manual" });
    const destino = r.headers.get("location");
    if (r.status < 300 || r.status >= 400 || !destino) {
      return { saltos, final: atual, status: r.status };
    }
    saltos.push(r.status);
    atual = new URL(destino, atual).href;
  }
  return { saltos, final: atual, status: 0 };
}

// 1. Imagens dos e-mails: mesmo arquivo do repositório, como PNG.
for (const arquivo of ["banner-topo.png", "logo-rodape.png"]) {
  const local = await readFile(new URL(`../public/email/${arquivo}`, import.meta.url));
  for (const base of [BASE, SEM_WWW].filter(Boolean)) {
    const r = await fetch(`${base}/email/${arquivo}`);
    const remoto = Buffer.from(await r.arrayBuffer());
    check(
      `${base}/email/${arquivo}: 200, image/png e mesmo conteúdo`,
      r.status === 200 && r.headers.get("content-type") === "image/png" && hash(remoto) === hash(local),
      `${r.status} ${r.headers.get("content-type")} ${hash(remoto).slice(0, 12)}`,
    );
  }
}

// 2. Endereços antigos do WordPress (com a barra no fim, como eram).
const antigos = [
  ["/termos-de-servico/", "/termos"],
  ["/politicas-de-privacidade/", "/privacidade"],
  ["/politicas-de-reembolso/", "/termos#reembolso"],
  ["/landing-page-pro/", "/"],
  ["/google-ads/", "/"],
  ["/portfolios/?utm_source=prospection", "/?utm_source=prospection"],
  ["/links/", "/"],
  ["/home/", "/"],
  ["/erro-404/", "/"],
  ["/2023/04/06/cobertura-em-todo-o-brasil/", "/"],
  ["/author/lucas/", "/"],
  ["/category/uncategorized/", "/"],
  ["/sitemap_index.xml", "/sitemap.xml"],
];
for (const [origem, esperado] of antigos) {
  const { saltos, final, status } = await seguir(BASE + origem);
  const u = new URL(final);
  const chegou = u.pathname + u.search + u.hash;
  check(
    `${origem} → ${esperado}`,
    chegou === esperado && status === 200 && saltos.every((s) => s === 308),
    `saltos ${saltos.join(",") || "nenhum"}, chegou em ${chegou} (${status})`,
  );
}

// 3. Cabeçalhos de segurança e liberação para o Google.
{
  const r = await fetch(BASE + "/");
  const h = (k) => r.headers.get(k) ?? "";
  check("CSP presente", h("content-security-policy").includes("default-src 'self'"));
  check("X-Frame-Options DENY", h("x-frame-options") === "DENY");
  check("X-Content-Type-Options nosniff", h("x-content-type-options") === "nosniff");
  check("Referrer-Policy", h("referrer-policy") === "strict-origin-when-cross-origin");
  check("Permissions-Policy", h("permissions-policy").includes("camera=()"));
  check("Strict-Transport-Security", h("strict-transport-security").startsWith("max-age="));
  check("sem X-Powered-By", !r.headers.has("x-powered-by"));
  check("sem noindex no cabeçalho", !h("x-robots-tag").includes("noindex"), h("x-robots-tag"));
}
{
  const robots = await (await fetch(BASE + "/robots.txt")).text();
  check(
    "robots.txt libera e aponta o sitemap",
    robots.includes("Allow: /") && robots.includes("Sitemap: https://www.adsgator.com.br/sitemap.xml"),
  );
  const sitemap = await (await fetch(BASE + "/sitemap.xml")).text();
  const urls = ["", "/termos", "/privacidade", "/ajuda"].map((p) => `https://www.adsgator.com.br${p}<`);
  check("sitemap.xml com as 4 páginas", urls.every((u) => sitemap.includes(u)));
  const og = await fetch(BASE + "/opengraph-image");
  check("imagem de compartilhamento", og.status === 200 && og.headers.get("content-type") === "image/png");
}

// 4. No Chrome, com cliques.
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
// A Privacidade diz que o site não carrega nada de terceiros: toda requisição
// tem de ser para o próprio site (com ou sem www).
const origens = new Set([BASE, SEM_WWW].filter(Boolean).map((u) => new URL(u).origin));
const externos = new Set();
page.on("request", (req) => {
  const u = new URL(req.url());
  if (!["data:", "blob:"].includes(u.protocol) && !origens.has(u.origin)) externos.add(u.origin);
});
const problemas = [];
page.on("console", (m) => ["error", "warning"].includes(m.type()) && problemas.push(`[${m.type()}] (${new URL(page.url()).pathname}) ${m.text().slice(0, 250)}`));
page.on("pageerror", (e) => problemas.push(`[pageerror] (${new URL(page.url()).pathname}) ${e.message}`));
const h1 = () => page.locator("h1").first().innerText();
const classeHtml = () => page.evaluate(() => document.documentElement.className);

try {
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  check("início abre", (await h1()).includes("Google Ads e landing pages"));
  check("sem meta noindex", (await page.locator('meta[name="robots"][content*="noindex"]').count()) === 0);
  check("tema claro por padrão", (await classeHtml()).includes("light") && !(await classeHtml()).includes("dark"));
  check("botão do WhatsApp", (await page.getByRole("link", { name: "Falar pelo WhatsApp" }).getAttribute("href")) === "https://wa.me/5519998026222");
  await page.screenshot({ path: new URL("inicio-claro.png", saida).pathname.slice(1), fullPage: true });

  // Tema: troca, continua depois de recarregar e volta.
  const alternar = page.getByRole("button", { name: "Alternar entre tema claro e escuro" });
  await alternar.click();
  check("troca para o escuro", (await classeHtml()).includes("dark"));
  await page.reload({ waitUntil: "networkidle" });
  check("escuro continua depois de recarregar", (await classeHtml()).includes("dark"));
  await page.screenshot({ path: new URL("inicio-escuro.png", saida).pathname.slice(1), fullPage: true });
  await alternar.click();
  check("volta para o claro", !(await classeHtml()).includes("dark"));

  // Links do rodapé e do cabeçalho, clicando.
  const rodape = page.locator("footer");
  for (const [rotulo, caminho, titulo] of [
    ["Termos de Serviço", "/termos", "Termos de Serviço"],
    ["Política de Privacidade", "/privacidade", "Política de Privacidade"],
    ["Central de Ajuda", "/ajuda", "Central de Ajuda"],
  ]) {
    await rodape.getByRole("link", { name: rotulo }).click();
    await page.waitForURL(`**${caminho}`);
    check(`rodapé: ${rotulo} abre ${caminho}`, (await h1()) === titulo);
    await page.screenshot({ path: new URL(`${caminho.slice(1)}.png`, saida).pathname.slice(1), fullPage: true });
  }
  await page.locator("header").getByRole("link", { name: "Adsgator, página inicial" }).click();
  await page.waitForURL((u) => u.pathname === "/");
  check("logo volta para o início", (await h1()).includes("Google Ads"));
  await page.locator("header").getByRole("link", { name: "Ajuda" }).click();
  await page.waitForURL("**/ajuda");
  check("cabeçalho: Ajuda", (await h1()) === "Central de Ajuda");

  // Links dos e-mails, abertos direto como quem clica no e-mail.
  for (const [caminho, titulo] of [
    ["/termos", "Termos de Serviço"],
    ["/privacidade", "Política de Privacidade"],
    ["/ajuda", "Central de Ajuda"],
  ]) {
    const base = SEM_WWW ?? BASE;
    const r = await page.goto(base + caminho, { waitUntil: "networkidle" });
    check(`link do e-mail ${base}${caminho}`, r?.status() === 200 && (await h1()) === titulo, page.url());
  }

  // Reembolso: o endereço antigo cai na seção certa dos Termos.
  await page.goto(BASE + "/politicas-de-reembolso/", { waitUntil: "networkidle" });
  check("reembolso antigo abre a seção nos Termos", page.url().endsWith("/termos#reembolso") && (await page.locator("#reembolso").count()) === 1, page.url());

  // Termos e Privacidade: o sumário leva às seções, e só vão ao ar aprovados
  // (sem aviso de rascunho, sem trecho destacado a confirmar e com a data).
  for (const caminho of ["/termos", "/privacidade"]) {
    await page.goto(BASE + caminho, { waitUntil: "networkidle" });
    const quebrados = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => decodeURIComponent(a.getAttribute("href").slice(1)))
        .filter((id) => !document.getElementById(id)),
    );
    check(`${caminho}: links internos levam a seções que existem`, quebrados.length === 0, quebrados.join(", "));
    const texto = await page.locator("article").innerText();
    const marcas = await page.locator("article mark").count();
    check(
      `${caminho}: texto aprovado, sem rascunho e com a data`,
      !/rascunho/i.test(texto) && marcas === 0 && /Última atualização: \d/.test(texto),
      `${marcas} trecho(s) a confirmar${/rascunho/i.test(texto) ? ", aviso de rascunho" : ""}`,
    );
  }
  await page.goto(BASE + "/termos", { waitUntil: "networkidle" });
  await page.locator("article").getByRole("link", { name: "Reembolso", exact: true }).click();
  await page.waitForURL("**/termos#reembolso");
  const topo = await page.evaluate(() => document.getElementById("reembolso").getBoundingClientRect().top);
  check("sumário dos Termos: clicar em Reembolso leva à seção", topo >= 0 && topo < 200, `${Math.round(topo)}px do topo`);

  // Página 404 e o botão de voltar.
  const r404 = await page.goto(BASE + "/nao-existe-teste", { waitUntil: "networkidle" });
  check("404 com mensagem", r404?.status() === 404 && (await page.getByText("Página não encontrada").first().isVisible()));
  await page.getByRole("link", { name: "Voltar para o início" }).click();
  await page.waitForURL((u) => u.pathname === "/");
  check("404: voltar para o início", (await h1()).includes("Google Ads"));

  // Celular: nada sai para o lado.
  await page.setViewportSize({ width: 375, height: 800 });
  for (const caminho of ["/", "/termos", "/privacidade", "/ajuda"]) {
    await page.goto(BASE + caminho, { waitUntil: "networkidle" });
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(`celular sem rolagem lateral em ${caminho}`, sobra <= 0, `${sobra}px`);
  }
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.screenshot({ path: new URL("inicio-celular.png", saida).pathname.slice(1), fullPage: true });

  // O que a Privacidade promete: nenhum cookie e, no navegador, só o tema.
  const cookies = await ctx.cookies();
  check("sem cookies", cookies.length === 0, cookies.map((c) => c.name).join(", "));
  const guardado = await page.evaluate(() => Object.keys(localStorage));
  check("no navegador, só a preferência de tema", guardado.every((k) => k === "theme"), guardado.join(", "));
} catch (e) {
  check("execução sem erro", false, e.message.split("\n")[0]);
} finally {
  await browser.close();
}

// O 404 da página de teste aparece no console por ser esperado; o resto conta.
const inesperados = problemas.filter(
  (p) => !(p.includes("(/nao-existe-teste)") && p.includes("status of 404")),
);
check("console sem erros nem avisos", inesperados.length === 0, inesperados.join(" || "));
check("nada carregado de fora do site", externos.size === 0, [...externos].join(", "));
console.log(resultados.join("\n"));
const falhas = resultados.filter((r) => r.startsWith("FALHOU")).length;
console.log(`\n${resultados.length - falhas} passaram, ${falhas} falharam (${BASE})`);
process.exit(falhas ? 1 : 0);

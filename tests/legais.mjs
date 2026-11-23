// Termos e Privacidade no DocumentoLegal: o sumário sai das seções do texto e
// acompanha a leitura (ao lado no computador; numa barra que abre no
// celular), a barra de progresso, o resumo em cartão e a dúvida pelo WhatsApp.
// Uso: node tests/legais.mjs [endereço base]   (padrão: http://localhost:3005)

import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://localhost:3005";
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}

// /painel e /painel/privacidade: a página e a política do app no Google Cloud
// (verificação da marca), no mesmo componente, sem o resumo em cartão.
const paginas = [
  { caminho: "/termos", secoes: 18, assunto: "os Termos de Serviço", alvo: "Reembolso" },
  { caminho: "/privacidade", secoes: 11, assunto: "a Política de Privacidade", alvo: "Seus direitos" },
  { caminho: "/painel", secoes: 5, assunto: "o Painel Adsgator", alvo: "Para que serve", semResumo: true },
  { caminho: "/painel/privacidade", secoes: 8, assunto: "a Política de Privacidade do Painel Adsgator", alvo: "Dados do Google que o painel acessa", semResumo: true },
];
const telas = [
  { nome: "notebook", width: 1366, height: 768 },
  { nome: "celular", width: 390, height: 844 },
];

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const tela of telas) {
    for (const { caminho, secoes, assunto, alvo, semResumo } of paginas) {
      const rotulo = `${tela.nome}, ${caminho}`;
      const page = await browser.newPage({ viewport: { width: tela.width, height: tela.height } });
      const erros = [];
      page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
      page.on("pageerror", (e) => erros.push(e.message));
      await page.goto(BASE + caminho, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      // O aviso de cookies cobre o canto de baixo até a escolha (e o fim do
      // sumário no notebook): o teste recusa, como um visitante.
      const aviso = page.locator("[data-aviso-cookies]");
      if (await aviso.isVisible()) await aviso.getByRole("button", { name: "Recusar" }).click();

      const celular = tela.width < 1024;
      const nav = celular ? 'nav[aria-label="Nesta página, no celular"]' : 'nav[aria-label="Nesta página"]';
      const barra = page.getByRole("button", { name: /Nesta página/ });
      if (celular) await barra.click();
      const itens = await page.$$eval(`${nav} a`, (as) => as.map((a) => a.textContent.trim()));
      check(`${rotulo}: o sumário tem as ${secoes} seções, sem o número`, itens.length === secoes && itens.every((t) => !/^\d/.test(t)), itens.slice(0, 4).join(" · "));

      // Clicar numa seção leva até ela; a seção fica marcada como a atual.
      await page.locator(nav).getByRole("link", { name: alvo, exact: true }).click();
      await page.waitForTimeout(900);
      const chegou = await page.evaluate((t) => {
        const h = [...document.querySelectorAll("article h2")].find((x) => x.dataset.titulo === t);
        return Math.round(h.getBoundingClientRect().top);
      }, alvo);
      if (celular) {
        const naBarra = await barra.textContent();
        check(`${rotulo}: no celular, a lista fecha e a barra mostra a seção atual`, chegou >= 0 && chegou < 260 && naBarra.includes(alvo) && !(await page.locator(nav).count()), `título a ${chegou}px; barra: ${naBarra.trim()}`);
      } else {
        const atual = await page.$eval(`${nav} a[aria-current]`, (a) => a.textContent.trim()).catch(() => "");
        check(`${rotulo}: clicar leva à seção e ela fica marcada no sumário`, chegou >= 0 && chegou < 260 && atual === alvo, `título a ${chegou}px; marcada: ${atual}`);
      }

      // Rolando mais, a marcação acompanha e a barra de progresso enche.
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight * 0.85, behavior: "instant" }));
      await page.waitForTimeout(800);
      const depois = celular
        ? (await barra.textContent()).replace("Nesta página", "").trim()
        : await page.$eval(`${nav} a[aria-current]`, (a) => a.textContent.trim()).catch(() => "");
      const progresso = await page.$eval("div.fixed.origin-left", (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
      check(`${rotulo}: rolando, a seção atual muda e a barra de progresso enche`, depois && depois !== alvo && progresso > 0.6, `${depois}, progresso ${progresso.toFixed(2)}`);

      const fim = await page.evaluate(() => ({
        resumo: !!document.querySelector(".resumo-legal li"),
        whats: [...document.querySelectorAll('a[href^="https://wa.me/"]')].map((a) => decodeURIComponent(a.href)).find((h) => h.includes("dúvida sobre")) ?? "",
        sobra: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      check(
        `${rotulo}: o resumo em cartão, a dúvida pelo WhatsApp com a mensagem pronta e sem sobra lateral`,
        (semResumo || fim.resumo) && fim.whats.includes(assunto) && fim.sobra === 0,
        `resumo ${fim.resumo}, sobra ${fim.sobra}px`,
      );
      check(`${rotulo}: console sem erros`, erros.length === 0, erros.join(" | ").slice(0, 300));
      await page.close();
    }
  }
} finally {
  await browser.close();
}

console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);

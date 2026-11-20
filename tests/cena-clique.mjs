// A cena da chamada final (pedido do Lucas, 2026-11-20): a seta branca da
// marca; no clique, as 3 linhas da ponta aparecem em amarelo e o elemento
// clicado reage (o anúncio afunda, o botão do WhatsApp aperta); fora do clique,
// só a seta. Roda nos dois modos de animação.
// Uso: node tests/cena-clique.mjs [endereço]   (padrão: http://localhost:3005/)

import { chromium } from "playwright-core";

const URL_PAGINA = process.argv[2] ?? "http://localhost:3005/";
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}

// "matrix(a, b, c, d, e, f)": a é a escala no eixo x.
const escala = (t) => (t && t.startsWith("matrix(") ? Number(t.slice(7).split(",")[0]) : 1);

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const reducedMotion of ["reduce", "no-preference"]) {
    const rotulo = reducedMotion === "reduce" ? "animações reduzidas" : "animações normais";
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 }, reducedMotion });
    await page.goto(URL_PAGINA, { waitUntil: "networkidle" });
    await page.$eval(".cena-clique", (el) => el.scrollIntoView({ block: "center", behavior: "instant" }));

    const seta = await page.$eval("[data-seta]", (el) => getComputedStyle(el).backgroundImage);
    check(`${rotulo}: o cursor é a seta branca da marca`, seta.includes("cursor-seta-branca.svg"), seta.slice(0, 80));

    const amostras = [];
    const inicio = Date.now();
    while (Date.now() - inicio < 14_000) {
      amostras.push(
        await page.evaluate(() => {
          const cena = document.querySelector(".cena-clique");
          const linhas = cena.querySelector("[data-linhas]");
          return {
            clique: cena.dataset.clique ?? "",
            linhas: linhas ? Number(getComputedStyle(linhas).opacity) : 0,
            anuncio: getComputedStyle(cena.querySelector("[data-anuncio]") ?? cena).transform,
            whats: getComputedStyle(cena.querySelector("[data-cta-whatsapp]") ?? cena).transform,
          };
        }),
      );
      await page.waitForTimeout(80);
    }
    const noAnuncio = amostras.filter((a) => a.clique === "anuncio");
    const noWhats = amostras.filter((a) => a.clique === "whats");
    const fora = amostras.filter((a) => !a.clique);
    check(
      `${rotulo}: clique no anúncio: as linhas amarelas aparecem e o anúncio afunda`,
      noAnuncio.some((a) => a.linhas > 0.8) && noAnuncio.some((a) => escala(a.anuncio) < 0.99),
      `${noAnuncio.length} amostras, linhas até ${Math.max(0, ...noAnuncio.map((a) => a.linhas)).toFixed(2)}, escala mínima ${Math.min(1, ...noAnuncio.map((a) => escala(a.anuncio))).toFixed(3)}`,
    );
    check(
      `${rotulo}: clique no WhatsApp: as linhas amarelas aparecem e o botão aperta`,
      noWhats.some((a) => a.linhas > 0.8) && noWhats.some((a) => escala(a.whats) < 0.95),
      `${noWhats.length} amostras, linhas até ${Math.max(0, ...noWhats.map((a) => a.linhas)).toFixed(2)}, escala mínima ${Math.min(1, ...noWhats.map((a) => escala(a.whats))).toFixed(3)}`,
    );
    check(`${rotulo}: fora do clique, só a seta (sem as linhas)`, fora.length > 20 && fora.every((a) => a.linhas === 0), `${fora.length} amostras`);
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);

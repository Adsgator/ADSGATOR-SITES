// Página de Google Ads: o anúncio se montando no topo, a lista que se marca, a
// linha do tempo, a verba correndo (com pausa) e a mensagem pronta do WhatsApp.
// Roda nos dois modos de animação (o Windows do Lucas está com "Mostrar
// animações" desligado).
// Uso: node tests/google-ads.mjs [endereço]   (padrão: http://localhost:3005/google-ads)

import { chromium } from "playwright-core";

const URL_PAGINA = process.argv[2] ?? "http://localhost:3005/google-ads";
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}

const telas = [
  { nome: "notebook", width: 1366, height: 768 },
  { nome: "celular", width: 390, height: 844 },
];

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const tela of telas) {
    for (const reducedMotion of ["reduce", "no-preference"]) {
      const rotulo = `${tela.nome}, ${reducedMotion === "reduce" ? "animações reduzidas" : "animações normais"}`;
      const page = await browser.newPage({ viewport: { width: tela.width, height: tela.height }, reducedMotion });
      const erros = [];
      page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
      page.on("pageerror", (e) => erros.push(e.message));
      const resposta = await page.goto(URL_PAGINA, { waitUntil: "networkidle" });
      check(`${rotulo}: página responde`, resposta.status() === 200, `${resposta.status()}`);

      const rolarPara = async (y) => {
        await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
        await page.waitForTimeout(600);
      };
      const topoDe = (seletor) =>
        page.evaluate((s) => {
          const r = document.querySelector(s).getBoundingClientRect();
          return { topo: r.top + window.scrollY, fim: r.bottom + window.scrollY };
        }, seletor);

      // WhatsApp: os convites com a mensagem desta página (o contato do rodapé
      // fica sem mensagem: serve também a quem já é cliente).
      const links = await page.$$eval('a[href^="https://wa.me/"]', (as) => as.map((a) => decodeURIComponent(a.href)));
      const convites = links.filter((l) => l.includes("?text="));
      check(
        `${rotulo}: os convites do WhatsApp (topo, menu, página, chamada final, rodapé) dizem "pela página de Google Ads"`,
        convites.length >= 5 && convites.every((l) => l.includes("pela página de Google Ads")),
        `${convites.length} convites`,
      );
      check(`${rotulo}: só o contato do rodapé sem mensagem`, links.length - convites.length === 1, `${links.length - convites.length}`);

      // Topo: a busca é digitada, o anúncio se monta e troca de cliente.
      await page.waitForSelector("[data-anuncio]", { timeout: 12_000 });
      const primeiro = await page.textContent("[data-anuncio]");
      const busca = await page.textContent("[data-busca]");
      check(`${rotulo}: a busca foi digitada e o anúncio apareceu`, busca.length > 5 && primeiro.includes("Patrocinado"), busca);
      await page.waitForFunction(
        (antes) => {
          const a = document.querySelector("[data-anuncio]");
          return a && !a.textContent.includes(antes);
        },
        primeiro.slice(0, 60).replace("Seu anúncio", "").replace("Patrocinado", "").slice(0, 20),
        { timeout: 15_000 },
      );
      check(`${rotulo}: o anúncio troca de cliente`, true);

      const giro = () =>
        page.$eval("[data-resultados]", (el) => {
          const m = new DOMMatrix(getComputedStyle(el).transform);
          return Math.round(Math.asin(Math.max(-1, Math.min(1, m.m13))) * (180 / Math.PI));
        });
      const giroTopo = Math.abs(await giro());
      await rolarPara(600);
      const giroRolado = Math.abs(await giro());
      check(`${rotulo}: inclinada no topo e de frente ao rolar`, giroTopo >= 10 && giroRolado <= 1, `${giroTopo}° → ${giroRolado}°`);

      // Lista que se marca.
      const lista = await topoDe("#comeco ol");
      await rolarPara(lista.topo - tela.height * 0.7 - 80);
      const antes = await page.$$eval("#comeco [data-feito]", (e) => e.length);
      await rolarPara((lista.topo + lista.fim) / 2 - tela.height * 0.62);
      const meio = await page.$$eval("#comeco [data-feito]", (e) => e.length);
      await rolarPara(lista.fim - tela.height * 0.55 + 80);
      const depois = await page.$$eval("#comeco [data-feito]", (e) => e.length);
      check(`${rotulo}: a lista se marca com a rolagem`, antes === 0 && meio > 0 && meio < 6 && depois === 6, `${antes} → ${meio} → ${depois}`);

      // Linha do tempo.
      const linha = await topoDe("ol:has([data-aceso]), ol:has(li > span + div > p.font-mono)");
      await rolarPara(linha.topo - tela.height * 0.75 - 80);
      const apagados = await page.$$eval("[data-aceso]", (e) => e.length);
      await rolarPara(linha.fim - tela.height * 0.5 + 80);
      const acesos = await page.$$eval("[data-aceso]", (e) => e.length);
      check(`${rotulo}: a linha do tempo acende os marcos`, apagados === 0 && acesos === 4, `${apagados} → ${acesos}`);

      // A verba correndo e a pausa.
      const verba = page.locator(".fluxo").first();
      await verba.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      const correndo = await verba.evaluate((el) => getComputedStyle(el).animationName + " " + getComputedStyle(el).animationPlayState);
      await page.locator("section.dark button:has(.sr-only)").click();
      const pausada = await verba.evaluate((el) => getComputedStyle(el).animationPlayState);
      check(`${rotulo}: a verba corre e o botão pausa`, correndo === "fluxo running" && pausada === "paused", `${correndo} → ${pausada}`);

      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(`${rotulo}: sem sobra lateral`, sobra === 0, `${sobra} px`);
      check(`${rotulo}: console sem erros`, erros.length === 0, erros.join(" | ").slice(0, 400));
      await page.close();
    }
  }
} finally {
  await browser.close();
}

console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);

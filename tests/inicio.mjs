// Página inicial: a frase de posição, sem a faixa de amostra nem o "Sistema
// visual", os convites com a mensagem do diagnóstico, a faixa do portfólio, a
// trajetória que se marca com a rolagem, as 8 perguntas do roteiro e a chamada
// final. Roda nos dois modos de animação (o Windows do Lucas está com "Mostrar
// animações" desligado).
// Uso: node tests/inicio.mjs [endereço]   (padrão: http://localhost:3005/)

import { chromium } from "playwright-core";

const URL_PAGINA = process.argv[2] ?? "http://localhost:3005/";
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

      const topo = await page.evaluate(() => ({
        h1: document.querySelector("h1").textContent,
        amostra: document.body.innerText.includes("Amostra 3"),
        sistema: document.body.innerText.includes("Sistema visual"),
        noindex: !!document.querySelector('meta[name="robots"][content*="noindex"]'),
        canonical: document.querySelector('link[rel="canonical"]')?.href,
      }));
      check(
        `${rotulo}: a frase de posição, sem a faixa de amostra, sem o "Sistema visual", indexável e com o endereço certo`,
        topo.h1.includes("chega ao seu WhatsApp") && !topo.amostra && !topo.sistema && !topo.noindex && new URL(topo.canonical).pathname === "/",
        JSON.stringify(topo),
      );

      // WhatsApp: os convites com a mensagem do diagnóstico; o contato do rodapé sem.
      const links = await page.$$eval('a[href^="https://wa.me/"]', (as) => as.map((a) => decodeURIComponent(a.href)));
      const convites = links.filter((l) => l.includes("?text="));
      check(`${rotulo}: os convites do WhatsApp com a mensagem pronta`, convites.length >= 3, `${convites.length} convites`);
      check(`${rotulo}: só o contato do rodapé sem mensagem`, links.length - convites.length === 1, `${links.length - convites.length}`);

      // As páginas de cada assunto: serviços, como funciona, portfólio e quem está por trás.
      const destinos = await page.$$eval("main a[href^='/']", (as) => [...new Set(as.map((a) => new URL(a.href).pathname))]);
      const esperados = ["/google-ads", "/landing-page", "/manutencao", "/como-funciona", "/portfolio", "/quem-esta-por-tras"];
      check(`${rotulo}: leva às páginas de cada assunto`, esperados.every((d) => destinos.includes(d)), destinos.join(" "));

      // Quem está por trás: a trajetória se marca com a rolagem.
      const lista = await page.evaluate(() => {
        const ol = [...document.querySelectorAll("ol")].find((o) => o.querySelector("[data-feito], li") && o.textContent.includes("nasce a Adsgator"));
        const r = ol.getBoundingClientRect();
        return { topo: r.top + window.scrollY, fim: r.bottom + window.scrollY };
      });
      await rolarPara(lista.topo - tela.height * 0.7 - 80);
      const antes = await page.$$eval("[data-feito]", (e) => e.length);
      await rolarPara(lista.fim - tela.height * 0.55 + 80);
      const depois = await page.$$eval("[data-feito]", (e) => e.length);
      check(`${rotulo}: a trajetória se marca com a rolagem`, antes === 0 && depois === 6, `${antes} → ${depois}`);

      const fim = await page.evaluate(() => ({
        perguntas: document.querySelectorAll("details").length,
        faixa: document.querySelectorAll("[data-portfolio] [data-cartao]").length,
        chamada: document.body.innerText.includes("Quem procura você já está no Google."),
      }));
      check(`${rotulo}: a faixa do portfólio, as 8 perguntas e a chamada final`, fim.faixa === 5 && fim.perguntas === 8 && fim.chamada, JSON.stringify(fim));

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

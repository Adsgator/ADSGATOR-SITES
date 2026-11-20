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

      // O que a Adsgator faz: a página no celular desce até o rodapé, sem
      // passar dele (o Lucas viu passando, 2026-11-20). Mede o ponto mais baixo.
      await page.$eval("[data-tela-celular]", (el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      let maisBaixo = Infinity;
      for (let i = 0; i < 40; i++) {
        const sobra = await page.evaluate(() => {
          const t = document.querySelector("[data-tela-celular]").getBoundingClientRect();
          const pg = document.querySelector("[data-pagina-celular] > div").getBoundingClientRect();
          return pg.bottom - t.bottom;
        });
        maisBaixo = Math.min(maisBaixo, sobra);
        await page.waitForTimeout(200);
      }
      check(`${rotulo}: a página no celular desce até o rodapé e não passa dele`, maisBaixo > -2 && maisBaixo < 40, `fim da página a ${maisBaixo.toFixed(1)} px do fim da tela`);

      // Por que a Adsgator: os visuais dos cartões parados até a pessoa chegar,
      // e se animando quando ela chega. Volta ao topo antes de recarregar.
      await rolarPara(0);
      await page.reload({ waitUntil: "networkidle" });
      await rolarPara(0);
      const visuaisAntes = await page.evaluate(() => ({
        marcados: document.querySelectorAll('[data-visual="nome"] [data-marcado]').length,
        ligado: !!document.querySelector('[data-visual="fidelidade"] [data-ligado]'),
        resposta: !!document.querySelector('[data-visual="direto"] [data-resposta]'),
      }));
      const verVisual = async (nome, espera) => {
        await page.$eval(`[data-visual="${nome}"]`, (el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
        await page.waitForTimeout(espera);
      };
      await verVisual("nome", 1500);
      await verVisual("fidelidade", 1700);
      await verVisual("medida", 300);
      const medida1 = await page.$$eval("[data-pagina-medida]", (imgs) => imgs.map((i) => i.getAttribute("src")).join());
      await page.waitForTimeout(3200);
      const medida2 = await page.$$eval("[data-pagina-medida]", (imgs) => imgs.map((i) => i.getAttribute("src")).join());
      await verVisual("direto", 3600);
      await verVisual("resumo", 1800);
      const visuais = await page.evaluate(() => ({
        marcados: document.querySelectorAll('[data-visual="nome"] [data-marcado]').length,
        ligado: !!document.querySelector('[data-visual="fidelidade"] [data-ligado]'),
        paginasReais: document.querySelectorAll("[data-pagina-medida]").length,
        resposta: !!document.querySelector('[data-visual="direto"] [data-resposta]'),
        contatos: document.querySelector('[data-visual="resumo"] .tabular-nums')?.textContent,
      }));
      check(
        `${rotulo}: por que a Adsgator: os cartões parados antes e se animando ao chegar, com páginas reais trocando no "Sob medida"`,
        visuaisAntes.marcados === 0 && !visuaisAntes.ligado && !visuaisAntes.resposta &&
          visuais.marcados === 3 && visuais.ligado && visuais.paginasReais === 3 && medida1 !== medida2 && visuais.resposta && visuais.contatos === "41",
        `antes ${JSON.stringify(visuaisAntes)}; depois ${JSON.stringify(visuais)}; trocou ${medida1 !== medida2}`,
      );

      // Nada passa da borda dos cartões (o cartão esconde o que sobra, então o
      // "sem sobra lateral" não pega: no celular, o texto do "Sob medida" foi cortado).
      const cortados = await page.$eval("article", (as) =>
        as
          .filter((a) => a.querySelector("[data-visual]"))
          .filter((a) => [...a.children].some((c) => c.getBoundingClientRect().right > a.getBoundingClientRect().right + 1))
          .map((a) => a.querySelector("h3")?.textContent),
      );
      check(`${rotulo}: o conteúdo dos cartões cabe neles`, cortados.length === 0, cortados.join(", "));

      // Quem está por trás: a trajetória se marca com a rolagem.
      const lista = await page.evaluate(() => {
        const ol = [...document.querySelectorAll("ol")].find((o) => o.querySelector("[data-feito], li") && o.textContent.includes("nasceu a Adsgator"));
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

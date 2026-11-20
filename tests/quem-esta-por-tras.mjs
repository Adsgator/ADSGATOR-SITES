// Página "Quem está por trás": a foto, a trajetória que se marca com a
// rolagem, os números, a frase do Lucas, uma pessoa e um sistema, os cinco
// pontos, as dúvidas, o fundo e a mensagem pronta do
// WhatsApp. Roda nos dois modos de animação (o Windows do Lucas está com
// "Mostrar animações" desligado).
// Uso: node tests/quem-esta-por-tras.mjs [endereço]   (padrão: http://localhost:3005/quem-esta-por-tras)

import { chromium } from "playwright-core";

const URL_PAGINA = process.argv[2] ?? "http://localhost:3005/quem-esta-por-tras";
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

      // WhatsApp: os convites com a mensagem desta página; o contato do rodapé sem.
      const links = await page.$$eval('a[href^="https://wa.me/"]', (as) => as.map((a) => decodeURIComponent(a.href)));
      const convites = links.filter((l) => l.includes("?text="));
      check(
        `${rotulo}: os convites dizem "Olá, Lucas!" e "pela página Quem está por trás"`,
        convites.length >= 5 && convites.every((l) => l.includes("Olá, Lucas!") && l.includes("pela página Quem está por trás")),
        `${convites.length} convites`,
      );
      check(`${rotulo}: só o contato do rodapé sem mensagem`, links.length - convites.length === 1, `${links.length - convites.length}`);

      // Topo: o nome e a foto.
      const topo = await page.evaluate(() => {
        const foto = document.querySelector('img[alt="Lucas, da Adsgator"]');
        return { h1: document.querySelector("h1").textContent, foto: !!foto && foto.complete && foto.naturalWidth > 0 };
      });
      check(`${rotulo}: "Oi, eu sou o Lucas." com a foto carregada`, topo.h1.includes("Lucas") && topo.foto, topo.h1);

      // Fundo: a trajetória sobe e para no botão.
      const coluna = page.locator(".subir").first();
      const subindo = await coluna.evaluate((el) => getComputedStyle(el).animationName + " " + getComputedStyle(el).animationPlayState);
      await page.getByRole("button", { name: "Pausar as animações" }).first().click();
      const parada = await coluna.evaluate((el) => getComputedStyle(el).animationPlayState);
      await page.getByRole("button", { name: "Continuar as animações" }).first().click();
      check(`${rotulo}: o fundo sobe e para no botão`, subindo === "subir running" && parada === "paused", `${subindo} → ${parada}`);

      // De onde eu venho: a lista que se marca.
      const lista = await page.evaluate(() => {
        const r = document.querySelector("ol:has([class*='-left-16'])").getBoundingClientRect();
        return { topo: r.top + window.scrollY, fim: r.bottom + window.scrollY };
      });
      await rolarPara(lista.topo - tela.height * 0.7 - 80);
      const antes = await page.$$eval("[data-feito]", (e) => e.length);
      await rolarPara(lista.fim - tela.height * 0.55 + 80);
      const depois = await page.$$eval("[data-feito]", (e) => e.length);
      check(`${rotulo}: a trajetória se marca com a rolagem`, antes === 0 && depois === 6, `${antes} → ${depois}`);

      const conteudo = await page.evaluate(() => ({
        frase: document.querySelector("blockquote")?.textContent ?? "",
        pontos: [...document.querySelectorAll("main ol")].at(-1).querySelectorAll(":scope > li").length,
      }));
      check(`${rotulo}: a frase do Lucas, literal`, conteudo.frase.includes("Eu sinto prazer em criar coisas digitais"), conteudo.frase);
      check(`${rotulo}: os cinco pontos`, conteudo.pontos === 5, `${conteudo.pontos}`);

      // Os números e "uma pessoa e um sistema": parados até a pessoa chegar.
      // Volta ao topo antes de recarregar: o Chrome devolve a rolagem de antes.
      await rolarPara(0);
      await page.reload({ waitUntil: "networkidle" });
      await rolarPara(0);
      const numeros = () => page.$$eval("[data-numeros] dd", (dds) => dds.map((d) => d.textContent).join(" "));
      const numerosAntes = await numeros();
      const marcadosAntes = await page.$$eval("[data-comigo-marcado]", (e) => e.length);
      await page.$eval("[data-numeros]", (el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForTimeout(2000);
      const numerosDepois = await numeros();
      const anos = new Date().getFullYear() - 2020;
      check(
        `${rotulo}: os números sobem quando a pessoa chega`,
        numerosAntes === "+0 +0 0" && numerosDepois === `+20 +10 ${anos}`,
        `${numerosAntes} → ${numerosDepois}`,
      );

      await page.$eval("[data-eu-e-o-sistema]", (el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForTimeout(1500);
      const marcados = await page.$$eval("[data-comigo-marcado]", (e) => e.length);
      const topoDoRegistro = () => page.$eval("[data-registro]", (li) => li.textContent);
      const registros = new Set([await topoDoRegistro()]);
      for (let i = 0; i < 4; i++) {
        await page.waitForTimeout(1000);
        registros.add(await topoDoRegistro());
      }
      await page.locator("[data-eu-e-o-sistema]").getByRole("button", { name: "Pausar as animações" }).click();
      const parado = await topoDoRegistro();
      await page.waitForTimeout(2500);
      const aindaParado = (await topoDoRegistro()) === parado;
      check(
        `${rotulo}: uma pessoa e um sistema: o que é comigo se marca, o registro anda e para no botão`,
        marcadosAntes === 0 && marcados === 4 && registros.size >= 2 && aindaParado,
        `marcados ${marcadosAntes} → ${marcados}, ${registros.size} registros no topo, parado ${aindaParado}`,
      );

      const duvidas = await page.$$eval("li p.font-heading", (ps) => ps.filter((p) => p.textContent.startsWith("“")).length);
      check(`${rotulo}: as 3 dúvidas`, duvidas === 3, `${duvidas}`);

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

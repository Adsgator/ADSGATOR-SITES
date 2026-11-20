// Página Portfólio: as 4 páginas com cidade, serviços e mini caso; a página
// inteira rolando ao passar o mouse (e ao focar o link pelo teclado); o fundo
// com as páginas no celular; a mensagem pronta do WhatsApp. Roda nos dois modos
// de animação (o Windows do Lucas está com "Mostrar animações" desligado).
// Uso: node tests/pagina-portfolio.mjs [endereço]   (padrão: http://localhost:3005/portfolio)

import { chromium } from "playwright-core";

const URL_PAGINA = process.argv[2] ?? "http://localhost:3005/portfolio";
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}

const telas = [
  { nome: "notebook", width: 1366, height: 768, mouse: true },
  { nome: "celular", width: 390, height: 844, mouse: false },
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

      // WhatsApp: os convites com a mensagem desta página; o contato do rodapé sem.
      const links = await page.$$eval('a[href^="https://wa.me/"]', (as) => as.map((a) => decodeURIComponent(a.href)));
      const convites = links.filter((l) => l.includes("?text="));
      check(
        `${rotulo}: os convites do WhatsApp dizem "pela página do Portfólio"`,
        convites.length >= 5 && convites.every((l) => l.includes("pela página do Portfólio")),
        `${convites.length} convites`,
      );
      check(`${rotulo}: só o contato do rodapé sem mensagem`, links.length - convites.length === 1, `${links.length - convites.length}`);

      // Fundo: as páginas no celular carregam, sobem e param no botão.
      const fotosFundo = await page.$$eval(".subir img", (imgs) => imgs.filter((i) => i.complete && i.naturalWidth > 0).length);
      const coluna = page.locator(".subir").first();
      const subindo = await coluna.evaluate((el) => getComputedStyle(el).animationName + " " + getComputedStyle(el).animationPlayState);
      await page.getByRole("button", { name: "Pausar as animações" }).first().click();
      const parada = await coluna.evaluate((el) => getComputedStyle(el).animationPlayState);
      await page.getByRole("button", { name: "Continuar as animações" }).first().click();
      check(
        `${rotulo}: o fundo mostra as páginas, sobe e para no botão`,
        fotosFundo >= 4 && subindo === "subir running" && parada === "paused",
        `${fotosFundo} fotos visíveis, ${subindo} → ${parada}`,
      );

      // As 4 páginas, cada uma completa.
      const cartoes = await page.$$eval("main [data-cartao]", (cs) =>
        cs.map((c) => ({
          id: c.dataset.cartao,
          cidade: c.querySelector("h2 + p")?.textContent.trim(),
          servicos: c.querySelectorAll('ul[aria-label="Serviços"] li').length,
          caso: c.querySelectorAll("dt").length,
          link: c.querySelector('a[target="_blank"]')?.href,
        })),
      );
      check(`${rotulo}: 4 páginas`, cartoes.length === 4, cartoes.map((c) => c.id).join(", "));
      check(
        `${rotulo}: cada uma com cidade, serviços, o mini caso e o link`,
        cartoes.every((c) => c.cidade && c.servicos >= 2 && c.caso === 3 && c.link?.startsWith("https://")),
        cartoes.map((c) => `${c.id}: ${c.cidade}, ${c.servicos} serviços, ${c.caso} linhas`).join(" | "),
      );

      const posicaoDaFoto = (id) =>
        page.evaluate((i) => {
          const img = document.querySelector(`[data-cartao="${i}"] [data-inteira]`);
          if (!img) return null;
          const quadro = img.parentElement.getBoundingClientRect();
          const foto = img.getBoundingClientRect();
          return { faltaFim: foto.bottom - quadro.bottom, topo: foto.top - quadro.top, alturaFoto: foto.height, alturaQuadro: quadro.height };
        }, id);

      if (tela.mouse) {
        // A página mais curta (móveis planejados, ~3,5 s de rolagem).
        const janela = page.locator('[data-cartao="planejados"] [class*="aspect-"]');
        await janela.scrollIntoViewIfNeeded();
        await janela.hover();
        await page.waitForFunction(() => document.querySelector('[data-cartao="planejados"] [data-inteira="rolando"]'), null, { timeout: 10_000 });
        await page.waitForTimeout(4500);
        const rolou = await posicaoDaFoto("planejados");
        check(
          `${rotulo}: com o mouse, a página inteira rola até o fim`,
          Math.abs(rolou.faltaFim) < 2 && rolou.alturaFoto > rolou.alturaQuadro * 3,
          `fim da foto a ${rolou.faltaFim.toFixed(1)} px do fim da janela`,
        );
        await page.mouse.move(5, 5);
        await page.waitForTimeout(1200);
        const voltou = await posicaoDaFoto("planejados");
        check(`${rotulo}: ao tirar o mouse, volta ao topo`, Math.abs(voltou.topo) < 2, `${voltou.topo.toFixed(1)} px`);
      }

      // Pelo teclado: focar o link do cartão também mostra a página inteira.
      await page.locator('[data-cartao="creche"] a[target="_blank"]').focus();
      const peloTeclado = await page
        .waitForFunction(() => document.querySelector('[data-cartao="creche"] [data-inteira="rolando"]'), null, { timeout: 10_000 })
        .then(() => true)
        .catch(() => false);
      check(`${rotulo}: focar o link pelo teclado faz a página rolar`, peloTeclado);

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

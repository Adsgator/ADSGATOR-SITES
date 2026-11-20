// Página Portfólio: as 8 páginas numa grade só, com o endereço (sem link), cidade, serviços e mini
// caso, o pattern no topo, "Em toda página"; a página
// inteira rolando ao passar o mouse (e ao focar o cartão pelo teclado); o fundo
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

      // As 8 páginas numa grade só, cada uma completa, com o endereço na janela e
      // sem link (decisão do Lucas); a de demonstração marcada como conceito.
      const cartoes = await page.$$eval("#paginas [data-cartao]", (cs) =>
        cs.map((c) => ({
          id: c.dataset.cartao,
          cidade: c.querySelector("h3 + p")?.textContent.trim(),
          servicos: c.querySelectorAll('ul[aria-label="Serviços"] li:not([data-conceito])').length,
          caso: c.querySelectorAll("dt").length,
          links: c.querySelectorAll("a").length,
          endereco: c.querySelector(".font-mono.truncate")?.textContent.trim() ?? "",
          conceito: !!c.querySelector("[data-conceito]"),
        })),
      );
      check(`${rotulo}: 8 páginas numa grade só`, cartoes.length === 8, cartoes.map((c) => c.id).join(", "));
      check(
        `${rotulo}: cada uma com cidade, serviços, o mini caso e o endereço, sem link`,
        cartoes.every((c) => c.cidade && c.servicos >= 1 && c.caso === 3 && c.endereco.endsWith(".com.br") && c.links === 0),
        cartoes.map((c) => `${c.id}: ${c.endereco}, ${c.cidade}, ${c.servicos} serviços, ${c.links} links`).join(" | "),
      );
      const conceitos = cartoes.filter((c) => c.conceito).map((c) => c.id).join(",");
      check(`${rotulo}: "Projeto conceito" só na de demonstração`, conceitos === "sob-medida", conceitos);
      const pattern = await page.$eval("[data-pattern]", (el) => getComputedStyle(el).backgroundImage);
      check(`${rotulo}: o pattern da Adsgator no fundo do topo`, pattern.includes("padrao-"), pattern.slice(0, 80));

      const posicaoDaFoto = (id) =>
        page.evaluate((i) => {
          const img = document.querySelector(`[data-cartao="${i}"] [data-inteira]`);
          if (!img) return null;
          const quadro = img.parentElement.getBoundingClientRect();
          const foto = img.getBoundingClientRect();
          return { faltaFim: foto.bottom - quadro.bottom, topo: foto.top - quadro.top, alturaFoto: foto.height, alturaQuadro: quadro.height };
        }, id);

      if (tela.mouse) {
        // A página mais curta das de cliente (móveis planejados, ~9 s de
        // rolagem): devagar, para dar tempo de ver (pedido do Lucas), e até o fim.
        const janela = page.locator('[data-cartao="planejados"] [class*="aspect-"]');
        await janela.scrollIntoViewIfNeeded();
        await janela.hover();
        await page.waitForFunction(() => document.querySelector('[data-cartao="planejados"] [data-inteira="rolando"]'), null, { timeout: 10_000 });
        await page.waitForTimeout(3000);
        const aos3 = await posicaoDaFoto("planejados");
        const percorrido = -aos3.topo / (aos3.alturaFoto - aos3.alturaQuadro);
        check(`${rotulo}: a rolagem vai devagar (aos 3 s, ainda no começo)`, percorrido > 0.05 && percorrido < 0.45, `${Math.round(percorrido * 100)}% aos 3 s`);
        await page.waitForTimeout(7500);
        const rolou = await posicaoDaFoto("planejados");
        check(
          `${rotulo}: com o mouse, a página inteira rola até o fim`,
          Math.abs(rolou.faltaFim) < 2 && rolou.alturaFoto > rolou.alturaQuadro * 3,
          `fim da foto a ${rolou.faltaFim.toFixed(1)} px do fim da janela`,
        );
        await page.mouse.move(5, 5);
        await page.waitForTimeout(2000);
        const voltou = await posicaoDaFoto("planejados");
        check(`${rotulo}: ao tirar o mouse, volta ao topo`, Math.abs(voltou.topo) < 2, `${voltou.topo.toFixed(1)} px`);

        // Uma página que não está mais no ar: a foto inteira (das imagens da época) também rola.
        const antiga = page.locator('[data-cartao="provedor"] [class*="aspect-"]');
        await antiga.scrollIntoViewIfNeeded();
        await antiga.hover();
        const rolouAntiga = await page
          .waitForFunction(() => document.querySelector('[data-cartao="provedor"] [data-inteira="rolando"]'), null, { timeout: 10_000 })
          .then(() => true, () => false);
        check(`${rotulo}: numa página das imagens da época, a página inteira também rola com o mouse`, rolouAntiga);
        await page.mouse.move(5, 5);
      }

      // Pelo teclado: focar o cartão também mostra a página inteira.
      await page.locator('[data-cartao="nutricionista"]').focus();
      const peloTeclado = await page
        .waitForFunction(() => document.querySelector('[data-cartao="nutricionista"] [data-inteira="rolando"]'), null, { timeout: 10_000 })
        .then(() => true)
        .catch(() => false);
      check(`${rotulo}: focar o cartão pelo teclado faz a página rolar`, peloTeclado);
      await page.locator('[data-cartao="nutricionista"]').blur();

      // Em toda página: os 8 itens se marcam quando a pessoa chega, o celular
      // passa pelas páginas e para no botão de pausar.
      await page.$eval("[data-toda-pagina]", (el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForTimeout(2200);
      const marcados = await page.$$eval("[data-item-marcado]", (els) => els.length);
      const celular = () => page.$eval("[data-celular-atual]", (el) => el.getAttribute("src"));
      const fotos = new Set([await celular()]);
      for (let i = 0; i < 6; i++) {
        await page.waitForTimeout(1000);
        fotos.add(await celular());
      }
      await page.locator("[data-toda-pagina]").getByRole("button", { name: "Pausar as animações" }).click();
      const parado = await celular();
      await page.waitForTimeout(3000);
      const aindaParado = (await celular()) === parado;
      check(
        `${rotulo}: em toda página, os 8 itens se marcam e o celular passa pelas páginas e para no botão`,
        marcados === 8 && fotos.size >= 2 && aindaParado,
        `${marcados} itens, ${fotos.size} páginas no celular, parado ${aindaParado}`,
      );

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

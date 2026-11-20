// Portfólio do Início: presa no topo enquanto a fila anda de lado, começando
// com a primeira página alinhada ao título e terminando com a última inteira na
// borda direita; ao passar o mouse, a foto da página inteira rola até o fim e
// volta ao sair. Roda nos dois modos de animação (o Windows do Lucas está com
// "Mostrar animações" desligado).
// Uso: node tests/portfolio.mjs [endereço]   (padrão: http://localhost:3005/amostra)

import { chromium } from "playwright-core";

const URL_PAGINA = process.argv[2] ?? "http://localhost:3005/amostra";
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
      await page.goto(URL_PAGINA, { waitUntil: "networkidle" });

      const rolarPara = async (y) => {
        await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
        await page.waitForTimeout(500);
      };
      const medir = () =>
        page.evaluate(() => {
          const secao = document.querySelector("[data-portfolio]");
          const palco = secao.firstElementChild.getBoundingClientRect();
          const titulo = secao.querySelector("h2").getBoundingClientRect();
          const cartoes = [...secao.querySelectorAll("[data-cartao]")].map((c) => c.getBoundingClientRect());
          return {
            palcoTopo: palco.top,
            palcoDireita: palco.right,
            tituloEsquerda: titulo.left,
            primeiro: cartoes[0],
            ultimo: cartoes.at(-1),
            sobra: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          };
        });

      const { topo, altura } = await page.evaluate(() => {
        const s = document.querySelector("[data-portfolio]");
        return { topo: s.getBoundingClientRect().top + window.scrollY, altura: s.offsetHeight };
      });
      const fim = topo + altura - tela.height;
      check(`${rotulo}: a seção tem rolagem para a fila andar`, fim - topo > 300, `${fim - topo} px`);

      await rolarPara(topo);
      const inicio = await medir();
      check(`${rotulo}: no começo, presa no topo`, Math.abs(inicio.palcoTopo) < 1, `${inicio.palcoTopo}`);
      check(
        `${rotulo}: no começo, a primeira página alinhada ao título`,
        Math.abs(inicio.primeiro.left - inicio.tituloEsquerda) < 2,
        `cartão ${inicio.primeiro.left.toFixed(1)}, título ${inicio.tituloEsquerda.toFixed(1)}`,
      );
      check(
        `${rotulo}: o cartão cabe na altura da tela`,
        inicio.primeiro.bottom <= tela.height && inicio.primeiro.top >= 56,
        `de ${inicio.primeiro.top.toFixed(0)} a ${inicio.primeiro.bottom.toFixed(0)}`,
      );

      await rolarPara((topo + fim) / 2);
      const meio = await medir();
      check(`${rotulo}: no meio, continua presa e a fila andou`, Math.abs(meio.palcoTopo) < 1 && meio.primeiro.left < inicio.primeiro.left - 100, `topo ${meio.palcoTopo}, primeiro em ${meio.primeiro.left.toFixed(0)}`);

      await rolarPara(fim);
      const final = await medir();
      const margem = final.palcoDireita - final.ultimo.right;
      check(`${rotulo}: no fim, ainda presa`, Math.abs(final.palcoTopo) < 1, `${final.palcoTopo}`);
      check(
        `${rotulo}: no fim, a última página inteira, com a mesma margem do começo`,
        Math.abs(margem - inicio.tituloEsquerda) < 2,
        `margem direita ${margem.toFixed(1)}, esquerda ${inicio.tituloEsquerda.toFixed(1)}`,
      );

      await rolarPara(fim + 400);
      const depois = await medir();
      check(`${rotulo}: depois do fim, a seção solta`, depois.palcoTopo < -300, `${depois.palcoTopo.toFixed(0)}`);
      check(`${rotulo}: sem sobra lateral`, depois.sobra === 0, `${depois.sobra} px`);

      const cartoes = await page.$$eval("[data-portfolio] [data-cartao]", (cs) => ({ total: cs.length, links: cs.reduce((n, c) => n + c.querySelectorAll("a").length, 0) }));
      check(`${rotulo}: 5 páginas na fila, sem link para elas`, cartoes.total === 5 && cartoes.links === 0, JSON.stringify(cartoes));

      if (tela.mouse) {
        // A última da fila (recursos de multas, ~9,5 s de rolagem, devagar).
        await rolarPara(fim);
        const janela = page.locator('[data-cartao="multas"] [class*="aspect-"]');
        await janela.hover();
        await page.waitForFunction(() => document.querySelector('[data-inteira="rolando"]'), null, { timeout: 10_000 });
        await page.waitForTimeout(11_000);
        const rolou = await page.evaluate(() => {
          const img = document.querySelector('[data-cartao="multas"] [data-inteira]');
          const quadro = img.parentElement.getBoundingClientRect();
          const foto = img.getBoundingClientRect();
          return { faltaFim: foto.bottom - quadro.bottom, alturaFoto: foto.height, alturaQuadro: quadro.height };
        });
        check(
          `${rotulo}: com o mouse, a página inteira rola até o fim`,
          Math.abs(rolou.faltaFim) < 2 && rolou.alturaFoto > rolou.alturaQuadro * 3,
          `fim da foto a ${rolou.faltaFim.toFixed(1)} px do fim da janela`,
        );
        await page.mouse.move(5, 5);
        await page.waitForTimeout(2000);
        const voltou = await page.evaluate(() => {
          const img = document.querySelector('[data-cartao="multas"] [data-inteira]');
          return img.getBoundingClientRect().top - img.parentElement.getBoundingClientRect().top;
        });
        check(`${rotulo}: ao tirar o mouse, volta ao topo`, Math.abs(voltou) < 2, `${voltou.toFixed(1)} px`);
      }

      check(`${rotulo}: console sem erros`, erros.length === 0, erros.join(" | ").slice(0, 300));
      await page.close();
    }
  }
} finally {
  await browser.close();
}

console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);

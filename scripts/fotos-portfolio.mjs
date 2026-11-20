// Foto da página inteira de cada página do portfólio, para o efeito de rolar a
// página dentro do cartão ao passar o mouse (roteiro do site, Portfólio).
// Uso: node scripts/fotos-portfolio.mjs [id ou id=endereço ...]   (sem id, tira todas)
// `id=endereço` fotografa outro endereço, como uma página que não está mais no
// ar rodando no computador (`npx astro build` e `npx astro preview` no projeto).
// Precisa do Chrome instalado. Grava em public/portfolio/ a primeira tela
// (<id>-pc.jpg, 1280 × 800; <id>-cel.jpg, 390 × 844) e a página inteira
// (<id>-inteira.jpg), e mostra a altura (vai para `alturaInteira` em
// config/portfolio.ts).

import { writeFile } from "node:fs/promises";

import { chromium } from "playwright-core";
import sharp from "sharp";

const paginas = {
  adestradora: "https://juliamartinsadestradora.com.br/",
  escritorios: "https://wesharescritorios.com.br/",
  planejados: "https://oficinadosplanejadosofc.com.br/",
};

const LARGURA_FINAL = 960;
const jpeg = { quality: 72, mozjpeg: true };
const pedidas = process.argv.slice(2).map((a) => a.split("="));
const lista = pedidas.length ? pedidas : Object.keys(paginas).map((id) => [id]);

function alturaDaPagina(page) {
  return page.evaluate(() => document.documentElement.scrollHeight);
}

/** Abre a página e aceita o aviso de cookies, para ele não sair na foto. */
async function abrir(browser, url, viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  const aceitar = page.getByRole("button", { name: /aceitar|accept|concordo|entendi/i }).first();
  if (await aceitar.isVisible().catch(() => false)) await aceitar.click();
  await page.waitForTimeout(1500);
  return page;
}

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const [id, endereco] of lista) {
    const url = endereco ?? paginas[id];
    if (!url) throw new Error(`id desconhecido: ${id}`);

    // A primeira tela no celular.
    const celular = await abrir(browser, url, { width: 390, height: 844 });
    await writeFile(`public/portfolio/${id}-cel.jpg`, await sharp(await celular.screenshot({ type: "png" })).jpeg(jpeg).toBuffer());
    await celular.close();

    const page = await abrir(browser, url, { width: 1280, height: 800 });
    await writeFile(`public/portfolio/${id}-pc.jpg`, await sharp(await page.screenshot({ type: "png" })).jpeg(jpeg).toBuffer());

    // Primeira passada até o fim, para carregar as imagens.
    for (let y = 0; y < (await alturaDaPagina(page)); y += 500) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(150);
    }

    // Partes presas na tela (cabeçalho, seções que ficam paradas com a
    // rolagem) voltam para o lugar normal, e a caixa alta que segurava cada
    // seção presa encolhe: senão elas se repetem ou deixam um buraco na foto.
    // Botões flutuantes de baixo (WhatsApp, voltar ao topo) saem.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll("body *")) {
        const posicao = getComputedStyle(el).position;
        if (posicao === "sticky") {
          el.style.position = "relative";
          el.style.top = "auto";
          const pai = el.parentElement;
          if (pai && pai.offsetHeight > el.offsetHeight * 1.5) {
            pai.style.height = "auto";
            pai.style.minHeight = "0";
          }
        } else if (posicao === "fixed") {
          if (el.getBoundingClientRect().top > 120) el.style.display = "none";
          else el.style.position = "absolute";
        }
      }
    });
    // Seções presas pelo GSAP (caixa .pin-spacer): o script reaplica o estilo a
    // cada rolagem, então só uma regra com !important as mantém no lugar.
    await page.addStyleTag({
      content: `.pin-spacer { height: auto !important; padding: 0 !important; }
        .pin-spacer > * { position: relative !important; inset: auto !important; transform: none !important;
          height: auto !important; max-height: none !important; }`,
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    const altura = await alturaDaPagina(page);

    // Tela por tela, esperando os efeitos de entrada de cada parte (a foto da
    // página inteira de uma vez pegava as partes que aparecem com a rolagem
    // ainda escondidas).
    const partes = [];
    for (let y = 0; y < altura; y += 800) {
      const topo = Math.min(y, altura - 800);
      await page.evaluate((v) => window.scrollTo(0, v), topo);
      await page.waitForTimeout(900);
      partes.push({ input: await page.screenshot({ type: "png" }), top: topo, left: 0 });
    }
    const foto = await sharp({ create: { width: 1280, height: altura, channels: 3, background: "#fff" } })
      .composite(partes)
      .png()
      .toBuffer();
    const saida = await sharp(foto)
      .resize({ width: LARGURA_FINAL })
      .jpeg(jpeg)
      .toBuffer({ resolveWithObject: true });
    await writeFile(`public/portfolio/${id}-inteira.jpg`, saida.data);
    console.log(`${id}: ${saida.info.width}x${saida.info.height}, ${Math.round(saida.data.length / 1024)} KB`);
    await page.close();
  }
} finally {
  await browser.close();
}

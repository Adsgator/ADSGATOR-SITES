// Foto da página inteira de cada página do portfólio, para o efeito de rolar a
// página dentro do cartão ao passar o mouse (roteiro do site, Portfólio).
// Uso: node scripts/fotos-portfolio.mjs [id ...]   (sem id, tira todas)
// Precisa do Chrome instalado. Grava public/portfolio/<id>-inteira.jpg e mostra
// a altura de cada uma (vai para `alturaInteira` em portfolio-faixa.tsx).

import { writeFile } from "node:fs/promises";

import { chromium } from "playwright-core";
import sharp from "sharp";

const paginas = {
  adestradora: "https://juliamartinsadestradora.com.br/",
  creche: "https://natuespacocanino.com.br/",
  escritorios: "https://wesharescritorios.com.br/",
  planejados: "https://oficinadosplanejadosofc.com.br/",
};

const LARGURA_FINAL = 960;
const pedidas = process.argv.slice(2);
const ids = pedidas.length ? pedidas : Object.keys(paginas);

function alturaDaPagina(page) {
  return page.evaluate(() => document.documentElement.scrollHeight);
}

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const id of ids) {
    const url = paginas[id];
    if (!url) throw new Error(`id desconhecido: ${id}`);
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });

    // Aviso de cookies: aceita, para ele não sair na foto.
    const aceitar = page.getByRole("button", { name: /aceitar|accept|concordo|entendi/i }).first();
    if (await aceitar.isVisible().catch(() => false)) await aceitar.click();

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
      .jpeg({ quality: 72, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });
    await writeFile(`public/portfolio/${id}-inteira.jpg`, saida.data);
    console.log(`${id}: ${saida.info.width}x${saida.info.height}, ${Math.round(saida.data.length / 1024)} KB`);
    await page.close();
  }
} finally {
  await browser.close();
}

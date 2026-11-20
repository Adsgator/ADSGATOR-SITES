// Fotos do portfólio para páginas que não estão mais no ar, a partir das
// imagens guardadas da época (a página inteira no computador e no celular).
// Gera as mesmas três fotos do `scripts/fotos-portfolio.mjs`: a primeira tela
// (`-pc`, 1280 × 800; `-cel`, 390 × 844) e a página inteira (`-inteira`, 960 px
// de largura), e mostra a altura da inteira (o `alturaInteira` do
// config/portfolio.ts).
// Uso: node scripts/fotos-portfolio-arquivo.mjs <id> <imagem do computador> <imagem do celular>

import sharp from "sharp";

const [id, computador, celular] = process.argv.slice(2);
if (!id || !computador || !celular) {
  console.error("Uso: node scripts/fotos-portfolio-arquivo.mjs <id> <imagem do computador> <imagem do celular>");
  process.exit(1);
}

const destino = (sufixo) => `public/portfolio/${id}-${sufixo}.jpg`;
const jpeg = { quality: 72, mozjpeg: true };

await sharp(computador).resize({ width: 1280, height: 800, fit: "cover", position: "top" }).jpeg(jpeg).toFile(destino("pc"));
await sharp(celular).resize({ width: 390, height: 844, fit: "cover", position: "top" }).jpeg(jpeg).toFile(destino("cel"));
const inteira = await sharp(computador).resize({ width: 960 }).jpeg(jpeg).toFile(destino("inteira"));

console.log(`${id}: alturaInteira ${inteira.height}`);

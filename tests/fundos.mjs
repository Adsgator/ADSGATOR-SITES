// Fundo das heros (colunas subindo): a volta só não tem buraco se a metade de
// cada coluna for mais alta que a área do topo. Mede todas as páginas que usam
// o fundo, no notebook e no celular (o Lucas viu o buraco em 2026-11-20).
// Uso: node tests/fundos.mjs [endereço base]   (padrão: http://localhost:3005)

import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://localhost:3005";
const paginas = ["google-ads", "landing-page", "manutencao", "como-funciona", "portfolio", "quem-esta-por-tras"];
let falhas = 0;

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const viewport of [{ width: 1366, height: 768 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    for (const caminho of paginas) {
      await page.goto(`${BASE}/${caminho}`, { waitUntil: "networkidle" });
      const colunas = await page.$$eval(".subir", (els) =>
        els
          .filter((e) => e.offsetParent)
          .map((e) => ({ metade: e.scrollHeight / 2, area: e.closest("[aria-hidden]").getBoundingClientRect().height })),
      );
      const curtas = colunas.filter((c) => c.metade < c.area);
      const pior = Math.min(...colunas.map((c) => Math.round(c.metade - c.area)));
      const ok = colunas.length > 0 && curtas.length === 0;
      console.log(`${ok ? "ok  " : "FALHA"} ${viewport.width} px, ${caminho}: ${colunas.length} colunas, folga mínima ${pior} px`);
      if (!ok) falhas++;
    }
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);

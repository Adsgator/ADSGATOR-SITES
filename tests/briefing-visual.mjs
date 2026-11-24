// O desenho da página do briefing em todas as combinações que a pessoa pode escolher
// (cada estilo e cada dupla, com vários grupos de sensações e de cores): nada por cima de
// nada, nada fora da caixa e contraste de leitura. Usa a galeria do `next dev`.
// Uso: node tests/briefing-visual.mjs [endereço] [pasta das fotos]
import { chromium } from "playwright-core";

const SITE = process.argv[2] ?? "http://localhost:3005";
const FOTOS = process.argv[3];
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}
const browser = await chromium.launch({ channel: "chrome" });
const pg = await browser.newPage({ viewport: { width: 1900, height: 1000 } });
const erros = [];
pg.on("pageerror", (e) => erros.push(String(e)));

const grupos = [
  ["Exclusividade", "Confiança", "Ousadia"],
  ["Confiança", "Cuidado", "Acolhimento"],
  ["Alegria", "Energia", "Clareza"],
  ["Calma", "Leveza", "Inspiração"],
  ["Profissionalismo", "Confiança", "Clareza"],
];
const cores = [undefined, "Grafite e lima", "Azul-bebê e manteiga", "Pêssego e café", "#f2b705", "#14234a"];

for (const [i, sensacoes] of grupos.entries()) {
  for (const cor of i === 0 ? cores : [undefined]) {
    const q = new URLSearchParams({ sensacoes: sensacoes.join(","), ...(cor ? { cor } : {}) });
    await pg.goto(`${SITE}/forms/amostra/galeria?${q}`);
    await pg.waitForSelector("[data-combinacao]");
    await pg.waitForTimeout(2200);
    const r = await pg.evaluate(() => {
      const tela = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      const rgb = (cor) => {
        tela.clearRect(0, 0, 1, 1);
        tela.fillStyle = cor;
        tela.fillRect(0, 0, 1, 1);
        return tela.getImageData(0, 0, 1, 1).data;
      };
      const lum = (cor) => {
        const [r, g, b] = [...rgb(cor)].slice(0, 3).map((v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const contraste = (a, b) => {
        const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
        return (x + 0.05) / (y + 0.05);
      };
      const cruza = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
      const ruins = [];
      let n = 0;
      for (const c of document.querySelectorAll("[data-combinacao]")) {
        n++;
        const nome = c.dataset.combinacao;
        const topo = c.querySelector("[data-topo]");
        const foto = topo.querySelector("[data-foto]").getBoundingClientRect();
        const titulo = topo.querySelector("[data-titulo-do-desenho]");
        const botao = topo.querySelector("[data-botao-do-desenho]");
        const pecas = [titulo, botao, ...topo.querySelectorAll("[data-selo]")];
        for (const p of pecas) {
          const q = p.getBoundingClientRect();
          if (cruza(q, foto)) ruins.push(`${nome}: ${p.dataset.selo ?? p.textContent.slice(0, 10)} em cima da foto`);
          const t = topo.getBoundingClientRect();
          if (q.right > t.right - 4 || q.left < t.left + 4) ruins.push(`${nome}: ${p.textContent.slice(0, 10)} encostado na borda`);
        }
        for (let a = 0; a < pecas.length; a++)
          for (let b = a + 1; b < pecas.length; b++)
            if (cruza(pecas[a].getBoundingClientRect(), pecas[b].getBoundingClientRect())) ruins.push(`${nome}: ${pecas[a].textContent.slice(0, 8)} em cima de ${pecas[b].textContent.slice(0, 8)}`);
        const fundo = getComputedStyle(topo).backgroundColor;
        const noTitulo = contraste(getComputedStyle(titulo).color, fundo);
        if (noTitulo < 4.5) ruins.push(`${nome}: título ${noTitulo.toFixed(1)}`);
        const eb = getComputedStyle(botao);
        const noBotao = contraste(eb.color, eb.backgroundColor);
        if (noBotao < 4.5) ruins.push(`${nome}: botão ${noBotao.toFixed(1)}`);
        const separa = contraste(eb.backgroundColor, fundo);
        if (separa < 1.5) ruins.push(`${nome}: botão some no fundo ${separa.toFixed(1)}`);
      }
      return { n, ruins };
    });
    check(`${sensacoes.join(", ")}${cor ? `, ${cor}` : ""}: ${r.n} combinações`, r.ruins.length === 0, `${r.ruins.length} ruins${r.ruins.length ? `. ${r.ruins.slice(0, 6).join(" | ")}` : ""}`);
    if (FOTOS && (!cor || i === 0)) await pg.screenshot({ path: `${FOTOS}/galeria-${i}-${(cor ?? "propria").replace("#", "")}.png`, fullPage: true });
  }
}
check("sem erro na página", erros.length === 0, erros[0]?.slice(0, 160));
await browser.close();
console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);

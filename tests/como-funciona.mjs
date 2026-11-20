// Página "Como funciona": a conversa começando no topo (com o resto da página
// parado), a fila dos 8 passos presa no topo (começando e terminando no lugar),
// o fundo, a mensagem pronta do WhatsApp, a conversa do prazo, o primeiro mês,
// as dúvidas e as perguntas. Roda nos dois modos de animação (o
// Windows do Lucas está com "Mostrar animações" desligado).
// Uso: node tests/como-funciona.mjs [endereço]   (padrão: http://localhost:3005/como-funciona)

import { chromium } from "playwright-core";

const URL_PAGINA = process.argv[2] ?? "http://localhost:3005/como-funciona";
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
        `${rotulo}: os convites do WhatsApp dizem "pela página Como funciona"`,
        convites.length >= 5 && convites.every((l) => l.includes("pela página Como funciona")),
        `${convites.length} convites`,
      );
      check(`${rotulo}: só o contato do rodapé sem mensagem`, links.length - convites.length === 1, `${links.length - convites.length}`);

      // Fundo da hero: as etapas sobem e param no botão de pausar da hero.
      const coluna = page.locator(".subir").first();
      const subindo = await coluna.evaluate((el) => getComputedStyle(el).animationName + " " + getComputedStyle(el).animationPlayState);
      await page.getByRole("button", { name: "Pausar as animações" }).first().click();
      const parada = await coluna.evaluate((el) => getComputedStyle(el).animationPlayState);
      await page.getByRole("button", { name: "Continuar as animações" }).first().click();
      await rolarPara(0);
      check(`${rotulo}: o fundo da hero sobe e para no botão`, subindo === "subir running" && parada === "paused", `${subindo} → ${parada}`);

      // Topo: a conversa inteira, olhando também o resto da página.
      const amostras = [];
      const inicio = Date.now();
      while (Date.now() - inicio < 16_000) {
        amostras.push(
          await page.evaluate(() => ({
            mensagens: document.querySelectorAll("[data-mensagem]").length,
            digitando: !!document.querySelector("[data-conversa] .rounded-2xl.w-16"),
            proxima: Math.round(document.querySelector("[data-passos]").getBoundingClientRect().top + window.scrollY),
          })),
        );
        await page.waitForTimeout(200);
      }
      const contagens = new Set(amostras.map((a) => a.mensagens));
      check(`${rotulo}: a conversa mostra as 4 mensagens, uma por vez`, [0, 1, 2, 3, 4].every((n) => contagens.has(n)), [...contagens].sort().join(","));
      check(`${rotulo}: o "digitando" aparece antes das mensagens`, amostras.some((a) => a.digitando));
      const recomecou = amostras.findIndex((a) => a.mensagens === 4) < amostras.findLastIndex((a) => a.mensagens === 0);
      check(`${rotulo}: no fim, a conversa recomeça`, recomecou);
      const posicoes = new Set(amostras.map((a) => a.proxima));
      check(`${rotulo}: o resto da página fica parado durante a conversa`, posicoes.size === 1, [...posicoes].join(", "));

      const giro = () =>
        page.$eval("[data-conversa]", (el) => {
          const m = new DOMMatrix(getComputedStyle(el).transform);
          return Math.round(Math.asin(Math.max(-1, Math.min(1, m.m13))) * (180 / Math.PI));
        });
      await rolarPara(0);
      const giroTopo = Math.abs(await giro());
      await rolarPara(600);
      const giroRolado = Math.abs(await giro());
      check(`${rotulo}: inclinada no topo e de frente ao rolar`, giroTopo >= 10 && giroRolado <= 1, `${giroTopo}° → ${giroRolado}°`);

      // Os 8 passos: presa, começando e terminando no lugar.
      const { topo, altura } = await page.evaluate(() => {
        const s = document.querySelector("[data-passos]");
        return { topo: s.getBoundingClientRect().top + window.scrollY, altura: s.offsetHeight };
      });
      const fim = topo + altura - tela.height;
      const medir = () =>
        page.evaluate(() => {
          const secao = document.querySelector("[data-passos]");
          const palco = secao.firstElementChild.getBoundingClientRect();
          const cartoes = [...secao.querySelectorAll("[data-passo]")];
          const atual = cartoes.findIndex((c) => c.hasAttribute("data-atual"));
          return {
            palcoTopo: palco.top,
            palcoDireita: palco.right,
            tituloEsquerda: secao.querySelector("h2").getBoundingClientRect().left,
            primeiro: cartoes[0].getBoundingClientRect().toJSON(),
            ultimo: cartoes.at(-1).getBoundingClientRect().toJSON(),
            total: cartoes.length,
            atual,
          };
        });
      await rolarPara(topo);
      const a = await medir();
      check(`${rotulo}: 8 passos`, a.total === 8, `${a.total}`);
      check(`${rotulo}: no começo, presa e com o primeiro passo alinhado ao título`, Math.abs(a.palcoTopo) < 1 && Math.abs(a.primeiro.left - a.tituloEsquerda) < 2 && a.atual === 0, `topo ${a.palcoTopo}, cartão ${a.primeiro.left.toFixed(1)}, título ${a.tituloEsquerda.toFixed(1)}, atual ${a.atual}`);
      check(`${rotulo}: o cartão cabe na altura da tela`, a.primeiro.bottom <= tela.height && a.primeiro.top >= 56, `de ${a.primeiro.top.toFixed(0)} a ${a.primeiro.bottom.toFixed(0)}`);
      await rolarPara((topo + fim) / 2);
      const m = await medir();
      check(`${rotulo}: no meio, presa e num passo do meio`, Math.abs(m.palcoTopo) < 1 && m.atual > 1 && m.atual < 7, `atual ${m.atual}`);
      await rolarPara(fim);
      const f = await medir();
      const margem = f.palcoDireita - f.ultimo.right;
      check(`${rotulo}: no fim, o último passo inteiro, com a mesma margem do começo`, Math.abs(f.palcoTopo) < 1 && Math.abs(margem - a.tituloEsquerda) < 2 && f.atual === 7, `margem ${margem.toFixed(1)}, atual ${f.atual}`);
      await rolarPara(fim + 400);
      const depois = await medir();
      check(`${rotulo}: depois do fim, a seção solta`, depois.palcoTopo < -300, `${depois.palcoTopo.toFixed(0)}`);

      // A conversa do prazo e o primeiro mês: parados até a pessoa chegar.
      // Volta ao topo antes de recarregar: o Chrome devolve a rolagem de antes, e
      // a animação já começaria ao carregar.
      await rolarPara(0);
      await page.reload({ waitUntil: "networkidle" });
      await rolarPara(0);
      const antes = await page.evaluate(() => ({
        mensagens: document.querySelectorAll("[data-mensagem-vista]").length,
        dias: document.querySelectorAll("[data-aceso-dia]").length,
      }));
      await page.$eval("[data-prazo-conversa]", (el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForTimeout(3200);
      const mensagens = await page.$$eval("[data-prazo-conversa] p[data-mensagem-vista]", (ps) => ps.filter((p) => Number(getComputedStyle(p).opacity) > 0.95).length);
      const comData = await page.$eval("[data-prazo-conversa]", (el) => el.textContent.includes("Até quinta, 10/12"));
      await page.$eval("[data-primeiro-mes]", (el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForTimeout(2800);
      const mes = await page.evaluate(() => ({
        dias: document.querySelectorAll("[data-primeiro-mes] [data-aceso-dia]").length,
        marcos: document.querySelectorAll("[data-primeiro-mes] li[data-dia] svg").length,
        legenda: [...document.querySelectorAll("[data-primeiro-mes] [data-marco-visivel]")].filter((li) => Number(getComputedStyle(li).opacity) > 0.95).length,
      }));
      check(
        `${rotulo}: a conversa do prazo e o primeiro mês entram quando a pessoa chega`,
        antes.mensagens === 0 && antes.dias === 0 && mensagens === 4 && comData && mes.dias === 30 && mes.marcos === 7 && mes.legenda === 4,
        `antes ${antes.mensagens} mensagens e ${antes.dias} dias; depois ${mensagens} mensagens (data ${comData}), ${mes.dias} dias, ${mes.marcos} marcos, ${mes.legenda} na legenda`,
      );

      const blocos = await page.evaluate(() => ({
        pedidos: document.querySelectorAll("#o-que-pedimos li").length,
        duvidas: [...document.querySelectorAll("li p.font-heading")].filter((p) => p.textContent.startsWith("“")).length,
        perguntas: document.querySelectorAll("details").length,
      }));
      check(
        `${rotulo}: o que a gente pede (6 itens), as 4 dúvidas e as 6 perguntas`,
        blocos.pedidos === 6 && blocos.duvidas === 4 && blocos.perguntas === 6,
        JSON.stringify(blocos),
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

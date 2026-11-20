// Página de manutenção: o painel de situação conferindo item por item no topo
// (com o resto da página parado), o fundo, a linha do tempo e a mensagem pronta
// do WhatsApp. Roda nos dois modos de animação (o Windows do Lucas está com
// "Mostrar animações" desligado).
// Uso: node tests/manutencao.mjs [endereço]   (padrão: http://localhost:3005/manutencao)

import { chromium } from "playwright-core";

const URL_PAGINA = process.argv[2] ?? "http://localhost:3005/manutencao";
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
        `${rotulo}: os convites do WhatsApp dizem "pela página de manutenção"`,
        convites.length >= 5 && convites.every((l) => l.includes("pela página de manutenção")),
        `${convites.length} convites`,
      );
      check(`${rotulo}: só o contato do rodapé sem mensagem`, links.length - convites.length === 1, `${links.length - convites.length}`);

      // Fundo da hero: as conferências sobem e param no botão de pausar da hero.
      const coluna = page.locator(".subir").first();
      const subindo = await coluna.evaluate((el) => getComputedStyle(el).animationName + " " + getComputedStyle(el).animationPlayState);
      await page.getByRole("button", { name: "Pausar as animações" }).first().click();
      const parada = await coluna.evaluate((el) => getComputedStyle(el).animationPlayState);
      await page.getByRole("button", { name: "Continuar as animações" }).first().click();
      await rolarPara(0);
      check(`${rotulo}: o fundo da hero sobe e para no botão`, subindo === "subir running" && parada === "paused", `${subindo} → ${parada}`);

      // Topo: um ciclo inteiro da conferência, olhando também o resto da página.
      const amostras = [];
      const inicio = Date.now();
      while (Date.now() - inicio < 22_000) {
        amostras.push(
          await page.evaluate(() => ({
            conferidos: document.querySelectorAll("[data-conferido]").length,
            tudoCerto: Number(getComputedStyle([...document.querySelectorAll("[data-situacao] p")].at(-1)).opacity),
            site: document.querySelector("[data-site]").textContent,
            proxima: Math.round(document.querySelector("#como-contratar").getBoundingClientRect().top + window.scrollY),
          })),
        );
        await page.waitForTimeout(200);
      }
      const contagens = new Set(amostras.map((a) => a.conferidos));
      check(`${rotulo}: a conferência passa item por item, de 0 a 6`, [0, 1, 2, 3, 4, 5, 6].every((n) => contagens.has(n)), [...contagens].sort().join(","));
      const avisou = amostras.some((a) => a.conferidos === 6 && a.tudoCerto > 0.95);
      const escondido = amostras.some((a) => a.conferidos === 2 && a.tudoCerto < 0.05);
      check(`${rotulo}: "Tudo certo" só aparece com tudo conferido`, avisou && escondido, `aparece ${avisou}, escondido antes ${escondido}`);
      const sites = new Set(amostras.map((a) => a.site));
      check(`${rotulo}: depois entra o próximo cliente`, sites.size >= 2, [...sites].join(", "));
      const posicoes = new Set(amostras.map((a) => a.proxima));
      check(`${rotulo}: o resto da página fica parado enquanto confere`, posicoes.size === 1, [...posicoes].join(", "));

      const giro = () =>
        page.$eval("[data-situacao]", (el) => {
          const m = new DOMMatrix(getComputedStyle(el).transform);
          return Math.round(Math.asin(Math.max(-1, Math.min(1, m.m13))) * (180 / Math.PI));
        });
      await rolarPara(0);
      const giroTopo = Math.abs(await giro());
      await rolarPara(600);
      const giroRolado = Math.abs(await giro());
      check(`${rotulo}: inclinado no topo e de frente ao rolar`, giroTopo >= 10 && giroRolado <= 1, `${giroTopo}° → ${giroRolado}°`);

      // Enquanto você trabalha: a linha do tempo.
      const linha = await page.evaluate(() => {
        const r = document.querySelector("ol:has(> li[class*='md:text-center'])").getBoundingClientRect();
        return { topo: r.top + window.scrollY, fim: r.bottom + window.scrollY };
      });
      await rolarPara(linha.topo - tela.height * 0.75 - 80);
      const apagados = await page.$$eval("[data-aceso]", (e) => e.length);
      await rolarPara(linha.fim - tela.height * 0.5 + 80);
      const acesos = await page.$$eval("[data-aceso]", (e) => e.length);
      check(`${rotulo}: a linha do tempo acende os marcos`, apagados === 0 && acesos === 4, `${apagados} → ${acesos}`);

      // Quando algo dá errado e o resumo de 3 meses: parados até a pessoa chegar
      // (página recarregada: a rolagem anterior já passou por eles).
      // Volta ao topo antes de recarregar: o Chrome devolve a rolagem de antes, e
      // a animação já começaria ao carregar.
      await rolarPara(0);
      await page.reload({ waitUntil: "networkidle" });
      await rolarPara(0);
      const antes = await page.evaluate(() => ({
        passos: document.querySelectorAll("[data-passo-visivel]").length,
        numeros: [...document.querySelectorAll("[data-resumo] .tabular-nums")].map((n) => n.textContent).join(" "),
      }));
      await page.$eval("[data-incidente]", (el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForTimeout(3200);
      const incidente = await page.$$eval("[data-incidente] li", (lis) => lis.filter((li) => Number(getComputedStyle(li).opacity) > 0.95).length);
      await page.$eval("[data-resumo]", (el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForTimeout(2600);
      const numeros = await page.$$eval("[data-resumo] .tabular-nums", (ns) => ns.map((n) => n.textContent).join(" "));
      check(
        `${rotulo}: o exemplo de quando algo dá errado e o resumo de 3 meses entram quando a pessoa chega`,
        antes.passos === 0 && antes.numeros === "0 0 0" && incidente === 5 && numeros === "2.140 186 92",
        `antes ${antes.passos} passos e ${antes.numeros}; depois ${incidente} passos e ${numeros}`,
      );

      const blocos = await page.evaluate(() => ({
        riscos: [...document.querySelectorAll("h3")].filter((h) => ["O cadeado vence", "O domínio vence", "O botão quebra em silêncio", "A página cai"].includes(h.textContent)).length,
        caso: document.querySelectorAll("[data-conferencia-do-dia] li").length === 6,
        ajustes: document.body.innerText.includes("Cabe nos pequenos ajustes"),
        duvidas: [...document.querySelectorAll("li p.font-heading")].filter((p) => p.textContent.startsWith("“")).length,
        monitorada: document.body.innerText.includes("Monitorada 24 horas"),
      }));
      check(
        `${rotulo}: os 4 riscos com a conferência de todo dia, os pequenos ajustes, as 3 dúvidas e o monitoramento 24 horas`,
        blocos.riscos === 4 && blocos.caso && blocos.ajustes && blocos.duvidas === 3 && blocos.monitorada,
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

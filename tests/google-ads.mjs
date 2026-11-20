// Página de Google Ads: o anúncio se montando no topo, a lista que se marca, a
// linha do tempo, a verba correndo (com pausa) e a mensagem pronta do WhatsApp.
// Roda nos dois modos de animação (o Windows do Lucas está com "Mostrar
// animações" desligado).
// Uso: node tests/google-ads.mjs [endereço]   (padrão: http://localhost:3005/google-ads)

import { chromium } from "playwright-core";

const URL_PAGINA = process.argv[2] ?? "http://localhost:3005/google-ads";
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
      const topoDe = (seletor) =>
        page.evaluate((s) => {
          const r = document.querySelector(s).getBoundingClientRect();
          return { topo: r.top + window.scrollY, fim: r.bottom + window.scrollY };
        }, seletor);

      // WhatsApp: os convites com a mensagem desta página (o contato do rodapé
      // fica sem mensagem: serve também a quem já é cliente).
      const links = await page.$$eval('a[href^="https://wa.me/"]', (as) => as.map((a) => decodeURIComponent(a.href)));
      const convites = links.filter((l) => l.includes("?text="));
      check(
        `${rotulo}: os convites do WhatsApp (topo, menu, página, chamada final, rodapé) dizem "pela página de Google Ads"`,
        convites.length >= 5 && convites.every((l) => l.includes("pela página de Google Ads")),
        `${convites.length} convites`,
      );
      check(`${rotulo}: só o contato do rodapé sem mensagem`, links.length - convites.length === 1, `${links.length - convites.length}`);

      // Topo: a busca é digitada, o anúncio se monta e troca de cliente.
      await page.waitForSelector("[data-anuncio]", { timeout: 12_000 });
      const primeiro = await page.textContent("[data-anuncio]");
      const busca = await page.textContent("[data-busca]");
      check(`${rotulo}: a busca foi digitada e o anúncio apareceu`, busca.length > 5 && primeiro.includes("Patrocinado"), busca);
      await page.waitForFunction(
        (antes) => {
          const a = document.querySelector("[data-anuncio]");
          return a && !a.textContent.includes(antes);
        },
        primeiro.slice(0, 60).replace("Seu anúncio", "").replace("Patrocinado", "").slice(0, 20),
        { timeout: 15_000 },
      );
      check(`${rotulo}: o anúncio troca de cliente`, true);

      // O anúncio aparecendo e sumindo não pode empurrar a página (o Lucas viu
      // as seções descendo e voltando enquanto lia).
      const posicoes = new Set();
      for (let i = 0; i < 50; i++) {
        posicoes.add(Math.round(await page.evaluate(() => document.querySelector("#comeco").getBoundingClientRect().top + window.scrollY)));
        await page.waitForTimeout(250);
      }
      check(`${rotulo}: o resto da página fica parado enquanto o anúncio troca`, posicoes.size === 1, [...posicoes].join(", "));

      // Fundo da hero: as buscas sobem e param no botão de pausar da hero.
      const coluna = page.locator(".subir").first();
      const subindo = await coluna.evaluate((el) => getComputedStyle(el).animationName + " " + getComputedStyle(el).animationPlayState);
      await page.getByRole("button", { name: "Pausar as animações" }).first().click();
      const parada = await coluna.evaluate((el) => getComputedStyle(el).animationPlayState);
      await page.getByRole("button", { name: "Continuar as animações" }).first().click();
      check(`${rotulo}: o fundo da hero sobe e para no botão`, subindo === "subir running" && parada === "paused", `${subindo} → ${parada}`);

      const giro = () =>
        page.$eval("[data-resultados]", (el) => {
          const m = new DOMMatrix(getComputedStyle(el).transform);
          return Math.round(Math.asin(Math.max(-1, Math.min(1, m.m13))) * (180 / Math.PI));
        });
      await rolarPara(0);
      const giroTopo = Math.abs(await giro());
      await rolarPara(600);
      const giroRolado = Math.abs(await giro());
      check(`${rotulo}: inclinada no topo e de frente ao rolar`, giroTopo >= 10 && giroRolado <= 1, `${giroTopo}° → ${giroRolado}°`);

      // Lista que se marca.
      const lista = await topoDe("#comeco ol");
      await rolarPara(lista.topo - tela.height * 0.7 - 80);
      const antes = await page.$$eval("#comeco [data-feito]", (e) => e.length);
      await rolarPara((lista.topo + lista.fim) / 2 - tela.height * 0.62);
      const meio = await page.$$eval("#comeco [data-feito]", (e) => e.length);
      await rolarPara(lista.fim - tela.height * 0.55 + 80);
      const depois = await page.$$eval("#comeco [data-feito]", (e) => e.length);
      check(`${rotulo}: a lista se marca com a rolagem`, antes === 0 && meio > 0 && meio < 6 && depois === 6, `${antes} → ${meio} → ${depois}`);

      // Linha do tempo.
      const linha = await topoDe("ol:has([data-aceso]), ol:has(li > span + div > p.font-mono)");
      await rolarPara(linha.topo - tela.height * 0.75 - 80);
      const apagados = await page.$$eval("[data-aceso]", (e) => e.length);
      await rolarPara(linha.fim - tela.height * 0.5 + 80);
      const acesos = await page.$$eval("[data-aceso]", (e) => e.length);
      check(`${rotulo}: a linha do tempo acende os marcos`, apagados === 0 && acesos === 4, `${apagados} → ${acesos}`);

      // O anúncio por dentro: cada parte acende com a rolagem, a mesma no
      // anúncio e na explicação, e cada explicação fica à vista enquanto acesa
      // (no celular, abaixo do anúncio preso).
      const partes = await page.evaluate(() => {
        const r = document.querySelector("ol:has([data-ativa])").getBoundingClientRect();
        return { topo: r.top + window.scrollY, fim: r.bottom + window.scrollY };
      });
      const vistas = [];
      for (let k = 0; k <= 20; k++) {
        await rolarPara(partes.topo - tela.height * 0.65 + ((partes.fim - partes.topo) * k) / 20);
        vistas.push(
          await page.evaluate(() => {
            const itens = [...document.querySelectorAll("ol:has([data-ativa]) > li")];
            const ativa = itens.findIndex((li) => li.hasAttribute("data-ativa"));
            const noAnuncio = [...document.querySelectorAll("[data-parte-anuncio]")].findIndex((p) => p.className.includes("ring-brand"));
            const anuncio = document.querySelector("[data-anuncio-grande]").getBoundingClientRect();
            const item = itens[ativa].getBoundingClientRect();
            return { ativa, noAnuncio, aVista: item.top >= anuncio.bottom - 4 || item.left >= anuncio.right - 4, itemTopo: Math.round(item.top), anuncioFim: Math.round(anuncio.bottom) };
          }),
        );
      }
      const acesas = new Set(vistas.map((v) => v.ativa));
      check(`${rotulo}: o anúncio por dentro acende as 5 partes, uma por vez`, [0, 1, 2, 3, 4].every((n) => acesas.has(n)), [...acesas].join(","));
      check(`${rotulo}: a parte acesa no anúncio é a mesma da explicação`, vistas.every((v) => v.ativa === v.noAnuncio), vistas.map((v) => `${v.ativa}/${v.noAnuncio}`).join(" "));
      // Cada explicação, em algum momento, acesa e inteira à vista (no celular,
      // a última passa por baixo do anúncio preso só depois de lida, quando a
      // seção já está acabando).
      const lidas = [0, 1, 2, 3, 4].filter((n) => vistas.some((v) => v.ativa === n && v.aVista));
      check(`${rotulo}: cada explicação fica acesa e à vista, fora de trás do anúncio`, lidas.length === 5, `à vista: ${lidas.join(",")}`);

      // O resumo do mês e o diagnóstico: parados até a pessoa chegar; depois, os
      // números sobem até o valor e as barras enchem.
      const lerResumo = () =>
        page.$eval("[data-resumo]", (r) => ({
          numeros: [...r.querySelectorAll(".tabular-nums")].map((n) => n.textContent),
          barras: [...r.querySelectorAll("[data-barra]")].map((b) => new DOMMatrix(getComputedStyle(b).transform).a.toFixed(2)),
        }));
      // Página recarregada: a rolagem das verificações anteriores já passou pelo
      // resumo, e ele anima uma vez só.
      // Volta ao topo antes de recarregar: o Chrome devolve a rolagem de antes, e
      // a animação já começaria ao carregar.
      await rolarPara(0);
      await page.reload({ waitUntil: "networkidle" });
      await rolarPara(0);
      const resumoAntes = await lerResumo();
      await page.$eval("[data-resumo]", (r) => r.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForTimeout(2600);
      const resumoDepois = await lerResumo();
      check(
        `${rotulo}: o resumo parado antes e, ao chegar, números até o valor e barras cheias`,
        resumoAntes.numeros.every((n) => n === "0") &&
          resumoAntes.barras.every((b) => b === "0.00") &&
          resumoDepois.numeros.join(" ") === "4.812 386 41" &&
          resumoDepois.barras.join(" ") === "0.88 0.56 0.30",
        `${resumoAntes.numeros.join("/")} → ${resumoDepois.numeros.join("/")}, barras ${resumoDepois.barras.join("/")}`,
      );
      await page.$eval("[data-diagnostico]", (d) => d.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForTimeout(2600);
      const diag = await page.$eval("[data-diagnostico]", (d) => ({
        primeiro: d.querySelector(".tabular-nums").textContent,
        indicada: d.querySelector("[data-verba-indicada]").className.includes("bg-brand"),
      }));
      check(`${rotulo}: o diagnóstico conta a procura e escolhe a verba indicada`, diag.primeiro === "1.300" && diag.indicada, JSON.stringify(diag));

      const blocos = await page.evaluate(() => ({
        diagnostico: document.body.innerText.includes("Diagnóstico · exemplo"),
        resumo: document.body.innerText.includes("Resumo do mês · Ampère Elétrica"),
        objecoes: [...document.querySelectorAll("li p.font-heading")].filter((p) => p.textContent.startsWith("“")).length,
      }));
      check(`${rotulo}: o diagnóstico de exemplo, o resumo do mês e as 4 objeções`, blocos.diagnostico && blocos.resumo && blocos.objecoes === 4, JSON.stringify(blocos));

      // A verba correndo e a pausa.
      const verba = page.locator(".fluxo").first();
      await verba.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      const correndo = await verba.evaluate((el) => getComputedStyle(el).animationName + " " + getComputedStyle(el).animationPlayState);
      await page.locator("section.dark button:has(.sr-only)").click();
      const pausada = await verba.evaluate((el) => getComputedStyle(el).animationPlayState);
      check(`${rotulo}: a verba corre e o botão pausa`, correndo === "fluxo running" && pausada === "paused", `${correndo} → ${pausada}`);

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

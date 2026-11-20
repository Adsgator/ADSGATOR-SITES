// Página de landing page: a página se montando no topo (com o roteiro marcado
// ao lado, a tela descendo e o resto da página parado), a linha do tempo, o
// portfólio e a mensagem pronta do WhatsApp. Roda nos dois modos de animação
// (o Windows do Lucas está com "Mostrar animações" desligado).
// Uso: node tests/landing-page.mjs [endereço]   (padrão: http://localhost:3005/landing-page)

import { chromium } from "playwright-core";

const URL_PAGINA = process.argv[2] ?? "http://localhost:3005/landing-page";
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
        `${rotulo}: os convites do WhatsApp dizem "pela página de landing page, e quero a minha página"`,
        convites.length >= 6 && convites.every((l) => l.includes("pela página de landing page, e quero a minha página")),
        `${convites.length} convites`,
      );
      check(`${rotulo}: só o contato do rodapé sem mensagem`, links.length - convites.length === 1, `${links.length - convites.length}`);

      // Fundo da hero: as peças sobem.
      const coluna = page.locator(".subir").first();
      const subindo = await coluna.evaluate((el) => getComputedStyle(el).animationName + " " + getComputedStyle(el).animationPlayState);
      await rolarPara(0);
      check(`${rotulo}: o fundo da hero sobe`, subindo === "subir running", `${subindo}`);

      // Topo: um ciclo inteiro da montagem, olhando também o resto da página.
      const amostras = [];
      let conferidoMeio = null;
      const inicio = Date.now();
      while (Date.now() - inicio < 26_000) {
        const a = await page.evaluate(() => {
          const pagina = document.querySelector("[data-montando] [data-parte]").parentElement.parentElement;
          const tela = pagina.parentElement.getBoundingClientRect();
          const partes = [...pagina.querySelectorAll("[data-parte]")].map((p) => Number(getComputedStyle(p.lastElementChild.previousElementSibling).opacity));
          const rodape = pagina.querySelector('[data-parte="8"]').getBoundingClientRect();
          return {
            feitos: document.querySelectorAll("[data-roteiro-feito]").length,
            descida: new DOMMatrix(getComputedStyle(pagina).transform).m42,
            site: document.querySelector("[data-montando] p.font-mono").textContent,
            proxima: Math.round(document.querySelector("#como-fica-pronta").getBoundingClientRect().top + window.scrollY),
            partes,
            rodapeNaTela: rodape.top >= tela.top - 2 && rodape.bottom <= tela.bottom + 2,
          };
        });
        amostras.push(a);
        // Com 2 partes montadas e as transições terminadas: as 2 primeiras à
        // vista, a última ainda escondida.
        if (!conferidoMeio && a.feitos === 2 && amostras.filter((x) => x.feitos === 2).length >= 4) conferidoMeio = a.partes;
        await page.waitForTimeout(200);
      }
      const contagens = new Set(amostras.map((a) => a.feitos));
      check(`${rotulo}: o roteiro se marca de 0 a 9`, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].every((n) => contagens.has(n)), [...contagens].sort((a, b) => a - b).join(","));
      // O defeito visto pelo Lucas: a animação não chegava ao rodapé.
      check(`${rotulo}: com tudo montado, o rodapé aparece na tela do celular`, amostras.some((a) => a.feitos === 9 && a.rodapeNaTela));
      check(
        `${rotulo}: o que não entrou fica escondido no lugar`,
        conferidoMeio && conferidoMeio[0] > 0.95 && conferidoMeio[1] > 0.95 && conferidoMeio[4] < 0.05,
        conferidoMeio ? conferidoMeio.map((o) => o.toFixed(2)).join(" ") : "não pegou o meio",
      );
      const desceu = amostras.some((a) => a.feitos >= 3 && a.feitos < 9 && a.descida < -50);
      const voltou = amostras.some((a) => a.feitos === 9 && Math.abs(a.descida) < 1);
      check(`${rotulo}: a tela desce enquanto monta e volta ao topo pronta`, desceu && voltou, `desceu ${desceu}, voltou ${voltou}`);
      const sites = new Set(amostras.map((a) => a.site));
      check(`${rotulo}: depois entra o próximo cliente`, sites.size >= 2, [...sites].join(", "));
      const posicoes = new Set(amostras.map((a) => a.proxima));
      check(`${rotulo}: o resto da página fica parado enquanto monta`, posicoes.size === 1, [...posicoes].join(", "));

      const giro = () =>
        page.$eval("[data-montando]", (el) => {
          const m = new DOMMatrix(getComputedStyle(el).transform);
          return Math.round(Math.asin(Math.max(-1, Math.min(1, m.m13))) * (180 / Math.PI));
        });
      await rolarPara(0);
      const giroTopo = Math.abs(await giro());
      await rolarPara(600);
      const giroRolado = Math.abs(await giro());
      check(`${rotulo}: inclinada no topo e de frente ao rolar`, giroTopo >= 10 && giroRolado <= 1, `${giroTopo}° → ${giroRolado}°`);

      // Como fica pronta: a linha do tempo.
      const linha = await page.evaluate(() => {
        const r = document.querySelector("#como-fica-pronta ol:has(> li[class*='md:text-center'])").getBoundingClientRect();
        return { topo: r.top + window.scrollY, fim: r.bottom + window.scrollY };
      });
      await rolarPara(linha.topo - tela.height * 0.75 - 80);
      const apagados = await page.$$eval("#como-fica-pronta [data-aceso]", (e) => e.length);
      await rolarPara(linha.fim - tela.height * 0.5 + 80);
      const acesos = await page.$$eval("#como-fica-pronta [data-aceso]", (e) => e.length);
      check(`${rotulo}: a linha do tempo acende os marcos`, apagados === 0 && acesos === 5, `${apagados} → ${acesos}`);

      // A página por dentro: as 5 partes acendem, a contornada no celular é a da
      // explicação, e cada explicação fica à vista enquanto acesa.
      const lista = await page.evaluate(() => {
        const r = document.querySelector("ol:has([data-ativa])").getBoundingClientRect();
        return { topo: r.top + window.scrollY, fim: r.bottom + window.scrollY };
      });
      const vistas = [];
      for (let k = 0; k <= 30; k++) {
        await rolarPara(lista.topo - tela.height * 0.65 + ((lista.fim - lista.topo) * k) / 30);
        vistas.push(
          await page.evaluate(() => {
            const itens = [...document.querySelectorAll("ol:has([data-ativa]) > li")];
            const ativa = itens.findIndex((li) => li.hasAttribute("data-ativa"));
            const destaque = Number(document.querySelector("[data-pagina-por-dentro] [data-destaque]")?.dataset.parte ?? -1);
            const celular = document.querySelector("[data-pagina-por-dentro]").getBoundingClientRect();
            const item = itens[ativa].getBoundingClientRect();
            return { ativa, destaque, aVista: item.top >= celular.bottom - 4 || item.left >= celular.right - 4 };
          }),
        );
      }
      const acesas = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((n) => vistas.some((v) => v.ativa === n && v.aVista));
      check(`${rotulo}: a página por dentro acende as 9 partes, cada uma à vista`, acesas.length === 9, `à vista: ${acesas.join(",")}`);
      check(`${rotulo}: a parte contornada no celular é a da explicação`, vistas.every((v) => v.ativa === v.destaque), vistas.map((v) => `${v.ativa}/${v.destaque}`).join(" "));

      // O roteiro de exemplo: parado até a pessoa chegar; depois, as seções se
      // marcam e o "Aprovado" entra (página recarregada: a rolagem anterior já
      // passou por ele).
      // Volta ao topo antes de recarregar: o Chrome devolve a rolagem de antes, e
      // a animação já começaria ao carregar.
      await rolarPara(0);
      await page.reload({ waitUntil: "networkidle" });
      await rolarPara(0);
      const antesRoteiro = await page.$eval("[data-roteiro]", (r) => r.hasAttribute("data-apareceu"));
      await page.$eval("[data-roteiro]", (r) => r.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForTimeout(2800);
      const roteiro = await page.$eval("[data-roteiro]", (r) => ({
        marcadas: r.querySelectorAll("[data-secao-marcada]").length,
        aprovado: Number(getComputedStyle(r.querySelector("[data-aprovado]")).opacity),
      }));
      check(
        `${rotulo}: o roteiro se marca e mostra "Aprovado" quando a pessoa chega`,
        !antesRoteiro && roteiro.marcadas === 9 && roteiro.aprovado > 0.95,
        `antes ${antesRoteiro}, ${roteiro.marcadas} seções, aprovado ${roteiro.aprovado}`,
      );

      const duvidas = await page.$$eval("li p.font-heading", (ps) => ps.filter((p) => p.textContent.startsWith("“")).length);
      check(`${rotulo}: as 4 dúvidas mais comuns`, duvidas === 4, `${duvidas}`);

      const cartoes = await page.$$eval("[data-portfolio] [data-cartao]", (e) => e.length);
      check(`${rotulo}: o portfólio está na página`, cartoes === 5, `${cartoes} páginas`);

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

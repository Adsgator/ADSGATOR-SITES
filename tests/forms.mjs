// Testes de forms.adsgator.com.br, com cliques reais no Chrome instalado.
// Local (npm run dev ou npm start): node tests/forms.mjs
// Em produção: FORMS=https://forms.adsgator.com.br WWW=https://www.adsgator.com.br node tests/forms.mjs
// O teste abre o formulário e avança até a primeira pergunta; não responde nem
// envia nada, para não criar resposta no respondi.
import { chromium } from "playwright-core";

const PORTA_LOCAL = process.env.PORTA ?? "3000";
const FORMS = process.env.FORMS ?? `http://forms.adsgator.com.br:${PORTA_LOCAL}`;
const WWW = process.env.WWW ?? `http://localhost:${PORTA_LOCAL}`;
const local = !process.env.FORMS;

const resultados = [];
const check = (nome, ok, extra = "") =>
  resultados.push(`${ok ? "PASSOU" : "FALHOU"} | ${nome}${extra ? " | " + extra : ""}`);

const browser = await chromium.launch({
  channel: "chrome",
  // Local: o Chrome manda o endereço de forms. para o servidor deste computador.
  args: local ? ["--host-resolver-rules=MAP forms.adsgator.com.br 127.0.0.1"] : [],
});

try {
  for (const [nome, viewport, celular] of [
    ["celular", { width: 390, height: 844 }, true],
    ["computador", { width: 1366, height: 768 }, false],
  ]) {
    const contexto = await browser.newContext({ viewport, isMobile: celular, hasTouch: celular });
    const pagina = await contexto.newPage();
    const bloqueios = [];
    pagina.on("console", (m) => {
      if (m.type() === "error" && /Content Security Policy|Refused to/i.test(m.text())) {
        bloqueios.push(m.text().slice(0, 160));
      }
    });

    // O endereço com a barra no fim é o que já foi enviado a clientes.
    const resposta = await pagina.goto(`${FORMS}/briefing-google-ads/`, { waitUntil: "networkidle" });
    const cabecalhos = resposta.headers();
    check(`${nome}: o endereço enviado abre`, resposta.status() === 200, String(resposta.status()));
    check(`${nome}: fora do Google`, /noindex/.test(cabecalhos["x-robots-tag"] ?? ""));
    check(`${nome}: CSP libera só o respondi`, /frame-src https:\/\/form\.respondi\.app/.test(cabecalhos["content-security-policy"] ?? ""));

    const quadro = await pagina.waitForSelector("iframe.respondi-iframe", { timeout: 15000 }).catch(() => null);
    check(`${nome}: formulário incorporado aparece`, Boolean(quadro));
    if (quadro) {
      const caixa = await quadro.boundingBox();
      check(
        `${nome}: formulário ocupa a tela toda, sem rolagem`,
        caixa?.width === viewport.width && caixa?.height === viewport.height &&
          (await pagina.evaluate(() => document.documentElement.scrollHeight <= innerHeight)),
        JSON.stringify(caixa),
      );
      const conteudo = await quadro.contentFrame();
      await conteudo.getByText("Como usamos estas informações").first().waitFor({ timeout: 15000 });
      await conteudo.getByText("Continuar").first().click();
      await conteudo.getByText("Qual é, em média, o preço dos seus serviços?").first().waitFor({ timeout: 10000 });
      check(`${nome}: clique em Continuar leva à primeira pergunta`, true);
    }
    check(`${nome}: nada bloqueado pela CSP`, bloqueios.length === 0, bloqueios.join(" ; "));
    await contexto.close();
  }

  const contexto = await browser.newContext();
  const pagina = await contexto.newPage();

  const raiz = await pagina.goto(`${FORMS}/`, { waitUntil: "domcontentloaded" }).catch(() => null);
  const finalRaiz = pagina.url();
  check("a raiz de forms. leva ao site", Boolean(raiz) && !finalRaiz.includes("forms.adsgator"), finalRaiz);

  // O resto do site continua com a CSP fechada e pode aparecer no Google.
  const site = await pagina.goto(WWW, { waitUntil: "domcontentloaded" });
  const cabecalhosSite = site.headers();
  check("o site não libera o respondi", !/respondi/.test(cabecalhosSite["content-security-policy"] ?? ""));
  check("o site continua liberado para o Google", !cabecalhosSite["x-robots-tag"]);
  await contexto.close();
} catch (erro) {
  check("o teste chegou ao fim", false, erro.message.split("\n")[0]);
} finally {
  await browser.close();
}

console.log(resultados.join("\n"));
const falhas = resultados.filter((r) => r.startsWith("FALHOU")).length;
console.log(`\n${resultados.length - falhas} de ${resultados.length} passaram`);
process.exit(falhas ? 1 : 0);

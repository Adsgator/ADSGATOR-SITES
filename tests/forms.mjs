// Testes de forms.adsgator.com.br, com cliques reais no Chrome instalado.
// Local (npm run dev ou npm start): node tests/forms.mjs
// Em produção: FORMS=https://forms.adsgator.com.br WWW=https://www.adsgator.com.br node tests/forms.mjs
// Não começa nenhum briefing: o ponta a ponta, com o painel, é o tests/briefing-site.mts de lá.
import { chromium } from "playwright-core";

const PORTA_LOCAL = process.env.PORTA ?? "3000";
const FORMS = process.env.FORMS ?? `http://forms.localhost:${PORTA_LOCAL}`;
const WWW = process.env.WWW ?? `http://localhost:${PORTA_LOCAL}`;

const resultados = [];
const check = (nome, ok, extra = "") =>
  resultados.push(`${ok ? "PASSOU" : "FALHOU"} | ${nome}${extra ? " | " + extra : ""}`);

const browser = await chromium.launch({
  channel: "chrome",
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

    // Os endereços com a barra no fim são os que já foram enviados a clientes.
    for (const caminho of ["/briefing-google-ads/", "/briefing-pro/"]) {
      const resposta = await pagina.goto(`${FORMS}${caminho}`, { waitUntil: "networkidle" });
      const cabecalhos = resposta.headers();
      check(`${nome}: ${caminho} abre`, resposta.status() === 200, String(resposta.status()));
      check(`${nome}: ${caminho} fora do Google`, /noindex/.test(cabecalhos["x-robots-tag"] ?? ""));
      check(`${nome}: ${caminho} com a CSP fechada`, !/respondi|google/.test(cabecalhos["content-security-policy"] ?? "google"));
      await pagina.getByRole("button", { name: "Continuar" }).click();
      check(`${nome}: ${caminho} pede o nome e o WhatsApp`, await pagina.getByText("Escreva o seu nome.").isVisible());
      check(`${nome}: ${caminho} sem medição`, await pagina.evaluate(() => !window.dataLayer));
    }
    for (const antigo of ["/briefing-estilo-e-sensacoes/", "/briefing-landing-page-pro/"]) {
      await pagina.goto(`${FORMS}${antigo}`);
      check(`${nome}: ${antigo} leva ao da página`, /\/briefing-pro$/.test(pagina.url()), pagina.url());
    }
    await pagina.goto(`${FORMS}/um-briefing-antigo/`);
    check(`${nome}: endereço que não existe mais, um recado com o WhatsApp`, await pagina.getByText("Este endereço mudou").isVisible() && await pagina.getByRole("link", { name: "Chamar no WhatsApp" }).isVisible());
    check(`${nome}: sem rolagem lateral`, await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    check(`${nome}: nada bloqueado pela CSP`, bloqueios.length === 0, bloqueios.join(" ; "));
    await contexto.close();
  }

  const contexto = await browser.newContext();
  const pagina = await contexto.newPage();

  const raiz = await pagina.goto(`${FORMS}/`, { waitUntil: "domcontentloaded" }).catch(() => null);
  const finalRaiz = pagina.url();
  check("a raiz de forms. leva ao site", Boolean(raiz) && !new URL(finalRaiz).hostname.startsWith("forms."), finalRaiz);

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

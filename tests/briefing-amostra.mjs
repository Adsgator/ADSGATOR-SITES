// A amostra do briefing (plano geral, Parte 5), com cliques reais, no computador e no
// celular, com "reduzir animações" ligado e desligado: responder do começo ao fim, as
// perguntas que aparecem e somem, sair no meio e voltar, recomeçar, rever, mudar,
// enviar e os 4 números em outro aparelho. Nada sai do navegador.
// Uso: node tests/briefing-amostra.mjs [endereço] [pasta das fotos]
//   padrão: http://localhost:3005 (o next dev precisa estar aberto)
import { chromium } from "playwright-core";

const SITE = process.argv[2] ?? "http://localhost:3005";
const FOTOS = process.argv[3];
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}

const LONGO = "Uma resposta de teste, com mais de vinte letras, no jeito de quem conta.";
const browser = await chromium.launch({ channel: "chrome" });

const titulo = (pg) => pg.locator("[data-tela] [data-titulo]").last();
async function tela(pg) {
  await pg.waitForTimeout(650);
  return pg.locator("[data-tela]").last().getAttribute("data-tela");
}
const continuar = (pg) => pg.locator('[data-tela] button:has-text("Continuar"):visible').last().click();

/** Responde a pergunta que está na tela, do jeito que uma pessoa faria. */
async function responder(pg, escolhas = {}) {
  const t = (await titulo(pg).innerText()).trim();
  const area = pg.locator("form").last();
  const escolha = escolhas[t];
  if (escolha) {
    for (const o of [escolha].flat()) await area.getByText(o, { exact: true }).first().click();
  } else if (await area.getByText("Sim, é isso mesmo").count()) {
    await area.getByText("Sim, é isso mesmo").click();
  } else if (await area.getByRole("switch").count()) {
    const chave = area.getByRole("switch").first();
    if ((await chave.getAttribute("aria-checked")) === "false") await chave.click();
  } else if (await area.locator('[role="radio"]').count()) {
    await area.locator('[role="radio"]').first().click();
  } else if (await area.locator('[role="checkbox"]').count()) {
    const marcadas = await area.locator('[role="checkbox"][aria-checked="true"]').count();
    if (!marcadas) for (const i of [0, 1]) await area.locator('[role="checkbox"]').nth(i).click();
  } else if (await area.locator("[aria-expanded]").count()) {
    await area.locator("[aria-expanded]").first().click();
    await area.locator("textarea").first().fill(LONGO);
  } else if (await area.locator("textarea").count()) {
    for (const c of await area.locator("textarea").all()) await c.fill(LONGO);
  } else if (await area.getByText("Cidade", { exact: false }).count() || (await area.locator('input[aria-label="Cidade, bairro ou estado"]').count())) {
    const campo = area.locator('input[aria-label="Cidade, bairro ou estado"]');
    await campo.fill("Cidade do Teste");
    await campo.press("Enter");
  } else {
    await area.locator("input").first().fill("@teste");
  }
  return t;
}

/** Passa de uma pergunta para a próxima, com o botão quando a escolha não avançou sozinha. */
async function avancar(pg, escolhas) {
  const antes = await responder(pg, escolhas);
  await pg.waitForTimeout(900);
  const mudou = (await titulo(pg).innerText().catch(() => "")).trim() !== antes;
  if (!mudou) await continuar(pg);
  return antes;
}

async function ateORevisao(pg, escolhas = {}, parar = () => false) {
  const vistas = [];
  for (let i = 0; i < 60; i++) {
    const t = await tela(pg);
    if (t === "revisao" || parar(vistas)) return vistas;
    if (t === "passo") {
      if (FOTOS && pg.foto) await pg.screenshot({ path: `${FOTOS}/${pg.foto}-passo-${vistas.length}.png` });
      await continuar(pg);
    } else {
      if (FOTOS && pg.foto) {
        await pg.screenshot({ path: `${FOTOS}/${pg.foto}-${String(vistas.length + 1).padStart(2, "0")}.png` });
      }
      const largura = await pg.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (largura > 0) check(`sem rolagem lateral em "${(await titulo(pg).innerText()).trim()}"`, false, `${largura}px`);
      vistas.push(await avancar(pg, escolhas));
    }
  }
  check("chegou à revisão", false, vistas.at(-1));
  return vistas;
}

async function nova(opcoes = {}) {
  const contexto = await browser.newContext({ viewport: { width: 1366, height: 800 }, ...opcoes });
  const pg = await contexto.newPage();
  pg.erros = [];
  pg.fora = [];
  pg.on("console", (m) => m.type() === "error" && pg.erros.push(m.text()));
  pg.on("pageerror", (e) => pg.erros.push(String(e)));
  return pg;
}
const CELULAR = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 };

for (const [nome, opcoes] of [
  ["computador", { reducedMotion: "no-preference" }],
  ["celular, animações reduzidas", { ...CELULAR, reducedMotion: "reduce" }],
]) {
  console.log(`\n# Do começo ao fim, ${nome}`);
  const pg = await nova(opcoes);
  pg.foto = nome.startsWith("comp") ? "pc" : "cel";
  await pg.goto(`${SITE}/forms/amostra/trabalhista`);
  await pg.waitForSelector("[data-cena]");
  await pg.evaluate(() => document.querySelector("[data-cena]").scrollIntoView({ block: "center" }));
  await pg.waitForTimeout(1600);
  const cena = Number(await pg.locator("[data-cena]").getAttribute("data-cena"));
  await pg.waitForTimeout(6200);
  check("a cena da abertura anda e termina", cena > 0 && Number(await pg.locator("[data-cena]").getAttribute("data-cena")) === 7);
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${pg.foto}-00-abertura.png`, fullPage: true });
  await pg.getByRole("button", { name: "Começar" }).click();
  await tela(pg);

  // Sem resposta, não passa; e diz o porquê.
  await continuar(pg);
  check("sem resposta não passa", /Confirme ou escreva/.test(await pg.locator("[data-erro]").last().innerText()));

  const vistas = await ateORevisao(pg, {
    "Como você atende?": ["Por vídeo ou telefone"],
    "Quem você defende?": ["O trabalhador"],
    "Você já tem um endereço de site?": ["Já tenho"],
  });
  console.log(`   ${vistas.length} perguntas`);
  check("no máximo 25 telas de pergunta", vistas.length <= 25, vistas.length);
  check("só por vídeo, não pergunta o endereço", !vistas.includes("O escritório fica aqui?"));
  check("por vídeo, pergunta de onde são", vistas.includes("Por vídeo, você atende quem é de onde?"));
  check("trabalhador, não pergunta de empresa", !vistas.some((v) => /empresa/.test(v)));
  check("tem domínio, pergunta qual", vistas.includes("Qual é o endereço?"));
  check("tem domínio, não sugere outro", !vistas.includes("Que tal este endereço?"));
  check("100%", (await pg.locator("[data-porcento]").getAttribute("data-porcento")) === "100");
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${pg.foto}-revisao.png`, fullPage: true });

  // Mudar na revisão e voltar a ela, com a pergunta nova que apareceu.
  await pg.locator('[data-revisao="lado"] button').click();
  await tela(pg);
  await pg.locator("form").last().getByText("Os dois", { exact: true }).click();
  await pg.waitForTimeout(1200);
  check("mudar volta à revisão", (await tela(pg)) === "revisao");
  check("a mudança abriu perguntas que faltam", (await pg.getByText("Ainda sem resposta").count()) === 1, `${await pg.getByText("Ainda sem resposta").count()}`);
  for (let i = 0; i < 2; i++) {
    await pg.getByRole("button", { name: "Responder o que falta" }).click();
    await tela(pg);
    const antes = await responder(pg);
    await pg.waitForTimeout(900);
    if ((await titulo(pg).innerText()).trim() === antes) await pg.getByRole("button", { name: "Pronto" }).last().click();
    await tela(pg);
  }
  await pg.getByRole("button", { name: "Enviar as respostas" }).click();
  check("envia", (await tela(pg)) === "fim");
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${pg.foto}-fim.png`, fullPage: true });
  await pg.reload();
  check("depois de enviado, abre no fim", (await tela(pg)) === "fim");
  check("sem erro no console", pg.erros.length === 0, pg.erros[0]?.slice(0, 160));
  await pg.context().close();
}

console.log("\n# Sair no meio e voltar (celular)");
{
  const pg = await nova(CELULAR);
  await pg.goto(`${SITE}/forms/amostra/adestramento`);
  await pg.getByRole("button", { name: "Começar" }).click();
  const vistas = await ateORevisao(pg, { "Onde acontecem as aulas?": ["Na casa do cliente", "O cliente traz o cão até mim"] }, (v) => v.length >= 9);
  check("os dois jeitos, pergunta o endereço e as cidades", vistas.includes("O cliente leva o cão até aqui?") && vistas.includes("Em quais cidades ou bairros você vai até a casa?"));
  await tela(pg);
  const parou = (await titulo(pg).innerText()).trim();

  // O Voltar do celular anda dentro do briefing.
  await pg.goBack();
  await tela(pg);
  check("o Voltar do celular vai à pergunta anterior", (await titulo(pg).innerText()).trim() === vistas.at(-1), await titulo(pg).innerText());
  await pg.goForward();
  await tela(pg);

  // Fecha a aba e abre o link de novo.
  const outra = await pg.context().newPage();
  await pg.close();
  await outra.goto(`${SITE}/forms/amostra/adestramento`);
  check("quem volta vê o resumo", (await tela(outra)) === "volta");
  check("diz quantas respondeu", /9 de \d+/.test(await outra.locator("main").innerText()), (await outra.locator("main").innerText()).match(/\d+ de \d+/)?.[0]);
  if (FOTOS) await outra.screenshot({ path: `${FOTOS}/cel-volta.png`, fullPage: true });
  await outra.getByRole("button", { name: "Continuar de onde parei" }).click();
  await tela(outra);
  check("continua na pergunta em que parou", (await titulo(outra).innerText()).trim() === parou, parou);

  // Ver o que já respondeu, sem deixar enviar faltando.
  await outra.reload();
  await outra.getByRole("button", { name: "Rever o que já respondi" }).click();
  await tela(outra);
  check("faltando resposta, não tem Enviar", (await outra.getByRole("button", { name: "Enviar as respostas" }).count()) === 0);

  // Recomeçar pede confirmação.
  await outra.reload();
  await tela(outra);
  await outra.getByRole("button", { name: "Começar de novo" }).click();
  await outra.getByRole("button", { name: "Não, quero guardar" }).click();
  await outra.reload();
  check("desistir de recomeçar guarda tudo", (await tela(outra)) === "volta");
  await outra.getByRole("button", { name: "Começar de novo" }).click();
  await outra.getByRole("button", { name: "Apagar e começar de novo" }).click();
  check("recomeçar volta à abertura", (await tela(outra)) === "abertura");
  await outra.reload();
  check("e fica apagado", (await tela(outra)) === "abertura");
  await outra.context().close();
}

console.log("\n# As respostas de um não aparecem no outro");
{
  const pg = await nova(CELULAR);
  await pg.goto(`${SITE}/forms/amostra/adestramento`);
  await pg.getByRole("button", { name: "Começar" }).click();
  await tela(pg);
  await avancar(pg);
  await pg.goto(`${SITE}/forms/amostra/trabalhista`);
  check("o outro briefing começa do zero", (await tela(pg)) === "abertura");
  await pg.context().close();
}

console.log("\n# Escreveu e tocou em Continuar sem tocar em Adicionar");
{
  const pg = await nova(CELULAR);
  await pg.goto(`${SITE}/forms/amostra/adestramento`);
  await pg.getByRole("button", { name: "Começar" }).click();
  await tela(pg);
  for (let i = 0; i < 2; i++) {
    await avancar(pg);
    await tela(pg);
  }
  await pg.getByLabel("Outro jeito", { exact: true }).fill("No parque");
  await continuar(pg);
  await pg.waitForTimeout(900);
  check("não perde o que escreveu e segue", (await titulo(pg).innerText()).trim() === "Em quais dias e horários você dá aula?", await titulo(pg).innerText());
  await pg.getByRole("button", { name: "Voltar" }).click();
  await tela(pg);
  check("a opção escrita está marcada", (await pg.getByRole("checkbox", { name: "No parque" }).getAttribute("aria-checked")) === "true");
  await pg.context().close();
}

console.log("\n# Outro aparelho");
{
  const pg = await nova(CELULAR);
  await pg.goto(`${SITE}/forms/amostra/trabalhista?aparelho=outro`);
  const campo = pg.getByLabel("Os 4 últimos números do seu WhatsApp");
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/cel-aparelho.png` });
  for (let i = 0; i < 2; i++) {
    await campo.fill("1234");
    await pg.locator("form button").click();
  }
  check("número errado avisa", await pg.getByText("Não bateu").isVisible());
  await campo.fill("0000");
  await pg.locator("form button").click();
  check("número certo abre", (await tela(pg)) === "abertura");
  await pg.goto(`${SITE}/forms/amostra/trabalhista?aparelho=outro`);
  for (let i = 0; i < 5; i++) {
    await campo.fill("1234");
    await pg.locator("form button").click();
  }
  check("5 erros travam", await pg.getByText("Vamos liberar para você").isVisible());
  await pg.context().close();
}

await browser.close();
console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);

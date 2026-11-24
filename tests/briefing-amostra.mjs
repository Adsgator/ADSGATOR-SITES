// A amostra do briefing (plano geral, Parte 5), com cliques reais, no computador e no
// celular, com "reduzir animações" ligado e desligado: responder do começo ao fim, as
// perguntas que aparecem e somem, sair no meio e voltar, recomeçar, rever, mudar,
// enviar, os 4 números em outro aparelho, os horários, o olho, o texto colado e os dois do
// Google Ads. Nada sai do navegador.
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
  await pg.waitForTimeout(750);
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
  } else if (await area.locator('[data-campo="cep"]').count()) {
    // Um CEP público de verdade (a praça da Sé, em São Paulo).
    await area.locator('[data-campo="cep"]').fill("01001000");
    await area.locator('[data-campo="numero"]').fill("1");
  } else if (await area.getByRole("button", { name: "Adicionar" }).count()) {
    for (const texto of ["Um do teste", "Outro do teste"]) {
      await area.locator("input").last().fill(texto);
      await area.locator("input").last().press("Enter");
    }
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
      await pg.aoVer?.((await titulo(pg).innerText()).trim());
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
  const vistos = new Set();
  for (let k = 0; k < 110 && !(vistos.has(7) && vistos.has(0)); k++) {
    vistos.add(Number(await pg.locator("[data-cena]").getAttribute("data-cena")));
    await pg.waitForTimeout(160);
  }
  check("a cena da abertura anda, termina e recomeça", cena > 0 && vistos.has(7) && vistos.has(0), [...vistos].join(" "));
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${pg.foto}-00-abertura.png`, fullPage: true });
  await pg.getByRole("button", { name: "Começar" }).click();
  await tela(pg);

  // Sem resposta, não passa; e diz o porquê.
  await continuar(pg);
  check("sem resposta nenhuma, a contagem é zero", /^0 de /.test(await pg.locator("[data-contagem]").last().innerText()), await pg.locator("[data-contagem]").last().innerText());
  check("sem resposta não passa", /Confirme ou escreva/.test(await pg.locator("[data-erro]").last().innerText()));

  const vistas = await ateORevisao(pg, {
    "Como você atende?": ["Por vídeo ou telefone"],
    "No dia a dia, quem você costuma defender?": ["O trabalhador"],
    "Você já tem um endereço de site?": ["Já tenho"],
  });
  console.log(`   ${vistas.length} perguntas`);
  check("no máximo 32 telas de pergunta", vistas.length <= 32, vistas.length);
  check("só por vídeo, não pergunta o endereço", !vistas.includes("O escritório fica aqui?"));
  check("por vídeo, pergunta de onde são", vistas.includes("Por vídeo, você atende pessoas de quais lugares?"));
  check("trabalhador, não pergunta de empresa", !vistas.some((v) => /empresa/.test(v)));
  check("tem domínio, pergunta qual", vistas.includes("Qual é o endereço do seu site?"));
  check("tem domínio, não sugere outro", !vistas.includes("Que tal este endereço?"));
  check("100%", (await pg.locator("[data-porcento]").getAttribute("data-porcento")) === "100");
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${pg.foto}-revisao.png`, fullPage: true });

  // Mudar na revisão e voltar a ela, com a pergunta nova que apareceu.
  await pg.locator('[data-revisao="lado"] button').click();
  await tela(pg);
  await pg.locator("form").last().getByText("Os dois", { exact: true }).click();
  await pg.waitForTimeout(1200);
  check("a mudança leva à pergunta nova", (await tela(pg)) === "pergunta" && /para empresas/.test(await titulo(pg).innerText()), await titulo(pg).innerText());
  await responder(pg);
  await pg.getByRole("button", { name: "Pronto" }).last().click();
  await tela(pg);
  check("e à que ficou incompleta por causa dela", /explica/.test(await titulo(pg).innerText()), await titulo(pg).innerText());
  await responder(pg);
  await pg.getByRole("button", { name: "Pronto" }).last().click();
  check("e depois volta à revisão, sem nada faltando", (await tela(pg)) === "revisao" && (await pg.getByText("Ainda sem resposta").count()) === 0);
  await pg.getByRole("button", { name: "Enviar as respostas" }).click();
  check("depois de enviar, pede o material", (await tela(pg)) === "material");
  check("com o que a pessoa marcou", /O logo/.test(await pg.locator("[data-material]").innerText()));
  check("a pasta abre em outra aba", (await pg.locator("[data-material] a[target]").getAttribute("target")) === "_blank");
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${pg.foto}-material.png`, fullPage: true });
  await pg.reload();
  check("sem mandar, o link volta para o material", (await tela(pg)) === "material");
  await pg.getByRole("button", { name: "Vou colocar depois" }).click();
  check("deixar para depois vai ao fim", (await tela(pg)) === "fim");
  check("e o fim lembra que falta", await pg.locator("[data-falta-material]").isVisible());
  await pg.getByRole("button", { name: "Mandar agora" }).click();
  check("dá para mandar dali", (await tela(pg)) === "material");
  await pg.getByRole("button", { name: "Já coloquei tudo" }).click();
  check("mandado, o fim não cobra", (await tela(pg)) === "fim" && (await pg.locator("[data-falta-material]").count()) === 0);
  await pg.waitForTimeout(3200);
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${pg.foto}-fim.png`, fullPage: true });
  await pg.locator("[data-cena-final]").evaluate((e) => e.scrollIntoView({ block: "center" }));
  const etapas = new Set();
  const inicioDaCena = Date.now();
  const posicoes = [];
  while (!etapas.has("conversa") && Date.now() - inicioDaCena < 45000) {
    const etapa = await pg.locator("[data-cena-final]").getAttribute("data-cena-final");
    if (etapa === "passeando") {
      posicoes.push(await pg.locator("[data-cena-final] [data-janela] > div").evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m42));
      if (FOTOS && posicoes.length === 12) await pg.locator("[data-cena-final]").screenshot({ path: `${FOTOS}/${pg.foto}-cena-passeando.png` });
    }
    etapas.add(etapa);
    await pg.waitForTimeout(150);
  }
  check("a cena passeia, volta e clica, nessa ordem", JSON.stringify([...etapas].filter((e) => e !== "pronta")) === JSON.stringify(["refinando", "passeando", "voltando", "indo", "clique", "conversa"]), [...etapas].join(" "));
  const passos = posicoes.slice(1).map((y, k) => posicoes[k] - y);
  const maior = Math.max(...passos);
  check("a rolagem é contínua, sem pulo", passos.every((p) => p >= -1) && maior > 0 && maior < Math.abs(posicoes.at(-1)) * 0.12, `${Math.round(Math.abs(posicoes.at(-1)))}px, maior passo ${Math.round(maior)}px`);
  await pg.waitForSelector('[data-mensagens="4"]', { timeout: 15000 });
  await pg.waitForTimeout(700);
  check("a conversa tem 4 mensagens", (await pg.locator("[data-conversa] p").count()) === 4);
  check("e usa o que a pessoa contou", (await pg.locator("[data-conversa]").innerText()).includes(LONGO.slice(0, 40)));
  if (FOTOS) await pg.locator("[data-cena-final]").screenshot({ path: `${FOTOS}/${pg.foto}-cena-conversa.png` });
  await pg.waitForSelector('[data-cena-final="pronta"]', { timeout: 9000 });
  check("recomeça sozinha, sem botão", (await pg.getByRole("button", { name: "Ver de novo" }).count()) === 0);
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

console.log("\n# Google Ads");
for (const [slug, esperadas] of [["trabalhista-ads", 8], ["adestramento-ads", 12]]) {
  const pg = await nova(CELULAR);
  pg.foto = `ads-${slug}`;
  await pg.goto(`${SITE}/forms/amostra/${slug}`);
  await pg.waitForSelector("[data-cena]");
  if (FOTOS) {
    await pg.evaluate(() => document.querySelector("[data-cena]").scrollIntoView({ block: "center" }));
    await pg.waitForTimeout(8600);
    await pg.screenshot({ path: `${FOTOS}/${pg.foto}-abertura.png`, fullPage: true });
  }
  await pg.getByRole("button", { name: "Começar" }).click();
  const vistas = await ateORevisao(pg);
  check(`${slug}: ${esperadas} perguntas`, vistas.length === esperadas, vistas.length);
  const saiu = /no Google\?$|outros nomes|costuma estar|não compensa|costuma aparecer|primeira resposta|receber os contatos|Em quais meses|mais gosta|explica|dificilmente|algum número|não digam|material|seu site/;
  check(`${slug}: nenhuma das que saíram`, !vistas.some((v) => saiu.test(v)), vistas.filter((v) => saiu.test(v)).join(" | "));
  check(`${slug}: não pergunta a verba`, !vistas.some((v) => /verba|investir/i.test(v)));
  const doSite = ["Quais serviços você gostaria de anunciar?", "O que vale destacar logo no anúncio?", "O que a pessoa costuma escrever na primeira mensagem?"];
  check(`${slug}: o que já veio do da página não repete`, doSite.every((v) => vistas.includes(v) === (slug === "adestramento-ads")));
  await pg.getByRole("button", { name: "Enviar as respostas" }).click();
  // Quem já fez o da página já mandou o material por lá.
  const temMaterial = slug === "adestramento-ads";
  check(`${slug}: envia`, (await tela(pg)) === (temMaterial ? "material" : "fim"));
  if (temMaterial) {
    await pg.getByRole("button", { name: "Vou colocar depois" }).click();
    await tela(pg);
    const texto = await pg.locator("main").innerText();
    check(`${slug}: sem o material, o fim agradece e lembra que falta`, /Obrigado pelas respostas, Rafa!/.test(texto) && /Ainda falta o material/.test(texto) && !/tudo certo/i.test(texto));
    await pg.getByRole("button", { name: "Mandar agora" }).click();
    await tela(pg);
    await pg.getByRole("button", { name: "Já coloquei tudo" }).click();
  }
  await tela(pg);
  check(`${slug}: o fim agradece`, /Obrigado pelas respostas/.test(await titulo(pg).innerText()), await titulo(pg).innerText());
  await pg.locator("[data-cena-final]").evaluate((e) => e.scrollIntoView({ block: "center" }));
  await pg.waitForSelector("[data-conversa]", { timeout: 45000 });
  check(`${slug}: a conversa abre no fim`, true);
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${pg.foto}-fim.png`, fullPage: true });
  check(`${slug}: sem erro no console`, pg.erros.length === 0, pg.erros[0]?.slice(0, 160));
  await pg.context().close();
}

console.log("\n# Google Ads, o que já se sabe");
for (const [nome, opcoes] of [["celular, animações reduzidas", { ...CELULAR, reducedMotion: "reduce" }], ["computador", {}]]) {
  const pg = await nova(opcoes);
  await pg.goto(`${SITE}/forms/amostra/adestramento-ads`);
  await pg.getByRole("button", { name: "Começar" }).click();
  await tela(pg);
  const marcada = (c) => pg.getByRole("button", { name: `Tirar ${c}` });
  check(`${nome}: as cidades já chegam marcadas`, (await marcada("Campinas").count()) === 1 && (await marcada("Valinhos").count()) === 1);
  check(`${nome}: e ainda não contam como resposta`, /^0 de /.test(await pg.locator("[data-contagem]").last().innerText()), await pg.locator("[data-contagem]").last().innerText());
  await marcada("Valinhos").click();
  await marcada("Campinas").click();
  await continuar(pg);
  check(`${nome}: sem nenhuma cidade não passa`, /Adicione/.test(await pg.locator("[data-erro]").last().innerText()));
  await pg.reload();
  await tela(pg);
  await pg.getByRole("button", { name: "Começar de novo" }).click().catch(() => {});
  await pg.evaluate(() => localStorage.clear());
  await pg.goto(`${SITE}/forms/amostra/adestramento-ads`);
  await pg.getByRole("button", { name: "Começar" }).click();
  await tela(pg);
  await continuar(pg);
  await tela(pg);
  check(`${nome}: só confirmar já passa`, /primeira mensagem/.test(await titulo(pg).innerText()));
  await pg.reload();
  await pg.getByRole("button", { name: "Rever o que já respondi" }).click();
  await tela(pg);
  check(`${nome}: e fica guardado`, /Campinas, Valinhos/.test(await pg.locator('[data-revisao="cidades"]').innerText()), await pg.locator('[data-revisao="cidades"]').innerText());
  await pg.goto(`${SITE}/forms/amostra/adestramento-ads`);
  await pg.getByRole("button", { name: "Continuar de onde parei" }).click();
  const vistas = await ateORevisao(pg, {}, (v) => v.at(-1) === "Que tipo de pedido chega até você e não faz sentido atender?");
  for (let k = 0; k < 3 && !/anunciar/.test(await titulo(pg).innerText()); k++) {
    if ((await tela(pg)) === "passo") await continuar(pg);
    await tela(pg);
  }
  check(`${nome}: os serviços do site chegam marcados`, (await pg.locator('form [role="checkbox"][aria-checked="true"]').allInnerTexts()).join() === "Adestramento básico,Filhotes,Comportamento", vistas.length);
  await pg.getByRole("checkbox", { name: "Filhotes" }).click();
  await pg.getByRole("checkbox", { name: "Comportamento" }).click();
  await continuar(pg);
  await tela(pg);
  check(`${nome}: com um serviço só, não pergunta por qual começar`, /destacar/.test(await titulo(pg).innerText()), await titulo(pg).innerText());

  // Quem responde o WhatsApp em outros horários conta quais.
  await pg.goto(`${SITE}/forms/amostra/trabalhista-ads?preenchido=1&ir=revisao`);
  await tela(pg);
  await pg.locator('[data-revisao="responde_mesmo"] button').click();
  await tela(pg);
  await pg.locator("form").last().getByText("Não, em outros horários", { exact: true }).click();
  await pg.waitForTimeout(1200);
  check(`${nome}: em outros horários, pergunta quais`, /consegue responder o WhatsApp/.test(await titulo(pg).innerText()) && (await pg.getByRole("switch").count()) > 0, await titulo(pg).innerText());
  await pg.getByRole("switch", { name: "Domingo" }).click();
  await pg.getByRole("button", { name: "Pronto" }).last().click();
  check(`${nome}: e volta à revisão com eles`, (await tela(pg)) === "revisao" && /Domingo/.test(await pg.locator('[data-revisao="responde"]').innerText()));
  check(`${nome}: sem erro no console`, pg.erros.length === 0, pg.erros[0]?.slice(0, 160));
  await pg.context().close();
}

console.log("\n# O padrão, sem adaptação");
for (const [slug, minimo, maximo] of [["padrao", 28, 34], ["padrao-ads", 12, 13], ["padrao-ads-pagina", 8, 8]]) {
  const pg = await nova(CELULAR);
  pg.foto = slug;
  await pg.goto(`${SITE}/forms/amostra/${slug}`);
  await pg.getByRole("button", { name: "Começar" }).click();
  const textos = [];
  pg.aoVer = async () => textos.push(await pg.locator("form").last().innerText());
  const vistas = await ateORevisao(pg, { "Como você atende?": ["No meu endereço", "Vou até o cliente"] });
  console.log(`   ${vistas.length} perguntas`);
  check(`${slug}: entre ${minimo} e ${maximo} perguntas`, vistas.length >= minimo && vistas.length <= maximo, vistas.length);
  check(`${slug}: nada que um conselho limita`, textos.length > 0 && !textos.some((t) => /grátis|gratuit|sem custo|parcela|desconto|promoção|preço|Pessoas atendidas|Nota no Google|Depoimentos/i.test(t)));
  check(`${slug}: chega inteiro à revisão`, (await pg.getByText("Ainda sem resposta").count()) === 0 && (await pg.getByRole("button", { name: "Enviar as respostas" }).count()) === 1);
  if (slug === "padrao") check("padrao: o endereço é pedido direto", vistas.includes("Qual é o endereço?"));
  check(`${slug}: sem erro no console`, pg.erros.length === 0, pg.erros[0]?.slice(0, 160));
  await pg.context().close();
}

console.log("\n# OAB, nomes e fotos");
{
  const pg = await nova(CELULAR);
  const textos = {};
  await pg.goto(`${SITE}/forms/amostra/trabalhista`);
  await pg.getByRole("button", { name: "Começar" }).click();
  pg.aoVer = async (t) => (textos[t] = await pg.locator("form").last().innerText());
  await ateORevisao(pg, { "Como você atende?": ["Por vídeo ou telefone"], "No dia a dia, quem você costuma defender?": ["O trabalhador"] });
  const tudo = Object.values(textos).join(" ");
  check("OAB: sem gratuidade nem pagamento", !/sem custo|grátis|gratuit|parcela/i.test(tudo));
  check("OAB: sem quantidade de clientes, nota nem depoimento para publicar", !/Pessoas atendidas|Nota no Google|Depoimentos de clientes/.test(tudo));
  for (const t of ["O que a pessoa costuma escrever na primeira mensagem?", "Lembra de um cliente que você adorou atender? Conta como foi.", "O que os seus clientes mais falam do seu atendimento?"])
    check(`sem nomes em "${t}"`, /sem nomes/.test(textos[t] ?? ""));
  check("a pergunta do principal, com o texto novo", "Qual desses casos você busca atender mais?" in textos);
  await pg.goto(`${SITE}/forms/amostra/trabalhista/agencia?preenchido=1`);
  check("sem foto nenhuma, a agência é avisada", await pg.locator("[data-sem-fotos]").waitFor({ timeout: 8000 }).then(() => true, () => false));
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/sem-fotos.png` });
  await pg.goto(`${SITE}/forms/amostra/adestramento/agencia?preenchido=1`);
  await pg.locator("[data-resposta]").first().waitFor();
  check("com foto, não avisa", (await pg.locator("[data-sem-fotos]").count()) === 0);
  await pg.context().close();
}

console.log("\n# Horários");
for (const [nome, opcoes] of [["celular", CELULAR], ["computador", {}]]) {
  const pg = await nova(opcoes);
  await pg.goto(`${SITE}/forms/amostra/adestramento`);
  await pg.getByRole("button", { name: "Começar" }).click();
  await ateORevisao(pg, {}, (v) => v.at(-1) === "Em quais cidades ou bairros você vai até a casa?");
  await tela(pg);
  check(`${nome}: chegou aos horários`, (await titulo(pg).innerText()).trim() === "Em quais dias e horários você dá aula?");
  await pg.getByRole("switch", { name: "Segunda a sexta" }).click();
  await pg.waitForTimeout(500);
  await pg.getByRole("button", { name: "Terça tem outro horário" }).click();
  await pg.waitForTimeout(500);
  await pg.getByLabel("Terça, começa").selectOption("13:00");
  await pg.getByLabel("Terça, termina").selectOption("20:30");
  await pg.getByRole("button", { name: "Sexta tem outro horário" }).click();
  await pg.waitForTimeout(500);
  await pg.getByLabel("Não atendo na sexta").check();
  await pg.getByRole("button", { name: "Paro no meio do dia" }).first().click();
  await pg.waitForTimeout(700);
  const dia = (d) => pg.locator(`[data-semana] [data-dia="${d}"]`);
  check(`${nome}: a semana mostra a terça diferente`, /13:00/.test(await dia("Terça").innerText()) && /20:30/.test(await dia("Terça").innerText()));
  check(`${nome}: e a sexta fechada`, (await dia("Sexta").getAttribute("data-aberto")) === "false");
  check(`${nome}: segunda com intervalo (2 blocos)`, (await dia("Segunda").locator("span.bg-brand").count()) === 2);
  check(`${nome}: sem rolagem lateral`, (await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${nome === "celular" ? "cel" : "pc"}-horarios.png`, fullPage: true });
  await pg.getByLabel("Terça, termina").selectOption("10:00");
  await continuar(pg);
  check(`${nome}: hora trocada não passa`, /Terça termina antes/.test(await pg.locator("[data-erro]").last().innerText()));
  await pg.getByLabel("Terça, termina").selectOption("20:30");
  await continuar(pg);
  await tela(pg);
  await pg.goto(`${SITE}/forms/amostra/adestramento/agencia`);
  const linhas = await pg.locator('[data-resposta="horarios"]').innerText();
  check(
    `${nome}: o texto junta os dias iguais`,
    linhas.includes("Segunda, quarta e quinta, das 08:00 às 12:00 e das 13:00 às 18:00") && linhas.includes("Terça, das 13:00 às 20:30"),
    linhas.split("\n").slice(1).join(" | "),
  );
  await pg.context().close();
}

console.log("\n# O olho");
for (const [nome, opcoes] of [["celular", CELULAR], ["computador", {}]]) {
  const pg = await nova(opcoes);
  await pg.goto(`${SITE}/forms/amostra/trabalhista`);
  await pg.getByRole("button", { name: "Começar" }).click();
  await tela(pg);
  await avancar(pg);
  await pg.waitForTimeout(1200);
  const logo = await pg.locator("[data-cabecalho] img:visible").first().boundingBox();
  const olho = await pg.locator("[data-olho]").boundingBox();
  check(`${nome}: alinhado com a logo`, Math.abs(logo.y + logo.height / 2 - (olho.y + olho.height / 2)) <= 1.5, `${logo.y + logo.height / 2} x ${olho.y + olho.height / 2}`);
  check(`${nome}: o convite só no celular`, (await pg.locator("[data-convite-do-olho]").isVisible()) === (nome === "celular"));
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${nome === "celular" ? "cel" : "pc"}-olho.png` });
  const pupila = () => pg.locator(".olho-pupila").evaluate((e) => e.style.transform);
  if (nome === "computador") {
    await pg.mouse.move(20, 700);
    const a = await pupila();
    await pg.mouse.move(1340, 20);
    check("computador: a pupila segue o mouse", a !== (await pupila()), `${a} / ${await pupila()}`);
  }
  const antes = (await titulo(pg).innerText()).trim();
  await pg.locator("[data-olho]").click();
  await pg.waitForTimeout(700);
  check(`${nome}: o toque mostra o desenho`, await pg.locator("[data-ver-desenho]").isVisible());
  check(`${nome}: com o que já foi respondido`, /Helena Prado Advocacia/.test(await pg.locator("[data-ver-desenho]").innerText()));
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${nome === "celular" ? "cel" : "pc"}-ver.png` });
  await pg.goBack();
  await pg.waitForTimeout(600);
  check(`${nome}: o Voltar fecha e fica na mesma pergunta`, (await pg.locator("[data-ver-desenho]").count()) === 0 && (await titulo(pg).innerText()).trim() === antes);
  check(`${nome}: o convite não volta`, (await pg.locator("[data-convite-do-olho]").count()) === 0);
  await pg.locator("[data-olho]").click();
  await pg.waitForTimeout(500);
  await pg.keyboard.press("Escape");
  await pg.waitForTimeout(600);
  check(`${nome}: Esc fecha`, (await pg.locator("[data-ver-desenho]").count()) === 0);
  await pg.locator("[data-olho]").click();
  await pg.waitForTimeout(500);
  await pg.getByRole("button", { name: "Voltar a responder" }).first().click();
  await pg.waitForTimeout(600);
  check(`${nome}: o botão fecha e continua na pergunta`, (await titulo(pg).innerText()).trim() === antes);
  check(`${nome}: sem erro no console`, pg.erros.length === 0, pg.erros[0]?.slice(0, 160));
  await pg.context().close();
}

console.log("\n# O visual muda com as escolhas");
for (const [nome, opcoes] of [["celular", CELULAR], ["computador", {}]]) {
  const pg = await nova(opcoes);
  const f = nome === "celular" ? "cel" : "pc";
  await pg.goto(`${SITE}/forms/amostra/adestramento`);
  await pg.getByRole("button", { name: "Começar" }).click();
  await ateORevisao(pg, {}, (v) => v.at(-1) === "Tem algum curso ou certificado para mostrar?");
  if ((await tela(pg)) === "passo") await continuar(pg);
  await tela(pg);
  const alvo = pg.locator(nome === "celular" ? "[data-ao-vivo] > div" : "aside [data-rascunho]");
  const cor = () => alvo.evaluate((e) => getComputedStyle(e).backgroundColor);
  check(`${nome}: o desenho está à vista na pergunta do estilo`, await alvo.isVisible());
  const fundos = new Set([await cor()]);
  for (const estilo of ["Elegante", "Divertido", "Tecnológico", "Luxuoso", "Jovem", "Forte"]) {
    await pg.getByRole("checkbox", { name: estilo }).click();
    await pg.waitForTimeout(1100);
    fundos.add(await cor());
    if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${f}-estilo-${estilo}.png` });
    await pg.getByRole("checkbox", { name: estilo }).click();
  }
  check(`${nome}: cada estilo muda o desenho`, fundos.size === 7, fundos.size);
  if (nome === "celular") {
    await pg.getByRole("checkbox", { name: "Forte" }).scrollIntoViewIfNeeded();
    const caixa = await alvo.boundingBox();
    check("celular: o desenho acompanha a rolagem", caixa.y >= 60 && caixa.y < 200, Math.round(caixa.y));
  }
  await pg.getByRole("checkbox", { name: "Acolhedor" }).click();
  await continuar(pg);
  await tela(pg);
  await pg.getByRole("radio", { name: "Ainda não tenho" }).click();
  await pg.waitForTimeout(1300);
  const antes = await cor();
  await pg.getByRole("radio", { name: "Preto e dourado" }).click();
  await pg.waitForTimeout(1000);
  check(`${nome}: a combinação muda as cores`, antes !== (await cor()), `${antes} / ${await cor()}`);
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${f}-cores.png` });
  await pg.getByRole("radio", { name: "Verde-petróleo" }).click();
  await continuar(pg);
  await tela(pg);
  for (const s of ["Ousadia", "Alegria", "Confiança"]) await pg.getByRole("checkbox", { name: s }).click();
  await pg.waitForTimeout(900);
  check(
    `${nome}: a frase resume o visual`,
    (await pg.locator("[data-frase-do-visual]:visible").first().innerText()) === "Acolhedor, nas cores verde-petróleo, passando ousadia, alegria e confiança",
    await pg.locator("[data-frase-do-visual]:visible").first().innerText(),
  );
  check(`${nome}: as sensações entram no desenho`, (await pg.locator("[data-sensacoes]:visible").first().getAttribute("data-sensacoes")) === "Ousadia,Alegria,Confiança");
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/${f}-sensacao.png` });
  check(`${nome}: sem rolagem lateral`, (await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  check(`${nome}: sem erro no console`, pg.erros.length === 0, pg.erros[0]?.slice(0, 200));
  await pg.context().close();
}

console.log("\n# As combinações");
{
  const pg = await nova({});
  await pg.goto(`${SITE}/forms/amostra/adestramento`);
  await pg.getByRole("button", { name: "Começar" }).click();
  await ateORevisao(pg, {}, (v) => v.at(-1) === "Tem algum curso ou certificado para mostrar?");
  if ((await tela(pg)) === "passo") await continuar(pg);
  await tela(pg);
  const estilo = (n) => pg.locator("form").last().getByRole("checkbox", { name: n, exact: true });
  await estilo("Luxuoso").click();
  check("o que não combina fica bloqueado, com o motivo", (await estilo("Divertido").isDisabled()) && /Não combina com luxuoso/.test(await estilo("Divertido").innerText()));
  await estilo("Luxuoso").click();
  check("e libera quando desmarca", await estilo("Divertido").isEnabled());

  // A mesma dupla, em qualquer ordem, dá o mesmo desenho.
  const aparencia = () =>
    pg.locator("aside [data-rascunho]").evaluate((r) => {
      const c = getComputedStyle(r);
      const t = r.querySelector("[data-botao-do-desenho]");
      return [c.backgroundColor, c.color, getComputedStyle(t).backgroundColor, getComputedStyle(t).borderRadius].join(" ");
    });
  const escolher = async (nomes) => {
    for (const n of nomes) await estilo(n).click();
    await pg.waitForTimeout(1200);
    const a = await aparencia();
    for (const n of nomes) await estilo(n).click();
    return a;
  };
  check("a ordem da escolha não muda o resultado", (await escolher(["Minimalista", "Divertido"])) === (await escolher(["Divertido", "Minimalista"])));

  // A alegria fala a linguagem do estilo.
  await estilo("Minimalista").click();
  await estilo("Divertido").click();
  await pg.waitForTimeout(400);
  check("o encontro aparece em palavras", await pg.locator("aside").getByText("Pouca coisa na tela, com um detalhe que surpreende").isVisible());
  const linguagens = {};
  for (const [duplas, rotulo] of [[["Rústico"], "Rústico"], [["Minimalista"], "Minimalista"], [["Divertido"], "Divertido"], [["Elegante"], "Elegante"], [["Natural"], "Natural"], [["Rústico", "Divertido"], "Rústico com divertido"], [["Elegante", "Divertido"], "Elegante com divertido"]]) {
    await pg.evaluate(([s, e]) => {
      const g = JSON.parse(localStorage.getItem(`amostra-briefing-2:${s}`));
      g.respostas.estilo = { opcoes: e };
      g.respostas.sensacao = { opcoes: ["Alegria", "Confiança"] };
      localStorage.setItem(`amostra-briefing-2:${s}`, JSON.stringify(g));
    }, ["adestramento", duplas]);
    await pg.goto(`${SITE}/forms/amostra/adestramento`);
    await tela(pg);
    await pg.locator("[data-olho]").click();
    await pg.waitForTimeout(1300);
    const topo = pg.locator("[data-ver-desenho] [data-sensacoes]").first();
    linguagens[rotulo] = [await topo.getAttribute("data-linguagem"), await topo.locator("> span").count()].join(" ");
    if (FOTOS) await pg.locator("[data-ver-desenho] [data-rascunho]").screenshot({ path: `${FOTOS}/combo-${rotulo}.png` });
  }
  check(
    "a mesma alegria sai diferente em cada estilo",
    linguagens["Rústico"].startsWith("artesanal/artesanal") && linguagens["Rústico com divertido"].startsWith("artesanal/ludica") && linguagens["Elegante com divertido"].startsWith("classica/ludica") && linguagens["Minimalista"].startsWith("geometrica") && linguagens["Divertido"].startsWith("ludica") && linguagens["Elegante"].startsWith("classica") && linguagens["Natural"].startsWith("organica"),
    Object.entries(linguagens).map((x) => x.join(": ")).join(", "),
  );
  check("e na quantidade que o estilo aceita", Number(linguagens["Minimalista"].split(" ")[1]) < Number(linguagens["Divertido"].split(" ")[1]));
  check("sem erro no console", pg.erros.length === 0, pg.erros[0]?.slice(0, 200));
  await pg.context().close();
}

console.log("\n# As outras formas de dar a cor");
{
  const pg = await nova(CELULAR);
  await pg.goto(`${SITE}/forms/amostra/trabalhista`);
  await pg.getByRole("button", { name: "Começar" }).click();
  await ateORevisao(pg, {}, (v) => v.at(-1) === "Você já tem as cores da sua marca?");
  await tela(pg);
  check("sabe as cores, pede as exatas", (await titulo(pg).innerText()).trim() === "Quais são as suas cores?");
  await continuar(pg);
  check("vazio não passa", /pelo menos uma cor/.test(await pg.locator("[data-erro]").last().innerText()));
  const campo = pg.getByLabel("Quais são as suas cores?", { exact: true }).last();
  const lidas = async () => (await pg.locator("[data-reconhecidas] li").allInnerTexts()).map((x) => x.match(/#[0-9A-F]{6}/i)?.[0].toLowerCase());
  // Uma imagem com as cores, junto com o que a pessoa escreveu.
  await campo.fill("#123456");
  const faixas = await pg.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 300;
    const x = c.getContext("2d");
    x.fillStyle = "#0f766e";
    x.fillRect(0, 0, 300, 180);
    x.fillStyle = "#e07b4f";
    x.fillRect(0, 180, 300, 120);
    return c.toDataURL("image/png").split(",")[1];
  });
  await pg.locator("[data-imagem-do-logo]").setInputFiles({ name: "cores.png", mimeType: "image/png", buffer: Buffer.from(faixas, "base64") });
  await pg.waitForTimeout(1000);
  check("quem sabe as cores também pode usar uma imagem", (await campo.inputValue()).startsWith("#123456") && /#0f766e/.test(await campo.inputValue()) && /#e07b4f/.test(await campo.inputValue()), (await campo.inputValue()).replace("\n", " + "));
  for (const [texto, esperadas] of [
    ["#8A1C5B", ["#8a1c5b"]],
    ["8a1c5b", ["#8a1c5b"]],
    ["#abc", ["#aabbcc"]],
    ["RGB 20, 35, 74", ["#14234a"]],
    ["rgb(20,35,74)", ["#14234a"]],
    ["R 20 G 35 B 74", ["#14234a"]],
    ["CMYK 0, 100, 0, 0", ["#ff00ff"]],
    ["C0 M100 Y0 K0", ["#ff00ff"]],
    ["azul-marinho e dourado", ["#14234a", "#b8913c"]],
    ["Azul claro com cinza", ["#5aa9dc", "#6b7280"]],
    ["principal #8A1C5B, apoio rgb(20,35,74) e CMYK 0 0 0 100", ["#8a1c5b", "#14234a", "#000000"]],
    ["Pantone 186 C", []],
  ]) {
    await campo.fill(texto);
    await pg.waitForTimeout(450);
    check(`entende "${texto}"`, JSON.stringify(await lidas()) === JSON.stringify(esperadas), (await lidas()).join(" "));
  }
  check("o que não entende, avisa que chega igual", await pg.getByText("chega para a gente do jeito").isVisible());
  await campo.fill("#8A1C5B e RGB 20, 35, 74");
  await pg.waitForTimeout(400);
  await pg.locator('[data-reconhecidas] input[type="color"]').first().fill("#0f766e");
  await pg.waitForTimeout(400);
  check("ajustar a cor muda o texto e mantém a outra", (await campo.inputValue()) === "#0f766e e RGB 20, 35, 74", await campo.inputValue());
  await pg.waitForTimeout(700);
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/cel-cores-exatas.png` });
  await pg.getByRole("button", { name: "Voltar" }).click();
  await tela(pg);
  await pg.getByRole("radio", { name: "Tenho, estão no meu logo" }).click();
  await pg.waitForTimeout(1300);
  check("está no logo, pede as do logo", (await titulo(pg).innerText()).trim() === "Quais cores aparecem no seu logo?");
  // Um logo de mentira, desenhado na hora: vinho com um pouco de dourado, em fundo branco.
  const logo = await pg.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 400;
    const x = c.getContext("2d");
    x.fillStyle = "#ffffff";
    x.fillRect(0, 0, 400, 400);
    x.fillStyle = "#7a1030";
    x.fillRect(60, 60, 280, 180);
    x.fillStyle = "#c9a24e";
    x.fillRect(60, 270, 280, 60);
    return c.toDataURL("image/png").split(",")[1];
  });
  const saiu = [];
  pg.on("request", (q) => q.method() !== "GET" && saiu.push(q.url()));
  await pg.locator("[data-imagem-do-logo]").setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: Buffer.from(logo, "base64") });
  await pg.waitForSelector("[data-reconhecidas] li");
  await pg.waitForTimeout(900);
  const doLogo = (await pg.locator("[data-reconhecidas] li").allInnerTexts()).map((t) => t.match(/#[0-9A-F]{6}/i)[0].toLowerCase());
  check("as cores saem do logo, sem o branco", JSON.stringify(doLogo) === JSON.stringify(["#7a1030", "#c9a24e"]), doLogo.join(" "));
  check("e a imagem não sai do aparelho", saiu.length === 0, saiu[0]);
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/cel-cores-imagem.png`, fullPage: true });
  for (let i = 0; i < 2; i++) await pg.getByRole("button", { name: /^Tirar a cor/ }).first().click();
  await pg.waitForTimeout(500);
  for (const c of ["Vinho", "Dourado"]) await pg.getByRole("checkbox", { name: c, exact: true }).click();
  await pg.waitForTimeout(900);
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/cel-cores-logo.png` });
  await pg.context().close();
}

console.log("\n# Resposta que chegou pronta");
{
  const pg = await nova({ permissions: ["clipboard-read", "clipboard-write"] });
  const TEXTO =
    "Com um atendimento humanizado e personalizado, buscamos sempre a excelência em cada detalhe. Nosso compromisso é oferecer soluções completas, com foco na satisfação do cliente e em resultados reais.";
  await pg.goto(`${SITE}/forms/amostra/trabalhista`);
  await pg.getByRole("button", { name: "Começar" }).click();
  const colar = async () => {
    await pg.evaluate((t) => navigator.clipboard.writeText(t), TEXTO);
    await pg.locator("form textarea").last().click();
    await pg.keyboard.press("ControlOrMeta+v");
  };
  await ateORevisao(pg, { "Como você atende?": ["Por vídeo ou telefone"] }, (v) => v.at(-1) === "O que facilita a vida de quem fecha com você?");
  if ((await tela(pg)) === "passo") await continuar(pg);
  await tela(pg);
  await colar(); // a primeira mensagem, colada
  await continuar(pg);
  await tela(pg);
  await colar(); // o cliente de novo, colado e reescrito
  await pg.locator("form textarea").last().fill("Era uma moça que trabalhava em loja e saiu sem receber nada, e a gente resolveu em duas conversas.");
  await continuar(pg);
  await tela(pg);
  await pg.locator("form textarea").last().pressSequentially("Que eu explico bem e respondo.");
  await continuar(pg);
  await tela(pg);
  await pg.goto(`${SITE}/forms/amostra/trabalhista/agencia`);
  const sinal = (id) => pg.locator(`[data-resposta="${id}"]`).getAttribute("data-sinal");
  check("colada fica marcada", (await sinal("quem_chega")) === "colada", await sinal("quem_chega"));
  check("colada e reescrita não fica", (await sinal("quem_quer")) === "", await sinal("quem_quer"));
  check("curta fica marcada", (await sinal("elogio")) === "curta", await sinal("elogio"));
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/pc-agencia.png`, fullPage: true });
  await pg.context().close();
}

console.log("\n# O endereço");
{
  const pg = await nova(CELULAR);
  await pg.goto(`${SITE}/forms/amostra/trabalhista`);
  await pg.getByRole("button", { name: "Começar" }).click();
  await ateORevisao(pg, { "Como você atende?": ["No escritório"] }, (v) => v.at(-1) === "Como você atende?");
  await tela(pg);
  check("chegou ao endereço", (await titulo(pg).innerText()).trim() === "O escritório fica aqui?");
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/cel-holograma.png` });
  await pg.getByRole("radio", { name: "É outro endereço" }).click();
  await continuar(pg);
  check("sem CEP não passa", /Falta o CEP/.test(await pg.locator("[data-erro]").last().innerText()));
  // Um CEP público de verdade (a praça da Sé, em São Paulo).
  await pg.locator('[data-campo="cep"]').fill("01001000");
  await pg.waitForFunction(() => document.querySelector('[data-campo="rua"]')?.value, null, { timeout: 12000 });
  const valor = (c) => pg.locator(`[data-campo="${c}"]`).inputValue();
  check("o CEP preenche a rua, o bairro e a cidade", /Sé/.test(await valor("rua")) && (await valor("bairro")) === "Sé" && (await valor("cidade")) === "São Paulo", `${await valor("rua")} / ${await valor("bairro")} / ${await valor("cidade")}`);
  await pg.waitForTimeout(400);
  check("e o cursor vai para o número", (await pg.evaluate(() => document.activeElement?.getAttribute("data-campo"))) === "numero");
  await continuar(pg);
  check("sem número não passa", /Falta o número/.test(await pg.locator("[data-erro]").last().innerText()));
  await pg.locator('[data-campo="numero"]').fill("100");
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/cel-endereco.png`, fullPage: true });
  await pg.getByRole("button", { name: "Não sei o CEP" }).click();
  await pg.locator("[data-endereco] select").selectOption("SP");
  await pg.locator('[data-campo="cidade"]').fill("São Paulo");
  await pg.locator('[data-campo="rua"]').fill("Avenida Paulista");
  await pg.getByRole("button", { name: "Procurar o CEP" }).click();
  await pg.waitForSelector('ul[aria-label="Endereços encontrados"] button', { timeout: 12000 });
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/cel-endereco-rua.png`, fullPage: true });
  await pg.locator('ul[aria-label="Endereços encontrados"] button').first().click();
  await pg.waitForTimeout(400);
  check("sem o CEP, acha pela rua", /^013\d{2}-\d{3}$/.test(await valor("cep")) && /Paulista/.test(await valor("rua")), `${await valor("cep")} ${await valor("rua")}`);
  check("sem rolagem lateral", (await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  await pg.locator('[data-campo="numero"]').fill("1000");
  await continuar(pg);
  await tela(pg);
  await pg.goto(`${SITE}/forms/amostra/trabalhista/agencia`);
  const linhas = await pg.locator('[data-resposta="endereco"]').innerText();
  check("chega por partes, com o CEP", /Avenida Paulista, 1000/.test(linhas) && /CEP 013\d{2}-\d{3}/.test(linhas), linhas.split("\n").slice(1).join(" | "));
  for (const ruim of ["/forms/consulta/cep/123", "/forms/consulta/cep/abc", "/forms/consulta/cep?uf=SP&cidade=S&rua=X", "/forms/consulta/cep?uf=SP&cidade=../../x&rua=../y"]) {
    check(`consulta errada é recusada (${ruim})`, (await pg.request.get(`${SITE}${ruim}`)).status() === 400);
  }
  check("o checkout continua achando o CEP", (await pg.request.get("http://checkout.localhost:3005/consulta/cep/01001000")).status() === 200);
  await pg.context().close();
}

console.log("\n# As cidades da região");
{
  const pg = await nova(CELULAR);
  await pg.goto(`${SITE}/forms/amostra/adestramento`);
  await pg.getByRole("button", { name: "Começar" }).click();
  await ateORevisao(pg, { "Onde acontecem as aulas?": ["Na casa do cliente"] }, (v) => v.at(-1) === "Onde acontecem as aulas?");
  await tela(pg);
  await pg.waitForSelector('[data-sugestoes] >> text="Toda a região de Campinas"', { timeout: 15000 });
  const sugeridas = await pg.locator("[data-sugestoes] button").allInnerTexts();
  check("sugere a cidade, a região e as vizinhas de verdade", sugeridas[0] === "Campinas" && sugeridas.includes("Americana") && !sugeridas.some((x) => /Jardim|Zona/.test(x)), sugeridas.join(", "));
  await pg.getByRole("button", { name: /Ver as outras/ }).click();
  check("as outras aparecem", (await pg.locator("[data-sugestoes] button").allInnerTexts()).includes("Vinhedo"));
  await pg.getByRole("button", { name: "Vinhedo", exact: true }).click();
  await pg.getByLabel("Cidade, bairro ou estado", { exact: true }).fill("Cambuí, Taquaral");
  await pg.getByLabel("Cidade, bairro ou estado", { exact: true }).press("Enter");
  check("e dá para escrever o bairro", (await pg.getByRole("button", { name: "Tirar Taquaral" }).count()) === 1 && (await pg.getByRole("button", { name: "Tirar Vinhedo" }).count()) === 1);
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/cel-cidades.png`, fullPage: true });
  for (const ruim of ["uf=XX1&cidade=Campinas", "uf=SP&cidade=", "uf=SP&cidade=../../x"]) {
    check(`consulta errada é recusada (${ruim})`, (await pg.request.get(`${SITE}/forms/consulta/regiao?${ruim}`)).status() === 400);
  }
  check("cidade que não existe, 404", (await pg.request.get(`${SITE}/forms/consulta/regiao?uf=SP&cidade=Lugar Nenhum`)).status() === 404);
  await pg.context().close();

  // Com outro endereço, a região muda junto.
  const pg2 = await nova(CELULAR);
  await pg2.goto(`${SITE}/forms/amostra/trabalhista`);
  await pg2.getByRole("button", { name: "Começar" }).click();
  await ateORevisao(pg2, { "Como você atende?": ["No escritório", "Por vídeo ou telefone"] }, (v) => v.at(-1) === "Como você atende?");
  await tela(pg2);
  await pg2.getByRole("radio", { name: "É outro endereço" }).click();
  await pg2.locator('[data-campo="cep"]').fill("01001000");
  await pg2.waitForFunction(() => document.querySelector('[data-campo="cidade"]')?.value, null, { timeout: 12000 });
  const cidade = await pg2.locator('[data-campo="cidade"]').inputValue();
  for (const [c, v] of [["rua", "Rua de teste"], ["numero", "1"], ["bairro", "Centro"]]) await pg2.locator(`[data-campo="${c}"]`).fill(v);
  await continuar(pg2);
  await tela(pg2);
  await pg2.waitForSelector(`[data-sugestoes] >> text="${cidade}"`, { timeout: 15000 });
  check("com outro endereço, sugere a região dele", !(await pg2.locator("[data-sugestoes] button").allInnerTexts()).includes("Campinas"), `${cidade}: ${(await pg2.locator("[data-sugestoes] button").allInnerTexts()).slice(0, 4).join(", ")}`);
  await pg2.context().close();
}

console.log("\n# Preenchido");
for (const [nome, opcoes] of [["celular", CELULAR], ["computador", {}]]) {
  const f = nome === "celular" ? "cel" : "pc";
  const pg = await nova(opcoes);
  for (const slug of ["trabalhista", "adestramento", "trabalhista-ads", "adestramento-ads"]) {
    await pg.goto(`${SITE}/forms/amostra/${slug}?preenchido=1`);
    check(`${nome}, ${slug}: volta com tudo respondido`, (await tela(pg)) === "volta" && /(\d+) de \1/.test(await pg.locator("main").innerText()), (await pg.locator("main").innerText()).match(/\d+ de \d+/)?.[0]);
    if (FOTOS) {
      await pg.locator("[data-olho]").click();
      await pg.waitForTimeout(1200);
      await pg.screenshot({ path: `${FOTOS}/ex-${f}-${slug}-desenho.png` });
      await pg.locator("[data-ver-desenho] [data-rascunho]").screenshot({ path: `${FOTOS}/ex-${f}-${slug}-inteiro.png` });
    }
    if (slug.endsWith("-ads")) {
      if (!(await pg.locator("[data-ver-desenho]").count())) await pg.locator("[data-olho]").click();
      await pg.waitForTimeout(1600);
      const desenho = pg.locator("[data-ver-desenho] [data-rascunho]");
      const vazias = await desenho.locator('[data-ativa="false"]').evaluateAll((l) => l.map((e) => e.getAttribute("data-parte")));
      check(`${nome}, ${slug}: nenhuma parte vazia no desenho`, vazias.length === 0, vazias.join(" "));
      const texto = await desenho.innerText();
      const esperados =
        slug === "trabalhista-ads"
          ? ["helenapradoadvocacia.com.br", "Verbas rescisórias", "Horas extras", "Toda a região de Campinas", "Só o cálculo da rescisão"]
          : ["rafaadestramento.com.br", "Comportamento", "Vou até a casa", "Filhotes", "Valinhos", "Banho e tosa"];
      const faltam = esperados.filter((e) => !texto.includes(e));
      check(`${nome}, ${slug}: o desenho traz o que a pessoa contou (${esperados.length} conferidos)`, faltam.length === 0, faltam.join(" | "));
      const titulos = new Set();
      for (let k = 0; k < 24; k++) {
        titulos.add(await desenho.locator("[data-titulo-do-anuncio]").last().innerText());
        await pg.waitForTimeout(300);
      }
      check(`${nome}, ${slug}: o anúncio alterna os títulos`, titulos.size >= 2, [...titulos].join(" / "));
    }
    if (!slug.endsWith("-ads")) {
      // Tudo o que a pessoa contou aparece no desenho, parte por parte.
      if (!(await pg.locator("[data-ver-desenho]").count())) await pg.locator("[data-olho]").click();
      await pg.waitForTimeout(1300);
      const desenho = pg.locator("[data-ver-desenho] [data-rascunho]");
      const vazias = await desenho.locator('[data-ativa="false"]').evaluateAll((l) => l.map((e) => e.getAttribute("data-parte")));
      check(`${nome}, ${slug}: nenhuma parte vazia no desenho`, vazias.length === 0, vazias.join(" "));
      const texto = await desenho.innerText();
      const esperados =
        slug === "trabalhista"
          ? ["helenapradoadvocacia.com.br", "Helena Prado Advocacia", "Verbas rescisórias", "refaço a conta", "Rescisão indireta", "9 anos", "Explico sem juridiquês", "me mandaram embora", "Você me conta o que aconteceu", "áudio toda sexta", "outro advogado sumia", "motorista a vida toda", "Quanto tempo demora?", "Rua das Acácias", "Horários da semana", "Instagram", "OAB/SP 000.000"]
          : ["rafaadestramento.com.br", "Comportamento", "Primeiro entendo o porquê", "7 anos", "Parcela no cartão", "Tem medo de tudo", "Visito a casa", "Não treino o cão longe do dono", "Três pessoas me falaram", "Cão adulto ainda aprende?", "Valinhos", "TikTok"];
      const faltam = esperados.filter((e) => !texto.includes(e));
      check(`${nome}, ${slug}: o desenho traz o que a pessoa contou (${esperados.length} conferidos)`, faltam.length === 0, faltam.join(" | "));
      if (FOTOS) await pg.screenshot({ path: `${FOTOS}/ex-${f}-${slug}-olho.png` });
    }
    await pg.goto(`${SITE}/forms/amostra/${slug}?preenchido=1&ir=fim`);
    await pg.waitForSelector("[data-cena-final]");
    await pg.waitForTimeout(900);
    if (FOTOS) await pg.screenshot({ path: `${FOTOS}/ex-${f}-${slug}-fim.png`, fullPage: true });
    await pg.locator("[data-cena-final]").evaluate((e) => e.scrollIntoView({ block: "center" }));
    if (slug === "trabalhista") {
      await pg.waitForSelector('[data-cena-final="passeando"]', { timeout: 40000 });
      await pg.waitForTimeout(1200);
      if (FOTOS) await pg.locator("[data-cena-final]").screenshot({ path: `${FOTOS}/ex-${f}-${slug}-passeando.png` });
      await pg.waitForSelector('[data-mensagens="4"]', { timeout: 40000 });
    }
    await pg.goto(`${SITE}/forms/amostra/${slug}?preenchido=1&ir=revisao`);
    check(`${nome}, ${slug}: a revisão deixa enviar`, await pg.getByRole("button", { name: "Enviar as respostas" }).waitFor({ timeout: 8000 }).then(() => true, () => false));
  }
  await pg.goto(`${SITE}/forms/amostra/adestramento/agencia?preenchido=1`);
  const naAgencia = await pg.locator("[data-desenho-da-agencia]").innerText();
  check(`${nome}: a agência vê a página que se montou`, /Não treino o cão longe do dono/.test(naAgencia) && /Natural e divertido, nas cores verde-petróleo/.test(naAgencia));
  check(`${nome}: a agência, sem rolagem lateral`, (await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  check(`${nome}: a colada do exemplo fica marcada`, (await pg.locator('[data-resposta="elogio"]').getAttribute("data-sinal")) === "colada");
  if (FOTOS) await pg.screenshot({ path: `${FOTOS}/ex-${f}-agencia.png`, fullPage: true });
  await pg.goto(`${SITE}/forms/amostra/adestramento`);
  check(`${nome}: o exemplo não mexe no que a pessoa respondeu`, (await tela(pg)) === "abertura");
  check(`${nome}: sem erro no console`, pg.erros.length === 0, pg.erros[0]?.slice(0, 200));
  await pg.context().close();
}

console.log("\n# Nada estoura a caixa");
for (const [nome, opcoes] of [["celular", CELULAR], ["computador", {}]]) {
  const pg = await nova(opcoes);
  for (const slug of ["trabalhista", "adestramento", "adestramento-ads"]) {
    for (const [tipo, texto] of [
      ["sem espaço", "j".repeat(90) + "f".repeat(260)],
      ["longo", "Uma explicação bem comprida, contada com calma. ".repeat(40).trim()],
    ]) {
      await pg.goto(`${SITE}/forms/amostra/${slug}?preenchido=1`);
      await tela(pg);
      // O exemplo, com todos os textos trocados (as opções que a pessoa acrescenta também).
      await pg.evaluate(([s, txt]) => {
        const g = JSON.parse(localStorage.getItem(`amostra-briefing-2:${s}-exemplo`));
        for (const [id, r] of Object.entries(g.respostas)) {
          if (["estilo", "sensacao", "cores_tem", "cores_logo", "cores_novas", "atende", "lado", "preco", "dominio", "horarios", "responde"].includes(id)) continue;
          if (r.opcoes?.includes("sim")) Object.assign(r, { opcoes: ["outro"], valor: txt });
          if (r.valor) r.valor = txt;
          if (r.itens && id !== "detalhes") for (const k of Object.keys(r.itens)) r.itens[k] = k === "uf" ? "SP" : k === "cep" ? "01001-000" : txt;
        }
        // Um serviço com nome enorme, que também é o principal.
        const lista = g.respostas.areas_trabalhador ?? g.respostas.servicos;
        lista.opcoes = [txt.slice(0, 280), ...lista.opcoes.slice(1)];
        if (g.respostas.principal) g.respostas.principal.opcoes = [txt.slice(0, 280)];
        if (g.respostas.detalhes) g.respostas.detalhes.itens = Object.fromEntries(lista.opcoes.map((o) => [o, txt]));
        for (const id of ["facilita", "quem_quer", "procuram", "nao_quer", "cidades"]) if (g.respostas[id]?.opcoes) g.respostas[id].opcoes = [txt.slice(0, 280), ...g.respostas[id].opcoes.slice(1)];
        localStorage.setItem(`amostra-briefing-2:${s}`, JSON.stringify({ ...g, enviado: false }));
      }, [slug, texto]);
      const fora = async (raiz) =>
        pg.locator(raiz).first().evaluate((r) => {
          const ruins = [];
          const limite = r.getBoundingClientRect();
          const anda = document.createTreeWalker(r, NodeFilter.SHOW_TEXT);
          while (anda.nextNode()) {
            const n = anda.currentNode;
            if (!n.textContent.trim()) continue;
            // A caixa que segura o texto: o primeiro pai que é bloco, ou que corta o que sobra.
            let pai = n.parentElement;
            while (pai !== r && getComputedStyle(pai).display.startsWith("inline")) pai = pai.parentElement;
            if (["hidden", "clip"].includes(getComputedStyle(pai).overflowX)) {
              if (pai.getBoundingClientRect().right > limite.right + 1) ruins.push(`caixa ${n.textContent.slice(0, 14)}`);
              continue;
            }
            const alcance = document.createRange();
            alcance.selectNodeContents(n);
            const caixa = pai.getBoundingClientRect();
            for (const q of alcance.getClientRects()) {
              if (q.width && (q.right > caixa.right + 8 || q.right > limite.right + 1)) {
                ruins.push(`${n.textContent.slice(0, 14)} +${Math.round(q.right - Math.min(caixa.right, limite.right))}`);
                break;
              }
            }
          }
          return ruins;
        });
      await pg.goto(`${SITE}/forms/amostra/${slug}`);
      await tela(pg);
      await pg.locator("[data-olho]").click();
      await pg.waitForTimeout(1300);
      const noOlho = await fora("[data-ver-desenho] [data-rascunho]");
      check(`${nome}, ${slug}, ${tipo}: o desenho`, noOlho.length === 0, noOlho.slice(0, 4).join(" | "));
      if (FOTOS && tipo === "sem espaço") await pg.screenshot({ path: `${FOTOS}/estouro-${nome}-${slug}.png` });
      await pg.goto(`${SITE}/forms/amostra/${slug}/agencia`);
      await pg.waitForSelector("[data-desenho-da-agencia]");
      const naAgencia = await fora("main");
      check(`${nome}, ${slug}, ${tipo}: a agência`, naAgencia.length === 0 && (await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0, naAgencia.slice(0, 4).join(" | "));
      await pg.goto(`${SITE}/forms/amostra/${slug}?ir=fim`);
      await pg.waitForSelector("[data-cena-final]");
      await pg.waitForTimeout(900);
      const noFim = await fora("[data-cena-final] [data-rascunho]");
      check(`${nome}, ${slug}, ${tipo}: o fim`, noFim.length === 0 && (await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0, noFim.slice(0, 4).join(" | "));
      await pg.goto(`${SITE}/forms/amostra/${slug}?ir=revisao`);
      await tela(pg);
      const naRevisao = await fora("main");
      check(`${nome}, ${slug}, ${tipo}: a revisão`, naRevisao.length === 0 && (await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0, naRevisao.slice(0, 4).join(" | "));
    }
  }
  await pg.context().close();
}

console.log("\n# Texto grande");
{
  const pg = await nova(CELULAR);
  const GRANDE = "Uma história comprida, contada com calma, do jeito dela. ".repeat(300).trim(); // perto de 17 mil letras
  await pg.goto(`${SITE}/forms/amostra/trabalhista`);
  await pg.getByRole("button", { name: "Começar" }).click();
  await ateORevisao(pg, {}, (v) => v.at(-1) === "O que facilita a vida de quem fecha com você?");
  if ((await tela(pg)) === "passo") await continuar(pg);
  await tela(pg);
  await pg.locator("form textarea").last().fill(GRANDE);
  await continuar(pg);
  await tela(pg);
  await pg.goto(`${SITE}/forms/amostra/trabalhista/agencia`);
  const chegou = await pg.locator('[data-resposta="quem_chega"]').innerText();
  check("a resposta grande chega inteira", chegou.includes(GRANDE), `${GRANDE.length} letras`);
  await pg.context().close();
}

console.log("\n# Mudar na revisão");
{
  const pg = await nova(CELULAR);
  const abrir = async () => {
    await pg.goto(`${SITE}/forms/amostra/trabalhista?preenchido=1&ir=revisao`);
    await tela(pg);
  };
  const mudar = async (id) => {
    await pg.locator(`[data-revisao="${id}"] button`).click();
    await tela(pg);
  };
  // O caso do Lucas: do manual da marca para as cores do logo.
  await abrir();
  await mudar("cores_tem");
  await pg.getByRole("radio", { name: "Tenho um manual da marca" }).click();
  check("mudança que não abre nada volta à revisão", (await pg.waitForTimeout(900), await tela(pg)) === "revisao");
  await pg.evaluate(() => {
    const k = "amostra-briefing-2:trabalhista-exemplo";
    const g = JSON.parse(localStorage.getItem(k));
    delete g.respostas.cores_logo;
    localStorage.setItem("amostra-briefing-2:trabalhista", JSON.stringify(g));
  });
  await pg.goto(`${SITE}/forms/amostra/trabalhista?ir=revisao`);
  await tela(pg);
  await mudar("cores_tem");
  await pg.getByRole("radio", { name: "Tenho, estão no meu logo" }).click();
  await pg.waitForTimeout(900);
  check("do manual para o logo, abre as cores do logo", (await tela(pg)) === "pergunta" && (await titulo(pg).innerText()).trim() === "Quais cores aparecem no seu logo?", await titulo(pg).innerText());
  await pg.getByRole("checkbox", { name: "Vinho", exact: true }).click();
  await pg.getByRole("button", { name: "Pronto" }).last().click();
  check("respondida, volta à revisão", (await tela(pg)) === "revisao");
  // Quem edita no meio do preenchimento não é levado para o resto.
  await pg.evaluate(() => {
    const k = "amostra-briefing-2:trabalhista";
    const g = JSON.parse(localStorage.getItem(k));
    delete g.respostas.historia;
    delete g.respostas.oab;
    localStorage.setItem(k, JSON.stringify(g));
  });
  await pg.goto(`${SITE}/forms/amostra/trabalhista?ir=revisao`);
  await tela(pg);
  await mudar("principal");
  await pg.getByRole("radio", { name: "Horas extras" }).click();
  await pg.waitForTimeout(900);
  check("o que já faltava antes não é cobrado na edição", (await tela(pg)) === "revisao");
  await pg.getByRole("button", { name: "Responder o que falta" }).click();
  await tela(pg);
  const primeira = (await titulo(pg).innerText()).trim();
  await responder(pg);
  await pg.getByRole("button", { name: "Pronto" }).last().click();
  await tela(pg);
  check("Responder o que falta passa por todas", (await titulo(pg).innerText()).trim() !== primeira && (await pg.locator("[data-tela]").last().getAttribute("data-tela")) === "pergunta", `${primeira} > ${(await titulo(pg).innerText()).trim()}`);
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

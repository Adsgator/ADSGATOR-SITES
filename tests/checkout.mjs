// Checkout (checkout.adsgator.com.br; plano geral, Parte 4), a prévia da tela:
// - só os serviços do link (sem trocar), e a mensagem quando o link vem vazio;
// - os preços: o parcelado em destaque, o cartão como referência e o Pix com
//   a economia e o ícone ("Pagar no Pix" troca), combo no Pix e no cartão (até 12x), só a página, a página com a
//   manutenção (30 dias depois da entrega), o site no combo, só o Google Ads
//   (1ª mensalidade, sem parcelas) e a manutenção incluída no Google Ads;
// - Contratar com o formulário vazio mostra os erros e não abre a janela;
// - "Não tenho CNPJ" troca para CPF; o CNPJ e o CEP preenchem sozinhos;
// - a janela de aceite: o botão final só funciona com "Li e aceito" marcado,
//   e o Contratar leva à tela do Pix ou do cartão aprovado;
// - fora do Google (noindex), nenhum pedido ao Google, nenhum cookie;
// - celular sem rolagem para o lado e o resumo logo abaixo dos serviços,
//   console sem erros, nos dois modos de animação.
// Uso: node tests/checkout.mjs [checkout]
//   padrão: http://checkout.localhost:3005

import { chromium } from "playwright-core";

const CHECKOUT = process.argv[2] ?? "http://checkout.localhost:3005";
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}
const total = (p) => p.locator("[data-resumo] [data-total]").innerText();
const limpo = (s) => s.replace(/\s/g, " ");

const browser = await chromium.launch({ channel: "chrome" });
try {
  // Cabeçalhos.
  const r = await fetch(`${CHECKOUT}/?s=google-ads`);
  check("abre no endereço do checkout", r.status === 200, String(r.status));
  check("fora do Google (noindex)", /noindex/.test(r.headers.get("x-robots-tag") ?? ""));
  check("CSP sem endereços do Google", !/google/.test(r.headers.get("content-security-policy") ?? ""));

  for (const reducedMotion of ["reduce", "no-preference"]) {
    for (const tela of [
      { nome: "computador", width: 1366, height: 900 },
      { nome: "celular", width: 390, height: 844 },
    ]) {
      const rotulo = `${tela.nome}, animações ${reducedMotion === "reduce" ? "reduzidas" : "normais"}`;
      const ctx = await browser.newContext({ viewport: { width: tela.width, height: tela.height }, reducedMotion });
      const p = await ctx.newPage();
      const erros = [];
      const doGoogle = [];
      p.on("console", (m) => m.type() === "error" && erros.push(m.text()));
      p.on("pageerror", (e) => erros.push(e.message));
      p.on("request", (q) => /google|doubleclick|gtm/.test(new URL(q.url()).hostname) && doGoogle.push(q.url()));

      // Link sem serviços: a mensagem, sem formulário.
      await p.goto(`${CHECKOUT}/`, { waitUntil: "networkidle" });
      check(`${rotulo}: link sem serviços`, (await p.locator("[data-link-vazio]").count()) === 1 && (await p.locator("#whatsapp").count()) === 0);

      // Só a página: cartão como referência, o Pix com a economia.
      await p.goto(`${CHECKOUT}/?s=landing-page`, { waitUntil: "networkidle" });
      check(`${rotulo}: só o que veio no link`, (await p.locator("[data-servico]").count()) === 1);
      check(`${rotulo}: sem caixas para trocar serviço`, (await p.locator("[data-servicos] input").count()) === 0);
      check(`${rotulo}: cartão vem escolhido`, await p.locator('[data-forma="cartao"]').isChecked());
      check(`${rotulo}: só a página no cartão`, limpo(await total(p)) === "R$ 1.600,00", await total(p));
      check(`${rotulo}: Pix com a economia`, /No Pix sai por R\$ 1\.400,00/.test(limpo(await p.locator("[data-destaque-pix]").innerText())));
      check(`${rotulo}: selo de economia no Pix`, /Economize R\$ 200,00/.test(limpo(await p.locator("fieldset").innerText())));
      check(`${rotulo}: parcelado em destaque, cartão de referência`, /12x de R\$ 133,33.*R\$ 1\.600,00 no cartão/s.test(limpo(await p.locator("[data-servico] [data-preco]").innerText())));
      check(`${rotulo}: ícone do Pix no destaque`, (await p.locator("[data-destaque-pix] svg").count()) === 1);
      check(`${rotulo}: sem passos numerados e sem o atalho de dúvida`, (await p.locator("main ol").count()) === 0 && !/Ficou alguma dúvida/.test(await p.locator("main").innerText()));
      await p.getByRole("button", { name: "Pagar no Pix" }).click();
      check(`${rotulo}: "Pagar no Pix" troca para o Pix`, (await p.locator('[data-forma="pix"]').isChecked()) && limpo(await total(p)) === "R$ 1.400,00", await total(p));

      // Página com manutenção: começa 30 dias depois da entrega.
      await p.goto(`${CHECKOUT}/?s=landing-page,manutencao`, { waitUntil: "networkidle" });
      check(`${rotulo}: página com manutenção, hoje só a página`, limpo(await total(p)) === "R$ 1.600,00", await total(p));
      check(`${rotulo}: manutenção 30 dias depois da entrega`, /30 dias depois da entrega/.test(await p.locator("[data-resumo]").innerText()));

      // Site no combo.
      await p.goto(`${CHECKOUT}/?s=google-ads,site-institucional`, { waitUntil: "networkidle" });
      check(`${rotulo}: site no combo, cartão`, limpo(await total(p)) === "R$ 2.550,00", await total(p));
      await p.locator('[data-forma="pix"]').check();
      check(`${rotulo}: site no combo, Pix`, limpo(await total(p)) === "R$ 2.250,00", await total(p));

      // Só o Google Ads, e com a manutenção.
      await p.goto(`${CHECKOUT}/?s=google-ads`, { waitUntil: "networkidle" });
      check(`${rotulo}: só o Google Ads`, limpo(await total(p)) === "R$ 500,00", await total(p));
      check(`${rotulo}: 1ª mensalidade`, /1ª mensalidade/.test(await p.locator("[data-resumo]").innerText()));
      check(`${rotulo}: mensalidade sem parcelas`, (await p.locator("#parcelas").count()) === 0);
      check(`${rotulo}: mensalidade sem destaque do Pix`, (await p.locator("[data-destaque-pix]").count()) === 0);
      await p.goto(`${CHECKOUT}/?s=google-ads,manutencao`, { waitUntil: "networkidle" });
      check(`${rotulo}: manutenção incluída no Google Ads`, /Incluída/.test(await p.locator("[data-resumo]").innerText()));
      check(`${rotulo}: total sem a manutenção`, limpo(await total(p)) === "R$ 500,00", await total(p));

      // Combo.
      await p.goto(`${CHECKOUT}/?s=google-ads,landing-page`, { waitUntil: "networkidle" });
      check(`${rotulo}: combo no cartão`, limpo(await total(p)) === "R$ 1.250,00", await total(p));
      const resumo = limpo(await p.locator("[data-resumo]").innerText());
      check(`${rotulo}: Google Ads começa na aprovação`, /aprovar a sua página/.test(resumo));
      const opcoes = await p.locator("#parcelas option").allInnerTexts();
      check(`${rotulo}: até 12x`, opcoes.length === 12 && /12x de R\$\s104,17/.test(opcoes[11]), opcoes.at(-1));
      await p.locator('[data-forma="pix"]').check();
      check(`${rotulo}: combo no Pix`, limpo(await total(p)) === "R$ 1.100,00", await total(p));

      // Celular: resumo logo abaixo dos serviços, sem rolagem para o lado.
      if (tela.nome === "celular") {
        const ordem = await p.evaluate(() => {
          const s = document.querySelector("[data-servicos]").getBoundingClientRect().top;
          const r = document.querySelector("[data-resumo]").getBoundingClientRect().top;
          const d = document.getElementById("whatsapp").getBoundingClientRect().top;
          return s < r && r < d;
        });
        check(`${rotulo}: resumo entre os serviços e os dados`, ordem);
      }
      const largura = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      check(`${rotulo}: sem rolagem para o lado`, largura <= 0, `${largura}px`);

      // Vazio: erros, sem janela.
      await p.locator("[data-contratar]").click();
      check(`${rotulo}: erros no formulário vazio`, (await p.locator("[aria-invalid=true]").count()) >= 5);
      check(`${rotulo}: leva ao primeiro erro`, await p.evaluate(() => document.activeElement?.id === "whatsapp"));
      check(`${rotulo}: janela não abre com erro`, (await p.locator("[data-janela-aceite]").count()) === 0);

      // CNPJ e CEP preenchem sozinhos.
      await p.locator("#cnpj").fill("00.000.000/0001-91");
      await p.waitForFunction(() => document.getElementById("empresa").value.length > 0, null, { timeout: 15000 }).catch(() => {});
      check(`${rotulo}: CNPJ preenche a empresa`, /BANCO DO BRASIL/.test(await p.locator("#empresa").inputValue()));
      await p.waitForFunction(() => document.getElementById("cidade").value.length > 0, null, { timeout: 15000 }).catch(() => {});
      check(`${rotulo}: CNPJ leva ao endereço pelo CEP`, /Bras[ií]lia/.test(await p.locator("#cidade").inputValue()), await p.locator("#cidade").inputValue());

      // Sem CNPJ: CPF; e o CEP de novo.
      await p.locator("[data-sem-cnpj]").click();
      check(`${rotulo}: "Não tenho CNPJ" mostra o CPF`, (await p.locator("#cpf").count()) === 1 && (await p.locator("#cnpj").count()) === 0);
      await p.locator("#cpf").fill("529.982.247-25");
      await p.locator("#cep").fill("");
      await p.locator("#endereco").fill("");
      await p.locator("#cep").pressSequentially("01001000");
      await p.waitForFunction(() => /Sé/.test(document.getElementById("endereco").value), null, { timeout: 15000 }).catch(() => {});
      check(`${rotulo}: CEP preenche o endereço`, /Praça da Sé/.test(await p.locator("#endereco").inputValue()));

      await p.locator("#whatsapp").fill("19999990000");
      await p.locator("#email").fill("teste@exemplo.com.br");
      await p.locator("#nome").fill("[TESTE] Pessoa de Teste");
      await p.locator("#numero").fill("100");

      // Janela de aceite (Pix).
      await p.locator("[data-contratar]").click();
      await p.locator("[data-janela-aceite]").waitFor({ timeout: 5000 }).catch(() => {});
      check(`${rotulo}: janela de aceite abre`, (await p.locator("[data-janela-aceite]").count()) === 1);
      check(`${rotulo}: Contratar travado sem o aceite`, await p.locator("[data-contratar-final]").isDisabled());
      const textoDaJanela = await p.locator("[data-janela-aceite]").innerText();
      check(`${rotulo}: janela traz os Termos`, /Sem fidelidade/.test(textoDaJanela) && /Desistência em 7 dias/.test(textoDaJanela));
      await p.locator("[data-aceite]").check();
      check(`${rotulo}: Contratar liberado com o aceite`, await p.locator("[data-contratar-final]").isEnabled());
      await p.locator("[data-contratar-final]").click();
      await p.locator('[data-resultado="pix"]').waitFor({ timeout: 5000 }).catch(() => {});
      check(`${rotulo}: tela do Pix`, (await p.locator('[data-resultado="pix"]').count()) === 1);

      // Cartão: de novo, até o aprovado.
      await p.goto(`${CHECKOUT}/?s=landing-page`, { waitUntil: "networkidle" });
      await p.locator('[data-forma="cartao"]').check();
      await p.locator("#whatsapp").fill("19999990000");
      await p.locator("#email").fill("teste@exemplo.com.br");
      await p.locator("[data-sem-cnpj]").click();
      await p.locator("#cpf").fill("529.982.247-25");
      await p.locator("#nome").fill("[TESTE] Pessoa de Teste");
      await p.locator("#cep").pressSequentially("01001000");
      await p.waitForFunction(() => document.getElementById("cidade").value.length > 0, null, { timeout: 15000 }).catch(() => {});
      await p.locator("#numero").fill("100");
      await p.locator("#cartao-numero").fill("4111 1111 1111 1112");
      await p.locator("#cartao-nome").fill("PESSOA DE TESTE");
      await p.locator("#cartao-validade").fill("12/30");
      await p.locator("#cartao-codigo").fill("123");
      await p.locator("[data-contratar]").click();
      check(`${rotulo}: cartão com número errado é barrado`, (await p.locator("#cartao-numero[aria-invalid=true]").count()) === 1);
      await p.locator("#cartao-numero").fill("4444 4444 4444 4444");
      await p.locator("[data-contratar]").click();
      await p.locator("[data-aceite]").check();
      await p.locator("[data-contratar-final]").click();
      await p.locator('[data-resultado="cartao"]').waitFor({ timeout: 5000 }).catch(() => {});
      const aprovado = (await p.locator('[data-resultado="cartao"]').innerText().catch(() => "")).replace(/\s/g, " ");
      check(`${rotulo}: tela do cartão aprovado em 12x`, /12x de R\$ 133,33/.test(aprovado), aprovado.slice(0, 120));

      check(`${rotulo}: nenhum pedido ao Google`, doGoogle.length === 0, doGoogle[0]);
      check(`${rotulo}: nenhum cookie`, (await ctx.cookies()).length === 0);
      check(`${rotulo}: console sem erros`, erros.length === 0, erros[0]);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);

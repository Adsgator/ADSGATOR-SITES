// Quando algo falha no meio do pagamento (plano geral, Parte 4, proteção do checkout), com um
// Asaas e um painel falsos, na memória deste teste: cartão recusado, resposta que se perde
// depois de cobrar, painel fora do ar, assinatura que não nasce, Pix repetido e trocado pelo
// cartão. O sandbox não serve para isto: em 2026-11-23 ele aprovou os cartões de recusa da
// documentação. Sobe o próprio site (next dev, porta 3006) apontado para os falsos e fecha no
// fim; pare o next dev da porta 3005 antes (um por pasta). Nada sai para fora.
// As regras de verdade da vez e dos limites são do banco do painel
// (ADSGATOR-PAINEL/tests/banco/checkout-tentativas.mjs); aqui o painel falso só as imita.
// Uso: node tests/checkout-falhas.mjs
import { spawn, execFileSync } from "node:child_process";
import http from "node:http";

const PORTA_FALSA = 4016;
const PORTA = 3006;
const SITE = `http://checkout.localhost:${PORTA}`;
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}

// Os falsos -------------------------------------------------------------------------------

let links, tentativas, contratacoes, mensalidades, falhasDeAssinatura, clientes, pagamentos, assinaturas, modo, proximo;
function zerar() {
  links = new Map();
  tentativas = [];
  contratacoes = [];
  mensalidades = [];
  falhasDeAssinatura = [];
  clientes = [];
  pagamentos = [];
  assinaturas = [];
  modo = {};
  proximo = 1;
}
zerar();
const recusas = (codigo) => tentativas.filter((t) => t.codigo === codigo && t.resultado === "recusada").length;

function painel(metodo, caminho, corpo) {
  if (modo.painelFora?.(caminho, corpo)) return [502, { erro: "fora" }];
  const link = /^\/api\/checkout\/link\/(.+)$/.exec(caminho);
  if (link) {
    const l = links.get(link[1]);
    return l ? [200, l] : [404, {}];
  }
  if (caminho === "/api/checkout/tentativa" && corpo.acao === "reservar") {
    const l = links.get(corpo.codigo);
    if (!l) return [200, { ok: false, motivo: "invalido" }];
    if (l.pago) return [200, { ok: false, motivo: "pago" }];
    const doLink = tentativas.filter((t) => t.codigo === corpo.codigo);
    if (doLink.some((t) => t.resultado === "andamento")) return [200, { ok: false, motivo: "em_andamento" }];
    if (corpo.forma === "cartao" && recusas(corpo.codigo) >= 5) return [200, { ok: false, motivo: "cartao_travado" }];
    const id = `t${proximo++}`;
    tentativas.push({ id, codigo: corpo.codigo, forma: corpo.forma, resultado: "andamento" });
    return [200, { ok: true, tentativa: id, conferir: doLink.some((t) => ["criada", "incerta"].includes(t.resultado)) }];
  }
  if (caminho === "/api/checkout/tentativa") {
    Object.assign(tentativas.find((t) => t.id === corpo.tentativa), { resultado: corpo.resultado, cobranca: corpo.cobranca });
    return [200, { ok: true }];
  }
  if (caminho === "/api/checkout/contratacao") {
    contratacoes.push(corpo);
    return [200, { id: "x" }];
  }
  if (caminho === "/api/checkout/mensalidade") {
    mensalidades.push(corpo);
    return [200, { ok: true }];
  }
  if (caminho === "/api/checkout/assinatura") {
    falhasDeAssinatura.push(corpo);
    return [200, { ok: true }];
  }
  return [404, {}];
}

function asaas(metodo, caminho, q, corpo) {
  if (caminho === "/customers" && metodo === "GET") return [200, { data: clientes.filter((c) => c.cpfCnpj === q.get("cpfCnpj")) }];
  if (caminho === "/customers") {
    const c = { id: `cus_${proximo++}`, ...corpo };
    clientes.push(c);
    return [200, c];
  }
  if (/^\/customers\//.test(caminho)) return [200, clientes.find((c) => c.id === caminho.split("/")[2]) ?? {}];
  if (caminho === "/payments" && metodo === "GET") return [200, { data: pagamentos.filter((p) => p.externalReference === q.get("externalReference") && !p.deleted) }];
  if (caminho === "/payments") {
    if (corpo.creditCard?.number.endsWith("0002"))
      return [400, { errors: [{ code: "invalid_creditCard", description: "Transação não autorizada. Verifique os dados do cartão de crédito e tente novamente." }] }];
    const p = {
      id: `pay_teste${proximo++}`, customer: corpo.customer, billingType: corpo.billingType, dueDate: corpo.dueDate, value: corpo.value ?? corpo.totalValue,
      externalReference: corpo.externalReference, status: corpo.billingType === "PIX" ? "PENDING" : "CONFIRMED",
    };
    pagamentos.push(p);
    // Cobrou, mas a resposta se perdeu.
    if (modo.perderResposta) return modo.perderResposta === "sumir" ? "cair" : "cair-e-esconder";
    return [200, p];
  }
  const qr = /^\/payments\/(.+)\/pixQrCode$/.exec(caminho);
  if (qr) return [200, { encodedImage: "x", payload: `pix-${qr[1]}`, expirationDate: "" }];
  const pag = /^\/payments\/(.+)$/.exec(caminho);
  if (pag && metodo === "DELETE") {
    const p = pagamentos.find((x) => x.id === pag[1]);
    if (p.status !== "PENDING") return [400, { errors: [{ code: "invalid_action", description: "já paga" }] }];
    p.deleted = true;
    return [200, { deleted: true }];
  }
  if (pag) return [200, pagamentos.find((x) => x.id === pag[1])];
  if (caminho === "/subscriptions" && metodo === "GET") return [200, { data: assinaturas.filter((a) => a.customer === q.get("customer")) }];
  if (caminho === "/subscriptions") {
    modo.tentativasDeAssinatura = (modo.tentativasDeAssinatura ?? 0) + 1;
    if (modo.assinatura === "erro") return [500, { errors: [{ code: "x", description: "instável" }] }];
    if (modo.assinatura === "recusa") return [400, { errors: [{ code: "invalid", description: "recusada" }] }];
    const a = { id: `sub_${proximo++}`, ...corpo };
    assinaturas.push(a);
    // A assinatura gera a cobrança do 1º vencimento dela, com a mesma referência (como no sandbox).
    pagamentos.push({ id: `pay_teste${proximo++}`, customer: corpo.customer, billingType: corpo.billingType, dueDate: corpo.nextDueDate, value: corpo.value, externalReference: corpo.externalReference, status: "PENDING", subscription: a.id });
    if (modo.assinatura === "perder") {
      modo.assinatura = null;
      return "cair";
    }
    return [200, a];
  }
  return [404, {}];
}

const servidor = http.createServer(async (req, res) => {
  let bruto = "";
  for await (const pedaco of req) bruto += pedaco;
  const corpo = bruto ? JSON.parse(bruto) : {};
  const url = new URL(req.url, "http://x");
  const r = url.pathname.startsWith("/sandbox/v3")
    ? modo.asaasEscondido && req.method === "GET" && url.pathname.endsWith("/payments")
      ? [500, {}]
      : asaas(req.method, url.pathname.replace("/sandbox/v3", ""), url.searchParams, corpo)
    : painel(req.method, url.pathname, corpo);
  if (r === "cair" || r === "cair-e-esconder") {
    if (r === "cair-e-esconder") modo.asaasEscondido = true;
    res.destroy();
    return;
  }
  res.writeHead(r[0], { "content-type": "application/json" }).end(JSON.stringify(r[1]));
});
await new Promise((ok) => servidor.listen(PORTA_FALSA, ok));

const site = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "-p", String(PORTA)], {
  env: {
    ...process.env,
    ASAAS_API_URL: `http://localhost:${PORTA_FALSA}/sandbox/v3`,
    ASAAS_API_KEY: "falsa",
    PAINEL_URL: `http://localhost:${PORTA_FALSA}`,
    CHECKOUT_PAINEL_SEGREDO: "falso",
  },
  stdio: "ignore",
});

const dados = {
  whatsapp: "(19) 99999-0000", email: "teste@exemplo.com.br", cpf: "529.982.247-25", nome: "[TESTE] Pessoa de Teste",
  cep: "01001-000", endereco: "Praça da Sé", numero: "100", bairro: "Sé", cidade: "São Paulo", uf: "SP",
};
const bom = { numero: "4444 4444 4444 4444", nome: "PESSOA DE TESTE", validade: "12/30", codigo: "123" };
const ruim = { ...bom, numero: "4000 0000 0000 0002" };
const post = (caminho, corpo) =>
  fetch(SITE + caminho, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) }).then(async (x) => ({ status: x.status, j: await x.json().catch(() => ({})) }));
const contratar = (codigo, forma, cartao = bom, extra = {}) =>
  post("/contratar", { codigo, forma, parcelas: 1, semCnpj: true, dados, cartao: forma === "cartao" ? cartao : {}, aceite: true, ...extra });
const pagarMensalidade = (codigo, forma, cartao = bom) => post("/mensalidade/pagar", { codigo, forma, cartao: forma === "cartao" ? cartao : {} });
const link = (codigo, servicos, tipo = "contratacao", asaas_id = null) =>
  links.set(codigo, { tipo, servicos, dia_gerado: new Date().toISOString().slice(0, 10), valido: true, pago: false, cliente: { nome: "x", empresa: "", asaas_id } });
// As cobranças de verdade (sem a que a assinatura gera para o mês seguinte).
const cobrancas = () => pagamentos.filter((p) => !p.deleted && !p.subscription);

try {
  for (let i = 0; i < 60; i++) {
    const ok = await fetch(`${SITE}/ZZZZZZ`, { signal: AbortSignal.timeout(30000) }).then((r) => r.status === 200, () => false);
    if (ok) break;
    await new Promise((x) => setTimeout(x, 1000));
  }

  // Dois pedidos juntos.
  for (const forma of ["cartao", "pix"]) {
    zerar();
    link("DUP222", ["landing-page"]);
    const r = await Promise.all([contratar("DUP222", forma), contratar("DUP222", forma)]);
    check(`${forma}: dois pedidos juntos criam uma cobrança`, cobrancas().length === 1 && clientes.length === 1, `${r.map((x) => x.status)}; ${cobrancas().length}`);
    check(`${forma}: o outro é mandado esperar`, r.some((x) => x.status === 409 && /2 minutos/.test(x.j.erro)), JSON.stringify(r.map((x) => x.j.erro)));
  }

  // Pix de novo, e o cartão no lugar do Pix.
  zerar();
  link("PXN222", ["landing-page"]);
  const p1 = await contratar("PXN222", "pix");
  const p2 = await contratar("PXN222", "pix");
  check("Pix pedido de novo é o mesmo", cobrancas().length === 1 && p1.j.cobranca === p2.j.cobranca, `${p1.j.cobranca} ${p2.j.cobranca}`);
  const c3 = await contratar("PXN222", "cartao");
  check("cartão depois do Pix apaga o Pix e cobra no cartão", c3.j.situacao === "aprovado" && cobrancas().length === 1 && cobrancas()[0].billingType === "CREDIT_CARD" && pagamentos[0].deleted);
  const c4 = await contratar("PXN222", "cartao");
  check("cartão de novo não cobra de novo", c4.j.ok === true && cobrancas().length === 1);

  // Pix já pago e a pessoa tenta o cartão antes de o painel saber.
  zerar();
  link("PGO222", ["landing-page"]);
  await contratar("PGO222", "pix");
  pagamentos[0].status = "RECEIVED";
  const pago = await contratar("PGO222", "cartao");
  check("Pix já pago não deixa cobrar o cartão", pago.j.ok === true && cobrancas().length === 1 && contratacoes.at(-1).forma === "pix" && contratacoes.at(-1).pago === true);

  // Cartões recusados.
  zerar();
  link("REC222", ["landing-page"]);
  const status = [];
  for (let i = 0; i < 6; i++) status.push(await contratar("REC222", "cartao", ruim));
  check("5 recusas passam a mensagem do Asaas", status.slice(0, 5).every((x) => x.status === 422 && /não autorizada/.test(x.j.erro)), status.map((x) => x.status).join(" "));
  check("a 6ª nem chega ao Asaas e oferece o Pix", status[5].status === 429 && /Pix/.test(status[5].j.erro), status[5].j.erro);
  check("nada foi cobrado", cobrancas().length === 0);
  check("e o Pix funciona", (await contratar("REC222", "pix")).j.ok === true);

  // Cobrou e a resposta se perdeu.
  zerar();
  link("PRD222", ["landing-page"]);
  modo.perderResposta = "sumir";
  const perdida = await contratar("PRD222", "cartao");
  check("resposta perdida: confere e mostra aprovado", perdida.j.ok === true && perdida.j.situacao === "aprovado" && contratacoes.length === 1, JSON.stringify(perdida.j));

  // Cobrou, a resposta se perdeu e o Asaas não deixa conferir.
  zerar();
  link("INC222", ["landing-page"]);
  modo.perderResposta = "esconder";
  const incerta = await contratar("INC222", "cartao");
  check("sem como conferir, não diz que nada foi cobrado", incerta.status === 503 && /espere uns 2 minutos/.test(incerta.j.erro) && !/Nada foi cobrado/.test(incerta.j.erro), JSON.stringify(incerta.j));
  check("a tentativa fica incerta", tentativas[0].resultado === "incerta");
  modo = {};
  const depois = await contratar("INC222", "cartao");
  check("na próxima, acha a cobrança e não cobra de novo", depois.j.situacao === "aprovado" && cobrancas().length === 1 && contratacoes.length === 1);

  // O painel fora.
  zerar();
  link("PNL222", ["landing-page"]);
  modo.painelFora = (caminho) => caminho === "/api/checkout/tentativa";
  const semPainel = await contratar("PNL222", "cartao");
  check("sem o painel para reservar, não cobra", semPainel.status === 502 && cobrancas().length === 0, JSON.stringify(semPainel.j));
  modo.painelFora = (caminho) => caminho === "/api/checkout/contratacao";
  const semRegistro = await contratar("PNL222", "cartao");
  check("cobrou e o painel não registrou: a pessoa vê aprovado e a tentativa fica incerta", semRegistro.j.situacao === "aprovado" && tentativas.at(-1).resultado === "incerta");
  modo = {};
  await contratar("PNL222", "cartao");
  check("na próxima, registra sem cobrar de novo", cobrancas().length === 1 && contratacoes.length === 1 && contratacoes[0].asaas_cobranca === pagamentos[0].id);

  // A assinatura (contratação só do Google Ads).
  zerar();
  link("ASS222", ["google-ads"]);
  modo.assinatura = "erro";
  const semAss = await contratar("ASS222", "cartao");
  check("assinatura instável: tenta 3 vezes, a pessoa vê aprovado e o painel é avisado", semAss.j.situacao === "aprovado" && modo.tentativasDeAssinatura === 3 && falhasDeAssinatura.length === 1, JSON.stringify(falhasDeAssinatura));
  check("o aviso leva o que precisa para criar à mão", falhasDeAssinatura[0]?.valor === 500 && /^cus_/.test(falhasDeAssinatura[0].asaas_cliente) && /^\d{4}-\d{2}-\d{2}$/.test(falhasDeAssinatura[0].proximo) && falhasDeAssinatura[0].codigo === "ASS222");
  zerar();
  link("ASR222", ["google-ads"]);
  modo.assinatura = "recusa";
  await contratar("ASR222", "cartao");
  check("assinatura recusada: não insiste e avisa", modo.tentativasDeAssinatura === 1 && falhasDeAssinatura.length === 1);
  zerar();
  link("ASP222", ["google-ads"]);
  modo.assinatura = "perder";
  await contratar("ASP222", "cartao");
  check("assinatura que nasceu sem a resposta não é criada de novo nem avisada", assinaturas.length === 1 && falhasDeAssinatura.length === 0);
  zerar();
  link("ASK222", ["google-ads"]);
  await contratar("ASK222", "pix");
  check("assinatura normal: uma só, sem aviso", assinaturas.length === 1 && falhasDeAssinatura.length === 0);
  const pixDeNovo = await contratar("ASK222", "pix");
  check("de novo: o mesmo Pix (e não o do mês seguinte) e a mesma assinatura", assinaturas.length === 1 && cobrancas().length === 1 && pixDeNovo.j.cobranca === cobrancas()[0].id);

  // A mensalidade pelo link.
  zerar();
  clientes.push({ id: "cus_9", name: "[TESTE] Cliente", cpfCnpj: "52998224725", email: "teste@exemplo.com.br", postalCode: "01001000", addressNumber: "1", mobilePhone: "19999990000" });
  link("MEN222", ["google-ads"], "mensalidade", "cus_9");
  modo.assinatura = "erro";
  const men = await pagarMensalidade("MEN222", "cartao");
  check("mensalidade sem assinatura: paga e avisa", men.j.situacao === "aprovado" && falhasDeAssinatura.length === 1 && mensalidades.length === 1, JSON.stringify(men.j));
  modo = {};
  const menDeNovo = await pagarMensalidade("MEN222", "cartao");
  check("o link não cobra a 1ª de novo", menDeNovo.status === 409 && cobrancas().length === 1, JSON.stringify(menDeNovo.j));
  const pagina = await fetch(`${SITE}/MEN222`).then((r) => r.text());
  check("e a página diz que já está ativa", /data-aviso-link="ativado"/.test(pagina));
  zerar();
  clientes.push({ id: "cus_9", name: "[TESTE] Cliente", cpfCnpj: "52998224725", email: "teste@exemplo.com.br", postalCode: "01001000", addressNumber: "1", mobilePhone: "19999990000" });
  link("MDU222", ["google-ads"], "mensalidade", "cus_9");
  await Promise.all([pagarMensalidade("MDU222", "cartao"), pagarMensalidade("MDU222", "cartao")]);
  check("mensalidade: dois pedidos juntos, uma cobrança e uma assinatura", cobrancas().length === 1 && assinaturas.length === 1, `${cobrancas().length} e ${assinaturas.length}`);
} finally {
  servidor.close();
  if (process.platform === "win32") {
    try {
      execFileSync("taskkill", ["/PID", String(site.pid), "/T", "/F"], { stdio: "ignore" });
    } catch {
      // Já fechou.
    }
  } else site.kill();
}
console.log(falhas === 0 ? "\nTudo certo" : `\n${falhas} falha(s)`);
process.exit(falhas ? 1 : 0);

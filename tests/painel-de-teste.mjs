// Ajudante dos testes do checkout: cria no banco do painel (repositório vizinho,
// ../ADSGATOR-PAINEL, no computador do Lucas) os clientes "[TESTE] Checkout ..."
// e os links que os testes abrem, e apaga tudo no fim (os links, as
// contratações, os processos e os avisos saem junto com o cliente).
// O painel precisa estar rodando para o checkout conversar com ele (PAINEL_URL
// do .env.local do site; nos testes, http://localhost:3010).

const { db } = await import(new URL("../../ADSGATOR-PAINEL/tests/sessao.mjs", import.meta.url));

export const PREFIXO = "[TESTE] Checkout";

let conexao;
async function banco() {
  conexao ??= await db();
  return conexao;
}

/** Um contato em negociação com o Comercial andando (como quem recebeu a proposta). */
export async function criarCliente(nome, { asaasId = null, email = "teste-checkout@exemplo.com" } = {}) {
  const c = await banco();
  const { rows } = await c.query(
    `insert into public.clientes (nome, empresa, email, situacao, asaas_id)
     values ($1, $1, $2, 'negociacao', $3) returning id`,
    [`${PREFIXO} ${nome}`, email, asaasId],
  );
  await c.query("select public.iniciar_processo($1, 'comercial', 'lucas')", [rows[0].id]);
  return rows[0].id;
}

/** Um link como o da ficha. `diaGerado` muda o dia (ex.: 16 dias atrás, para vencido). */
export async function criarLink(cliente, tipo, servicos, { diaGerado } = {}) {
  const c = await banco();
  const { rows } = await c.query(
    `insert into public.checkout_links (codigo, tipo, cliente_id, servicos, dia_gerado, valido_ate)
     values (private.codigo_checkout(), $1, $2, $3,
             coalesce($4::date, private.hoje()), coalesce($4::date, private.hoje()) + 15)
     returning codigo`,
    [tipo, cliente, servicos, diaGerado ?? null],
  );
  return rows[0].codigo;
}

export async function umDoPainel(sql, params = []) {
  return (await (await banco()).query(sql, params)).rows[0];
}

/** Apaga os clientes de teste do checkout (e tudo o que é deles) e fecha a conexão. */
export async function limparPainel() {
  const c = await banco();
  const { rowCount } = await c.query("delete from public.clientes where nome like $1", [`${PREFIXO}%`]);
  await c.end();
  conexao = undefined;
  return rowCount;
}

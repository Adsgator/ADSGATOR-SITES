// As cidades da região de uma cidade, de verdade, para o briefing sugerir (IBGE, região
// geográfica imediata; grátis e sem chave; testado em 2026-11-24). Bairro não tem fonte
// confiável: fica livre para a pessoa escrever.

type Municipio = { nome: string; "regiao-imediata": { id: number; nome: string } };

/** Muda raramente: vale a resposta guardada por um mês. */
const UM_MES = 60 * 60 * 24 * 30;

const simples = (t: string) => t.normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase();

export async function regiaoDaCidade(uf: string, cidade: string): Promise<Response> {
  if (!/^[A-Za-z]{2}$/.test(uf) || !/^[\p{L} .'-]{2,60}$/u.test(cidade)) {
    return Response.json({ erro: "Cidade inválida" }, { status: 400 });
  }
  try {
    const r = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf.toUpperCase()}/municipios`, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate: UM_MES },
    });
    if (!r.ok) return Response.json({ erro: "Consulta indisponível" }, { status: 502 });
    const lista = (await r.json()) as Municipio[];
    const achada = lista.find((m) => simples(m.nome) === simples(cidade));
    if (!achada) return Response.json({ erro: "Cidade não encontrada" }, { status: 404 });
    const regiao = achada["regiao-imediata"];
    return Response.json({
      cidade: achada.nome,
      regiao: regiao.nome,
      vizinhas: lista.filter((m) => m["regiao-imediata"].id === regiao.id && m.nome !== achada.nome).map((m) => m.nome),
    });
  } catch {
    return Response.json({ erro: "Consulta indisponível" }, { status: 502 });
  }
}

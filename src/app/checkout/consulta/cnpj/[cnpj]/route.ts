import { cnpjValido, soDigitos } from "@/lib/checkout/campos";

// Nome da empresa e CEP pelo CNPJ, para o checkout preencher sozinho
// (BrasilAPI, grátis e sem chave; testado em 2026-11-21). O endereço vem
// depois pelo CEP, que tem a escrita normal (a Receita manda tudo em
// maiúsculas). Se falhar, a pessoa digita.

type RespostaBrasilApi = {
  razao_social?: string;
  nome_fantasia?: string;
  cep?: string;
  numero?: string;
  descricao_situacao_cadastral?: string;
};

export async function GET(_req: Request, ctx: RouteContext<"/checkout/consulta/cnpj/[cnpj]">) {
  const cnpj = soDigitos((await ctx.params).cnpj);
  if (!cnpjValido(cnpj)) return Response.json({ erro: "CNPJ inválido" }, { status: 400 });

  try {
    const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      headers: { "User-Agent": "adsgator-checkout" },
      signal: AbortSignal.timeout(6000),
    });
    if (r.status === 404 || r.status === 400) return Response.json({ erro: "CNPJ não encontrado" }, { status: 404 });
    if (!r.ok) return Response.json({ erro: "Consulta indisponível" }, { status: 502 });
    const j = (await r.json()) as RespostaBrasilApi;
    const numero = (j.numero ?? "").trim();
    return Response.json({
      empresa: j.razao_social ?? "",
      cep: soDigitos(j.cep ?? ""),
      numero: /^\d+$/.test(numero) ? numero : "",
      ativa: (j.descricao_situacao_cadastral ?? "ATIVA") === "ATIVA",
    });
  } catch {
    return Response.json({ erro: "Consulta indisponível" }, { status: 502 });
  }
}

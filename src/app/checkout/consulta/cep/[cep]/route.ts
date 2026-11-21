import { soDigitos } from "@/lib/checkout/campos";

// Endereço pelo CEP, para o checkout preencher sozinho (ViaCEP, grátis e sem
// chave; testado em 2026-11-21). Passa pelo servidor para a CSP do checkout
// continuar só com o próprio endereço. Se falhar, a pessoa digita.

type RespostaViaCep = {
  erro?: boolean | string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
};

export async function GET(_req: Request, ctx: RouteContext<"/checkout/consulta/cep/[cep]">) {
  const cep = soDigitos((await ctx.params).cep);
  if (cep.length !== 8) return Response.json({ erro: "CEP inválido" }, { status: 400 });

  try {
    const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      headers: { "User-Agent": "adsgator-checkout" },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return Response.json({ erro: "Consulta indisponível" }, { status: 502 });
    const j = (await r.json()) as RespostaViaCep;
    if (j.erro) return Response.json({ erro: "CEP não encontrado" }, { status: 404 });
    return Response.json({
      endereco: j.logradouro ?? "",
      bairro: j.bairro ?? "",
      cidade: j.localidade ?? "",
      uf: j.uf ?? "",
    });
  } catch {
    return Response.json({ erro: "Consulta indisponível" }, { status: 502 });
  }
}

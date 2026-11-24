import { situacaoDaCobranca } from "@/lib/checkout/asaas";
import { SITUACOES_PAGAS } from "@/lib/checkout/vez";

// Se a cobrança do Pix já foi paga, para a tela de pagamento mudar sozinha.
// Devolve só sim ou não; o id da cobrança vem da resposta da contratação.

export async function GET(_req: Request, ctx: RouteContext<"/checkout/situacao/[cobranca]">) {
  const { cobranca } = await ctx.params;
  if (!/^pay_[A-Za-z0-9_]{6,40}$/.test(cobranca)) return Response.json({ erro: "Cobrança inválida" }, { status: 400 });
  try {
    return Response.json({ pago: SITUACOES_PAGAS.includes(await situacaoDaCobranca(cobranca)) });
  } catch {
    return Response.json({ erro: "Consulta indisponível" }, { status: 502 });
  }
}

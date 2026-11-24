import { ErroDoAsaas } from "@/lib/checkout/asaas";
import { contratar, ipDoComprador, lerPedido } from "@/lib/checkout/contratacao";

// Contratação pelo checkout (plano geral, Parte 4). Os dados do cartão passam
// por aqui a caminho do Asaas e não são guardados nem registrados em log.

// O Asaas pede pelo menos 60 segundos de tempo limite no cartão; depois disso o servidor
// ainda confere se a cobrança passou (src/lib/checkout/vez.ts). O painel dá a tentativa por
// perdida depois de 150 segundos: este limite fica sempre abaixo.
export const maxDuration = 120;

const ERRO_GERAL =
  "Não foi possível concluir agora. Nada foi cobrado. Tente de novo em instantes ou fale com a gente no WhatsApp.";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 20_000)
    return Response.json({ ok: false, erro: "Pedido grande demais." }, { status: 413 });

  const pedido = lerPedido(await request.json().catch(() => null));
  if (!pedido) return Response.json({ ok: false, erro: "Pedido inválido." }, { status: 400 });

  try {
    const { status, corpo } = await contratar(pedido, ipDoComprador(request.headers), request.headers.get("user-agent") ?? "");
    return Response.json(corpo, { status });
  } catch (e) {
    // 400 do Asaas: cartão recusado ou dado que ele não aceitou; a mensagem dele
    // é em português e serve para a pessoa (ex.: "Transação não autorizada...").
    if (e instanceof ErroDoAsaas && e.status === 400)
      return Response.json({ ok: false, erro: e.descricao }, { status: 422 });
    console.error("checkout: contratação falhou", e instanceof Error ? e.message : String(e));
    return Response.json({ ok: false, erro: ERRO_GERAL }, { status: 502 });
  }
}

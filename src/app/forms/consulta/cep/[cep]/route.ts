import { enderecoDoCep } from "@/lib/cep";

// Endereço pelo CEP, para o briefing preencher sozinho (src/lib/cep.ts).

export async function GET(_req: Request, ctx: RouteContext<"/forms/consulta/cep/[cep]">) {
  return enderecoDoCep((await ctx.params).cep);
}

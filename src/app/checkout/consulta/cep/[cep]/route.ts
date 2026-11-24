import { enderecoDoCep } from "@/lib/cep";

// Endereço pelo CEP, para o checkout preencher sozinho (src/lib/cep.ts).

export async function GET(_req: Request, ctx: RouteContext<"/checkout/consulta/cep/[cep]">) {
  return enderecoDoCep((await ctx.params).cep);
}

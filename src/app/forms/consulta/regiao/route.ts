import { regiaoDaCidade } from "@/lib/regiao";

// As cidades vizinhas, para o briefing sugerir (src/lib/regiao.ts).

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  return regiaoDaCidade((q.get("uf") ?? "").trim(), (q.get("cidade") ?? "").trim());
}

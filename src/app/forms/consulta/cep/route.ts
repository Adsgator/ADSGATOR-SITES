import { cepsDaRua } from "@/lib/cep";

// O CEP pela rua, para quem não sabe o número (src/lib/cep.ts).

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const [uf, cidade, rua] = ["uf", "cidade", "rua"].map((n) => (q.get(n) ?? "").trim());
  return cepsDaRua(uf, cidade, rua);
}

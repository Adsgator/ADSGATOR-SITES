import { soDigitos } from "@/lib/checkout/campos";

// Endereço pelo CEP, e CEP pelo endereço, para o checkout e o briefing preencherem
// sozinhos (ViaCEP, grátis e sem chave; testado em 2026-11-21 e 2026-11-24). Passa pelo
// servidor para a CSP continuar só com o próprio endereço. Se falhar, a pessoa digita.

type EnderecoDoViaCep = {
  erro?: boolean | string;
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
};

const indisponivel = () => Response.json({ erro: "Consulta indisponível" }, { status: 502 });

async function viaCep(caminho: string) {
  const r = await fetch(`https://viacep.com.br/ws/${caminho}/json/`, { signal: AbortSignal.timeout(5000) });
  if (!r.ok) throw new Error(`ViaCEP ${r.status}`);
  return (await r.json()) as unknown;
}

export async function enderecoDoCep(texto: string): Promise<Response> {
  const cep = soDigitos(texto);
  if (cep.length !== 8) return Response.json({ erro: "CEP inválido" }, { status: 400 });
  try {
    const j = (await viaCep(cep)) as EnderecoDoViaCep;
    if (j.erro) return Response.json({ erro: "CEP não encontrado" }, { status: 404 });
    return Response.json({
      endereco: j.logradouro ?? "",
      bairro: j.bairro ?? "",
      cidade: j.localidade ?? "",
      uf: j.uf ?? "",
    });
  } catch {
    return indisponivel();
  }
}

/** Para quem não sabe o CEP: até 8 ruas com esse nome na cidade. */
export async function cepsDaRua(uf: string, cidade: string, rua: string): Promise<Response> {
  const ok = /^[A-Za-z]{2}$/.test(uf) && [cidade, rua].every((t) => t.length >= 3 && t.length <= 80 && /^[\p{L}\d .'-]+$/u.test(t));
  if (!ok) return Response.json({ erro: "Escreva o estado, a cidade e a rua" }, { status: 400 });
  try {
    const lista = (await viaCep([uf, cidade, rua].map(encodeURIComponent).join("/"))) as EnderecoDoViaCep[];
    return Response.json(
      lista.slice(0, 8).map((j) => ({
        cep: soDigitos(j.cep ?? ""),
        endereco: j.logradouro ?? "",
        bairro: j.bairro ?? "",
        cidade: j.localidade ?? "",
        uf: j.uf ?? "",
      })),
    );
  } catch {
    return indisponivel();
  }
}

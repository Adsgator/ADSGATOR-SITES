// SEO de todas as páginas: título único, descrição com tamanho bom, endereço
// oficial (canonical), imagem de compartilhamento, dados estruturados válidos
// (a empresa em todas; o serviço nas páginas de serviço), o mapa do site com
// todas as páginas respondendo e o robots apontando para ele.
// Uso: node tests/seo.mjs [endereço base]   (padrão: http://localhost:3005)

const BASE = process.argv[2] ?? "http://localhost:3005";
const OFICIAL = "https://www.adsgator.com.br";
const paginas = ["/", "/google-ads", "/landing-page", "/manutencao", "/como-funciona", "/portfolio", "/quem-esta-por-tras", "/termos", "/privacidade"];
const servicos = ["/google-ads", "/landing-page", "/manutencao"];
let falhas = 0;
function check(nome, ok, detalhe = "") {
  console.log(`${ok ? "ok  " : "FALHA"} ${nome}${detalhe ? ` (${detalhe})` : ""}`);
  if (!ok) falhas++;
}

const meta = (html, atributo, nome) => html.match(new RegExp(`<meta ${atributo}="${nome}" content="([^"]*)"`))?.[1] ?? "";
const titulos = new Map();
for (const caminho of paginas) {
  const resposta = await fetch(BASE + caminho);
  const html = await resposta.text();
  const titulo = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const descricao = meta(html, "name", "description");
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
  const imagem = meta(html, "property", "og:image");
  let tipos = [];
  try {
    tipos = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
      .map((m) => JSON.parse(m[1]))
      .flatMap((b) => (b["@graph"] ? b["@graph"].map((g) => g["@type"]) : [b["@type"]]));
  } catch {
    tipos = ["JSON inválido"];
  }
  const canonicalCerto = canonical.replace(/\/$/, "") === (OFICIAL + caminho).replace(/\/$/, "");
  const ldCerto = tipos.includes("Organization") && (!servicos.includes(caminho) || tipos.includes("Service"));
  check(
    `${caminho}: título, descrição, canonical, imagem e dados estruturados`,
    resposta.status === 200 && titulo.length >= 10 && titulo.length <= 65 && descricao.length >= 50 && descricao.length <= 170 && canonicalCerto && imagem && ldCerto,
    `título ${titulo.length} car., descrição ${descricao.length} car., canonical ${canonicalCerto ? "ok" : canonical}, ${tipos.join("+")}`,
  );
  titulos.set(titulo, (titulos.get(titulo) ?? 0) + 1);
}
const repetidos = [...titulos].filter(([, n]) => n > 1).map(([t]) => t);
check("títulos diferentes em cada página", repetidos.length === 0, repetidos.join(" | "));

// A Central de Ajuda (ajuda.adsgator.com.br): título, descrição e canonical no
// endereço dela.
const AJUDA = BASE.startsWith("https://") ? "https://ajuda.adsgator.com.br" : BASE.replace("://localhost", "://ajuda.localhost");
for (const caminho of ["/", "/aceitar-convite", "/configurar-pagamento", "/id-da-conta", "/acesso-ao-perfil", "/adicionar-saldo"]) {
  const resposta = await fetch(AJUDA + caminho);
  const html = await resposta.text();
  const titulo = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const descricao = meta(html, "name", "description");
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
  check(
    `ajuda ${caminho}: título, descrição e canonical`,
    resposta.status === 200 && titulo.length >= 10 && titulo.length <= 65 && descricao.length >= 50 && descricao.length <= 170 && canonical.replace(/\/$/, "") === `https://ajuda.adsgator.com.br${caminho}`.replace(/\/$/, ""),
    `título ${titulo.length} car., descrição ${descricao.length} car., ${canonical}`,
  );
}

const mapa = await (await fetch(BASE + "/sitemap.xml")).text();
const noMapa = [...mapa.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1].replace(OFICIAL, "") || "/");
check("o mapa do site tem todas as páginas", paginas.every((p) => noMapa.includes(p)), noMapa.join(" "));
const robots = await (await fetch(BASE + "/robots.txt")).text();
check("o robots libera o site e aponta o mapa", /Allow: \//.test(robots) && robots.includes(`${OFICIAL}/sitemap.xml`), robots.replace(/\n/g, " "));

console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);

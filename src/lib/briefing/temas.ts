// O que o estilo, as cores e a sensação mudam no desenho da página. Cada estilo tem
// a própria composição (o topo, a foto, a textura, a letra), as cores da pessoa
// entram por cima, e cada sensação acrescenta um efeito.

export type Topo = "centro" | "lado" | "cheio" | "editorial";
export type Foto = "arco" | "circulo" | "quadro" | "inclinada" | "folha" | "corte";
export type Textura = "nenhuma" | "grade" | "pontos" | "fios" | "ondas" | "raios";

export type Estilo = {
  nome: string;
  /** O que o estilo passa, em poucas palavras. */
  fala: string;
  fundo: string;
  tinta: string;
  destaque: string;
  apoio: string;
  escuro?: true;
  fonte: string;
  peso: number;
  raio: string;
  topo: Topo;
  foto: Foto;
  textura: Textura;
  maiusculas?: true;
  italico?: true;
};

const sans = "var(--font-geist-sans)";
const serifa = "Georgia, 'Times New Roman', serif";
const slab = "servus-slab, Georgia, serif";
const mono = "var(--font-geist-mono)";
const redonda = "'Trebuchet MS', ui-rounded, system-ui, sans-serif";
const condensada = "Impact, 'Arial Narrow Bold', 'Arial Black', sans-serif";

export const estilos: Estilo[] = [
  { nome: "Moderno", fala: "Limpo e atual", fundo: "#ffffff", tinta: "#0f172a", destaque: "#2563eb", apoio: "#dbeafe", fonte: sans, peso: 700, raio: "0.6rem", topo: "lado", foto: "quadro", textura: "nenhuma" },
  { nome: "Minimalista", fala: "Pouca coisa, muito espaço", fundo: "#fafafa", tinta: "#18181b", destaque: "#18181b", apoio: "#e8e8ea", fonte: sans, peso: 400, raio: "0", topo: "editorial", foto: "quadro", textura: "nenhuma" },
  { nome: "Elegante", fala: "Fino e discreto", fundo: "#f5f1ea", tinta: "#2b2420", destaque: "#8a6a3f", apoio: "#e6dccb", fonte: serifa, peso: 400, raio: "0", topo: "centro", foto: "arco", textura: "fios" },
  { nome: "Acolhedor", fala: "Quente e próximo", fundo: "#fdf3e7", tinta: "#5b3a29", destaque: "#c4612c", apoio: "#f7dcc0", fonte: slab, peso: 400, raio: "0.9rem", topo: "centro", foto: "circulo", textura: "ondas" },
  { nome: "Clássico", fala: "Tradicional e firme", fundo: "#f6f3ec", tinta: "#1f2f46", destaque: "#7a1f2b", apoio: "#e3dccb", fonte: serifa, peso: 700, raio: "0.15rem", topo: "lado", foto: "quadro", textura: "fios" },
  { nome: "Divertido", fala: "Leve e colorido", fundo: "#fff4c2", tinta: "#4a1d6b", destaque: "#d6286f", apoio: "#b8f0e0", fonte: redonda, peso: 800, raio: "1.2rem", topo: "lado", foto: "inclinada", textura: "pontos" },
  { nome: "Natural", fala: "Verde e tranquilo", fundo: "#eef3e6", tinta: "#2f4a2b", destaque: "#4f7336", apoio: "#d3e2c1", fonte: slab, peso: 400, raio: "0.9rem", topo: "centro", foto: "folha", textura: "ondas" },
  { nome: "Tecnológico", fala: "Preciso, com cara de futuro", fundo: "#0b1220", tinta: "#dbeafe", destaque: "#22d3ee", apoio: "#16243f", escuro: true, fonte: mono, peso: 600, raio: "0.3rem", topo: "lado", foto: "corte", textura: "grade" },
  { nome: "Delicado", fala: "Suave e cuidadoso", fundo: "#fdf1f3", tinta: "#6b4450", destaque: "#b5566f", apoio: "#f8dbe1", fonte: serifa, peso: 400, raio: "1.4rem", topo: "centro", foto: "arco", textura: "ondas", italico: true },
  { nome: "Luxuoso", fala: "Escuro, com brilho", fundo: "#14110d", tinta: "#f3e8d2", destaque: "#c9a45c", apoio: "#2a231a", escuro: true, fonte: serifa, peso: 400, raio: "0", topo: "lado", foto: "corte", textura: "fios", maiusculas: true },
  { nome: "Jovem", fala: "Vivo e solto", fundo: "#ede9fe", tinta: "#1e1b4b", destaque: "#7c3aed", apoio: "#fbcfe8", fonte: redonda, peso: 800, raio: "1.2rem", topo: "cheio", foto: "inclinada", textura: "pontos" },
  { nome: "Forte", fala: "Direto e marcante", fundo: "#1c1917", tinta: "#fafaf9", destaque: "#ef4444", apoio: "#33302d", escuro: true, fonte: condensada, peso: 400, raio: "0", topo: "editorial", foto: "corte", textura: "raios", maiusculas: true },
];

/** Antes de a pessoa escolher: o papel e a tinta da Adsgator, como uma planta. */
export const semEstilo: Estilo = {
  nome: "",
  fala: "",
  fundo: "#fcfbf8",
  tinta: "#1f271b",
  destaque: "#ffb100",
  apoio: "#efece3",
  fonte: slab,
  peso: 400,
  raio: "0.6rem",
  topo: "centro",
  foto: "arco",
  textura: "nenhuma",
};

/** Combinações para quem ainda não tem cores, com as quatro que a página usa. */
export const paletas: { nome: string; fundo: string; tinta: string; destaque: string; apoio: string }[] = [
  { nome: "Azul confiança", fundo: "#f4f7fb", tinta: "#0f2540", destaque: "#1d5fa8", apoio: "#d3e2f2" },
  { nome: "Verde natureza", fundo: "#f2f6ee", tinta: "#23381f", destaque: "#3f7a3a", apoio: "#d4e5c8" },
  { nome: "Terra e argila", fundo: "#fbf3ea", tinta: "#4a2f21", destaque: "#b5582b", apoio: "#f0d5bd" },
  { nome: "Rosa e vinho", fundo: "#fdf2f4", tinta: "#561b2d", destaque: "#a83254", apoio: "#f6d3db" },
  { nome: "Preto e dourado", fundo: "#15120d", tinta: "#f4ead6", destaque: "#c9a24e", apoio: "#2b241a" },
  { nome: "Azul e laranja", fundo: "#f7f8fb", tinta: "#14234a", destaque: "#d9601a", apoio: "#d8e0f4" },
  { nome: "Roxo e menta", fundo: "#f7f5fd", tinta: "#2c1a57", destaque: "#6a3fc0", apoio: "#cdeee2" },
  { nome: "Verde-petróleo", fundo: "#eff7f6", tinta: "#0e3436", destaque: "#0f766e", apoio: "#c6e6e2" },
];

/** As cores soltas, com o nome que a pessoa usaria (a do logo e as que não quer). */
export const coresSoltas: { nome: string; cor: string }[] = [
  { nome: "Azul", cor: "#1d5fa8" },
  { nome: "Azul-marinho", cor: "#14234a" },
  { nome: "Azul-claro", cor: "#5aa9dc" },
  { nome: "Verde", cor: "#3f7a3a" },
  { nome: "Verde-água", cor: "#2aa198" },
  { nome: "Amarelo", cor: "#f2b705" },
  { nome: "Laranja", cor: "#e0701d" },
  { nome: "Vermelho", cor: "#c62828" },
  { nome: "Vinho", cor: "#6d1b2f" },
  { nome: "Rosa", cor: "#d6527f" },
  { nome: "Roxo", cor: "#6a3fc0" },
  { nome: "Marrom", cor: "#6f4a32" },
  { nome: "Bege", cor: "#cdb48f" },
  { nome: "Dourado", cor: "#b8913c" },
  { nome: "Cinza", cor: "#6b7280" },
  { nome: "Preto", cor: "#17181a" },
];

export const ehCor = (texto: string) => /^#[0-9a-f]{6}$/i.test(texto);

const canal = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
function luminancia(cor: string) {
  const [r, g, b] = [1, 3, 5].map((i) => canal(parseInt(cor.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** A cor do texto que se lê em cima de outra. */
export const textoSobre = (cor: string) => (luminancia(cor) > 0.36 ? "#17181a" : "#ffffff");

export type Tema = Omit<Estilo, "nome" | "fala"> & { sobre: string };

/** A cor de uma resposta: "#rrggbb" ou o nome de uma cor solta. */
export const corDe = (resposta: string) =>
  ehCor(resposta) ? resposta : coresSoltas.find((c) => c.nome === resposta)?.cor;

/**
 * O primeiro estilo dá a composição; o segundo, a textura e a foto; o terceiro, os
 * cantos. As cores da pessoa entram por cima, no claro ou no escuro do estilo.
 */
export function temaDe(nomes: string[] = [], cores: string[] = []): Tema {
  const [a, b, c] = nomes.map((n) => estilos.find((e) => e.nome === n)).filter((e) => e !== undefined);
  const base: Estilo = { ...(a ?? semEstilo) };
  if (b) {
    base.textura = b.textura === "nenhuma" ? base.textura : b.textura;
    base.foto = b.foto;
  }
  if (c) base.raio = c.raio;

  const paleta = paletas.find((p) => p.nome === cores[0]);
  if (paleta) {
    const escuro = luminancia(paleta.fundo) < 0.2;
    return { ...base, ...paleta, escuro: escuro || undefined, sobre: textoSobre(paleta.destaque) };
  }
  const [principal, apoio] = cores.map(corDe).filter((x) => x !== undefined);
  if (principal) {
    const mistura = (parte: number, com: string) => `color-mix(in oklab, ${principal} ${parte}%, ${com})`;
    // Cor clara demais some no fundo claro: o botão fica com ela e o texto por cima, escuro.
    return {
      ...base,
      fundo: base.escuro ? mistura(14, "#0f0f10") : mistura(5, "#ffffff"),
      tinta: base.escuro ? mistura(10, "#ffffff") : mistura(30, "#121212"),
      destaque: principal,
      apoio: apoio
        ? `color-mix(in oklab, ${apoio} ${base.escuro ? 55 : 38}%, ${base.escuro ? "#0f0f10" : "#ffffff"})`
        : mistura(base.escuro ? 30 : 18, base.escuro ? "#0f0f10" : "#ffffff"),
      sobre: textoSobre(principal),
    };
  }
  return { ...base, sobre: textoSobre(base.destaque) };
}

/** O que cada sensação muda na página, para quem está escolhendo. */
export const falasDaSensacao: Record<string, string> = {
  Confiança: "Um selo à vista e tudo no lugar",
  Acolhimento: "Luz quente, de quem recebe bem",
  Profissionalismo: "Linhas certas e alinhadas",
  Calma: "Movimento lento, de respirar",
  Energia: "Ritmo e movimento",
  Alegria: "Formas soltas que brincam",
  Cuidado: "Um coração por perto",
  Exclusividade: "Moldura fina e letra espaçada",
  Clareza: "Título maior e mais espaço",
  Ousadia: "Formas e letras grandes",
};

const juntar = (itens: string[]) =>
  itens.length < 2 ? (itens[0] ?? "") : `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;

/** O visual numa frase ("Elegante e acolhedor, em vinho e bege, passando confiança"). */
export function fraseDoVisual(estilosDaPessoa: string[] = [], cores: string[] = [], sensacoes: string[] = []): string {
  const minusculas = (l: string[]) => juntar(l.map((x) => x.toLowerCase()));
  const emCores = !cores.length
    ? ""
    : paletas.some((p) => p.nome === cores[0])
      ? `nas cores ${cores[0].toLowerCase()}`
      : ehCor(cores[0])
        ? "nas suas cores"
        : `em ${minusculas(cores)}`;
  const partes = [minusculas(estilosDaPessoa), emCores, sensacoes.length ? `passando ${minusculas(sensacoes)}` : ""].filter(Boolean);
  const frase = partes.join(", ");
  return frase && `${frase[0].toUpperCase()}${frase.slice(1)}`;
}

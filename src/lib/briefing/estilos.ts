// Os 12 estilos do briefing, cada um com uma miniatura (os cartões da pergunta) e
// as cores que o desenho da página passa a usar quando a pessoa escolhe.

export type Estilo = {
  nome: string;
  fundo: string;
  tinta: string;
  destaque: string;
  /** A cor do texto em cima do destaque. */
  sobre: string;
  fonte: string;
  raio: string;
  maiusculas?: true;
};

const sans = "var(--font-geist-sans)";
const serifa = "Georgia, serif";
const slab = "servus-slab, Georgia, serif";
const mono = "var(--font-geist-mono)";

export const estilos: Estilo[] = [
  { nome: "Moderno", fundo: "#ffffff", tinta: "#111827", destaque: "#2563eb", sobre: "#ffffff", fonte: sans, raio: "0.5rem" },
  { nome: "Minimalista", fundo: "#fafafa", tinta: "#18181b", destaque: "#18181b", sobre: "#ffffff", fonte: sans, raio: "0" },
  { nome: "Elegante", fundo: "#f5f1ea", tinta: "#2b2420", destaque: "#8a6a3f", sobre: "#ffffff", fonte: serifa, raio: "0" },
  { nome: "Acolhedor", fundo: "#fdf3e7", tinta: "#5b3a29", destaque: "#c4612c", sobre: "#ffffff", fonte: slab, raio: "0.9rem" },
  { nome: "Clássico", fundo: "#f6f3ec", tinta: "#1f2f46", destaque: "#7a1f2b", sobre: "#ffffff", fonte: serifa, raio: "0.2rem" },
  { nome: "Divertido", fundo: "#fff4c2", tinta: "#4a1d6b", destaque: "#d6286f", sobre: "#ffffff", fonte: sans, raio: "1.2rem" },
  { nome: "Natural", fundo: "#eef3e6", tinta: "#2f4a2b", destaque: "#4f7336", sobre: "#ffffff", fonte: slab, raio: "0.9rem" },
  { nome: "Tecnológico", fundo: "#0b1220", tinta: "#dbeafe", destaque: "#22d3ee", sobre: "#0b1220", fonte: mono, raio: "0.3rem" },
  { nome: "Delicado", fundo: "#fdf1f3", tinta: "#6b4450", destaque: "#b5566f", sobre: "#ffffff", fonte: serifa, raio: "1.2rem" },
  { nome: "Luxuoso", fundo: "#14110d", tinta: "#f3e8d2", destaque: "#c9a45c", sobre: "#14110d", fonte: serifa, raio: "0", maiusculas: true },
  { nome: "Jovem", fundo: "#ede9fe", tinta: "#1e1b4b", destaque: "#7c3aed", sobre: "#ffffff", fonte: sans, raio: "1.2rem" },
  { nome: "Forte", fundo: "#1c1917", tinta: "#fafaf9", destaque: "#ef4444", sobre: "#1c1917", fonte: sans, raio: "0.1rem", maiusculas: true },
];

/** Antes de a pessoa escolher: as cores da Adsgator. */
export const semEstilo: Estilo = {
  nome: "",
  fundo: "#fcfbf8",
  tinta: "#1f271b",
  destaque: "#ffb100",
  sobre: "#1f271b",
  fonte: slab,
  raio: "0.6rem",
};

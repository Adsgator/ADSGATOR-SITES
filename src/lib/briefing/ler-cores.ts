import { coresSoltas } from "@/lib/briefing/temas";

// Reconhece as cores num texto escrito de qualquer jeito (HEX, RGB, CMYK ou o nome) e
// acha as cores de uma imagem de logo. Tudo no aparelho da pessoa.

export type CorLida = { cor: string; inicio: number; fim: number };

export const MAXIMO_DE_CORES = 4;

const hex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")}`;

const doHex = (h: string) => `#${(h.length === 3 ? [...h].map((c) => c + c).join("") : h).toLowerCase()}`;

type Leitor = { padrao: RegExp; ler: (m: RegExpMatchArray) => string | null };

const numeros = (m: RegExpMatchArray, maximo: number) => {
  const n = m.slice(1).map(Number);
  return n.every((v) => v <= maximo) ? n : null;
};

// O CMYK vem antes do RGB: quatro números seguidos não podem virar três.
const leitores: Leitor[] = [
  { padrao: /#([0-9a-f]{6}|[0-9a-f]{3})(?![0-9a-z])/gi, ler: (m) => doHex(m[1]) },
  { padrao: /(?<![0-9a-z#])(?=[0-9a-f]*[a-f])([0-9a-f]{6})(?![0-9a-z])/gi, ler: (m) => doHex(m[1]) },
  {
    padrao: /(?:cmyk\D{0,4}|c\s*[:=]?\s*)(\d{1,3})\s*%?[\s,;/-]*(?:m\s*[:=]?\s*)?(\d{1,3})\s*%?[\s,;/-]*(?:y\s*[:=]?\s*)?(\d{1,3})\s*%?[\s,;/-]*(?:k\s*[:=]?\s*)?(\d{1,3})(?!\d)\s*%?/gi,
    ler: (m) => {
      const n = numeros(m, 100);
      if (!n) return null;
      const [c, y, k] = [n[0], n[2], n[3]].map((v) => v / 100);
      const mg = n[1] / 100;
      return hex(255 * (1 - c) * (1 - k), 255 * (1 - mg) * (1 - k), 255 * (1 - y) * (1 - k));
    },
  },
  {
    padrao: /(?:rgba?\D{0,4}|r\s*[:=]?\s*)?(?<!\d)(\d{1,3})\s*[\s,;/-]\s*(?:g\s*[:=]?\s*)?(\d{1,3})\s*[\s,;/-]\s*(?:b\s*[:=]?\s*)?(\d{1,3})(?![\d%])/gi,
    ler: (m) => {
      const n = numeros(m, 255);
      return n && hex(n[0], n[1], n[2]);
    },
  },
];

/** As cores do texto, na ordem em que aparecem. O que não é reconhecido fica só no texto. */
export function lerCores(texto: string): CorLida[] {
  const achadas: CorLida[] = [];
  const livre = (inicio: number, fim: number) => !achadas.some((a) => inicio < a.fim && fim > a.inicio);
  for (const { padrao, ler } of leitores) {
    for (const m of texto.matchAll(padrao)) {
      const [inicio, fim] = [m.index, m.index + m[0].length];
      const cor = livre(inicio, fim) ? ler(m) : null;
      if (cor) achadas.push({ cor, inicio, fim });
    }
  }
  // Os nomes mais compridos primeiro: "azul-marinho" não pode virar "azul".
  for (const { nome, cor } of [...coresSoltas].sort((a, b) => b.nome.length - a.nome.length)) {
    const padrao = new RegExp(`(?<!\\p{L})${nome.replace("-", "[ -]")}(?!\\p{L})`, "giu");
    for (const m of texto.matchAll(padrao)) {
      const [inicio, fim] = [m.index, m.index + m[0].length];
      if (livre(inicio, fim)) achadas.push({ cor, inicio, fim });
    }
  }
  return achadas
    .sort((a, b) => a.inicio - b.inicio)
    .filter((a, i, l) => l.findIndex((b) => b.cor === a.cor) === i)
    .slice(0, MAXIMO_DE_CORES);
}

/** As cores que mais aparecem numa imagem, fora o branco do fundo. */
export function coresDaImagem({ data }: ImageData): string[] {
  const baldes = new Map<number, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 140 || Math.min(r, g, b) > 236) continue;
    const chave = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const balde = baldes.get(chave) ?? { n: 0, r: 0, g: 0, b: 0 };
    balde.n++;
    balde.r += r;
    balde.g += g;
    balde.b += b;
    baldes.set(chave, balde);
  }
  const total = [...baldes.values()].reduce((n, x) => n + x.n, 0);
  const ordenados = [...baldes.values()]
    .map(({ n, r, g, b }) => {
      const cor = [r / n, g / n, b / n];
      const vivo = (Math.max(...cor) - Math.min(...cor)) / 255;
      // Cor viva vale mais que cinza do mesmo tamanho (as bordas suaves das letras).
      return { cor, n, peso: n * (0.3 + vivo) };
    })
    .filter((x) => x.n / total > 0.008)
    .sort((a, b) => b.peso - a.peso);
  const escolhidas: number[][] = [];
  for (const { cor } of ordenados) {
    const longe = escolhidas.every((e) => Math.hypot(e[0] - cor[0], e[1] - cor[1], e[2] - cor[2]) > 70);
    if (longe) escolhidas.push(cor);
    if (escolhidas.length === 3) break;
  }
  return escolhidas.map(([r, g, b]) => hex(r, g, b));
}

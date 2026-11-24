// O que o estilo, as cores e a sensação mudam no desenho da página (pedido do Lucas,
// 2026-11-24). A sensação diz o comportamento (o que se mexe e como) e o estilo diz a
// linguagem (com que formas): alegria num estilo feito à mão não é a mesma coisa que
// alegria num minimalista. A ordem em que a pessoa escolhe não muda o resultado.

export type Topo = "centro" | "lado" | "cheio" | "editorial";
export type Foto = "arco" | "circulo" | "quadro" | "inclinada" | "folha" | "corte";
export type Textura = "nenhuma" | "grade" | "pontos" | "fios" | "ondas" | "raios" | "pontilhado" | "manchas";

/** A linguagem das formas. */
export type Familia = "geometrica" | "organica" | "classica" | "artesanal" | "ludica";

export type Estilo = {
  nome: string;
  /** O que o estilo passa, em poucas palavras. */
  fala: string;
  familia: Familia;
  /** Quanto o estilo manda na estrutura da página (0 a 1): o mais contido organiza. */
  estrutura: number;
  /** Quanto o estilo enfeita (0 a 1): o mais expressivo dá a foto e a cor de destaque. */
  expressao: number;
  fundo: string;
  tinta: string;
  destaque: string;
  apoio: string;
  escuro?: true;
  fonte: string;
  peso: number;
  /** Em rem, para poder misturar. */
  raio: number;
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
  { nome: "Moderno", fala: "Limpo e atual", familia: "geometrica", estrutura: 0.75, expressao: 0.35, fundo: "#ffffff", tinta: "#0f172a", destaque: "#2563eb", apoio: "#dbeafe", fonte: sans, peso: 700, raio: 0.6, topo: "lado", foto: "quadro", textura: "nenhuma" },
  { nome: "Minimalista", fala: "Pouca coisa, muito espaço", familia: "geometrica", estrutura: 0.95, expressao: 0.05, fundo: "#fafafa", tinta: "#18181b", destaque: "#18181b", apoio: "#e8e8ea", fonte: sans, peso: 400, raio: 0, topo: "editorial", foto: "quadro", textura: "nenhuma" },
  { nome: "Elegante", fala: "Fino e discreto", familia: "classica", estrutura: 0.85, expressao: 0.3, fundo: "#f5f1ea", tinta: "#2b2420", destaque: "#8a6a3f", apoio: "#e6dccb", fonte: serifa, peso: 400, raio: 0, topo: "centro", foto: "arco", textura: "fios" },
  { nome: "Acolhedor", fala: "Quente e próximo", familia: "organica", estrutura: 0.5, expressao: 0.5, fundo: "#fdf3e7", tinta: "#5b3a29", destaque: "#c4612c", apoio: "#f7dcc0", fonte: slab, peso: 400, raio: 0.9, topo: "centro", foto: "circulo", textura: "ondas" },
  { nome: "Clássico", fala: "Tradicional e firme", familia: "classica", estrutura: 0.9, expressao: 0.2, fundo: "#f6f3ec", tinta: "#1f2f46", destaque: "#7a1f2b", apoio: "#e3dccb", fonte: serifa, peso: 700, raio: 0.15, topo: "lado", foto: "quadro", textura: "fios" },
  { nome: "Divertido", fala: "Leve e colorido", familia: "ludica", estrutura: 0.2, expressao: 0.95, fundo: "#fff4c2", tinta: "#4a1d6b", destaque: "#d6286f", apoio: "#b8f0e0", fonte: redonda, peso: 800, raio: 1.2, topo: "lado", foto: "inclinada", textura: "pontos" },
  { nome: "Natural", fala: "Verde e tranquilo", familia: "organica", estrutura: 0.55, expressao: 0.55, fundo: "#eef3e6", tinta: "#2f4a2b", destaque: "#4f7336", apoio: "#d3e2c1", fonte: slab, peso: 400, raio: 0.9, topo: "centro", foto: "folha", textura: "ondas" },
  { nome: "Rústico", fala: "Madeira, terra e mão", familia: "artesanal", estrutura: 0.6, expressao: 0.6, fundo: "#f1e6d6", tinta: "#3b2618", destaque: "#8c4a22", apoio: "#dcc5a5", fonte: slab, peso: 700, raio: 0.25, topo: "lado", foto: "quadro", textura: "pontilhado" },
  { nome: "Tecnológico", fala: "Preciso, com cara de futuro", familia: "geometrica", estrutura: 0.8, expressao: 0.55, fundo: "#0b1220", tinta: "#dbeafe", destaque: "#22d3ee", apoio: "#16243f", escuro: true, fonte: mono, peso: 600, raio: 0.3, topo: "lado", foto: "corte", textura: "grade" },
  { nome: "Delicado", fala: "Suave e cuidadoso", familia: "organica", estrutura: 0.6, expressao: 0.4, fundo: "#fdf1f3", tinta: "#6b4450", destaque: "#b5566f", apoio: "#f8dbe1", fonte: serifa, peso: 400, raio: 1.4, topo: "centro", foto: "arco", textura: "ondas", italico: true },
  { nome: "Luxuoso", fala: "Escuro, com brilho", familia: "classica", estrutura: 0.88, expressao: 0.45, fundo: "#14110d", tinta: "#f3e8d2", destaque: "#c9a45c", apoio: "#2a231a", escuro: true, fonte: serifa, peso: 400, raio: 0, topo: "lado", foto: "corte", textura: "fios", maiusculas: true },
  { nome: "Jovem", fala: "Vivo e solto", familia: "ludica", estrutura: 0.3, expressao: 0.85, fundo: "#ede9fe", tinta: "#1e1b4b", destaque: "#7c3aed", apoio: "#fbcfe8", fonte: redonda, peso: 800, raio: 1.2, topo: "cheio", foto: "inclinada", textura: "pontos" },
  { nome: "Artístico", fala: "Livre, com traço próprio", familia: "ludica", estrutura: 0.25, expressao: 0.9, fundo: "#f7efe6", tinta: "#1d2a44", destaque: "#e2552d", apoio: "#f3c6a8", fonte: slab, peso: 700, raio: 0.5, topo: "editorial", foto: "folha", textura: "manchas" },
  { nome: "Vibrante", fala: "Cores de agora, com brilho", familia: "geometrica", estrutura: 0.4, expressao: 0.9, fundo: "#f6f3ff", tinta: "#170b3b", destaque: "#6d28ff", apoio: "#c8f7ee", fonte: sans, peso: 800, raio: 1, topo: "cheio", foto: "quadro", textura: "manchas" },
  { nome: "Industrial", fala: "Ferro, concreto e firmeza", familia: "artesanal", estrutura: 0.7, expressao: 0.4, fundo: "#e7e5e1", tinta: "#26262a", destaque: "#b5531c", apoio: "#cfccc5", fonte: condensada, peso: 400, raio: 0.1, topo: "lado", foto: "corte", textura: "grade", maiusculas: true },
  { nome: "Forte", fala: "Direto e marcante", familia: "geometrica", estrutura: 0.65, expressao: 0.7, fundo: "#1c1917", tinta: "#fafaf9", destaque: "#ef4444", apoio: "#33302d", escuro: true, fonte: condensada, peso: 400, raio: 0, topo: "editorial", foto: "corte", textura: "raios", maiusculas: true },
];

/** Antes de a pessoa escolher: o papel e a tinta da Adsgator, como uma planta. */
export const semEstilo: Estilo = {
  nome: "",
  fala: "",
  familia: "organica",
  estrutura: 0.5,
  expressao: 0.3,
  fundo: "#fcfbf8",
  tinta: "#1f271b",
  destaque: "#ffb100",
  apoio: "#efece3",
  fonte: slab,
  peso: 400,
  raio: 0.6,
  topo: "centro",
  foto: "arco",
  textura: "nenhuma",
};

// O que puxa para lados opostos: escolhido um, o outro fica bloqueado, com o motivo.
const opostos: [string, string][] = [
  ["Luxuoso", "Divertido"],
  ["Luxuoso", "Jovem"],
  ["Forte", "Delicado"],
  ["Rústico", "Tecnológico"],
  ["Rústico", "Vibrante"],
  ["Industrial", "Delicado"],
  ["Calma", "Energia"],
  ["Calma", "Ousadia"],
  ["Exclusividade", "Alegria"],
];

/** A opção já marcada que não combina com esta. */
export const opostoMarcado = (opcao: string, marcadas: string[]) =>
  marcadas.find((m) => opostos.some(([a, b]) => (a === opcao && b === m) || (b === opcao && a === m)));

// Como duas linguagens se juntam, em palavras.
const encontros: Record<string, string> = {
  "geometrica+ludica": "Pouca coisa na tela, com um detalhe que surpreende",
  "geometrica+organica": "Organizada, com formas que respiram",
  "classica+geometrica": "Linhas firmes com acabamento fino",
  "artesanal+geometrica": "Tudo no lugar, com textura de coisa feita à mão",
  "ludica+organica": "Natural e leve, com cor e movimento",
  "classica+organica": "Serena e bem-acabada",
  "artesanal+organica": "Da terra, com cara de feito à mão",
  "classica+ludica": "Bem-vestida, com um sorriso no canto",
  "artesanal+classica": "Tradicional, com marca de ofício",
  "artesanal+ludica": "Feita à mão, com graça",
};

/** Combinações para quem ainda não tem cores, com as quatro que a página usa. */
export const paletas: { nome: string; fundo: string; tinta: string; destaque: string; apoio: string }[] = [
  { nome: "Azul confiança", fundo: "#f4f7fb", tinta: "#0f2540", destaque: "#1d5fa8", apoio: "#d3e2f2" },
  { nome: "Verde natureza", fundo: "#f2f6ee", tinta: "#23381f", destaque: "#3f7a3a", apoio: "#d4e5c8" },
  { nome: "Terra e argila", fundo: "#fbf3ea", tinta: "#4a2f21", destaque: "#b5582b", apoio: "#f0d5bd" },
  { nome: "Rosa e vinho", fundo: "#fdf2f4", tinta: "#561b2d", destaque: "#a83254", apoio: "#f6d3db" },
  { nome: "Preto e dourado", fundo: "#15120d", tinta: "#f4ead6", destaque: "#c9a24e", apoio: "#2b241a" },
  { nome: "Azul e laranja", fundo: "#f7f8fb", tinta: "#14234a", destaque: "#d9601a", apoio: "#d8e0f4" },
  { nome: "Verde-petróleo", fundo: "#eff7f6", tinta: "#0e3436", destaque: "#0f766e", apoio: "#c6e6e2" },
  { nome: "Roxo e menta", fundo: "#f7f5fd", tinta: "#2c1a57", destaque: "#6a3fc0", apoio: "#cdeee2" },
  { nome: "Roxo elétrico", fundo: "#0f0a1f", tinta: "#efeaff", destaque: "#8b5cf6", apoio: "#241a45" },
  { nome: "Noite e ciano", fundo: "#0a1220", tinta: "#e4f1fb", destaque: "#22c8e8", apoio: "#14263d" },
  { nome: "Grafite e lima", fundo: "#141614", tinta: "#f2f5ee", destaque: "#b9ee3c", apoio: "#262b24" },
  { nome: "Coral e lilás", fundo: "#fff6f3", tinta: "#3a2350", destaque: "#ee5a46", apoio: "#e6dbfa" },
  { nome: "Pêssego e café", fundo: "#fff5ec", tinta: "#4a2c20", destaque: "#e07b4f", apoio: "#fbdcc4" },
  { nome: "Azul-bebê e manteiga", fundo: "#fffbea", tinta: "#1f3a5f", destaque: "#4a90c8", apoio: "#fbeeb0" },
  { nome: "Menta e grafite", fundo: "#f1faf6", tinta: "#1f2a2e", destaque: "#12856a", apoio: "#c9efe0" },
  { nome: "Preto e branco", fundo: "#ffffff", tinta: "#111111", destaque: "#111111", apoio: "#ececec" },
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
/** Quanto duas cores se separam (a conta da WCAG). */
function contraste(a: string, b: string) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
/** Mistura duas cores "#rrggbb" (quanto da primeira, de 0 a 1). */
function misturar(a: string, b: string, quanto: number) {
  const canais = [1, 3, 5].map((i) =>
    Math.round(parseInt(a.slice(i, i + 2), 16) * quanto + parseInt(b.slice(i, i + 2), 16) * (1 - quanto)),
  );
  return `#${canais.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
/** A cor do texto que se lê em cima de outra. */
export const textoSobre = (cor: string) => (luminancia(cor) > 0.36 ? "#17181a" : "#ffffff");

export type Tema = Pick<
  Estilo,
  "fundo" | "tinta" | "destaque" | "apoio" | "escuro" | "fonte" | "peso" | "topo" | "foto" | "textura" | "maiusculas" | "italico" | "familia"
> & {
  raio: string;
  /** A cor do texto em cima do destaque. */
  sobre: string;
  /** Quanto enfeite cabe (0 a 1): o minimalista segura, o divertido solta. */
  expressao: number;
  /** A linguagem do estilo mais expressivo, quando é outra: entra como detalhe. */
  tempero?: Familia;
};

/** A cor de uma resposta: "#rrggbb" ou o nome de uma cor solta. */
export const corDe = (resposta: string) =>
  ehCor(resposta) ? resposta : coresSoltas.find((c) => c.nome === resposta)?.cor;

const media = (n: number[]) => n.reduce((a, b) => a + b, 0) / n.length;

const escolhidos = (nomes: string[]) => estilos.filter((e) => nomes.includes(e.nome));

/**
 * Mistura os estilos sem que um apague o outro: o mais contido organiza (o topo, a letra,
 * o fundo), o mais expressivo dá o tempero (a foto, a cor de destaque, o detalhe), e os
 * cantos e a quantidade de enfeite são a média. As cores da pessoa entram por cima.
 */
export function temaDe(nomes: string[] = [], cores: string[] = []): Tema {
  const lista = escolhidos(nomes);
  const casa = [...lista].sort((a, b) => b.estrutura - a.estrutura)[0] ?? semEstilo;
  const tempero = [...lista].sort((a, b) => b.expressao - a.expressao)[0] ?? semEstilo;
  const expressao = lista.length ? media(lista.map((e) => e.expressao)) : semEstilo.expressao;
  // O estilo que organiza tempera a cor do que solta (rosa no elegante fica mais fechado);
  // no geométrico ela entra pura, porque é ela a surpresa.
  const corDoTempero =
    tempero === casa || casa.familia === "geometrica" ? tempero.destaque : misturar(tempero.destaque, casa.destaque, 0.62);
  const base: Tema = {
    fundo: casa.fundo,
    tinta: casa.tinta,
    // Num fundo escuro, a cor de um estilo claro pode sumir: só entra se destacar.
    destaque: contraste(corDoTempero, casa.fundo) >= 3 ? corDoTempero : casa.destaque,
    apoio: casa.apoio,
    escuro: casa.escuro,
    fonte: casa.fonte,
    peso: casa.peso,
    topo: casa.topo,
    foto: tempero.foto,
    // A textura é a da casa: bolinha de festa não entra num fundo de madeira.
    textura: casa.textura,
    maiusculas: casa.maiusculas,
    italico: casa.italico,
    familia: casa.familia,
    tempero: tempero.familia !== casa.familia ? tempero.familia : undefined,
    expressao,
    raio: `${Math.round(media(lista.length ? lista.map((e) => e.raio) : [semEstilo.raio]) * 100) / 100}rem`,
    sobre: "",
  };
  // Vários estilos: o apoio puxa um pouco da cor do tempero, para o conjunto conversar.
  if (tempero !== casa) base.apoio = `color-mix(in oklab, ${casa.apoio} 70%, ${tempero.apoio})`;

  const paleta = paletas.find((p) => p.nome === cores[0]);
  if (paleta) {
    const { fundo, tinta, destaque, apoio } = paleta;
    return { ...base, fundo, tinta, destaque, apoio, escuro: luminancia(fundo) < 0.2 || undefined, sobre: textoSobre(destaque) };
  }
  const [principal, apoio] = cores.map(corDe).filter((x) => x !== undefined);
  if (principal) {
    const mistura = (parte: number, com: string) => `color-mix(in oklab, ${principal} ${parte}%, ${com})`;
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
  Leveza: "Formas que flutuam devagar",
  Energia: "Ritmo e movimento",
  Alegria: "Detalhes que brincam",
  Inspiração: "Uma luz que sobe no fundo",
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

/** O que nasce do encontro dos estilos ("Pouca coisa na tela, com um detalhe que surpreende"). */
export function encontroDosEstilos(nomes: string[] = []): string {
  const { familia, tempero } = temaDe(nomes);
  return tempero ? (encontros[[familia, tempero].sort().join("+")] ?? "") : "";
}

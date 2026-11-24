import { Anton, Bricolage_Grotesque, Cormorant_Garamond, Fraunces, Jost } from "next/font/google";

// As letras do desenho. São fontes abertas carregadas na própria página (as do aparelho mudam
// de celular para celular) e só baixam quando o desenho usa.

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], preload: false });
const fraunces = Fraunces({ subsets: ["latin"], preload: false });
const jost = Jost({ subsets: ["latin"], preload: false });
const anton = Anton({ subsets: ["latin"], weight: "400", preload: false });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], preload: false });

export type Letra = {
  familia: string;
  peso: number;
  /** Quanto ela cresce para parecer do mesmo tamanho que as outras. */
  corpo: number;
  /** A largura média de uma letra, em relação ao corpo: é o que diz se a palavra cabe. */
  largura: number;
  entrelinha: number;
  espaco: string;
  maiusculas?: true;
};

export const letras = {
  Fina: { familia: cormorant.style.fontFamily, peso: 500, corpo: 1.14, largura: 0.47, entrelinha: 0.98, espaco: "-0.012em" },
  Encorpada: { familia: fraunces.style.fontFamily, peso: 560, corpo: 0.95, largura: 0.58, entrelinha: 1.02, espaco: "-0.02em" },
  Limpa: { familia: jost.style.fontFamily, peso: 500, corpo: 0.95, largura: 0.54, entrelinha: 1.04, espaco: "-0.015em" },
  Alta: { familia: anton.style.fontFamily, peso: 400, corpo: 1.05, largura: 0.56, entrelinha: 1.04, espaco: "0.002em", maiusculas: true },
  Solta: { familia: bricolage.style.fontFamily, peso: 800, corpo: 0.93, largura: 0.67, entrelinha: 0.98, espaco: "-0.035em" },
} satisfies Record<string, Letra>;

export type NomeDaLetra = keyof typeof letras;

import { Anton, Bricolage_Grotesque, Fraunces, Gelasio, Jost, Lora, Nunito, Playfair_Display } from "next/font/google";

// As letras do desenho, uma para cada jeito de estilo. São fontes abertas, hospedadas na
// própria página: as do aparelho mudam de celular para celular. Só baixam quando aparecem.

const anton = Anton({ subsets: ["latin"], weight: "400", preload: false });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], preload: false });
const fraunces = Fraunces({ subsets: ["latin"], preload: false });
const gelasio = Gelasio({ subsets: ["latin"], preload: false });
const jost = Jost({ subsets: ["latin"], preload: false });
const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], preload: false });
const nunito = Nunito({ subsets: ["latin"], preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], preload: false });

export const letras = {
  /** Alta e apertada. */
  cartaz: anton.style.fontFamily,
  /** Larga e com personalidade. */
  solta: bricolage.style.fontFamily,
  /** Macia, com pé. */
  quente: fraunces.style.fontFamily,
  /** A serifa tradicional. */
  classica: gelasio.style.fontFamily,
  /** Geométrica e leve. */
  limpa: jost.style.fontFamily,
  /** Serifa suave, que fica bem inclinada. */
  suave: lora.style.fontFamily,
  /** De cantos redondos. */
  redonda: nunito.style.fontFamily,
  /** Serifa fina, de contraste. */
  fina: playfair.style.fontFamily,
  daMarca: "servus-slab, Georgia, serif",
  texto: "var(--font-geist-sans)",
  mono: "var(--font-geist-mono)",
};

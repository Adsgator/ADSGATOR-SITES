import type { Guardado } from "@/components/briefing/briefing";
import type { Exemplo } from "@/lib/briefing/amostra-preenchida";

// Onde a amostra guarda as respostas (só neste navegador). Na versão final, ficam no
// painel, e este arquivo sai.

// O número muda para todos recomeçarem do zero, em qualquer aparelho.
const PREFIXO = "amostra-briefing-2:";
const chaveDe = (slug: string) => `${PREFIXO}${slug}`;

/** Sem nada guardado, o exemplo preenchido (quando tem) ou o vazio. */
export function lerAmostra(slug: string, exemplo?: Exemplo): Guardado {
  const vazio: Guardado = { enviado: false, ...(exemplo ?? { respostas: {}, colados: {} }) };
  try {
    const texto = localStorage.getItem(chaveDe(slug));
    return texto ? { ...vazio, ...(JSON.parse(texto) as Partial<Guardado>) } : vazio;
  } catch {
    // Navegador sem armazenamento: a amostra funciona, só não guarda.
    return vazio;
  }
}

/** Devolve se deu para guardar. */
export function guardarAmostra(slug: string, dados: Guardado) {
  try {
    localStorage.setItem(chaveDe(slug), JSON.stringify(dados));
    return true;
  } catch {
    return false;
  }
}

/** Apaga tudo o que a amostra guardou neste navegador; devolve quantos briefings havia. */
export function zerarAmostra() {
  try {
    const chaves = Object.keys(localStorage).filter((k) => k.startsWith("amostra-briefing"));
    chaves.forEach((k) => localStorage.removeItem(k));
    return chaves.length;
  } catch {
    return 0;
  }
}

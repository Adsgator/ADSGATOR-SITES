import type { Exemplo } from "@/lib/briefing/amostra-preenchida";
import type { Respostas } from "@/lib/briefing/regras";
import type { Colados } from "@/lib/briefing/sinais";

// Onde a amostra guarda as respostas (só neste navegador). Na versão final, ficam no
// painel, e este arquivo sai.

export type Guardado = { respostas: Respostas; enviado: boolean; colados: Colados; materialMandado?: boolean };

const chaveDe = (slug: string) => `amostra-briefing:${slug}`;

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

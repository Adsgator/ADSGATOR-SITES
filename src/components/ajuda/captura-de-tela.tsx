import Image from "next/image";

import type { Captura } from "@/content/ajuda";

/**
 * A tela do Google de um passo, no tamanho dela (as capturas pequenas não
 * esticam). Tocar abre a imagem inteira: no celular, a tela do computador
 * fica pequena.
 */
export function CapturaDeTela({ captura }: { captura: Captura }) {
  const { imagem, descricao } = captura;
  return (
    <figure className="mt-4">
      <a
        href={imagem.src}
        target="_blank"
        rel="noreferrer"
        className="inline-block max-w-full overflow-hidden rounded-2xl border bg-white shadow-lg shadow-ink/5"
      >
        <Image src={imagem} alt={descricao} sizes={`(min-width: 768px) ${Math.min(imagem.width, 640)}px, 100vw`} className="h-auto w-auto max-w-full" />
      </a>
      <figcaption className="mt-2 text-xs text-muted-foreground">{descricao}</figcaption>
    </figure>
  );
}

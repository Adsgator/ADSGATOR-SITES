import Image from "next/image";
import { ImageIcon } from "lucide-react";

import type { Captura } from "@/content/ajuda";

/** Arquivo da captura: public/capturas/01.png, 02.png... */
export const arquivoDaCaptura = (numero: number) => `/capturas/${String(numero).padStart(2, "0")}.png`;

/**
 * A tela do Google de um passo. Enquanto o Lucas não manda a captura (sem
 * `tamanho` no conteúdo), mostra um quadro com o número e o que vai nele, só
 * para conferir no localhost; o teste da central falha se algum ficar assim.
 * Tocar na imagem abre o tamanho real (no celular, a tela do computador fica
 * pequena).
 */
export function CapturaDeTela({ captura }: { captura: Captura }) {
  if (!captura.tamanho) {
    return (
      <figure
        data-captura-faltando={captura.numero}
        className="mt-4 flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-muted/40 p-6 text-center"
      >
        <ImageIcon className="size-6 text-muted-foreground" />
        <p className="font-mono text-sm">Captura {captura.numero}</p>
        <figcaption className="max-w-sm text-sm text-muted-foreground">{captura.descricao}</figcaption>
      </figure>
    );
  }

  const [largura, altura] = captura.tamanho;
  const src = arquivoDaCaptura(captura.numero);
  return (
    <figure className="mt-4">
      <a href={src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border bg-card shadow-lg shadow-ink/5">
        <Image src={src} width={largura} height={altura} alt={captura.descricao} sizes="(min-width: 768px) 640px, 100vw" className="h-auto w-full" />
      </a>
      <figcaption className="mt-2 text-xs text-muted-foreground">{captura.descricao}. Toque para ampliar.</figcaption>
    </figure>
  );
}

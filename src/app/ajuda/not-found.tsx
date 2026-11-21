import Link from "next/link";
import { SearchXIcon } from "lucide-react";

// Guia que não existe, dentro da central (com o cabeçalho e o rodapé dela).
export default function GuiaNaoEncontrado() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-muted">
        <SearchXIcon className="size-5" />
      </span>
      <h1 className="mt-5 font-heading text-3xl">Guia não encontrado</h1>
      <p className="mt-3 leading-7 text-muted-foreground">O endereço não existe ou mudou de lugar. Todos os guias estão na página inicial da central.</p>
      <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-full border px-5 font-medium hover:bg-muted">
        Ver todos os guias
      </Link>
    </div>
  );
}

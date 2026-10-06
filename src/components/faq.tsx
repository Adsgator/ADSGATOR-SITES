import { PlusIcon } from "lucide-react";

/**
 * Perguntas frequentes com o elemento nativo <details>: acessível ao teclado
 * e ao leitor de tela, sem JavaScript; a abertura suave está no globals.css.
 */
export function Faq({
  itens,
}: {
  itens: { pergunta: string; resposta: React.ReactNode }[];
}) {
  return (
    <div className="divide-y border-y">
      {itens.map(({ pergunta, resposta }) => (
        <details key={pergunta} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-heading text-xl sm:text-2xl [&::-webkit-details-marker]:hidden">
            {pergunta}
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors group-open:border-brand group-open:bg-brand group-open:text-brand-foreground">
              <PlusIcon className="size-4 transition-transform duration-300 group-open:rotate-45" />
            </span>
          </summary>
          <div className="max-w-2xl pb-6 leading-7 text-muted-foreground">{resposta}</div>
        </details>
      ))}
    </div>
  );
}

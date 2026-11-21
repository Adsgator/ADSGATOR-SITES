import { cn } from "@/lib/utils";

/** Campo do checkout: rótulo em cima, a mensagem de erro embaixo, ligada ao
 * campo para o leitor de tela. */
export function Campo({
  id,
  rotulo,
  erro,
  ajuda,
  className,
  children,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  ajuda?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium">
        {rotulo}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} className="text-xs text-destructive">
          {erro}
        </p>
      ) : ajuda ? (
        <div className="text-xs text-muted-foreground">{ajuda}</div>
      ) : null}
    </div>
  );
}

export const estiloDoCampo =
  "h-12 w-full rounded-lg border border-input bg-background px-3.5 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20 sm:text-sm";

/** Atributos de acessibilidade de um campo com ou sem erro. */
export function ariaDoErro(id: string, erro?: string) {
  return erro ? { "aria-invalid": true as const, "aria-describedby": `${id}-erro` } : {};
}

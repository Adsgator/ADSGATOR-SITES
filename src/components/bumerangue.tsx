import { cn } from "@/lib/utils";

// Desenho do canto "bumerangue" da identidade visual (ELEMENTOS, canto
// esquerdo, 100 × 100). O canto oposto é o mesmo girado.
const CANTO =
  "M100 2C100 0.895431 99.1046 0 98 0L2 0C0.895431 0 0 0.895429 0 2L0 98C0 99.1046 0.89543 100 2 100H8.33477C9.2996 100 10.1269 99.3112 10.3017 98.3623L23.7504 25.355C23.9007 24.5391 24.5391 23.9007 25.355 23.7504L98.3623 10.3017C99.3112 10.1269 100 9.2996 100 8.33477V2Z";

function Canto({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("fill-current", className)}>
      <path d={CANTO} />
    </svg>
  );
}

/**
 * Emoldura o conteúdo com dois cantos "bumerangue" da marca (em cima à
 * esquerda e embaixo à direita). A cor vem do texto (`text-brand` por padrão).
 */
export function BumerangueFrame({
  className,
  cantoClassName,
  children,
}: {
  className?: string;
  cantoClassName?: string;
  children: React.ReactNode;
}) {
  const canto = cn("pointer-events-none absolute size-10 text-brand sm:size-14", cantoClassName);
  return (
    <div className={cn("relative", className)}>
      <Canto className={cn(canto, "-top-3 -left-3 sm:-top-4 sm:-left-4")} />
      <Canto className={cn(canto, "-right-3 -bottom-3 rotate-180 sm:-right-4 sm:-bottom-4")} />
      {children}
    </div>
  );
}

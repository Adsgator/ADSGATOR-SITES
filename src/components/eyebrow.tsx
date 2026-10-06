import { cn } from "@/lib/utils";

/** Rótulo de seção em fonte mono com um traço antes ("—— Serviços"), como
 * os rótulos da referência visual (plano, Fase 1B). */
export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-xs tracking-wide text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  );
}

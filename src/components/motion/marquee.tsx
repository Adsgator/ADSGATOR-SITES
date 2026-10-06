import { cn } from "@/lib/utils";

/**
 * Faixa que rola sem parar (classes `marquee` e `marquee-track` no
 * globals.css). Pausa com o mouse em cima e pelo botão de pausa do
 * MotionScope; com "reduzir animações", roda na metade da velocidade. A
 * segunda cópia fecha o laço e fica fora dos leitores de tela e do teclado
 * (`inert`).
 */
export function Marquee({
  duration = 40,
  className,
  children,
}: {
  duration?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div
        className="marquee-track"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}

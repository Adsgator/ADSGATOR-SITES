import Image from "next/image";

import { cn } from "@/lib/utils";

/** Logo completo; troca a versão conforme o tema sem depender de JS. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-block h-6 w-[130px]", className)}>
      <Image
        src="/brand/logo-light.svg"
        alt="Adsgator"
        fill
        priority
        unoptimized
        className="object-contain object-left dark:hidden"
      />
      <Image
        src="/brand/logo-dark.svg"
        alt="Adsgator"
        fill
        priority
        unoptimized
        className="hidden object-contain object-left dark:block"
      />
    </span>
  );
}

/** Símbolo do cursor, usado onde o logo completo não cabe. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 ring-1 ring-brand/25",
        className,
      )}
    >
      <Image
        src="/brand/cursor.svg"
        alt=""
        width={14}
        height={21}
        unoptimized
      />
    </span>
  );
}

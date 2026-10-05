import Link from "next/link";

import { BrandLogo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" aria-label="Adsgator, página inicial">
          <BrandLogo />
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/ajuda" className={cn(buttonVariants({ variant: "ghost" }))}>
            Ajuda
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

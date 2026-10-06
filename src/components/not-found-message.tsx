import Link from "next/link";
import { SearchXIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

/** Conteúdo da página 404 (copiado do painel, com o texto do site). */
export function NotFoundMessage({ className }: { className?: string }) {
  return (
    <Empty className={cn("border", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>Página não encontrada</EmptyTitle>
        <EmptyDescription>
          O endereço não existe ou mudou de lugar.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}>
          Voltar para o início
        </Link>
      </EmptyContent>
    </Empty>
  );
}

import { UserIcon } from "lucide-react";

import { BrandMark } from "@/components/brand";
import { IconeGoogle } from "@/components/icones-redes";
import { MotionScope } from "@/components/motion/motion-scope";

// "Tudo no seu nome" na página de Google Ads (roteiro do site, Google Ads,
// seção 5): a verba corre de você direto ao Google, e a Adsgator fica ao lado,
// cuidando da conta sem tocar na verba. Os pontos andam por CSS (keyframe
// e classe `fluxo` no globals.css), para o botão de pausar parar tudo.

export function VerbaDireta() {
  return (
    <MotionScope className="relative">
      <div aria-hidden="true" className="rounded-3xl border bg-card/60 p-6 sm:p-10">
        <div className="flex items-center gap-3 sm:gap-6">
          <No rotulo="Você">
            <UserIcon className="size-6" />
          </No>
          <div className="relative flex-1">
            <p className="mb-3 text-center font-mono text-xs text-muted-foreground">a verba vai direto</p>
            <div className="relative h-2 overflow-hidden rounded-full bg-border">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{ animationDelay: `${i * 0.8}s` }}
                  className="motion-loop fluxo absolute inset-0"
                >
                  <span className="absolute top-0 right-0 h-2 w-8 rounded-full bg-brand" />
                </span>
              ))}
            </div>
          </div>
          <No rotulo="Google">
            <IconeGoogle className="size-6" />
          </No>
        </div>
        <div className="mx-auto h-10 w-px border-l border-dashed border-muted-foreground/50" />
        <div className="mx-auto flex max-w-sm items-center gap-4 rounded-2xl border bg-background px-5 py-4">
          <BrandMark className="size-11 rounded-full" />
          <div className="leading-snug">
            <p className="font-medium">Adsgator</p>
            <p className="text-sm text-muted-foreground">Cuida da conta. Não toca na verba.</p>
          </div>
        </div>
      </div>
    </MotionScope>
  );
}

function No({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <span className="flex size-14 items-center justify-center rounded-2xl border bg-background sm:size-16">{children}</span>
      <span className="text-sm font-medium">{rotulo}</span>
    </div>
  );
}

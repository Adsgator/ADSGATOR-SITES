import type { Metadata } from "next";

import { NotFoundMessage } from "@/components/not-found-message";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Página não encontrada" };

// O endereço que não existe cai aqui, fora do grupo (site): o cabeçalho e o
// rodapé vêm direto, sem a medição. A Central de Ajuda tem a sua 404
// (ajuda/not-found.tsx).
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 pt-40 pb-24">
        <NotFoundMessage className="max-w-md" />
      </main>
      <SiteFooter />
    </>
  );
}

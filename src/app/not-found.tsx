import type { Metadata } from "next";

import { NotFoundMessage } from "@/components/not-found-message";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <div className="flex items-center justify-center px-4 py-24">
      <NotFoundMessage className="max-w-md" />
    </div>
  );
}

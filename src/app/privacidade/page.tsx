import type { Metadata } from "next";

import Privacidade from "@/content/privacidade.mdx";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Adsgator trata os dados pessoais de clientes e visitantes.",
  alternates: { canonical: "/privacidade" },
};

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Privacidade />
    </article>
  );
}

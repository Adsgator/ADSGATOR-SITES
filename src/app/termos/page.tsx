import type { Metadata } from "next";

import Termos from "@/content/termos.mdx";

export const metadata: Metadata = {
  title: "Termos de Serviço",
  description: "Termos de Serviço da Adsgator.",
  alternates: { canonical: "/termos" },
};

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Termos />
    </article>
  );
}

import type { Metadata } from "next";

import { BriefingDeVerdade } from "@/components/briefing/de-verdade";

// O link do cliente, forms.adsgator.com.br/<código>. A página não sabe de nada até o navegador
// pedir: assim a prévia do WhatsApp não conta como aberta.

// A prévia ao colar o link no WhatsApp. Sem openGraph próprio: ele apagaria a imagem do layout.
export const metadata: Metadata = {
  title: { absolute: "O seu briefing · Adsgator" },
  description: "Conte sobre o seu negócio para a gente começar.",
};

export default async function PaginaDoBriefing({ params }: PageProps<"/forms/[codigo]">) {
  return <BriefingDeVerdade codigo={(await params).codigo.toUpperCase()} />;
}

import type { Metadata } from "next";

import { DocumentoLegal } from "@/components/documento-legal";
import Painel from "@/content/painel.mdx";

// A página inicial do app "Painel Adsgator" no Google Cloud (verificação da
// marca, pedida para o acesso Basic da Google Ads API; plano geral do painel,
// Parte 4). O título é o nome do app, sem o "· Adsgator" das outras páginas,
// para bater com a tela de consentimento. Fica fora do menu e do sitemap.
export const metadata: Metadata = {
  title: { absolute: "Painel Adsgator" },
  description: "O sistema interno da Adsgator: o que ele faz, quem usa e como trata os dados do Google Ads e do Google Analytics.",
  alternates: { canonical: "/painel" },
};

export default function Page() {
  return (
    <DocumentoLegal assunto="o Painel Adsgator" outro={{ href: "/privacidade", rotulo: "Ler a Política de Privacidade" }}>
      <Painel />
    </DocumentoLegal>
  );
}

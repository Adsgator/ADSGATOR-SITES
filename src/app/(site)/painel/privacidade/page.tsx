import type { Metadata } from "next";

import { DocumentoLegal } from "@/components/documento-legal";
import PrivacidadeDoPainel from "@/content/painel-privacidade.mdx";

// A política de privacidade do app "Painel Adsgator" no Google Cloud (o link
// do Branding): página só dele, como a ajuda do Google Cloud pede ("App Privacy
// Policy"). Fica fora do menu e do sitemap, como o /painel.
export const metadata: Metadata = {
  title: { absolute: "Política de Privacidade do Painel Adsgator" },
  description: "Como o Painel Adsgator acessa, usa, guarda, protege, compartilha e apaga os dados do Google Ads e do Google Analytics.",
  alternates: { canonical: "/painel/privacidade" },
};

export default function Page() {
  return (
    <DocumentoLegal assunto="a Política de Privacidade do Painel Adsgator" outro={{ href: "/painel", rotulo: "Ver o Painel Adsgator" }}>
      <PrivacidadeDoPainel />
    </DocumentoLegal>
  );
}

import type { Metadata } from "next";

import { DocumentoLegal } from "@/components/documento-legal";
import Privacidade from "@/content/privacidade.mdx";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Adsgator trata os dados pessoais de clientes e visitantes.",
  alternates: { canonical: "/privacidade" },
};

export default function Page() {
  return (
    <DocumentoLegal assunto="a Política de Privacidade" outro={{ href: "/termos", rotulo: "Ler os Termos de Serviço" }}>
      <Privacidade />
    </DocumentoLegal>
  );
}

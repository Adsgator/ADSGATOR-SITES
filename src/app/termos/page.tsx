import type { Metadata } from "next";

import { DocumentoLegal } from "@/components/documento-legal";
import Termos from "@/content/termos.mdx";

export const metadata: Metadata = {
  title: "Termos de Serviço",
  description: "Termos de Serviço da Adsgator: o que cada serviço inclui, prazos, pagamento, cancelamento sem fidelidade e reembolso.",
  alternates: { canonical: "/termos" },
};

export default function Page() {
  return (
    <DocumentoLegal assunto="os Termos de Serviço" outro={{ href: "/privacidade", rotulo: "Ler a Política de Privacidade" }}>
      <Termos />
    </DocumentoLegal>
  );
}

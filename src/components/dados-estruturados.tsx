import { site } from "@/config/site";

/**
 * Dados estruturados (JSON-LD) para o Google entender a página: quem é a
 * empresa e o que ela oferece. O `<` vira `<` para o texto não fechar a
 * tag (guia de JSON-LD do Next.js, node_modules/next/dist/docs).
 */
export function DadosEstruturados({ dados }: { dados: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...dados }).replace(/</g, "\\u003c") }}
    />
  );
}

/** O identificador da empresa, para os serviços apontarem para ela. */
export const idDaEmpresa = `${site.url}/#empresa`;

/** A empresa e o site, no layout (valem para todas as páginas). */
export const dadosDaEmpresa = {
  "@graph": [
    {
      "@type": "Organization",
      "@id": idDaEmpresa,
      name: site.nome,
      url: site.url,
      logo: `${site.url}/brand/logo-light.svg`,
      description: site.descricao,
      email: site.email,
      telephone: "+55 19 99802-6222",
      foundingDate: "2020",
      founder: { "@type": "Person", name: "Lucas Simões" },
      areaServed: { "@type": "Country", name: "Brasil" },
      knowsLanguage: "pt-BR",
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#site`,
      name: site.nome,
      url: site.url,
      inLanguage: "pt-BR",
      publisher: { "@id": idDaEmpresa },
    },
  ],
};

/** Um serviço da Adsgator, na página dele. */
export function dadosDoServico({ nome, descricao, caminho }: { nome: string; descricao: string; caminho: string }) {
  return {
    "@type": "Service",
    name: nome,
    description: descricao,
    url: `${site.url}${caminho}`,
    serviceType: nome,
    provider: { "@id": idDaEmpresa },
    areaServed: { "@type": "Country", name: "Brasil" },
  };
}

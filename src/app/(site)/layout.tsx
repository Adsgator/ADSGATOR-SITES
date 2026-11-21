import { DadosEstruturados, dadosDaEmpresa } from "@/components/dados-estruturados";
import { AvisoDeCookies, RastreamentoDoWhatsApp } from "@/components/medicao";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFlutuante } from "@/components/whatsapp-flutuante";
import { site } from "@/config/site";

// O que é só do site: cabeçalho, rodapé, WhatsApp flutuante, aviso de cookies e
// o clique no WhatsApp. O script da medição fica no layout comum (no <head>).
// A Central de Ajuda fica fora deste grupo e não mede nada.
export default function LayoutDoSite({ children }: LayoutProps<"/">) {
  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${site.gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <DadosEstruturados dados={dadosDaEmpresa} />
      <SiteHeader />
      {/* O cabeçalho é fixo (flutua ao rolar): o conteúdo começa abaixo dele. */}
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter />
      <WhatsAppFlutuante />
      <AvisoDeCookies />
      <RastreamentoDoWhatsApp />
    </>
  );
}

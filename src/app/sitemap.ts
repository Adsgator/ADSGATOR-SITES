import type { MetadataRoute } from "next";

import { site } from "@/config/site";

const paginas = ["", "/google-ads", "/landing-page", "/manutencao", "/como-funciona", "/portfolio", "/quem-esta-por-tras", "/termos", "/privacidade"];
// A Central de Ajuda fica em outro endereço (ajuda.adsgator.com.br), fora deste mapa.

export default function sitemap(): MetadataRoute.Sitemap {
  const geradoEm = new Date();
  return paginas.map((caminho) => ({
    url: `${site.url}${caminho}`,
    lastModified: geradoEm,
  }));
}

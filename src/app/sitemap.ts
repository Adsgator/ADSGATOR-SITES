import type { MetadataRoute } from "next";

import { site } from "@/config/site";

const paginas = ["", "/google-ads", "/landing-page", "/manutencao", "/como-funciona", "/portfolio", "/quem-esta-por-tras", "/termos", "/privacidade", "/ajuda"];

export default function sitemap(): MetadataRoute.Sitemap {
  const geradoEm = new Date();
  return paginas.map((caminho) => ({
    url: `${site.url}${caminho}`,
    lastModified: geradoEm,
  }));
}

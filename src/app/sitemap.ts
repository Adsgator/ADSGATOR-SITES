import type { MetadataRoute } from "next";

import { site } from "@/config/site";

const paginas = ["", "/termos", "/privacidade", "/ajuda"];

export default function sitemap(): MetadataRoute.Sitemap {
  const geradoEm = new Date();
  return paginas.map((caminho) => ({
    url: `${site.url}${caminho}`,
    lastModified: geradoEm,
  }));
}

import type { MetadataRoute } from "next";

import { site } from "@/config/site";

// Site público: liberado para o Google (o contrário do painel).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

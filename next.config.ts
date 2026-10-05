import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// CSP sem nonce, como no guia de CSP do Next ("Without Nonces"): assim as
// páginas continuam estáticas. Serve porque o site não tem login, formulário
// nem conteúdo de usuário; rever na Fase 4 (checkout). O 'unsafe-inline' em
// script-src cobre os scripts do próprio Next e o do next-themes (que aplica
// o tema antes de a página aparecer).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// Copiados do painel (ADSGATOR-PAINEL/next.config.ts), sem o noindex: o site
// é público e deve aparecer no Google.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

// Endereços antigos do WordPress deste domínio (DOCS/PLANO-SITE.md, Fase 0).
// As 6 páginas de portfólio ficam de fora porque têm nome de cliente no
// endereço: caem na página 404 até a decisão 8 do plano.
const enderecosAntigos: [origem: string, destino: string][] = [
  ["/termos-de-servico", "/termos"],
  ["/politicas-de-privacidade", "/privacidade"],
  ["/politicas-de-reembolso", "/termos#reembolso"],
  ["/landing-page-pro", "/"],
  ["/google-ads", "/"],
  ["/portfolios", "/"],
  ["/portfolio", "/"],
  ["/links", "/"],
  ["/home", "/"],
  ["/erro-404", "/"],
  ["/2023/04/06/cobertura-em-todo-o-brasil", "/"],
  ["/author/lucas", "/"],
  ["/category/uncategorized", "/"],
  // Sitemap do Yoast, que o Google pode ter guardado.
  ["/sitemap_index.xml", "/sitemap.xml"],
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return enderecosAntigos.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

// Textos longos (Termos, Privacidade) ficam em arquivos .mdx em src/content.
const withMDX = createMDX({});

export default withMDX(nextConfig);

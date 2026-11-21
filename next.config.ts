import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// CSP sem nonce, como no guia de CSP do Next ("Without Nonces"): assim as
// páginas continuam estáticas. Serve porque o site não tem login, formulário
// nem conteúdo de usuário; rever na Fase 4 (checkout). O 'unsafe-inline' em
// script-src cobre os scripts do próprio Next e o do next-themes (que aplica
// o tema antes de a página aparecer).
// Adobe Fonts (Servus Slab, a fonte da marca): o CSS vem de use.typekit.net,
// que importa um arquivo vazio de contagem de p.typekit.net; as fontes vêm de
// use.typekit.net. A licença não permite servir os arquivos daqui.
// Medição (GTM com o Google Analytics e o Google Ads): os endereços do guia do
// Google para CSP (developers.google.com/tag-platform/security/guides/csp, lido
// em 2026-11-20): GTM e o modo de visualização dele, GA4 com os recursos de
// anúncio e as conversões e o remarketing do Google Ads; do domínio do Google
// por país, só o .com.br.
const google = {
  // googleads.g.doubleclick.net também como script: a tag de remarketing do Google
  // Ads carrega um script de lá (visto no teste; o guia só o lista em img e connect).
  script: "https://www.googletagmanager.com https://tagmanager.google.com https://www.googleadservices.com https://www.google.com https://googleads.g.doubleclick.net",
  img: "https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com https://*.google.com.br https://*.g.doubleclick.net https://www.googleadservices.com https://pagead2.googlesyndication.com https://ssl.gstatic.com https://www.gstatic.com",
  connect:
    "https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com https://*.google.com.br https://*.g.doubleclick.net https://ad.doubleclick.net https://www.googleadservices.com https://pagead2.googlesyndication.com",
  frame: "https://www.googletagmanager.com",
  style: "https://www.googletagmanager.com https://tagmanager.google.com https://fonts.googleapis.com",
  font: "https://fonts.gstatic.com",
};
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${google.script}`,
  `style-src 'self' 'unsafe-inline' https://use.typekit.net https://p.typekit.net ${google.style}`,
  `img-src 'self' blob: data: ${google.img}`,
  `connect-src 'self' ${google.connect}`,
  `frame-src ${google.frame}`,
  `font-src 'self' data: https://use.typekit.net ${google.font}`,
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
  ["/landing-page-pro", "/landing-page"],
  ["/portfolios", "/portfolio"],
  ["/links", "/"],
  ["/home", "/"],
  ["/erro-404", "/"],
  ["/2023/04/06/cobertura-em-todo-o-brasil", "/"],
  ["/author/lucas", "/"],
  ["/category/uncategorized", "/"],
  // Sitemap do Yoast, que o Google pode ter guardado.
  ["/sitemap_index.xml", "/sitemap.xml"],
];

// Briefings em forms.adsgator.com.br (decisão 3 do plano): página simples com o
// formulário do respondi incorporado, em public/forms/. Só essa página libera o
// respondi na CSP; o resto do site continua fechado.
const noForms = [{ type: "host" as const, value: "forms.adsgator.com.br" }];
const cspBriefing = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://embed.respondi.app",
  "style-src 'self' 'unsafe-inline' https://embed.respondi.app",
  "frame-src https://form.respondi.app",
  "img-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/:path*",
        has: noForms,
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/briefing-google-ads",
        has: noForms,
        headers: [{ key: "Content-Security-Policy", value: cspBriefing }],
      },
    ];
  },
  async redirects() {
    return [
      ...enderecosAntigos.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      {
        source: "/",
        has: noForms,
        destination: "https://www.adsgator.com.br/",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/briefing-google-ads",
        has: noForms,
        destination: "/forms/briefing-google-ads.html",
      },
    ];
  },
};

// Textos longos (Termos, Privacidade) ficam em arquivos .mdx em src/content.
const withMDX = createMDX({});

export default withMDX(nextConfig);

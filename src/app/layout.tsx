import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/config/site";
import { scriptDaMedicao } from "@/lib/medicao";
import "./globals.css";

// Base comum ao site e à Central de Ajuda: fontes, tema, estilos e o script da
// medição (que se desliga na central). O que é só do site (cabeçalho, rodapé,
// aviso de cookies e o clique no WhatsApp) fica em (site)/layout.tsx; a
// central (ajuda/layout.tsx) não mede nada (decisão do Lucas, 2026-11-20).

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.nome,
    template: `%s · ${site.nome}`,
  },
  description: site.descricao,
  openGraph: {
    siteName: site.nome,
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Medição: o consentimento negado por padrão e o GTM, antes de tudo
            (components/medicao.tsx; CSP no next.config.ts). Aqui, e não no
            layout do site, porque script no <head> roda também quando a pessoa
            sai da 404 para o site; o próprio script não faz nada na central. */}
        <script dangerouslySetInnerHTML={{ __html: scriptDaMedicao(site.gtmId) }} />
        {/* Servus Slab, a fonte da marca, pelo projeto web da Adobe Fonts do
            Lucas (a licença só permite servir pela Adobe; CSP no
            next.config.ts). */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/eaw0vap.css" />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Claro por padrão (decisão 1 do plano); o visitante pode trocar. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

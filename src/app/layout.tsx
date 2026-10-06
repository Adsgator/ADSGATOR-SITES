import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/config/site";
import "./globals.css";

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
          <SiteHeader />
          {/* O cabeçalho é fixo (flutua ao rolar): o conteúdo começa abaixo dele. */}
          <main className="flex-1 pt-16">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}

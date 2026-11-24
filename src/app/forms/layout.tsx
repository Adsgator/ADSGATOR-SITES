import type { Metadata } from "next";

// Briefings em forms.adsgator.com.br (plano geral, Parte 5): abrem pelo link que o
// cliente recebe, fora do Google, sem medição nem aviso de cookies.

export const metadata: Metadata = {
  title: { absolute: "Briefing · Adsgator" },
  description: "Conte sobre o seu negócio para a gente começar.",
  robots: { index: false, follow: false },
};

export default function LayoutDosBriefings({ children }: LayoutProps<"/forms">) {
  return children;
}

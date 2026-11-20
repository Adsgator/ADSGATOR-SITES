import { LayoutTemplateIcon, MousePointerClickIcon, ShieldCheckIcon } from "lucide-react";

// Páginas do site, do roteiro aprovado pelo Lucas em 2026-11-20 (plano geral,
// Parte 2). Usadas pelo menu do topo, pela gaveta do celular e pelo rodapé.

export const servicos = [
  {
    href: "/google-ads",
    titulo: "Google Ads",
    linha: "Apareça para quem procura o seu serviço agora.",
    icone: MousePointerClickIcon,
  },
  {
    href: "/landing-page",
    titulo: "Landing page",
    linha: "A página que transforma o clique em conversa.",
    icone: LayoutTemplateIcon,
  },
  {
    href: "/manutencao",
    titulo: "Manutenção",
    linha: "Sua página sempre no ar, sem você se preocupar.",
    icone: ShieldCheckIcon,
  },
] as const;

export const paginas = [
  { href: "/como-funciona", rotulo: "Como funciona" },
  { href: "/portfolio", rotulo: "Portfólio" },
  { href: "/quem-esta-por-tras", rotulo: "Quem está por trás" },
] as const;

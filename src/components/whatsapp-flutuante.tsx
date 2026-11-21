"use client";

import { usePathname } from "next/navigation";

import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { linkWhatsApp, mensagemDaPagina } from "@/config/site";

// O botão flutuante do WhatsApp (pedido do Lucas, 2026-11-20): em todas as
// páginas, no canto de baixo à direita, com a mensagem pronta da página (como
// os outros convites). O anel que pulsa chama a atenção sem cobrir o conteúdo;
// o aviso de cookies, quando aberto, fica por cima dele.

export function WhatsAppFlutuante() {
  const whatsapp = linkWhatsApp(mensagemDaPagina(usePathname()));
  return (
    <a
      href={whatsapp}
      data-whatsapp-flutuante
      aria-label="Falar com a Adsgator no WhatsApp"
      className="group fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgb(37_211_102/0.7)] transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-[#25D366]/40 focus-visible:outline-none sm:right-6 sm:bottom-6"
    >
      <span aria-hidden="true" className="motion-loop pulso-whatsapp absolute inset-0 rounded-full bg-[#25D366]" />
      <IconeWhatsApp className="relative size-7" />
    </a>
  );
}

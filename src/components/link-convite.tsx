"use client";

import { usePathname } from "next/navigation";

import { linkWhatsApp, mensagemDaPagina } from "@/config/site";

/** Convite do diagnóstico grátis: abre o WhatsApp com a mensagem da página
 * aberta, para o Lucas saber de onde a pessoa veio (roteiro do site, seção 1).
 * Para usar no que é igual em todas as páginas (menu e rodapé). */
export function LinkConvite(props: Omit<React.ComponentProps<"a">, "href">) {
  return <a href={linkWhatsApp(mensagemDaPagina(usePathname()))} {...props} />;
}

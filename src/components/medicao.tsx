"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

import { buttonVariants } from "@/components/ui/button";
import { CHAVE_DO_CONSENTIMENTO as CHAVE } from "@/lib/medicao";
import { cn } from "@/lib/utils";

// Medição do site (pedido do Lucas, 2026-11-20): Google Tag Manager com o
// Google Analytics e, quando houver, o Google Ads, no padrão das landing pages
// da Adsgator: Consent Mode v2 começando com tudo negado, o aviso de cookies
// que libera só com o "Aceitar" (guardado em `cookie-consent`, a mesma chave
// das landing pages) e o clique em qualquer botão do WhatsApp como o evento
// `contato_wpp` no dataLayer. As tags ficam no contêiner do GTM.

const EVENTO = "adsgator:cookies";

type Escolha = "accepted" | "rejected";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function lerEscolha(): Escolha | null {
  try {
    const valor = localStorage.getItem(CHAVE);
    return valor === "accepted" || valor === "rejected" ? valor : null;
  } catch {
    // Navegador que bloqueia o armazenamento: o aviso aparece, e a escolha vale só na visita.
    return null;
  }
}

function assinar(avisar: () => void) {
  window.addEventListener(EVENTO, avisar);
  window.addEventListener("storage", avisar);
  return () => {
    window.removeEventListener(EVENTO, avisar);
    window.removeEventListener("storage", avisar);
  };
}

function guardar(escolha: Escolha | null) {
  try {
    if (escolha) localStorage.setItem(CHAVE, escolha);
    else localStorage.removeItem(CHAVE);
  } catch {
    // Sem armazenamento: segue sem guardar.
  }
  if (escolha) {
    const valor = escolha === "accepted" ? "granted" : "denied";
    window.gtag?.("consent", "update", {
      ad_storage: valor,
      analytics_storage: valor,
      ad_user_data: valor,
      ad_personalization: valor,
    });
  }
  window.dispatchEvent(new Event(EVENTO));
}

/** O aviso de cookies, no canto da tela, até a pessoa escolher. */
export function AvisoDeCookies() {
  // No servidor não há escolha para ler: o aviso só aparece no navegador.
  const escolha = useSyncExternalStore(assinar, lerEscolha, () => "accepted" as const);
  if (escolha) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      data-aviso-cookies
      className="fixed inset-x-4 bottom-4 z-[60] rounded-3xl border bg-card p-5 text-card-foreground shadow-2xl shadow-ink/20 sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-sm"
    >
      <p className="font-heading text-lg">Cookies</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Com a sua permissão, usamos cookies para entender como o site é usado e medir os contatos que chegam. Você
        escolhe.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => guardar("accepted")}
          className={cn(buttonVariants(), "h-10 flex-1 rounded-full bg-brand text-brand-foreground hover:bg-brand/90")}
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => guardar("rejected")}
          className={cn(buttonVariants({ variant: "outline" }), "h-10 flex-1 rounded-full bg-transparent")}
        >
          Recusar
        </button>
      </div>
      <Link href="/privacidade#quem-visita-o-site" className="mt-3 inline-block text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
        Como usamos os cookies
      </Link>
    </div>
  );
}

/** No rodapé: reabre o aviso para a pessoa mudar a escolha (LGPD). */
export function BotaoPreferenciasDeCookies({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => guardar(null)} className={className}>
      Preferências de cookies
    </button>
  );
}

/**
 * O clique em qualquer botão do WhatsApp vira o evento `contato_wpp` no
 * dataLayer (o mesmo das landing pages), com a página e a seção de onde veio.
 */
export function RastreamentoDoWhatsApp() {
  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="https://wa.me/"]');
      if (!link) return;
      const secao = link.closest("section[id], [data-secao], section")?.getAttribute("id") ?? link.closest("footer, header")?.tagName.toLowerCase();
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "contato_wpp",
        click_action: "whatsapp",
        click_section: secao || "pagina",
        page_path: window.location.pathname,
      });
    };
    document.addEventListener("click", aoClicar);
    return () => document.removeEventListener("click", aoClicar);
  }, []);
  return null;
}

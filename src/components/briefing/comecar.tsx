"use client";

import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";

import { BrandLogo } from "@/components/brand";
import type { TipoDeBriefing } from "@/lib/briefing/regras";

// O endereço sem código (os das mensagens antigas): a pessoa diz quem é e o briefing começa.

const campo =
  "h-14 w-full rounded-xl border border-input bg-card px-4 text-base outline-none placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";

const escrever = (texto: string) => {
  const n = texto.replace(/\D/g, "").slice(0, 11);
  if (n.length < 3) return n;
  return `(${n.slice(0, 2)}) ${n.length > 6 ? `${n.slice(2, -4)}-${n.slice(-4)}` : n.slice(2)}`;
};

export function Comecar({ tipo }: { tipo: TipoDeBriefing }) {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [erro, setErro] = useState("");
  const [indo, setIndo] = useState(false);

  async function comecar() {
    if (nome.trim().length < 2) return setErro("Escreva o seu nome.");
    if (whatsapp.replace(/\D/g, "").length < 10) return setErro("Escreva o WhatsApp com o DDD.");
    setErro("");
    setIndo(true);
    const r = await fetch("/forms/api/comecar", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tipo, nome, whatsapp }),
    }).catch(() => null);
    const dados = (await r?.json().catch(() => null)) as { codigo?: string } | null;
    if (r?.ok && dados?.codigo) {
      // Página inteira: o endereço curto é do servidor (next.config.ts).
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/${dados.codigo}`;
      return;
    }
    setIndo(false);
    setErro(
      r?.status === 400
        ? "Confira o nome e o WhatsApp."
        : r?.status === 429
          ? "Não conseguimos começar agora. Fale com a gente no WhatsApp que mandamos o seu link."
          : "Não conseguimos começar agora. Tente de novo em instantes.",
    );
  }

  return (
    <main className="dark section-ink bg-pattern-dark flex min-h-dvh flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6">
        <BrandLogo />
      </div>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void comecar();
        }}
        className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10"
      >
        <h1 className="font-heading text-4xl leading-tight text-balance">
          Antes de começar, <span className="highlight">quem é você?</span>
        </h1>
        <p className="mt-4 leading-7 text-pretty text-muted-foreground">
          {tipo === "pagina" ? "É o briefing da sua página." : "É o briefing do seu Google Ads."} Com o seu nome e o seu WhatsApp, as respostas
          chegam no lugar certo, e você pode continuar depois.
        </p>
        <label className="mt-8 block space-y-2">
          <span className="text-sm font-medium">Seu nome</span>
          <input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" maxLength={120} className={campo} />
        </label>
        <label className="mt-5 block space-y-2">
          <span className="text-sm font-medium">Seu WhatsApp</span>
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(escrever(e.target.value))}
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(00) 00000-0000"
            className={campo}
          />
        </label>
        <p role="alert" className="mt-3 min-h-6 text-sm font-medium text-brand">
          {erro}
        </p>
        <button
          type="submit"
          disabled={indo}
          className="mt-2 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground disabled:opacity-60"
        >
          {indo ? "Abrindo..." : "Continuar"}
          <ArrowRightIcon className="size-5" aria-hidden="true" />
        </button>
      </form>
    </main>
  );
}

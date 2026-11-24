import { notFound } from "next/navigation";

import { BrandLogo } from "@/components/brand";
import { briefingsDaAmostra } from "@/lib/briefing/amostra";

// O começo da amostra do briefing: só no `next dev`, nunca publicada.

export default function InicioDaAmostra() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12">
      <BrandLogo />
      <h1 className="mt-8 font-heading text-3xl">Amostra do briefing</h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        Negócios inventados. As respostas ficam só neste navegador.
      </p>
      <ul className="mt-8 space-y-4">
        {briefingsDaAmostra.map((b) => (
          <li key={b.slug} className="rounded-2xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{b.tipo === "pagina" ? "Página" : "Google Ads"}</p>
            <h2 className="font-heading text-xl">{b.segmento}</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-sm font-medium">
              <a href={`/forms/amostra/${b.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-brand-foreground">
                Abrir
              </a>
              <a
                href={`/forms/amostra/${b.slug}?aparelho=outro`}
                className="inline-flex min-h-11 items-center rounded-full border border-input px-5 hover:bg-muted"
              >
                Como se fosse outro aparelho
              </a>
              <a
                href={`/forms/amostra/${b.slug}/agencia`}
                className="inline-flex min-h-11 items-center rounded-full border border-input px-5 hover:bg-muted"
              >
                Como você vai ver
              </a>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-6 text-muted-foreground">
        Em outro aparelho, os 4 números da amostra são 0000.
      </p>
    </main>
  );
}

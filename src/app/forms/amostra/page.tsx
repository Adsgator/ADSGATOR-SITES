import { notFound } from "next/navigation";

import { BrandLogo } from "@/components/brand";
import { Zerar } from "@/components/briefing/zerar";
import { briefingsDaAmostra } from "@/lib/briefing/amostra";

// O começo da amostra do briefing: só no `next dev`, nunca publicada.

const cheio = "inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-brand-foreground";
const contorno = "inline-flex min-h-11 items-center rounded-full border border-input px-5 hover:bg-muted";

export default function InicioDaAmostra() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12">
      <BrandLogo />
      <h1 className="mt-8 font-heading text-3xl">Amostra do briefing</h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        Negócios inventados. As respostas ficam só neste navegador.
      </p>
      <Zerar />
      <ul className="mt-8 space-y-4">
        {briefingsDaAmostra.map((b) => (
          <li key={b.slug} className="rounded-2xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{b.tipo === "pagina" ? "Página" : "Google Ads"}</p>
            <h2 className="font-heading text-xl">{b.segmento}</h2>
            <p className="mt-4 text-sm font-medium">Já preenchido</p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm font-medium">
              <a href={`/forms/amostra/${b.slug}?preenchido=1&ir=fim`} className={cheio}>
                O fim
              </a>
              <a href={`/forms/amostra/${b.slug}?preenchido=1&ir=revisao`} className={contorno}>
                A revisão
              </a>
              {b.pastaDoMaterial && (
                <a href={`/forms/amostra/${b.slug}?preenchido=1&ir=material`} className={contorno}>
                  O material
                </a>
              )}
              <a href={`/forms/amostra/${b.slug}?preenchido=1`} className={contorno}>
                Quem volta
              </a>
              <a href={`/forms/amostra/${b.slug}/agencia?preenchido=1`} className={contorno}>
                Como você vai ver
              </a>
            </div>
            <p className="mt-5 text-sm font-medium">Do zero</p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm font-medium">
              <a href={`/forms/amostra/${b.slug}`} className={cheio}>
                Abrir
              </a>
              <a href={`/forms/amostra/${b.slug}?aparelho=outro`} className={contorno}>
                Outro aparelho
              </a>
              <a href={`/forms/amostra/${b.slug}/agencia`} className={contorno}>
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

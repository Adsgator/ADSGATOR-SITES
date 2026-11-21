import { Eyebrow } from "@/components/eyebrow";

// A faixa escura do topo do checkout e o conteúdo que sobe por cima dela. Na
// tela do resultado, a faixa dá o resultado ("Mensalidade ativada") e o cartão
// embaixo fica só com os detalhes (Lucas, 2026-11-21).

export function Faixa({ rotulo, titulo, texto }: { rotulo: string; titulo: React.ReactNode; texto?: React.ReactNode }) {
  return (
    <div className="dark section-ink bg-pattern-dark bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:pt-14 sm:pb-28">
        <Eyebrow>{rotulo}</Eyebrow>
        <h1 className="mt-4 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl" data-titulo>
          {titulo}
        </h1>
        {texto && <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">{texto}</p>}
      </div>
    </div>
  );
}

/** O conteúdo logo abaixo da faixa, subindo por cima dela. */
export function ConteudoDaFaixa({ children }: { children: React.ReactNode }) {
  return (
    // relative: por cima da faixa, que tem posição própria (o padrão da marca).
    <div className="relative mx-auto -mt-14 max-w-6xl px-4 pb-14 sm:-mt-16">{children}</div>
  );
}

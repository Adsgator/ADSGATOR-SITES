import { notFound } from "next/navigation";

import { Galeria } from "@/components/briefing/galeria";

// Todas as combinações do visual lado a lado, para conferir (só no `next dev`).

export default async function GaleriaDaAmostra({ searchParams }: PageProps<"/forms/amostra/galeria">) {
  const { sensacoes, cor, so } = await searchParams;
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <Galeria
      sensacoes={typeof sensacoes === "string" ? sensacoes.split(",") : []}
      cor={typeof cor === "string" ? cor : undefined}
      so={typeof so === "string" ? so.split(",") : undefined}
    />
  );
}

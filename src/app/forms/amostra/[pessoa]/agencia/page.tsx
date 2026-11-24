import { notFound } from "next/navigation";

import { VisaoDaAgencia } from "@/components/briefing/visao-da-agencia";
import { briefingsDaAmostra } from "@/lib/briefing/amostra";
import { exemplos } from "@/lib/briefing/amostra-preenchida";

export default async function AgenciaDaAmostra({ params, searchParams }: PageProps<"/forms/amostra/[pessoa]/agencia">) {
  const { pessoa } = await params;
  const { preenchido } = await searchParams;
  const briefing = briefingsDaAmostra.find((b) => b.slug === pessoa);
  if (process.env.NODE_ENV !== "development" || !briefing) notFound();
  return preenchido ? (
    <VisaoDaAgencia briefing={{ ...briefing, slug: `${pessoa}-exemplo` }} exemplo={exemplos[pessoa]} />
  ) : (
    <VisaoDaAgencia briefing={briefing} />
  );
}

import { notFound } from "next/navigation";

import { VisaoDaAgencia } from "@/components/briefing/visao-da-agencia";
import { briefingsDaAmostra } from "@/lib/briefing/amostra";

export default async function AgenciaDaAmostra({ params }: PageProps<"/forms/amostra/[pessoa]/agencia">) {
  const { pessoa } = await params;
  const briefing = briefingsDaAmostra.find((b) => b.slug === pessoa);
  if (process.env.NODE_ENV !== "development" || !briefing) notFound();
  return <VisaoDaAgencia briefing={briefing} />;
}

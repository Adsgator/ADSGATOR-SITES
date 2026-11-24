import { notFound } from "next/navigation";

import { BriefingDaAmostra } from "@/components/briefing/briefing";
import { briefingsDaAmostra } from "@/lib/briefing/amostra";
import { exemplos } from "@/lib/briefing/amostra-preenchida";

export default async function PaginaDaAmostra({ params, searchParams }: PageProps<"/forms/amostra/[pessoa]">) {
  const { pessoa } = await params;
  const { aparelho, preenchido, ir } = await searchParams;
  const briefing = briefingsDaAmostra.find((b) => b.slug === pessoa);
  if (process.env.NODE_ENV !== "development" || !briefing) notFound();
  const comeco = aparelho === "outro" ? "aparelho" : ir === "fim" || ir === "revisao" || ir === "material" ? ir : "normal";
  // O exemplo tem endereço próprio no navegador: não mexe no que a pessoa respondeu.
  return preenchido ? (
    <BriefingDaAmostra briefing={{ ...briefing, slug: `${pessoa}-exemplo` }} comeco={comeco} exemplo={exemplos[pessoa]} />
  ) : (
    <BriefingDaAmostra briefing={briefing} comeco={comeco} />
  );
}

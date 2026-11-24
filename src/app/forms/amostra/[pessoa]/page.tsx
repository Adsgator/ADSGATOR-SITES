import { notFound } from "next/navigation";

import { BriefingDaAmostra } from "@/components/briefing/briefing";
import { briefingsDaAmostra } from "@/lib/briefing/amostra";

export default async function PaginaDaAmostra({ params, searchParams }: PageProps<"/forms/amostra/[pessoa]">) {
  const { pessoa } = await params;
  const { aparelho } = await searchParams;
  const briefing = briefingsDaAmostra.find((b) => b.slug === pessoa);
  if (process.env.NODE_ENV !== "development" || !briefing) notFound();
  return <BriefingDaAmostra briefing={briefing} outroAparelho={aparelho === "outro"} />;
}

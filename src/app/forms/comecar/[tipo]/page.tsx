import { notFound } from "next/navigation";

import { Comecar } from "@/components/briefing/comecar";

// Os dois endereços sem código das mensagens: /briefing-pro (página) e /briefing-google-ads.

const tipos: Record<string, "pagina" | "google_ads"> = { pagina: "pagina", "google-ads": "google_ads" };

export function generateStaticParams() {
  return Object.keys(tipos).map((tipo) => ({ tipo }));
}

export default async function ComecarOBriefing({ params }: PageProps<"/forms/comecar/[tipo]">) {
  const tipo = tipos[(await params).tipo];
  if (!tipo) notFound();
  return <Comecar tipo={tipo} />;
}

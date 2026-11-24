import { notFound } from "next/navigation";

import { Mesa } from "@/components/briefing/mockup/mesa";

// As composições novas do desenho, para o Lucas aprovar o nível (só no `next dev`).

export default function MockupsDaAmostra() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <Mesa />;
}

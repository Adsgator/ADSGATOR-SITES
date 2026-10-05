import type { Metadata } from "next";

import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Central de Ajuda",
  description: "Fale com a Adsgator pelo WhatsApp ou por e-mail.",
  alternates: { canonical: "/ajuda" },
};

// Provisória até a Fase 2 (artigos da ajuda): o endereço está no rodapé de
// todos os e-mails e não pode dar 404.
export default function Ajuda() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Central de Ajuda</h1>
      <p className="mt-4 leading-7">
        Os artigos da central de ajuda estão sendo atualizados. Enquanto isso,
        fale com a gente:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
        <li>
          WhatsApp:{" "}
          <a className="font-medium underline underline-offset-4" href={site.whatsapp.link}>
            {site.whatsapp.exibicao}
          </a>
        </li>
        <li>
          E-mail:{" "}
          <a className="font-medium underline underline-offset-4" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </li>
      </ul>
      <p className="mt-4 leading-7 text-muted-foreground">
        Atendimento: {site.horario.toLowerCase()}.
      </p>
    </article>
  );
}

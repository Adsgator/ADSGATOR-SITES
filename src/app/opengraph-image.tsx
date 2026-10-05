import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

// Imagem que aparece quando o link do site é compartilhado (WhatsApp, redes).
// Gerada no build: fundo do tema escuro, logo para fundo escuro (o "ADS"
// amarelo some sobre amarelo) e a faixa amarela da marca, como nos e-mails.
export const alt = "Adsgator: Google Ads e landing pages para negócios locais";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = await readFile(
  join(process.cwd(), "public/brand/logo-dark.svg"),
  "base64",
);

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#0a0a0a",
          color: "#fafafa",
          borderBottom: "16px solid #FFB100",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse só aceita <img> */}
        <img src={`data:image/svg+xml;base64,${logo}`} width={560} height={103} alt="" />
        <div style={{ marginTop: 56, fontSize: 60, fontWeight: 600, lineHeight: 1.15 }}>
          Google Ads e landing pages para negócios locais
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#a1a1a1" }}>
          www.adsgator.com.br
        </div>
      </div>
    ),
    size,
  );
}

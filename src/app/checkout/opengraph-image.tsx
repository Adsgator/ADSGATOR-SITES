import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

// A imagem da prévia ao colar o link do checkout no WhatsApp (decisão 2 A do
// Lucas, 2026-11-21), no estilo da do site (src/app/opengraph-image.tsx): o
// título e o texto da prévia vêm do link (src/app/checkout/[codigo]/page.tsx).
export const alt = "Contratação Adsgator: Pix ou cartão, em ambiente seguro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = await readFile(join(process.cwd(), "public/brand/logo-dark.svg"), "base64");

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
        <div style={{ marginTop: 56, fontSize: 64, fontWeight: 600, lineHeight: 1.15 }}>Contratação</div>
        <div style={{ marginTop: 20, fontSize: 36, color: "#d4d4d4" }}>Pix ou cartão, em ambiente seguro</div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#a1a1a1" }}>checkout.adsgator.com.br</div>
      </div>
    ),
    size,
  );
}

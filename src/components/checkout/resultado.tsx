import { CheckCircle2Icon, CopyIcon, QrCodeIcon } from "lucide-react";

import { linkWhatsApp, site } from "@/config/site";
import { dataCurta, reais, type Forma, type Pedido } from "@/lib/checkout/pedido";

import { comoPaga } from "./resumo";

// Depois de contratar. PRÉVIA: o QR do Pix e a resposta do cartão ainda não
// vêm do Asaas; quando vierem, o Pix mostra o QR e o copia e cola de verdade e
// a tela muda sozinha quando o pagamento cair, e o cartão pode voltar
// aprovado, em análise ou recusado.

export function ResultadoDaContratacao({
  pedido,
  forma,
  parcelas,
  email,
}: {
  pedido: Pedido;
  forma: Forma;
  parcelas: number;
  email: string;
}) {
  const proximos = (
    <div className="mt-6 space-y-2 border-t pt-5 text-sm leading-6 text-muted-foreground">
      <p>
        Você vai receber a confirmação e os Termos aceitos no e-mail <strong className="text-foreground">{email}</strong>.
      </p>
      <p>Em seguida, a gente chama você no WhatsApp com os próximos passos.</p>
      <p>
        Alguma dúvida?{" "}
        <a href={linkWhatsApp("Olá! Acabei de contratar a Adsgator e tenho uma dúvida.")} className="font-medium text-foreground underline underline-offset-4">
          Fale com a gente no WhatsApp
        </a>{" "}
        ({site.whatsapp.exibicao}).
      </p>
    </div>
  );

  if (forma === "pix") {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-card p-6 sm:p-8" data-resultado="pix">
        <h2 className="font-heading text-2xl tracking-tight">Falta só o Pix</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pague {reais(pedido.totalHoje)} até {dataCurta(pedido.vencimento)} pelo QR Code ou pelo código abaixo. Esta tela muda
          sozinha quando o pagamento for confirmado.
        </p>
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex size-56 items-center justify-center rounded-xl border-2 border-dashed text-muted-foreground">
            <span className="flex flex-col items-center gap-2 text-xs">
              <QrCodeIcon className="size-10" aria-hidden="true" />
              QR Code do Pix
            </span>
          </div>
          <button
            type="button"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border text-sm font-medium hover:bg-muted"
          >
            <CopyIcon className="size-4" aria-hidden="true" />
            Copiar o código Pix
          </button>
        </div>
        {proximos}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border bg-card p-6 sm:p-8" data-resultado="cartao">
      <CheckCircle2Icon className="size-10 text-success" aria-hidden="true" />
      <h2 className="mt-4 font-heading text-2xl tracking-tight">Contratação confirmada</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pagamento de {reais(pedido.totalHoje)} aprovado {comoPaga(pedido, forma, parcelas)}.
      </p>
      {proximos}
    </div>
  );
}

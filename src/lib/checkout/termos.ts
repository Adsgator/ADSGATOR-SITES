// Os pontos principais dos Termos que valem para o pedido, em linguagem
// simples: a janela de aceite mostra, e o servidor manda os mesmos ao painel
// com o aceite (vão guardados com a contratação e no e-mail de confirmação).
// Vêm do resumo dos Termos publicados (src/content/termos.mdx).

import { dataCurta, type Forma, type Pedido } from "./pedido";

/** Pontos principais dos Termos que valem para este pedido. */
export function pontosDosTermos(pedido: Pedido, forma: Forma) {
  const temAds = pedido.servicos.some((s) => s.slug === "google-ads");
  const temCriacao = pedido.servicos.some((s) => s.tipo === "unico");
  const temMensal = pedido.mensalidades.some((m) => m.inicio !== "incluida");
  const pontos: string[] = [];

  if (temCriacao)
    pontos.push(
      "A página é sua depois de entregue, com o domínio no seu nome e o primeiro ano pago. Você aprova o roteiro, e há até 2 rodadas de ajustes.",
    );
  if (pedido.combo)
    pontos.push(
      "A mensalidade do Google Ads começa quando você aprovar a página: você recebe o link para pagar, com vencimento em 3 dias, e as próximas ficam nesse mesmo dia do mês.",
    );
  if (pedido.mensalidades.some((m) => m.inicio === "entrega"))
    pontos.push(
      "A manutenção começa 30 dias depois da entrega da página, que já vem com 30 dias de suporte: você recebe o link para pagar, e as próximas ficam nesse mesmo dia do mês.",
    );
  if (pedido.hoje.some((l) => l.mensal))
    pontos.push(
      `A mensalidade é paga antes: a primeira ${forma === "cartao" ? "é cobrada hoje" : `vence em ${dataCurta(pedido.vencimento)}`}, e cada uma libera os 30 dias seguintes.`,
    );
  if (temAds) pontos.push("A verba dos anúncios é paga por você direto ao Google e não entra nesta cobrança.");
  if (temMensal) {
    pontos.push("Sem fidelidade: os planos mensais podem ser cancelados quando você quiser, sem multa, avisando 48 horas antes do vencimento.");
    pontos.push("Com 7 dias de atraso na mensalidade, o serviço é suspenso; com 15, o plano é cancelado.");
  }
  pontos.push("Garantia de 7 dias: se desistir em até 7 dias da contratação, você recebe de volta o que pagou à Adsgator.");
  pontos.push("A Adsgator não garante vendas, contatos nem posição no Google: o resultado do seu negócio é seu.");
  return pontos;
}

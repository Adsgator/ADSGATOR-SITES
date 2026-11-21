// Checkout em checkout.adsgator.com.br (plano geral, Parte 4). Por dentro fica
// em /checkout; o next.config.ts leva o endereço checkout. para lá.

export const CHECKOUT_OFICIAL = "https://checkout.adsgator.com.br";

/** No `next dev` do Lucas (porta 3005), o checkout abre em checkout.localhost,
 * que o Chrome já leva para o próprio computador. */
export const enderecoDoCheckout =
  process.env.NODE_ENV === "development" ? "http://checkout.localhost:3005" : CHECKOUT_OFICIAL;

/** Mensagem pronta do WhatsApp para quem tem dúvida no checkout. */
export const mensagemDoCheckout = "Olá! Estou na página de contratação da Adsgator e tenho uma dúvida.";

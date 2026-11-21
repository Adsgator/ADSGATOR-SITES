// Endereços da Central de Ajuda (plano geral, Parte 3). Sem JSX: o
// next.config.ts importa este arquivo para os redirecionamentos.

/** Endereço oficial da central, usado no canonical e nas mensagens. */
export const AJUDA_OFICIAL = "https://ajuda.adsgator.com.br";

/** Para os links do site: no `next dev` (porta 3005, a do Lucas) a central
 * abre em ajuda.localhost, que o Chrome já leva para o próprio computador. */
export const enderecoDaAjuda =
  process.env.NODE_ENV === "development" ? "http://ajuda.localhost:3005" : AJUDA_OFICIAL;

/** O endereço de cada guia, na ordem da lista. */
export const guiasPublicados = [
  "aceitar-convite",
  "configurar-pagamento",
  "id-da-conta",
  "acesso-ao-perfil",
  "adicionar-saldo",
] as const;

export type GuiaSlug = (typeof guiasPublicados)[number];

/** Endereços da ajuda antiga (WordPress, em ajuda.adsgator.com.br/ajuda/...),
 * que estão nas mensagens e nos e-mails já enviados: cada um leva ao guia que
 * faz o mesmo papel hoje. O "criar conta" virou "onde fica a ID", porque a
 * conta nova a Adsgator cria; o texto "Já tem conta" da Base o mandava para
 * mostrar a ID. Nunca tirar daqui. */
export const guiasAntigos: Record<string, GuiaSlug> = {
  "como-criar-uma-conta-no-google-ads": "id-da-conta",
  "como-configurar-sua-conta-no-google-ads": "configurar-pagamento",
  "como-conceder-acesso-do-google-ads-para-a-adsgator": "aceitar-convite",
  "como-conceder-acesso-do-seu-google-meu-negocio": "acesso-ao-perfil",
  "como-adicionar-saldo-no-google-ads": "adicionar-saldo",
};

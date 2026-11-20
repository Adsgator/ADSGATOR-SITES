// Dados da Adsgator mostrados no site (cabeçalho, rodapé, início e ajuda).
// Iguais aos do site antigo; o Lucas confirma antes de publicar.
export const site = {
  nome: "Adsgator",
  url: "https://www.adsgator.com.br",
  descricao: "Gestão de Google Ads e landing pages para negócios locais.",
  email: "contato@adsgator.com.br",
  whatsapp: {
    link: "https://wa.me/5519998026222",
    exibicao: "(19) 99802-6222",
  },
  horario: "Segunda a sexta, das 9h às 12h e das 13h30 às 17h",
  cnpj: "37.040.687/0001-07",
} as const;

/** WhatsApp da Adsgator com a mensagem pronta. Cada página manda a sua, para
 * o Lucas saber de onde a pessoa veio (roteiro do site, seção 1). */
export function linkWhatsApp(mensagem: string) {
  return `${site.whatsapp.link}?text=${encodeURIComponent(mensagem)}`;
}

export const mensagemDiagnostico =
  "Olá! Vim pelo site da Adsgator e queria um diagnóstico grátis para o meu negócio.";

/** Mensagem pronta das páginas que têm a sua; as outras usam a geral. */
const mensagensPorPagina: Record<string, string> = {
  "/google-ads":
    "Olá! Vim pelo site da Adsgator, pela página de Google Ads, e queria um diagnóstico grátis para o meu negócio.",
};

export function mensagemDaPagina(caminho: string) {
  return mensagensPorPagina[caminho] ?? mensagemDiagnostico;
}

import { FormularioDoCheckout } from "@/components/checkout/formulario";
import { catalogo, servicosDoLink } from "@/lib/checkout/catalogo";

// O link traz os serviços escolhidos na conversa ou na proposta
// (?s=google-ads,landing-page). A pessoa pode trocar ou somar; os serviços
// "só por link" aparecem apenas quando vêm nele.

export default async function PaginaDoCheckout({ searchParams }: PageProps<"/checkout">) {
  const escolhidos = servicosDoLink((await searchParams).s);
  const servicos = catalogo.filter((s) => s.visivel === "sempre" || escolhidos.includes(s.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="mb-8 font-heading text-3xl tracking-tight sm:text-4xl">Cadastro e pagamento</h1>
      <FormularioDoCheckout servicos={servicos} escolhidosNoLink={escolhidos} />
    </div>
  );
}

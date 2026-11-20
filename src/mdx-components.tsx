import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { CheckIcon } from "lucide-react";

// Endereço de seção a partir do título ("10. Reembolso" vira "reembolso"), para
// links como /termos#reembolso. O número da seção fica de fora para o endereço
// não mudar quando a numeração mudar.
function ancora(texto: React.ReactNode) {
  if (typeof texto !== "string") return undefined;
  return texto
    .replace(/^\d+\.\s*/, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** O resumo no começo do documento, em cartão: `<Resumo>` no .mdx. */
function Resumo({ children }: { children: React.ReactNode }) {
  return (
    <div className="resumo-legal mt-10 rounded-3xl border bg-card p-6 sm:p-8 [&_li]:relative [&_li]:pl-7 [&_ul]:mt-5 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-x-8 [&_ul]:gap-y-3 [&_ul]:pl-0 sm:[&_ul]:grid-cols-2">
      <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <CheckIcon className="size-3.5 text-brand" />
        Em resumo
      </p>
      {children}
    </div>
  );
}

// Aparência dos textos longos em src/content (Termos, Privacidade), dentro do
// DocumentoLegal. O arquivo é obrigatório para o @next/mdx no App Router.
const components = {
  Resumo,
  h1: (props) => (
    <h1 className="font-heading text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl" {...props} />
  ),
  // "3. Google Ads": o número em destaque e o link para copiar o endereço da
  // seção; o sumário lê o título sem o número (data-titulo).
  h2: ({ children, ...props }) => {
    const id = ancora(children);
    const texto = typeof children === "string" ? children : "";
    const [, numero, titulo] = texto.match(/^(\d+)\.\s*(.*)$/) ?? [null, null, texto];
    return (
      <h2
        id={id}
        data-titulo={titulo || undefined}
        className="group mt-16 flex scroll-mt-28 items-baseline gap-3 border-t pt-10 font-heading text-3xl leading-tight tracking-tight"
        {...props}
      >
        {numero && <span className="font-mono text-sm text-brand">{numero.padStart(2, "0")}</span>}
        <span>{titulo || children}</span>
        {id && (
          <a
            href={`#${id}`}
            aria-label={`Endereço da seção ${titulo}`}
            className="ml-auto font-mono text-base text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            #
          </a>
        )}
      </h2>
    );
  },
  h3: (props) => <h3 className="mt-8 font-heading text-xl" {...props} />,
  p: (props) => <p className="mt-4 leading-8 text-foreground/90" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 leading-8 marker:text-brand" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6 leading-8 marker:text-brand" {...props} />,
  li: (props) => <li className="pl-1" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  hr: () => <hr className="my-10" />,
  a: ({ href = "", ...props }) => {
    const className = "font-medium underline decoration-brand decoration-2 underline-offset-4 hover:decoration-foreground";
    return href.startsWith("/") ? (
      <Link href={href} className={className} {...props} />
    ) : (
      <a href={href} className={className} {...props} />
    );
  },
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}

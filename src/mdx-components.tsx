import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Endereço de seção a partir do título ("Reembolso" vira "reembolso"), para
// links como /termos#reembolso.
function ancora(texto: React.ReactNode) {
  if (typeof texto !== "string") return undefined;
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Aparência dos textos longos em src/content (Termos, Privacidade). O
// arquivo é obrigatório para o @next/mdx no App Router.
const components = {
  h1: (props) => (
    <h1 className="text-3xl font-semibold tracking-tight text-balance" {...props} />
  ),
  h2: (props) => (
    <h2
      id={ancora(props.children)}
      className="mt-10 scroll-mt-20 text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props) => <h3 className="mt-6 font-semibold" {...props} />,
  p: (props) => <p className="mt-4 leading-7" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 leading-7" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6 leading-7" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  hr: () => <hr className="my-8" />,
  a: ({ href = "", ...props }) => {
    const className = "font-medium underline underline-offset-4";
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

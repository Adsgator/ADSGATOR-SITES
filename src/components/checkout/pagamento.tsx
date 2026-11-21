"use client";

import { CreditCardIcon } from "lucide-react";

import { IconePix } from "@/components/icone-pix";
import { mascaraCartao, mascaraValidade, soDigitos } from "@/lib/checkout/campos";
import { reais, type Forma } from "@/lib/checkout/pedido";
import type { Cartao } from "@/lib/checkout/validacao";
import { cn } from "@/lib/utils";

import { ariaDoErro, Campo, estiloDoCampo } from "./campo";

// A escolha entre cartão e Pix e os campos do cartão, iguais na contratação e
// no link da mensalidade.

export function EscolhaDaForma({
  forma,
  aoEscolher,
  descricao,
  economiaNoPix = 0,
}: {
  forma: Forma;
  aoEscolher: (f: Forma) => void;
  /** A linha embaixo do nome de cada forma (ex.: "R$ 1.400,00 à vista · vence em 24/11"). */
  descricao: Record<Forma, string>;
  economiaNoPix?: number;
}) {
  return (
    <fieldset className="mt-5 grid gap-3 sm:grid-cols-2">
      <legend className="sr-only">Forma de pagamento</legend>
      {(["cartao", "pix"] as const).map((f) => (
        <label
          key={f}
          className={cn(
            "relative flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors hover:border-foreground/30",
            forma === f && "border-brand bg-brand/10 hover:border-brand",
          )}
        >
          <input
            type="radio"
            name="forma"
            value={f}
            checked={forma === f}
            onChange={() => aoEscolher(f)}
            className="size-5 shrink-0 accent-[var(--brand)]"
            data-forma={f}
          />
          <span className="flex-1">
            <span className="flex items-center gap-2 font-medium">
              {f === "pix" ? <IconePix className="size-4" /> : <CreditCardIcon className="size-4" aria-hidden="true" />}
              {f === "pix" ? "Pix" : "Cartão de crédito"}
            </span>
            <span className="mt-0.5 block text-sm text-muted-foreground">{descricao[f]}</span>
          </span>
          {f === "pix" && economiaNoPix > 0 && (
            <span className="absolute -top-2.5 right-3 rounded-full bg-brand px-2.5 py-0.5 text-[0.7rem] font-semibold text-brand-foreground">
              Economize {reais(economiaNoPix)}
            </span>
          )}
        </label>
      ))}
    </fieldset>
  );
}

/** Os quatro campos do cartão, para dentro de uma grade de 6 colunas. */
export function CamposDoCartao({
  cartao,
  erros,
  aoMudar,
}: {
  cartao: Cartao;
  erros: Record<string, string>;
  aoMudar: (campo: keyof Cartao, valor: string) => void;
}) {
  return (
    <>
      <Campo id="cartao-numero" rotulo="Número do cartão" erro={erros["cartao-numero"]} className="sm:col-span-6">
        <div className="relative">
          <input
            id="cartao-numero"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            value={cartao.numero}
            onChange={(e) => aoMudar("numero", mascaraCartao(e.target.value))}
            className={cn(estiloDoCampo, "pr-11")}
            {...ariaDoErro("cartao-numero", erros["cartao-numero"])}
          />
          <CreditCardIcon
            className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </Campo>
      <Campo id="cartao-nome" rotulo="Nome impresso no cartão" erro={erros["cartao-nome"]} className="sm:col-span-6">
        <input
          id="cartao-nome"
          autoComplete="cc-name"
          value={cartao.nome}
          onChange={(e) => aoMudar("nome", e.target.value.toUpperCase())}
          className={estiloDoCampo}
          {...ariaDoErro("cartao-nome", erros["cartao-nome"])}
        />
      </Campo>
      <Campo id="cartao-validade" rotulo="Validade" erro={erros["cartao-validade"]} className="sm:col-span-3">
        <input
          id="cartao-validade"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/AA"
          value={cartao.validade}
          onChange={(e) => aoMudar("validade", mascaraValidade(e.target.value))}
          className={estiloDoCampo}
          {...ariaDoErro("cartao-validade", erros["cartao-validade"])}
        />
      </Campo>
      <Campo id="cartao-codigo" rotulo="Código de segurança" erro={erros["cartao-codigo"]} className="sm:col-span-3">
        <input
          id="cartao-codigo"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="3 ou 4 dígitos"
          value={cartao.codigo}
          onChange={(e) => aoMudar("codigo", soDigitos(e.target.value).slice(0, 4))}
          className={estiloDoCampo}
          {...ariaDoErro("cartao-codigo", erros["cartao-codigo"])}
        />
      </Campo>
    </>
  );
}

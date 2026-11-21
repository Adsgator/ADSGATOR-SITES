"use client";

import { useMemo, useRef, useState } from "react";
import { CreditCardIcon, LoaderCircleIcon, LockIcon } from "lucide-react";

import {
  cartaoValido,
  cepValido,
  cnpjValido,
  codigoValido,
  cpfValido,
  emailValido,
  estados,
  mascaraCartao,
  mascaraCep,
  mascaraCnpj,
  mascaraCpf,
  mascaraValidade,
  mascaraWhatsApp,
  nomeCompletoValido,
  soDigitos,
  validadeValida,
  whatsAppValido,
} from "@/lib/checkout/campos";
import type { Servico } from "@/lib/checkout/catalogo";
import { dataCurta, montarPedido, reais, valorDaParcela, type Forma } from "@/lib/checkout/pedido";
import { cn } from "@/lib/utils";

import { ariaDoErro, Campo, estiloDoCampo } from "./campo";
import { JanelaDeAceite } from "./janela-de-aceite";
import { ResultadoDaContratacao } from "./resultado";
import { ResumoDoPedido } from "./resumo";

const dadosVazios = {
  whatsapp: "",
  email: "",
  cnpj: "",
  cpf: "",
  empresa: "",
  nome: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  indicacao: "",
};
type Dados = typeof dadosVazios;

const cartaoVazio = { numero: "", nome: "", validade: "", codigo: "" };
type Cartao = typeof cartaoVazio;

type Consulta = "parada" | "buscando" | "achou" | "falhou";

/** Ordem dos campos na tela, para levar ao primeiro erro. */
const ordemDosCampos = [
  "servicos", "whatsapp", "email", "cnpj", "cpf", "empresa", "nome", "cep", "numero", "endereco",
  "bairro", "cidade", "uf", "cartao-numero", "cartao-nome", "cartao-validade", "cartao-codigo",
];

function precoDoCartao(s: Servico, combo: boolean) {
  if (s.tipo === "mensal") return `${reais(s.preco.cartao)}/mês`;
  const p = combo && s.precoNoCombo ? s.precoNoCombo : s.preco;
  return `${reais(p.pix)} no Pix ou ${reais(p.cartao)} em até ${s.maxParcelas}x`;
}

export function FormularioDoCheckout({ servicos, escolhidosNoLink }: { servicos: Servico[]; escolhidosNoLink: string[] }) {
  const [escolhidos, setEscolhidos] = useState<string[]>(escolhidosNoLink);
  const [forma, setForma] = useState<Forma>("pix");
  const [parcelasEscolhidas, setParcelas] = useState(12);
  const [semCnpj, setSemCnpj] = useState(false);
  const [dados, setDados] = useState<Dados>(dadosVazios);
  const [cartao, setCartao] = useState<Cartao>(cartaoVazio);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [tentou, setTentou] = useState(false);
  const [consultaCnpj, setConsultaCnpj] = useState<Consulta>("parada");
  const [consultaCep, setConsultaCep] = useState<Consulta>("parada");
  const [janela, setJanela] = useState(false);
  const [contratado, setContratado] = useState(false);
  const topo = useRef<HTMLDivElement>(null);

  const pedido = useMemo(() => montarPedido(escolhidos, forma), [escolhidos, forma]);
  const parcelas = Math.min(parcelasEscolhidas, pedido.maxParcelas);
  const temAds = escolhidos.includes("google-ads");

  function validar(d: Dados, c: Cartao, sem: boolean, f: Forma) {
    const e: Record<string, string> = {};
    if (escolhidos.length === 0) e.servicos = "Escolha pelo menos um serviço.";
    if (!whatsAppValido(d.whatsapp)) e.whatsapp = "Informe o WhatsApp com o DDD.";
    if (!emailValido(d.email)) e.email = "Informe um e-mail válido.";
    if (sem) {
      if (!cpfValido(d.cpf)) e.cpf = "Confira o CPF.";
    } else {
      if (!cnpjValido(d.cnpj)) e.cnpj = "Confira o CNPJ.";
      if (d.empresa.trim().length < 2) e.empresa = "Informe o nome da empresa.";
    }
    if (!nomeCompletoValido(d.nome)) e.nome = "Informe o seu nome completo.";
    if (!cepValido(d.cep)) e.cep = "Informe o CEP.";
    if (!d.numero.trim()) e.numero = "Informe o número (ou SN).";
    if (!d.endereco.trim()) e.endereco = "Informe o endereço.";
    if (!d.bairro.trim()) e.bairro = "Informe o bairro.";
    if (!d.cidade.trim()) e.cidade = "Informe a cidade.";
    if (!d.uf) e.uf = "Escolha o estado.";
    if (f === "cartao") {
      if (!cartaoValido(c.numero)) e["cartao-numero"] = "Confira o número do cartão.";
      if (c.nome.trim().length < 3) e["cartao-nome"] = "Informe o nome como está no cartão.";
      if (!validadeValida(c.validade)) e["cartao-validade"] = "Confira a validade.";
      if (!codigoValido(c.codigo)) e["cartao-codigo"] = "Confira o código.";
    }
    return e;
  }

  function mudarDados(campo: keyof Dados, valor: string) {
    const novos = { ...dados, [campo]: valor };
    setDados(novos);
    if (tentou) setErros(validar(novos, cartao, semCnpj, forma));
  }

  function mudarCartao(campo: keyof Cartao, valor: string) {
    const novo = { ...cartao, [campo]: valor };
    setCartao(novo);
    if (tentou) setErros(validar(dados, novo, semCnpj, forma));
  }

  async function buscarCep(cep: string, base: Dados) {
    setConsultaCep("buscando");
    try {
      const r = await fetch(`/consulta/cep/${cep}`);
      if (!r.ok) throw new Error();
      const j = (await r.json()) as { endereco: string; bairro: string; cidade: string; uf: string };
      const novos = {
        ...base,
        endereco: j.endereco || base.endereco,
        bairro: j.bairro || base.bairro,
        cidade: j.cidade || base.cidade,
        uf: j.uf || base.uf,
      };
      setDados(novos);
      setConsultaCep("achou");
      if (tentou) setErros(validar(novos, cartao, semCnpj, forma));
    } catch {
      setConsultaCep("falhou");
    }
  }

  async function aoDigitarCep(valor: string) {
    const novos = { ...dados, cep: mascaraCep(valor) };
    setDados(novos);
    if (soDigitos(valor).length === 8) await buscarCep(soDigitos(valor), novos);
    else setConsultaCep("parada");
  }

  async function aoDigitarCnpj(valor: string) {
    const cnpj = mascaraCnpj(valor);
    const novos = { ...dados, cnpj };
    setDados(novos);
    if (!cnpjValido(cnpj)) {
      setConsultaCnpj("parada");
      return;
    }
    setConsultaCnpj("buscando");
    try {
      const r = await fetch(`/consulta/cnpj/${soDigitos(cnpj)}`);
      if (!r.ok) throw new Error();
      const j = (await r.json()) as { empresa: string; cep: string; numero: string };
      const preenchidos = {
        ...novos,
        empresa: novos.empresa || j.empresa,
        numero: novos.numero || j.numero,
        cep: novos.cep || mascaraCep(j.cep),
      };
      setDados(preenchidos);
      setConsultaCnpj("achou");
      if (!novos.cep && j.cep.length === 8) await buscarCep(j.cep, preenchidos);
    } catch {
      setConsultaCnpj("falhou");
    }
  }

  function alternarServico(slug: string) {
    setEscolhidos((atual) => (atual.includes(slug) ? atual.filter((s) => s !== slug) : [...atual, slug]));
  }

  function aoClicarEmContratar() {
    setTentou(true);
    const e = validar(dados, cartao, semCnpj, forma);
    setErros(e);
    const primeiro = ordemDosCampos.find((c) => e[c]);
    if (primeiro) {
      const el = document.getElementById(primeiro);
      el?.scrollIntoView({ block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }
    setJanela(true);
  }

  function aoContratar() {
    // PRÉVIA: aqui vai o envio ao servidor, que confere tudo de novo, calcula o
    // preço pelo catálogo e manda ao Asaas.
    setJanela(false);
    setContratado(true);
    topo.current?.scrollIntoView({ block: "start" });
  }

  if (contratado) {
    return (
      <div ref={topo}>
        <ResultadoDaContratacao pedido={pedido} forma={forma} parcelas={parcelas} email={dados.email.trim()} />
      </div>
    );
  }

  const tituloDaSecao = "text-lg font-semibold";
  const cartaoDaSecao = "rounded-2xl border bg-card p-5 sm:p-7";

  return (
    <div ref={topo} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
      {/* 1. Serviços */}
      <section aria-labelledby="titulo-servicos" className={cn(cartaoDaSecao, "lg:col-start-1")}>
        <h2 id="titulo-servicos" className={tituloDaSecao}>
          O que você está contratando
        </h2>
        <div id="servicos" tabIndex={-1} className="mt-4 grid gap-3 outline-none sm:grid-cols-2" data-servicos>
          {servicos.map((s) => {
            const marcado = escolhidos.includes(s.slug);
            const noCombo = s.tipo === "unico" && temAds && !!s.precoNoCombo;
            return (
              <label
                key={s.slug}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors hover:border-foreground/30",
                  marcado && "border-brand bg-brand/10 hover:border-brand",
                )}
              >
                <input
                  type="checkbox"
                  checked={marcado}
                  onChange={() => alternarServico(s.slug)}
                  className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]"
                  data-servico={s.slug}
                />
                <span className="space-y-1">
                  <span className="block font-medium">{s.nome}</span>
                  <span className="block text-xs leading-5 text-muted-foreground">{s.resumo}</span>
                  <span className="block text-sm font-medium">
                    {precoDoCartao(s, noCombo)}
                    {noCombo && <span className="ml-1.5 rounded bg-brand px-1.5 py-0.5 text-[0.7rem] text-brand-foreground">combo</span>}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {erros.servicos && <p className="mt-2 text-xs text-destructive">{erros.servicos}</p>}
        {!temAds && escolhidos.some((s) => servicos.find((x) => x.slug === s)?.tipo === "unico") && (
          <p className="mt-3 text-xs text-muted-foreground">Com a Gestão de Google Ads junto, a criação sai por um preço menor.</p>
        )}
      </section>

      {/* Resumo: logo abaixo dos serviços no celular, ao lado no computador. */}
      <aside className="lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start" aria-label="Resumo do pedido">
        <ResumoDoPedido pedido={pedido} forma={forma} parcelas={parcelas} />
      </aside>

      <div className="space-y-6 lg:col-start-1">
        {/* 2. Dados */}
        <section aria-labelledby="titulo-dados" className={cartaoDaSecao}>
          <h2 id="titulo-dados" className={tituloDaSecao}>
            Seus dados
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Campo id="whatsapp" rotulo="WhatsApp" erro={erros.whatsapp}>
              <input
                id="whatsapp"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="(00) 00000-0000"
                value={dados.whatsapp}
                onChange={(e) => mudarDados("whatsapp", mascaraWhatsApp(e.target.value))}
                className={estiloDoCampo}
                {...ariaDoErro("whatsapp", erros.whatsapp)}
              />
            </Campo>
            <Campo id="email" rotulo="E-mail" erro={erros.email}>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="voce@empresa.com.br"
                value={dados.email}
                onChange={(e) => mudarDados("email", e.target.value)}
                className={estiloDoCampo}
                {...ariaDoErro("email", erros.email)}
              />
            </Campo>

            {semCnpj ? (
              <Campo
                id="cpf"
                rotulo="CPF"
                erro={erros.cpf}
                className="sm:col-span-2"
                ajuda={
                  <button type="button" onClick={() => setSemCnpj(false)} className="font-medium text-foreground underline underline-offset-4">
                    Tenho CNPJ
                  </button>
                }
              >
                <input
                  id="cpf"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={dados.cpf}
                  onChange={(e) => mudarDados("cpf", mascaraCpf(e.target.value))}
                  className={estiloDoCampo}
                  {...ariaDoErro("cpf", erros.cpf)}
                />
              </Campo>
            ) : (
              <>
                <Campo
                  id="cnpj"
                  rotulo="CNPJ"
                  erro={erros.cnpj}
                  ajuda={
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <button
                        type="button"
                        onClick={() => setSemCnpj(true)}
                        className="font-medium text-foreground underline underline-offset-4"
                        data-sem-cnpj
                      >
                        Não tenho CNPJ
                      </button>
                      {consultaCnpj === "buscando" && (
                        <span className="inline-flex items-center gap-1">
                          <LoaderCircleIcon className="size-3 animate-spin" aria-hidden="true" /> Buscando a empresa…
                        </span>
                      )}
                      {consultaCnpj === "falhou" && <span>Não achamos a empresa: preencha o nome abaixo.</span>}
                    </span>
                  }
                >
                  <input
                    id="cnpj"
                    inputMode="numeric"
                    placeholder="00.000.000/0000-00"
                    value={dados.cnpj}
                    onChange={(e) => aoDigitarCnpj(e.target.value)}
                    className={estiloDoCampo}
                    {...ariaDoErro("cnpj", erros.cnpj)}
                  />
                </Campo>
                <Campo id="empresa" rotulo="Nome da empresa" erro={erros.empresa}>
                  <input
                    id="empresa"
                    autoComplete="organization"
                    value={dados.empresa}
                    onChange={(e) => mudarDados("empresa", e.target.value)}
                    className={estiloDoCampo}
                    {...ariaDoErro("empresa", erros.empresa)}
                  />
                </Campo>
              </>
            )}

            <Campo id="nome" rotulo="Seu nome completo" erro={erros.nome} className="sm:col-span-2">
              <input
                id="nome"
                autoComplete="name"
                value={dados.nome}
                onChange={(e) => mudarDados("nome", e.target.value)}
                className={estiloDoCampo}
                {...ariaDoErro("nome", erros.nome)}
              />
            </Campo>
          </div>

          <h3 className="mt-7 text-sm font-semibold">Endereço</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-6">
            <Campo
              id="cep"
              rotulo="CEP"
              erro={erros.cep}
              className="sm:col-span-3"
              ajuda={
                consultaCep === "buscando" ? (
                  <span className="inline-flex items-center gap-1">
                    <LoaderCircleIcon className="size-3 animate-spin" aria-hidden="true" /> Buscando o endereço…
                  </span>
                ) : consultaCep === "falhou" ? (
                  "Não achamos o CEP: preencha o endereço abaixo."
                ) : undefined
              }
            >
              <input
                id="cep"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                value={dados.cep}
                onChange={(e) => aoDigitarCep(e.target.value)}
                className={estiloDoCampo}
                {...ariaDoErro("cep", erros.cep)}
              />
            </Campo>
            <Campo id="numero" rotulo="Número" erro={erros.numero} className="sm:col-span-3">
              <input
                id="numero"
                value={dados.numero}
                onChange={(e) => mudarDados("numero", e.target.value)}
                className={estiloDoCampo}
                {...ariaDoErro("numero", erros.numero)}
              />
            </Campo>
            <Campo id="endereco" rotulo="Endereço" erro={erros.endereco} className="sm:col-span-6">
              <input
                id="endereco"
                autoComplete="address-line1"
                value={dados.endereco}
                onChange={(e) => mudarDados("endereco", e.target.value)}
                className={estiloDoCampo}
                {...ariaDoErro("endereco", erros.endereco)}
              />
            </Campo>
            <Campo id="bairro" rotulo="Bairro" erro={erros.bairro} className="sm:col-span-3">
              <input
                id="bairro"
                value={dados.bairro}
                onChange={(e) => mudarDados("bairro", e.target.value)}
                className={estiloDoCampo}
                {...ariaDoErro("bairro", erros.bairro)}
              />
            </Campo>
            <Campo id="complemento" rotulo="Complemento (opcional)" className="sm:col-span-3">
              <input
                id="complemento"
                autoComplete="address-line2"
                value={dados.complemento}
                onChange={(e) => mudarDados("complemento", e.target.value)}
                className={estiloDoCampo}
              />
            </Campo>
            <Campo id="cidade" rotulo="Cidade" erro={erros.cidade} className="sm:col-span-4">
              <input
                id="cidade"
                autoComplete="address-level2"
                value={dados.cidade}
                onChange={(e) => mudarDados("cidade", e.target.value)}
                className={estiloDoCampo}
                {...ariaDoErro("cidade", erros.cidade)}
              />
            </Campo>
            <Campo id="uf" rotulo="Estado" erro={erros.uf} className="sm:col-span-2">
              <select
                id="uf"
                autoComplete="address-level1"
                value={dados.uf}
                onChange={(e) => mudarDados("uf", e.target.value)}
                className={estiloDoCampo}
                {...ariaDoErro("uf", erros.uf)}
              >
                <option value="">Escolha</option>
                {estados.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          <Campo id="indicacao" rotulo="Alguém indicou você? (opcional)" className="mt-7" ajuda="O nome de quem indicou, para a gente agradecer.">
            <input
              id="indicacao"
              value={dados.indicacao}
              onChange={(e) => mudarDados("indicacao", e.target.value)}
              className={estiloDoCampo}
            />
          </Campo>
        </section>

        {/* 3. Pagamento */}
        <section aria-labelledby="titulo-pagamento" className={cartaoDaSecao}>
          <h2 id="titulo-pagamento" className={tituloDaSecao}>
            Pagamento
          </h2>
          <fieldset className="mt-4 grid gap-3 sm:grid-cols-2">
            <legend className="sr-only">Forma de pagamento</legend>
            {(["pix", "cartao"] as const).map((f) => {
              const total = montarPedido(escolhidos, f).totalHoje;
              return (
                <label
                  key={f}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors hover:border-foreground/30",
                    forma === f && "border-brand bg-brand/10 hover:border-brand",
                  )}
                >
                  <input
                    type="radio"
                    name="forma"
                    value={f}
                    checked={forma === f}
                    onChange={() => {
                      setForma(f);
                      if (tentou) setErros(validar(dados, cartao, semCnpj, f));
                    }}
                    className="size-5 shrink-0 accent-[var(--brand)]"
                    data-forma={f}
                  />
                  <span className="flex-1">
                    <span className="block font-medium">{f === "pix" ? "Pix" : "Cartão de crédito"}</span>
                    <span className="block text-xs text-muted-foreground">
                      {escolhidos.length === 0
                        ? f === "pix"
                          ? "Na hora, pelo QR Code"
                          : "À vista ou parcelado"
                        : f === "pix"
                          ? `${reais(total)} · vence em ${dataCurta(pedido.vencimento)}`
                          : montarPedido(escolhidos, f).maxParcelas > 1
                            ? `${reais(total)} em até ${montarPedido(escolhidos, f).maxParcelas}x sem juros`
                            : reais(total)}
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>

          {forma === "pix" ? (
            <p className="mt-4 text-sm text-muted-foreground">
              O QR Code e o código para copiar aparecem logo depois de você contratar.
              {pedido.hoje.some((l) => l.mensal) &&
                ` As próximas mensalidades chegam por e-mail, com o Pix para pagar, todo dia ${pedido.diaDaRenovacao}.`}
            </p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-6">
              <Campo id="cartao-numero" rotulo="Número do cartão" erro={erros["cartao-numero"]} className="sm:col-span-6">
                <div className="relative">
                  <input
                    id="cartao-numero"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    value={cartao.numero}
                    onChange={(e) => mudarCartao("numero", mascaraCartao(e.target.value))}
                    className={cn(estiloDoCampo, "pr-11")}
                    {...ariaDoErro("cartao-numero", erros["cartao-numero"])}
                  />
                  <CreditCardIcon className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                </div>
              </Campo>
              <Campo id="cartao-nome" rotulo="Nome impresso no cartão" erro={erros["cartao-nome"]} className="sm:col-span-6">
                <input
                  id="cartao-nome"
                  autoComplete="cc-name"
                  value={cartao.nome}
                  onChange={(e) => mudarCartao("nome", e.target.value.toUpperCase())}
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
                  onChange={(e) => mudarCartao("validade", mascaraValidade(e.target.value))}
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
                  onChange={(e) => mudarCartao("codigo", soDigitos(e.target.value).slice(0, 4))}
                  className={estiloDoCampo}
                  {...ariaDoErro("cartao-codigo", erros["cartao-codigo"])}
                />
              </Campo>
              {pedido.maxParcelas > 1 && (
                <Campo id="parcelas" rotulo="Parcelas" className="sm:col-span-6">
                  <select
                    id="parcelas"
                    value={parcelas}
                    onChange={(e) => setParcelas(Number(e.target.value))}
                    className={estiloDoCampo}
                  >
                    {Array.from({ length: pedido.maxParcelas }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n === 1 ? `À vista, ${reais(pedido.totalHoje)}` : `${n}x de ${reais(valorDaParcela(pedido.totalHoje, n))} sem juros`}
                      </option>
                    ))}
                  </select>
                </Campo>
              )}
              {pedido.hoje.some((l) => l.mensal) && (
                <p className="text-xs leading-5 text-muted-foreground sm:col-span-6">
                  As próximas mensalidades são cobradas neste cartão, todo dia {pedido.diaDaRenovacao}.
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={aoClicarEmContratar}
            disabled={escolhidos.length === 0}
            className="mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-45"
            data-contratar
          >
            <LockIcon className="size-4" aria-hidden="true" />
            Contratar{escolhidos.length > 0 && ` · ${reais(pedido.totalHoje)}`}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Antes de pagar, você revisa tudo e aceita os Termos.
          </p>
        </section>
      </div>

      <JanelaDeAceite
        aberta={janela}
        aoMudar={setJanela}
        pedido={pedido}
        forma={forma}
        parcelas={parcelas}
        aoContratar={aoContratar}
      />
    </div>
  );
}

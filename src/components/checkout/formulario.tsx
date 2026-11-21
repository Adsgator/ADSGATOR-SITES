"use client";

import { useMemo, useRef, useState } from "react";
import { CreditCardIcon, GlobeIcon, LayoutTemplateIcon, LoaderCircleIcon, LockIcon, TargetIcon, WrenchIcon } from "lucide-react";

import { IconePix } from "@/components/icone-pix";
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
import { dataCurta, montarPedido, reais, valorDaParcela, type Forma } from "@/lib/checkout/pedido";
import { cn } from "@/lib/utils";

import { ariaDoErro, Campo, estiloDoCampo } from "./campo";
import { JanelaDeAceite } from "./janela-de-aceite";
import { ResultadoDaContratacao } from "./resultado";
import { inicioDaMensalidade, ResumoDoPedido } from "./resumo";

const icones: Record<string, typeof TargetIcon> = {
  "google-ads": TargetIcon,
  "landing-page": LayoutTemplateIcon,
  "site-institucional": GlobeIcon,
  manutencao: WrenchIcon,
};

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
  "whatsapp", "email", "cnpj", "cpf", "empresa", "nome", "cep", "numero", "endereco",
  "bairro", "cidade", "uf", "cartao-numero", "cartao-nome", "cartao-validade", "cartao-codigo",
];

export function FormularioDoCheckout({ escolhidos }: { escolhidos: string[] }) {
  // O cartão vem escolhido, e o preço dele é a referência; o Pix aparece como
  // a forma mais barata (Lucas, 2026-11-21).
  const [forma, setForma] = useState<Forma>("cartao");
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
  const noCartao = useMemo(() => montarPedido(escolhidos, "cartao"), [escolhidos]);
  const noPix = useMemo(() => montarPedido(escolhidos, "pix"), [escolhidos]);
  const economiaNoPix = noCartao.totalHoje - noPix.totalHoje;
  const parcelas = Math.min(parcelasEscolhidas, pedido.maxParcelas);

  function escolherForma(f: Forma) {
    setForma(f);
    if (tentou) setErros(validar(dados, cartao, semCnpj, f));
  }

  function validar(d: Dados, c: Cartao, sem: boolean, f: Forma) {
    const e: Record<string, string> = {};
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

  const cartaoDaSecao = "rounded-2xl border bg-card p-5 shadow-sm sm:p-7";

  return (
    <div ref={topo} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
      {/* Serviços */}
      <section aria-labelledby="titulo-servicos" className={cn(cartaoDaSecao, "lg:col-start-1")}>
        <h2 id="titulo-servicos" className="text-lg font-semibold">
          O que foi combinado
        </h2>
        <ul className="mt-5 divide-y" data-servicos>
          {noCartao.servicos.map((s) => {
            const Icone = icones[s.slug] ?? TargetIcon;
            const naHoje = noCartao.hoje.find((l) => l.slug === s.slug && !l.mensal);
            const pix = noPix.hoje.find((l) => l.slug === s.slug && !l.mensal);
            const mensalidade = noCartao.mensalidades.find((m) => m.slug === s.slug);
            return (
              <li key={s.slug} className="flex gap-4 py-5 first:pt-0 last:pb-0" data-servico={s.slug}>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 ring-1 ring-brand/30">
                  <Icone className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-semibold">{s.nome}</h3>
                    {naHoje ? (
                      // O parcelado em destaque e o valor no cartão como referência
                      // (Lucas, 2026-11-21); o Pix vem logo abaixo, como o mais barato.
                      <div className="sm:text-right" data-preco>
                        <p className="text-sm">
                          <span className="text-muted-foreground">{s.maxParcelas}x de </span>
                          <strong className="text-lg font-semibold tracking-tight">
                            {reais(valorDaParcela(naHoje.valor, s.maxParcelas))}
                          </strong>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          sem juros ·{" "}
                          {naHoje.valorCheio && <span className="mr-1 line-through">{reais(naHoje.valorCheio)}</span>}
                          {reais(naHoje.valor)} no cartão
                        </p>
                      </div>
                    ) : mensalidade ? (
                      <p className="text-sm font-semibold">
                        {mensalidade.inicio === "incluida" ? "Incluída" : `${reais(mensalidade.valor)}/mês`}
                      </p>
                    ) : null}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{s.resumo}</p>
                  {naHoje && pix && pix.valor < naHoje.valor && (
                    <p className="inline-flex flex-wrap items-center gap-x-2 rounded-full bg-brand/15 px-3 py-1 text-xs font-medium">
                      <IconePix className="size-3.5" />
                      <span>ou {reais(pix.valor)} no Pix</span>
                      <span className="rounded-full bg-brand px-2 py-0.5 text-[0.7rem] text-brand-foreground">
                        economize {reais(naHoje.valor - pix.valor)}
                      </span>
                    </p>
                  )}
                  {mensalidade && mensalidade.inicio !== "hoje" && (
                    <p className="text-xs leading-5 text-muted-foreground">{inicioDaMensalidade(mensalidade, noCartao)}</p>
                  )}
                  {naHoje?.valorCheio && <p className="text-xs text-muted-foreground">Preço menor por ser junto com o Google Ads.</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Resumo: logo abaixo dos serviços no celular, ao lado no computador. */}
      <aside className="lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start" aria-label="Resumo do pedido">
        <ResumoDoPedido
          pedido={pedido}
          forma={forma}
          parcelas={parcelas}
          economiaNoPix={economiaNoPix}
          aoEscolherPix={() => escolherForma("pix")}
        />
      </aside>

      <div className="space-y-6 lg:col-start-1">
        {/* Dados */}
        <section aria-labelledby="titulo-dados" className={cartaoDaSecao}>
          <h2 id="titulo-dados" className="text-lg font-semibold">
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

        {/* Pagamento */}
        <section aria-labelledby="titulo-pagamento" className={cartaoDaSecao}>
          <h2 id="titulo-pagamento" className="text-lg font-semibold">
            Pagamento
          </h2>
          <fieldset className="mt-5 grid gap-3 sm:grid-cols-2">
            <legend className="sr-only">Forma de pagamento</legend>
            {(["cartao", "pix"] as const).map((f) => {
              const p = f === "pix" ? noPix : noCartao;
              return (
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
                    onChange={() => escolherForma(f)}
                    className="size-5 shrink-0 accent-[var(--brand)]"
                    data-forma={f}
                  />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-medium">
                      {f === "pix" ? <IconePix className="size-4" /> : <CreditCardIcon className="size-4" aria-hidden="true" />}
                      {f === "pix" ? "Pix" : "Cartão de crédito"}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {f === "pix"
                        ? `${reais(p.totalHoje)} à vista · vence em ${dataCurta(p.vencimento)}`
                        : p.maxParcelas > 1
                          ? `até ${p.maxParcelas}x de ${reais(valorDaParcela(p.totalHoje, p.maxParcelas))} sem juros`
                          : reais(p.totalHoje)}
                    </span>
                  </span>
                  {f === "pix" && economiaNoPix > 0 && (
                    <span className="absolute -top-2.5 right-3 rounded-full bg-brand px-2.5 py-0.5 text-[0.7rem] font-semibold text-brand-foreground">
                      Economize {reais(economiaNoPix)}
                    </span>
                  )}
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
            className="mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
            data-contratar
          >
            <LockIcon className="size-4" aria-hidden="true" />
            Contratar · {reais(pedido.totalHoje)}
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

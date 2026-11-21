"use client";

import { useMemo, useRef, useState } from "react";
import { LoaderCircleIcon, LockIcon } from "lucide-react";

import {
  cnpjValido,
  estados,
  mascaraCep,
  mascaraCnpj,
  mascaraCpf,
  mascaraWhatsApp,
  soDigitos,
} from "@/lib/checkout/campos";
import { dataCurta, montarPedido, reais, valorDaParcela, type Forma } from "@/lib/checkout/pedido";
import type { RespostaDaContratacao } from "@/lib/checkout/contratacao";
import { cartaoVazio, dadosVazios, validarDados, type Cartao, type Dados } from "@/lib/checkout/validacao";

import { ariaDoErro, Campo, estiloDoCampo, Seletor } from "./campo";
import { JanelaDeAceite } from "./janela-de-aceite";
import { CamposDoCartao, EscolhaDaForma } from "./pagamento";
import { ResultadoDaContratacao } from "./resultado";
import { ResumoDoPedido } from "./resumo";

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
  const [enviando, setEnviando] = useState(false);
  const [erroDoEnvio, setErroDoEnvio] = useState<string | null>(null);
  const [resposta, setResposta] = useState<Extract<RespostaDaContratacao, { ok: true }> | null>(null);
  const topo = useRef<HTMLDivElement>(null);

  const pedido = useMemo(() => montarPedido(escolhidos, forma), [escolhidos, forma]);
  const noCartao = useMemo(() => montarPedido(escolhidos, "cartao"), [escolhidos]);
  const noPix = useMemo(() => montarPedido(escolhidos, "pix"), [escolhidos]);
  const economiaNoPix = noCartao.totalHoje - noPix.totalHoje;
  const parcelas = Math.min(parcelasEscolhidas, pedido.maxParcelas);

  function escolherForma(f: Forma) {
    setForma(f);
    if (tentou) setErros(validarDados(dados, cartao, semCnpj, f));
  }

  function mudarDados(campo: keyof Dados, valor: string) {
    const novos = { ...dados, [campo]: valor };
    setDados(novos);
    if (tentou) setErros(validarDados(novos, cartao, semCnpj, forma));
  }

  function mudarCartao(campo: keyof Cartao, valor: string) {
    const novo = { ...cartao, [campo]: valor };
    setCartao(novo);
    if (tentou) setErros(validarDados(dados, novo, semCnpj, forma));
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
      if (tentou) setErros(validarDados(novos, cartao, semCnpj, forma));
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

  function levarAoPrimeiroErro(e: Record<string, string>) {
    const primeiro = ordemDosCampos.find((c) => e[c]);
    if (!primeiro) return false;
    const el = document.getElementById(primeiro);
    el?.scrollIntoView({ block: "center" });
    el?.focus({ preventScroll: true });
    return true;
  }

  function aoClicarEmContratar() {
    setTentou(true);
    setErroDoEnvio(null);
    const e = validarDados(dados, cartao, semCnpj, forma);
    setErros(e);
    if (!levarAoPrimeiroErro(e)) setJanela(true);
  }

  async function aoContratar() {
    if (enviando) return;
    setEnviando(true);
    setErroDoEnvio(null);
    try {
      const r = await fetch("/contratar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          servicos: escolhidos,
          forma,
          parcelas,
          semCnpj,
          dados,
          cartao: forma === "cartao" ? cartao : cartaoVazio,
          aceite: true,
        }),
      });
      const j = (await r.json()) as RespostaDaContratacao;
      if (!j.ok) {
        setErroDoEnvio(j.erro);
        if (j.campos) {
          setErros(j.campos);
          setJanela(false);
          levarAoPrimeiroErro(j.campos);
        }
        return;
      }
      setJanela(false);
      setResposta(j);
      topo.current?.scrollIntoView({ block: "start" });
    } catch {
      setErroDoEnvio(
        "A conexão caiu antes da resposta. Para não cobrar duas vezes, fale com a gente no WhatsApp antes de tentar de novo.",
      );
    } finally {
      setEnviando(false);
    }
  }

  if (resposta) {
    return (
      <div ref={topo}>
        <ResultadoDaContratacao resposta={resposta} email={dados.email.trim()} />
      </div>
    );
  }

  const cartaoDaSecao = "rounded-2xl border bg-card p-5 shadow-sm sm:p-7";

  return (
    <div ref={topo} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-8">
      {/* O pedido: em cima no celular, ao lado no computador. Um cartão só com os
          serviços, os preços e quando cada mensalidade começa, sem repetir numa
          seção à parte (Lucas, 2026-11-21). */}
      <aside className="lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1 lg:self-start" aria-label="Seu pedido">
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
              <Seletor
                id="uf"
                autoComplete="address-level1"
                value={dados.uf}
                onChange={(e) => mudarDados("uf", e.target.value)}
                {...ariaDoErro("uf", erros.uf)}
              >
                <option value="">Escolha</option>
                {estados.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </Seletor>
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
          <EscolhaDaForma
            forma={forma}
            aoEscolher={escolherForma}
            economiaNoPix={economiaNoPix}
            descricao={{
              pix: `${reais(noPix.totalHoje)} à vista · vence em ${dataCurta(noPix.vencimento)}`,
              cartao:
                noCartao.maxParcelas > 1
                  ? `até ${noCartao.maxParcelas}x de ${reais(valorDaParcela(noCartao.totalHoje, noCartao.maxParcelas))} sem juros`
                  : reais(noCartao.totalHoje),
            }}
          />

          {forma === "pix" ? (
            <p className="mt-4 text-sm text-muted-foreground">
              O QR Code e o código para copiar aparecem logo depois de você contratar.
              {pedido.hoje.some((l) => l.mensal) &&
                ` As próximas mensalidades chegam por e-mail, com o Pix para pagar, todo dia ${pedido.diaDaRenovacao}.`}
            </p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-6">
              <CamposDoCartao cartao={cartao} erros={erros} aoMudar={mudarCartao} />
              {pedido.maxParcelas > 1 && (
                <Campo id="parcelas" rotulo="Parcelas" className="sm:col-span-6">
                  <Seletor id="parcelas" value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))}>
                    {Array.from({ length: pedido.maxParcelas }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n === 1 ? `À vista, ${reais(pedido.totalHoje)}` : `${n}x de ${reais(valorDaParcela(pedido.totalHoje, n))} sem juros`}
                      </option>
                    ))}
                  </Seletor>
                </Campo>
              )}
              {pedido.hoje.some((l) => l.mensal) && (
                <p className="text-sm leading-6 text-muted-foreground sm:col-span-6">
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
          {erroDoEnvio && !janela && (
            <p role="alert" className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" data-erro-envio>
              {erroDoEnvio}
            </p>
          )}
          <p className="mt-3 text-center text-sm text-muted-foreground">
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
        enviando={enviando}
        erro={erroDoEnvio}
      />
    </div>
  );
}

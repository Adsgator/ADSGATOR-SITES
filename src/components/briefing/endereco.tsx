"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, LoaderCircleIcon, MapPinIcon, SearchIcon } from "lucide-react";

import { Seletor } from "@/components/checkout/campo";
import { mascaraCep } from "@/lib/checkout/campos";
import type { Resposta } from "@/lib/briefing/regras";
import { cn } from "@/lib/utils";

// O endereço por partes: o CEP preenche a rua, o bairro e a cidade, e quem não sabe o
// CEP acha pela rua (pedido do Lucas, 2026-11-24).

type Itens = Record<string, string>;
type Achado = { cep: string; endereco: string; bairro: string; cidade: string; uf: string };

const UFS = "AC AL AM AP BA CE DF ES GO MA MG MS MT PA PB PE PI PR RJ RN RO RR RS SC SE SP TO".split(" ");

const estilo =
  "h-13 w-full rounded-xl border border-input bg-card px-4 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";

function Campo({
  nome,
  rotulo,
  itens,
  mudar,
  className,
  ...props
}: { nome: string; rotulo: string; itens: Itens; mudar: (i: Itens) => void } & React.ComponentProps<"input">) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-medium">{rotulo}</span>
      <input
        {...props}
        data-campo={nome}
        value={itens[nome] ?? ""}
        onChange={(e) => mudar({ [nome]: e.target.value })}
        maxLength={props.maxLength ?? 120}
        className={estilo}
      />
    </label>
  );
}

function Estado({ itens, mudar, className }: { itens: Itens; mudar: (i: Itens) => void; className?: string }) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-medium">Estado</span>
      <Seletor
        value={itens.uf ?? ""}
        onChange={(e) => mudar({ uf: e.target.value })}
        autoComplete="address-level1"
        className="h-13 rounded-xl bg-card text-base sm:text-base"
      >
        <option value="">UF</option>
        {UFS.map((u) => (
          <option key={u}>{u}</option>
        ))}
      </Seletor>
    </label>
  );
}

export function CampoDoEndereco({ r, mudar }: { r: Resposta | undefined; mudar: (r: Resposta) => void }) {
  const itens = r?.itens ?? {};
  const [situacao, setSituacao] = useState<"parado" | "buscando" | "achou" | "nao_achou" | "fora">("parado");
  const [procurando, setProcurando] = useState(false);
  const [achados, setAchados] = useState<Achado[] | null>(null);
  const caixa = useRef<HTMLDivElement>(null);
  // A resposta mais nova, para a busca que demora não apagar o que a pessoa escreveu nesse meio-tempo.
  const atual = useRef(itens);
  useEffect(() => {
    atual.current = itens;
  });

  const trocar = (mudanca: Itens) => mudar({ opcoes: ["outro"], itens: { ...atual.current, ...mudanca } });
  const focar = (nome: string) => setTimeout(() => caixa.current?.querySelector<HTMLInputElement>(`[data-campo="${nome}"]`)?.focus(), 60);

  function preencher({ cep, endereco, bairro, cidade, uf }: Achado) {
    trocar({ cep: mascaraCep(cep), rua: endereco, bairro, cidade, uf });
    setSituacao("achou");
    setProcurando(false);
    setAchados(null);
    focar(endereco ? "numero" : "rua");
  }

  async function buscar(valor: string) {
    const cep = mascaraCep(valor);
    trocar({ cep });
    const digitos = cep.replace(/\D/g, "");
    if (digitos.length !== 8) return setSituacao("parado");
    setSituacao("buscando");
    try {
      const resposta = await fetch(`/forms/consulta/cep/${digitos}`);
      if (resposta.status === 404) return setSituacao("nao_achou");
      if (!resposta.ok) return setSituacao("fora");
      preencher({ cep: digitos, ...((await resposta.json()) as Omit<Achado, "cep">) });
    } catch {
      setSituacao("fora");
    }
  }

  async function buscarPelaRua() {
    setSituacao("buscando");
    try {
      const q = new URLSearchParams({ uf: itens.uf ?? "", cidade: itens.cidade ?? "", rua: itens.rua ?? "" });
      const resposta = await fetch(`/forms/consulta/cep?${q}`);
      setAchados(resposta.ok ? ((await resposta.json()) as Achado[]) : []);
      setSituacao(resposta.ok ? "parado" : "fora");
    } catch {
      setAchados([]);
      setSituacao("fora");
    }
  }

  const avisos = {
    parado: "",
    buscando: "Procurando o endereço",
    achou: "Achamos. Confira e complete o número.",
    nao_achou: "Não achamos esse CEP. Confira os números ou procure pela rua.",
    fora: "A busca não respondeu agora. Pode preencher à mão.",
  };
  const mostrarCampos = situacao === "achou" || situacao === "fora" || Boolean(itens.rua && !procurando);

  return (
    <div ref={caixa} className="space-y-4 rounded-2xl border border-ink/15 bg-card/60 p-4 sm:p-5" data-endereco>
      {procurando ? (
        <div className="space-y-3">
          <div className="grid grid-cols-[6rem_1fr] gap-3">
            <Estado itens={itens} mudar={trocar} />
            <Campo nome="cidade" rotulo="Cidade" itens={itens} mudar={trocar} autoComplete="address-level2" />
          </div>
          <Campo nome="rua" rotulo="Rua" itens={itens} mudar={trocar} placeholder="Só o nome da rua" />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={buscarPelaRua}
              disabled={!itens.uf || (itens.cidade ?? "").trim().length < 3 || (itens.rua ?? "").trim().length < 3}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper disabled:opacity-40"
            >
              <SearchIcon className="size-4" aria-hidden="true" />
              Procurar o CEP
            </button>
            <button
              type="button"
              onClick={() => {
                setProcurando(false);
                setAchados(null);
              }}
              className="min-h-12 rounded-full px-4 text-sm text-muted-foreground hover:text-foreground"
            >
              Já sei o CEP
            </button>
          </div>
          {achados && (
            <ul className="space-y-2" aria-label="Endereços encontrados">
              {achados.map((a) => (
                <li key={`${a.cep}${a.endereco}`}>
                  <button
                    type="button"
                    onClick={() => preencher(a)}
                    className="flex w-full items-start gap-3 rounded-xl border border-input bg-card px-4 py-3 text-left hover:border-ring"
                  >
                    <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block break-words">{a.endereco}</span>
                      <span className="block text-sm text-muted-foreground">
                        {[a.bairro, `${a.cidade}, ${a.uf}`, mascaraCep(a.cep)].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {achados.length === 0 && <li className="text-sm">Não achamos essa rua. Confira o nome ou preencha pelo CEP.</li>}
            </ul>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <label className="block w-44 space-y-1.5">
            <span className="text-sm font-medium">CEP</span>
            <span className="relative block">
              <input
                autoFocus
                data-campo="cep"
                value={itens.cep ?? ""}
                onChange={(e) => void buscar(e.target.value)}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                className={cn(estilo, "pr-11 text-lg tabular-nums")}
              />
              <span className="absolute top-1/2 right-4 -translate-y-1/2" aria-hidden="true">
                {situacao === "buscando" && <LoaderCircleIcon className="size-5 animate-spin" />}
                {situacao === "achou" && <CheckIcon className="size-5 text-success" strokeWidth={3} />}
              </span>
            </span>
          </label>
          <button
            type="button"
            onClick={() => {
              setProcurando(true);
              setSituacao("parado");
            }}
            className="min-h-13 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Não sei o CEP
          </button>
        </div>
      )}
      <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite" data-aviso-do-cep>
        {avisos[situacao]}
      </p>
      {mostrarCampos && (
        <div className="grid gap-3 sm:grid-cols-6">
          <Campo nome="rua" rotulo="Rua" itens={itens} mudar={trocar} className="sm:col-span-4" autoComplete="address-line1" />
          <Campo nome="numero" rotulo="Número" itens={itens} mudar={trocar} className="sm:col-span-2" placeholder="120 ou S/N" maxLength={20} />
          <Campo nome="complemento" rotulo="Complemento, se tiver" itens={itens} mudar={trocar} className="sm:col-span-3" placeholder="Sala, andar, loja" />
          <Campo nome="bairro" rotulo="Bairro" itens={itens} mudar={trocar} className="sm:col-span-3" />
          <Campo nome="cidade" rotulo="Cidade" itens={itens} mudar={trocar} className="sm:col-span-4" autoComplete="address-level2" />
          <Estado itens={itens} mudar={trocar} className="sm:col-span-2" />
          <Campo nome="referencia" rotulo="Ponto de referência, se ajudar" itens={itens} mudar={trocar} className="sm:col-span-6" placeholder="Em frente à praça" />
        </div>
      )}
    </div>
  );
}

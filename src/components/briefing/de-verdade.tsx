"use client";

import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/brand";
import { PlayerDoBriefing, type Guardado, type Mudanca, type Salvo } from "@/components/briefing/briefing";
import { OutroAparelho } from "@/components/briefing/telas";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { linkWhatsApp } from "@/config/site";
import type { BriefingDoPainel } from "@/lib/briefing/painel";
import { progresso, type Briefing } from "@/lib/briefing/regras";

// O briefing do cliente: abre pelo código do link e guarda cada resposta no painel (plano geral,
// Parte 5). O que ainda não chegou lá fica neste aparelho, para uma queda da internet não
// apagar nada.

/** Pausa na digitação antes de guardar. */
const ESPERA = 900;
/** De quanto em quanto tempo tentar de novo quando a internet cai. */
const DE_NOVO = 5000;

type Resposta<T> = { status: number; dados: T | null };

async function pedir<T>(acao: string, corpo: Record<string, unknown>, opcoes: RequestInit = {}): Promise<Resposta<T>> {
  try {
    const r = await fetch(`/forms/api/${acao}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corpo),
      ...opcoes,
    });
    return { status: r.status, dados: (await r.json().catch(() => null)) as T | null };
  } catch {
    // Sem internet.
    return { status: 0, dados: null };
  }
}

type Pendente = { respostas: Guardado["respostas"]; colados: Guardado["colados"]; recomecar?: true; feitas: number; total: number };

const chaveDe = (codigo: string) => `briefing-pendente:${codigo}`;

function lerPendente(codigo: string): Pendente | null {
  try {
    return JSON.parse(localStorage.getItem(chaveDe(codigo)) ?? "null") as Pendente | null;
  } catch {
    return null;
  }
}

function gravarPendente(codigo: string, p: Pendente | null) {
  try {
    if (p) localStorage.setItem(chaveDe(codigo), JSON.stringify(p));
    else localStorage.removeItem(chaveDe(codigo));
  } catch {
    // Navegador sem armazenamento: segue só com o painel.
  }
}

/** Junta o que mudou agora ao que ainda não tinha chegado. */
const juntar = (antes: Pendente | null, m: Mudanca): Pendente => ({
  respostas: { ...(m.recomecar ? {} : antes?.respostas), ...m.respostas },
  colados: { ...(m.recomecar ? {} : antes?.colados), ...m.colados },
  ...(m.recomecar || antes?.recomecar ? { recomecar: true as const } : {}),
  feitas: m.feitas,
  total: m.total,
});

type Aberto = Exclude<BriefingDoPainel, { precisa_digitos: true }>;

export function BriefingDeVerdade({ codigo }: { codigo: string }) {
  const [estado, setEstado] = useState<
    { tipo: "abrindo" | "nao_existe" | "sem_resposta" } | { tipo: "digitos"; travado: boolean } | { tipo: "aberto"; briefing: Aberto }
  >({ tipo: "abrindo" });

  async function abrir() {
    const { status, dados } = await pedir<{ briefing: BriefingDoPainel }>("abrir", { codigo });
    if (status === 404) return setEstado({ tipo: "nao_existe" });
    if (!dados?.briefing) return setEstado({ tipo: "sem_resposta" });
    const b = dados.briefing;
    setEstado(b.precisa_digitos ? { tipo: "digitos", travado: b.travado } : { tipo: "aberto", briefing: b });
  }
  const comecou = useRef(false);
  useEffect(() => {
    if (comecou.current) return;
    comecou.current = true;
    void abrir();
    // Abre uma vez só; o código não muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (estado.tipo === "aberto") return <Aberto codigo={codigo} briefing={estado.briefing} />;
  if (estado.tipo === "digitos")
    return (
      <div className="flex min-h-dvh flex-col">
        <OutroAparelho
          jaTravado={estado.travado}
          aoConferir={async (digitos) => (await pedir<{ ok: boolean; travado: boolean }>("digitos", { codigo, digitos })).dados}
          aoConfirmar={abrir}
        />
      </div>
    );
  if (estado.tipo === "abrindo") return <div className="min-h-dvh" aria-busy="true" aria-label="Abrindo o seu briefing" />;
  return (
    <Recado
      titulo={estado.tipo === "nao_existe" ? "Este link não abre mais" : "Não conseguimos abrir agora"}
      texto={
        estado.tipo === "nao_existe"
          ? "Pode ser que ele tenha sido trocado por um novo. Fale com a gente que mandamos o certo."
          : "Parece que a internet falhou. O que você já respondeu continua guardado."
      }
      aoTentar={estado.tipo === "sem_resposta" ? abrir : undefined}
    />
  );
}

/** Um recado no lugar do briefing, com o WhatsApp. */
export function Recado({ titulo, texto, aoTentar }: { titulo: string; texto: string; aoTentar?: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6">
        <BrandLogo />
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        <h1 className="font-heading text-3xl leading-tight text-balance sm:text-4xl">{titulo}</h1>
        <p className="mt-4 leading-7 text-pretty text-muted-foreground">{texto}</p>
        <div className="mt-7 flex flex-col gap-3">
          {aoTentar && (
            <button type="button" onClick={aoTentar} className="min-h-13 rounded-full bg-brand px-7 font-semibold text-brand-foreground">
              Tentar de novo
            </button>
          )}
          <a
            href={linkWhatsApp("Olá! Preciso de ajuda com o meu briefing.")}
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-input px-7 font-medium hover:bg-muted"
          >
            <IconeWhatsApp className="size-5" />
            Chamar no WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}

function Aberto({ codigo, briefing: b }: { codigo: string; briefing: Aberto }) {
  const briefing: Briefing = { ...b.conteudo, tipo: b.tipo };
  const [{ inicial, sobrou }] = useState(() => {
    // O que ficou neste aparelho e não chegou ao painel (a internet caiu) entra por cima.
    const p = b.enviado ? null : lerPendente(codigo);
    const inicial: Guardado = {
      respostas: p ? { ...(p.recomecar ? {} : b.respostas), ...p.respostas } : b.respostas,
      colados: p ? { ...(p.recomecar ? {} : b.colados), ...p.colados } : b.colados,
      enviado: b.enviado,
      materialMandado: b.material_mandado,
    };
    return { inicial, sobrou: p };
  });
  const [salvo, setSalvo] = useState<Salvo>("");
  const pendente = useRef<Pendente | null>(sobrou);
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Um pedido de guardar por vez, na ordem.
  const fila = useRef<Promise<unknown>>(Promise.resolve());

  /** Manda o que falta; devolve se está tudo no painel. */
  function mandar(): Promise<boolean> {
    clearTimeout(espera.current);
    const vez = fila.current.then(async () => {
      const indo = pendente.current;
      if (!indo) return true;
      pendente.current = null;
      const { status } = await pedir("guardar", { codigo, ...indo });
      if (status === 200) {
        // Só apaga a cópia daqui se nada mudou enquanto ia.
        gravarPendente(codigo, pendente.current);
        setSalvo("salvo");
        return pendente.current === null;
      }
      const depois = pendente.current as Pendente | null;
      pendente.current = depois ? juntar(indo, { ...depois, recomecar: depois.recomecar }) : indo;
      gravarPendente(codigo, pendente.current);
      // Sem internet ou o servidor fora: tenta de novo. Recusado (já enviado em outro aparelho): não.
      if (status === 0 || status >= 500) {
        setSalvo("sem_conexao");
        espera.current = setTimeout(mandar, DE_NOVO);
      } else {
        pendente.current = null;
        gravarPendente(codigo, null);
        window.location.reload();
      }
      return false;
    });
    fila.current = vez;
    return vez;
  }

  function guardar(_: Guardado, mudanca: Mudanca) {
    pendente.current = juntar(pendente.current, mudanca);
    gravarPendente(codigo, pendente.current);
    clearTimeout(espera.current);
    espera.current = setTimeout(mandar, ESPERA);
  }

  // Saiu da página (ou trocou de aplicativo): manda o que falta sem esperar.
  useEffect(() => {
    if (pendente.current) void mandar();
    const aoSair = () => {
      if (document.visibilityState === "hidden" && pendente.current)
        void pedir("guardar", { codigo, ...pendente.current }, { keepalive: true });
    };
    const aoVoltarAInternet = () => void mandar();
    document.addEventListener("visibilitychange", aoSair);
    window.addEventListener("online", aoVoltarAInternet);
    return () => {
      document.removeEventListener("visibilitychange", aoSair);
      window.removeEventListener("online", aoVoltarAInternet);
      clearTimeout(espera.current);
    };
    // mandar só usa referências: as da primeira vez servem sempre.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo]);

  return (
    <PlayerDoBriefing
      briefing={briefing}
      inicial={inicial}
      pasta={b.pasta || undefined}
      salvo={salvo}
      aoGuardar={guardar}
      aoEnviar={async (dados) => {
        // O painel precisa ter tudo antes de enviar.
        if (!(await mandar()) && !(await mandar())) return "A internet falhou agora. Suas respostas estão guardadas, tente de novo em instantes.";
        const { feitas, total } = progresso(briefing, dados.respostas);
        const { status } = await pedir("enviar", { codigo, feitas, total });
        if (status === 200) return "";
        return status === 409
          ? "Alguma resposta ainda não chegou. Atualize a página e confira."
          : "Não conseguimos enviar agora. Suas respostas estão guardadas, tente de novo em instantes.";
      }}
      aoMaterial={(_, mandou) => void pedir("material", { codigo, mandou })}
      aoBaixar={async () => {
        const r = await fetch("/forms/api/pdf", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ codigo }),
        }).catch(() => null);
        if (!r?.ok) return "Não conseguimos gerar o arquivo agora. Tente de novo em instantes.";
        const a = document.createElement("a");
        a.href = URL.createObjectURL(await r.blob());
        a.download = "Briefing Adsgator.pdf";
        a.click();
        URL.revokeObjectURL(a.href);
        return "";
      }}
    />
  );
}

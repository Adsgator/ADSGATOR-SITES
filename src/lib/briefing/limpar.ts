import type { Periodo, Resposta, Respostas } from "@/lib/briefing/regras";
import type { Colados } from "@/lib/briefing/sinais";

// O que chega do navegador, conferido no servidor: só os campos que existem, com os mesmos
// limites da tela.

const objeto = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const textos = (v: unknown, quantos: number, tamanho: number) =>
  Array.isArray(v)
    ? v
        .filter((x): x is string => typeof x === "string")
        .slice(0, quantos)
        .map((x) => x.slice(0, tamanho))
    : undefined;
const ehHora = (v: unknown): v is string => typeof v === "string" && /^\d{2}:\d{2}$/.test(v);

function periodo(v: unknown): Periodo | null {
  if (!objeto(v) || !ehHora(v.de) || !ehHora(v.ate)) return null;
  const { pausa } = v;
  return objeto(pausa) && ehHora(pausa.de) && ehHora(pausa.ate)
    ? { de: v.de, ate: v.ate, pausa: { de: pausa.de, ate: pausa.ate } }
    : { de: v.de, ate: v.ate };
}

function horarios(v: unknown): Resposta["horarios"] {
  if (!Array.isArray(v)) return undefined;
  return v.slice(0, 7).flatMap((h: unknown) => {
    const p = periodo(h);
    if (!p || !objeto(h)) return [];
    const diferentes = (Array.isArray(h.diferentes) ? h.diferentes : []).slice(0, 7).flatMap((d: unknown) => {
      const q = periodo(d);
      return q && objeto(d) ? [{ ...q, dia: String(d.dia).slice(0, 20), ...(d.fechado === true ? { fechado: true } : {}) }] : [];
    });
    return [{ ...p, dias: String(h.dias).slice(0, 30), aberto: h.aberto === true, ...(diferentes.length ? { diferentes } : {}) }];
  });
}

function resposta(v: unknown): Resposta {
  if (!objeto(v)) return {};
  const r: Resposta = {};
  if (v.nada === true) r.nada = true;
  if (typeof v.valor === "string") r.valor = v.valor.slice(0, 20_000);
  const opcoes = textos(v.opcoes, 80, 1_000);
  if (opcoes) r.opcoes = opcoes;
  if (objeto(v.itens))
    r.itens = Object.fromEntries(
      Object.entries(v.itens)
        .filter((e): e is [string, string] => typeof e[1] === "string")
        .slice(0, 80)
        .map(([k, t]) => [k.slice(0, 1_000), t.slice(0, 10_000)]),
    );
  const h = horarios(v.horarios);
  if (h) r.horarios = h;
  return r;
}

const PERGUNTAS = 200;

export const limparRespostas = (v: unknown): Respostas =>
  objeto(v) ? Object.fromEntries(Object.entries(v).slice(0, PERGUNTAS).map(([id, r]) => [id, resposta(r)])) : {};

export const limparColados = (v: unknown): Colados =>
  objeto(v) ? Object.fromEntries(Object.entries(v).slice(0, PERGUNTAS).map(([id, t]) => [id, textos(t, 5, 20_000) ?? []])) : {};

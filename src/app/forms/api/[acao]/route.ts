import { randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { limparColados, limparRespostas } from "@/lib/briefing/limpar";
import { padraoDaPagina, padraoDoGoogleAds } from "@/lib/briefing/padrao";
import {
  CODIGO,
  conferirDigitos,
  ConteudoRecusado,
  criarSemCodigo,
  enviarBriefing,
  guardarBriefing,
  lerBriefing,
  marcarMaterial,
  pdfDoBriefing,
} from "@/lib/briefing/painel";
import { respondida, visiveis, type Briefing } from "@/lib/briefing/regras";

// O que a página do briefing pede (plano geral, Parte 5). Quem responde é o painel: aqui só se
// confere o que veio, com o código do link e o token do aparelho, que fica num cookie que a
// página não lê.

// O PDF leva alguns segundos para sair do painel.
export const maxDuration = 45;

const COOKIE = "briefing";
const LIMITE = 420_000;
const UM_ANO = 60 * 60 * 24 * 365;

async function tokenDoAparelho(): Promise<string> {
  const guardados = await cookies();
  const tem = guardados.get(COOKIE)?.value;
  if (tem && /^[0-9a-f]{64}$/.test(tem)) return tem;
  const novo = randomBytes(32).toString("hex");
  guardados.set(COOKIE, novo, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UM_ANO,
  });
  return novo;
}

const recusar = (erro: string, status: number) => Response.json({ ok: false, erro }, { status });
const inteiro = (v: unknown) => (Number.isInteger(v) && Number(v) >= 0 && Number(v) <= 200 ? Number(v) : 0);

/** A página que chama é a própria. */
function mesmaOrigem(request: Request) {
  const origem = request.headers.get("origin");
  return !origem || URL.parse(origem)?.host === request.headers.get("host");
}

async function lerCorpo(request: Request): Promise<Record<string, unknown> | null> {
  if (Number(request.headers.get("content-length") ?? 0) > LIMITE) return null;
  const texto = await request.text();
  if (texto.length > LIMITE) return null;
  try {
    const lido: unknown = JSON.parse(texto);
    return typeof lido === "object" && lido !== null && !Array.isArray(lido) ? (lido as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request, ctx: RouteContext<"/forms/api/[acao]">) {
  const { acao } = await ctx.params;
  if (!mesmaOrigem(request)) return recusar("Origem inválida", 403);
  const corpo = await lerCorpo(request);
  if (!corpo) return recusar("Pedido inválido", 400);
  try {
    if (acao === "comecar") return await comecar(corpo, request);
    const codigo = String(corpo.codigo ?? "");
    if (!CODIGO.test(codigo)) return recusar("Briefing não encontrado", 404);
    const quem = { codigo, token: await tokenDoAparelho() };
    switch (acao) {
      case "abrir": {
        const b = await lerBriefing(quem);
        return b ? Response.json({ ok: true, briefing: b }) : recusar("Briefing não encontrado", 404);
      }
      case "digitos": {
        const r = await conferirDigitos(quem, String(corpo.digitos ?? "").slice(0, 8));
        return r ? Response.json(r) : recusar("Briefing não encontrado", 404);
      }
      case "guardar": {
        const total = inteiro(corpo.total);
        const ok = await guardarBriefing(quem, {
          respostas: limparRespostas(corpo.respostas),
          colados: limparColados(corpo.colados),
          recomecar: corpo.recomecar === true,
          feitas: Math.min(inteiro(corpo.feitas), total),
          total,
        });
        return ok ? Response.json({ ok: true }) : recusar("Não foi possível guardar", 409);
      }
      case "enviar":
        return await enviar(quem);
      case "material": {
        const ok = await marcarMaterial(quem, corpo.mandou === true);
        return ok ? Response.json({ ok: true }) : recusar("Não foi possível", 409);
      }
      case "pdf": {
        const pdf = await pdfDoBriefing(quem);
        return pdf ? new Response(pdf, { headers: { "content-type": "application/pdf", "cache-control": "no-store" } }) : recusar("Não encontrado", 404);
      }
      default:
        return recusar("Não encontrado", 404);
    }
  } catch (e) {
    if (e instanceof ConteudoRecusado) return recusar("Não foi possível guardar", 400);
    console.error("briefing:", acao, String(e));
    return recusar("Sem resposta agora", 502);
  }
}

/** A mesma conferência da tela, com o que está guardado: só vai completo. */
async function enviar(quem: { codigo: string; token: string }) {
  const b = await lerBriefing(quem);
  if (!b || b.precisa_digitos) return recusar("Briefing não encontrado", 404);
  if (b.enviado) return Response.json({ ok: true });
  const briefing: Briefing = { ...b.conteudo, tipo: b.tipo };
  const lista = visiveis(briefing, b.respostas);
  const faltam = lista.filter((p) => !respondida(p, briefing, b.respostas)).map((p) => p.id);
  if (faltam.length || !lista.length) return Response.json({ ok: false, erro: "Ainda falta responder", faltam }, { status: 409 });
  const r = await enviarBriefing(quem, lista.length, lista.length);
  return r?.ok ? Response.json({ ok: true }) : recusar("Não foi possível enviar", 409);
}

/** Quem entrou pelo endereço sem código: o padrão, com o nome e o WhatsApp que a pessoa disse. */
async function comecar(corpo: Record<string, unknown>, request: Request) {
  const nome = String(corpo.nome ?? "").replace(/\s+/g, " ").trim().slice(0, 120);
  const numero = String(corpo.whatsapp ?? "")
    .replace(/\D/g, "")
    .replace(/^55(?=\d{10,11}$)/, "");
  const tipo = corpo.tipo === "google_ads" || corpo.tipo === "pagina" ? corpo.tipo : null;
  if (!tipo || nome.length < 2 || !/^[1-9]{2}9?\d{8}$/.test(numero)) return recusar("Confira o nome e o WhatsApp", 400);
  await tokenDoAparelho();
  const cliente = { nome: nome.split(" ")[0], segmento: "" };
  const escrito = `(${numero.slice(0, 2)}) ${numero.slice(2, -4)}-${numero.slice(-4)}`;
  const conteudo = tipo === "pagina" ? padraoDaPagina({ ...cliente, whatsapp: escrito }) : padraoDoGoogleAds(cliente);
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const codigo = await criarSemCodigo({ tipo, nome, whatsapp: numero, conteudo, ip });
  return codigo ? Response.json({ ok: true, codigo }) : recusar("Muitos começos hoje", 429);
}

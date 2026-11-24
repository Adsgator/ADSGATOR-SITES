"use client";

import { ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { letras, type NomeDaLetra } from "@/components/briefing/mockup/letras";
import { cn } from "@/lib/utils";

import css from "./mockup.module.css";

// O desenho que acompanha as respostas: uma cena montada, com a página no celular, e não a
// planta dela. Cada composição é desenhada inteira; a cor e a letra variam por cima e a
// sensação muda só a luz. Só entram fatos curtos (nome, serviço, número, lugar).
// As medidas são em cqw: a cena é a mesma em qualquer largura.

export type Fatos = {
  nome?: string;
  lugar?: string;
  principal?: string;
  servicos?: string[];
  /** O valor e o que ele conta ("9 anos", "de experiência"). */
  numero?: [string, string];
  /** Uma foto do assunto, não do cliente, tingida com a cor dele. Sem ela, formas e luz. */
  foto?: string;
};

export type Visual = {
  fundo: string;
  tinta: string;
  destaque: string;
  apoio: string;
  sobre: string;
  letra: NomeDaLetra;
  luz: keyof typeof luzes;
};

/** O que a sensação muda: a cor, a força e o ritmo da luz. */
export const luzes = {
  "Luz do dia": { cor: "#fff6e6", forca: 0.75, ritmo: 11 },
  Quente: { cor: "#ffcf8a", forca: 0.95, ritmo: 11 },
  Serena: { cor: "#e6f1ff", forca: 0.6, ritmo: 20 },
  Viva: { cor: "#ffffff", forca: 1, ritmo: 5 },
};

const suave = [0.22, 1, 0.36, 1] as const;
/** O corpo do título, em cqw: o maior em que a palavra mais comprida cabe na linha. */
const corpoDoTitulo = (texto: string, nome: NomeDaLetra, base: number, linha: number) => {
  const { corpo, largura } = letras[nome];
  const palavra = Math.max(...texto.split(/\s+/).map((p) => p.length));
  return `${Math.min(base * corpo * (texto.length > 34 ? 0.82 : 1), linha / (palavra * largura)).toFixed(2)}cqw`;
};

type Props = { fatos: Fatos; visual: Visual };

function Moldura({ visual, className, children }: { visual: Visual; className: string; children: React.ReactNode }) {
  const letra = letras[visual.letra];
  const luz = luzes[visual.luz];
  const estilo = {
    "--fundo": visual.fundo,
    "--tinta": visual.tinta,
    "--destaque": visual.destaque,
    "--apoio": visual.apoio,
    "--sobre": visual.sobre,
    "--luz": luz.cor,
    "--forca": luz.forca,
    "--letra": letra.familia,
    "--peso": letra.peso,
    "--corpo": letra.corpo,
    "--entrelinha": letra.entrelinha,
    "--espaco": letra.espaco,
    "--caixa": "maiusculas" in letra ? "uppercase" : "none",
  } as React.CSSProperties;
  return (
    <div className={css.moldura} style={estilo} aria-hidden="true">
      <div className={cn(css.cena, className)}>{children}</div>
    </div>
  );
}

/** O que muda quando a resposta chega: sai o antigo, entra o novo, sem pulo. */
function Troca({ chave, className, style, children }: { chave: string; className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={chave}
        initial={{ opacity: 0, filter: "blur(0.5rem)", y: 6 }}
        animate={{ opacity: 1, filter: "blur(0rem)", y: 0 }}
        exit={{ opacity: 0, filter: "blur(0.4rem)" }}
        transition={{ duration: 0.5, ease: suave }}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function Foto({ fatos, className }: { fatos: Fatos; className?: string }) {
  return (
    <div className={cn(css.foto, className)}>
      {fatos.foto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fatos.foto} alt="" />
      ) : (
        <span className={css.semFoto}>
          <i />
          <i />
          <i />
        </span>
      )}
    </div>
  );
}

function Celular({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div className={cn(css.celular, className)}>
      <div className={css.tela}>
        {children}
        <span className={css.reflexo} />
      </div>
      <span className={css.ilha} />
    </div>
  );
}

// Galeria -------------------------------------------------------------------------------------
// Uma parede com luz de janela, um nicho e a página em exposição. Para o que pede calma e
// acabamento (elegante, clássico, delicado, luxuoso).

export function Galeria({ fatos, visual }: Props) {
  const { ritmo } = luzes[visual.luz];
  const nome = fatos.nome ?? "O seu negócio";
  const titulo = fatos.principal ?? "O que você faz";
  return (
    <Moldura visual={visual} className={css.galeria}>
      <span className={css.parede} />
      <span className={css.nicho} />
      <span className={css.chao} />
      {/* A luz da janela anda devagar pela parede. */}
      <motion.span className={css.janela} animate={{ x: ["-3cqw", "4cqw", "-3cqw"] }} transition={{ duration: ritmo, repeat: Infinity, ease: "easeInOut" }} />
      <span className={css.pedestal} />
      <span className={css.esfera} />

      <div className={css.lugarDoCelular}>
        <Celular className={css.celularDaGaleria}>
          <div className={css.paginaDaGaleria}>
            <Troca chave={nome + visual.letra} className={css.topoDaGaleria} style={{ fontSize: corpoDoTitulo(nome.replace(/\s/g, "x"), visual.letra, 4.4, 44) }}>
              {nome}
            </Troca>
            <Foto fatos={fatos} className={css.arco} />
            <Troca chave={fatos.lugar ?? ""} className={css.lugar}>
              {fatos.lugar ?? "Onde você atende"}
            </Troca>
            <Troca chave={titulo + visual.letra} className={css.tituloDaGaleria} style={{ fontSize: corpoDoTitulo(titulo, visual.letra, 7.6, 45) }}>
              {titulo}
            </Troca>
            <span className={css.botaoDaGaleria} data-botao-do-desenho>
              <IconeWhatsApp /> Chamar no WhatsApp
            </span>
            <ul className={css.linhas}>
              {(fatos.servicos ?? []).slice(0, 2).map((s, i) => (
                <motion.li key={s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}>
                  <span>{s}</span>
                  <ChevronRightIcon />
                </motion.li>
              ))}
            </ul>
          </div>
        </Celular>
      </div>

      <AnimatePresence>
        {fatos.numero && (
          <motion.div
            key="placa"
            className={css.placa}
            initial={{ opacity: 0, x: "6cqw" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: suave, delay: 0.35 }}
          >
            <b>{fatos.numero[0]}</b>
            <small>{fatos.numero[1]}</small>
          </motion.div>
        )}
      </AnimatePresence>

      <span className={css.grao} />
    </Moldura>
  );
}

// Cartaz --------------------------------------------------------------------------------------
// Cor cheia, letra gigante cortada e o celular atravessando a cena. Para o que pede presença
// (forte, jovem, vibrante, divertido).

export function Cartaz({ fatos, visual }: Props) {
  const { ritmo } = luzes[visual.luz];
  const titulo = fatos.principal ?? "O que você faz";
  const faixa = (fatos.servicos?.length ? fatos.servicos : [titulo]).slice(0, 4);
  return (
    <Moldura visual={visual} className={css.cartaz}>
      <span className={css.foco} />
      <span className={css.disco} />
      <span className={css.corte} />

      <Troca chave={(fatos.nome ?? "") + visual.letra} className={css.nome} style={{ fontSize: corpoDoTitulo(fatos.nome ?? "O seu negócio", visual.letra, 12, 86) }}>
        {fatos.nome ?? "O seu negócio"}
      </Troca>

      <motion.div className={css.lugarDoCelularNoCartaz} animate={{ rotate: [8, 6.6, 8], y: ["0cqw", "-1.4cqw", "0cqw"] }} transition={{ duration: ritmo * 0.6, repeat: Infinity, ease: "easeInOut" }}>
        <Celular className={css.celularDoCartaz}>
          <div className={css.paginaDoCartaz}>
            <Foto fatos={fatos} className={css.fotoDoCartaz} />
            <div className={css.textoDoCartaz}>
              <Troca chave={fatos.lugar ?? ""} className={css.etiqueta}>
                {fatos.lugar ?? "Onde você atende"}
              </Troca>
              <Troca chave={titulo + visual.letra} className={css.tituloDoCartaz} style={{ fontSize: corpoDoTitulo(titulo, visual.letra, 10, 50) }}>
                {titulo}
              </Troca>
              <span className={css.botaoDoCartaz} data-botao-do-desenho>
                <IconeWhatsApp /> Chamar agora
              </span>
            </div>
          </div>
        </Celular>
      </motion.div>

      <AnimatePresence>
        {Boolean(fatos.servicos?.length) && (
          <motion.div key="fita" className={css.fita} initial={{ x: "-110%" }} animate={{ x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: suave, delay: 0.2 }}>
            <motion.div className={css.fitaTexto} animate={{ x: ["0%", "-50%"] }} transition={{ duration: 4 + faixa.join("").length * 0.34 * (ritmo / 11), repeat: Infinity, ease: "linear" }}>
              {[0, 1].map((v) => (
                <span key={v}>
                  {[...faixa, ...faixa, ...faixa].map((s, i) => (
                    <span key={i}>
                      {s}
                      <i>✦</i>
                    </span>
                  ))}
                </span>
              ))}
            </motion.div>
          </motion.div>
        )}
        {fatos.numero && (
          <motion.div
            key="selo"
            className={css.selo}
            initial={{ scale: 0, rotate: -60 }}
            animate={{ scale: 1, rotate: -10 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 170, damping: 13, delay: 0.3 }}
          >
            <motion.svg viewBox="0 0 100 100" animate={{ rotate: 360 }} transition={{ duration: ritmo * 4, repeat: Infinity, ease: "linear" }}>
              <path d={ESTRELA} fill="currentColor" />
            </motion.svg>
            <span>
              <b style={{ fontSize: corpoDoTitulo(fatos.numero[0].replace(/\s/g, "x"), visual.letra, 9, 21) }}>{fatos.numero[0]}</b>
              <small>{fatos.numero[1]}</small>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <span className={css.grao} />
    </Moldura>
  );
}

/** O selo de borda ondulada. */
const ESTRELA = (() => {
  const pontas = 14;
  const p = Array.from({ length: pontas * 2 }, (_, i) => {
    const a = (i / (pontas * 2)) * Math.PI * 2;
    const r = i % 2 ? 43 : 50;
    return [50 + r * Math.cos(a), 50 + r * Math.sin(a)].map((n) => n.toFixed(2));
  });
  return `M${p.map((x) => x.join(" ")).join("L")}Z`;
})();

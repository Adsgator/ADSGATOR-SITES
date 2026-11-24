import { DadosEstruturados, dadosDoServico } from "@/components/dados-estruturados";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  BellRingIcon,
  CalendarSyncIcon,
  CheckIcon,
  FileBarChartIcon,
  MapPinIcon,
  MousePointerClickIcon,
  RefreshCwIcon,
  SearchIcon,
  SmartphoneIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { AnuncioMontando } from "@/components/anuncio-montando";
import { AnuncioPorDentro } from "@/components/anuncio-por-dentro";
import { DiagnosticoExemplo } from "@/components/diagnostico-exemplo";
import { ResumoDoMes } from "@/components/resumo-do-mes";
import { BuscasNoAr } from "@/components/colunas-subindo";
import { ChamadaFinal } from "@/components/chamada-final";
import { Eyebrow } from "@/components/eyebrow";
import { Faq } from "@/components/faq";
import { FundoVivo } from "@/components/fundo-vivo";
import { LinhaDoTempo } from "@/components/linha-do-tempo";
import { ListaQueSeMarca } from "@/components/lista-que-se-marca";
import { MotionScope } from "@/components/motion/motion-scope";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { VerbaDireta } from "@/components/verba-direta";
import { linkWhatsApp, mensagemDaPagina } from "@/config/site";
import { cn } from "@/lib/utils";

// Página de Google Ads, na ordem do roteiro do site (ADSGATOR-PAINEL,
// DOCS/ROTEIRO-SITE.md, "Google Ads"), aprovado pelo Lucas em 2026-11-20. Sem
// preço (decisão de 2026-11-20): o investimento é dito na conversa, depois do
// diagnóstico. Rodada de profundidade (Lucas, 2026-11-20): o porquê do Google,
// o diagnóstico de exemplo, o que cada passo do começo quer dizer (processo de
// Google Ads da Base), o anúncio por dentro, o que a revisão olha, o resumo do
// mês e as objeções reais ("Desconto e objeções", processo comercial da Base).

export const metadata: Metadata = {
  title: "Gestão de Google Ads para negócios locais",
  description:
    "Apareça no Google para quem está procurando o seu serviço agora, com a verba certa para a sua região. Conta no seu nome, sem fidelidade. Diagnóstico grátis pelo WhatsApp.",
  alternates: { canonical: "/google-ads" },
};

const whatsapp = linkWhatsApp(mensagemDaPagina("/google-ads"));

const titulo = "font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl";
const botaoMarca = cn(
  buttonVariants({ size: "lg" }),
  "h-12 rounded-full bg-brand px-7 text-base text-brand-foreground hover:bg-brand/90",
);
const botaoContorno = cn(
  buttonVariants({ size: "lg", variant: "outline" }),
  "h-12 rounded-full bg-transparent px-7 text-base",
);

const diagnostico = [
  { icone: UsersIcon, titulo: "Quantas pessoas procuram", texto: "o seu serviço, na sua região." },
  { icone: MousePointerClickIcon, titulo: "Quanto custa cada clique", texto: "no seu segmento e na sua cidade." },
  { icone: MapPinIcon, titulo: "Quantos contatos a verba compra", texto: "para você saber o que esperar antes de investir." },
];

const porQueGoogle = [
  {
    icone: MousePointerClickIcon,
    titulo: "Você paga pelo clique",
    texto: "Na pesquisa do Google, o anúncio aparecer não custa nada. Você paga quando alguém clica.",
  },
  {
    icone: MapPinIcon,
    titulo: "Você escolhe onde e quando",
    texto: "As cidades em que você atende e os horários em que você responde.",
  },
  {
    icone: FileBarChartIcon,
    titulo: "Você vê quem chamou",
    texto: "Cada toque no WhatsApp é medido, e o resumo do mês mostra o que chegou.",
  },
];

// Do processo de Google Ads da Base (etapas 3 a 8), no que o cliente ganha.
const comeco = [
  {
    titulo: "A conta do Google Ads",
    texto: "Criada no seu nome, ou conferida, se você já tem uma: campanhas antigas pausadas, a verificação do Google feita e a forma de pagamento conferida.",
  },
  {
    titulo: "O seu perfil no Google",
    texto: "Nome, categoria, área atendida, horário, telefone, WhatsApp e fotos conferidos, e o perfil ligado aos anúncios.",
  },
  {
    titulo: "A medição dos contatos",
    texto: "Cada toque no WhatsApp vira um contato contado no Google Ads, testado antes de a campanha ir ao ar, com o aviso de cookies funcionando.",
  },
  {
    titulo: "A campanha",
    texto: "As palavras de quem quer contratar, não de quem só pesquisa; as cidades e os horários em que você atende; e a lista do que não interessa, para a verba não ir embora em clique errado.",
  },
  {
    titulo: "Os anúncios",
    texto: "Até 15 títulos e 4 descrições por grupo, os links extras, as frases de destaque e o botão do WhatsApp no próprio anúncio.",
  },
];

// O que a revisão semanal olha (processo de Google Ads da Base, etapa 9, e o
// painel: termos, negativas, conversões, saldo e mudanças feitas por fora).
const revisao = [
  "O que as pessoas digitaram, e o que cortar",
  "Os contatos que chegaram e de onde vieram",
  "Quanto custou cada contato",
  "Os anúncios que funcionam melhor",
  "O saldo e o ritmo do gasto",
  "Se alguém mexeu na conta por fora",
];

// "Desconto e objeções" (processo comercial da Base): o caminho de cada
// resposta, escrito como resposta a quem tem a dúvida (Lucas, 2026-11-20).
const objecoes = [
  {
    duvida: "“Já tentei e não deu certo.”",
    resposta:
      "Isso é mais comum do que parece, e quase sempre tem um motivo que dá para achar: a página, as palavras escolhidas, a região ou a medição. No diagnóstico, a gente olha o que foi feito e te explica, em palavras simples, o que muda.",
  },
  {
    duvida: "“E se não der resultado?”",
    resposta:
      "Ninguém sério pode prometer resultado, e a gente não promete. O que você tem é a conta acompanhada por um especialista, monitorada 24 horas, e tudo à vista: já no primeiro mês os números chegam no resumo. Os primeiros meses são de ajuste, e você não fica preso, porque é sem fidelidade.",
  },
  {
    duvida: "“Deve ser caro.”",
    resposta:
      "Dá para começar do tamanho do seu bolso: com uma verba menor, numa região menor, ou só com o Google Ads usando o site que você já tem. No diagnóstico você vê o que cada caminho compra antes de decidir.",
  },
  {
    duvida: "“Eu mesmo posso fazer.”",
    resposta:
      "Pode, e tem quem faça bem. Se um dia faltar tempo, ou se você quiser ajuda só numa parte, como medir os contatos que chegam, é só chamar.",
  },
];

// A conta é acompanhada o tempo todo, não só na revisão (Lucas, 2026-11-20): o
// painel lê os números do Google Ads o dia inteiro e avisa quando algo sai do
// normal (anúncio reprovado, gasto parado, saldo acabando, mudança feita por
// fora); a revisão completa é toda semana.
const todoMes = [
  {
    quando: "24 horas por dia",
    titulo: "Conta monitorada",
    texto: "Se algo sai do normal, como um anúncio reprovado, o gasto parado ou o saldo acabando, a gente fica sabendo na hora.",
    icone: <BellRingIcon className="size-4.5" />,
  },
  {
    quando: "Toda semana",
    titulo: "Revisão completa",
    texto: "Um especialista revisa a conta e ajusta: a verba vai para as buscas que trazem contato e sai das que não trazem.",
    icone: <RefreshCwIcon className="size-4.5" />,
  },
  {
    quando: "Todo mês",
    titulo: "O resumo do mês",
    texto: "No WhatsApp e por e-mail: o que chegou e o que fizemos na sua conta.",
    icone: <FileBarChartIcon className="size-4.5" />,
  },
  {
    quando: "A cada 3 meses",
    titulo: "Uma conversa",
    texto: "Sobre o que mudou no seu negócio, para a campanha mudar junto.",
    icone: <CalendarSyncIcon className="size-4.5" />,
  },
];

const paraQuem = [
  "Cada cliente novo vale muito para o seu negócio.",
  "Você responde rápido quem chama.",
  "Você quer começar com a verba certa e um prazo realista.",
  "Você sabe que o anúncio traz o contato, e quem fecha é você.",
];

const naoInclui = [
  "A verba do Google, que você paga direto ao Google",
  "O atendimento de quem chama no seu WhatsApp",
  "Posts para redes sociais",
  "Anúncios no Instagram e no Facebook (Meta Ads)",
];

const perguntas = [
  {
    pergunta: "Quanto custa?",
    resposta:
      "A gestão é um valor por mês, sem taxa de criação. A verba do Google sai do diagnóstico, para a sua região. Te passo tudo na conversa, com o porquê de cada parte, e depois uma proposta completa.",
  },
  { pergunta: "Quem paga a verba do Google?", resposta: "Você, direto ao Google, na sua conta. A verba não passa pela Adsgator." },
  { pergunta: "Tem fidelidade?", resposta: "Não. Cancele quando quiser e volte quando quiser." },
  { pergunta: "A conta é minha?", resposta: "Sim. A conta do Google Ads fica no seu nome, e você tem o acesso a ela." },
  {
    pergunta: "Em quanto tempo começa?",
    resposta: "Em até 3 dias úteis depois que você manda os acessos e o briefing.",
  },
  {
    pergunta: "Preciso ter site?",
    resposta: (
      <>
        Não. A Adsgator faz a sua{" "}
        <Link className="font-medium text-foreground underline underline-offset-4" href="/landing-page">
          landing page
        </Link>
        , ou usamos o seu site, com o que os anúncios precisam funcionando.
      </>
    ),
  },
  { pergunta: "Quem atende os contatos?", resposta: "Você. O anúncio traz a conversa; quem fecha é você." },
];

export default function Page() {
  return (
    <>
      <DadosEstruturados dados={dadosDoServico({ nome: "Gestão de Google Ads", descricao: metadata.description as string, caminho: "/google-ads" })} />
      {/* 1. Topo: o anúncio se montando na página de resultados. */}
      <MotionScope>
        <FundoVivo className="overflow-x-clip">
          <BuscasNoAr />
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-28 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-36">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                Gestão de Google Ads
              </p>
              <h1 className="mt-7 font-heading text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl">
                Apareça para quem está procurando o seu serviço <span className="highlight">agora</span>.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
                Quando alguém na sua cidade digita o que você faz, o seu anúncio aparece, e a conversa começa no seu
                WhatsApp. Com a verba certa para a sua região e a conta acompanhada por um especialista.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={whatsapp} className={botaoMarca}>
                  Quero um diagnóstico grátis
                  <ArrowRightIcon />
                </a>
                <a href="#comeco" className={botaoContorno}>
                  Como começa
                </a>
              </div>
              <p className="mt-8 font-mono text-xs text-muted-foreground">
                No ar em até 3 dias úteis · Sem fidelidade · Tudo no seu nome
              </p>
            </div>
            <AnuncioMontando />
          </div>
        </FundoVivo>
      </MotionScope>

      {/* Por que o Google: quem procura já quer contratar. */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Eyebrow>Por que o Google</Eyebrow>
        <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
          Quem procura no Google <span className="text-muted-foreground">já quer contratar.</span>
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Reveal className="h-full rounded-3xl border bg-card p-8">
            <span className="flex size-11 items-center justify-center rounded-full bg-muted">
              <SmartphoneIcon className="size-5" />
            </span>
            <p className="mt-6 font-mono text-xs text-muted-foreground">Nas redes sociais</p>
            <h3 className="mt-2 font-heading text-2xl leading-tight">O anúncio interrompe quem está rolando o feed.</h3>
            <p className="mt-3 leading-7 text-muted-foreground">
              A pessoa ainda não pensou no seu serviço. Serve para ser lembrado; para ser chamado hoje, ela precisa
              estar precisando.
            </p>
          </Reveal>
          <Reveal delay={120} className="dark section-ink h-full rounded-3xl border bg-background p-8 text-foreground">
            <span className="flex size-11 items-center justify-center rounded-full bg-brand text-brand-foreground">
              <SearchIcon className="size-5" />
            </span>
            <p className="mt-6 font-mono text-xs text-brand">No Google</p>
            <h3 className="mt-2 font-heading text-2xl leading-tight">O anúncio aparece para quem acabou de digitar o seu serviço.</h3>
            <p className="mt-3 leading-7 text-muted-foreground">
              A pessoa já quer resolver e está escolhendo quem chamar. A Adsgator faz você ser essa escolha.
            </p>
          </Reveal>
        </div>
        <ul className="mt-5 grid gap-5 md:grid-cols-3">
          {porQueGoogle.map(({ icone: Icone, titulo: t, texto }, i) => (
            <li key={t}>
              <Reveal delay={i * 100} className="flex h-full gap-4 rounded-3xl border p-6">
                <Icone className="mt-1 size-5 shrink-0" />
                <div>
                  <h3 className="font-heading text-xl leading-tight">{t}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{texto}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Antes de começar, o diagnóstico, com um exemplo. */}
      <section className="border-t">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Antes de começar</Eyebrow>
            <h2 className={cn(titulo, "mt-6")}>
              Primeiro, o diagnóstico. <span className="text-muted-foreground">Grátis, antes de você decidir.</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Antes de falar em verba, a gente olha a sua região. Assim você começa com a verba certa para a sua
              realidade, e não com um número chutado.
            </p>
            <ul className="mt-10 space-y-5">
              {diagnostico.map(({ icone: Icone, titulo: t, texto }) => (
                <li key={t} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/15">
                    <Icone className="size-4.5" />
                  </span>
                  <div>
                    <h3 className="font-heading text-xl leading-tight">{t}</h3>
                    <p className="mt-1 leading-7 text-muted-foreground">{texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <DiagnosticoExemplo />
        </div>
      </section>

      {/* 3. O que fazemos para começar. */}
      <section id="comeco" className="scroll-mt-24 border-t">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 md:grid-cols-[1fr_1.1fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <Eyebrow>Para começar</Eyebrow>
            <h2 className={cn(titulo, "mt-6")}>Tudo pronto em até 3 dias úteis.</h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">
              Contados depois que você manda os acessos e o briefing. Você não precisa mexer em nada: a gente prepara
              cada parte.
            </p>
          </div>
          <ListaQueSeMarca
            itens={comeco}
            final={{
              titulo: "No ar.",
              texto: "Quem procura o seu serviço na sua região já pode encontrar você. Nas primeiras 48 horas, a gente confere se os anúncios foram aprovados e se o gasto começou.",
            }}
          />
        </div>
      </section>

      {/* O anúncio por dentro. */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Eyebrow>O anúncio por dentro</Eyebrow>
          <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
            Cada parte do anúncio <span className="text-muted-foreground">tem um trabalho.</span>
          </h2>
          <div className="mt-14">
            <AnuncioPorDentro />
          </div>
        </div>
      </section>

      {/* 4. Todo mês: a linha do tempo, o que a revisão olha e o resumo. */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Eyebrow>Depois, todo mês</Eyebrow>
          <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
            A conta nunca fica sozinha. <span className="text-muted-foreground">Monitorada 24 horas e acompanhada por um especialista.</span>
          </h2>
          <div className="mt-16">
            <LinhaDoTempo marcos={todoMes} />
          </div>
          <div className="mt-20 grid items-start gap-10 lg:grid-cols-2">
            <div>
              <h3 className="font-heading text-3xl leading-tight">Além do monitoramento, a revisão completa de toda semana olha</h3>
              <ul className="mt-6 divide-y border-y">
                {revisao.map((item) => (
                  <li key={item} className="flex gap-4 py-4 leading-7">
                    <CheckIcon className="mt-1 size-5 shrink-0 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-7 text-muted-foreground">
                E todo mês o resumo chega no seu WhatsApp e no seu e-mail, com o que chegou e o que foi feito na sua
                conta, explicado sem complicação.
              </p>
            </div>
            <ResumoDoMes
              titulo="Resumo do mês · Ampère Elétrica"
              numeros={[
                { rotulo: "Pessoas que viram o anúncio", valor: 4812, fracao: 0.88 },
                { rotulo: "Visitas à página", valor: 386, fracao: 0.56 },
                { rotulo: "Toques no WhatsApp", valor: 41, fracao: 0.3 },
              ]}
              fizemos={[
                "Cortamos buscas de quem procurava curso, não o serviço",
                "Os anúncios passaram a aparecer só no seu horário de atendimento",
                "Testamos um título novo com “atendimento hoje”",
              ]}
            />
          </div>
        </div>
      </section>

      {/* 5. Tudo no seu nome. */}
      <section className="dark section-ink bg-background text-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-24 lg:grid-cols-2">
          <div>
            <Eyebrow>Tudo no seu nome</Eyebrow>
            <h2 className={cn(titulo, "mt-6")}>A conta é sua. A verba vai direto ao Google.</h2>
            <ul className="mt-10 space-y-5 text-lg leading-8">
              {[
                "A conta do Google Ads fica no seu nome, com o seu acesso.",
                "Você paga a verba direto ao Google: ela não passa pela Adsgator.",
                "Sem fidelidade. Se um dia você sair, a conta continua sua, com tudo o que foi feito nela.",
              ].map((item) => (
                <li key={item} className="flex gap-4">
                  <CheckIcon className="mt-1.5 size-5 shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <VerbaDireta />
        </div>
      </section>

      {/* 6. Com a página da Adsgator. */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <Reveal>
          <div className="grid gap-6 rounded-3xl border bg-card p-8 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
                Tem a página feita pela Adsgator? A manutenção vem junto.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                Com o Google Ads e a página da Adsgator, a página fica no ar e cuidada, sem custo a mais. Quem clica no
                anúncio chega numa página que funciona.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link href="/landing-page" className={botaoContorno}>
                Ver a landing page
              </Link>
              <Link href="/manutencao" className="inline-flex items-center justify-center gap-2 font-medium underline-offset-4 hover:underline">
                O que entra na manutenção
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Talvez você esteja pensando: as objeções reais. */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <Eyebrow>Talvez você esteja pensando</Eyebrow>
        <h2 className={cn(titulo, "mt-6 max-w-4xl")}>
          As dúvidas de quem já conversou com a gente. <span className="text-muted-foreground">E as respostas.</span>
        </h2>
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {objecoes.map(({ duvida, resposta }, i) => (
            <li key={duvida}>
              <Reveal delay={(i % 2) * 120} className="h-full rounded-3xl border bg-card p-8">
                <p className="font-heading text-2xl leading-tight sm:text-3xl">{duvida}</p>
                <p className="mt-4 leading-7 text-muted-foreground">{resposta}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* 7 e 8. Para quem é e o que não inclui. */}
      <section className="mx-auto grid max-w-6xl gap-14 px-4 py-24 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Eyebrow>Para quem é</Eyebrow>
          <h2 className={cn(titulo, "mt-6")}>É para você se…</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {paraQuem.map((item, i) => (
              <li key={item}>
                <Reveal delay={i * 100} className="flex h-full gap-4 rounded-3xl border bg-card p-6 leading-7">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
                    <CheckIcon className="size-4" />
                  </span>
                  {item}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:pt-24">
          <h2 className="font-heading text-3xl leading-tight">O que não está incluído</h2>
          <ul className="mt-6 divide-y border-y">
            {naoInclui.map((item) => (
              <li key={item} className="flex gap-4 py-4 leading-7 text-muted-foreground">
                <XIcon className="mt-1 size-5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9. Perguntas e o convite. */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <Eyebrow>Perguntas frequentes</Eyebrow>
        <h2 className={cn(titulo, "mt-6")}>Antes de chamar.</h2>
        <div className="mt-12">
          <Faq itens={perguntas} />
        </div>
      </section>

      <ChamadaFinal
        titulo={
          <>
            Quem procura você já está no Google.
            <br />
            A gente leva até o seu WhatsApp.
          </>
        }
        mensagem={mensagemDaPagina("/google-ads")}
      />
    </>
  );
}

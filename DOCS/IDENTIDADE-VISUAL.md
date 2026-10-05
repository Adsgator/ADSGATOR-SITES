# Identidade visual (mesma base do painel)

Levantado do painel (`../ADSGATOR-PAINEL`) em 2026-10-05. O Lucas aprovou o
visual do painel e quer o site com a mesma linguagem: como a Vercel, cujo
site e painel são da mesma família.

## Referência

- Estilo do dashboard da Vercel: limpo, muito espaço, bordas discretas,
  tipografia forte, pouca cor. O amarelo da marca aparece como destaque, não
  como fundo de tudo.
- Tema escuro e claro. No painel, o escuro é o padrão e o tema do sistema é
  respeitado. Para o site, o padrão é decisão do Lucas (ver o plano).

## Cores

Marca (iguais no claro e no escuro):

| Uso | Cor |
|---|---|
| Amarelo Adsgator (destaque, botões, faixas) | `#FFB100` |
| Verde-escuro (texto sobre o amarelo) | `#1F271B` |

Neutros e estados: tema neutro do shadcn/ui em `oklch`. A fonte da verdade é
`../ADSGATOR-PAINEL/src/app/globals.css` (copiar de lá, junto com as
variáveis `--brand`, `--brand-foreground`, `--success` e `--warning`). No
escuro: fundo quase preto (`oklch(0.145 0 0)`), cartões um pouco mais claros
(`oklch(0.17 0 0)`) e bordas brancas com 10% de opacidade.

Cores do e-mail (para o site conversar com os e-mails que os clientes
recebem; `../ADSGATOR-PAINEL/src/lib/email/layout.ts`):

| Uso | Cor |
|---|---|
| Fundo externo | `#eef0f4` |
| Cartão | `#ffffff` |
| Faixa do título | `#FFB100` |
| Título | `#231f20` |
| Texto | `#3a3a3a` |
| Texto forte | `#111111` |
| Link | `#2969b0` |
| Rodapé (fundo / texto) | `#fafafa` / `#8a8a8a` |
| Bordas | `#ededed` |

## Tipografia

- Geist (texto e títulos) e Geist Mono, pelo `next/font/google`, como no
  painel (`src/app/layout.tsx`).
- Os e-mails usam Helvetica/Arial (fonte de sistema, por compatibilidade).

## Componentes e ícones

- shadcn/ui no estilo `base-nova` (Base UI), cor base `neutral`, raio
  `0.625rem` (ver `components.json` e `globals.css` do painel).
- Ícones: lucide.
- No painel, o botão principal é claro sobre escuro (tema escuro) e escuro
  sobre claro (tema claro); o amarelo aparece em destaques (sidebar, símbolo,
  faixas dos e-mails). Sugestão a confirmar com o Lucas: no site, usar o
  amarelo nas chamadas de ação da marca (ex.: "Fale conosco").

## Logos

No painel, em `public/brand/`:

- `logo-light.svg`: logo completo para fundo claro.
- `logo-dark.svg`: logo completo para fundo escuro.
- `cursor.svg`: símbolo (o cursor do "G"), para onde o logo não cabe.
- Ícone do navegador: `src/app/icon.svg`.

O componente `src/components/brand.tsx` troca o logo claro/escuro pelo tema,
só com CSS. Os arquivos originais (inclusive versões verticais) estão com o
Lucas; pedir quando precisar de outro formato.

No e-mail, o logo do rodapé é um PNG (`/email/logo-rodape.png`, com contorno
branco para continuar legível quando o app escurece o e-mail): o Gmail não
mostra SVG.

## Tom de voz

Português do Brasil, tratando o cliente por "você", direto e cordial, como
nos e-mails do painel (ex.: "Qualquer dúvida, estamos à disposição.").
Sem jargão técnico para o cliente.

# ADSGATOR-SITES: instruções para o Claude Code

Site público da Adsgator em `www.adsgator.com.br` (o domínio sem `www`
redireciona para cá). Hoje é só uma página provisória; o plano do site novo
está em [`DOCS/PLANO-SITE.md`](DOCS/PLANO-SITE.md). As regras gerais de
trabalho estão no CLAUDE.md global do Lucas (valem aqui também).

## Ler antes de qualquer coisa

1. [`DOCS/PLANO-SITE.md`](DOCS/PLANO-SITE.md): fases, decisões e o que já
   foi feito. É a memória do projeto: atualizar ao terminar cada passo.
2. [`DOCS/IDENTIDADE-VISUAL.md`](DOCS/IDENTIDADE-VISUAL.md): a mesma base
   visual do painel (cores, fonte, logos, componentes).

## Este repositório é PÚBLICO

- Qualquer pessoa lê o código e os documentos no GitHub. Nunca entra aqui:
  dados de clientes, e-mails pessoais, senhas, chaves, detalhes internos do
  painel nem nada tirado dos backups além do texto público das páginas.
- Segredos (se um dia houver): só no `.env.local` e na Vercel, como no
  painel.
- Push na `main` publica em produção na hora. Mudança grande (ex.: a troca
  do site provisório pelo novo) vai num branch e é conferida no preview da
  Vercel (protegido pelo login da Vercel) antes de juntar na `main`.
- Os documentos (CLAUDE.md, README, DOCS/) ficam fora do site publicado pelo
  `.vercelignore`.

## Endereços que não podem quebrar

- `/email/banner-topo.png` e `/email/logo-rodape.png`: estão em todos os
  e-mails já enviados pelo painel. Nunca renomear, mover nem apagar. Se o
  site virar Next.js, ficam em `public/email/` (mesmo endereço) e isso é
  conferido no ar.
- `/termos`, `/privacidade` e `/ajuda` em `adsgator.com.br`: estão no rodapé
  de todos os e-mails (configuráveis no painel, mas os já enviados não
  mudam). Hoje dão 404.
- O artigo de ajuda "Como adicionar saldo no Google Ads", linkado pelos
  e-mails de saldo no endereço antigo do WordPress (detalhes no plano).
- Endereços antigos do WordPress que tinham visitas: levantados na Fase 0 e
  redirecionados para as páginas novas.

## Projetos relacionados

- Painel (`../ADSGATOR-PAINEL`, repositório privado): de onde vem a base
  visual e o jeito de trabalhar. Código copiado de lá é copiado, não
  importado (dois projetos simples não justificam pacote compartilhado);
  anotar no plano de onde veio. O que só a agência usa (interno) é feito
  lá, não aqui; o checkout de contratação, que o cliente usa, é daqui
  (plano, seção 1).
- Backups do WordPress antigo: só leitura, numa pasta temporária fora deste
  repositório (ver Fase 0 no plano).

# ADSGATOR-SITES

Projeto que hospeda os sites da agência Adsgator na Vercel.

No momento o repositório contém apenas uma página estática de placeholder,
publicada para permitir o apontamento do domínio na Vercel. O site novo
(página inicial, Termos, Privacidade, Central de Ajuda e o checkout de
contratação) está planejado em [`DOCS/PLANO-SITE.md`](DOCS/PLANO-SITE.md),
com a identidade visual em
[`DOCS/IDENTIDADE-VISUAL.md`](DOCS/IDENTIDADE-VISUAL.md).

## Stack atual

Site estático — sem etapa de build. A Vercel serve o `index.html` da raiz
diretamente.

## Deploy

Deploy automático pela Vercel a cada push na branch `main`.

## Imagens dos e-mails

A pasta `email/` guarda as imagens usadas nos e-mails enviados pelo painel
(painel.adsgator.com.br), publicadas em `https://www.adsgator.com.br/email/`.
Os e-mails já enviados apontam para esses endereços: não renomear, mover ou
apagar esses arquivos, mesmo quando a estrutura do site mudar.

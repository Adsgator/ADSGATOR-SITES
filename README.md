# ADSGATOR-SITES

Site público da agência Adsgator (`www.adsgator.com.br`), publicado na
Vercel. O plano, as fases e as decisões estão em
[`DOCS/PLANO-SITE.md`](DOCS/PLANO-SITE.md); a identidade visual, em
[`DOCS/IDENTIDADE-VISUAL.md`](DOCS/IDENTIDADE-VISUAL.md).

## Stack

Next.js 16 (App Router, páginas estáticas), React 19, Tailwind 4 e
shadcn/ui (estilo `base-nova`), com a mesma base visual do painel
(`ADSGATOR-PAINEL`, de onde foram copiados o tema, o logo e os componentes).
Os textos longos (Termos, Privacidade) ficam em `src/content/*.mdx`; os dados
de contato, em `src/config/site.ts`.

## Rodar no computador

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # o mesmo build que a Vercel roda
```

## Testes

`tests/site.mjs` usa o Chrome instalado (`playwright-core`) e confere: as
imagens dos e-mails (mesmo conteúdo, com e sem `www`), os redirecionamentos
dos endereços antigos do WordPress, os cabeçalhos de segurança, `robots.txt`,
`sitemap.xml`, a imagem de compartilhamento e, com cliques, cabeçalho,
rodapé, links dos e-mails, troca de tema, sumário dos Termos, página 404 e
tela de celular. Também falha se aparecer erro no console e confere o que a
Política de Privacidade promete: nenhum cookie, só a preferência de tema
guardada no navegador e nada carregado de fora do site além da Adobe Fonts
(a Servus Slab, fonte da marca, que a licença só permite servir pela Adobe).
Se o site passar a medir visitas, a Privacidade e esse teste mudam juntos. As imagens das telas
ficam em `tests/.saida/` (fora do Git).

Termos e Privacidade só vão para a `main` aprovados: o teste falha enquanto a
página tiver o aviso de rascunho, algum trecho destacado a confirmar (`<mark>`
nos arquivos de `src/content/`) ou estiver sem a data da última atualização.

```bash
node tests/site.mjs                       # contra o npm run dev (BASE padrão)
BASE=https://www.adsgator.com.br SEM_WWW=https://adsgator.com.br node tests/site.mjs
```

## Publicar

- Push na `main` publica em produção na hora (deploy automático da Vercel).
- Mudança grande vai num branch: a Vercel cria um preview (protegido pelo
  login da Vercel), conferido antes de juntar na `main`.
- O `vercel.json` diz à Vercel que o projeto é Next.js (`framework`), sem
  depender da configuração do painel da Vercel.
- Os documentos (CLAUDE.md, README, DOCS/) ficam fora do deploy pelo
  `.vercelignore`.

## Imagens dos e-mails

A pasta `public/email/` guarda as imagens usadas nos e-mails enviados pelo
painel (painel.adsgator.com.br), publicadas em
`https://www.adsgator.com.br/email/`. Os e-mails já enviados apontam para
esses endereços: não renomear, mover ou apagar esses arquivos. Os testes
conferem que elas respondem igual a antes.

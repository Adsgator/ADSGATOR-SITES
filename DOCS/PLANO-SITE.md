# PLANO: site público da Adsgator (www.adsgator.com.br)

> REGRA PARA O CLAUDE CODE: não deduzir nem assumir nada que não esteja
> escrito aqui. Em caso de dúvida, PERGUNTAR ao Lucas antes de agir. Cada
> fase só é construída depois de aprovada. Ao terminar cada passo, registrar
> aqui o que foi feito e o que foi verificado (seção 7).
>
> Repositório PÚBLICO: este plano não leva dados pessoais, de clientes nem
> detalhes internos. O que é só do computador do Lucas fica em
> `DOCS/LOCAL.md` (fora do Git).

## 1. Contexto (2026-10-05)

- O Lucas quer o site da agência com página inicial, Termos de Serviço,
  Política de Privacidade e Central de Ajuda, com o mesmo visual e o mesmo
  jeito de trabalhar do painel (painel.adsgator.com.br, projeto separado e
  privado, concluído em 2026-09-26).
- Este repositório já publica www.adsgator.com.br na Vercel (página
  provisória, com `noindex`) e hospeda as imagens dos e-mails (`/email/`). O
  domínio já aponta para cá: o site novo não precisa de mudança de DNS.
- O WordPress antigo foi desativado; o conteúdo dele existe só nos backups
  (Fase 0).

## 2. Fatos conferidos em 2026-10-05

- `https://www.adsgator.com.br/termos` responde 404. O rodapé de todos os
  e-mails enviados pelo painel aponta para `adsgator.com.br/termos`,
  `/privacidade` e `/ajuda`.
- Os e-mails de saldo do Google Ads linkam o artigo "Como adicionar saldo no
  Google Ads" na central de ajuda do WordPress antigo
  (`ajuda.adsgator.com.br/ajuda/como-adicionar-saldo-no-google-ads/`),
  quebrado desde a desativação.
- Projeto sem build: a Vercel publica os arquivos do repositório
  (`vercel.json` com `cleanUrls`). Sem `.vercelignore`, todo arquivo
  versionado é publicado (documentação da Vercel, "Exclude Files from
  Deployments"); por isso os documentos estão no `.vercelignore`. O README
  já respondia 404 no ar antes disso (motivo não conferido).
- Backups do WordPress: 7 arquivos compactados (zip e tar.gz) de 5 sites: o
  site principal (2 arquivos), a central de ajuda (1) e outros 3 sites
  antigos: cliente (1), login (2 partes) e formulários (1). Caminhos em
  `DOCS/LOCAL.md`. Os backups
  incluem bancos de dados com usuários e, provavelmente, dados de
  formulários e clientes: tratar como confidenciais.

## 3. Endereços que não podem quebrar

| Endereço | Quem usa | O que fazer |
|---|---|---|
| `/email/banner-topo.png`, `/email/logo-rodape.png` | Todos os e-mails já enviados | Nunca mudar. Em Next.js, ficam em `public/email/`; conferir no ar |
| `adsgator.com.br/termos` | Rodapé de todos os e-mails | Página Termos (Fase 1) |
| `adsgator.com.br/privacidade` | Rodapé de todos os e-mails | Página Privacidade (Fase 1) |
| `adsgator.com.br/ajuda` | Rodapé de todos os e-mails | Central de Ajuda (Fase 2) |
| `ajuda.adsgator.com.br/ajuda/como-adicionar-saldo-no-google-ads/` | 2 templates de saldo do painel e os e-mails já enviados | Artigo na central nova + redirecionamento do endereço antigo (Fase 2) |
| Endereços antigos do WordPress | Google e links externos | Levantar na Fase 0; redirecionar (301) para as páginas novas |

- Os links dos e-mails usam o domínio sem `www`: conferir que o
  redirecionamento para `www` mantém o caminho (`/termos` →
  `www.adsgator.com.br/termos`).
- Ligar um subdomínio (ex.: `ajuda.`) na Vercel mexe na configuração do
  domínio: só com autorização do Lucas, mostrando antes o que será feito.

## 4. Fases

### Fase 0: inventário do WordPress (PRÓXIMA)

**Objetivo:** saber exatamente o que havia, para o Lucas escolher o que
entra no site novo.

**Passos**
1. Descompactar cada backup numa pasta temporária fora de qualquer
   repositório (ex.: a pasta de rascunho da sessão do Claude Code).
2. Achar o banco de cada site (arquivo `.sql` dentro do backup) e listar,
   sem copiar dados pessoais: páginas e posts publicados (título, endereço,
   data), artigos da central de ajuda, menus e as imagens usadas por eles.
3. Ler os textos dos Termos, da Privacidade, da página inicial e dos artigos
   da ajuda.
4. Registrar aqui uma tabela: conteúdo antigo → proposta (entra como está,
   entra revisado ou sai) e a lista de endereços antigos para redirecionar.
   Textos longos aprovados viram arquivos de conteúdo na Fase 1, não ficam
   neste plano.
5. Apagar as cópias descompactadas no fim. Nunca copiar para o repositório
   banco, usuários, formulários ou dados de clientes.

**Critério de pronto:** inventário aprovado pelo Lucas; nenhuma cópia dos
backups fora do lugar original.

**Perguntar ao Lucas nesta fase:** o que eram os sites cliente, login e
formulários, e se algo deles entra no site novo.

### Fase 1: base do site, Termos e Privacidade (prioridade)

Prioridade porque os links do rodapé de todos os e-mails dão 404 hoje.

- Trocar a página provisória por um projeto Next.js com a mesma stack e o
  mesmo visual do painel (versões conferidas no npm na hora), num branch,
  conferido no preview da Vercel antes de ir para a `main`.
- Cabeçalho e rodapé do site, tema claro e escuro, páginas estáticas.
- Indexável no Google (é o contrário do painel): sitemap, robots, títulos e
  descrições, imagem de compartilhamento. Cabeçalhos de segurança como os do
  painel, sem o `noindex`.
- `/termos` e `/privacidade` com os textos da Fase 0 revisados. Conteúdo
  legal: o Lucas valida, de preferência com um advogado; o Claude não
  inventa cláusula. A Privacidade precisa refletir o que a Adsgator usa hoje
  (seção 5).
- `/email/*` continua no mesmo endereço.

**Critério de pronto (em produção):** `/termos`, `/privacidade` e os links
do rodapé dos e-mails abrem a página certa, inclusive pelo endereço sem
`www`; `/email/*` responde igual a antes; testes com cliques reais no Chrome.

### Fase 2: Central de Ajuda

- Artigos da ajuda antiga revisados, começando pelo de saldo. `/ajuda` com a
  lista (e busca, se fizer sentido) e `/ajuda/<artigo>`.
- Endereço antigo do artigo de saldo redirecionando para o novo.
- Atualizar os 2 templates de saldo no editor do painel para o endereço
  novo (os e-mails já enviados continuam no antigo, por isso o
  redirecionamento).

### Fase 3: página inicial

- Conteúdo com o Lucas: serviços, como funciona, planos e preços (se for
  mostrar), contato, provas sociais.
- Medição (Google Analytics, Google Ads) e aviso de cookies, se o Lucas
  quiser medir o site.

## 5. Pontos para a Política de Privacidade

Levantados no painel em 2026-10-05. Conferir com o Lucas e completar com o
que o site usar.

- Os e-mails para clientes são enviados pela Brevo, que registra entrega,
  abertura e clique (imagem de rastreio e links) e inclui um link de
  descadastro.
- O cadastro de clientes (nome, empresa, e-mails, telefone, observações) e o
  histórico dos e-mails enviados ficam no banco do painel (Supabase), com
  acesso restrito.
- Site e painel hospedados na Vercel. E-mails recebidos no domínio são
  encaminhados pela ImprovMX para o Gmail.
- Cobranças por links de pagamento do Asaas; atendimento por WhatsApp e
  e-mail.
- Relatórios do Google Analytics e do Google Ads dos clientes são enviados em
  PDF.
- Para o advogado avaliar: onde ficam os dados de cada serviço (transferência
  internacional) e por quanto tempo são guardados.

## 6. Decisões em aberto (perguntar na fase correspondente)

1. Tema padrão do site: escuro (como o painel), claro ou o do sistema.
2. Sites antigos cliente, login e formulários: o que eram e se algo entra.
3. Medição no site e aviso de cookies.
4. Conteúdo da página inicial.
5. (Fase 2) Subdomínio `ajuda.`: só redirecionar ou manter a central nele.

## 7. Andamento

- 2026-10-05: kit de partida criado a partir da sessão do painel (este
  plano, `CLAUDE.md`, `DOCS/IDENTIDADE-VISUAL.md`, `.vercelignore` e
  `DOCS/LOCAL.md` fora do Git). Próximo: Fase 0.

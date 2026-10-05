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
- Público x interno (Lucas, 2026-10-05): este site fica com o que é
  público, inclusive o checkout novo que substitui o do WooCommerce
  (Fase 4). O que é interno (o que o site login antigo fazia) vai para o
  painel, num plano próprio de lá, que só começa depois que o site público
  estiver pronto. Critério aplicado: o que o cliente ou o público usa fica
  aqui; o que só a agência usa vai para o painel, que exige login. Por ele,
  os briefings ficam aqui (quem preenche é o cliente).
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
- O que eram os sites antigos (explicado pelo Lucas em 2026-10-05):
  - Principal: o site institucional (adsgator.com.br).
  - Ajuda: a central de ajuda, com os artigos.
  - Cliente: loja WooCommerce usada para contratar. Os planos eram
    cadastrados lá, e o cliente fazia o cadastro e o pagamento pelo checkout
    ligado ao Asaas.
  - Login: painel interno antigo de acompanhamento dos clientes da agência.
    Não era público: vai para o painel (seção 1), não para o site.
  - Formulários: páginas com os formulários de briefing de novos projetos
    (nova LP, novas campanhas de Google Ads), incorporados do respondi.app.

## 3. Endereços que não podem quebrar

| Endereço | Quem usa | O que fazer |
|---|---|---|
| `/email/banner-topo.png`, `/email/logo-rodape.png` | Todos os e-mails já enviados | Nunca mudar. Em Next.js, ficam em `public/email/`; conferir no ar |
| `adsgator.com.br/termos` | Rodapé de todos os e-mails | Página Termos (Fase 1) |
| `adsgator.com.br/privacidade` | Rodapé de todos os e-mails | Página Privacidade (Fase 1) |
| `adsgator.com.br/ajuda` | Rodapé de todos os e-mails | Central de Ajuda (Fase 2) |
| `ajuda.adsgator.com.br/ajuda/como-adicionar-saldo-no-google-ads/` | 2 templates de saldo do painel e os e-mails já enviados | Artigo na central nova + redirecionamento do endereço antigo (Fase 2) |
| Endereços antigos do WordPress | Google e links externos | Levantar na Fase 0; redirecionar (301) para as páginas novas |
| Endereços dos sites cliente e formulários | Links de contratação e de briefing já enviados a clientes | Levantar na Fase 0; redirecionar para o checkout e os briefings novos (Fase 4) |

- Os links dos e-mails usam o domínio sem `www`. Conferido em 2026-10-05: o
  redirecionamento mantém o caminho (`adsgator.com.br/termos` → 308 →
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
   sem copiar dados pessoais, só o que interessa a cada um:
   - Principal e Ajuda: páginas e posts publicados (título, endereço,
     data), artigos, menus e as imagens usadas por eles.
   - Cliente: só os planos (nome, descrição, preço da época) e os textos das
     páginas, inclusive o aceite dos Termos no checkout, se houver. NUNCA
     pedidos, cadastros de clientes ou documentos.
   - Formulários: só os links ou códigos de incorporação dos formulários do
     respondi.app e os textos das páginas (as respostas devem estar no
     respondi, não no WordPress: conferir sem abrir respostas).
   - Login: não abrir. Não entra no site (o plano do painel decide se
     precisa dele).
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

**Levar ao Lucas no fim desta fase:** o inventário com a proposta do que
entra, e os planos e formulários encontrados (base para as decisões 2 e 3).

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

### Fase 4: contratação (checkout novo) e briefings

O checkout novo substitui o do WooCommerce: o cliente escolhe o plano, faz
o cadastro, aceita os Termos e paga, e o cadastro e o pagamento vão para o
Asaas, como antes. Pode vir antes da Fase 3, se o Lucas preferir.

- Detalhar esta fase com o Lucas a partir do inventário da Fase 0 (planos e
  textos do checkout antigo) e das decisões 2 e 3. As formas de integrar
  com o Asaas são pesquisadas na documentação dele na hora, não de memória.
- Se usar a API do Asaas, essa parte precisa de código no servidor: a chave
  fica só no servidor (variável secreta na Vercel), nunca no navegador nem
  no Git, e toda checagem da tela é repetida no servidor.
- Testes de pagamento no ambiente de testes do Asaas, se houver (conferir);
  pagamento real só com autorização do Lucas, a cada um.
- Links antigos de contratação e de briefing levam aos novos (seção 3).
- Termos e Privacidade atualizados com o que o checkout coleta e com o
  registro do aceite.

**Critério de pronto (em produção):** fechado quando a fase for detalhada;
no mínimo, uma contratação de teste completa (plano, cadastro, aceite dos
Termos e pagamento) chega ao Asaas e os links antigos levam ao checkout
novo, com testes de cliques reais no Chrome.

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
- Contratação: o cadastro e o pagamento de novos clientes iam para o Asaas
  pelo checkout do WooCommerce (já desativado). O checkout novo (Fase 4)
  faz o mesmo; quando ele entrar, a Privacidade ganha os dados que ele
  coleta e onde fica o registro do aceite dos Termos.
- Briefings de novos projetos: formulários do respondi.app (o que o cliente
  envia fica no respondi).
- Relatórios do Google Analytics e do Google Ads dos clientes são enviados em
  PDF.
- Para o advogado avaliar: onde ficam os dados de cada serviço (transferência
  internacional) e por quanto tempo são guardados.

## 6. Decisões em aberto (perguntar na fase correspondente)

1. Tema padrão do site: escuro (como o painel), claro ou o do sistema.
2. (Fase 4) Checkout novo (o Lucas já decidiu que haverá um, no lugar do
   WooCommerce): como integrar com o Asaas, onde ele fica (caminho no site
   ou o subdomínio antigo, que mexe na configuração do domínio), de onde
   vêm os planos, como registrar o aceite dos Termos e se o cliente novo
   entra sozinho no painel. Recomendado: o aceite no próprio checkout, já
   que o e-mail de boas-vindas do painel diz que o cliente aceitou os
   Termos na contratação; o texto dos Termos (Fase 1) já deve prever isso.
3. (Fase 4) Briefings: páginas no site com os formulários do respondi.app
   incorporados ou só links para o respondi. Se incorporar, a política de
   segurança do site (CSP) precisa liberar o respondi.
4. Medição no site e aviso de cookies.
5. Conteúdo da página inicial.
6. (Fase 2) Subdomínio `ajuda.`: só redirecionar ou manter a central nele.

## 7. Andamento

- 2026-10-05: kit de partida criado a partir da sessão do painel (este
  plano, `CLAUDE.md`, `DOCS/IDENTIDADE-VISUAL.md`, `.vercelignore` e
  `DOCS/LOCAL.md` fora do Git). Conferido no ar depois do deploy: os
  documentos respondem 404 (não são publicados), a página provisória e
  `/email/*` respondem 200 como antes.
- 2026-10-05: o Lucas explicou os sites antigos (seção 2). Fase 0 ajustada
  (o que tirar de cada backup; o login não é aberto) e decisões 2 e 3
  novas (contratação e briefings). Próximo: Fase 0.
- 2026-10-05: o Lucas separou o público do interno (seção 1). O checkout
  novo e os briefings viraram a Fase 4; o que era interno vai para o
  painel, num plano pendente de lá (só começa depois do site público).
  Próximo: Fase 0.

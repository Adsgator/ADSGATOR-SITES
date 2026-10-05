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
  aqui; o que só a agência usa vai para o painel, que exige login. Os
  briefings ficam aqui: quem responde é o cliente (confirmado pelo Lucas).
- Este repositório já publica www.adsgator.com.br na Vercel (página
  provisória, com `noindex`) e hospeda as imagens dos e-mails (`/email/`). O
  domínio já aponta para cá: o site novo não precisa de mudança de DNS.
- O WordPress antigo foi desativado; o conteúdo dele existe só nos backups
  (Fase 0).
- Direção da Adsgator (Lucas, 2026-10-05): sem prospecção ativa. O site
  atende os clientes atuais e quem chegar sozinho (busca ou indicação), e a
  contratação não depende de conversa: o cliente entende o serviço, aceita
  as regras e paga pelo site, e a entrada dele (briefing, configuração das
  contas) também é por autoatendimento. Por isso o checkout novo (Fase 4)
  continua. O site deve pedir o mínimo de manutenção: páginas simples, nada
  que precise de atualização frequente.
- O que essa direção pede do site (proposta; cada item é confirmado com o
  Lucas na fase correspondente):
  - Cada plano explica em linguagem simples o que inclui, o que não inclui,
    para quem é e para quem não é (ex.: verba mínima recomendada), como
    funciona depois de contratar, prazos, canais e horário de atendimento.
  - Expectativa alinhada por escrito antes de pagar: sem garantia de
    resultado, a verba do Google Ads é paga pelo cliente direto ao Google e o
    resultado do negócio é do cliente (os Termos antigos já dizem isso em
    4.1, 11.5, 12.3 e 12.4). No checkout, aceite explícito disso junto com os
    Termos, com texto validado pelo Lucas e pelo advogado.
  - Depois do pagamento, tudo encadeado sem conversa: e-mail de boas-vindas
    (painel), briefing (`forms.`), artigos de configuração da ajuda (criar
    conta no Google Ads, dar acesso, Google Meu Negócio, adicionar saldo) e
    relatório mensal.
  - Regra de comunicação nos Termos (canais, horário e prazo de resposta),
    no lugar da 8.1 antiga ("não há uma frequência definida").
- Para o plano do painel (Lucas, 2026-10-05): levar para lá as mensagens
  que o Lucas usa no atendimento (respostas às dúvidas principais) e no
  onboarding. O que servir para qualquer cliente também pode virar pergunta
  frequente e artigo da ajuda aqui (Fases 2 e 3), e as de onboarding podem
  guiar a sequência depois do pagamento (Fase 4): menos mensagem manual.

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
- Subdomínios hoje (conferido em 2026-10-05 com `nslookup` e `curl`):
  qualquer `*.adsgator.com.br` resolve para a Vercel (DNS curinga: um nome
  inventado também resolve), mas nenhum projeto atende `forms.`, `ajuda.`,
  `cliente.` nem `login.`. Em `https` a conexão segura falha; em `http` a
  Vercel responde 404 `DEPLOYMENT_NOT_FOUND`. Ou seja: os links de briefing
  já enviados a clientes e o artigo de saldo dos e-mails estão quebrados
  hoje (decisão 10).
- Hospedagem (conferido em 2026-10-05 nas páginas oficiais):
  - Vercel: o plano Hobby é só para uso pessoal e não comercial; uso
    comercial exige Pro ou Enterprise. Entre os exemplos de uso comercial
    estão "anunciar a venda de um produto ou serviço" e "receber pagamento
    para criar, atualizar ou hospedar o site" (Fair Use Guidelines,
    atualizada em 2026-09-14). A Vercel pode pausar a conta ou o deploy que
    violar as diretrizes (artigo de ajuda "Why has my account or deployment
    been paused?", atualizado em 2026-10-02).
  - Vercel Pro: US$ 20 por mês de taxa da plataforma, com 1 vaga de quem
    publica e US$ 20 de crédito de uso; inclui 1 TB de tráfego e 1 milhão
    de requisições de CDN por mês; vaga extra de quem publica a US$ 20,
    vagas só de leitura grátis; preços em dólar, sem impostos (página do
    plano Pro, atualizada em 2026-09-15). As páginas não citam cobrança por
    projeto.
  - Cloudflare Pages, plano grátis: requisições a arquivos estáticos grátis
    e ilimitadas, 500 builds por mês, até 20.000 arquivos por site e 100
    domínios próprios (documentação, atualizada em 2026-09-05). Não achei
    restrição a uso comercial nas páginas oficiais; a afirmação explícita
    de que é permitido veio de sites de terceiros e da comunidade deles.
  - Netlify: plano grátis com 300 créditos por mês (20 créditos por GB de
    tráfego, 15 por deploy); a página de preços não cita restrição
    comercial.
  - GitHub Pages não permite site de negócio (termos do GitHub).
- As landing pages novas dos clientes são Astro com `output: 'static'` (só
  arquivos, sem código de servidor): funcionam em qualquer hospedagem de
  arquivos estáticos. Duas usam o Analytics da Vercel (opcional).
- No painel, `painel.adsgator.com.br` foi ligado na Vercel sem criar
  registro DNS: o DNS curinga já cobre (plano do painel, 2026-09).

## 3. Endereços que não podem quebrar

| Endereço | Quem usa | O que fazer |
|---|---|---|
| `/email/banner-topo.png`, `/email/logo-rodape.png` | Todos os e-mails já enviados | Nunca mudar. Em Next.js, ficam em `public/email/`; conferir no ar |
| `adsgator.com.br/termos` | Rodapé de todos os e-mails | Página Termos (Fase 1) |
| `adsgator.com.br/privacidade` | Rodapé de todos os e-mails | Página Privacidade (Fase 1) |
| `adsgator.com.br/ajuda` | Rodapé de todos os e-mails | Central de Ajuda (Fase 2) |
| `ajuda.adsgator.com.br/ajuda/como-adicionar-saldo-no-google-ads/` | 2 templates de saldo do painel e os e-mails já enviados | Artigo na central nova + redirecionamento do endereço antigo (Fase 2) |
| Endereços antigos do WordPress | Google e links externos | Lista na Fase 0 (resultado); redirecionar (301) para as páginas novas |
| `forms.adsgator.com.br` | Links de briefing já enviados a clientes | Continua sendo o endereço dos briefings (Lucas, 2026-10-05); os 7 briefings levantados na Fase 0 mantêm o endereço: redirecionamentos para o respondi logo depois da Fase 1 (decisão 10), páginas na Fase 4 |

- Os links dos e-mails usam o domínio sem `www`. Conferido em 2026-10-05: o
  redirecionamento mantém o caminho (`adsgator.com.br/termos` → 308 →
  `www.adsgator.com.br/termos`).
- Ligar um subdomínio (ex.: `forms.`, `checkout.`, `ajuda.`) na Vercel mexe
  na configuração do domínio: só com autorização do Lucas, mostrando antes
  o que será feito.
- `cliente.adsgator.com.br` (contratação antiga): o Lucas liberou trocar
  (2026-10-05). O checkout novo fica em `checkout.adsgator.com.br`, só para
  novas contratações; redirecionar o endereço antigo para ele é opcional
  (decisão 2).
- Endereços dos sites antigos conferidos na Fase 0 (gravados em cada
  banco): `adsgator.com.br`, `ajuda.`, `cliente.` e
  `forms.adsgator.com.br`. O do login não foi aberto.

## 4. Fases

### Fase 0: inventário do WordPress (APROVADA PELO LUCAS EM 2026-10-05)

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

#### Resultado (2026-10-05)

**Como foi feito.** Só os bancos foram extraídos (nada de temas, plugins ou
arquivos), para a pasta de rascunho da sessão, e lidos com um leitor de SQL
em Node, sem instalar banco. Foram lidos só os tipos de conteúdo públicos
(páginas, posts, artigos, planos, menus, checkout) e configurações com nome
conhecido (endereço do site, página inicial). Pedidos, usuários, cadastros,
logs de e-mail, snippets de código e envios de formulário não foram lidos;
o login não foi aberto. Os bancos extraídos foram apagados no mesmo dia.
Nomes de clientes, códigos dos formulários e preços estão em
`DOCS/LOCAL.md`, não aqui.

**Conteúdo antigo → proposta**

| Site | Conteúdo antigo | Proposta |
|---|---|---|
| Principal | Termos de serviço (`/termos-de-servico/`, texto de 20/10/2025) | Entra revisado em `/termos` (Fase 1). Achados: a 5.1 diz "sem fidelidade", mas a 6.3, 9.2, 11.2 e 11.4 falam em fidelidade e multa de 30%; cita `cliente.adsgator.com.br` como local de contratação (12.1, 15 e "Últimas considerações"); repete a Privacidade na seção 16; cita "Dashboard Ads" e e-mails profissionais (confirmar se ainda existem) |
| Principal | Políticas de privacidade (`/politicas-de-privacidade/`) | Reescrita em `/privacidade` (Fase 1): o texto antigo é genérico (newsletter, cookies) e não cita nenhum serviço usado hoje (seção 5) |
| Principal | Políticas de reembolso (`/politicas-de-reembolso/`) | Repete os Termos 11.3 a 11.5 e contradiz a 5.1 (fidelidade de 6 meses, multa de 30%, cita uma cláusula 5.3 que não existe mais). Proposta: vira seção dos Termos (decisão 7) |
| Principal | Landing Page Pro (`/landing-page-pro/`, era a página inicial) | Base da Fase 3 (oferta de landing page, recursos, FAQ). O preço diverge entre as páginas (LOCAL.md) |
| Principal | Google Ads (`/google-ads/`, privada desde 2026-08-17) | Base da Fase 3 (planos Ads Start, Boost e Power; FAQ de verba) |
| Principal | Portfólios (`/portfolios/`) e 6 páginas de portfólio, uma por cliente | Fase 3 (decisão 8). `/portfolios/` era usado em prospecção: o plugin Redirection registrou 445 acessos |
| Principal | Depoimentos com nome e foto (páginas Landing Page Pro e Google Ads) | Só entram se forem de clientes reais e autorizados (decisão 8) |
| Principal | Árvore de links (`/links/`, privada) | Decisão 9 |
| Principal | Home (`/home/`, privada), Erro 404, 1 post de teste, 2 formulários de demonstração (Fluent Forms) | Saem |
| Ajuda | 4 artigos: criar conta no Google Ads, dar acesso ao Google Ads, adicionar saldo, dar acesso ao Google Meu Negócio | Entram revisados (Fase 2): conferir as capturas de tela (podem mostrar dados de alguma conta) e se as telas do Google mudaram |
| Ajuda | 5 artigos sem texto (só uma imagem "em manutenção"): 3 de "Minha conta" e 2 de e-mail (Gmail e Outlook) | Saem |
| Ajuda | Página inicial, 3 categorias, post "Hello world!" | Saem; `/ajuda` lista os artigos |
| Cliente | 8 planos (abaixo) | Base da decisão 2 (Fase 4) |
| Cliente | Checkout do CartFlows ("Finalizar contratação") e página de confirmação | Base da Fase 4 (abaixo) |
| Cliente | Minha conta, Painel de controle, página "teste" | Saem (área do cliente antiga; interno fica com o painel) |
| Formulários | 7 páginas de briefing com formulário do respondi.app | Fase 4 (decisão 3); mantêm o endereço |
| Formulários | "Notificações" (formulário padrão do Elementor, sem ação de envio), formulário do Contact Form 7 sem página, "Forms Home" e 404 ("Nenhum formulário disponível") | Saem |

As imagens usadas pelas páginas estão nos backups (conferido: 83 de 83 no
principal, 34 de 34 na ajuda).

**Endereços antigos para redirecionar (proposta, 301)**

- `adsgator.com.br`: `/termos-de-servico/` → `/termos`;
  `/politicas-de-privacidade/` → `/privacidade`; `/politicas-de-reembolso/`
  → `/termos` (decisão 7); `/landing-page-pro/`, `/google-ads/`,
  `/portfolios/`, `/portfolio/` (linkado no rodapé antigo), as 6 páginas de
  portfólio e `/links/` → `/` até a Fase 3 definir as páginas (decisões 8 e
  9); `/home/`, `/erro-404/`, `/2023/04/06/cobertura-em-todo-o-brasil/`,
  `/author/lucas/` e `/category/uncategorized/` → `/`. Os endereços antigos
  terminam com `/`: o redirecionamento precisa aceitar com e sem a barra.
- `ajuda.adsgator.com.br` (decisões 6 e 10): `/ajuda/<artigo>/` dos 4 artigos
  que entram → `/ajuda/<artigo>`; os 5 que saem, `/`, `/home/` e
  `/ajuda-categorias/*` → `/ajuda`.
- `cliente.adsgator.com.br` (decisão 2): `/`, `/minha-conta/`,
  `/step/finalizar-contratacao/` (com `?add-to-cart=<plano>`, usado nos
  botões "Contratar") e `/produto/*` → `checkout.` ou `/`.
- `forms.adsgator.com.br` (Fase 4): os 7 briefings mantêm o endereço; `/` e
  o 404 antigos não tinham conteúdo.
- Sem dados de visitas: os backups não guardam visitas (o cache do LiteSpeed
  lista endereços pedidos, quase todos por robôs procurando falhas). Se o
  Lucas quiser priorizar por tráfego, o Google Search Console mostra as
  páginas com cliques (opcional).

**Planos (base da decisão 2).** 8 produtos no WooCommerce: Ads Start, Ads
Boost e Ads Power (gestão de Google Ads com limite de verba gerenciada);
Landing Page Pro; Site Pro (até 5 páginas); Landing Page Pro + Ads Start;
Landing Page Max + Ads Start (2026-04); "Somente cadastro" (R$ 0, cadastro
sem pagamento). Só a Landing Page Pro e o "Somente cadastro" estavam
publicados; os outros eram privados (link direto). Nenhum tem período de
assinatura gravado no WooCommerce: confirmar como a mensalidade era cobrada
(provavelmente recorrência no Asaas). Preços e divergência da Landing Page
Pro em `DOCS/LOCAL.md`.

**Checkout antigo (base da Fase 4).** Campos: nome, sobrenome, CNPJ
(opcional), nome da empresa, WhatsApp, endereço (CEP, número, rua, bairro,
complemento, cidade, estado, país), e-mail e observações. Pagamento pelo
plugin do Asaas para WooCommerce. Aceite dos Termos sem caixa de marcar:
só a frase "Ao clicar em 'Contratar', você concorda com os termos de
serviço e confirma a contratação do plano escolhido", com links para
Termos, Privacidade e Reembolso no rodapé.

**Briefings (base da decisão 3).** 7 páginas, cada uma com um formulário do
respondi.app incorporado pelo `embed.js` do respondi: Briefing Pro, Estilo e
Sensações, Google Ads, Landing Page Pro e 3 de clientes específicos
(2026-04). Endereços e códigos em `DOCS/LOCAL.md`. Os briefings não gravam
resposta no WordPress: a única tabela de envios com linhas no banco é a do
Elementor, com 2 envios de um formulário do Elementor (a página
"Notificações" tem um), não abertos; ficam só no backup. O respondi em si
não foi conferido.

**Fechamento:** inventário aprovado pelo Lucas em 2026-10-05 (decisões 7,
10 e 11 respondidas na seção 6). Textos extraídos apagados da pasta de
rascunho no mesmo dia (conferido: nenhum `.sql`, `.zip`, `.json` ou `.txt`
restante; ficaram só os scripts de leitura, sem dados). A Fase 1 extrai de
novo do backup o texto completo dos Termos e da Reembolso.

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
  (seção 5). Os Termos seguem as decisões 7, 11 e 12: sem fidelidade,
  landing page de valor único com manutenção opcional, Google Ads mensal e,
  se for o caso, as regras dos clientes atuais.
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

### Fase 3: página inicial e páginas dos planos

- Simples, seguindo a direção da seção 1: o que a Adsgator faz, os planos à
  venda (decisão 11) com o que inclui e o que não inclui, como funciona
  depois de contratar, perguntas frequentes (base: páginas antigas Landing
  Page Pro e Google Ads) e botão "Contratar" que leva ao checkout (Fase 4).
  Portfólio e depoimentos só se forem reais e autorizados (decisão 8).
- Medição (Google Analytics, Google Ads) e aviso de cookies, se o Lucas
  quiser medir o site.

### Fase 4: contratação (checkout novo) e briefings

O checkout novo substitui o do WooCommerce: o cliente escolhe o plano, faz
o cadastro, aceita os Termos e paga, e o cadastro e o pagamento vão para o
Asaas, como antes. Fica em `checkout.adsgator.com.br`, só para novas
contratações (Lucas, 2026-10-05). Pode vir antes da Fase 3, se o Lucas
preferir.

- Detalhar esta fase com o Lucas a partir do inventário da Fase 0 (planos e
  textos do checkout antigo) e das decisões 2, 3 e 11. O checkout precisa
  de pagamento único (landing page) e recorrente (Google Ads e manutenção).
  As formas de integrar com o Asaas são pesquisadas na documentação dele na
  hora, não de memória.
- Se usar a API do Asaas, essa parte precisa de código no servidor: a chave
  fica só no servidor (variável secreta na Vercel), nunca no navegador nem
  no Git, e toda checagem da tela é repetida no servidor.
- Testes de pagamento no ambiente de testes do Asaas, se houver (conferir);
  pagamento real só com autorização do Lucas, a cada um.
- Briefings em `forms.adsgator.com.br`, como antes (decisão 3), só para
  quem recebe o link: recomendado sem indexação no Google.
- Links antigos de briefing continuam funcionando (seção 3).
- Termos e Privacidade atualizados com o que o checkout coleta e com o
  registro do aceite.

**Critério de pronto (em produção):** fechado quando a fase for detalhada;
no mínimo, uma contratação de teste completa (plano, cadastro, aceite dos
Termos e pagamento) chega ao Asaas e os links antigos de briefing
continuam funcionando, com testes de cliques reais no Chrome.

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
2. (Fase 4) Checkout novo em `checkout.adsgator.com.br` (o Lucas já
   decidiu o checkout, no lugar do WooCommerce, e o endereço): como
   integrar com o Asaas, de onde vêm os planos, como registrar o aceite dos
   Termos, se o cliente novo entra sozinho no painel e se o `cliente.`
   antigo redireciona para ele. Recomendado: o aceite no próprio checkout, já
   que o e-mail de boas-vindas do painel diz que o cliente aceitou os
   Termos na contratação; o texto dos Termos (Fase 1) já deve prever isso.
3. (Fase 4) Briefings em `forms.adsgator.com.br` (endereço decidido):
   formulários do respondi.app incorporados nas páginas, como no site
   antigo (recomendado; a política de segurança do site, CSP, precisa
   liberar o respondi), ou só botões que levam ao respondi.
4. Medição no site e aviso de cookies.
5. Conteúdo da página inicial.
6. (Fase 2) Subdomínio `ajuda.`: só redirecionar ou manter a central nele.
7. (Fase 1) Fidelidade e reembolso: a 5.1 dos Termos diz "sem fidelidade",
   mas outras cláusulas dos Termos e a página de Reembolso falam em
   fidelidade de 6 meses e multa de 30%. DECIDIDO (Lucas, 2026-10-05): sem
   fidelidade; o advogado valida o texto. Ainda a confirmar: o Reembolso
   vira seção dos Termos, num texto só e sem contradição, e o endereço
   antigo redireciona para `/termos` (recomendado), ou página própria
   `/reembolso`.
8. (Fase 3) Portfólios e depoimentos: manter as 6 páginas de portfólio e
   os depoimentos com nome e foto? Recomendado: só o que for de cliente real
   e com autorização; `/portfolios/` redireciona para a página que existir.
9. (Fase 3) Árvore de links (`/links/`, privada desde 2026-08-17): sai
   (redireciona para `/`, recomendado, já que estava fora do ar) ou volta
   como página simples, se ainda for usada (ex.: bio do Instagram).
10. Subdomínios quebrados hoje (seção 2): os briefings já enviados
    (`forms.`) e o artigo de saldo dos e-mails (`ajuda.`) não abrem.
    DECIDIDO (Lucas, 2026-10-05): opção b.
    a) Manter a ordem: `ajuda.` na Fase 2 e `forms.` na Fase 4.
    b) Recomendado: logo depois da Fase 1, ligar `forms.` só com
       redirecionamentos (cada briefing vai direto para o formulário dele no
       respondi, sem página nova); a Fase 4 depois troca pelas páginas.
       `ajuda.` entra com a Fase 2. Pouco trabalho e os links voltam antes.
    c) Ligar `forms.` antes da Fase 1, se houver cliente com briefing
       pendente: atrasa um pouco o `/termos`.
    Em qualquer opção, ligar o subdomínio mexe na configuração do domínio na
    Vercel (seção 3: só com autorização). Não deve precisar mudar DNS: no
    painel, o subdomínio foi ligado sem criar registro (seção 2).
11. (Fases 3 e 4) Planos à venda para clientes novos. DECIDIDO em parte
    (Lucas, 2026-10-05):
    - Landing page deixa de ser plano mensal: valor único (o cliente paga, a
      Adsgator faz e a landing page é do cliente), com um plano opcional de
      suporte e manutenção.
    - Planos de Google Ads continuam, mais valorizados: preços ajustados
      para cima e sem clientes de verba muito baixa (verba mínima).
    - Falta definir: preços, verba mínima, o que entra no plano de
      manutenção e se o Site Pro e os combos (Landing Page + Ads Start)
      saem. Recomendado: poucos planos, porque menos dúvida é menos
      conversa.
12. (Fase 1, Termos) Consequências do novo modelo de landing page: os
    Termos antigos (2.3 e 2.4) tratam a landing page como licença de uso por
    assinatura, que fica com a Adsgator, com taxa para levar os arquivos.
    DECIDIDO (Lucas, 2026-10-05):
    - Quem já tem landing page por assinatura continua no modelo antigo,
      sem mudança; o modelo novo vale só para clientes novos. Os Termos
      cobrem os dois (recomendado: um texto só, com uma seção para cada
      modelo e a data a partir da qual o novo vale; o advogado valida).
    - Com o plano de manutenção, a hospedagem fica incluída, na conta da
      agência. Sem o plano, o cliente paga a hospedagem (como: abaixo).
    - O "Dashboard Ads" não existe mais: sai dos Termos e das descrições dos
      planos de Google Ads ("Dashboard de acompanhamento").
    - Atendimento por e-mail e WhatsApp, como hoje (horário do site antigo:
      segunda a sexta, 9h às 12h e 13h30 às 17h; confirmar).

    Hospedagem sem o plano de manutenção (as landing pages são arquivos
    estáticos, então qualquer hospedagem serve; seção 2):
    a) Recomendado: plano só de hospedagem, pago à Adsgator pelo checkout
       (mensal ou anual), na mesma conta da agência. Nenhuma configuração
       por cliente e nenhuma conversa técnica; a receita cobre o custo.
       Depende da decisão 13 (receber para hospedar é uso comercial).
    b) Hospedagem na conta do próprio cliente, num plano grátis que permita
       uso comercial (ex.: Cloudflare Pages; confirmar os termos na hora).
       O cliente não paga hospedagem, mas cada entrega exige criar a conta
       com ele, e qualquer problema depois volta como suporte.
    c) Entrega dos arquivos para o cliente hospedar onde quiser. Nenhuma
       responsabilidade depois, mas a maioria dos negócios locais não
       consegue fazer isso sozinha.

    Proposta para qualquer opção: o cliente recebe os arquivos quando
    pedir, sem custo (a landing page é dele), e o domínio fica no nome dele
    (CPF ou CNPJ). Falta: escolher a opção, confirmar a proposta e decidir o
    e-mail com o domínio do cliente (o plano antigo incluía contas de
    e-mail): como está hoje para os clientes atuais e se entra no modelo
    novo.
13. (Antes da Fase 1) Plano da Vercel: conferir se a conta atende às regras
    de uso comercial da Vercel (seção 2), já que nela ficam o site da
    agência, o painel e os sites de clientes. Situação da conta, opções e
    recomendação em `DOCS/LOCAL.md`.

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
- 2026-10-05: o Lucas confirmou que quem responde o briefing é o cliente e
  decidiu manter os briefings em `forms.adsgator.com.br`, como no site
  antigo (seções 3 e 6).
- 2026-10-05: o checkout novo fica em `checkout.adsgator.com.br`, só para
  novas contratações; o Lucas liberou trocar o `cliente.` antigo (seção 3,
  Fase 4 e decisão 2).
- 2026-10-05: Fase 0 feita (resultado na Fase 0, detalhes de clientes em
  `DOCS/LOCAL.md`). Extraídos só os bancos do principal, da ajuda, do
  cliente e dos formulários; o login não foi aberto. Verificado: o leitor
  de SQL deu o mesmo resultado lendo o arquivo em pedaços de 1 MB e de 7
  caracteres (978 linhas, mesmo hash, no banco de formulários), e o número
  de linhas bateu com o de comandos `INSERT` do arquivo; as imagens usadas
  pelas páginas existem nos backups (83/83 e 34/34); estado dos subdomínios
  conferido com `nslookup` e `curl` (seção 2). Bancos extraídos apagados no
  mesmo dia. Pendente: aprovação do inventário, decisões 7 a 10 e apagar os
  textos extraídos que ficaram na pasta de rascunho.
- 2026-10-05: o Lucas definiu a direção da Adsgator (seção 1): sem
  prospecção, atende os clientes atuais e quem chegar sozinho, contratação e
  entrada do cliente por autoatendimento, checkout novo mantido. Fase 3
  simplificada (página inicial e páginas dos planos) e decisão 11 nova.
- 2026-10-05: Fase 0 aprovada pelo Lucas. Decididos: sem fidelidade
  (decisão 7); redirecionamentos de `forms.` logo depois da Fase 1 (decisão
  10); landing page de valor único com manutenção opcional e Google Ads
  mais valorizado, com verba mínima (decisão 11). Decisão 12 nova
  (consequências do novo modelo de landing page nos Termos). Próximo:
  detalhar a Fase 1.
- 2026-10-05: respostas do Lucas na decisão 12 (clientes atuais seguem no
  modelo antigo; hospedagem incluída no plano de manutenção e paga pelo
  cliente sem ele; sem Dashboard Ads; atendimento por e-mail e WhatsApp) e
  um pedido para o painel (mensagens de atendimento e onboarding, seção 1).
  Pesquisadas nas páginas oficiais as regras e os preços de hospedagem
  (seção 2) e conferido nos projetos que as landing pages dos clientes são
  estáticas (Astro). Decisão 13 nova (plano da Vercel). Próximo: decisões 12
  e 13, depois detalhar a Fase 1.

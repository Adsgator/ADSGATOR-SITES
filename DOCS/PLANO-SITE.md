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
- Também para o plano do painel (2026-10-06): responder como
  contato@adsgator.com.br pelo Gmail ("Enviar como", com a Brevo) para de
  funcionar em janeiro de 2027 (seção 2). Escolher outro jeito antes disso.
- Identidade visual (Lucas, 2026-10-06): tudo o que a Adsgator mostra ao
  cliente segue o mesmo sistema visual (Fase 1B), inclusive o que for do
  painel e chegar ao cliente, como os e-mails, no que o e-mail permitir.

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
  - Cloudflare: o contrato dos planos (Self-Serve Subscription Agreement,
    em vigor desde 2025-09-12) não restringe o plano grátis a uso pessoal;
    a única restrição ligada a comércio é não processar nem coletar dados
    de cartão de crédito em site do plano grátis. Desde 2025-04-08 a
    Cloudflare recomenda começar projetos novos no Workers, que também
    serve arquivos estáticos; o Pages continua funcionando, mas sem
    investimento novo (blog da Cloudflare). No Workers, requisições a
    arquivos estáticos são grátis e ilimitadas (documentação, atualizada em
    2026-04-23); o plano grátis permite até 100 Workers por conta (página de
    limites). Pages grátis: 500 builds por mês, até 20.000 arquivos por site
    e 100 domínios próprios (documentação, atualizada em 2026-09-05).
  - Cloudflare, plano grátis para as landing pages: até 100 Workers por
    conta, 20.000 arquivos por versão e 25 MiB por arquivo (limites do
    Workers, atualizada em 2026-09-05). O limite de 100.000 requisições por
    dia vale para o código do Worker: a página de cobrança diz que arquivos
    estáticos são grátis e ilimitados e indica que ficam fora desse limite,
    sem dizer com todas as letras. Publicação automática pelo Git: 3.000
    minutos de build por mês, 1 por vez, até 20 minutos cada (atualizada em
    2026-05-29). Domínio próprio num Worker exige o domínio ativo na
    Cloudflare (servidores DNS apontando para ela) na mesma conta do Worker;
    o certificado sai sozinho; até 100 domínios por zona (página de domínios
    próprios, atualizada em 2026-09-29). Essa página não fala de restrição
    por plano; no Pages, o plano grátis tem domínio próprio escrito na
    documentação. Domínios por conta: sem limite fixo, até 50 pendentes de
    cada vez (comunidade da Cloudflare; não achei página oficial).
  - Netlify: plano grátis com 300 créditos por mês (20 créditos por GB de
    tráfego, 15 por deploy); a página de preços não cita restrição
    comercial.
  - GitHub Pages não permite site de negócio (termos do GitHub).
- As landing pages novas dos clientes são Astro com `output: 'static'` (só
  arquivos, sem código de servidor): funcionam em qualquer hospedagem de
  arquivos estáticos. Duas usam o Analytics da Vercel (opcional).
- No painel, `painel.adsgator.com.br` foi ligado na Vercel sem criar
  registro DNS: o DNS curinga já cobre (plano do painel, 2026-09).
- Leis usadas nos Termos e na Privacidade (conferido em 2026-10-05 nos textos
  oficiais: compilados do Planalto, baixados pelo computador do Lucas porque o
  site recusou a ferramenta de busca, e páginas da ANPD modificadas em
  2026-09-16):
  - CDC (Lei 8.078/1990), art. 49: desistência em 7 dias da assinatura ou do
    recebimento do serviço, quando a contratação é fora do estabelecimento; os
    valores pagos durante o prazo, a qualquer título, são devolvidos de
    imediato, atualizados.
  - Decreto 7.962/2013 (comércio eletrônico). Art. 2: o site que oferece ou
    fecha contrato mostra, em destaque, nome empresarial e CNPJ, endereço
    físico e eletrônico, características do serviço, condições integrais da
    oferta (pagamento e prazo de execução) e restrições. Art. 4: sumário do
    contrato antes da contratação, com destaque para as cláusulas que limitam
    direitos; confirmar na hora o aceite; disponibilizar o contrato para o
    cliente guardar logo depois da contratação; atendimento eletrônico para
    dúvidas, reclamações, suspensão e cancelamento, com resposta em até 5
    dias. Art. 5: informar como desistir; desistência pela mesma ferramenta da
    contratação, com confirmação imediata; cancela os contratos acessórios;
    estorno no cartão comunicado na hora.
  - LGPD (Lei 13.709/2018): art. 9 (o que informar ao titular), art. 18
    (direitos), art. 19 (confirmação e acesso: simplificado na hora ou
    declaração completa em até 15 dias) e art. 41 (encarregado).
  - Resolução CD/ANPD nº 2/2022, anexo, art. 11: agente de tratamento de
    pequeno porte não precisa indicar encarregado, mas precisa de um canal de
    comunicação com o titular; pelo art. 3, não vale para tratamento de alto
    risco nem para receita acima do limite de empresa de pequeno porte.
  - Resolução CD/ANPD nº 19/2024, art. 17, § 2º: na transferência
    internacional por cláusulas-padrão, o controlador publica no site, em
    linguagem simples, a forma, a duração e a finalidade, o país de destino e
    os demais itens do artigo.
- Domínios no registro.br (páginas de ajuda oficiais, conferidas em
  2026-10-06): registro de 1 a 10 anos (R$ 40 por 1 ano, R$ 112 por 3 anos);
  "nenhum usuário do sistema de registro pode reservar um domínio"; sem
  pendência, o pedido vira registro em até 5 minutos e a cobrança vem depois,
  por Pix, cartão ou boleto.
- E-mail (conferido em 2026-10-06):
  - Gmail (página oficial "Learn about changes to third-party email account
    support in Gmail"): o "Enviar como" com endereço de fora do Google acaba
    em janeiro de 2027, e antes disso o Gmail pode bloquear configurações
    novas. Continuam o encaminhamento para o Gmail e o "Enviar como" de
    endereços do Gmail e do Google Workspace. É o esquema que a Adsgator usa
    hoje para responder como contato@ (Brevo).
  - ImprovMX (página de preços): plano grátis com 1 domínio, 25 aliases, 500
    e-mails encaminhados por dia e sem envio (SMTP); o Light (US$ 50 por ano)
    tem 5 domínios e envio. Guarda os e-mails só até a entrega, na França
    (AWS Paris), e envia pela França e pelos Estados Unidos (política de
    privacidade).
  - Brevo (ajuda oficial): dados na União Europeia (França, Alemanha e
    Bélgica), com possível transferência aos Estados Unidos e à Índia,
    conforme o uso.

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

### Fase 1: base do site, Termos e Privacidade (APROVADA PELO LUCAS EM 2026-10-05, EM CONSTRUÇÃO)

Prioridade porque os links do rodapé de todos os e-mails (`/termos`,
`/privacidade` e `/ajuda`) dão 404 hoje.

**Objetivo:** trocar a página provisória por um site Next.js com o visual
do painel, com Termos e Privacidade de verdade e uma Ajuda provisória, sem
mudar nada em `/email/*`, e com os endereços antigos do WordPress deste
domínio redirecionados. Conteúdo legal: o Lucas valida, de preferência com
um advogado; o Claude não inventa cláusula. Atualizado (Lucas, 2026-10-06):
ele cuida da parte jurídica; as cláusulas novas são propostas destacadas
para ele aprovar.

**Fatos conferidos (2026-10-05)**
- Projeto `adsgator-sites` na Vercel (`vercel project inspect`): tipo
  "Other" (estático), com saída na pasta `public` se ela existir, senão na
  raiz. Um projeto Next.js tem `public/`: sem trocar o tipo, a Vercel
  serviria só essa pasta (no painel, o tipo errado deu 404 em tudo; plano do
  painel). O `vercel.json` aceita `"framework": "nextjs"`, que substitui o
  tipo do projeto (documentação do vercel.json, atualizada em 2026-08-14):
  a troca vai no próprio branch, sem mexer na produção antes da hora.
- Hoje no repositório: `index.html` (com `noindex`), `vercel.json`
  (`cleanUrls`, `trailingSlash: false`), `email/banner-topo.png` (16.066
  bytes) e `email/logo-rodape.png` (8.039 bytes).
- Painel: Next.js 16.3.6, React 19.2.8, Tailwind 4, shadcn `base-nova`,
  `next-themes` (escuro por padrão, respeitando o sistema), Geist pelo
  `next/font`, cabeçalhos de segurança no `next.config.ts`, CSP com nonce no
  `src/proxy.ts` e testes em `tests/` com `playwright-core` e o Chrome
  instalado (endereço na variável `BASE`).
- Versões no npm: next 16.3.8, react 19.3.0, tailwindcss 4.3.3, next-themes
  0.4.6, shadcn 4.21.2, lucide-react 1.52.0, playwright-core 1.63.0 e
  typescript 7.0.2 (o painel usa a 5: conferir na hora se o Next já aceita a
  7; na dúvida, a mesma do painel). Conferir de novo ao construir.
- CSP (guia do Next 16.3.8, atualizado em 2026-03-20): com nonce, todas as
  páginas passam a ser geradas a cada visita (sem cache na CDN e com mais
  custo). Sem nonce, o guia põe a CSP no `next.config` com `'unsafe-inline'`
  em `script-src`; a alternativa com hashes (SRI) mantém as páginas
  estáticas, mas é experimental. Escolha técnica: sem nonce, como no guia,
  porque o site não tem login, formulário nem conteúdo de usuário; rever na
  Fase 4 (checkout).
- A Vercel não indexa os previews (artigo de ajuda da Vercel).

**Passos**
1. Branch `fase-1` a partir da `main`.
2. Projeto Next.js com a stack do painel e as versões do npm no dia.
   Copiado do painel (não importado; a origem é anotada aqui ao copiar):
   `globals.css` (tema), `components.json`, `brand.tsx`, logos, ícone,
   `theme-provider` e os componentes do shadcn que forem usados.
3. `vercel.json` do branch com `"framework": "nextjs"` (sem o `cleanUrls`,
   que era do site estático) e `.gitignore` com a pasta do build do Next
   (`.next/`).
4. `email/` vira `public/email/`: mesmos arquivos, mesmos nomes.
5. Layout: cabeçalho com o logo; rodapé com Termos, Privacidade, Ajuda,
   e-mail, WhatsApp, horário de atendimento e CNPJ (como no site antigo,
   dados confirmados pelo Lucas); tema claro e escuro (padrão: decisão 1);
   página 404 com link para o início.
6. Páginas:
   - `/`: simples até a Fase 3 (decisão 15).
   - `/termos`: o texto antigo, extraído de novo do backup para a pasta de
     rascunho (apagado no fim) e revisado com as decisões 7 e 12 (como:
     decisão 16), com a data da última atualização.
   - `/privacidade`: reescrita a partir da seção 5, mais o que o próprio
     site faz (hospedagem na Vercel; nesta fase, sem cookies nem medição; a
     preferência de tema fica guardada no navegador).
   - `/ajuda`: provisória até a Fase 2 (canais e horário de atendimento),
     para o link dos e-mails não dar 404.
   Os textos ficam em arquivos de conteúdo (Markdown), não no código.
7. Redirecionamentos permanentes dos endereços antigos deste domínio (lista
   da Fase 0): `/termos-de-servico` → `/termos`, `/politicas-de-privacidade`
   → `/privacidade`, `/politicas-de-reembolso` → seção de reembolso dos
   Termos e os demais → `/`, com e sem a barra no fim. As 6 páginas de
   portfólio têm nome de cliente no endereço: ficam fora do código público
   e caem na página 404 até a decisão 8 (Fase 3).
8. Busca: títulos e descrições, `robots.txt` liberado, `sitemap.xml` e
   imagem de compartilhamento. Cabeçalhos de segurança do painel, sem o
   `noindex`, e a CSP sem nonce.
9. Testes em `tests/` (como no painel: `playwright-core`, Chrome instalado e
   `BASE`): cliques no cabeçalho e no rodapé, os 3 links dos e-mails com e
   sem `www`, troca de tema, 404, redirecionamentos, cabeçalhos, `robots`,
   `sitemap` e `/email/*` com o mesmo conteúdo de antes (comparando o hash).
   Rodam primeiro no `npm run dev` local, depois em produção.
10. Push do branch: preview da Vercel (protegido pelo login da Vercel). O
    Lucas confere no navegador; o Claude confere também, se houver um jeito
    seguro de testar o preview protegido (pesquisar na hora).
11. Com o OK do Lucas: juntar na `main`, testes em produção, README
    atualizado (como rodar, testar e publicar), `npm audit` e registro aqui.

**Critério de pronto (em produção)**
- `adsgator.com.br/termos`, `/privacidade` e `/ajuda`, sem `www` como nos
  e-mails, abrem a página certa, testado com cliques reais no Chrome.
- `/email/banner-topo.png` e `/email/logo-rodape.png` respondem 200, como
  `image/png` e com o mesmo conteúdo de antes (mesmo hash), com e sem `www`.
- Os endereços antigos do passo 7 redirecionam para as páginas novas.
- Cabeçalhos de segurança no ar, `robots.txt` e `sitemap.xml` respondendo e
  nenhuma página de produção com `noindex`.
- Termos e Privacidade com o texto aprovado pelo Lucas e a data de
  atualização na página.
- Testes no repositório, README atualizado e `npm audit` sem vulnerabilidade
  alta ou crítica (ou o motivo registrado aqui).

**Decisões para o Lucas:** 1 (tema), 15 (página inicial nesta fase) e 16
(como publicar os Termos), na seção 6.

**Fora:** página inicial completa e medição (Fase 3), artigos da ajuda e
`ajuda.` (Fase 2), `forms.` (decisão 10, logo depois desta fase), checkout
(Fase 4) e Cloudflare (Fase 5).

**Tarefas do Lucas:** responder as decisões 1, 15 e 16; confirmar os dados
do rodapé (e-mail, WhatsApp, horário e CNPJ do site antigo) e os pontos da
Privacidade (seção 5); aprovar os textos dos Termos e da Privacidade (e
levar ao advogado); conferir o preview antes de juntar na `main`.

**Rascunhos dos Termos e da Privacidade (2026-10-05, branch `fase-1`)**

O Lucas escolheu o caminho recomendado ("pode seguir"): rascunhos completos,
com as propostas destacadas para ele confirmar.

- Base: os textos antigos extraídos de novo do backup do site principal (só
  as páginas Termos de serviço, de 20/10/2025, Políticas de reembolso e
  Políticas de privacidade; o banco e os textos foram apagados da pasta de
  rascunho no mesmo dia), as decisões 7, 11, 12 e 16 e as leis da seção 2.
- Termos (`src/content/termos.mdx`), o que mudou em relação ao antigo:
  - sem fidelidade nem multa de 30% (saíram a 6.3, a 9.2, a 11.2 e a
    fidelidade da página de Reembolso), e o Reembolso virou a seção 10
    (`/termos#reembolso`);
  - saíram o Dashboard Ads, o `cliente.adsgator.com.br` e as contas de
    e-mail do modelo antigo (nenhum cliente atual tem; decisão 12);
  - seções novas para a landing page de preço único (4) e o plano de
    hospedagem, suporte e manutenção (5); a assinatura antiga ficou na seção
    6, só para quem contratou até a data da publicação;
  - a regra de atendimento (canais, horário e prazo de resposta) substituiu a
    8.1 ("não há uma frequência definida");
  - resumo no topo (o decreto do comércio eletrônico pede sumário antes da
    contratação: serve também para o checkout) e preços fora dos Termos
    ("informados antes da contratação", decisão 16);
  - a Privacidade que se repetia na 16 virou link para `/privacidade`.
- Privacidade (`src/content/privacidade.mdx`): reescrita a partir da seção 5
  e do que o site faz (sem cookies, sem medição, nada carregado de fora e só
  o tema guardado no navegador, conferido nos testes).
- Pontos para o Lucas confirmar (os trechos destacados nas páginas):
  1. Domínio incluso na landing page: o registro do primeiro ano.
  2. Prazo da landing page nova: até 7 dias úteis depois de receber todo o
     material, como no modelo antigo.
  3. Entrega: quando a landing page é publicada no domínio do cliente, com
     aviso (é dela que conta o mês até a primeira mensalidade da
     manutenção).
  4. Pagamento da landing page: na contratação, à vista ou parcelado.
  5. Fim do plano de manutenção (cancelamento ou atraso): arquivos ou conta
     da Cloudflare no nome do cliente, e a renovação do domínio passa para
     ele; com atraso, ele pede os arquivos antes de 28 dias.
  6. Relatório do Google Ads todo mês.
  7. Atendimento: exceto feriados nacionais; resposta em até 2 dias úteis (o
     decreto pede até 5 dias); ligações e reuniões combinadas antes.
  8. Desistência em 7 dias: proposta de seguir a lei (devolução imediata de
     tudo o que foi pago à Adsgator); o texto antigo dava 15 dias úteis e
     descontava gastos já feitos, como o domínio.
  9. Privacidade: a lista de serviços e de dados (seções 3 e 4) está
     completa?

  As datas destacadas ("data da publicação") são preenchidas na publicação.
- Para o advogado: se o CDC vale para os clientes (empresas) e, com isso, a
  desistência e o foro; a base legal de cada uso de dados, o país de cada
  serviço e os prazos de guarda (Privacidade, seções 3, 6 e 7); o papel da
  Adsgator nas landing pages e contas dos clientes (Privacidade, seção 5);
  como tratar a saída do Dashboard Ads e das contas de e-mail para os
  clientes atuais; licenças de terceiros (imagens, fontes) numa landing page
  que passa a ser do cliente.
- Depois de publicados: avisar os clientes atuais por e-mail sobre os Termos
  novos (a cláusula 10 antiga promete aviso por e-mail em mudança
  significativa). Envio de verdade só com autorização do Lucas.

**Respostas do Lucas e revisão final (2026-10-06, branch `fase-1`)**

- Respostas aos pontos acima:
  1. domínio incluso, com registro por 3 anos (o cliente não se preocupa
     com isso tão cedo);
  2. prazo de 14 dias (o texto usa dias úteis, como o antigo: confirmar);
  3, 4, 5 e 7. aprovados;
  6. o relatório do Google Ads existe, sem frequência (hoje vai quando o
     cliente pede);
  8. seguir a lei. O domínio é registrado depois dos 7 dias de desistência:
     o registro.br não reserva domínio (seção 2). Se o cliente pedir para
     registrar antes, o domínio é dele e o valor dele não entra na devolução;
  9. faltavam o Google Drive (arquivos e planilhas) e o código dos sites e
     sistemas (GitHub); entraram também a Cloudflare e o Registro.br;
  10. rodapé confirmado.
- Parte jurídica: o Lucas cuida dela ("eu já entendo sobre isso"). Os
  pontos que eram para o advogado foram resolvidos no texto: base legal (art.
  7º da LGPD), países (principalmente Estados Unidos e União Europeia; a
  região do banco do painel não foi conferida), guarda por até 5 anos depois
  do contrato e o papel da Adsgator nas contas dos clientes.
- Clientes atuais (muda a decisão 12): as landing pages e os sites por
  assinatura passam a ser do cliente, como no modelo novo, e a assinatura
  continua como plano de manutenção, pelo mesmo valor (agrado do Lucas; os
  Termos não citam preço; valores em `DOCS/LOCAL.md`). Saiu a seção do
  modelo antigo (licença de uso, taxa para levar os arquivos e regra de novo
  design).
- Seção nova "O que a Adsgator garante" (pedido do Lucas, contrapeso ao "não
  garante"): cuidado e boas práticas, prazos com aviso se atrasar, resposta
  no prazo, correção sem custo dos erros da Adsgator, transparência das
  contas, arquivos, sigilo, devolução em 7 dias e aviso de mudanças.
- As referências entre seções viraram links (pedido do Lucas: a navegação
  precisa ajudar quem lê), e as leis citadas têm link para o texto oficial.
- Revisão de completude (pedido do Lucas: cobrir até o que ninguém imagina,
  mas acontece). Entraram:
  - Google Ads: anúncios reprovados e conta suspensa pelo Google; remoção do
    acesso da Adsgator;
  - landing page: até 2 rodadas de ajustes antes da aprovação; projeto
    parado por mais de 60 dias esperando o cliente;
  - pagamentos: reajuste anual com aviso de 30 dias; pagamento contestado ou
    estornado;
  - atendimento: combinados valem por escrito; recesso avisado antes;
  - responsabilidades do cliente: direito sobre o material enviado, contatos
    atualizados e segurança das contas;
  - responsabilidade e imprevistos: serviços de terceiros, caso fortuito ou
    força maior, limite de responsabilidade (quando a lei permitir) e fim de
    um serviço com aviso de 30 dias;
  - disposições gerais: dados dos clientes do cliente (LGPD), portfólio só
    com autorização, regra inválida não derruba as outras e tolerância não é
    renúncia.
- Privacidade: "sem cookies" vale por enquanto. Quando o site medir visitas e
  anúncios (Google Analytics e Google Ads, Fase 3), a política muda antes e o
  site pede permissão para os cookies que não forem necessários.
- Nos textos, o destaque amarelo passou a marcar só o que mudou desde a
  leitura do Lucas. Pendente: o OK final dele para publicar.

### Fase 1B: identidade visual e experiência (antes das Fases 2 e 3)

Pedido do Lucas (2026-10-06): o site todo, e tudo o que a Adsgator mostra ao
cliente, segue a referência https://v0-optimus-delta.vercel.app/ (estrutura,
UI/UX, efeitos, entradas e movimentos), mesclada com a referência da Vercel e
com a identidade da Adsgator. O branding é muito importante: manter
identificação e conexão em tudo.

**Objetivo:** um sistema visual único (cores, fontes, componentes e
movimento), documentado e aplicado no site, que depois serve para a ajuda
(Fase 2), as páginas dos planos (Fase 3), o checkout e os briefings (Fase 4)
e, no que o e-mail permitir, os e-mails do painel.

**Fatos conferidos (2026-10-06)**
- Referência (feita no v0; Next.js e Tailwind, como este site), lida no código
  publicado e em capturas de tela:
  - Fontes: Instrument Sans (texto e títulos), Instrument Serif (destaques) e
    JetBrains Mono (rótulos pequenos, como "—— Capabilities").
  - Cores: neutros quentes e quase nenhuma cor de destaque (fundo `#fafaf9`,
    texto `#080503`, cinza `#5e534a`, bordas `#dad7d0`); seções escuras com
    textura de linhas diagonais.
  - Estrutura: cabeçalho que vira barra flutuante arredondada ao rolar (menu
    de três linhas no celular); topo com rótulo, título enorme cuja última
    palavra troca, texto, dois botões em pílula e faixa de números rolando;
    grade de linhas finas e desenho animado de caracteres no fundo; seções
    com rótulo, título em dois tons e listas numeradas; seção escura de
    passos que avançam sozinhos, com janela de código; números grandes; faixa
    de logos; depoimento; planos com mensal e anual; chamada final; rodapé em
    colunas.
  - Movimento sem biblioteca, só CSS e IntersectionObserver: letras que sobem
    saindo do desfoque, revelação por recorte, faixas infinitas, entradas em
    cascata ao rolar (300 a 700 ms, curva `cubic-bezier(0.22, 1, 0.36, 1)`) e
    granulado de 3% sobre o fundo; um canvas desenha o topo.
  - Não respeita "reduzir animações" do sistema. No Windows, "Mostrar
    animações" desligado já liga essa opção no Chrome.
- Identidade da Adsgator (pasta de identidade visual; caminho em
  `DOCS/LOCAL.md`): amarelo `#FFB100`, verde-escuro `#1F271B`, quase branco
  `#F1F1F1`, quase preto `#1C1D1D` e um azul `#2F11DA` (só num favicon); logos
  horizontal e vertical para fundo claro, escuro e amarelo; favicons em 5
  cores; padrões para fundo claro e escuro; elementos (5 estrelas, cards,
  cantos "bumerangue"); fonte Servus Slab (18 estilos), sem arquivo de
  licença na pasta.
- Este site hoje: Geist e Geist Mono, neutros frios do shadcn (base do
  painel), tema claro com botão para trocar.

**Passos**
1. Decisões 17 e 18 (seção 6).
2. Tokens no `globals.css` (cores do claro e do escuro, fontes, raios,
   sombras e curvas de movimento) e `DOCS/IDENTIDADE-VISUAL.md` reescrito como
   a referência de tudo o que é da Adsgator para o cliente.
3. Componentes: cabeçalho flutuante com menu no celular, rótulo, título em
   dois tons, botões em pílula, revelação ao rolar, faixa infinita, letras
   com desfoque, grade e granulado de fundo, seção escura e rodapé em
   colunas. Movimento em CSS e IntersectionObserver, como a referência
   (biblioteca só se for preciso, pesquisada na hora); com "reduzir
   animações", o conteúdo aparece sem movimento.
4. Página de amostra fora do Google, com todos os componentes, para o Lucas
   aprovar no preview.
5. Aplicar no layout e nas páginas atuais (início provisório, Termos,
   Privacidade e Ajuda).
6. Testes: cliques reais, celular, "reduzir animações" ligado e desligado (o
   conteúdo aparece nos dois), console sem erros e nada carregado de fora (as
   fontes servidas pelo próprio site).

**Critério de pronto (em produção):** as páginas com o visual novo, testadas
com cliques reais no Chrome, no celular e com "reduzir animações" ligado e
desligado; `DOCS/IDENTIDADE-VISUAL.md` atualizado.

**Fora:** página inicial completa (Fase 3), checkout (Fase 4) e e-mails do
painel (plano do painel; e-mail não aceita a maior parte dos efeitos).

**Decisões para o Lucas:** 17 e 18 (seção 6).

**Tarefas do Lucas:** aprovar a página de amostra; conferir a licença da
Servus Slab, se ela for usada.

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
- Direção do Lucas (2026-10-05): a página inicial final mantém o que o site
  antigo tinha, atualizado e mais moderno; a da Fase 1 é provisória.
- Comércio eletrônico (Decreto 7.962/2013, art. 2; seção 2): as páginas que
  oferecem os planos mostram, em destaque, nome empresarial, CNPJ, endereço
  físico e eletrônico, o que o serviço inclui, as condições (pagamento e
  prazo) e as restrições. DECIDIDO (Lucas, 2026-10-06): CNPJ e nome
  fantasia, sem endereço físico (agência online, ele não quer o endereço
  exposto). O decreto pede nome empresarial e endereço físico; o Lucas foi
  avisado e decidiu assim.
- Medição (Google Analytics, Google Ads) e aviso de cookies, se o Lucas
  quiser medir o site.

### Fase 4: contratação (checkout novo) e briefings

O checkout novo substitui o do WooCommerce: o cliente escolhe o plano, faz
o cadastro, aceita os Termos e paga, e o cadastro e o pagamento vão para o
Asaas, como antes. Fica em `checkout.adsgator.com.br`, só para novas
contratações (Lucas, 2026-10-05). Pode vir antes da Fase 3, se o Lucas
preferir.

- Detalhar esta fase com o Lucas a partir do inventário da Fase 0 (planos e
  textos do checkout antigo) e das decisões 2, 3, 11 e 12. O checkout
  precisa de pagamento único (landing page) e recorrente (Google Ads e
  manutenção); o plano de manutenção é oferecido na entrega, com a primeira
  cobrança um mês depois (decisão 12).
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
- Comércio eletrônico (Decreto 7.962/2013, arts. 4 e 5; seção 2): sumário do
  contrato antes de pagar (o resumo dos Termos), confirmação imediata da
  contratação, os Termos aceitos enviados para o cliente guardar,
  desistência pela mesma ferramenta da contratação (com confirmação imediata
  e estorno no cartão) e resposta ao atendimento em até 5 dias.

**Critério de pronto (em produção):** fechado quando a fase for detalhada;
no mínimo, uma contratação de teste completa (plano, cadastro, aceite dos
Termos e pagamento) chega ao Asaas e os links antigos de briefing
continuam funcionando, com testes de cliques reais no Chrome.

### Fase 5: landing pages dos clientes na Cloudflare

Projeto à parte do site (as landing pages ficam em outros repositórios),
registrado aqui porque faz parte de arrumar a casa. Decisão 14 (Lucas,
2026-10-05): landing pages novas na Cloudflare, as atuais depois, e a
Vercel só com o que é da agência (site e painel).

**Objetivo:** as landing pages dos clientes no plano grátis da Cloudflare,
dentro das regras dela, e nenhuma na conta da Vercel.

**Fatos conferidos:** seção 2 (plano grátis: até 100 sites por conta,
arquivos estáticos grátis e ilimitados, domínio próprio exige o domínio
ativo na Cloudflare na mesma conta do site). As landing pages são Astro
estático. Na conta da Vercel há hoje outros 4 projetos além do site e do
painel (`vercel project ls`, 2026-10-05), entre eles landing pages de
clientes; o Lucas confirma quais são. Lista e caminho dos projetos em
`DOCS/LOCAL.md`.

**Parte A: antes da primeira landing page nova**
1. O Lucas cria a conta da agência na Cloudflare, com verificação em duas
   etapas (a senha fica só com ele).
2. Definir como publicar (build automático pelo GitHub ou publicação pelo
   computador; pesquisar na hora) e testar com uma landing page "[TESTE]"
   num domínio ou subdomínio de teste, com domínio próprio e certificado.
3. Definir o passo a passo do domínio do cliente (registrado no nome dele,
   com os servidores DNS na Cloudflare) e da conta no nome do cliente para
   quem não tem o plano (decisão 12). Regras do registro.br pesquisadas na
   hora.
4. Escrever o processo junto do modelo das landing pages (`adsgator-base`)
   e apagar o teste no fim.

**Parte B: depois das Fases 1 a 4**, uma landing page por vez: publicar na
Cloudflare, conferir no endereço de teste, trocar os servidores DNS do
domínio (com autorização do Lucas, mostrando antes o que muda), conferir no
ar com cliques reais (página, botões de WhatsApp, medição) e só então
apagar o projeto da Vercel. As que usam o Analytics da Vercel deixam de
usá-lo.

**Critério de pronto (em produção):** parte A: a landing page de teste abre
pela Cloudflare com domínio próprio e certificado, publicada seguindo o
processo escrito. Parte B: todas as landing pages dos clientes abrem pela
Cloudflare, testadas com cliques reais, e nenhuma fica na Vercel.

**Decisões para o Lucas:**
- Workers (recomendado, é o que a Cloudflare indica para projetos novos)
  ou Pages (o plano grátis do Pages tem domínio próprio escrito na
  documentação: fica de reserva se o teste da parte A mostrar alguma
  restrição no Workers grátis).
- Quando fazer a parte A: DECIDIDO (Lucas, 2026-10-05): logo depois dos
  redirecionamentos de `forms.` (decisão 10), para estar pronta quando
  chegar o primeiro cliente novo.

**Fora:** o site da agência e o painel (continuam na Vercel, decisão 13).

**Tarefas do Lucas:** criar a conta da agência na Cloudflare; autorizar
cada troca de DNS; dar acesso ao registro.br dos domínios, quando for o
caso.

## 5. Pontos para a Política de Privacidade

Levantados no painel em 2026-10-05. Conferir com o Lucas e completar com o
que o site usar. Usados no rascunho da Política de Privacidade (Fase 1,
2026-10-05).

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
  internacional) e por quanto tempo são guardados. RESOLVIDO com o Lucas
  (2026-10-06): na Privacidade, "principalmente nos Estados Unidos e na
  União Europeia" e guarda por até 5 anos depois do contrato.
- Acrescentados pelo Lucas (2026-10-06): Google Drive (arquivos e
  planilhas) e o código dos sites e sistemas (GitHub), onde também aparecem
  dados de clientes. Na revisão entraram a Cloudflare (landing pages novas)
  e o Registro.br (domínios em nome do cliente).

## 6. Decisões em aberto (perguntar na fase correspondente)

1. (Fase 1) Tema padrão do site: escuro (como o painel), claro ou o do
   sistema. Recomendado: o do sistema, com botão para trocar: cada visitante
   vê o tema do próprio aparelho, e os dois temas existem de qualquer jeito.
   Escuro deixa o site com a cara do painel; claro é o mais comum em sites
   de serviço e textos longos (Termos). DECIDIDO (Lucas, 2026-10-05): claro,
   com botão para trocar.
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
5. Conteúdo da página inicial. Direção do Lucas (2026-10-05): manter o que o
   site antigo tinha, atualizado e mais moderno (Fase 3).
6. (Fase 2) Subdomínio `ajuda.`: só redirecionar ou manter a central nele.
7. (Fase 1) Fidelidade e reembolso: a 5.1 dos Termos diz "sem fidelidade",
   mas outras cláusulas dos Termos e a página de Reembolso falam em
   fidelidade de 6 meses e multa de 30%. DECIDIDO (Lucas, 2026-10-05): sem
   fidelidade; o advogado valida o texto. O Reembolso vira seção dos
   Termos (Lucas, 2026-10-05), num texto só e sem contradição; o endereço
   antigo redireciona para `/termos`.
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
      manutenção, o plano de e-mail (decisão 12) e se o Site Pro e os
      combos (Landing Page + Ads Start) saem. Recomendado: poucos planos, porque menos dúvida é menos
      conversa.
    - Plano de manutenção: valor novo definido pelo Lucas (2026-10-06), com
      os clientes atuais mantendo o valor de hoje (valores em
      `DOCS/LOCAL.md`).
    - Plano de e-mail (Lucas, 2026-10-06): a ideia era repetir com o cliente
      o esquema da Adsgator (ImprovMX para receber e Brevo para enviar pelo
      Gmail). Esbarra no fim do "Enviar como" do Gmail para endereços de
      fora (janeiro de 2027; seção 2): o plano de e-mail precisa de um
      provedor com caixa de e-mail de verdade, pesquisado quando o plano for
      definido.
12. (Fase 1, Termos) Consequências do novo modelo de landing page: os
    Termos antigos (2.3 e 2.4) tratam a landing page como licença de uso por
    assinatura, que fica com a Adsgator, com taxa para levar os arquivos.
    DECIDIDO (Lucas, 2026-10-05):
    - Quem já tem landing page por assinatura continua no modelo antigo,
      sem mudança; o modelo novo vale só para clientes novos. Os Termos
      cobrem os dois (recomendado: um texto só, com uma seção para cada
      modelo e a data a partir da qual o novo vale; o advogado valida).
      MUDOU (Lucas, 2026-10-06): as landing pages e os sites por assinatura
      passam a ser dos clientes, como no modelo novo, e a assinatura
      continua como plano de manutenção, pelo mesmo valor (Fase 1, revisão
      final).
    - Landing page nova: preço único; a Adsgator desenvolve e a página é do
      cliente, com o domínio no nome dele já incluso na contratação.
    - À parte e opcional: plano de hospedagem, suporte e manutenção,
      oferecido na entrega, com a primeira mensalidade um mês depois dela.
      A hospedagem desses clientes fica na conta da agência (onde: decisão
      14).
    - Sem o plano: o cliente hospeda por conta própria, ou o Lucas cria a
      conta na Cloudflare no nome do cliente e passa o acesso a ele; a
      manutenção fica com o cliente ou é paga à parte quando ele precisar.
    - E-mail profissional (com o domínio do cliente): plano à parte,
      opcional, pago pelo cliente.
    - O "Dashboard Ads" não existe mais: sai dos Termos e das descrições dos
      planos de Google Ads ("Dashboard de acompanhamento").
    - Atendimento por e-mail e WhatsApp, de segunda a sexta, das 9h às 12h e
      das 13h30 às 17h (como hoje).
    - Renovação do domínio: incluída no plano de manutenção; sem o plano, o
      cliente paga por conta própria.
    - Arquivos da landing page: entregues sem custo quando o cliente pedir
      (por isso a landing page é cobrada completa, e não mais por plano).
    - E-mail dos clientes atuais: hoje nenhum tem (ninguém usava) e fica
      assim por enquanto; o plano grátis da Umbler é uma ideia para depois
      (pesquisar quando for o caso). Nos Termos do modelo antigo, as contas
      de e-mail citadas não existem mais: o advogado diz como tratar.
      RESOLVIDO (2026-10-06): o modelo antigo saiu dos Termos com a mudança
      dos clientes atuais, e o Lucas cuida da parte jurídica.

    Falta definir (Fase 5, parte A): como criar a conta na Cloudflare no
    nome do cliente (proposta: com o e-mail dele; a senha e a verificação em
    duas etapas ficam com ele, e o Lucas não guarda senha) e como o Lucas
    entra nela para publicar.
13. (Antes da Fase 1) Plano da Vercel: conferir se a conta atende às regras
    de uso comercial da Vercel (seção 2), já que nela ficam o site da
    agência, o painel e os sites de clientes. DECIDIDO (Lucas, 2026-10-05):
    manter a conta como está por enquanto; se der problema, ele vê a troca
    de plano. Detalhes em `DOCS/LOCAL.md`.
14. (Antes da próxima landing page nova) Onde hospedar as landing pages
    novas do plano de manutenção. DECIDIDO (Lucas, 2026-10-05): opção a.
    Depois das Fases 1 a 4, as landing pages atuais também vão para a
    Cloudflare, e a Vercel fica só com o que é da agência (Fase 5).
    a) Recomendado: na Cloudflare (Workers com arquivos estáticos, como a
       Cloudflare recomenda para projetos novos), numa conta da agência.
       Grátis, e o contrato não restringe o plano grátis a uso pessoal
       (seção 2). Uma plataforma só para os dois casos: quem tem o plano
       fica na conta da agência, quem não tem fica numa conta no nome dele,
       e mudar de uma para a outra (cliente que cancela o plano ou que
       contrata depois) é publicar os mesmos arquivos na outra conta.
       Contra: uma plataforma a mais, que já vai ser preciso conhecer para
       quem não tem o plano.
    b) Na Vercel, como as landing pages de hoje: nada novo para aprender
       (ver a decisão 13 e o `DOCS/LOCAL.md` antes de escolher).
15. (Fase 1) Página inicial nesta fase. DECIDIDO (Lucas, 2026-10-05):
    opção a.
    a) Recomendado: simples e indexável, com uma frase do que a Adsgator faz
       e os contatos (texto aprovado pelo Lucas). Quem chega por indicação e
       procura "Adsgator" no Google acha o site e o contato. A página
       completa vem na Fase 3.
    b) Manter a página provisória com `noindex` até a Fase 3: nada a
       escrever agora, mas quem procurar a Adsgator não acha o site.
16. (Fase 1) Como publicar os Termos. DECIDIDO (Lucas, 2026-10-05): opção
    b, tudo de uma vez. A Fase 1 só vai para a `main` com as regras do
    modelo novo definidas (decisões 11 e 12). Proposta: os preços ficam nas
    páginas dos planos e no checkout, e os Termos dizem "conforme o plano
    contratado", para não mudarem a cada reajuste.
    a) Recomendado: publicar já os Termos das regras de hoje (clientes
       atuais), com as contradições corrigidas (sem fidelidade), o
       Reembolso como seção, sem o Dashboard Ads e com o atendimento; as
       cláusulas do modelo novo de landing page entram quando ele for
       vendido pelo site (Fases 3 e 4). Publicar com a aprovação do Lucas e
       revisar com o advogado quando ele puder. Os links dos e-mails voltam
       logo e nada é publicado antes de o serviço existir; em troca, os
       Termos mudam de novo nas Fases 3 e 4.
    b) Escrever tudo de uma vez agora (regras de hoje e modelo novo): uma
       revisão só com o advogado, mas a Fase 1 espera os preços e o plano de
       manutenção (decisão 11).
    c) Como a (a), mas só publicar depois do advogado: mais seguro, mas os
       links dos e-mails seguem dando 404 até lá.
17. (Fase 1B) Fontes do sistema visual.
    a) Recomendado: Geist e Geist Mono, que o site já usa. É a fonte da
       Vercel, gratuita, e tem o mesmo jeito da referência.
    b) Instrument Sans e JetBrains Mono, como a referência.
    c) Servus Slab (fonte da marca) em títulos ou destaques, com a (a) no
       texto, só se a licença permitir uso na web (conferir).
18. (Fase 1B) Neutros (fundos, textos e bordas).
    a) Recomendado: quentes, como a referência; combinam com o amarelo e o
       verde-escuro da marca.
    b) Frios, como o painel e o site hoje.

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
- 2026-10-05: o Lucas decidiu o modelo da landing page nova (preço único,
  domínio no nome do cliente incluso, plano de hospedagem, suporte e
  manutenção à parte com a primeira mensalidade um mês depois da entrega;
  sem o plano, hospedagem própria ou conta na Cloudflare no nome do
  cliente), o e-mail profissional como plano à parte, o horário de
  atendimento, o Reembolso como seção dos Termos (decisões 7 e 12) e manter
  a conta da Vercel como está (decisão 13). Conferido nos termos oficiais
  da Cloudflare que o plano grátis não é restrito a uso pessoal (seção 2).
  Decisão 14 nova (onde hospedar as landing pages novas).
- 2026-10-05: decisão 14: Cloudflare para as landing pages novas; as atuais
  vão depois das Fases 1 a 4, e a Vercel fica só com o que é da agência
  (Fase 5 nova). Decisão 12 completada (renovação do domínio, entrega dos
  arquivos, e-mail dos clientes atuais). Conferidos os limites do plano
  grátis da Cloudflare (seção 2): comporta as landing pages atuais e novas.
- 2026-10-05: Fase 1 detalhada (objetivo, fatos conferidos, passos,
  critério de pronto e decisões 1, 15 e 16). Conferidos: o tipo do projeto
  na Vercel ("Other"), a opção `framework` do `vercel.json`, a stack do
  painel, as versões no npm e o guia de CSP do Next. Parte A da Fase 5 logo
  depois dos redirecionamentos de `forms.` (Lucas). Na conta da Vercel há
  menos projetos de landing page do que pastas locais (Fase 5). Aguardando
  a aprovação da Fase 1.
- 2026-10-05: Fase 1 aprovada pelo Lucas. Decididos: tema claro (decisão
  1), página inicial simples e indexável (decisão 15) e Termos completos de
  uma vez, regras de hoje e modelo novo (decisão 16). A construção segue no
  branch `fase-1`; os registros da construção ficam neste plano dentro do
  branch até ele ser juntado na `main`.
- 2026-10-05 (branch `fase-1`): base da Fase 1 construída (passos 1 a 9;
  Termos e Privacidade ainda com aviso de rascunho).
  - Modelo oficial do Next 16.3.8 (`create-next-app`) para `tsconfig`,
    `eslint`, `postcss` e `AGENTS.md`; ele fixa React 19.2.8 e TypeScript 5,
    o que resolveu a dúvida do TypeScript 7. `@next/mdx` na mesma versão do
    Next.
  - Copiados do painel (`ADSGATOR-PAINEL`): `src/app/globals.css`,
    `src/app/icon.svg`, `src/lib/utils.ts`, `src/components/theme-provider.tsx`,
    `brand.tsx`, `ui/button.tsx`, `ui/empty.tsx`, `not-found-message.tsx`
    (texto adaptado), `components.json`, `public/brand/` (logos e símbolo) e
    os cabeçalhos de segurança do `next.config.ts` (sem o `noindex`).
  - Achados: o Button do Base UI marca links como `role="button"` (nos
    links do site ficou só a aparência de botão; o painel usa o mesmo
    padrão) e as classes em conflito precisam passar pelo `cn` (sem ele, o
    botão do WhatsApp não ficava amarelo e o "Enviar e-mail" ficava sem
    borda; visto nas capturas de tela).
  - Verificado: lint, tipos e build sem erro, todas as páginas estáticas;
    `tests/site.mjs` com 48 de 48 no `npm run dev` e no build de produção
    rodando no computador (`next start`), inclusive console sem erros com a
    CSP de produção; imagens dos e-mails com o mesmo hash de produção antes
    da troca (`banner-topo.png` 487efee51f2d, `logo-rodape.png`
    26ede58094fa).
  - `npm audit`: 9 avisos altos, todos da mesma falha no `braces` (até a
    3.0.3; GHSA-vfj7-8cjw-p6xm, de 2026-09-18, sem versão corrigida). Ele
    chega por ferramentas de desenvolvimento (ESLint do Next e CLI do
    shadcn) que leem padrões do próprio projeto; nada disso vai para o
    navegador nem roda no site publicado, que é estático. A saída que o npm
    sugere (voltar o `eslint-config-next` para a 14 e o shadcn para a 1.0)
    quebraria o projeto. Rever quando sair a correção.
  - Preview do branch publicado (status Ready), protegido pelo login da
    Vercel (sem login, 302 para a tela de login); `vercel inspect` mostra o
    build como Next.js, então o `"framework": "nextjs"` do `vercel.json`
    funcionou. A produção continuou com a página provisória. Testar o
    preview com o `vercel curl` cria uma chave de desvio da proteção no
    projeto, se não houver (documentação do `vercel curl`, 2026-10-02): só
    com autorização do Lucas.
  - Pendente: textos dos Termos e da Privacidade (decisões 11, 12 e 16), o
    Lucas aprovar o texto do início e da ajuda e os dados do rodapé,
    conferir o preview e só então juntar na `main`.
- 2026-10-05 (branch `fase-1`): rascunhos dos Termos e da Privacidade
  (detalhes na Fase 1). O Lucas respondeu "pode seguir" e explicou que a
  página inicial de agora não é a final: a ideia é manter o que o site antigo
  tinha, atualizado e mais moderno (Fase 3 e decisão 5).
  - Leis conferidas nos textos oficiais (seção 2). Mudança proposta no texto
    antigo por causa delas: a desistência em 7 dias devolve tudo, de
    imediato.
  - Os títulos das seções viram endereço sem o número ("10. Reembolso" vira
    `#reembolso`), para o link antigo continuar valendo se a numeração mudar.
  - Testes novos: sem cookies, só o tema guardado no navegador e nada
    carregado de fora do site (o que a Privacidade promete); sumário dos
    Termos (links e clique em Reembolso); Privacidade no celular; e "texto
    aprovado", que falha enquanto houver aviso de rascunho ou trecho a
    confirmar.
  - Verificado: lint, tipos e build sem erro; `tests/site.mjs` com 55 de 57
    no `npm run dev` e, depois da última revisão do texto, no build de
    produção rodando no computador. As 2 falhas são as de "texto aprovado",
    esperadas até a aprovação. Capturas de tela conferidas (claro, escuro e
    celular): o destaque amarelo fica legível nos dois temas.
  - Pendente: o Lucas confirmar os 9 pontos da Fase 1 e os dados do rodapé;
    levar ao advogado; preencher a data, tirar os destaques e o aviso de
    rascunho; testes 57 de 57; juntar na `main` com o OK dele.
- 2026-10-06 (branch `fase-1`): o Lucas aprovou os textos, respondeu os
  pontos e pediu: migrar os clientes atuais para o modelo novo, seção "O que
  a Adsgator garante", links nas referências entre seções e cobrir o que
  pode acontecer (detalhes na Fase 1, "Respostas do Lucas e revisão final").
  Ele também decidiu não publicar endereço físico (Fase 3) e pediu o sistema
  visual da referência Optimus para tudo o que é da Adsgator para o cliente
  (Fase 1B nova; decisões 17 e 18).
  - Pesquisado nas fontes oficiais (seção 2): registro.br (não existe
    reserva de domínio; registro de até 10 anos), fim do "Enviar como" do
    Gmail para endereços de fora (janeiro de 2027), ImprovMX e Brevo (planos
    e onde guardam os dados) e o art. 7º da LGPD (bases legais).
  - Referência Optimus estudada no código publicado e em capturas (fontes,
    cores, estrutura e movimento, na Fase 1B); identidade da Adsgator lida
    na pasta de identidade visual (cores dos SVGs, logos, padrões e a fonte
    Servus Slab, sem licença na pasta).
  - Teste do sumário: passou a clicar no link "Reembolso" do sumário, porque
    o texto agora tem outros links com esse nome. Um 404 no console apareceu
    uma vez no `npm run dev`, logo depois de ligar o servidor; não se
    repetiu com as páginas já compiladas nem na sequência de cliques
    refeita (atribuído à compilação na primeira visita, não reproduzido).

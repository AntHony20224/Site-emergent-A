# Site Institucional — Borcioni Design e Comunicação

Site institucional completo para a Borcioni Design, estúdio de design e comunicação de Sapiranga (RS): apresenta a empresa, serviços e portfólio, exibe depoimentos autorizados e capta leads por formulário de contato/orçamento e botão de WhatsApp. Inclui painel administrativo protegido para gerenciar todo o conteúdo sem depender de desenvolvedor.

## Para quem é
- **Visitantes:** pequenas e médias empresas e empreendedores que buscam identidade visual e comunicação, principalmente da região de Sapiranga (RS), com destaque secundário para supermercados e varejo local.
- **Administrador:** o dono da Borcioni, que cadastra projetos, serviços e depoimentos e acompanha os contatos recebidos.

## Funcionalidades principais
- **Página Início** — apresentação impactante com o slogan "Marcas que comunicam. Ideias que permanecem.", descrição da empresa, botões "Conhecer projetos" e "Solicitar orçamento", destaque de serviços, prévia do portfólio, depoimentos e chamada para contato.
- **Serviços** — marketing para redes sociais, planejamento estratégico, criação de posts e campanhas, logotipos e identidades visuais, materiais gráficos para impressão (sem impressão), comunicação em voz, publicidade de rua e anúncios digitais impulsionados. Bloco especial de publicidade para supermercados: ofertas semanais, encartes digitais, campanhas para redes sociais, chamadas promocionais e divulgação multicanal.
- **Portfólio** — grade filtrável por categoria; cada projeto tem página própria com imagens, objetivos e soluções. Até o conteúdo real ser cadastrado, projetos de exemplo ficam claramente marcados como "demonstrativo".
- **Depoimentos** — seção que exibe apenas feedbacks reais e autorizados; enquanto não houver nenhum cadastrado, o site mostra aviso neutro em vez de depoimentos inventados.
- **Contato / Orçamento** — formulário funcional com nome, empresa, e-mail, WhatsApp, serviços desejados, orçamento opcional e descrição do projeto; envios ficam registrados no painel e o visitante recebe confirmação na tela.
- **Botão de WhatsApp** — flutuante, com número (51) 99889-3041 configurável pelo painel; links para redes sociais no rodapé (placeholders até os links reais serem informados).
- **Painel administrativo** — login protegido; gerencia projetos (cadastrar/editar/remover, com imagens), serviços, depoimentos (com autorização), contatos recebidos e configurações (WhatsApp, e-mail, redes sociais).
- **Sobre** — história e propósito da empresa, incluindo o posicionamento "mais valor, menos preço" como estúdio em início de trajetória.
- **Política de Privacidade e Termos de Uso** — páginas de texto padrão adequadas à LGPD.
- **SEO e acessibilidade** — metadados por página, textos alternativos, contraste adequado e navegação por teclado.

## Fluxo do visitante
Entra na Início → conhece a proposta ("mais valor, menos preço") → explora Serviços ou o Portfólio filtrado → lê depoimentos → clica em "Solicitar orçamento" ou no botão de WhatsApp → preenche o formulário → recebe confirmação. O admin entra em /admin, faz login e gerencia conteúdo e leads.

## Identidade visual e experiência
- Logos oficiais fornecidas (roxa, preta, branca), preservadas integralmente em desenho e proporção.
- Paleta: roxo vibrante + branco + preto, layout sofisticado, espaços generosos, animações sutis de entrada e hover.
- Tipografia: Gotham nos títulos, Roboto nos subtítulos, Helvetica nos textos, Nunito em botões/formulários/destaques. **Gotham é fonte licenciada e não pode ser distribuída sem os arquivos** — o site será entregue com fallback elegante (Montserrat, a alternativa aberta mais próxima) e ponto de troca simples para quando os arquivos licenciados forem fornecidos. Roboto, Helvetica (Arial como fallback do sistema) e Nunito funcionam desde já.
- Totalmente responsivo, com experiência cuidada em celular e computador.

## Fases de implementação
**Fase 1 (MVP — construída agora):** todas as 7 páginas, portfólio filtrável com páginas de projeto, formulário de leads funcional, botão de WhatsApp, autenticação administrativa, painel completo (projetos, serviços, depoimentos, contatos, configurações), metadados SEO e responsividade.

**Fase 2:** galeria de imagens múltiplas por projeto, busca no portfólio, notificação por e-mail a cada novo lead, blog/notícias, sitemap e robots.txt avançados.

**Fase 3:** área do cliente, integração com agenda para reuniões de briefing, relatórios de leads, versão em inglês.

## Decisões assumidas (pode contestar)
- **Credenciais do admin:** informadas pelo usuário (e-mail anthonyborcioni@gmail.com) — serão cadastradas como o primeiro acesso do painel, com hash seguro da senha.
- **Gotham:** substituída por fallback até o envio dos arquivos licenciados, conforme o próprio pedido permite ("informe a necessidade").
- **Depoimentos:** nenhum depoimento inventado — seção exibe aviso neutro até feedbacks reais serem cadastrados pelo painel.
- **Projetos de exemplo:** criados apenas para demonstrar o layout, todos identificados como "demonstrativo".
- **WhatsApp:** número (51) 99889-3041 usado no botão e no rodapé; e-mail de contato borcionidesign@gmail.com.
- **Redes sociais:** ícones com links placeholder até as URLs reais serem informadas.
- **Região de atendimento:** Sapiranga (RS) e região citados na página Sobre/Contato.
- **Sem pagamentos** nesta versão, conforme solicitado.

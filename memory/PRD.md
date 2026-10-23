# PRD — Site Institucional Borcioni Design e Comunicação

## Problema original
Site institucional profissional e responsivo para a Borcioni Design (Sapiranga/RS): apresentar a empresa, divulgar serviços, exibir portfólio, exibir apenas depoimentos reais/autorizados e captar leads por formulário e WhatsApp. Identidade: logos oficiais fornecidas (roxa/preta/branca), paleta roxo vibrante + branco + preto. Tipografia: Gotham (títulos — licenciada, fallback Montserrat), Roboto (subtítulos), Helvetica (textos), Nunito (botões/formulários/destaques). Páginas: Início, Serviços, Portfólio, Sobre, Contato, Privacidade, Termos + painel admin. Sem pagamentos nesta versão.

## Personas
- Visitante: pequenos/médios empresários da região de Sapiranga (RS), com foco secundário em supermercados e varejo.
- Admin: dono da Borcioni (anthonyborcioni@gmail.com) — gerencia conteúdo e leads.

## Arquitetura
- Frontend: React (CRA/craco), Tailwind, shadcn/ui, sonner, react-router v7. Fontes via Google Fonts (Montserrat/Roboto/Nunito); Gotham documentada em index.css com ponto de troca.
- Backend: FastAPI + Motor (MongoDB), JWT (HS256, 12h, Bearer), bcrypt, seed idempotente no startup.
- Logos oficiais em /app/frontend/public/assets/ (logo-h-branca, logo-v-roxa/preta/branca, logo-redes).

## Implementado (2026-10-23)
- 7 páginas públicas + /admin (login) + /admin/painel (dashboard).
- Home: hero escuro com slogan "Marcas que comunicam. Ideias que permanecem.", CTAs, faixa "Mais valor, menos preço", preview de serviços (bento com destaque supermercados), portfólio em destaque, depoimentos, CTA final.
- Serviços: 9 serviços seeded; bloco especial roxo de Publicidade para Supermercados (ofertas semanais, encartes digitais, campanhas, chamadas promocionais, divulgação multicanal).
- Portfólio filtrável por categoria + página de projeto (objetivo/solução/galeria); demos com selo "Demonstrativo".
- Contato: formulário completo (nome, empresa, e-mail, WhatsApp, serviços, orçamento opcional, descrição) → POST /api/leads; confirmação na tela + toast.
- Depoimentos: só autorizados aparecem; estado vazio neutro.
- Admin: CRUD de projetos, serviços, depoimentos (flag autorização), gestão de leads (ver/marcar lido/excluir), configurações (WhatsApp, e-mail, redes sociais).
- Botão flutuante WhatsApp (51) 99889-3041, configurável no painel; rodapé com redes sociais (placeholder até URLs reais).
- SEO: metadados por página (título + description), OG tags, lang pt-BR, favicon com a logo.
- Banco: MongoDB via MONGO_URL; senhas com bcrypt; endpoints admin protegidos (401 sem token).

## Backlog priorizado
- P0: trocar fallback Montserrat por Gotham quando os arquivos licenciados forem enviados; URLs reais das redes sociais; conteúdo real (projetos/depoimentos).
- P1: galeria multi-imagem com upload de arquivo (hoje por URL), busca no portfólio, notificação por e-mail a cada novo lead (Resend), sitemap.xml e robots.txt avançados.
- P2: área do cliente, agendamento de briefing, relatórios de leads, versão em inglês.

## Credenciais
Ver /app/memory/test_credentials.md.

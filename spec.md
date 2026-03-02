# LuidDeveloperPlatform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add

**Landing Page Pública:**
- Hero section: marketplace de bots, scripts e automações
- Seção de funcionalidades (cards com features principais)
- Seção de planos e preços (Free, Pro, Enterprise)
- CTAs: "Explorar Scripts" e "Criar Conta"

**Marketplace:**
- Listagem de produtos com filtro por categoria:
  - Bots para Discord
  - Scripts de Automação
  - Ferramentas de IA
  - APIs
- Card de produto com: nome, descrição, versão, preço único, preço assinatura, avaliações mock, botão "Comprar"
- Página de detalhe do produto

**Sistema de Usuários (auth por usuário/senha, sem providers externos):**
- Cadastro e Login com username + senha (hash no backend)
- Painel do usuário: histórico de compras, downloads, licenças ativas
- Geração automática de chave de licença (UUID) ao comprar produto
- Visualização de licenças ativas com status e data de expiração

**Painel Administrativo:**
- Protegido por role admin
- Usuário admin padrão: SidneiCosta00 (senha: Nikebolado@4)
- CRUD completo de produtos (nome, descrição, versão, preço, categoria, arquivo)
- Upload de arquivos para venda (via blob-storage)
- Gerenciar usuários (listar, ativar/desativar)
- Dashboard de métricas: total de vendas, receita, usuários ativos
- Ativar/desativar produtos

**Backend (Motoko):**
- Entidades: User, Product, Order, License, Subscription
- Auth por username + senha (senha armazenada como hash SHA-256)
- Roles: user, admin
- Lógica de compra: cria Order + gera License key automaticamente
- Consultas por categoria, por usuário, por admin

### Modify
- Nenhum (projeto novo)

### Remove
- Nenhum (projeto novo)

## Implementation Plan

1. Selecionar componentes: authorization (roles), blob-storage (upload de arquivos)
2. Gerar backend Motoko com:
   - Tipos: User, Product, Order, License, Category
   - Auth: register, login (username+password hash), getCurrentUser
   - Produtos: addProduct, editProduct, removeProduct, listProducts, listByCategory, toggleProductActive
   - Pedidos: purchaseProduct, getUserOrders
   - Licenças: getUserLicenses, validateLicense
   - Admin: listUsers, toggleUserActive, getSalesMetrics
   - Seed: usuário admin SidneiCosta00 pré-cadastrado
3. Frontend React:
   - Roteamento: /, /marketplace, /product/:id, /login, /register, /dashboard, /admin
   - Componentes: Navbar, HeroSection, FeaturesSection, PricingSection, ProductCard, ProductList, CategoryFilter
   - Páginas de auth: Login e Register
   - Dashboard do usuário: tabs para Compras, Downloads, Licenças
   - Admin panel: tabs para Produtos, Usuários, Métricas
   - Tema escuro, estilo tech startup

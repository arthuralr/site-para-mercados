-- ============================================================================
-- SUPERVERDE E-COMMERCE — SCHEMA SQL SUPABASE (POSTGRESQL)
-- Execute este script no SQL Editor do seu projeto no Supabase.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TABELA: produtos
-- Campos principais: (id, nome, categoria, preco_normal, preco_oferta, imagem_url, unidade, ativo)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.produtos (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || substr(gen_random_uuid()::text, 1, 8)),
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  preco_normal NUMERIC(10, 2) NOT NULL CHECK (preco_normal >= 0),
  preco_oferta NUMERIC(10, 2) CHECK (preco_oferta IS NULL OR preco_oferta >= 0),
  imagem_url TEXT NOT NULL,
  unidade TEXT NOT NULL DEFAULT 'un',
  ativo BOOLEAN NOT NULL DEFAULT true,
  -- Colunas complementares com valores padrão para filtros, ERP e detalhes
  sku TEXT DEFAULT '7890000000',
  marca TEXT DEFAULT 'SuperVerde Seleção',
  estoque INTEGER NOT NULL DEFAULT 50,
  selo TEXT,
  tabloide_pagina TEXT DEFAULT 'capa',
  restricoes_json JSONB DEFAULT '[]'::jsonb,
  descricao TEXT DEFAULT 'Produto selecionado com garantia de frescor SuperVerde.',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON public.produtos (categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON public.produtos (ativo);

-- ============================================================================
-- 2. TABELA: ofertas_relampago
-- Campos principais: (id, produto_id, preco_promocional, data_inicio, data_fim)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ofertas_relampago (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id TEXT NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  preco_promocional NUMERIC(10, 2) NOT NULL CHECK (preco_promocional >= 0),
  data_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_fim TIMESTAMPTZ NOT NULL,
  lote_restante_percent INTEGER NOT NULL DEFAULT 25 CHECK (lote_restante_percent BETWEEN 1 AND 100),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_oferta_relampago_produto UNIQUE (produto_id)
);

CREATE INDEX IF NOT EXISTS idx_ofertas_relampago_datas ON public.ofertas_relampago (data_inicio, data_fim);

-- ============================================================================
-- 3. TABELA: pedidos
-- Campos principais: (id, cliente_nome, cliente_telefone, endereco, itens_json, total, status, criado_em)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT,
  cliente_telefone TEXT NOT NULL,
  endereco TEXT NOT NULL,
  itens_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'Recebido',
  canal TEXT NOT NULL DEFAULT 'Site Próprio',
  forma_pagamento TEXT NOT NULL DEFAULT 'PIX',
  filial TEXT DEFAULT 'SuperVerde — Unidade Jardins (Médio Porte)',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS cliente_email TEXT;

CREATE INDEX IF NOT EXISTS idx_pedidos_criado_em ON public.pedidos (criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON public.pedidos (status);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_email ON public.pedidos (cliente_email);

-- ============================================================================
-- 4. POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ============================================================================
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ofertas_relampago ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Leitura e escrita pública/anon habilitada para operação da vitrine e do Painel Admin
DROP POLICY IF EXISTS "Acesso total produtos" ON public.produtos;
CREATE POLICY "Acesso total produtos"
  ON public.produtos FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total ofertas_relampago" ON public.ofertas_relampago;
CREATE POLICY "Acesso total ofertas_relampago"
  ON public.ofertas_relampago FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total pedidos" ON public.pedidos;
CREATE POLICY "Acesso total pedidos"
  ON public.pedidos FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 5. CARGA INICIAL (SEED) PARA TESTE IMEDIATO
-- ============================================================================
INSERT INTO public.produtos (id, nome, categoria, preco_normal, preco_oferta, imagem_url, unidade, ativo, sku, marca, estoque, selo, tabloide_pagina, restricoes_json)
VALUES
  ('prod-1', 'Picanha Bovina Maturada Resfriada à Vácuo (Peça Aprox. 1.1kg)', 'Açougue', 89.90, 59.90, 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=700&q=80', 'kg', true, '7891000101', 'Maturatta Friboi', 34, 'Corte Nobre', 'capa', '["Sem Glúten", "Zero Lactose"]'::jsonb),
  ('prod-2', 'Azeite Português Extra Virgem Gallo Vidro Escuro 500ml', 'Mercearia', 48.90, 32.90, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80', 'un (500ml)', true, '7891000102', 'Gallo', 42, 'Importado', 'capa', '["Sem Glúten", "Zero Lactose", "Vegano", "Sem Açúcar"]'::jsonb),
  ('prod-3', 'Morango Selecionado Hidropônico Bandeja 250g', 'Hortifrúti', 12.90, 7.49, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=80', 'bandeja 250g', true, '7891000103', 'Fazenda da Serra', 85, 'Colhido Hoje', 'hortifruti', '["Sem Glúten", "Zero Lactose", "Vegano", "Orgânico", "Sem Açúcar"]'::jsonb),
  ('prod-4', 'Lava-Roupas Líquido Omo Lavagem Perfeita Galão 3 Litros', 'Limpeza', 46.50, 29.90, 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=700&q=80', 'galão 3L', true, '7891000104', 'Omo', 19, 'Tamanho Família', 'mercearia-limpeza', '[]'::jsonb),
  ('prod-5', 'Kit 6 Cervejas Heineken Puro Malte Long Neck 330ml', 'Bebidas', 44.90, 31.90, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=700&q=80', 'pack 6x330ml', true, '7891000105', 'Heineken', 120, 'Gelada / Rápida', 'acougue-bebidas', '["Zero Lactose", "Vegano", "Sem Açúcar"]'::jsonb),
  ('prod-6', 'Abacate Avocado Hass Selecionado (Ponto de Consumo)', 'Hortifrúti', 18.90, 12.90, 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80', 'kg', true, '7891000106', 'Fazenda da Serra', 64, 'Orgânico', 'hortifruti', '["Sem Glúten", "Zero Lactose", "Vegano", "Orgânico", "Sem Açúcar"]'::jsonb),
  ('prod-7', 'Banana Prata Climatizada Doce Penca Aprox. 800g', 'Hortifrúti', 8.90, 5.99, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80', 'penca ~800g', true, '7891000107', 'Fazenda da Serra', 110, 'Direto da Roça', 'hortifruti', '["Sem Glúten", "Zero Lactose", "Vegano", "Sem Açúcar"]'::jsonb),
  ('prod-8', 'Tomate Italiano Maduro para Molho e Salada 1kg', 'Hortifrúti', 11.50, 6.99, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80', 'kg', true, '7891000108', 'Fazenda da Serra', 95, 'Safra Fresca', 'hortifruti', '["Sem Glúten", "Zero Lactose", "Vegano", "Orgânico", "Sem Açúcar"]'::jsonb),
  ('prod-10', 'Bife Ancho Bovino Angus Resfriado Porcionado 600g', 'Açougue', 54.90, 39.90, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80', 'bandeja 600g', true, '7891000110', 'Maturatta Friboi', 28, 'Linha Angus', 'acougue-bebidas', '["Sem Glúten", "Zero Lactose"]'::jsonb),
  ('prod-13', 'Pão de Fermentação Natural Sourdough Integral Casca Rústica 500g', 'Padaria', 21.90, 15.90, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=700&q=80', 'un (500g)', true, '7891000113', 'Levain Artesanal', 24, 'Fornada das 16h', 'mercearia-limpeza', '["Zero Lactose", "Vegano", "Sem Açúcar", "Integral"]'::jsonb),
  ('prod-14', 'Iogurte Grego Zero Lactose Natural Proteico 500g', 'Frios e Laticínios', 22.90, 15.90, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=700&q=80', 'pote 500g', true, '7891000114', 'VerdeCampo', 58, '14g Proteína', 'capa', '["Sem Glúten", "Zero Lactose", "Sem Açúcar"]'::jsonb),
  ('prod-16', 'Arroz Integral Grãos Nobres Camil Pacote 1kg', 'Mercearia', 10.90, 7.29, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80', 'pacote 1kg', true, '7891000116', 'Camil', 150, 'Rico em Fibras', 'mercearia-limpeza', '["Sem Glúten", "Zero Lactose", "Vegano", "Integral", "Sem Açúcar"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ofertas_relampago (produto_id, preco_promocional, data_inicio, data_fim, lote_restante_percent)
VALUES
  ('prod-1', 59.90, NOW() - INTERVAL '2 hours', NOW() + INTERVAL '24 hours', 22),
  ('prod-2', 32.90, NOW() - INTERVAL '2 hours', NOW() + INTERVAL '24 hours', 18),
  ('prod-3', 7.49,  NOW() - INTERVAL '1 hour',  NOW() + INTERVAL '18 hours', 30),
  ('prod-4', 29.90, NOW() - INTERVAL '3 hours', NOW() + INTERVAL '36 hours', 14),
  ('prod-5', 31.90, NOW() - INTERVAL '1 hour',  NOW() + INTERVAL '48 hours', 35)
ON CONFLICT (produto_id) DO NOTHING;

INSERT INTO public.pedidos (cliente_nome, cliente_telefone, endereco, itens_json, total, status, canal, forma_pagamento)
VALUES
  (
    'Mariana Costa',
    '(11) 98765-4321',
    'Rua Bela Cintra, 1240 (Apto 82) - Jardins | CEP 01415-000',
    '[{"produto_id":"prod-1","nome":"Picanha Bovina Maturada","quantidade":2,"preco_unitario":59.90},{"produto_id":"prod-5","nome":"Kit 6 Cervejas Heineken","quantidade":1,"preco_unitario":31.90}]'::jsonb,
    151.70,
    'Em Separação',
    'Site Próprio (PIX)',
    'PIX Imediato'
  ),
  (
    'Carlos Eduardo Rocha',
    '(11) 99123-4567',
    'Av. Paulista, 900 - Bela Vista | CEP 01310-100',
    '[{"produto_id":"prod-2","nome":"Azeite Português Extra Virgem Gallo 500ml","quantidade":2,"preco_unitario":32.90},{"produto_id":"prod-3","nome":"Morango Bandeja 250g","quantidade":3,"preco_unitario":7.49}]'::jsonb,
    88.27,
    'Saiu para Entrega',
    'WhatsApp Formatado',
    'Cartão na Entrega'
  );

-- ============================================================================
-- 6. TABELAS COMPLEMENTARES DO ECOSSISTEMA (CLIENTES, CARTÃO, RH, CLUBE, CMS)
-- ============================================================================

-- 6.1 Clientes autenticados (Histórico de compras e listas personalizadas)
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  telefone TEXT,
  cpf TEXT,
  endereco_json JSONB DEFAULT '{}'::jsonb,
  listas_compras_json JSONB DEFAULT '[]'::jsonb,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6.2 Solicitações do Cartão da Loja
CREATE TABLE IF NOT EXISTS public.solicitacoes_cartao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo TEXT NOT NULL,
  cpf TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  renda_mensal TEXT NOT NULL,
  profissao TEXT,
  dia_vencimento TEXT DEFAULT 'Dia 10',
  filial TEXT,
  status TEXT NOT NULL DEFAULT 'Em Análise',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6.3 Trabalhe Conosco (Envio de Currículos)
CREATE TABLE IF NOT EXISTS public.curriculos_trabalhe_conosco (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  cargo_desejado TEXT NOT NULL,
  filial_preferida TEXT,
  resumo_experiencia TEXT,
  arquivo_nome TEXT,
  curriculo_texto TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Novo',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6.4 Clube SuperVerde de Descontos
CREATE TABLE IF NOT EXISTS public.clube_descontos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo TEXT NOT NULL,
  cpf TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  departamento_favorito TEXT DEFAULT 'Hortifrúti & Ofertas',
  aceita_whatsapp BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6.5 Configurações Globais CMS e Contadores (Visitas / Bio / Pagamentos / PWA)
CREATE TABLE IF NOT EXISTS public.configuracoes_loja (
  id TEXT PRIMARY KEY DEFAULT 'config-principal',
  dados_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6.6 Inteligência de mercado e pesquisa de preços de concorrentes
CREATE TABLE IF NOT EXISTS public.pesquisa_concorrentes (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  bairro TEXT NOT NULL,
  precos_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes_cartao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculos_trabalhe_conosco ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_descontos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_loja ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesquisa_concorrentes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso total clientes" ON public.clientes;
CREATE POLICY "Acesso total clientes" ON public.clientes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total solicitacoes_cartao" ON public.solicitacoes_cartao;
CREATE POLICY "Acesso total solicitacoes_cartao" ON public.solicitacoes_cartao FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total curriculos" ON public.curriculos_trabalhe_conosco;
CREATE POLICY "Acesso total curriculos" ON public.curriculos_trabalhe_conosco FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total clube_descontos" ON public.clube_descontos;
CREATE POLICY "Acesso total clube_descontos" ON public.clube_descontos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total configuracoes_loja" ON public.configuracoes_loja;
CREATE POLICY "Acesso total configuracoes_loja" ON public.configuracoes_loja FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total pesquisa_concorrentes" ON public.pesquisa_concorrentes;
CREATE POLICY "Acesso total pesquisa_concorrentes" ON public.pesquisa_concorrentes FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- 7. MÓDULO DE WEB PUSH NOTIFICATIONS (INSCRIÇÕES E DISPAROS EM MASSA)
-- ============================================================================

-- 7.1 Tabela de navegadores/dispositivos inscritos para receber Web Push
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  dispositivo TEXT DEFAULT 'Mobile / Desktop',
  cliente_nome TEXT DEFAULT 'Visitante SuperVerde',
  topicos TEXT[] DEFAULT ARRAY['ofertas_relampago', 'encarte_semanal', 'alertas_gerais'],
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_ativo ON public.push_subscriptions(ativo);

-- 7.2 Histórico de campanhas de Web Push disparadas pelo Painel do Gestor
CREATE TABLE IF NOT EXISTS public.push_notifications_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  link_destino TEXT NOT NULL DEFAULT '/',
  total_enviados INTEGER NOT NULL DEFAULT 0,
  disparado_por TEXT DEFAULT 'Gestor SuperVerde',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notifications_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso total push_subscriptions" ON public.push_subscriptions;
CREATE POLICY "Acesso total push_subscriptions" ON public.push_subscriptions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total push_notifications_history" ON public.push_notifications_history;
CREATE POLICY "Acesso total push_notifications_history" ON public.push_notifications_history FOR ALL USING (true) WITH CHECK (true);

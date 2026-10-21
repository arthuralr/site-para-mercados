import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ============================================================================
// TIPAGEM DAS TABELAS DO BANCO DE DADOS SUPABASE (POSTGRESQL)
// ============================================================================

export interface ProdutoRow {
  id: string;
  nome: string;
  categoria: string;
  preco_normal: number;
  preco_oferta: number | null;
  imagem_url: string;
  unidade: string;
  ativo: boolean;
  sku?: string | null;
  marca?: string | null;
  estoque?: number | null;
  selo?: string | null;
  tabloide_pagina?: string | null;
  restricoes_json?: string[] | null;
  descricao?: string | null;
  criado_em?: string;
}

export interface OfertaRelampagoRow {
  id: string;
  produto_id: string;
  preco_promocional: number;
  data_inicio: string;
  data_fim: string;
  lote_restante_percent?: number | null;
  criado_em?: string;
}

export interface PedidoItemJson {
  produto_id: string;
  nome: string;
  quantidade: number;
  preco_unitario: number;
  unidade?: string;
}

export interface PedidoRow {
  id: string;
  cliente_nome: string;
  cliente_email?: string | null;
  cliente_telefone: string;
  endereco: string;
  itens_json: PedidoItemJson[];
  total: number;
  status: string;
  canal?: string | null;
  forma_pagamento?: string | null;
  filial?: string | null;
  criado_em: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function isSupabaseConfigured(): boolean {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("SEU-PROJETO-ID")
  );
}

// Instância singleton do cliente Supabase para Next.js (Client & Server Components)
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

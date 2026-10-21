import {
  supabase,
  isSupabaseConfigured,
  ProdutoRow,
  OfertaRelampagoRow,
  PedidoRow,
  PedidoItemJson,
} from "./client";
import { Product, PRODUCTS, DietaryRestriction } from "@/data/mockData";

// ============================================================================
// MAPEAMENTO ENTRE TABELAS SUPABASE (produtos + ofertas_relampago) E UI
// ============================================================================

function resolveCategoryTabs(
  categoria: string
): ("mais-vendidos" | "hortifruti" | "carnes" | "padaria-bebidas")[] {
  const lower = categoria.toLowerCase();
  if (lower.includes("horti")) return ["hortifruti", "mais-vendidos"];
  if (lower.includes("açougue") || lower.includes("acougue") || lower.includes("carne"))
    return ["carnes", "mais-vendidos"];
  if (lower.includes("padaria") || lower.includes("bebida") || lower.includes("latic"))
    return ["padaria-bebidas", "mais-vendidos"];
  return ["mais-vendidos"];
}

export function mapDatabaseRowsToProduct(
  row: ProdutoRow,
  ofertaRelampago?: OfertaRelampagoRow
): Product {
  // Busca metadados nutricionais complementares caso exista no catálogo base
  const fallbackMeta = PRODUCTS.find((p) => p.id === row.id) || PRODUCTS[0];

  const precoBaseNormal = Number(row.preco_normal) || 0;
  const precoOfertaProduto =
    row.preco_oferta !== null && row.preco_oferta !== undefined
      ? Number(row.preco_oferta)
      : null;

  // Se houver registro ativo na tabela ofertas_relampago, usa o preco_promocional dela
  const isFlash = Boolean(ofertaRelampago);
  const effectivePrice = isFlash
    ? Number(ofertaRelampago!.preco_promocional)
    : precoOfertaProduto && precoOfertaProduto < precoBaseNormal
    ? precoOfertaProduto
    : precoBaseNormal;

  const hasDiscount = effectivePrice < precoBaseNormal;
  const oldPrice = hasDiscount ? precoBaseNormal : undefined;
  const discountPercent = hasDiscount
    ? Math.round(((precoBaseNormal - effectivePrice) / precoBaseNormal) * 100)
    : undefined;

  return {
    id: row.id,
    sku: row.sku || fallbackMeta.sku || "7890000000",
    name: row.nome,
    brand: row.marca || fallbackMeta.brand || "SuperVerde Seleção",
    department: row.categoria,
    categoryTab: resolveCategoryTabs(row.categoria),
    unit: row.unidade || "un",
    weightVolume: row.unidade || fallbackMeta.weightVolume || "1 un",
    volumeOptions: fallbackMeta.volumeOptions,
    oldPrice,
    price: effectivePrice,
    clubPrice: hasDiscount
      ? Number((effectivePrice * 0.95).toFixed(2))
      : undefined,
    discountPercent,
    image: row.imagem_url,
    gallery: [row.imagem_url, ...(fallbackMeta.gallery || []).slice(1)],
    badge: row.selo || fallbackMeta.badge,
    isFlashDeal: isFlash,
    flashStartDate: ofertaRelampago?.data_inicio
      ? ofertaRelampago.data_inicio.slice(0, 16)
      : undefined,
    flashEndDate: ofertaRelampago?.data_fim
      ? ofertaRelampago.data_fim.slice(0, 16)
      : undefined,
    stockLeftPercent: ofertaRelampago?.lote_restante_percent ?? 25,
    stockUnits: row.estoque ?? fallbackMeta.stockUnits ?? 50,
    isActive: row.ativo,
    rating: fallbackMeta.rating || 4.9,
    reviewsCount: fallbackMeta.reviewsCount || 120,
    origin: fallbackMeta.origin || "Produtor Certificado SuperVerde",
    dietary: Array.isArray(row.restricoes_json)
      ? (row.restricoes_json as DietaryRestriction[])
      : fallbackMeta.dietary || [],
    description: row.descricao || fallbackMeta.description,
    storageTips: fallbackMeta.storageTips,
    nutrition: fallbackMeta.nutrition,
    tabloidPage:
      (row.tabloide_pagina as Product["tabloidPage"]) ||
      fallbackMeta.tabloidPage ||
      "capa",
    tabloidHighlight: isFlash || fallbackMeta.tabloidHighlight,
  };
}

// ============================================================================
// CONSULTAS E MUTAÇÕES REAIS NO SUPABASE (produtos, ofertas_relampago, pedidos)
// ============================================================================

/**
 * Busca todos os produtos da tabela `produtos` e cruza com `ofertas_relampago`.
 */
export async function fetchCatalogFromSupabase(): Promise<{
  products: Product[];
  fromSupabase: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return { products: [], fromSupabase: false };
  }

  const [produtosRes, ofertasRes] = await Promise.all([
    supabase
      .from("produtos")
      .select("*")
      .order("criado_em", { ascending: false }),
    supabase.from("ofertas_relampago").select("*"),
  ]);

  if (produtosRes.error) {
    return {
      products: [],
      fromSupabase: false,
      error: produtosRes.error.message,
    };
  }

  const ofertasMap = new Map<string, OfertaRelampagoRow>();
  if (ofertasRes.data) {
    (ofertasRes.data as OfertaRelampagoRow[]).forEach((of) => {
      ofertasMap.set(of.produto_id, of);
    });
  }

  const mapped = ((produtosRes.data as ProdutoRow[]) || []).map((row) =>
    mapDatabaseRowsToProduct(row, ofertasMap.get(row.id))
  );

  return { products: mapped, fromSupabase: true };
}

/**
 * Insere um novo produto na tabela `produtos` do Supabase.
 */
export async function insertProdutoInSupabase(product: Product): Promise<{
  ok: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return { ok: false, error: "Supabase não configurado no .env.local" };
  }

  const precoNormal = product.oldPrice || product.price;
  const precoOferta =
    product.oldPrice && product.oldPrice > product.price
      ? product.price
      : null;

  const payload: Partial<ProdutoRow> = {
    id: product.id,
    nome: product.name,
    categoria: product.department,
    preco_normal: precoNormal,
    preco_oferta: precoOferta,
    imagem_url: product.image,
    unidade: product.unit,
    ativo: product.isActive !== false,
    sku: product.sku,
    marca: product.brand,
    estoque: product.stockUnits ?? 50,
    selo: product.badge || null,
    tabloide_pagina: product.tabloidPage,
    restricoes_json: product.dietary,
    descricao: product.description,
  };

  const { error } = await supabase.from("produtos").insert([payload]);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Atualiza um produto na tabela `produtos` e sincroniza `ofertas_relampago` se aplicável.
 */
export async function updateProdutoInSupabase(
  product: Product
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { ok: false };
  }

  const precoNormal =
    product.oldPrice && product.oldPrice > product.price
      ? product.oldPrice
      : product.price;
  const precoOferta =
    product.oldPrice && product.oldPrice > product.price
      ? product.price
      : null;

  const { error: prodErr } = await supabase
    .from("produtos")
    .update({
      nome: product.name,
      categoria: product.department,
      preco_normal: precoNormal,
      preco_oferta: precoOferta,
      imagem_url: product.image,
      unidade: product.unit,
      ativo: product.isActive !== false,
      estoque: product.stockUnits ?? 50,
      tabloide_pagina: product.tabloidPage,
    })
    .eq("id", product.id);

  if (prodErr) {
    return { ok: false, error: prodErr.message };
  }

  // Sincroniza tabela ofertas_relampago
  if (product.isFlashDeal) {
    const startIso = product.flashStartDate
      ? new Date(product.flashStartDate).toISOString()
      : new Date().toISOString();
    const endIso = product.flashEndDate
      ? new Date(product.flashEndDate).toISOString()
      : new Date(Date.now() + 24 * 3600 * 1000).toISOString();

    await supabase.from("ofertas_relampago").upsert(
      {
        produto_id: product.id,
        preco_promocional: product.price,
        data_inicio: startIso,
        data_fim: endIso,
        lote_restante_percent: product.stockLeftPercent ?? 25,
      },
      { onConflict: "produto_id" }
    );
  } else {
    await supabase
      .from("ofertas_relampago")
      .delete()
      .eq("produto_id", product.id);
  }

  return { ok: true };
}

/**
 * Sincroniza um lote de produtos (ex: Importação via Planilha CSV/Excel) no Supabase.
 */
export async function upsertBulkProdutosInSupabase(
  products: Product[]
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { ok: false };
  }

  const rows: Partial<ProdutoRow>[] = products.map((product) => {
    const precoNormal =
      product.oldPrice && product.oldPrice > product.price
        ? product.oldPrice
        : product.price;
    const precoOferta =
      product.oldPrice && product.oldPrice > product.price
        ? product.price
        : null;

    return {
      id: product.id,
      nome: product.name,
      categoria: product.department,
      preco_normal: precoNormal,
      preco_oferta: precoOferta,
      imagem_url: product.image,
      unidade: product.unit,
      ativo: product.isActive !== false,
      sku: product.sku,
      marca: product.brand,
      estoque: product.stockUnits ?? 50,
      selo: product.badge || null,
      tabloide_pagina: product.tabloidPage,
      restricoes_json: product.dietary,
      descricao: product.description,
    };
  });

  const { error } = await supabase
    .from("produtos")
    .upsert(rows, { onConflict: "id" });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Busca os pedidos reais na tabela `pedidos` do Supabase.
 */
export async function fetchPedidosFromSupabase(): Promise<{
  orders: PedidoRow[];
  fromSupabase: boolean;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return { orders: [], fromSupabase: false };
  }

  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(50);

  if (error || !data) {
    return { orders: [], fromSupabase: false };
  }

  return { orders: data as PedidoRow[], fromSupabase: true };
}

/**
 * Registra um novo pedido na tabela `pedidos` do Supabase (Checkout Próprio ou WhatsApp).
 */
export async function createPedidoInSupabase(orderInput: {
  cliente_nome: string;
  cliente_email?: string;
  cliente_telefone: string;
  endereco: string;
  itens_json: PedidoItemJson[];
  total: number;
  status?: string;
  canal?: string;
  forma_pagamento?: string;
  filial?: string;
}): Promise<{ order: PedidoRow | null; fromSupabase: boolean; error?: string }> {
  const fallbackOrder: PedidoRow = {
    id: `SV-${Math.floor(100000 + Math.random() * 900000)}`,
    cliente_nome: orderInput.cliente_nome,
    cliente_email: orderInput.cliente_email,
    cliente_telefone: orderInput.cliente_telefone,
    endereco: orderInput.endereco,
    itens_json: orderInput.itens_json,
    total: orderInput.total,
    status: orderInput.status || "Recebido",
    canal: orderInput.canal || "Site Próprio",
    forma_pagamento: orderInput.forma_pagamento || "PIX",
    filial: orderInput.filial || "SuperVerde",
    criado_em: new Date().toISOString(),
  };

  if (!isSupabaseConfigured() || !supabase) {
    return { order: fallbackOrder, fromSupabase: false };
  }

  const { data, error } = await supabase
    .from("pedidos")
    .insert([
      {
        cliente_nome: orderInput.cliente_nome,
        cliente_email: orderInput.cliente_email || null,
        cliente_telefone: orderInput.cliente_telefone,
        endereco: orderInput.endereco,
        itens_json: orderInput.itens_json,
        total: orderInput.total,
        status: orderInput.status || "Recebido",
        canal: orderInput.canal || "Site Próprio",
        forma_pagamento: orderInput.forma_pagamento || "PIX",
        filial: orderInput.filial,
      },
    ])
    .select("*")
    .single();

  if (error || !data) {
    return {
      order: fallbackOrder,
      fromSupabase: false,
      error: error?.message,
    };
  }

  return { order: data as PedidoRow, fromSupabase: true };
}

/**
 * Atualiza o status de um pedido na tabela `pedidos` do Supabase.
 */
export async function updatePedidoStatusInSupabase(
  pedidoId: string,
  novoStatus: string
): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { ok: false };
  }

  const { error } = await supabase
    .from("pedidos")
    .update({ status: novoStatus })
    .eq("id", pedidoId);

  return { ok: !error };
}

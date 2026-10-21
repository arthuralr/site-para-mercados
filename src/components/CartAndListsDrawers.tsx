"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  BookmarkPlus,
  FolderHeart,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Check,
  Copy,
  Share2,
  Search,
  ListPlus,
} from "lucide-react";
import { Product } from "@/data/mockData";
import { useStore, SavedShoppingList } from "@/context/StoreContext";
import { formatBRL } from "./ProductCard";
import { formatProductQuantity, isSoldByWeight } from "@/lib/productUnits";

export default function CartAndListsDrawers() {
  const router = useRouter();
  const {
    selectedBranch,
    products,
    cart,
    addToCart,
    removeFromCart,
    clearProductFromCart,
    clearCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    isListsModalOpen,
    setIsListsModalOpen,
    savedLists,
    saveCurrentCartAsList,
    createCustomShoppingList,
    duplicateShoppingList,
    loadListIntoCart,
    deleteSavedList,
    storeSettings,
    triggerToast,
  } = useStore();

  const [newListName, setNewListName] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Smart List Builder State (Criar lista definindo o nome primeiro e depois adicionando produtos)
  const [listModalTab, setListModalTab] = useState<
    "minhas-listas" | "criar-inteligente" | "digitar-manual"
  >("minhas-listas");
  const [builderListName, setBuilderListName] = useState("Churrasco de Sábado");
  const [builderSearch, setBuilderSearch] = useState("");
  const [builderItems, setBuilderItems] = useState<Record<string, number>>({
    "prod-1": 2,
    "prod-5": 2,
    "prod-11": 1,
  });
  const [copiedListId, setCopiedListId] = useState<string | null>(null);
  const [manualListText, setManualListText] = useState("");
  const [manualItems, setManualItems] = useState<
    { name: string; isChecked: boolean }[]
  >([]);

  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => p.id === id);
      return product ? { product, qty } : null;
    })
    .filter(Boolean) as { product: Product; qty: number }[];

  const totalItems = cartEntries.length;
  const subtotal = cartEntries.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );
  const totalSavings = cartEntries.reduce((acc, item) => {
    const diff = item.product.oldPrice
      ? item.product.oldPrice - item.product.price
      : 0;
    return acc + diff * item.qty;
  }, 0);

  const minOrderRemaining = Math.max(0, selectedBranch.minOrder - subtotal);
  const meetsMinOrder = minOrderRemaining === 0;

  const freeShippingRemaining = Math.max(
    0,
    selectedBranch.freeShippingThreshold - subtotal
  );
  const freeShippingProgress = Math.min(
    100,
    (subtotal / selectedBranch.freeShippingThreshold) * 100
  );

  const handleSaveList = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToSave = newListName.trim() || "Compras do Mês";
    const ok = saveCurrentCartAsList(nameToSave);
    if (ok) {
      setNewListName("");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  // Smart Builder Functions
  const handleBuilderQty = (productId: string, delta: number) => {
    setBuilderItems((prev) => {
      const current = prev[productId] || 0;
      const nextQty = current + delta;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: nextQty };
    });
  };

  const handleSaveSmartList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderListName.trim()) {
      triggerToast("Defina um nome para sua lista antes de salvar.");
      return;
    }
    if (Object.keys(builderItems).length === 0) {
      triggerToast("Adicione pelo menos 1 produto na lista.");
      return;
    }
    createCustomShoppingList(builderListName, builderItems);
    setListModalTab("minhas-listas");
  };

  const handleProcessManualList = (e: React.FormEvent) => {
    e.preventDefault();
    const items = manualListText
      .split(/[\n,;]+|\s+e\s+/i)
      .map((item) =>
        item
          .replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "")
          .replace(/^(?:preciso comprar|quero comprar|comprar|lista:)\s*/i, "")
          .trim()
      )
      .filter(Boolean);

    if (items.length === 0) {
      triggerToast("Digite pelo menos um produto para montar sua lista.");
      return;
    }

    setManualItems(items.map((name) => ({ name, isChecked: false })));
  };

  const handleShareManualList = () => {
    const message = [
      "📝 *MINHA LISTA DE COMPRAS — SUPERVERDE*",
      "",
      ...manualItems.map(
        ({ name, isChecked }) => `${isChecked ? "☑" : "☐"} ${name}`
      ),
    ].join("\n");
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Format Shopping List Text for Copy & WhatsApp Share
  const formatShoppingListMessage = (list: SavedShoppingList): string => {
    const entries = Object.entries(list.items)
      .map(([id, qty]) => {
        const prod = products.find((p) => p.id === id);
        return prod ? { prod, qty } : null;
      })
      .filter(Boolean) as { prod: Product; qty: number }[];

    const total = entries.reduce((acc, i) => acc + i.prod.price * i.qty, 0);
    const lines = [
      `📝 *LISTA DE COMPRAS — SUPERVERDE*`,
      `📌 *Nome da Lista:* ${list.name}`,
      `----------------------------------`,
      ...entries.map(
        ({ prod, qty }, idx) =>
          `${idx + 1}. *${formatProductQuantity(prod, qty)} de ${prod.name}* (${prod.weightVolume}) — ${formatBRL(
            prod.price * qty
          )}`
      ),
      `----------------------------------`,
      `💰 *Total Estimado:* *${formatBRL(total)}*`,
      `🛒 Acesse e monte a sua no SuperVerde Online!`,
    ];
    return lines.join("\n");
  };

  const handleDuplicateAndCopyList = (list: SavedShoppingList) => {
    duplicateShoppingList(list.id);
    const formattedText = formatShoppingListMessage(list);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(formattedText).catch(() => {});
    }
    setCopiedListId(list.id);
    setTimeout(() => setCopiedListId(null), 2500);
  };

  const handleShareListOnWhatsApp = (list: SavedShoppingList) => {
    const formattedText = formatShoppingListMessage(list);
    const url = `https://wa.me/?text=${encodeURIComponent(formattedText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const navigateToCheckout = (method: "proprio" | "whatsapp" | "ifood") => {
    setIsCartDrawerOpen(false);
    router.push(`/checkout?metodo=${method}`);
  };

  const filteredBuilderProducts = products.filter(
    (p) =>
      !builderSearch.trim() ||
      p.name.toLowerCase().includes(builderSearch.toLowerCase()) ||
      p.department.toLowerCase().includes(builderSearch.toLowerCase())
  );

  return (
    <>
      {/* 1. GAVETA DE CARRINHO LATERAL (SLIDE-OVER) */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-brand-green-800 px-5 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green-700 text-brand-orange-400">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black leading-tight">
                    Meu Carrinho ({totalItems})
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    {selectedBranch.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setIsListsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-xl bg-brand-green-700 px-2.5 py-1.5 text-[11px] font-bold text-emerald-100 hover:bg-brand-green-600"
                  title="Ver Listas de Compras Inteligentes"
                >
                  <FolderHeart className="h-3.5 w-3.5 text-brand-orange-400" />
                  <span>Listas ({savedLists.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(false)}
                  aria-label="Fechar carrinho"
                  className="rounded-xl bg-brand-green-700 p-1.5 text-emerald-100 hover:bg-brand-green-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Minimum Order Alert & Free Shipping Progress */}
            <div className="space-y-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
              {!storeSettings.onlineShoppingEnabled && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-2.5 text-xs font-bold text-amber-900">
                  ⚠️ Modo Vitrine / Panfleto de Ofertas Ativo: As compras online estão pausadas no momento. Você ainda pode montar sua lista ou enviar pelo WhatsApp.
                </div>
              )}

              {!meetsMinOrder && cartEntries.length > 0 && (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-600" />
                  <div>
                    <p className="font-bold">
                      Pedido mínimo para Delivery:{" "}
                      {formatBRL(selectedBranch.minOrder)}
                    </p>
                    <p className="text-[11px] text-amber-800">
                      Faltam <strong>{formatBRL(minOrderRemaining)}</strong>{" "}
                      para liberar a entrega em domicílio (ou escolha{" "}
                      <strong className="underline">Retirada na Loja</strong>{" "}
                      sem valor mínimo).
                    </p>
                  </div>
                </div>
              )}

              {/* Free Shipping Bar */}
              <div>
                {freeShippingRemaining > 0 ? (
                  <p className="text-xs font-medium text-slate-700">
                    Faltam{" "}
                    <strong className="text-brand-green-700">
                      {formatBRL(freeShippingRemaining)}
                    </strong>{" "}
                    para ganhar{" "}
                    <strong className="text-brand-orange-600">
                      Frete Grátis!
                    </strong>
                  </p>
                ) : (
                  <p className="flex items-center gap-1.5 text-xs font-extrabold text-brand-green-700">
                    <CheckCircle2 className="h-4 w-4 text-brand-green-600" />
                    Parabéns! Você desbloqueou Frete Grátis nesta filial!
                  </p>
                )}
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-emerald-200/70">
                  <div
                    className="h-full rounded-full bg-brand-green-600 transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Top Action Bar inside Cart: Clear Cart + Save Recurring List */}
            {cartEntries.length > 0 && (
              <div className="border-b border-slate-100 bg-white px-5 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Itens selecionados ({cartEntries.length} produtos)
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Limpar Carrinho</span>
                  </button>
                </div>

                {/* Quick Save as Recurring List Form */}
                <form
                  onSubmit={handleSaveList}
                  className="mt-2 flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder='Salvar lista como (ex: "Compras do Mês")...'
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-brand-green-200 bg-brand-green-50 px-3 py-1.5 text-xs font-extrabold text-brand-green-800 hover:bg-brand-green-100"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-brand-green-600" />
                        <span>Salva!</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="h-3.5 w-3.5 text-brand-green-700" />
                        <span>Salvar Lista</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 px-5 py-2">
              {cartEntries.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <ShoppingCart className="h-8 w-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-700">
                    Seu carrinho está vazio
                  </h4>
                  <p className="mt-1 max-w-xs text-xs text-slate-500">
                    Adicione produtos das Ofertas Relâmpago ou crie/carregue uma{" "}
                    <strong>Lista de Compras Inteligente</strong> abaixo.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      setIsListsModalOpen(true);
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-green-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-brand-green-800"
                  >
                    <FolderHeart className="h-4 w-4 text-brand-orange-400" />
                    <span>Abrir Listas de Compras Inteligentes</span>
                  </button>
                </div>
              ) : (
                cartEntries.map(({ product, qty }) => {
                  const itemSavings = product.oldPrice
                    ? (product.oldPrice - product.price) * qty
                    : 0;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <Link
                        href={`/produto/${product.id}`}
                        onClick={() => setIsCartDrawerOpen(false)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 shrink-0 rounded-xl border border-slate-100 object-cover"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/produto/${product.id}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="line-clamp-1 text-xs font-bold text-slate-800 hover:text-brand-green-700"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <span>
                            {formatBRL(product.price)} /{" "}
                            {isSoldByWeight(product) ? "kg" : product.unit}
                          </span>
                          {product.oldPrice && (
                            <span className="line-through">
                              {formatBRL(product.oldPrice)}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-xs font-extrabold text-brand-green-700">
                            {formatBRL(product.price * qty)}
                          </span>
                          {itemSavings > 0 && (
                            <span className="rounded bg-brand-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-orange-700">
                              -{formatBRL(itemSavings)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          aria-label="Diminuir quantidade"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-extrabold text-slate-800">
                          {formatProductQuantity(product, qty)}
                        </span>
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          aria-label="Aumentar quantidade"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-green-600 text-white hover:bg-brand-green-700"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => clearProductFromCart(product.id)}
                          className="ml-1 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                          aria-label="Remover item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Footer with Totals & Flexible Checkout Options */}
            {cartEntries.length > 0 && (
              <div className="space-y-3 border-t border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="space-y-1.5 rounded-2xl border border-slate-200 bg-white p-3">
                  {totalSavings > 0 && (
                    <div className="flex items-center justify-between text-xs font-bold text-brand-orange-600">
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Economia estimada
                        nas ofertas:
                      </span>
                      <span>-{formatBRL(totalSavings)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">
                      Subtotal ({totalItems}{" "}
                      {totalItems === 1 ? "item" : "itens"}):
                    </span>
                    <span className="text-xl font-black text-brand-green-800">
                      {formatBRL(subtotal)}
                    </span>
                  </div>
                </div>

                {/* Flexible Checkout Options Buttons */}
                <div className="space-y-2">
                  {storeSettings.onlineShoppingEnabled && (
                    <button
                      type="button"
                      onClick={() => navigateToCheckout("proprio")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 py-3 text-xs font-extrabold text-white shadow-md transition hover:bg-brand-orange-600 sm:text-sm"
                    >
                      <span>Finalizar no Site (Delivery ou Retirada)</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}

                  <div
                    className={`grid gap-2 ${
                      storeSettings.ifoodEnabled ? "grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => navigateToCheckout("whatsapp")}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-green-600 px-3 py-2.5 text-xs font-extrabold text-white shadow-xs transition hover:bg-brand-green-700"
                    >
                      <MessageCircle className="h-4 w-4 fill-white text-brand-green-600" />
                      <span>Pedir no WhatsApp</span>
                    </button>

                    {storeSettings.ifoodEnabled && (
                      <button
                        type="button"
                        onClick={() => navigateToCheckout("ifood")}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#EA1D2C] px-3 py-2.5 text-xs font-extrabold text-white shadow-xs transition hover:bg-[#c91623]"
                      >
                        <span>Peça pelo iFood</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. MODAL DE "LISTAS DE COMPRAS INTELIGENTES E COMPARTILHAMENTO" */}
      {isListsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-brand-green-800 to-brand-green-700 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-brand-orange-400">
                  <FolderHeart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black sm:text-lg">
                    Listas de Compras Inteligentes & Compartilhamento
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Crie sua lista escolhendo o nome primeiro, gere cópias ou compartilhe no WhatsApp
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsListsModalOpen(false)}
                className="rounded-xl bg-white/10 p-1.5 text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
              <button
                type="button"
                onClick={() => setListModalTab("minhas-listas")}
                className={`flex items-center gap-2 rounded-t-2xl border-b-2 px-4 py-2.5 text-xs font-extrabold transition ${
                  listModalTab === "minhas-listas"
                    ? "border-brand-green-700 bg-white text-brand-green-800"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <FolderHeart className="h-4 w-4 text-brand-orange-500" />
                <span>Minhas Listas Salvas ({savedLists.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setListModalTab("criar-inteligente")}
                className={`flex items-center gap-2 rounded-t-2xl border-b-2 px-4 py-2.5 text-xs font-extrabold transition ${
                  listModalTab === "criar-inteligente"
                    ? "border-brand-orange-500 bg-white text-brand-orange-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <ListPlus className="h-4 w-4 text-brand-orange-500" />
                <span>+ Criar Nova Lista do Zero (Passo a Passo)</span>
              </button>
              <button
                type="button"
                onClick={() => setListModalTab("digitar-manual")}
                className={`flex items-center gap-2 rounded-t-2xl border-b-2 px-4 py-2.5 text-xs font-extrabold transition ${
                  listModalTab === "digitar-manual"
                    ? "border-brand-orange-500 bg-white text-brand-orange-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <ListPlus className="h-4 w-4 text-brand-orange-500" />
                <span>Digitar Lista Manual</span>
              </button>
            </div>

            {listModalTab === "digitar-manual" ? (
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
                <form onSubmit={handleProcessManualList} className="space-y-3">
                  <label
                    htmlFor="manual-shopping-list"
                    className="block text-xs font-black uppercase tracking-wider text-slate-700"
                  >
                    Cole ou digite os produtos da sua lista
                  </label>
                  <textarea
                    id="manual-shopping-list"
                    rows={5}
                    value={manualListText}
                    onChange={(e) => setManualListText(e.target.value)}
                    placeholder={"Ex.: arroz, feijão, leite\nPão\n2. Café"}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-green-600 focus:outline-none"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] text-slate-500">
                      Separe os produtos por linha, vírgula ou ponto e vírgula.
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-green-700 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-brand-green-800"
                    >
                      <ListPlus className="h-4 w-4" />
                      <span>Montar lista</span>
                    </button>
                  </div>
                </form>

                {manualItems.length > 0 && (
                  <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-black text-slate-900">
                        Sua lista ({manualItems.length}{" "}
                        {manualItems.length === 1 ? "item" : "itens"})
                      </h4>
                      <button
                        type="button"
                        onClick={handleShareManualList}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-emerald-700"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Compartilhar no WhatsApp</span>
                      </button>
                    </div>
                    <ul className="divide-y divide-slate-200">
                      {manualItems.map((item, index) => (
                        <li
                          key={`${item.name}-${index}`}
                          className="flex items-center gap-3 py-2"
                        >
                          <input
                            type="checkbox"
                            checked={item.isChecked}
                            onChange={() =>
                              setManualItems((current) =>
                                current.map((entry, entryIndex) =>
                                  entryIndex === index
                                    ? { ...entry, isChecked: !entry.isChecked }
                                    : entry
                                )
                              )
                            }
                            aria-label={`Marcar ${item.name} como comprado`}
                            className="h-4 w-4 shrink-0 rounded accent-brand-green-700"
                          />
                          <span
                            className={`flex-1 text-sm ${
                              item.isChecked
                                ? "text-slate-400 line-through"
                                : "font-medium text-slate-800"
                            }`}
                          >
                            {item.name}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setManualItems((current) =>
                                current.filter((_, entryIndex) => entryIndex !== index)
                              )
                            }
                            aria-label={`Remover ${item.name} da lista`}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            ) : listModalTab === "criar-inteligente" ? (
              /* TAB 2: CRIAR LISTA DEFININDO PRIMEIRO O NOME E DEPOIS OS PRODUTOS */
              <form
                onSubmit={handleSaveSmartList}
                className="flex flex-1 flex-col overflow-hidden p-5 space-y-4"
              >
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                  <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-brand-green-900">
                    Passo 1: Defina o Nome da sua Lista de Compras *
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      required
                      value={builderListName}
                      onChange={(e) => setBuilderListName(e.target.value)}
                      placeholder='Ex: "Churrasco de Sábado", "Compras do Mês", "Aniversário"...'
                      className="flex-1 rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 focus:border-brand-green-600 focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-1">
                      {[
                        "Churrasco de Sábado",
                        "Compras do Mês",
                        "Feirinha de Quarta",
                        "Café da Manhã",
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setBuilderListName(preset)}
                          className="rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-brand-green-800 hover:bg-emerald-100"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Passo 2: Selecionar os Produtos Desejados */}
                <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Passo 2: Adicione os Produtos Desejados ({Object.keys(builderItems).length} selecionados)
                    </span>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={builderSearch}
                        onChange={(e) => setBuilderSearch(e.target.value)}
                        placeholder="Filtrar produto ou setor..."
                        className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1 text-xs text-slate-800 focus:border-brand-green-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-3 max-h-64">
                    {filteredBuilderProducts.map((prod) => {
                      const qty = builderItems[prod.id] || 0;
                      return (
                        <div
                          key={prod.id}
                          className={`flex items-center justify-between gap-3 rounded-xl p-2 transition ${
                            qty > 0 ? "bg-brand-green-50/70" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="h-10 w-10 rounded-lg object-cover border border-slate-200"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-800">
                                {prod.name}
                              </p>
                              <p className="text-[11px] font-semibold text-brand-green-700">
                                {formatBRL(prod.price)} / {prod.unit}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {qty === 0 ? (
                              <button
                                type="button"
                                onClick={() => handleBuilderQty(prod.id, 1)}
                                className="inline-flex items-center gap-1 rounded-lg bg-brand-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-green-700"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Incluir</span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-1 rounded-lg border border-brand-green-600 bg-white p-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleBuilderQty(prod.id, -1)}
                                  className="flex h-6 w-6 items-center justify-center rounded text-slate-700 hover:bg-slate-100"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-black text-brand-green-800">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleBuilderQty(prod.id, 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded bg-brand-green-600 text-white"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <button
                    type="button"
                    onClick={() => setListModalTab("minhas-listas")}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-brand-orange-600"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Salvar Lista &ldquo;{builderListName || "Nova"}&rdquo;</span>
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 1: MINHAS LISTAS SALVAS + GERAR CÓPIA + COMPARTILHAR WHATSAPP */
              <>
                {/* Save Current Cart Box */}
                <div className="border-b border-slate-200 bg-brand-green-50/60 p-4 px-6">
                  <form
                    onSubmit={handleSaveList}
                    className="flex flex-col gap-2.5 sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-extrabold text-brand-green-900">
                        Salvar carrinho atual ({totalItems} itens —{" "}
                        {formatBRL(subtotal)}) como lista rápida:
                      </label>
                      <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder='Ex: "Compras do Mês", "Churrasco de Sábado"...'
                        className="w-full rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-green-600 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={totalItems === 0}
                      className="inline-flex items-center justify-center gap-1.5 self-end rounded-xl bg-brand-green-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-brand-green-800 disabled:opacity-50"
                    >
                      <BookmarkPlus className="h-4 w-4 text-brand-orange-400" />
                      <span>Salvar do Carrinho</span>
                    </button>
                  </form>
                </div>

                {/* Saved Lists Collection */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-200 p-5 px-6">
                  {savedLists.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-sm font-bold text-slate-700">
                        Você ainda não possui listas salvas.
                      </p>
                      <button
                        type="button"
                        onClick={() => setListModalTab("criar-inteligente")}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand-orange-500 px-4 py-2 text-xs font-extrabold text-white"
                      >
                        <ListPlus className="h-4 w-4" />
                        <span>Criar Primeira Lista Inteligente</span>
                      </button>
                    </div>
                  ) : (
                    savedLists.map((list) => {
                      const listProducts = Object.entries(list.items)
                        .map(([id, qty]) => {
                          const prod = products.find((p) => p.id === id);
                          return prod ? { prod, qty } : null;
                        })
                        .filter(Boolean) as { prod: Product; qty: number }[];

                      const listCount = listProducts.reduce(
                        (acc, item) => acc + item.qty,
                        0
                      );
                      const listTotal = listProducts.reduce(
                        (acc, item) => acc + item.prod.price * item.qty,
                        0
                      );

                      return (
                        <div key={list.id} className="py-4 first:pt-0 last:pb-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black text-slate-900">
                                  {list.name}
                                </h4>
                                <span className="rounded-full bg-brand-green-100 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-green-800">
                                  {listCount}{" "}
                                  {listCount === 1 ? "item" : "itens"}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {list.createdAt} • Total estimado hoje:{" "}
                                <strong className="text-brand-green-700">
                                  {formatBRL(listTotal)}
                                </strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Botão 1: Gerar Cópia da Lista */}
                              <button
                                type="button"
                                onClick={() => handleDuplicateAndCopyList(list)}
                                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 transition hover:border-brand-green-500 hover:bg-brand-green-50 hover:text-brand-green-800"
                                title="Duplicar lista e copiar texto formatado"
                              >
                                {copiedListId === list.id ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 text-brand-green-600" />
                                    <span className="text-brand-green-700">
                                      Cópia Gerada!
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Gerar Cópia da Lista</span>
                                  </>
                                )}
                              </button>

                              {/* Botão 2: Compartilhar Lista no WhatsApp */}
                              <button
                                type="button"
                                onClick={() => handleShareListOnWhatsApp(list)}
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-[11px] font-extrabold text-white transition hover:bg-emerald-700"
                                title="Compartilhar lista formatada no WhatsApp"
                              >
                                <Share2 className="h-3.5 w-3.5" />
                                <span>Compartilhar no WhatsApp</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteSavedList(list.id)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                title="Excluir lista"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Product Thumbnails Preview */}
                          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {listProducts.map(({ prod, qty }) => (
                              <div
                                key={prod.id}
                                className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-2.5"
                              >
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="h-9 w-9 rounded-lg object-cover"
                                />
                                <div className="max-w-[120px]">
                                  <p className="truncate text-[11px] font-bold text-slate-800">
                                    {formatProductQuantity(prod, qty)} {prod.name}
                                  </p>
                                  <p className="text-[10px] font-semibold text-brand-green-700">
                                    {formatBRL(prod.price * qty)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Actions: Merge or Replace Cart */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                loadListIntoCart(list.id, "merge");
                                setIsListsModalOpen(false);
                                setIsCartDrawerOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-green-600 px-3.5 py-2 text-xs font-extrabold text-white shadow-xs transition hover:bg-brand-green-700"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Somar ao Carrinho Atual</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                loadListIntoCart(list.id, "replace");
                                setIsListsModalOpen(false);
                                setIsCartDrawerOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-brand-orange-400 hover:text-brand-orange-600"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>Substituir Carrinho por Esta Lista</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

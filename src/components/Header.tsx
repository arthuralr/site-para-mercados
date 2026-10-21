"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ChevronDown,
  ShoppingCart,
  Heart,
  Truck,
  Store,
  Clock,
  X,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Leaf,
  Newspaper,
  LayoutGrid,
  Home,
  FolderHeart,
  ShieldCheck,
  User,
  CreditCard,
  Megaphone,
  Smartphone,
  Eye,
  ChefHat,
} from "lucide-react";
import {
  StoreBranch,
  Product,
  TRENDING_SEARCHES,
} from "@/data/mockData";
import { useStore } from "@/context/StoreContext";
import { formatProductQuantity } from "@/lib/productUnits";
import { formatBRL } from "./ProductCard";
import CartDrawer from "./CartDrawer";
import PushPermissionBanner from "./PushPermissionBanner";

interface HeaderProps {
  branches: StoreBranch[];
  selectedBranch: StoreBranch;
  onSelectBranch: (branch: StoreBranch) => void;
  products: Product[];
  cart: Record<string, number>;
  favorites: string[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearProductFromCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({
  branches,
  selectedBranch,
  onSelectBranch,
  products,
  cart,
  favorites,
  onAddToCart,
  onToggleFavorite,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    setIsCartDrawerOpen,
    setIsListsModalOpen,
    savedLists,
    storeSettings,
    currentUser,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const [isFavDrawerOpen, setIsFavDrawerOpen] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup">(
    "delivery"
  );

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const branchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        branchContainerRef.current &&
        !branchContainerRef.current.contains(e.target as Node)
      ) {
        setIsBranchMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const autocompleteResults = normalizedQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedQuery) ||
          p.department.toLowerCase().includes(normalizedQuery) ||
          p.brand.toLowerCase().includes(normalizedQuery) ||
          (p.badge && p.badge.toLowerCase().includes(normalizedQuery))
      )
    : [];

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

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
    if (searchQuery.trim()) {
      router.push(`/catalogo?busca=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/catalogo");
    }
  };

  const topBarColorMap: Record<typeof storeSettings.topBarBgColor, string> = {
    orange: "bg-gradient-to-r from-brand-orange-600 via-brand-orange-500 to-amber-500 text-white",
    green: "bg-gradient-to-r from-brand-green-900 via-brand-green-700 to-emerald-600 text-white",
    red: "bg-gradient-to-r from-red-700 via-red-600 to-orange-600 text-white",
    slate: "bg-slate-900 text-white",
  };

  return (
    <>
      {/* Web Push Notifications Permission Banner & Real-Time Push Toast */}
      <PushPermissionBanner />

      <header className="sticky top-0 z-40 w-full bg-white shadow-soft">
        {/* 1. FAIXA DE AVISOS NO TOPO (TOPBAR CONFIGURÁVEL NO PAINEL DO GESTOR) */}
        {storeSettings.topBarEnabled && storeSettings.topBarText && (
          <div className={topBarColorMap[storeSettings.topBarBgColor]}>
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-1.5 text-center text-xs font-extrabold">
              <Megaphone className="h-3.5 w-3.5 shrink-0 animate-pulse" />
              <span>{storeSettings.topBarText}</span>
              {storeSettings.topBarCtaText && storeSettings.topBarCtaLink && (
                <Link
                  href={storeSettings.topBarCtaLink}
                  className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white underline-offset-2 hover:bg-white/30 hover:underline"
                >
                  {storeSettings.topBarCtaText} →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* 2. Top Utility & Quick Page Links Bar */}
        <div className="bg-brand-green-800 text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-xs">
            <div className="flex items-center gap-2.5">
              {!storeSettings.onlineShoppingEnabled ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-black text-slate-900">
                  <Eye className="h-3 w-3" /> Modo Vitrine & Panfleto de Ofertas
                </span>
              ) : (
                <span className="hidden items-center gap-1.5 text-emerald-100 xl:inline-flex">
                  <Truck className="h-3.5 w-3.5 text-brand-orange-400" />
                  Pedido mín.{" "}
                  <strong className="text-white">
                    {formatBRL(selectedBranch.minOrder)}
                  </strong>{" "}
                  • Frete Grátis acima de{" "}
                  <strong className="text-white">
                    {formatBRL(selectedBranch.freeShippingThreshold)}
                  </strong>
                </span>
              )}
            </div>

            {/* Quick Navigation Links */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 ml-auto">
              <Link
                href="/"
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                  pathname === "/"
                    ? "bg-white/15 text-white"
                    : "text-emerald-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Início</span>
              </Link>

              <Link
                href="/catalogo"
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                  pathname?.startsWith("/catalogo")
                    ? "bg-white text-brand-green-800 shadow-xs"
                    : "text-emerald-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Catálogo</span>
              </Link>

              <Link
                href="/panfleto-de-ofertas"
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition ${
                  pathname?.startsWith("/panfleto-de-ofertas")
                    ? "bg-brand-orange-500 text-white shadow-sm ring-2 ring-white/40"
                    : "bg-brand-orange-500/90 text-white hover:bg-brand-orange-500"
                }`}
              >
                <Newspaper className="h-3.5 w-3.5" />
                <span>Panfleto de Ofertas</span>
              </Link>

              <Link
                href="/receitas"
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                  pathname?.startsWith("/receitas")
                    ? "bg-white text-brand-green-800 shadow-xs"
                    : "text-emerald-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <ChefHat className="h-3.5 w-3.5" />
                <span>Receitas</span>
              </Link>

              {storeSettings.discountClubEnabled && (
                <Link
                  href="/clube-descontos"
                  className={`hidden md:inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                    pathname?.startsWith("/clube-descontos")
                      ? "bg-white text-brand-green-800"
                      : "text-emerald-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-brand-orange-400" />
                  <span>Clube</span>
                </Link>
              )}

              {storeSettings.storeCardEnabled && (
                <Link
                  href="/cartao-loja"
                  className={`hidden md:inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                    pathname?.startsWith("/cartao-loja")
                      ? "bg-white text-brand-green-800"
                      : "text-emerald-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5 text-brand-orange-400" />
                  <span>Cartão da Loja</span>
                </Link>
              )}

              <Link
                href="/bio"
                className={`hidden lg:inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                  pathname?.startsWith("/bio")
                    ? "bg-white text-brand-green-800"
                    : "text-emerald-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5 text-brand-orange-400" />
                <span>Bio Insta</span>
              </Link>

              <Link
                href="/admin"
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-extrabold transition ${
                  pathname?.startsWith("/admin")
                    ? "border-amber-300 bg-amber-400 text-slate-900 shadow-xs"
                    : "border-emerald-600/80 bg-brand-green-900/80 text-amber-300 hover:bg-brand-green-950"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Painel Gestor</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="border-b border-slate-100 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            {/* Top row on mobile: Logo + Branch Selector + Shortcuts */}
            <div className="flex items-center justify-between gap-2.5">
              {/* Brand Logo */}
              <Link
                href="/"
                className="flex items-center gap-2.5 focus:outline-none"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-green-600 to-brand-green-800 text-white shadow-sm">
                  <Leaf className="h-6 w-6 text-brand-orange-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-black tracking-tight text-brand-green-800">
                      Super<span className="text-brand-orange-500">Verde</span>
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Mercado & Hortifrúti
                  </p>
                </div>
              </Link>

              {/* Branch Selector Dropdown */}
              <div ref={branchContainerRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsBranchMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-left transition hover:border-brand-green-500 hover:bg-brand-green-50/40"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-green-100 text-brand-green-700">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block max-w-[160px] xl:max-w-[200px]">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Filial / Loja Ativa
                    </span>
                    <span className="block truncate text-xs font-bold text-slate-800">
                      {selectedBranch.name}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform ${
                      isBranchMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isBranchMenuOpen && (
                  <div className="absolute left-0 right-auto mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50">
                    <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          Escolha a Filial
                        </h4>
                        <p className="text-xs text-slate-500">
                          Preços, pedido mínimo e tempo de entrega conforme a unidade
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsBranchMenuOpen(false)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {branches.map((branch) => {
                        const isSelected = branch.id === selectedBranch.id;
                        return (
                          <button
                            key={branch.id}
                            type="button"
                            onClick={() => {
                              onSelectBranch(branch);
                              setIsBranchMenuOpen(false);
                            }}
                            className={`w-full rounded-xl border p-3 text-left transition ${
                              isSelected
                                ? "border-brand-green-600 bg-brand-green-50/70"
                                : "border-slate-200 hover:border-brand-green-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-start justify-end gap-2">
                              {isSelected && (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-green-600" />
                              )}
                            </div>
                            <p className="mt-1 text-xs font-bold text-slate-800">
                              {branch.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {branch.address}
                            </p>
                            <div className="mt-2 flex items-center gap-3 text-[11px] font-medium text-brand-green-700">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />{" "}
                                {branch.deliveryTime}
                              </span>
                              <span>•</span>
                              <span>
                                Pedido mín. {formatBRL(branch.minOrder)}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Shortcuts (Conta, Listas, Favoritos & Carrinho) */}
              <div className="flex items-center gap-1.5 lg:hidden">
                <Link
                  href="/conta"
                  aria-label="Minha Conta"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                >
                  <User className="h-5 w-5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsListsModalOpen(true)}
                  aria-label="Listas de Compras Inteligentes"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-brand-green-700"
                >
                  <FolderHeart className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green-700 text-[9px] font-bold text-white">
                    {savedLists.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFavDrawerOpen(true)}
                  aria-label="Favoritos"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                >
                  <Heart className="h-5 w-5" />
                  {favorites.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange-500 text-[9px] font-bold text-white">
                      {favorites.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(true)}
                  aria-label="Abrir carrinho"
                  className="relative flex items-center gap-1.5 rounded-xl bg-brand-green-600 px-3 py-2 text-white shadow-sm hover:bg-brand-green-700"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-xs font-extrabold">{totalItems}</span>
                </button>
              </div>
            </div>

            {/* Smart Search Bar with Simulated Autocomplete */}
            <div ref={searchContainerRef} className="relative flex-1">
              <form
                onSubmit={handleSearchSubmit}
                className={`flex items-center rounded-2xl border-2 bg-slate-50/90 px-3.5 py-2 transition-all ${
                  isSearchOpen
                    ? "border-brand-green-600 bg-white ring-4 ring-brand-green-500/10"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Search className="h-5 w-5 shrink-0 text-brand-green-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  placeholder="Busque por produto, marca ou restrição (ex: picanha, zero lactose, azeite)..."
                  className="w-full bg-transparent px-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange("")}
                    aria-label="Limpar busca"
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="hidden sm:inline-flex items-center gap-1 rounded-xl bg-brand-orange-500 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-brand-orange-600"
                >
                  Buscar
                </button>
              </form>

              {isSearchOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl z-50">
                  {!normalizedQuery ? (
                    <div className="p-4">
                      <div className="mb-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                          <TrendingUp className="h-4 w-4 text-brand-orange-500" />
                          <span>Termos mais buscados hoje</span>
                        </div>
                        <Link
                          href="/catalogo"
                          onClick={() => setIsSearchOpen(false)}
                          className="text-xs font-bold text-brand-green-700 hover:underline"
                        >
                          Ver catálogo completo →
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {TRENDING_SEARCHES.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => onSearchChange(term)}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-brand-green-500 hover:bg-brand-green-50 hover:text-brand-green-700"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : autocompleteResults.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                      <div className="flex items-center justify-between bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">
                        <span>
                          Sugestões instantâneas ({autocompleteResults.length})
                        </span>
                        <Link
                          href={`/catalogo?busca=${encodeURIComponent(
                            searchQuery
                          )}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="font-bold text-brand-green-700 hover:underline"
                        >
                          Filtrar no Catálogo →
                        </Link>
                      </div>
                      {autocompleteResults.slice(0, 6).map((item) => {
                        const qty = cart[item.id] || 0;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-slate-50"
                          >
                            <Link
                              href={`/produto/${item.id}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center gap-3 min-w-0 flex-1"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-12 w-12 shrink-0 rounded-lg object-cover border border-slate-100"
                              />
                              <div className="min-w-0">
                                <span className="inline-block rounded bg-brand-green-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-green-700">
                                  {item.department} • {item.weightVolume}
                                </span>
                                <p className="truncate text-sm font-semibold text-slate-800 hover:text-brand-green-700">
                                  {item.name}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-extrabold text-brand-green-700">
                                    {formatBRL(item.price)}
                                  </span>
                                  {item.oldPrice && (
                                    <span className="text-xs text-slate-400 line-through">
                                      {formatBRL(item.oldPrice)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>

                            {storeSettings.onlineShoppingEnabled && (
                              <button
                                type="button"
                                onClick={() => onAddToCart(item)}
                                className="flex shrink-0 items-center gap-1 rounded-xl bg-brand-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-green-700"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                <span>
                                  {qty > 0
                                    ? `No carrinho (${formatProductQuantity(item, qty)})`
                                    : "Adicionar"}
                                </span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-sm font-semibold text-slate-700">
                        Nenhum produto encontrado para &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Tente buscar por &ldquo;Picanha&rdquo;, &ldquo;Morango&rdquo;, &ldquo;Azeite&rdquo; ou &ldquo;Zero Lactose&rdquo;.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Shortcuts: Minha Conta, Listas Inteligentes, Favoritos & Carrinho */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Customer Account Login / Profile Button */}
              <Link
                href="/conta"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:border-brand-green-500 hover:bg-brand-green-50/40"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-brand-green-700">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {currentUser ? "Cliente Logado" : "Bem-vindo(a)"}
                  </span>
                  <span className="block max-w-[100px] truncate text-xs font-bold text-slate-800">
                    {currentUser
                      ? currentUser.name.split(" ")[0]
                      : "Entrar / Conta"}
                  </span>
                </div>
              </Link>

              {/* Smart Shopping Lists Button */}
              <button
                type="button"
                onClick={() => setIsListsModalOpen(true)}
                className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:border-brand-green-500 hover:bg-brand-green-50/40"
              >
                <div className="relative">
                  <FolderHeart className="h-5 w-5 text-brand-green-700" />
                  <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green-700 text-[10px] font-bold text-white">
                    {savedLists.length}
                  </span>
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Inteligentes
                  </span>
                  <span className="block text-xs font-bold text-slate-800">
                    Minhas Listas
                  </span>
                </div>
              </button>

              {/* Favorites Button */}
              <button
                type="button"
                onClick={() => setIsFavDrawerOpen(true)}
                className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:border-brand-orange-400 hover:bg-brand-orange-50/40"
              >
                <div className="relative">
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.length > 0
                        ? "fill-brand-orange-500 text-brand-orange-500"
                        : "text-slate-600"
                    }`}
                  />
                  {favorites.length > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange-500 text-[10px] font-bold text-white">
                      {favorites.length}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Salvos
                  </span>
                  <span className="block text-xs font-bold text-slate-800">
                    Favoritos
                  </span>
                </div>
              </button>

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-2.5 rounded-xl bg-brand-green-600 px-3.5 py-2 text-white shadow-sm transition hover:bg-brand-green-700"
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green-700">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange-500 text-[11px] font-extrabold text-white shadow">
                    {totalItems}
                  </span>
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-100">
                    {storeSettings.onlineShoppingEnabled
                      ? "Meu Carrinho"
                      : "Sacola Vitrine"}
                  </span>
                  <span className="block text-sm font-extrabold leading-tight">
                    {formatBRL(subtotal)}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-Over Cart & Smart Lists Modal */}
      <CartDrawer />

      {/* Slide-Over Favorites Drawer */}
      {isFavDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-brand-orange-500 px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 fill-white" />
                <h3 className="text-base font-bold">
                  Meus Produtos Favoritos ({favoriteProducts.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFavDrawerOpen(false)}
                className="rounded-lg bg-brand-orange-600 p-1.5 text-white hover:bg-brand-orange-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-4">
              {favoriteProducts.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <Heart className="mb-3 h-12 w-12 text-slate-300" />
                  <h4 className="text-base font-bold text-slate-700">
                    Nenhum favorito salvo ainda
                  </h4>
                  <p className="mt-1 max-w-xs text-xs text-slate-500">
                    Clique no ícone de coração nos produtos para favoritá-los.
                  </p>
                </div>
              ) : (
                favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <Link
                      href={`/produto/${product.id}`}
                      onClick={() => setIsFavDrawerOpen(false)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-14 rounded-xl object-cover border border-slate-100"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/produto/${product.id}`}
                        onClick={() => setIsFavDrawerOpen(false)}
                        className="line-clamp-1 text-xs font-bold text-slate-800 hover:text-brand-green-700"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm font-extrabold text-brand-green-700">
                        {formatBRL(product.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {storeSettings.onlineShoppingEnabled && (
                        <button
                          type="button"
                          onClick={() => onAddToCart(product)}
                          className="rounded-lg bg-brand-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-green-700"
                        >
                          + Carrinho
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(product.id)}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

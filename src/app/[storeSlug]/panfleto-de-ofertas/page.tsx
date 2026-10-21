"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Newspaper,
  ShoppingCart,
  Plus,
  Minus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Eye,
  CheckCircle2,
  Calendar,
  BookOpen,
  LayoutGrid,
  X,
  BadgePercent,
} from "lucide-react";
import Header from "@/components/Header";
import DepartmentNav from "@/components/DepartmentNav";
import { formatBRL } from "@/components/ProductCard";
import Footer from "@/components/Footer";
import StoreFlashDeals from "@/components/StoreFlashDeals";
import { DEPARTMENTS, Product } from "@/data/mockData";
import { useStore } from "@/context/StoreContext";
import {
  formatProductQuantity,
  formatWeightOption,
  isSoldByWeight,
  WEIGHT_OPTIONS_KG,
} from "@/lib/productUnits";

type TabloidPageKey =
  | "todas"
  | "capa"
  | "hortifruti"
  | "acougue-bebidas"
  | "mercearia-limpeza";

const TABLOID_PAGES: {
  key: TabloidPageKey;
  pageNumber: string;
  title: string;
  subtitle: string;
  headerBg: string;
  badgeText: string;
}[] = [
  {
    key: "capa",
    pageNumber: "Pág. 01",
    title: "Capa de Ofertas — Campeões da Semana",
    subtitle: "Os maiores descontos da rede selecionados para abastecer sua casa",
    headerBg: "from-brand-orange-600 via-brand-orange-500 to-amber-500",
    badgeText: "DESTAQUES DE CAPA",
  },
  {
    key: "hortifruti",
    pageNumber: "Pág. 02",
    title: "Quarta & Quinta Verde — Direto da Roça",
    subtitle: "Frutas, legumes e verduras fresquinhos colhidos hoje com até 42% OFF",
    headerBg: "from-brand-green-800 via-brand-green-700 to-emerald-600",
    badgeText: "ESPECIAL HORTIFRÚTI",
  },
  {
    key: "acougue-bebidas",
    pageNumber: "Pág. 03",
    title: "Festival do Churrasco & Bebidas Geladas",
    subtitle: "Cortes nobres maturados, linguiça artesanal, pão de alho e cervejas puro malte",
    headerBg: "from-red-900 via-red-800 to-brand-orange-700",
    badgeText: "AÇOUGUE & CERVEJAS",
  },
  {
    key: "mercearia-limpeza",
    pageNumber: "Pág. 04",
    title: "Quinzena da Despensa & Limpeza Pesada",
    subtitle: "Tamanhos família e embalagens econômicas para o mês inteiro",
    headerBg: "from-sky-900 via-brand-green-800 to-emerald-700",
    badgeText: "ECONOMIA DO MÊS",
  },
];

export default function DigitalOffersFlyerPage() {
  const {
    branches,
    selectedBranch,
    setSelectedBranch,
    products,
    cart,
    favorites,
    searchQuery,
    setSearchQuery,
    addToCart,
    removeFromCart,
    clearProductFromCart,
    toggleFavorite,
    tabloidEditions,
    incrementTabloidView,
    setIsCartDrawerOpen,
  } = useStore();

  const hasCountedViewRef = useRef(false);
  useEffect(() => {
    if (!hasCountedViewRef.current) {
      hasCountedViewRef.current = true;
      incrementTabloidView();
    }
  }, [incrementTabloidView]);

  const activeEdition =
    tabloidEditions.find((t) => t.isActive) || tabloidEditions[0];

  const [activePage, setActivePage] = useState<TabloidPageKey>("capa");
  const [viewMode, setViewMode] = useState<"folheto" | "grade">("folheto");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [quickViewWeightKg, setQuickViewWeightKg] = useState<number>(0.5);
  const quickViewCloseButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!quickViewProduct) return;

    const previouslyFocused = document.activeElement;
    quickViewCloseButtonRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setQuickViewProduct(null);
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [quickViewProduct]);

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuickViewWeightKg(0.5);
  };

  const currentPageIndex = TABLOID_PAGES.findIndex((p) => p.key === activePage);
  const activePageMeta =
    TABLOID_PAGES[currentPageIndex] || TABLOID_PAGES[0];

  const pageProducts =
    activePage === "todas"
      ? products
      : products.filter((p) => p.tabloidPage === activePage);

  const highlightProducts = pageProducts.filter((p) => p.tabloidHighlight);
  const regularTabloidProducts = pageProducts.filter((p) => !p.tabloidHighlight);

  const handlePrevPage = () => {
    if (activePage === "todas") {
      setActivePage("capa");
      return;
    }
    const prevIdx =
      (currentPageIndex - 1 + TABLOID_PAGES.length) % TABLOID_PAGES.length;
    setActivePage(TABLOID_PAGES[prevIdx].key);
  };

  const handleNextPage = () => {
    if (activePage === "todas") {
      setActivePage("capa");
      return;
    }
    const nextIdx = (currentPageIndex + 1) % TABLOID_PAGES.length;
    setActivePage(TABLOID_PAGES[nextIdx].key);
  };

  const handleAddAllPageToCart = () => {
    pageProducts.forEach((p) => addToCart(p));
  };

  // Selecting an offer opens its quick view; purchase controls remain available in the card.
  const renderTabloidCutout = (product: Product, isHeroCutout = false) => {
    const qty = cart[product.id] || 0;
    const [integerReais, centsReais] = product.price
      .toFixed(2)
      .replace(".", ",")
      .split(",");

    return (
      <div
        key={product.id}
        onClick={() => openQuickView(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (
            e.target === e.currentTarget &&
            (e.key === "Enter" || e.key === " ")
          ) {
            e.preventDefault();
            openQuickView(product);
          }
        }}
        aria-label={`Ver oferta de ${product.name}`}
        className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl transition-all duration-200 hover:-translate-y-1 ${
          isHeroCutout
            ? "border-4 border-dashed border-brand-orange-500 bg-gradient-to-b from-amber-50/90 via-white to-white p-5 shadow-xl"
            : "border-2 border-dashed border-brand-green-600/50 bg-white p-4 shadow-card hover:border-brand-orange-500 hover:shadow-xl"
        } ${qty > 0 ? "ring-4 ring-brand-green-500/40" : ""}`}
      >
        {/* Top Row: Explosive Discount Burst + Cart Status */}
        <div className="flex items-start justify-between gap-2 z-10">
          {product.discountPercent ? (
            <div className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md">
              <Flame className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              <span>-{product.discountPercent}% NO PANFLETO DE OFERTAS</span>
            </div>
          ) : (
            <span />
          )}

          {qty > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-green-700 px-3 py-1 text-xs font-extrabold text-white shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
              No Carrinho ({formatProductQuantity(product, qty)})
            </span>
          ) : (
            <span className="rounded-full bg-brand-orange-100 px-2.5 py-1 text-[11px] font-extrabold text-brand-orange-700 group-hover:bg-brand-orange-500 group-hover:text-white transition">
              Clique p/ Adicionar +
            </span>
          )}
        </div>

        {/* Product Image & Classic Supermarket Price Splash */}
        <div className="relative my-3 flex flex-col items-center">
          <div
            className={`relative overflow-hidden rounded-2xl bg-white ${
              isHeroCutout ? "h-48 w-48 sm:h-56 sm:w-56" : "h-40 w-40"
            }`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Supermarket Flyer Yellow/Red Price Burst Tag */}
          <div className="mt-3 w-full rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 p-3 text-center shadow-md">
            {product.oldPrice && (
              <p className="text-xs font-bold text-red-800 line-through">
                De {formatBRL(product.oldPrice)} por apenas:
              </p>
            )}
            <div className="flex items-start justify-center font-black leading-none text-red-700">
              <span className="mt-1 mr-0.5 text-sm font-extrabold">R$</span>
              <span className={isHeroCutout ? "text-5xl" : "text-4xl"}>
                {integerReais}
              </span>
              <div className="flex flex-col items-start ml-0.5">
                <span className="text-lg">,{centsReais}</span>
                <span className="text-[10px] font-bold uppercase text-slate-800">
                  {product.unit}
                </span>
              </div>
            </div>
            {product.clubPrice && (
              <p className="mt-1 rounded-md bg-brand-green-800 px-2 py-0.5 text-[11px] font-extrabold text-white">
                No Clube SuperVerde: {formatBRL(product.clubPrice)}
              </p>
            )}
          </div>
        </div>

        {/* Product Title & Details */}
        <div className="text-center">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-green-700">
            {product.brand} • {product.weightVolume}
          </span>
          <h3
            className={`mt-0.5 font-extrabold text-slate-900 line-clamp-2 ${
              isHeroCutout ? "text-base sm:text-lg" : "text-sm"
            }`}
          >
            {product.name}
          </h3>
          {product.tabloidLimitPerCustomer && (
            <p className="mt-1 text-[11px] font-medium text-slate-500">
              Limite: {product.tabloidLimitPerCustomer} unidades por cliente
            </p>
          )}
        </div>

        {/* Interactive Footer Controls (Stop Propagation for Fine Control or Detail Link) */}
        <div
          className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href={`/produto/${product.id}`}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-green-600 hover:text-brand-green-700"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Detalhes</span>
          </Link>

          {qty === 0 ? (
            <button
              ref={quickViewCloseButtonRef}
              type="button"
              onClick={() => addToCart(product)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-green-600 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-brand-green-700"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Jogar no Carrinho</span>
            </button>
          ) : (
            <div className="flex flex-1 items-center justify-between rounded-xl border-2 border-brand-green-600 bg-brand-green-50 px-2 py-1">
              <button
                type="button"
                onClick={() => removeFromCart(product.id)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-brand-green-700 shadow-xs hover:bg-red-50 hover:text-red-600"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs font-black text-brand-green-800">
                {formatProductQuantity(product, qty)}
              </span>
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-green-600 text-white shadow-xs hover:bg-brand-green-700"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header
        branches={branches}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
        products={products}
        cart={cart}
        favorites={favorites}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onClearProductFromCart={clearProductFromCart}
        onToggleFavorite={toggleFavorite}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <DepartmentNav
        departments={DEPARTMENTS}
        selectedDepartment={null}
        onSelectDepartment={() => {}}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <StoreFlashDeals />

        {/* Panfleto de Ofertas masthead */}
        <div className="mb-6 overflow-hidden rounded-3xl border-2 border-brand-orange-400 bg-white shadow-soft">
          <div className="bg-gradient-to-r from-brand-green-900 via-brand-green-800 to-brand-green-700 p-6 text-white sm:p-8">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                    <Newspaper className="h-3.5 w-3.5" />
                    Panfleto de Ofertas Digital
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-emerald-100">
                    <Calendar className="h-3.5 w-3.5 text-brand-orange-400" />
                    {activeEdition?.validity || `Válido para ${selectedBranch.name}`}
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
                  {activeEdition?.title || "Panfleto de Ofertas da Semana"}
                </h1>
                <p className="max-w-2xl text-xs text-emerald-100 sm:text-sm">
                  Clique diretamente sobre qualquer oferta do Panfleto de Ofertas para adicioná-la instantaneamente ao seu carrinho de compras!
                </p>
              </div>

              {/* View Mode Switcher & Add Entire Page CTA */}
              <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
                <div className="flex items-center rounded-2xl bg-brand-green-950/80 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("folheto")}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${
                      viewMode === "folheto"
                        ? "bg-brand-orange-500 text-white shadow-sm"
                        : "text-emerald-200 hover:text-white"
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Modo Folheto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("grade")}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${
                      viewMode === "grade"
                        ? "bg-brand-orange-500 text-white shadow-sm"
                        : "text-emerald-200 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Grade Completa</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddAllPageToCart}
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-900 shadow-md transition hover:bg-amber-300"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Levar Toda a Página ({pageProducts.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Page tabs for browsing the offers flyer */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto border-t border-slate-100 bg-slate-50 px-4 py-3 no-scrollbar">
            <div className="flex items-center gap-2">
              {TABLOID_PAGES.map((page) => {
                const isActive = activePage === page.key;
                return (
                  <button
                    key={page.key}
                    type="button"
                    onClick={() => setActivePage(page.key)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-left transition ${
                      isActive
                        ? "border-brand-green-700 bg-brand-green-700 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-brand-green-500"
                    }`}
                  >
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${
                        isActive
                          ? "bg-brand-orange-500 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {page.pageNumber}
                    </span>
                    <span className="text-xs font-extrabold">
                      {page.title.split("—")[0]}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setActivePage("todas")}
                className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs font-extrabold transition ${
                  activePage === "todas"
                    ? "border-brand-orange-500 bg-brand-orange-500 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-brand-orange-400"
                }`}
              >
                Ver Todas as Ofertas ({products.length})
              </button>
            </div>

            {/* Prev / Next Flyer Page Buttons */}
            <div className="hidden items-center gap-1.5 md:flex">
              <button
                type="button"
                onClick={handlePrevPage}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Pág. Anterior</span>
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <span>Próxima Pág.</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Simulated Printed Flyer Sheet Container */}
        <div className="rounded-3xl border-4 border-white bg-gradient-to-b from-amber-50/50 via-white to-slate-50 p-4 shadow-2xl sm:p-8">
          {/* Flyer Page Banner Header */}
          {activePage !== "todas" && (
            <div
              className={`mb-6 flex flex-col justify-between gap-2 rounded-2xl bg-gradient-to-r ${activePageMeta.headerBg} p-5 text-white shadow-md sm:flex-row sm:items-center`}
            >
              <div>
                <span className="inline-flex items-center gap-1 rounded-md bg-black/25 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-amber-300">
                  <Sparkles className="h-3 w-3" /> {activePageMeta.pageNumber} •{" "}
                  {activePageMeta.badgeText}
                </span>
                <h2 className="mt-1 text-xl font-black sm:text-2xl">
                  {activePageMeta.title}
                </h2>
                <p className="text-xs text-white/90">{activePageMeta.subtitle}</p>
              </div>
              <div className="rounded-xl bg-white/15 px-3.5 py-2 text-center backdrop-blur-xs">
                <span className="block text-[10px] font-bold uppercase text-white/80">
                  Toque no Item
                </span>
                <span className="text-xs font-black text-amber-300">
                  Compra Instantânea 🛒
                </span>
              </div>
            </div>
          )}

          {viewMode === "folheto" ? (
            <div className="space-y-6">
              {/* Highlighted Cover Deals (Big Flyer Cutouts) */}
              {highlightProducts.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-black uppercase text-white">
                      Super Destaques do Folheto
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Clique sobre o selo amarelo de preço para adicionar ao carrinho
                    </span>
                  </div>
                  <div
                    className={`grid grid-cols-1 gap-5 ${
                      highlightProducts.length === 1
                        ? "md:grid-cols-1 max-w-xl mx-auto"
                        : "md:grid-cols-2"
                    }`}
                  >
                    {highlightProducts.map((product) =>
                      renderTabloidCutout(product, true)
                    )}
                  </div>
                </div>
              )}

              {/* Regular Flyer Cutouts Grid */}
              {regularTabloidProducts.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-lg bg-brand-green-700 px-2.5 py-1 text-xs font-black uppercase text-white">
                      Mais Ofertas Desta Página
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {regularTabloidProducts.map((product) =>
                      renderTabloidCutout(product, false)
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Special weekly offers flyer grid */
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {pageProducts.map((product) => renderTabloidCutout(product, false))}
            </div>
          )}

          {/* Bottom Flyer Page Turn Navigation */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-slate-200 pt-5">
            <button
              type="button"
              onClick={handlePrevPage}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-extrabold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Virar para Página Anterior</span>
            </button>

            <p className="text-center text-xs font-bold text-slate-500">
               Fotos meramente ilustrativas. Ofertas garantidas para pedidos finalizados hoje no site ou aplicativo.
            </p>

            <button
              type="button"
              onClick={handleNextPage}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-orange-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-brand-orange-600"
            >
              <span>Virar para Próxima Página</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>

      <Footer selectedBranch={selectedBranch} />

      {quickViewProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setQuickViewProduct(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-quick-view-title"
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Fechar detalhes da oferta"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow hover:bg-white hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid sm:grid-cols-2">
              <div className="relative min-h-56 bg-slate-100 sm:min-h-full">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {quickViewProduct.discountPercent ? (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-black text-white shadow">
                    <BadgePercent className="h-4 w-4" />
                    {quickViewProduct.discountPercent}% OFF
                  </span>
                ) : null}
              </div>

              <div className="p-5 sm:p-6">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-green-700">
                  {quickViewProduct.brand} · {quickViewProduct.weightVolume}
                </span>
                <h2
                  id="offer-quick-view-title"
                  className="mt-1.5 text-lg font-black leading-snug text-slate-900"
                >
                  {quickViewProduct.name}
                </h2>

                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  {quickViewProduct.oldPrice && (
                    <p className="text-xs font-semibold text-slate-500">
                      De{" "}
                      <span className="line-through">
                        {formatBRL(quickViewProduct.oldPrice)}
                      </span>
                    </p>
                  )}
                  <p className="mt-0.5 text-3xl font-black text-red-700">
                    {formatBRL(quickViewProduct.price)}
                  </p>
                  <p className="text-xs font-bold text-slate-600">
                    por {isSoldByWeight(quickViewProduct) ? "kg" : quickViewProduct.unit}
                  </p>
                  {isSoldByWeight(quickViewProduct) && (
                    <div className="mt-3">
                      <label
                        htmlFor="offer-quick-view-weight"
                        className="text-xs font-bold text-slate-700"
                      >
                        Quantidade desejada
                      </label>
                      <select
                        id="offer-quick-view-weight"
                        value={quickViewWeightKg}
                        onChange={(event) =>
                          setQuickViewWeightKg(Number(event.target.value))
                        }
                        className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                      >
                        {WEIGHT_OPTIONS_KG.map((weight) => (
                          <option key={weight} value={weight}>
                            {formatWeightOption(weight)}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1.5 text-xs font-bold text-brand-green-800">
                        Total estimado:{" "}
                        {formatBRL(quickViewProduct.price * quickViewWeightKg)}
                      </p>
                    </div>
                  )}
                  {quickViewProduct.clubPrice && (
                    <p className="mt-2 rounded-lg bg-brand-green-800 px-2.5 py-1.5 text-xs font-extrabold text-white">
                      Clube SuperVerde: {formatBRL(quickViewProduct.clubPrice)}
                    </p>
                  )}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Oferta válida conforme o período e as condições exibidas no
                  Panfleto de Ofertas.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(
                      quickViewProduct,
                      isSoldByWeight(quickViewProduct)
                        ? quickViewWeightKg
                        : 1
                    );
                    setQuickViewProduct(null);
                    setIsCartDrawerOpen(true);
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green-700 px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-brand-green-800"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Adicionar ao Carrinho
                </button>
                <Link
                  href={`/produto/${quickViewProduct.id}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="mt-2 block rounded-xl border border-slate-200 px-4 py-2.5 text-center text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Ver detalhes do produto
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

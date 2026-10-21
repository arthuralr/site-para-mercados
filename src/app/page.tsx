"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Leaf, ShieldCheck, Truck } from "lucide-react";
import DepartmentNav from "@/components/DepartmentNav";
import FlyerSection from "@/components/FlyerSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import { DEPARTMENTS } from "@/data/mockData";
import { useStore } from "@/context/StoreContext";

export default function HomePage() {
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
    heroBanners,
  } = useStore();
  const banner = heroBanners[0];
  const featuredProducts = [...products]
    .sort((first, second) => second.rating - first.rating)
    .slice(0, 10);

  return (
    <>
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
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-green-950 via-brand-green-800 to-emerald-700 text-white shadow-lg">
          {banner?.image && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center opacity-25"
              style={{ backgroundImage: `url("${banner.image}")` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-950/95 via-brand-green-900/85 to-brand-green-800/30" />
          <div className="relative max-w-3xl px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-100">
              {banner?.tag || "SuperVerde • Mercado e hortifrúti"}
            </span>
            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              {banner?.title || "Tudo fresquinho para a sua casa"}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
              {banner?.subtitle ||
                "Faça suas compras online com praticidade, qualidade e ofertas todos os dias."}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-brand-orange-600"
              >
                Comprar agora
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/panfleto-de-ofertas"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Ver panfleto de ofertas
              </Link>
            </div>
          </div>
        </section>

        <section
          aria-label="Benefícios SuperVerde"
          className="grid gap-3 py-5 sm:grid-cols-3"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <span className="rounded-xl bg-emerald-50 p-2.5 text-brand-green-700">
              <Truck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-slate-800">
                Entrega rápida
              </p>
              <p className="text-xs text-slate-500">
                Receba em {selectedBranch.deliveryTime}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <span className="rounded-xl bg-orange-50 p-2.5 text-brand-orange-600">
              <Leaf className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-slate-800">
                Fresquinho todo dia
              </p>
              <p className="text-xs text-slate-500">
                Seleção de qualidade para você
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-slate-800">
                Compra segura
              </p>
              <p className="text-xs text-slate-500">
                Pague do seu jeito no checkout
              </p>
            </div>
          </div>
        </section>

        <FlyerSection />

        <ProductGrid
          title="Mais queridos da semana"
          description="Produtos selecionados pelos nossos clientes."
          products={featuredProducts}
          moreHref="/catalogo"
        />

        <section className="mb-12 flex flex-col items-start justify-between gap-4 rounded-3xl bg-brand-green-50 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-white p-3 text-brand-green-700 shadow-sm">
              <Clock3 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-brand-green-900">
                Seu mercado, do seu jeito
              </h2>
              <p className="mt-1 text-sm text-brand-green-800/80">
                Escolha a loja, monte seu carrinho e receba em casa ou retire na
                unidade.
              </p>
            </div>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-green-800"
          >
            Explorar catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <Footer selectedBranch={selectedBranch} />
    </>
  );
}

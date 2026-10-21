"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal,
  X,
  Check,
  ArrowUpDown,
  ChevronRight,
  RotateCcw,
  Leaf,
  Tag,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import DepartmentNav from "@/components/DepartmentNav";
import ProductCard, { formatBRL } from "@/components/ProductCard";
import Footer from "@/components/Footer";
import {
  DEPARTMENTS,
  ALL_BRANDS,
  ALL_DIETARY_RESTRICTIONS,
  DietaryRestriction,
} from "@/data/mockData";
import { useStore } from "@/context/StoreContext";

type PriceRangeKey = "all" | "up-to-15" | "15-to-35" | "above-35";
type SortOption = "relevance" | "price-asc" | "price-desc" | "discount";

function CatalogContent() {
  const searchParams = useSearchParams();
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
  } = useStore();

  // Filter States
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRangeKey>("all");
  const [maxPriceSlider, setMaxPriceSlider] = useState<number>(100);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<DietaryRestriction[]>([]);
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync URL query params on mount/change
  useEffect(() => {
    const depParam = searchParams.get("departamento");
    const buscaParam = searchParams.get("busca");
    if (depParam) {
      setSelectedDepartments([depParam]);
    }
    if (buscaParam !== null) {
      setSearchQuery(buscaParam);
    }
  }, [searchParams, setSearchQuery]);

  const toggleDepartment = (depName: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(depName)
        ? prev.filter((d) => d !== depName)
        : [...prev, depName]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleDietary = (restriction: DietaryRestriction) => {
    setSelectedDietary((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  const clearAllFilters = () => {
    setSelectedDepartments([]);
    setPriceRange("all");
    setMaxPriceSlider(100);
    setSelectedBrands([]);
    setSelectedDietary([]);
    setOnlyOffers(false);
    setSearchQuery("");
  };

  // Apply all filters & sorting
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = useMemo(
    () =>
      products
        .filter((product) => {
          if (normalizedSearchQuery) {
            const match =
              product.name.toLowerCase().includes(normalizedSearchQuery) ||
              product.department
                .toLowerCase()
                .includes(normalizedSearchQuery) ||
              product.brand.toLowerCase().includes(normalizedSearchQuery) ||
              product.dietary.some((diet) =>
                diet.toLowerCase().includes(normalizedSearchQuery)
              );
            if (!match) return false;
          }

          if (
            selectedDepartments.length > 0 &&
            !selectedDepartments.includes(product.department)
          ) {
            return false;
          }

          if (priceRange === "up-to-15" && product.price > 15) return false;
          if (
            priceRange === "15-to-35" &&
            (product.price < 15 || product.price > 35)
          ) {
            return false;
          }
          if (priceRange === "above-35" && product.price <= 35) return false;
          if (product.price > maxPriceSlider) return false;

          if (
            selectedBrands.length > 0 &&
            !selectedBrands.includes(product.brand)
          ) {
            return false;
          }

          if (
            selectedDietary.length > 0 &&
            !selectedDietary.every((req) => product.dietary.includes(req))
          ) {
            return false;
          }

          if (onlyOffers && !product.discountPercent) return false;

          return true;
        })
        .sort((a, b) => {
          if (sortBy === "price-asc") return a.price - b.price;
          if (sortBy === "price-desc") return b.price - a.price;
          if (sortBy === "discount")
            return (b.discountPercent || 0) - (a.discountPercent || 0);
          return b.rating - a.rating;
        }),
    [
      products,
      normalizedSearchQuery,
      selectedDepartments,
      priceRange,
      maxPriceSlider,
      selectedBrands,
      selectedDietary,
      onlyOffers,
      sortBy,
    ]
  );

  const activeFiltersCount =
    selectedDepartments.length +
    (priceRange !== "all" ? 1 : 0) +
    (maxPriceSlider < 100 ? 1 : 0) +
    selectedBrands.length +
    selectedDietary.length +
    (onlyOffers ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  // Reusable Sidebar Filter Panel
  const renderFilterSidebar = () => (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-brand-green-700" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
            Filtros do Corredor
          </h2>
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange-600 hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Limpar ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Promotional Toggle */}
      <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-brand-orange-200 bg-brand-orange-50/70 p-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-brand-orange-600" />
          <span className="text-xs font-extrabold text-brand-orange-700">
            Somente Ofertas com Desconto
          </span>
        </div>
        <input
          type="checkbox"
          checked={onlyOffers}
          onChange={(e) => setOnlyOffers(e.target.checked)}
          className="h-4 w-4 rounded border-orange-300 text-brand-orange-600 focus:ring-brand-orange-500"
        />
      </label>

      {/* 1. Categoria / Departamento */}
      <div>
        <h3 className="mb-2.5 text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Categorias / Departamentos
        </h3>
        <div className="space-y-1.5">
          {DEPARTMENTS.map((dep) => {
            const count = products.filter((p) => p.department === dep.name).length;
            const isChecked = selectedDepartments.includes(dep.name);
            return (
              <button
                key={dep.id}
                type="button"
                onClick={() => toggleDepartment(dep.name)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  isChecked
                    ? "bg-brand-green-700 text-white shadow-xs"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      isChecked
                        ? "border-white bg-white text-brand-green-700"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </span>
                  {dep.name}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isChecked
                      ? "bg-brand-green-800 text-emerald-100"
                      : "bg-slate-200/70 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Faixa de Preço */}
      <div className="border-t border-slate-200 pt-5">
        <h3 className="mb-2.5 text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Faixa de Preço
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { key: "all", label: "Qualquer preço" },
            { key: "up-to-15", label: "Até R$ 15" },
            { key: "15-to-35", label: "R$ 15 a R$ 35" },
            { key: "above-35", label: "Acima de R$ 35" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setPriceRange(item.key as PriceRangeKey)}
              className={`rounded-xl border px-2.5 py-2 text-xs font-bold transition ${
                priceRange === item.key
                  ? "border-brand-green-600 bg-brand-green-50 text-brand-green-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Range Slider */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Teto de preço:</span>
            <span className="font-extrabold text-brand-green-700">
              Até {formatBRL(maxPriceSlider)}
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={maxPriceSlider}
            onChange={(e) => setMaxPriceSlider(Number(e.target.value))}
            className="w-full accent-brand-green-600 cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>R$ 10</span>
            <span>R$ 50</span>
            <span>R$ 100+</span>
          </div>
        </div>
      </div>

      {/* 3. Restrições Alimentares */}
      <div className="border-t border-slate-200 pt-5">
        <div className="mb-2.5 flex items-center gap-1.5">
          <Leaf className="h-3.5 w-3.5 text-brand-green-600" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Restrições Alimentares & Saudabilidade
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_DIETARY_RESTRICTIONS.map((restriction) => {
            const isSelected = selectedDietary.includes(restriction);
            return (
              <button
                key={restriction}
                type="button"
                onClick={() => toggleDietary(restriction)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                  isSelected
                    ? "border-brand-green-700 bg-brand-green-700 text-white shadow-xs"
                    : "border-emerald-200 bg-emerald-50/60 text-brand-green-800 hover:bg-emerald-100"
                }`}
              >
                {isSelected ? `✓ ${restriction}` : restriction}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Marcas */}
      <div className="border-t border-slate-200 pt-5">
        <h3 className="mb-2.5 text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Marcas Selecionadas
        </h3>
        <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
          {ALL_BRANDS.map((brand) => {
            const isChecked = selectedBrands.includes(brand);
            const count = products.filter((p) => p.brand === brand).length;
            return (
              <label
                key={brand}
                className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-xs hover:bg-slate-50"
              >
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleBrand(brand)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-green-600 focus:ring-brand-green-500"
                  />
                  {brand}
                </span>
                <span className="text-[11px] text-slate-400">({count})</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
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
        selectedDepartment={
          selectedDepartments.length === 1 ? selectedDepartments[0] : null
        }
        onSelectDepartment={(dep) =>
          setSelectedDepartments(dep ? [dep] : [])
        }
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-brand-green-700">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-bold text-slate-800">
            Catálogo por Departamento
          </span>
          {selectedDepartments.length === 1 && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-bold text-brand-green-700">
                {selectedDepartments[0]}
              </span>
            </>
          )}
        </nav>

        {/* Top Catalog Banner */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-r from-brand-green-800 via-brand-green-700 to-emerald-700 p-6 text-white shadow-soft sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange-500 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" /> Corredores Digitais SuperVerde
            </span>
            <h1 className="mt-1.5 text-2xl font-black sm:text-3xl">
              {selectedDepartments.length === 1
                ? `Departamento: ${selectedDepartments[0]}`
                : "Catálogo Completo de Produtos"}
            </h1>
            <p className="mt-1 text-xs text-emerald-100 sm:text-sm">
              Combine filtros de categoria, faixa de preço, marcas e restrições alimentares (Sem Glúten, Zero Lactose, Vegano, Orgânico).
            </p>
          </div>
          <Link
            href="/panfleto-de-ofertas"
            className="self-start rounded-2xl bg-white px-4 py-2.5 text-xs font-extrabold text-brand-green-800 shadow-md transition hover:bg-orange-50 sm:self-auto"
          >
            Ver Panfleto de Ofertas da Semana →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card">
              {renderFilterSidebar()}
            </div>
          </aside>

          {/* Products Column */}
          <div className="lg:col-span-9">
            {/* Toolbar: Results Count, Mobile Filter Button & Sort Dropdown */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-green-700 px-3.5 py-2 text-xs font-extrabold text-white lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filtros ({activeFiltersCount})</span>
                </button>
                <p className="text-xs font-semibold text-slate-600 sm:text-sm">
                  Mostrando{" "}
                  <strong className="font-black text-slate-900">
                    {filteredProducts.length}
                  </strong>{" "}
                  {filteredProducts.length === 1
                    ? "produto encontrado"
                    : "produtos encontrados"}
                </p>
              </div>

              {/* Sort By Selector */}
              <div className="flex items-center gap-2 ml-auto">
                <ArrowUpDown className="h-4 w-4 text-brand-green-700" />
                <label
                  htmlFor="catalog-sort"
                  className="hidden text-xs font-bold text-slate-500 sm:inline"
                >
                  Ordenar por:
                </label>
                <select
                  id="catalog-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                >
                  <option value="relevance">Relevância</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="discount">Maior Desconto (%)</option>
                </select>
              </div>
            </div>

            {/* Active Filter Pills Bar */}
            {activeFiltersCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {selectedDepartments.map((dep) => (
                  <button
                    key={dep}
                    type="button"
                    onClick={() => toggleDepartment(dep)}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-green-700 px-3 py-1 text-xs font-bold text-white"
                  >
                    <span>Setor: {dep}</span>
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {selectedDietary.map((diet) => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleDietary(diet)}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white"
                  >
                    <span>{diet}</span>
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {selectedBrands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => toggleBrand(brand)}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white"
                  >
                    <span>Marca: {brand}</span>
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {onlyOffers && (
                  <button
                    type="button"
                    onClick={() => setOnlyOffers(false)}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-orange-500 px-3 py-1 text-xs font-bold text-white"
                  >
                    <span>Somente Ofertas</span>
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantityInCart={cart[product.id] || 0}
                    isFavorite={favorites.includes(product.id)}
                    onAdd={addToCart}
                    onRemove={removeFromCart}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                <p className="text-base font-bold text-slate-800">
                  Nenhum produto corresponde aos filtros selecionados.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Experimente ampliar a faixa de preço ou desmarcar alguma restrição alimentar.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 rounded-xl bg-brand-green-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-brand-green-700"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs lg:hidden">
          <div className="flex h-full w-full max-w-sm flex-col bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-base font-black text-slate-800">
                Filtrar Produtos
              </span>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="rounded-lg bg-slate-100 p-1.5 text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              {renderFilterSidebar()}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full rounded-xl bg-brand-green-600 py-3 text-sm font-extrabold text-white shadow-md"
              >
                Ver {filteredProducts.length} produtos
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer selectedBranch={selectedBranch} />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-bold text-brand-green-700">
          Carregando corredor de ofertas...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}

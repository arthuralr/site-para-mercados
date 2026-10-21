"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Sparkles,
  Scale,
  Info,
  CheckCircle2,
  MapPin,
  Snowflake,
  ArrowLeft,
} from "lucide-react";
import Header from "@/components/Header";
import DepartmentNav from "@/components/DepartmentNav";
import ProductCard, { formatBRL } from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { DEPARTMENTS } from "@/data/mockData";
import { useStore } from "@/context/StoreContext";
import {
  formatProductQuantity,
  formatWeightOption,
  isSoldByWeight,
  WEIGHT_OPTIONS_KG,
} from "@/lib/productUnits";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = typeof params?.id === "string" ? params.id : "prod-1";

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

  const product =
    products.find((p) => p.id === productId) || products[0];

  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [selectedVolume, setSelectedVolume] = useState<string>(
    product.volumeOptions?.[0] || product.weightVolume
  );
  const [selectedWeightKg, setSelectedWeightKg] = useState<number>(
    WEIGHT_OPTIONS_KG[0]
  );
  const [pickerNote, setPickerNote] = useState<string>("");

  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const quantityInCart = cart[product.id] || 0;
  const isWeightProduct = isSoldByWeight(product);
  const isFavorite = favorites.includes(product.id);

  // "Quem comprou também levou" — prioritize same department or complementary items
  const recommendedProducts = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const aSameDep = a.department === product.department ? 1 : 0;
      const bSameDep = b.department === product.department ? 1 : 0;
      return bSameDep - aSameDep;
    })
    .slice(0, 5);

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
        selectedDepartment={product.department}
        onSelectDepartment={() => {}}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-brand-green-700">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link
            href={`/catalogo?departamento=${encodeURIComponent(product.department)}`}
            className="hover:text-brand-green-700"
          >
            {product.department}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="line-clamp-1 font-bold text-slate-800">
            {product.name}
          </span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 gap-8 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-soft sm:p-8 lg:grid-cols-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              <img
                src={gallery[selectedImageIdx] || product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-300"
              />

              {product.discountPercent && (
                <div className="absolute left-3 top-3 rounded-xl bg-brand-orange-500 px-3 py-1.5 text-sm font-black text-white shadow-md">
                  -{product.discountPercent}% OFF
                </div>
              )}

              {product.badge && (
                <div className="absolute bottom-3 left-3 rounded-lg bg-brand-green-800/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs">
                  {product.badge}
                </div>
              )}

              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                aria-label="Favoritar produto"
                className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition ${
                  isFavorite
                    ? "bg-red-50 text-red-500"
                    : "bg-white/90 text-slate-500 hover:text-red-500"
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="mt-3 flex items-center gap-3 overflow-x-auto pb-1">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    selectedImageIdx === idx
                      ? "border-brand-green-600 ring-2 ring-brand-green-500/20"
                      : "border-slate-200 opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} miniatura ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info, Weight/Volume, Pricing & Add to Cart */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div className="space-y-4">
              {/* Brand, SKU & Rating */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-brand-green-50 px-2.5 py-1 text-xs font-extrabold text-brand-green-800">
                    {product.brand}
                  </span>
                  <span className="text-xs text-slate-400">
                    EAN/SKU: {product.sku}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-800">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-slate-400">
                    ({product.reviewsCount} avaliações verificadas)
                  </span>
                </div>
              </div>

              {/* Product Name */}
              <h1 className="text-2xl font-black leading-snug text-slate-900 sm:text-3xl">
                {product.name}
              </h1>

              {/* Dietary Restriction & Origin Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {product.dietary.map((diet) => (
                  <span
                    key={diet}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-brand-green-800"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-green-600" />
                    {diet}
                  </span>
                ))}
                {product.origin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-brand-orange-500" />
                    Origem: {product.origin}
                  </span>
                )}
              </div>

              {/* Weight / Volume Selector */}
              {!isWeightProduct && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-600">
                      <Scale className="h-4 w-4 text-brand-green-700" />
                      Peso / Volume da Embalagem:
                    </span>
                    <span className="text-xs font-bold text-brand-green-700">
                      Unidade padrão: {product.weightVolume} ({product.unit})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(product.volumeOptions || [product.weightVolume]).map(
                      (option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSelectedVolume(option)}
                          className={`rounded-xl border px-3.5 py-2 text-xs font-extrabold transition ${
                            selectedVolume === option
                              ? "border-brand-green-700 bg-brand-green-700 text-white shadow-xs"
                              : "border-slate-200 bg-white text-slate-700 hover:border-brand-green-500"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Pricing Box */}
              <div className="rounded-2xl border-2 border-brand-green-600/20 bg-brand-green-50/40 p-4 sm:p-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    {product.oldPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400 line-through">
                          De: {formatBRL(product.oldPrice)}
                        </span>
                        <span className="rounded-md bg-brand-orange-100 px-2 py-0.5 text-xs font-extrabold text-brand-orange-700">
                          Economia de {formatBRL(product.oldPrice - product.price)}
                        </span>
                      </div>
                    )}
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-3xl font-black tracking-tight text-brand-green-700 sm:text-4xl">
                        {formatBRL(product.price)}
                      </span>
                      <span className="text-sm font-semibold text-slate-500">
                        / {isWeightProduct ? "kg" : product.unit}
                      </span>
                    </div>
                    {isWeightProduct && (
                      <p className="mt-1 text-xs font-semibold text-slate-600">
                        Total estimado ({formatWeightOption(selectedWeightKg)}):{" "}
                        <span className="text-brand-green-800">
                          {formatBRL(product.price * selectedWeightKg)}
                        </span>
                      </p>
                    )}

                    {product.clubPrice && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-brand-green-700 px-3 py-1 text-xs font-bold text-white">
                        <Sparkles className="h-3.5 w-3.5 text-brand-orange-400" />
                        <span>
                          Preço Clube SuperVerde: {formatBRL(product.clubPrice)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quantity & Add to Cart Action */}
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[240px]">
                    {quantityInCart === 0 ? (
                      <button
                        type="button"
                        onClick={() =>
                          addToCart(
                            product,
                            isWeightProduct ? selectedWeightKg : 1
                          )
                        }
                        className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-green-600 px-6 py-4 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-green-700 active:scale-95"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>Adicionar ao Carrinho</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between rounded-2xl border-2 border-brand-green-600 bg-white p-1.5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600"
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                        <div className="text-center">
                          <span className="block text-base font-black text-brand-green-800">
                            {formatProductQuantity(product, quantityInCart)} no carrinho
                          </span>
                          <span className="block text-[11px] font-semibold text-slate-500">
                            Subtotal: {formatBRL(product.price * quantityInCart)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green-600 text-white hover:bg-brand-green-700"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Shopper / Picker Observation */}
              <div>
                <label
                  htmlFor="picker-note"
                  className="mb-1.5 block text-xs font-bold text-slate-600"
                >
                  Preferência para o separador da loja (opcional):
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    "Mais maduro (consumo hoje)",
                    "Mais firme / verde (para a semana)",
                    "Cortar em bifes médios",
                    "Maior validade possível",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPickerNote(preset)}
                      className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                        pickerNote === preset
                          ? "border-brand-orange-500 bg-brand-orange-50 text-brand-orange-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
                <input
                  id="picker-note"
                  type="text"
                  value={pickerNote}
                  onChange={(e) => setPickerNote(e.target.value)}
                  placeholder="Ex: Escolher frutas menores, embalar separadamente..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Delivery & Freshness Guarantee Mini Bar */}
            <div className="mt-5 grid grid-cols-1 gap-2.5 border-t border-slate-100 pt-4 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Truck className="h-4 w-4 shrink-0 text-brand-green-600" />
                <span>
                  Entrega em <strong>{selectedBranch.deliveryTime}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Snowflake className="h-4 w-4 shrink-0 text-brand-orange-500" />
                <span>Cadeia de frio monitorada</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand-green-600" />
                <span>Garantia de troca imediata</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description + ANVISA Nutrition Table */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Product Description & Storage Tips */}
          <div className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card lg:col-span-6">
            <div>
              <span className="inline-block rounded-lg bg-brand-green-50 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green-800">
                Sobre o Produto
              </span>
              <h2 className="mt-2 text-xl font-black text-slate-900">
                Descrição Detalhada & Qualidade
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {product.description}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                <Info className="h-4 w-4 text-brand-orange-500" />
                <span>Conservação e Armazenamento</span>
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                {product.storageTips}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-100 p-3">
                <span className="block text-slate-400">Marca / Produtor</span>
                <strong className="mt-0.5 block text-slate-800">
                  {product.brand}
                </strong>
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                <span className="block text-slate-400">Peso / Volume Líquido</span>
                <strong className="mt-0.5 block text-slate-800">
                  {product.weightVolume}
                </strong>
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                <span className="block text-slate-400">Departamento</span>
                <strong className="mt-0.5 block text-slate-800">
                  {product.department}
                </strong>
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                <span className="block text-slate-400">Código EAN / SKU</span>
                <strong className="mt-0.5 block text-slate-800">
                  {product.sku}
                </strong>
              </div>
            </div>
          </div>

          {/* Right: Tabela Nutricional */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card lg:col-span-6">
            <span className="inline-block rounded-lg bg-brand-orange-50 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-orange-700">
              Padrão ANVISA
            </span>
            <h2 className="mt-2 text-xl font-black text-slate-900">
              Informação Nutricional
            </h2>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              Porção de referência: <strong className="text-slate-800">{product.nutrition.portion}</strong>
            </p>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-4 py-2.5 font-extrabold">
                      Quantidade por porção
                    </th>
                    <th className="px-4 py-2.5 font-extrabold">Valor</th>
                    <th className="px-4 py-2.5 text-right font-extrabold">
                      %VD*
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-white">
                    <td className="px-4 py-2 font-semibold text-slate-700">
                      Valor energético
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {product.nutrition.calories.value}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-slate-800">
                      {product.nutrition.calories.vd}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/70">
                    <td className="px-4 py-2 font-semibold text-slate-700">
                      Carboidratos
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {product.nutrition.carbs.value}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-slate-800">
                      {product.nutrition.carbs.vd}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-2 pl-7 text-slate-600">
                      Açúcares totais
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {product.nutrition.sugars.value}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-slate-800">
                      {product.nutrition.sugars.vd}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/70">
                    <td className="px-4 py-2 font-semibold text-slate-700">
                      Proteínas
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {product.nutrition.proteins.value}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-slate-800">
                      {product.nutrition.proteins.vd}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-2 font-semibold text-slate-700">
                      Gorduras totais
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {product.nutrition.totalFat.value}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-slate-800">
                      {product.nutrition.totalFat.vd}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/70">
                    <td className="px-4 py-2 pl-7 text-slate-600">
                      Gorduras saturadas
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {product.nutrition.saturatedFat.value}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-slate-800">
                      {product.nutrition.saturatedFat.vd}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-2 font-semibold text-slate-700">
                      Fibra alimentar
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {product.nutrition.fiber.value}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-slate-800">
                      {product.nutrition.fiber.vd}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/70">
                    <td className="px-4 py-2 font-semibold text-slate-700">
                      Sódio
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {product.nutrition.sodium.value}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-slate-800">
                      {product.nutrition.sodium.vd}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-3 rounded-xl bg-amber-50 px-3.5 py-2.5 text-[11px] font-bold text-amber-900">
              ⚠️ ALERGÊNICOS: {product.nutrition.allergens}
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              * % Valores Diários de referência com base em uma dieta de 2.000 kcal ou 8.400 kJ. Seus valores diários podem ser maiores ou menores dependendo de suas necessidades energéticas.
            </p>
          </div>
        </div>

        {/* Recommended Products ("Quem comprou também levou") */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <span className="inline-block rounded-lg bg-brand-green-100 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green-800">
                Compre Junto
              </span>
              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Quem comprou também levou
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-green-700 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar ao Catálogo
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {recommendedProducts.map((recProduct) => (
              <ProductCard
                key={recProduct.id}
                product={recProduct}
                quantityInCart={cart[recProduct.id] || 0}
                isFavorite={favorites.includes(recProduct.id)}
                onAdd={addToCart}
                onRemove={removeFromCart}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer selectedBranch={selectedBranch} />
    </div>
  );
}

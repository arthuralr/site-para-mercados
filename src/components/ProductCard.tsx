"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Plus,
  Minus,
  ShoppingCart,
  Flame,
  Sparkles,
  Star,
  Eye,
} from "lucide-react";
import { Product } from "@/data/mockData";
import { useStore } from "@/context/StoreContext";
import {
  formatProductQuantity,
  formatWeightOption,
  isSoldByWeight,
  WEIGHT_OPTIONS_KG,
} from "@/lib/productUnits";

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  isFavorite: boolean;
  onAdd: (product: Product, qty?: number) => void;
  onRemove: (productId: string, qty?: number) => void;
  onToggleFavorite: (productId: string) => void;
  variant?: "default" | "flash";
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ProductCard({
  product,
  quantityInCart,
  isFavorite,
  onAdd,
  onRemove,
  onToggleFavorite,
  variant = "default",
}: ProductCardProps) {
  const { storeSettings } = useStore();
  const isOnlineEnabled = storeSettings.onlineShoppingEnabled;
  const isWeightProduct = isSoldByWeight(product);
  const [selectedWeightKg, setSelectedWeightKg] = useState<number>(
    WEIGHT_OPTIONS_KG[0]
  );

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft ${
        variant === "flash"
          ? "border-2 border-brand-orange-400/80 shadow-card"
          : "border border-slate-200/90 shadow-card hover:border-brand-green-500/60"
      }`}
    >
      {/* Top Badges + Product Link + Favorite Button */}
      <div>
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-slate-50">
          <Link href={`/produto/${product.id}`} className="block h-full w-full">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Discount Percent Badge */}
          {product.discountPercent && (
            <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-brand-orange-500 px-2.5 py-1 text-xs font-extrabold text-white shadow-sm">
              {variant === "flash" && (
                <Flame className="h-3.5 w-3.5 fill-white" />
              )}
              <span>-{product.discountPercent}%</span>
            </div>
          )}

          {/* Category / Special Tag */}
          {product.badge && (
            <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-brand-green-800/90 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              {product.badge}
            </div>
          )}

          {/* Weight / Volume Pill */}
          <div className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-extrabold text-slate-700 shadow-xs">
            {product.weightVolume}
          </div>

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={() => onToggleFavorite(product.id)}
            aria-label={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
            className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              isFavorite
                ? "bg-red-50 text-red-500 shadow-sm"
                : "bg-white/90 text-slate-400 hover:bg-white hover:text-red-500"
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500" : ""}`} />
          </button>
        </div>

        {/* Department, Brand & Rating */}
        <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-500">
          <span className="truncate rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
            {product.brand}
          </span>
          <span className="flex shrink-0 items-center gap-0.5 text-amber-500">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-600">
              {product.rating.toFixed(1)}
            </span>
          </span>
        </div>

        {/* Product Title Link */}
        <Link
          href={`/produto/${product.id}`}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-slate-800 transition-colors hover:text-brand-green-700"
        >
          {product.name}
        </Link>

        {/* Dietary Restriction Mini Pills */}
        {product.dietary.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {product.dietary.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-green-700"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-xs text-slate-400">Venda por: {product.unit}</p>
        )}
      </div>

      {/* Pricing & CTA */}
      <div className="mt-3 border-t border-slate-100 pt-2">
        {isWeightProduct && (
          <label className="mb-2 block text-[11px] font-bold text-slate-600">
            Escolha o peso
            <select
              value={selectedWeightKg}
              onChange={(event) => setSelectedWeightKg(Number(event.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-700"
            >
              {WEIGHT_OPTIONS_KG.map((weight) => (
                <option key={weight} value={weight}>
                  {formatWeightOption(weight)}
                </option>
              ))}
            </select>
          </label>
        )}
        {/* Old Price Strikethrough */}
        {product.oldPrice ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 line-through">
              {formatBRL(product.oldPrice)}
            </span>
            <span className="text-[11px] font-semibold text-brand-green-600">
              -{formatBRL(product.oldPrice - product.price)}
            </span>
          </div>
        ) : (
          <div className="h-4" />
        )}

        {/* Prominent Promotional Price */}
        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="text-lg font-extrabold tracking-tight text-brand-green-700 sm:text-xl">
            {formatBRL(product.price)}
          </span>
          <span className="text-xs font-normal text-slate-500">
            /{product.unit.split(" ")[0]}
          </span>
        </div>
        {isWeightProduct && (
          <p className="mt-0.5 text-[11px] font-semibold text-slate-600">
            {formatWeightOption(selectedWeightKg)}:{" "}
            <span className="text-brand-green-800">
              {formatBRL(product.price * selectedWeightKg)}
            </span>
          </p>
        )}

        {/* Loyalty Club Price if available */}
        {product.clubPrice && (
          <div className="mt-1 flex items-center gap-1 rounded-md bg-brand-green-50 px-2 py-0.5 text-[11px] font-semibold text-brand-green-800">
            <Sparkles className="h-3 w-3 text-brand-orange-500" />
            <span>Clube: {formatBRL(product.clubPrice)}</span>
          </div>
        )}

        {/* Stock bar for Flash Deals */}
        {variant === "flash" &&
          typeof product.stockLeftPercent === "number" && (
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between text-[11px] font-semibold">
                <span className="text-brand-orange-600">Quase acabando!</span>
                <span className="text-slate-500">
                  Restam {product.stockLeftPercent}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-orange-500 to-red-500 transition-all"
                  style={{ width: `${100 - product.stockLeftPercent}%` }}
                />
              </div>
            </div>
          )}

        {/* Add to Cart / Quantity Stepper OR Showcase Mode */}
        <div className="mt-3">
          {!isOnlineEnabled ? (
            <Link
              href={`/produto/${product.id}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700 transition hover:border-brand-green-500 hover:bg-brand-green-50 hover:text-brand-green-800"
            >
              <Eye className="h-4 w-4 text-brand-green-700" />
              <span>Ver na Vitrine</span>
            </Link>
          ) : quantityInCart === 0 ? (
            <button
              type="button"
              onClick={() =>
                onAdd(product, isWeightProduct ? selectedWeightKg : 1)
              }
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all active:scale-[0.98] sm:text-sm ${
                variant === "flash"
                  ? "bg-brand-orange-500 text-white shadow-sm hover:bg-brand-orange-600"
                  : "bg-brand-green-600 text-white shadow-sm hover:bg-brand-green-700"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Adicionar</span>
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl border-2 border-brand-green-600 bg-brand-green-50/60 p-1">
              <button
                type="button"
                onClick={() => onRemove(product.id)}
                aria-label="Diminuir quantidade"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-green-700 shadow-sm transition hover:bg-red-50 hover:text-red-600"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-extrabold text-brand-green-800">
                {formatProductQuantity(product, quantityInCart)}
              </span>
              <button
                type="button"
                onClick={() => onAdd(product)}
                aria-label="Aumentar quantidade"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-600 text-white shadow-sm transition hover:bg-brand-green-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

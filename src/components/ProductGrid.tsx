"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/mockData";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

interface ProductGridProps {
  title?: string;
  products: Product[];
  description?: string;
  moreHref?: string;
  moreLabel?: string;
}

export default function ProductGrid({
  title,
  products,
  description,
  moreHref,
  moreLabel = "Ver todos",
}: ProductGridProps) {
  const {
    cart,
    favorites,
    addToCart,
    removeFromCart,
    toggleFavorite,
  } = useStore();

  return (
    <section className="py-10 sm:py-14">
      {(title || description || moreHref) && (
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
          {moreHref && (
            <Link
              href={moreHref}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-brand-green-700 hover:text-brand-green-900"
            >
              {moreLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
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
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Nenhum produto disponível nesta seleção.
        </p>
      )}
    </section>
  );
}

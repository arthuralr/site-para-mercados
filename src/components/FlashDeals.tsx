"use client";

import React, { useState, useEffect } from "react";
import { Zap, Clock, Flame } from "lucide-react";
import { Product } from "@/data/mockData";
import ProductCard from "./ProductCard";

interface FlashDealsProps {
  products: Product[];
  cart: Record<string, number>;
  favorites: string[];
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
}

export default function FlashDeals({
  products,
  cart,
  favorites,
  onAdd,
  onRemove,
  onToggleFavorite,
}: FlashDealsProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const flashProducts = products.filter((product) => {
    if (!product.isFlashDeal || product.isActive === false) return false;
    const startsAt = product.flashStartDate
      ? Date.parse(product.flashStartDate)
      : Number.NaN;
    const endsAt = product.flashEndDate
      ? Date.parse(product.flashEndDate)
      : Number.NaN;
    if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt)) return false;
    return startsAt <= now && now < endsAt;
  });

  const nearestEnd = flashProducts.reduce((nearest, product) => {
    const endsAt = product.flashEndDate
      ? new Date(product.flashEndDate).getTime()
      : Number.POSITIVE_INFINITY;
    return Math.min(nearest, endsAt);
  }, Number.POSITIVE_INFINITY);
  const secondsLeft = Number.isFinite(nearestEnd)
    ? Math.max(0, Math.floor((nearestEnd - now) / 1000))
    : null;

  const hours =
    secondsLeft === null
      ? "00"
      : String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const minutes =
    secondsLeft === null
      ? "00"
      : String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const seconds =
    secondsLeft === null ? "00" : String(secondsLeft % 60).padStart(2, "0");

  if (flashProducts.length === 0) return null;

  return (
    <section id="ofertas-relampago" className="mx-auto max-w-7xl px-4 py-6">
      <div className="rounded-3xl border-2 border-brand-orange-400/70 bg-gradient-to-b from-brand-orange-50/90 via-white to-white p-4 shadow-soft sm:p-6">
        {/* Section Header with Live Countdown */}
        <div className="mb-5 flex flex-col justify-between gap-4 border-b border-orange-200/70 pb-4 md:flex-row md:items-center">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange-500 text-white shadow-md">
              <Zap className="h-6 w-6 fill-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  Ofertas Relâmpago do Dia
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-extrabold text-red-700">
                  <Flame className="h-3.5 w-3.5 fill-red-600 text-red-600" />
                  Preços Imbatíveis
                </span>
              </div>
              <p className="text-xs text-slate-600 sm:text-sm">
                Descontos exclusivos por tempo limitado. Aproveite antes que o lote acabe!
              </p>
            </div>
          </div>

          {/* Countdown to the nearest active offer expiration */}
          <div className="flex items-center gap-3 self-start rounded-2xl bg-slate-900 px-4 py-2.5 text-white shadow-md md:self-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-orange-400">
              <Clock className="h-4 w-4 animate-pulse" />
              <span className="uppercase tracking-wider">Termina em:</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm font-black sm:text-base">
              <span className="rounded-lg bg-brand-orange-500 px-2 py-1 text-white">
                {hours}h
              </span>
              <span className="text-brand-orange-400">:</span>
              <span className="rounded-lg bg-brand-orange-500 px-2 py-1 text-white">
                {minutes}m
              </span>
              <span className="text-brand-orange-400">:</span>
              <span className="rounded-lg bg-brand-orange-500 px-2 py-1 text-white">
                {seconds}s
              </span>
            </div>
          </div>
        </div>

        {/* Flash Deals Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {flashProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={cart[product.id] || 0}
              isFavorite={favorites.includes(product.id)}
              onAdd={onAdd}
              onRemove={onRemove}
              onToggleFavorite={onToggleFavorite}
              variant="flash"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

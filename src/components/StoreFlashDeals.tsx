"use client";

import FlashDeals from "@/components/FlashDeals";
import { useStore } from "@/context/StoreContext";

export default function StoreFlashDeals() {
  const {
    products,
    cart,
    favorites,
    addToCart,
    removeFromCart,
    toggleFavorite,
  } = useStore();

  return (
    <FlashDeals
      products={products}
      cart={cart}
      favorites={favorites}
      onAdd={addToCart}
      onRemove={removeFromCart}
      onToggleFavorite={toggleFavorite}
    />
  );
}

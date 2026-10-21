import type { Product } from "@/data/mockData";

export const WEIGHT_OPTIONS_KG = [0.5, 1, 2] as const;

export function isSoldByWeight(product: Pick<Product, "unit">): boolean {
  const unit = product.unit.trim().toLowerCase();
  return /^(kg|quilo|quilograma|quilogramas)$/.test(unit) || /\bgranel\b/.test(unit);
}

export function getProductQuantityStep(
  product: Pick<Product, "unit">
): number {
  return isSoldByWeight(product) ? 0.5 : 1;
}

export function formatProductQuantity(
  product: Pick<Product, "unit">,
  quantity: number
): string {
  if (isSoldByWeight(product)) {
    if (quantity < 1) return `${Math.round(quantity * 1000)} g`;
    return `${Number(quantity.toFixed(3)).toLocaleString("pt-BR")} kg`;
  }

  return `${Number(quantity.toFixed(3)).toLocaleString("pt-BR")} ${
    quantity === 1 ? "unidade" : "unidades"
  }`;
}

export function formatWeightOption(quantityKg: number): string {
  return quantityKg < 1
    ? `${Math.round(quantityKg * 1000)} g`
    : `${quantityKg.toLocaleString("pt-BR")} kg`;
}

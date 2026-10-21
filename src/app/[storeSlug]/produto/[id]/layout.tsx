import type { Metadata } from "next";
import { PRODUCTS } from "@/data/mockData";
import { buildLocalMetadata } from "@/lib/storeSeo";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = PRODUCTS.find((item) => item.id === params.id);
  const title = product
    ? `${product.name} | ${product.department}`
    : "Produtos de supermercado";
  const description = product
    ? `${product.name} por ${product.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}. Confira disponibilidade, ofertas e entrega do supermercado.`
    : "Confira produtos de hortifrúti, açougue, mercearia e ofertas do supermercado com opção de entrega.";

  return buildLocalMetadata({
    title,
    description,
    path: `/produto/${encodeURIComponent(params.id)}`,
    keywords: [
      product?.name || "produtos de supermercado",
      product?.department || "hortifrúti e açougue",
      "comprar supermercado online",
    ],
  });
}

export default function ProductLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

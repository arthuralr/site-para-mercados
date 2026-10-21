import type { Metadata } from "next";
import { buildLocalMetadata } from "@/lib/storeSeo";

export async function generateMetadata(): Promise<Metadata> {
  return buildLocalMetadata({
    title: "Catálogo de supermercado online",
    description:
      "Compre hortifrúti fresco, carnes do açougue, padaria, bebidas e itens de mercearia. Consulte produtos e ofertas para pedir com entrega.",
    path: "/catalogo",
    keywords: [
      "catálogo de supermercado",
      "comprar hortifrúti online",
      "comprar carne online",
      "supermercado com entrega em casa",
    ],
  });
}

export default function CatalogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

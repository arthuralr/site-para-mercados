import type { Metadata } from "next";
import { buildLocalMetadata } from "@/lib/storeSeo";

export async function generateMetadata(): Promise<Metadata> {
  return buildLocalMetadata({
    title: "Receitas e sugestões do dia",
    description:
      "Encontre receitas práticas com ingredientes do supermercado. Adicione todos os produtos da receita ao carrinho e receba em casa.",
    path: "/receitas",
    keywords: [
      "receitas fáceis",
      "receitas com ingredientes de supermercado",
      "sugestões de refeições",
      "comprar ingredientes para receita",
    ],
  });
}

export default function RecipesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

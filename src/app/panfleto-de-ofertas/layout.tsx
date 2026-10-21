import type { Metadata } from "next";
import { buildLocalMetadata } from "@/lib/storeSeo";

export async function generateMetadata(): Promise<Metadata> {
  return buildLocalMetadata({
    title: "Panfleto de ofertas do supermercado",
    description:
      "Confira ofertas de hortifrúti, açougue, mercearia e produtos para a semana. Aproveite os preços e peça para receber em casa.",
    path: "/panfleto-de-ofertas",
    keywords: [
      "panfleto de ofertas de supermercado",
      "ofertas de hortifrúti",
      "promoção de açougue",
      "ofertas de mercado perto de mim",
    ],
  });
}

export default function OffersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

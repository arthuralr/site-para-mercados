import type { Metadata } from "next";
import { buildLocalMetadata } from "@/lib/storeSeo";

export async function generateMetadata(): Promise<Metadata> {
  return buildLocalMetadata({
    title: "Lojas, endereços e entregas",
    description:
      "Consulte endereços das unidades, horários de atendimento, contatos e informações sobre as entregas do supermercado.",
    path: "/institucional",
    keywords: [
      "endereço de supermercado",
      "horário de supermercado",
      "supermercado aberto",
      "área de entrega de mercado",
    ],
  });
}

export default function InstitutionalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

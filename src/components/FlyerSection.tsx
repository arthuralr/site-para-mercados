"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgePercent, Newspaper } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductGrid from "@/components/ProductGrid";

export default function FlyerSection() {
  const { products } = useStore();
  const departments = useMemo(
    () => [
      "Todas",
      ...Array.from(new Set(
        products
          .filter((product) => product.discountPercent)
          .map((product) => product.department)
      )),
    ],
    [products]
  );
  const [activeDepartment, setActiveDepartment] = useState("Todas");
  const offers = products.filter(
    (product) =>
      product.discountPercent &&
      (activeDepartment === "Todas" ||
        product.department === activeDepartment)
  );

  return (
    <section className="rounded-3xl bg-orange-50 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange-100 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-brand-orange-800">
            <Newspaper className="h-4 w-4" />
            Panfleto de Ofertas
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Economia boa é economia de verdade
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Confira as ofertas da semana e adicione seus produtos favoritos ao
            carrinho.
          </p>
        </div>
        <Link
          href="/panfleto-de-ofertas"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-orange-700"
        >
          Abrir panfleto completo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {departments.map((department) => (
          <button
            key={department}
            type="button"
            aria-pressed={activeDepartment === department}
            onClick={() => setActiveDepartment(department)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
              activeDepartment === department
                ? "bg-brand-orange-600 text-white"
                : "bg-white text-slate-700 hover:bg-orange-100"
            }`}
          >
            {department}
          </button>
        ))}
      </div>

      {offers.length > 0 ? (
        <div className="mt-2">
          <ProductGrid
            title=""
            products={offers.slice(0, 5)}
            description=""
          />
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-5 text-sm text-slate-600">
          <BadgePercent className="h-5 w-5 text-brand-orange-600" />
          Não há ofertas disponíveis neste departamento no momento.
        </div>
      )}
    </section>
  );
}

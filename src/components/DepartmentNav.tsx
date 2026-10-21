"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Apple,
  Beef,
  Croissant,
  Wine,
  ShoppingBasket,
  Sparkles,
  Milk,
  Snowflake,
  LayoutGrid,
  Newspaper,
  ChefHat,
} from "lucide-react";
import Link from "next/link";
import { Department } from "@/data/mockData";

interface DepartmentNavProps {
  departments: Department[];
  selectedDepartment: string | null;
  onSelectDepartment?: (departmentName: string | null) => void;
}

const ICON_MAP = {
  Apple,
  Beef,
  Croissant,
  Wine,
  ShoppingBasket,
  Sparkles,
  Milk,
  Snowflake,
};

export default function DepartmentNav({
  departments,
  selectedDepartment,
  onSelectDepartment,
}: DepartmentNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleDepClick = (depName: string | null) => {
    if (pathname === "/" || pathname?.startsWith("/catalogo")) {
      if (onSelectDepartment) {
        onSelectDepartment(depName);
        return;
      }
    }
    if (depName) {
      router.push(`/catalogo?departamento=${encodeURIComponent(depName)}`);
    } else {
      router.push("/catalogo");
    }
  };

  const aisleOrder = [
    "Açougue",
    "Hortifrúti",
    "Padaria",
    "Bebidas",
    "Limpeza",
    "Mercearia",
  ];
  const orderedDepartments = [...departments].sort((a, b) => {
    const aIndex = aisleOrder.indexOf(a.name);
    const bIndex = aisleOrder.indexOf(b.name);
    if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <nav
      aria-label="Corredores do supermercado"
      className="border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-800">
            Explore os corredores
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDepClick(null)}
              aria-pressed={
                selectedDepartment === null &&
                pathname?.startsWith("/catalogo")
              }
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                selectedDepartment === null &&
                pathname?.startsWith("/catalogo")
                  ? "bg-brand-green-700 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-brand-green-500"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Todos os setores
            </button>
            <Link
              href="/panfleto-de-ofertas"
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                pathname?.startsWith("/panfleto-de-ofertas")
                  ? "bg-brand-orange-500 text-white"
                  : "border border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-400"
              }`}
            >
              <Newspaper className="h-4 w-4" />
              Ofertas
            </Link>
            <Link
              href="/receitas"
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                pathname?.startsWith("/receitas")
                  ? "bg-brand-green-700 text-white"
                  : "border border-green-200 bg-green-50 text-green-800 hover:border-green-400"
              }`}
            >
              <ChefHat className="h-4 w-4" />
              Receitas
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {orderedDepartments.map((dep) => {
            const IconComponent = ICON_MAP[dep.iconName];
            const isSelected = selectedDepartment === dep.name;

            return (
              <button
                key={dep.id}
                type="button"
                onClick={() => handleDepClick(isSelected ? null : dep.name)}
                aria-pressed={isSelected}
                className={`group flex min-h-16 items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-600 ${
                  isSelected
                    ? "border-brand-green-700 bg-brand-green-700 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-brand-green-300 hover:bg-brand-green-50"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    isSelected
                      ? "bg-white/15 text-white"
                      : `${dep.bgColor} ${dep.highlightColor}`
                  }`}
                >
                  <IconComponent className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-extrabold sm:text-sm">
                    {dep.name}
                  </span>
                  <span
                    className={`block text-[10px] ${
                      isSelected ? "text-green-100" : "text-slate-400"
                    }`}
                  >
                    {dep.itemCount}+ produtos
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChefHat,
  Clock3,
  ShoppingBasket,
  UsersRound,
} from "lucide-react";
import Header from "@/components/Header";
import DepartmentNav from "@/components/DepartmentNav";
import Footer from "@/components/Footer";
import { formatBRL } from "@/components/ProductCard";
import { DEPARTMENTS } from "@/data/mockData";
import { STORE_RECIPES } from "@/data/recipes";
import { useStore } from "@/context/StoreContext";

export default function RecipesPage() {
  const {
    branches,
    selectedBranch,
    setSelectedBranch,
    products,
    cart,
    favorites,
    searchQuery,
    setSearchQuery,
    addToCart,
    addItemsToCart,
    removeFromCart,
    clearProductFromCart,
    toggleFavorite,
    setIsCartDrawerOpen,
    storeSettings,
  } = useStore();

  const addRecipeToCart = (ingredientLines: { productId: string; quantity: number }[]) => {
    addItemsToCart(ingredientLines);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header
        branches={branches}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
        products={products}
        cart={cart}
        favorites={favorites}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onClearProductFromCart={clearProductFromCart}
        onToggleFavorite={toggleFavorite}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <DepartmentNav
        departments={DEPARTMENTS}
        selectedDepartment={null}
        onSelectDepartment={() => {}}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <header className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green-900 via-brand-green-800 to-emerald-700 p-6 text-white shadow-soft sm:p-9">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wide">
              <ChefHat className="h-4 w-4 text-brand-orange-300" />
              Da nossa cozinha para a sua
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Receitas e Sugestões do Dia
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-100 sm:text-base">
              Ideias saborosas para facilitar sua rotina. Confira os ingredientes
              do nosso catálogo e coloque tudo o que precisa no carrinho de uma vez.
            </p>
          </div>
        </header>

        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Sugestões para hoje
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Ingredientes e preços estimados conforme o catálogo atual.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-green-700 hover:underline"
          >
            Ver catálogo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {STORE_RECIPES.map((recipe) => {
            const ingredients = recipe.ingredients.map((ingredient) => ({
              ...ingredient,
              product: products.find(
                (product) => product.id === ingredient.productId
              ),
            }));
            const availableIngredients = ingredients.filter(
              (ingredient) => ingredient.product
            );
            const estimatedTotal = availableIngredients.reduce(
              (total, ingredient) =>
                total + ingredient.product!.price * ingredient.quantity,
              0
            );

            return (
              <article
                key={recipe.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card"
              >
                <div className="relative h-52 sm:h-60">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-brand-green-800 shadow">
                    {recipe.category}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-black text-slate-900">
                    {recipe.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {recipe.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-4 w-4 text-brand-orange-500" />
                      {recipe.preparationTime}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <UsersRound className="h-4 w-4 text-brand-orange-500" />
                      {recipe.servings} porções
                    </span>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="mb-2 flex items-center gap-2">
                      <ShoppingBasket className="h-4 w-4 text-brand-green-700" />
                      <h4 className="text-sm font-extrabold text-slate-800">
                        Ingredientes
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {ingredients.map((ingredient) => (
                        <li
                          key={ingredient.productId}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          {ingredient.product ? (
                            <Link
                              href={`/produto/${ingredient.product.id}`}
                              className="font-semibold text-slate-700 hover:text-brand-green-700 hover:underline"
                            >
                              {ingredient.product.name}
                            </Link>
                          ) : (
                            <span className="font-semibold text-slate-400">
                              Produto indisponível
                            </span>
                          )}
                          <span className="shrink-0 text-right text-xs font-bold text-slate-500">
                            {ingredient.amountLabel}
                            {ingredient.product && (
                              <span className="block text-brand-green-700">
                                {formatBRL(
                                  ingredient.product.price * ingredient.quantity
                                )}
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 rounded-2xl bg-brand-green-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-brand-green-900">
                        Total estimado dos ingredientes
                      </span>
                      <span className="text-lg font-black text-brand-green-800">
                        {formatBRL(estimatedTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-sm font-extrabold text-slate-800">
                      Modo de preparo
                    </h4>
                    <ol className="mt-2 list-inside list-decimal space-y-1.5 text-sm leading-relaxed text-slate-600">
                      {recipe.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <button
                    type="button"
                    disabled={
                      availableIngredients.length === 0 ||
                      !storeSettings.onlineShoppingEnabled
                    }
                    onClick={() =>
                      addRecipeToCart(
                        availableIngredients.map((ingredient) => ({
                          productId: ingredient.productId,
                          quantity: ingredient.quantity,
                        }))
                      )
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green-700 px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-brand-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBasket className="h-4 w-4" />
                    Adicionar Todos os Ingredientes ao Carrinho
                  </button>
                  {availableIngredients.length < ingredients.length && (
                    <p className="mt-2 text-center text-xs font-medium text-amber-700">
                      Itens indisponíveis serão ignorados ao adicionar.
                    </p>
                  )}
                  {!storeSettings.onlineShoppingEnabled && (
                    <p className="mt-2 text-center text-xs font-medium text-slate-500">
                      Compras online estão temporariamente pausadas.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </main>
      <Footer selectedBranch={selectedBranch} />
    </div>
  );
}

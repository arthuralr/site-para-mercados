"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  LogOut,
  ShoppingBag,
  FolderHeart,
  Plus,
  Copy,
  Share2,
  Check,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useStore, SavedShoppingList } from "@/context/StoreContext";
import { formatBRL } from "@/components/ProductCard";
import { formatProductQuantity } from "@/lib/productUnits";

export default function CustomerAccountPage() {
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
    addOrderItemsToCart,
    removeFromCart,
    clearProductFromCart,
    toggleFavorite,
    currentUser,
    loginCustomer,
    registerCustomer,
    logoutCustomer,
    orders,
    savedLists,
    duplicateShoppingList,
    loadListIntoCart,
    setIsListsModalOpen,
    setIsCartDrawerOpen,
  } = useStore();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("cliente@superverde.com.br");
  const [loginPassword, setLoginPassword] = useState("123456");
  const [authError, setAuthError] = useState<string | null>(null);

  // Registration State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCpf, setRegCpf] = useState("");
  const [regCep, setRegCep] = useState("01415-000");
  const [regStreet, setRegStreet] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [regNeighborhood, setRegNeighborhood] = useState("");

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const customerOrders = currentUser
    ? orders.filter((order) => {
        const orderEmail = order.cliente_email?.trim().toLowerCase();
        if (orderEmail) return orderEmail === currentUser.email.trim().toLowerCase();

        const normalizePhone = (phone: string) => phone.replace(/\D/g, "");
        const orderPhone = normalizePhone(order.cliente_telefone || "");
        const customerPhone = normalizePhone(currentUser.phone || "");
        return orderPhone.length >= 10 && orderPhone === customerPhone;
      })
    : [];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = loginCustomer(loginEmail, loginPassword);
    if (!res.ok) {
      setAuthError(res.error || "Erro ao entrar.");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = registerCustomer({
      name: regName,
      email: regEmail,
      password: regPassword,
      phone: regPhone,
      cpf: regCpf,
      cep: regCep,
      street: regStreet,
      number: regNumber,
      neighborhood: regNeighborhood,
    });
    if (!res.ok) {
      setAuthError(res.error || "Erro ao criar conta.");
    }
  };

  const handleShareListWhatsApp = (list: SavedShoppingList) => {
    const entries = Object.entries(list.items)
      .map(([id, qty]) => {
        const prod = products.find((p) => p.id === id);
        return prod ? { prod, qty } : null;
      })
      .filter(Boolean) as { prod: (typeof products)[number]; qty: number }[];
    const total = entries.reduce((acc, i) => acc + i.prod.price * i.qty, 0);
    const text = [
      `📝 *LISTA DE COMPRAS — SUPERVERDE*`,
      `📌 *Lista:* ${list.name}`,
      `----------------------------------`,
      ...entries.map(
        ({ prod, qty }, idx) =>
          `${idx + 1}. *${formatProductQuantity(prod, qty)} de ${prod.name}* — ${formatBRL(prod.price * qty)}`
      ),
      `----------------------------------`,
      `💰 *Total Estimado:* *${formatBRL(total)}*`,
    ].join("\n");
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleDuplicateList = (list: SavedShoppingList) => {
    duplicateShoppingList(list.id);
    setCopiedId(list.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
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

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        {!currentUser ? (
          /* TELA DE LOGIN E CADASTRO DE CLIENTES */
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Banner */}
              <div className="flex flex-col justify-between bg-gradient-to-br from-brand-green-900 via-brand-green-800 to-emerald-700 p-6 text-white sm:p-8 lg:col-span-5">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange-500 px-3 py-1 text-[11px] font-black uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" /> Conta Segura SuperVerde
                  </span>
                  <h1 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                    Suas Compras e Listas Salvas em Qualquer Lugar
                  </h1>
                  <p className="mt-2 text-xs leading-relaxed text-emerald-100">
                    Acesse sua conta para consultar seu histórico completo de pedidos, repetir compras anteriores em 1 clique e gerenciar suas listas personalizadas.
                  </p>
                </div>

                <div className="mt-6 space-y-2.5 rounded-2xl border border-emerald-600/60 bg-emerald-950/50 p-4 text-xs">
                  <p className="font-black text-amber-300">
                    🔑 Acesso Rápido de Demonstração:
                  </p>
                  <p className="text-emerald-100">
                    E-mail: <strong className="font-mono text-white">cliente@superverde.com.br</strong>
                    <br />
                    Senha: <strong className="font-mono text-white">123456</strong>
                  </p>
                </div>
              </div>

              {/* Right Auth Forms */}
              <div className="p-6 sm:p-8 lg:col-span-7">
                <div className="mb-6 flex rounded-2xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError(null);
                    }}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-extrabold transition ${
                      authMode === "login"
                        ? "bg-white text-brand-green-800 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Já sou Cliente (Login)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setAuthError(null);
                    }}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-extrabold transition ${
                      authMode === "register"
                        ? "bg-white text-brand-orange-600 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Criar Nova Conta
                  </button>
                </div>

                {authError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
                    {authError}
                  </div>
                )}

                {authMode === "login" ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        E-mail do Cliente *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="seuemail@exemplo.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Senha *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green-700 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:bg-brand-green-800"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Entrar na Minha Conta</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Ex: João da Silva"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                          CPF *
                        </label>
                        <input
                          type="text"
                          required
                          value={regCpf}
                          onChange={(e) => setRegCpf(e.target.value)}
                          placeholder="000.000.000-00"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="seuemail@exemplo.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                          Crie uma Senha *
                        </label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                          WhatsApp / Celular *
                        </label>
                        <input
                          type="text"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="(11) 99999-9999"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                          CEP de Entrega
                        </label>
                        <input
                          type="text"
                          value={regCep}
                          onChange={(e) => setRegCep(e.target.value)}
                          placeholder="01415-000"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                        />
                      </div>
                      <div className="sm:col-span-2 grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={regStreet}
                          onChange={(e) => setRegStreet(e.target.value)}
                          placeholder="Rua / Avenida"
                          className="col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                        />
                        <input
                          type="text"
                          value={regNumber}
                          onChange={(e) => setRegNumber(e.target.value)}
                          placeholder="Nº"
                          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:bg-brand-orange-600"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Concluir Cadastro e Acessar Minha Conta</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ÁREA LOGADA DO CLIENTE: PERFIL, HISTÓRICO DE COMPRAS & LISTAS DE COMPRAS */
          <div className="space-y-6">
            {/* Customer Profile Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green-700 text-xl font-black text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-brand-green-800">
                    Cliente Autenticado • Clube SuperVerde Ativo
                  </span>
                  <h1 className="mt-0.5 text-xl font-black text-slate-900 sm:text-2xl">
                    Olá, {currentUser.name}!
                  </h1>
                  <p className="text-xs text-slate-500">
                    {currentUser.email} • {currentUser.phone} • CPF:{" "}
                    {currentUser.cpf}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsListsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-green-700 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-brand-green-800"
                >
                  <Plus className="h-4 w-4 text-brand-orange-400" />
                  <span>Nova Lista Inteligente</span>
                </button>
                <button
                  type="button"
                  onClick={logoutCustomer}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left: Histórico de Compras do Cliente */}
              <div className="space-y-4 lg:col-span-7">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="h-5 w-5 text-brand-green-700" />
                      <h2 className="text-base font-black text-slate-900">
                        Meus Pedidos Anteriores ({customerOrders.length})
                      </h2>
                    </div>
                    <Link
                      href="/catalogo"
                      className="text-xs font-bold text-brand-green-700 hover:underline"
                    >
                      Fazer nova compra →
                    </Link>
                  </div>

                  <div className="mt-4 space-y-3">
                    {customerOrders.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                        <ShoppingBag className="mx-auto h-8 w-8 text-slate-400" />
                        <p className="mt-2 text-sm font-bold text-slate-700">
                          Você ainda não tem pedidos anteriores.
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Seus pedidos aparecerão aqui depois da compra.
                        </p>
                      </div>
                    ) : customerOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-mono text-xs font-black text-brand-green-800">
                              Pedido #{ord.id.slice(0, 10)}
                            </span>
                            <span className="ml-2 text-[11px] text-slate-500">
                              {new Date(ord.criado_em).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                            <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                              {ord.status}
                            </span>
                          </div>
                          <span className="text-sm font-black text-slate-900">
                            {formatBRL(Number(ord.total))}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {ord.endereco} • Pagamento: {ord.forma_pagamento}
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {(ord.itens_json || []).map((it, idx) => (
                            <span
                              key={idx}
                              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700"
                            >
                              {formatProductQuantity(
                                products.find(
                                  (product) => product.id === it.produto_id
                                ) || { unit: it.unidade || "un" },
                                it.quantidade
                              )}{" "}
                              {it.nome}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              addOrderItemsToCart(ord.itens_json || []);
                              setIsCartDrawerOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-green-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-brand-green-700"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Comprar Novamente</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Listas de Compras Salvas na Conta */}
              <div className="space-y-4 lg:col-span-5">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <FolderHeart className="h-5 w-5 text-brand-orange-500" />
                      <h2 className="text-base font-black text-slate-900">
                        Minhas Listas Salvas ({savedLists.length})
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsListsModalOpen(true)}
                      className="text-xs font-extrabold text-brand-orange-600 hover:underline"
                    >
                      + Criar Lista
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {savedLists.map((list) => {
                      const count = Object.values(list.items).reduce(
                        (a, b) => a + b,
                        0
                      );
                      return (
                        <div
                          key={list.id}
                          className="rounded-2xl border border-slate-200 p-3.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-xs font-black text-slate-900">
                                {list.name}
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                {count} itens • {list.createdAt}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                loadListIntoCart(list.id, "merge");
                                setIsCartDrawerOpen(true);
                              }}
                              className="rounded-lg bg-brand-green-600 px-2.5 py-1 text-[11px] font-extrabold text-white hover:bg-brand-green-700"
                            >
                              Carregar
                            </button>
                          </div>

                          <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2.5">
                            <button
                              type="button"
                              onClick={() => handleDuplicateList(list)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                            >
                              {copiedId === list.id ? (
                                <>
                                  <Check className="h-3 w-3 text-brand-green-600" />
                                  <span>Cópia Gerada!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Gerar Cópia</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleShareListWhatsApp(list)}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-extrabold text-white hover:bg-emerald-700"
                            >
                              <Share2 className="h-3 w-3" />
                              <span>Compartilhar no WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer selectedBranch={selectedBranch} />
    </div>
  );
}

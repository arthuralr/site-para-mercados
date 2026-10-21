"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Calendar,
  ShieldCheck,
  Percent,
  Clock,
  Leaf,
  AlertTriangle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";

export default function StoreCardRequestPage() {
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
    removeFromCart,
    clearProductFromCart,
    toggleFavorite,
    storeSettings,
    submitStoreCardRequest,
  } = useStore();

  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [occupation, setOccupation] = useState("");
  const [preferredDueDay, setPreferredDueDay] = useState("Dia 10");
  const [branchName, setBranchName] = useState(selectedBranch.name);
  const [submittedProtocol, setSubmittedProtocol] = useState<string | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await submitStoreCardRequest({
      fullName,
      cpf,
      phone,
      email,
      monthlyIncome,
      occupation,
      preferredDueDay,
      branchName,
    });
    setSubmittedProtocol(created.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        {!storeSettings.storeCardEnabled ? (
          <div className="mx-auto max-w-xl rounded-3xl border-2 border-amber-300 bg-white p-8 text-center shadow-soft">
            <AlertTriangle className="mx-auto h-12 w-12 text-brand-orange-500" />
            <h1 className="mt-3 text-xl font-black text-slate-900">
              Solicitação Online Temporariamente Pausada
            </h1>
            <p className="mt-2 text-xs text-slate-600">
              No momento, novas solicitações do Cartão SuperVerde estão sendo realizadas diretamente no balcão de atendimento das nossas lojas físicas.
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-xl bg-brand-green-700 px-5 py-2.5 text-xs font-extrabold text-white"
            >
              Voltar para a Loja
            </Link>
          </div>
        ) : submittedProtocol ? (
          <div className="mx-auto max-w-2xl rounded-3xl border-2 border-brand-green-600 bg-white p-8 text-center shadow-soft">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-700">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <span className="mt-3 inline-block rounded-full bg-brand-orange-100 px-3 py-1 text-xs font-black uppercase text-brand-orange-700">
              Protocolo #{submittedProtocol}
            </span>
            <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              Pré-Cadastro Recebido com Sucesso!
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Obrigado, <strong>{fullName}</strong>! Sua proposta do{" "}
              <strong>Cartão SuperVerde</strong> já foi enviada para o Painel do Gestor e nossa equipe entrará em contato pelo WhatsApp <strong>{phone}</strong> com o resultado da análise.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmittedProtocol(null);
                  setFullName("");
                  setCpf("");
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Nova Solicitação
              </button>
              <Link
                href="/"
                className="rounded-xl bg-brand-green-700 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-brand-green-800"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Card Visual & Benefits */}
            <div className="space-y-6 lg:col-span-5">
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green-900 via-brand-green-800 to-emerald-700 p-6 text-white shadow-xl sm:p-8">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange-500 px-3 py-1 text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" /> Cartão Exclusivo da Rede
                </span>
                <h1 className="mt-3 text-2xl font-black sm:text-3xl">
                  Peça seu Cartão da Loja SuperVerde
                </h1>
                <p className="mt-2 text-xs leading-relaxed text-emerald-100">
                  Mais prazo para pagar suas compras do mês, parcelamento exclusivo em setores selecionados e descontos extras automáticos.
                </p>

                {/* Simulated Physical Credit Card */}
                <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-gradient-to-tr from-slate-950 via-brand-green-900 to-brand-green-700 p-5 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-600">
                        <Leaf className="h-5 w-5 text-brand-orange-400" />
                      </div>
                      <span className="text-base font-black tracking-tight">
                        Super<span className="text-brand-orange-400">Verde</span>{" "}
                        Card
                      </span>
                    </div>
                    <CreditCard className="h-6 w-6 text-amber-400" />
                  </div>
                  <div className="my-5 font-mono text-base tracking-widest text-emerald-100 sm:text-lg">
                    5492 •••• •••• 2026
                  </div>
                  <div className="flex items-end justify-between text-[11px]">
                    <div>
                      <span className="block text-[9px] uppercase text-emerald-300">
                        Titular do Cartão
                      </span>
                      <span className="font-bold uppercase tracking-wider text-white">
                        {fullName || "CLIENTE VIP SUPERVERDE"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] uppercase text-emerald-300">
                        Vencimento
                      </span>
                      <span className="font-bold text-amber-300">
                        {preferredDueDay}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="mt-6 space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-400" />
                    <span>
                      <strong>Até 40 dias para pagar</strong> suas compras de supermercado dependendo da data da compra.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Percent className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-400" />
                    <span>
                      <strong>Parcelamento em até 3x sem juros</strong> em itens de Bazar, Bebidas Finas e Churrasco.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-400" />
                    <span>
                      <strong>Fatura 100% digital</strong> enviada no seu WhatsApp e pagamento liberado na hora via PIX.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pre-registration Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8"
              >
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green-700">
                    Pré-Cadastro Online Rápido
                  </span>
                  <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                    Preencha seus dados para análise de crédito
                  </h2>
                  <p className="text-xs text-slate-500">
                    Seus dados estão protegidos pela LGPD e são encaminhados diretamente à mesa aprovadora do SuperVerde.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Nome Completo (Sem abreviações) *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Maria Aparecida da Silva"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      CPF *
                    </label>
                    <input
                      type="text"
                      required
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      WhatsApp / Celular com DDD *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      E-mail para Fatura Digital *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Renda Mensal Aproximada *
                    </label>
                    <input
                      type="text"
                      required
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      placeholder="Ex: R$ 3.500,00"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Profissão / Ocupação *
                    </label>
                    <input
                      type="text"
                      required
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="Ex: Comerciante, Professor(a), Autônomo..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Melhor Dia para Vencimento da Fatura *
                    </label>
                    <select
                      value={preferredDueDay}
                      onChange={(e) => setPreferredDueDay(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800"
                    >
                      <option value="Dia 05">Dia 05 de cada mês</option>
                      <option value="Dia 10">Dia 10 de cada mês</option>
                      <option value="Dia 15">Dia 15 de cada mês</option>
                      <option value="Dia 20">Dia 20 de cada mês</option>
                      <option value="Dia 25">Dia 25 de cada mês</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Unidade de Preferência para Retirada do Cartão *
                    </label>
                    <select
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name} — {b.address}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange-500 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-brand-orange-600"
                >
                  <ShieldCheck className="h-5 w-5" />
                  <span>Enviar Solicitação do Cartão da Loja</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer selectedBranch={selectedBranch} />
    </div>
  );
}

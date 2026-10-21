"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Percent,
  Gift,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";

export default function DiscountClubPage() {
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
    submitDiscountClubMember,
  } = useStore();

  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [favoriteDepartment, setFavoriteDepartment] = useState(
    "Hortifrúti & Orgânicos"
  );
  const [acceptsWhatsappOffers, setAcceptsWhatsappOffers] = useState(true);
  const [submittedClubId, setSubmittedClubId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await submitDiscountClubMember({
      fullName,
      cpf,
      whatsapp,
      email,
      favoriteDepartment,
      acceptsWhatsappOffers,
    });
    setSubmittedClubId(created.id);
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

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 space-y-8">
        {/* Hero & Pre-Registration Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Club Advantages & WhatsApp VIP Group */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl bg-gradient-to-br from-brand-green-900 via-brand-green-800 to-emerald-700 p-6 text-white shadow-soft sm:p-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> Programa de Fidelidade Oficial
              </span>
              <h1 className="mt-3 text-2xl font-black sm:text-3xl">
                Clube SuperVerde de Descontos
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-emerald-100">
                100% gratuito! Basta informar seu CPF no caixa ou comprar logado no site para desbloquear etiquetas verdes com descontos exclusivos de até 35%.
              </p>

              <div className="mt-6 space-y-3 text-xs">
                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3.5">
                  <Percent className="h-5 w-5 shrink-0 text-brand-orange-400" />
                  <div>
                    <h4 className="font-black text-white">
                      Preços Exclusivos Identificados na Gôndola e no Site
                    </h4>
                    <p className="mt-0.5 text-emerald-100">
                      Descontos automáticos em mais de 300 produtos toda semana.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3.5">
                  <Gift className="h-5 w-5 shrink-0 text-brand-orange-400" />
                  <div>
                    <h4 className="font-black text-white">
                      Sorteios Mensais e Aniversário Premiado
                    </h4>
                    <p className="mt-0.5 text-emerald-100">
                      A cada R$ 100 em compras identificadas com CPF, você ganha 1 número da sorte.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Receba Nossas Ofertas no WhatsApp */}
            <div className="rounded-3xl border-2 border-emerald-500 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <MessageCircle className="h-6 w-6 fill-white text-emerald-600" />
                </div>
                <div>
                  <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800">
                    Link Oficial do Grupo
                  </span>
                  <h3 className="mt-0.5 text-lg font-black text-slate-900">
                    Receba nossas ofertas no WhatsApp
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-600">
                Participe do grupo oficial de ofertas do SuperVerde! Grupo silencioso (apenas administradores enviam o Panfleto de Ofertas e ofertas relâmpago).
              </p>
              <a
                href={storeSettings.whatsappOffersGroupUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:bg-emerald-700"
              >
                <Smartphone className="h-4 w-4" />
                <span>Entrar no Grupo Oficial do WhatsApp</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Right: Pre-Registration Form */}
          <div className="lg:col-span-7">
            {submittedClubId ? (
              <div className="rounded-3xl border-2 border-brand-green-600 bg-white p-8 text-center shadow-soft">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-700">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <span className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-brand-green-800">
                  Cadastro #{submittedClubId} Ativado
                </span>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Bem-vindo(a) ao Clube SuperVerde, {fullName}!
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Seu CPF <strong>{cpf}</strong> já está ativo para receber todos os descontos do Clube e seus dados foram sincronizados com o Painel do Gestor.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href={storeSettings.whatsappOffersGroupUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-extrabold text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Entrar Também no Grupo de Ofertas WhatsApp</span>
                  </a>
                  <Link
                    href="/catalogo"
                    className="rounded-xl bg-brand-orange-500 px-5 py-3 text-xs font-extrabold text-white"
                  >
                    Aproveitar Ofertas do Clube
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8"
              >
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green-700">
                    Pré-Cadastro 100% Gratuito
                  </span>
                  <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                    Ative seu CPF no Clube SuperVerde
                  </h2>
                  <p className="text-xs text-slate-500">
                    Leva menos de 1 minuto. Seus dados são enviados diretamente para o Painel do Gestor da rede.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Ana Paula Ferreira"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      CPF (Para ativar descontos no caixa) *
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
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="text"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Setor Favorito para Ofertas Personalizadas
                    </label>
                    <select
                      value={favoriteDepartment}
                      onChange={(e) => setFavoriteDepartment(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800"
                    >
                      <option value="Hortifrúti & Orgânicos">
                        Hortifrúti & Orgânicos
                      </option>
                      <option value="Açougue & Churrasco">
                        Açougue & Churrasco
                      </option>
                      <option value="Padaria & Laticínios">
                        Padaria & Laticínios
                      </option>
                      <option value="Mercearia & Limpeza">
                        Mercearia & Limpeza
                      </option>
                      <option value="Bebidas & Cervejas">
                        Bebidas & Cervejas
                      </option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={acceptsWhatsappOffers}
                        onChange={(e) =>
                          setAcceptsWhatsappOffers(e.target.checked)
                        }
                        className="h-4 w-4 rounded accent-brand-green-700"
                      />
                      <span>
                        Autorizo receber o Panfleto de Ofertas e ofertas exclusivas do Clube SuperVerde pelo WhatsApp (de acordo com a LGPD).
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange-500 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-brand-orange-600"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Concluir Pré-Cadastro no Clube SuperVerde</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer selectedBranch={selectedBranch} />
    </div>
  );
}

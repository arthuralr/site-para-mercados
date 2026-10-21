"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Sparkles,
  Briefcase,
  ShieldCheck,
  Navigation,
  ExternalLink,
  Clock,
  Phone,
  CheckCircle2,
  HeartHandshake,
  Lock,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";
import { formatBRL } from "@/components/ProductCard";

type InstitutionalTab =
  | "quem-somos"
  | "lojas"
  | "clube"
  | "trabalhe"
  | "privacidade";

function InstitutionalContent() {
  const searchParams = useSearchParams();
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
  } = useStore();

  const [activeTab, setActiveTab] = useState<InstitutionalTab>("quem-somos");
  const [mapBranchId, setMapBranchId] = useState<string>(branches[0].id);

  useEffect(() => {
    const secao = searchParams.get("secao") as InstitutionalTab | null;
    if (
      secao === "quem-somos" ||
      secao === "lojas" ||
      secao === "clube" ||
      secao === "trabalhe" ||
      secao === "privacidade"
    ) {
      setActiveTab(secao);
    }
  }, [searchParams]);

  const activeMapBranch =
    branches.find((b) => b.id === mapBranchId) || branches[0];

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    activeMapBranch.address + " São Paulo"
  )}`;
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(
    activeMapBranch.address + " São Paulo"
  )}`;

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
        {/* Institutional Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-brand-green-900 via-brand-green-800 to-emerald-700 p-6 text-white shadow-soft sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-brand-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wider">
                Portal Institucional SuperVerde
              </span>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Transparência, Tradição e Compromisso com a sua Família
              </h1>
              <p className="mt-1 text-xs text-emerald-100 sm:text-sm">
                Conheça nossa história, localize nossas unidades no Google Maps ou Waze e consulte nossas políticas oficiais.
              </p>
            </div>

            {/* Social Media Badges */}
            <div className="flex flex-wrap gap-2">
              {storeSettings.socialLinks
                .filter((social) => social.name.trim() && social.url.trim())
                .map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/25"
                  >
                    {social.name.trim().toLowerCase() === "instagram" ? (
                      <Instagram className="h-4 w-4 text-brand-orange-400" />
                    ) : social.name.trim().toLowerCase() === "facebook" ? (
                      <Facebook className="h-4 w-4 text-brand-orange-400" />
                    ) : (
                      <ExternalLink className="h-4 w-4 text-brand-orange-400" />
                    )}
                    <span>{social.name}</span>
                  </a>
                ))}
              <a
                href={`https://wa.me/${storeSettings.whatsappOrderNumber.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-extrabold text-white hover:bg-emerald-600"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp: {storeSettings.whatsappDisplayPhone}</span>
              </a>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/15 pt-4">
            {[
              { id: "quem-somos", label: "Quem Somos", icon: Building2 },
              {
                id: "lojas",
                label: "Nossas Lojas e Filiais (Mapa)",
                icon: MapPin,
              },
              {
                id: "clube",
                label: "Clube SuperVerde de Descontos",
                icon: Sparkles,
              },
              { id: "trabalhe", label: "Trabalhe Conosco", icon: Briefcase },
              {
                id: "privacidade",
                label: "Política de Privacidade (LGPD)",
                icon: ShieldCheck,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as InstitutionalTab)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                    isSelected
                      ? "bg-white text-brand-green-900 shadow-md"
                      : "bg-white/10 text-emerald-100 hover:bg-white/20"
                  }`}
                >
                  <Icon className="h-4 w-4 text-brand-orange-500" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          {/* 1. QUEM SOMOS */}
          {activeTab === "quem-somos" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green-700">
                  Nossa História e Propósito
                </span>
                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  Quem Somos — Rede SuperVerde de Supermercados
                </h2>
              </div>

              <p className="text-sm leading-relaxed text-slate-700">
                {storeSettings.aboutUsText}
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <h3 className="text-base font-black text-brand-green-900">
                    🎯 Nossa Missão
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Oferecer alimentos frescos, seguros e com preço justo todos os dias, proporcionando uma experiência de compra ágil tanto nas lojas físicas quanto no delivery refrigerado.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                  <h3 className="text-base font-black text-amber-900">
                    👁️ Nossa Visão
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Ser o supermercado mais admirado da região pela excelência em Hortifrúti, Açougue e Padaria, integrando atendimento humano e inovação digital.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-black text-slate-900">
                    💚 Nossos Valores
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Ética e transparência nos preços, rigor sanitário na cadeia de frio, valorização dos produtores locais, respeito ao colaborador e foco total no cliente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. NOSSAS LOJAS E FILIAIS (COM MAPA INTERATIVO GOOGLE MAPS / WAZE) */}
          {activeTab === "lojas" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green-700">
                  Unidades Físicas & Clique e Retire
                </span>
                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  Nossas Lojas e Filiais — Endereços e Mapa Interativo
                </h2>
                <p className="text-xs text-slate-500">
                  Selecione uma unidade abaixo para visualizar no mapa e traçar sua rota via Google Maps ou Waze.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Branch Cards List */}
                <div className="space-y-3 lg:col-span-5">
                  {branches.map((branch) => {
                    const isSelected = branch.id === activeMapBranch.id;
                    return (
                      <div
                        key={branch.id}
                        onClick={() => setMapBranchId(branch.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setMapBranchId(branch.id);
                          }
                        }}
                        className={`cursor-pointer rounded-2xl border-2 p-4 transition ${
                          isSelected
                            ? "border-brand-green-600 bg-brand-green-50/70 shadow-sm"
                            : "border-slate-200 bg-white hover:border-brand-green-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="rounded-md bg-brand-orange-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-brand-orange-800">
                            {branch.sizeLabel}
                          </span>
                          <span
                            className={`text-[11px] font-bold ${
                              branch.isOpen
                                ? "text-brand-green-700"
                                : "text-red-600"
                            }`}
                          >
                            {branch.isOpen ? "Aberta" : "Fechada"}
                          </span>
                        </div>
                        <h3 className="mt-2 text-base font-black text-slate-900">
                          {branch.name}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-orange-500" />
                          <span>{branch.address} — São Paulo, SP</span>
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-brand-green-700" />
                          <span>{branch.hours}</span>
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-brand-green-700" />
                          <span>
                            {branch.phone || `SAC: ${storeSettings.sacPhone}`} • Pedido mín.{" "}
                            {formatBRL(branch.minOrder)}
                          </span>
                        </p>
                        {branch.email && (
                          <p className="mt-1 text-xs text-slate-600">
                            <a
                              href={`mailto:${branch.email}`}
                              className="hover:text-brand-green-700"
                            >
                              {branch.email}
                            </a>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Interactive Map Simulation + Google Maps & Waze Integration */}
                <div className="flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-slate-200 bg-slate-900 text-white lg:col-span-7">
                  <div className="relative flex-1 min-h-[300px] bg-slate-800 p-6 flex flex-col justify-between">
                    <iframe
                      title={`Mapa ${activeMapBranch.name}`}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=-46.6950%2C-23.5950%2C-46.6450%2C-23.5550&layer=mapnik`}
                      className="absolute inset-0 h-full w-full opacity-80"
                    />
                    <div className="relative z-10 inline-flex items-center gap-2 self-start rounded-2xl bg-slate-950/90 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-xs">
                      <MapPin className="h-4 w-4 text-brand-orange-400" />
                      <span>Visualizando: {activeMapBranch.name}</span>
                    </div>

                    <div className="relative z-10 rounded-2xl border border-white/15 bg-slate-950/90 p-4 backdrop-blur-md">
                      <h4 className="text-sm font-black text-white">
                        {activeMapBranch.name}
                      </h4>
                      <p className="text-xs text-slate-300">
                        {activeMapBranch.address} • Horário:{" "}
                        {activeMapBranch.hours}
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl bg-brand-green-600 py-2.5 text-xs font-extrabold text-white transition hover:bg-brand-green-700"
                        >
                          <Navigation className="h-4 w-4" />
                          <span>Abrir no Google Maps</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <a
                          href={wazeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-2.5 text-xs font-extrabold text-white transition hover:bg-sky-700"
                        >
                          <Navigation className="h-4 w-4" />
                          <span>Navegar com Waze</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. CLUBE SUPERVERDE DE DESCONTOS */}
          {activeTab === "clube" && (
            <div className="space-y-5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green-700">
                Fidelidade e Economia
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Clube SuperVerde de Descontos — Como Funciona
              </h2>
              <p className="text-sm leading-relaxed text-slate-700">
                O <strong>Clube SuperVerde de Descontos</strong> é o programa oficial de relacionamento da nossa rede. Ao realizar seu pré-cadastro gratuito informando seu CPF e WhatsApp, você passa a ter acesso imediato às etiquetas verdes promocionais em todos os corredores da loja e no nosso e-commerce.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
                  <h4 className="font-black text-slate-900">
                    1. Descontos Automáticos no Caixa e no Site
                  </h4>
                  <p className="mt-1 text-slate-600">
                    Basta digitar o CPF antes de passar as compras para ativar preços de atacado e ofertas exclusivas do Panfleto de Ofertas.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
                  <h4 className="font-black text-slate-900">
                    2. Ofertas no Grupo VIP do WhatsApp
                  </h4>
                  <p className="mt-1 text-slate-600">
                    Receba o Panfleto de Ofertas da semana diretamente no seu celular assim que as promoções entram no ar.
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/clube-descontos"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-orange-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-brand-orange-600"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Fazer Pré-Cadastro no Clube SuperVerde Agora</span>
                </Link>
              </div>
            </div>
          )}

          {/* 4. TRABALHE CONOSCO */}
          {activeTab === "trabalhe" && (
            <div className="space-y-5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green-700">
                Recursos Humanos & Carreira
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Trabalhe Conosco — Construa sua Carreira no SuperVerde
              </h2>
              <p className="text-sm leading-relaxed text-slate-700">
                No SuperVerde, acreditamos que um supermercado de excelência é feito por pessoas felizes e bem treinadas. Contamos com mais de 280 colaboradores diretos nas áreas de Atendimento, Frente de Caixa, Hortifrúti, Açougue, Padaria, Logística E-commerce e Administração.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/trabalhe-conosco"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-green-700 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-brand-green-800"
                >
                  <HeartHandshake className="h-4 w-4 text-brand-orange-400" />
                  <span>Acessar Formulário de Envio de Currículo</span>
                </Link>
              </div>
            </div>
          )}

          {/* 5. POLÍTICA DE PRIVACIDADE (LGPD) */}
          {activeTab === "privacidade" && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green-700">
                  Conformidade Legal — Lei nº 13.709/2018
                </span>
                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  Política de Privacidade e Proteção de Dados (LGPD)
                </h2>
              </div>

              <p className="text-sm leading-relaxed text-slate-700">
                {storeSettings.privacyPolicyIntro}
              </p>

              <div className="space-y-4 text-xs leading-relaxed text-slate-600">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="flex items-center gap-1.5 text-sm font-black text-slate-900">
                    <Lock className="h-4 w-4 text-brand-green-700" />
                    <span>1. Quais Dados Coletamos e Finalidade</span>
                  </h4>
                  <p className="mt-1">
                    Coletamos apenas os dados estritamente necessários para a prestação dos nossos serviços: Nome, CPF (para emissão de Nota Fiscal e identificação no Clube de Descontos / Cartão da Loja), Telefone/WhatsApp (para avisos sobre separação e entrega de pedidos) e Endereço Completo (para entrega em domicílio).
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="flex items-center gap-1.5 text-sm font-black text-slate-900">
                    <CheckCircle2 className="h-4 w-4 text-brand-green-700" />
                    <span>2. Direitos do Titular dos Dados</span>
                  </h4>
                  <p className="mt-1">
                    Você pode, a qualquer momento, solicitar a confirmação da existência de tratamento, o acesso, a correção ou a exclusão definitiva dos seus dados pessoais e o descadastramento de listas de transmissão no WhatsApp através do nosso canal oficial de atendimento ({storeSettings.supportEmail}).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer selectedBranch={selectedBranch} />
    </div>
  );
}

export default function InstitutionalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-bold text-brand-green-700">
          Carregando portal institucional...
        </div>
      }
    >
      <InstitutionalContent />
    </Suspense>
  );
}

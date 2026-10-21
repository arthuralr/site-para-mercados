"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Truck,
  Store,
  MessageCircle,
  ExternalLink,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  BookmarkPlus,
  ShieldCheck,
  Clock,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/mockData";
import { useStore } from "@/context/StoreContext";
import { formatBRL } from "@/components/ProductCard";
import { formatProductQuantity, isSoldByWeight } from "@/lib/productUnits";

type CheckoutMethod = "proprio" | "whatsapp" | "ifood";
type FulfillmentMode = "delivery" | "pickup";
type PaymentMethod = "pix" | "card_on_delivery" | "cash" | "food_voucher";

function CheckoutContent() {
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
    clearCart,
    toggleFavorite,
    saveCurrentCartAsList,
    setIsListsModalOpen,
    createOrder,
    storeSettings,
    currentUser,
  } = useStore();

  const [checkoutMethod, setCheckoutMethod] = useState<CheckoutMethod>(
    storeSettings.onlineShoppingEnabled ? "proprio" : "whatsapp"
  );
  const [fulfillment, setFulfillment] = useState<FulfillmentMode>("delivery");
  const [deliveryWindow, setDeliveryWindow] = useState<string>(
    "Expressa (45 - 60 min)"
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [cardBrandType, setCardBrandType] = useState<string>(
    "Cartão de Crédito / Débito (Visa, Master, Elo)"
  );
  const [voucherBrandType, setVoucherBrandType] = useState<string>(
    "Alelo Alimentação"
  );
  const [cashChangeFor, setCashChangeFor] = useState<string>("");
  const [substitutionRule, setSubstitutionRule] = useState<string>(
    "Consultar via WhatsApp antes de substituir"
  );

  // Customer & Address Form State (hydrated from currentUser if logged in)
  const [customerName, setCustomerName] = useState<string>(
    currentUser?.name || "Maria Silva"
  );
  const [customerPhone, setCustomerPhone] = useState<string>(
    currentUser?.phone || "(11) 98765-4321"
  );
  const [cep, setCep] = useState<string>(
    currentUser?.defaultAddress.cep || "01415-000"
  );
  const [street, setStreet] = useState<string>(
    currentUser?.defaultAddress.street || "Rua Bela Cintra"
  );
  const [number, setNumber] = useState<string>(
    currentUser?.defaultAddress.number || "1240"
  );
  const [complement, setComplement] = useState<string>(
    currentUser?.defaultAddress.complement || "Apto 82 - Bloco B"
  );
  const [neighborhood, setNeighborhood] = useState<string>(
    currentUser?.defaultAddress.neighborhood || "Jardins"
  );
  const [reference, setReference] = useState<string>("Próximo à padaria");

  // UI Feedback States
  const [copiedWhatsApp, setCopiedWhatsApp] = useState<boolean>(false);
  const [copiedPix, setCopiedPix] = useState<boolean>(false);
  const [orderConfirmedNumber, setOrderConfirmedNumber] = useState<
    string | null
  >(null);
  const [listNameInput, setListNameInput] = useState<string>("");
  const [listSavedFeedback, setListSavedFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name);
      setCustomerPhone(currentUser.phone);
      if (currentUser.defaultAddress.cep) setCep(currentUser.defaultAddress.cep);
      if (currentUser.defaultAddress.street)
        setStreet(currentUser.defaultAddress.street);
      if (currentUser.defaultAddress.number)
        setNumber(currentUser.defaultAddress.number);
      if (currentUser.defaultAddress.complement)
        setComplement(currentUser.defaultAddress.complement);
      if (currentUser.defaultAddress.neighborhood)
        setNeighborhood(currentUser.defaultAddress.neighborhood);
    }
  }, [currentUser]);

  useEffect(() => {
    const metodo = searchParams.get("metodo");
    if (
      metodo === "whatsapp" ||
      metodo === "ifood" ||
      metodo === "proprio"
    ) {
      setCheckoutMethod(metodo);
    }
  }, [searchParams]);

  // Cart items & calculations
  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => p.id === id);
      return product ? { product, qty } : null;
    })
    .filter(Boolean) as { product: Product; qty: number }[];

  const totalItems = cartEntries.length;
  const subtotal = cartEntries.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );
  const totalSavings = cartEntries.reduce((acc, item) => {
    const diff = item.product.oldPrice
      ? item.product.oldPrice - item.product.price
      : 0;
    return acc + diff * item.qty;
  }, 0);

  const isFreeShipping =
    fulfillment === "pickup" ||
    subtotal >= selectedBranch.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : 9.9;
  const finalTotal = subtotal + shippingFee;

  const minOrderRemaining =
    fulfillment === "delivery"
      ? Math.max(0, selectedBranch.minOrder - subtotal)
      : 0;
  const meetsMinOrder = minOrderRemaining === 0;

  // Formatted WhatsApp Message Generator (Option A)
  const paymentLabelMap: Record<PaymentMethod, string> = {
    pix: `PIX Imediato (Chave: ${storeSettings.paymentPixKey})`,
    card_on_delivery: `Cartão na Entrega (${cardBrandType})`,
    food_voucher: `Vale-Alimentação na Entrega (${voucherBrandType})`,
    cash: cashChangeFor
      ? `Dinheiro (Troco para R$ ${cashChangeFor})`
      : "Dinheiro (Não precisa de troco)",
  };

  const generateWhatsAppOrderText = () => {
    const lines: string[] = [
      `🛒 *NOVO PEDIDO — SUPERVERDE ONLINE*`,
      `📍 *Filial:* ${selectedBranch.name}`,
      `-----------------------------------`,
      `👤 *Cliente:* ${customerName || "Não informado"}`,
      `📱 *Telefone:* ${customerPhone || "Não informado"}`,
      `🚚 *Modalidade:* ${
        fulfillment === "delivery"
          ? `Delivery (${deliveryWindow})`
          : `Retirada na Loja / Clique e Retire (${deliveryWindow})`
      }`,
    ];

    if (fulfillment === "delivery") {
      lines.push(
        `🏠 *Endereço:* ${street}, ${number}${
          complement ? ` (${complement})` : ""
        } - ${neighborhood} | CEP: ${cep}`
      );
      if (reference) {
        lines.push(`📌 *Referência:* ${reference}`);
      }
    }

    lines.push(`-----------------------------------`);
    lines.push(`📦 *ITENS DO PEDIDO (${totalItems} produtos):*`);

    cartEntries.forEach(({ product, qty }, idx) => {
      lines.push(
        `${idx + 1}. *${formatProductQuantity(product, qty)} de ${product.name}* (${
          product.weightVolume
        })\n   └ ${formatBRL(product.price)}/${isSoldByWeight(product) ? "kg" : "un"} = *${formatBRL(
          product.price * qty
        )}*`
      );
    });

    lines.push(`-----------------------------------`);
    lines.push(`💰 *Subtotal:* ${formatBRL(subtotal)}`);
    if (totalSavings > 0) {
      lines.push(`🔥 *Economia nas Ofertas:* -${formatBRL(totalSavings)}`);
    }
    lines.push(
      `🛵 *Taxa de Entrega:* ${
        shippingFee === 0 ? "GRÁTIS" : formatBRL(shippingFee)
      }`
    );
    lines.push(`✅ *VALOR TOTAL FINAL: ${formatBRL(finalTotal)}*`);
    lines.push(`-----------------------------------`);
    lines.push(`💳 *Forma de Pagamento:* ${paymentLabelMap[paymentMethod]}`);
    lines.push(`🔄 *Se faltar algum item:* ${substitutionRule}`);

    return lines.join("\n");
  };

  const whatsappMessage = generateWhatsAppOrderText();
  const cleanWaNumber =
    storeSettings.whatsappOrderNumber.replace(/\D/g, "") || "5511999999999";
  const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const handleCopyWhatsAppText = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handleConfirmOwnCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetsMinOrder) return;

    const formattedAddress =
      fulfillment === "pickup"
        ? `Retirada na Loja — ${selectedBranch.name}`
        : `${street}, ${number}${
            complement ? ` (${complement})` : ""
          } - ${neighborhood} | CEP ${cep}`;

    const itensJson = cartEntries.map(({ product, qty }) => ({
      produto_id: product.id,
      nome: product.name,
      quantidade: qty,
      preco_unitario: product.price,
      unidade: product.unit,
    }));

    const created = await createOrder({
      cliente_nome: customerName || "Cliente SuperVerde",
      cliente_email: currentUser?.email,
      cliente_telefone: customerPhone || "(11) 99999-9999",
      endereco: formattedAddress,
      itens_json: itensJson,
      total: Number(finalTotal.toFixed(2)),
      status: "Recebido",
      canal:
        fulfillment === "pickup"
          ? "Clique e Retire"
          : `Site Próprio (${paymentMethod.toUpperCase()})`,
      forma_pagamento: paymentLabelMap[paymentMethod],
      filial: selectedBranch.name,
    });

    setOrderConfirmedNumber(created.id.slice(0, 12).toUpperCase());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickSaveList = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = saveCurrentCartAsList(listNameInput || "Compras do Mês");
    if (ok) {
      setListNameInput("");
      setListSavedFeedback(true);
      setTimeout(() => setListSavedFeedback(false), 3000);
    }
  };

  const voucherBrandsList = storeSettings.paymentFoodVoucherBrands
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

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

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {/* Breadcrumb & Account Status */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-brand-green-700">
              Início
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-bold text-slate-800">
              Fechamento de Pedido & Checkout Flexível
            </span>
          </nav>

          {currentUser ? (
            <Link
              href="/conta"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-100 px-3 py-1 text-xs font-bold text-brand-green-800"
            >
              <User className="h-3.5 w-3.5" />
              <span>Logado como {currentUser.name} (Ver Histórico)</span>
            </Link>
          ) : (
            <Link
              href="/conta"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-brand-green-700 hover:bg-brand-green-50"
            >
              <User className="h-3.5 w-3.5" />
              <span>Já tem conta? Faça Login para salvar no seu histórico →</span>
            </Link>
          )}
        </div>

        {/* Order Confirmation Screen (When Own Checkout is completed) */}
        {orderConfirmedNumber ? (
          <div className="mx-auto max-w-2xl rounded-3xl border-2 border-brand-green-600 bg-white p-6 text-center shadow-soft sm:p-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-700">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <span className="rounded-full bg-brand-orange-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-orange-700">
              Pedido Recebido com Sucesso
            </span>
            <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              Obrigado pela sua compra, {customerName}!
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Protocolo do pedido:{" "}
              <strong className="font-mono text-base text-brand-green-800">
                #{orderConfirmedNumber}
              </strong>{" "}
              • Filial: <strong>{selectedBranch.name}</strong>
            </p>

            {/* Pix QR Code Box if Pix was selected */}
            {paymentMethod === "pix" && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-left">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-brand-green-700 bg-white p-2 text-brand-green-800 shadow-xs">
                    <QrCode className="h-16 w-16" />
                    <span className="mt-1 text-[10px] font-black uppercase">
                      QR Code PIX
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-black text-brand-green-900">
                      Pagamento Instantâneo via PIX ({formatBRL(finalTotal)})
                    </h3>
                    <p className="text-xs font-bold text-emerald-800">
                      Chave PIX Oficial: {storeSettings.paymentPixKey}
                    </p>
                    <p className="text-xs text-slate-600">
                      Copie o código Pix abaixo ou escaneie o QR Code no aplicativo do seu banco:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={storeSettings.paymentPixCode}
                        className="w-full rounded-xl border border-emerald-300 bg-white px-3 py-2 font-mono text-[11px] text-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            storeSettings.paymentPixCode
                          );
                          setCopiedPix(true);
                          setTimeout(() => setCopiedPix(false), 2500);
                        }}
                        className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-brand-green-700 px-3.5 py-2 text-xs font-extrabold text-white hover:bg-brand-green-800"
                      >
                        {copiedPix ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copiar PIX</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save as Recurring List Prompt after Order */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Deseja salvar estes itens como uma Lista de Compra Recorrente?
              </h4>
              <form
                onSubmit={handleQuickSaveList}
                className="mt-2 flex flex-col gap-2 sm:flex-row"
              >
                <input
                  type="text"
                  value={listNameInput}
                  onChange={(e) => setListNameInput(e.target.value)}
                  placeholder='Ex: "Compras do Mês", "Reposição de Quarta"...'
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-orange-500 px-4 py-2 text-xs font-extrabold text-white hover:bg-brand-orange-600"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  <span>
                    {listSavedFeedback ? "Lista Salva!" : "Salvar Lista"}
                  </span>
                </button>
              </form>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-green-600 px-5 py-3 text-xs font-extrabold text-white shadow-sm hover:bg-brand-green-700"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Acompanhar Pedido no WhatsApp</span>
              </a>
              <Link
                href="/conta"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-xs font-bold text-brand-green-800 hover:bg-emerald-100"
              >
                Ver Meus Pedidos
              </Link>
              <Link
                href="/"
                onClick={() => {
                  setOrderConfirmedNumber(null);
                  clearCart();
                }}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        ) : (
          <>
            {!storeSettings.onlineShoppingEnabled && (
              <div className="mb-6 rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-xs text-amber-950">
                <strong className="font-black uppercase">
                  ⚠️ Modo Vitrine / Panfleto de Ofertas Ativo:
                </strong>{" "}
                O checkout direto no site está temporariamente desativado pelo gestor da loja. Você pode enviar sua lista formatada diretamente para nosso{" "}
                <strong>WhatsApp ({storeSettings.whatsappDisplayPhone})</strong>{" "}
                abaixo!
              </div>
            )}

            {/* Top Method Selector Banner: Choose Option A, B, or C */}
            <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="mb-4">
                <span className="inline-block rounded-lg bg-brand-green-100 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green-800">
                  Checkout Flexível Omnichannel
                </span>
                <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                  Como você prefere finalizar seu pedido hoje?
                </h1>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Escolha entre o Checkout Próprio do site, envio direto formatado para nosso WhatsApp ({storeSettings.whatsappDisplayPhone}) ou loja oficial no iFood.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {/* Option C Tab: Checkout Próprio */}
                {storeSettings.onlineShoppingEnabled && (
                  <button
                    type="button"
                    onClick={() => setCheckoutMethod("proprio")}
                    className={`flex items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition-all ${
                      checkoutMethod === "proprio"
                        ? "border-brand-green-600 bg-brand-green-50/70 shadow-sm"
                        : "border-slate-200 bg-white hover:border-brand-green-300"
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-700 text-white">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="inline-block rounded bg-brand-orange-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                        Opção C • Recomendado
                      </span>
                      <h3 className="mt-1 text-sm font-black text-slate-900">
                        Checkout Próprio no Site
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Delivery ou Retirada com Pix, Cartão, Vale-Alimentação ou Dinheiro.
                      </p>
                    </div>
                  </button>
                )}

                {/* Option A Tab: Pedido via WhatsApp */}
                <button
                  type="button"
                  onClick={() => setCheckoutMethod("whatsapp")}
                  className={`flex items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition-all ${
                    checkoutMethod === "whatsapp"
                      ? "border-emerald-600 bg-emerald-50/80 shadow-sm"
                      : "border-slate-200 bg-white hover:border-emerald-300"
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <MessageCircle className="h-5 w-5 fill-white text-emerald-600" />
                  </div>
                  <div>
                    <span className="inline-block rounded bg-emerald-700 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                      Opção A • Atendimento Direto
                    </span>
                    <h3 className="mt-1 text-sm font-black text-slate-900">
                      Enviar Pedido via WhatsApp
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Mensagem formatada para {storeSettings.whatsappDisplayPhone}.
                    </p>
                  </div>
                </button>

                {/* Option B Tab: Integração com iFood */}
                {storeSettings.ifoodEnabled && (
                  <button
                    type="button"
                    onClick={() => setCheckoutMethod("ifood")}
                    className={`flex items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition-all ${
                      checkoutMethod === "ifood"
                        ? "border-[#EA1D2C] bg-red-50/70 shadow-sm"
                        : "border-slate-200 bg-white hover:border-red-300"
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EA1D2C] text-white font-black text-xs">
                      iFood
                    </div>
                    <div>
                      <span className="inline-block rounded bg-[#EA1D2C] px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                        Opção B • Parceiro Oficial
                      </span>
                      <h3 className="mt-1 text-sm font-black text-slate-900">
                        Peça pelo iFood
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Redirecionamento direto para nossa loja oficial no iFood.
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Main Checkout Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* LEFT COLUMN: 7 cols */}
              <div className="space-y-6 lg:col-span-7">
                {!meetsMinOrder && checkoutMethod !== "ifood" && (
                  <div className="flex flex-col justify-between gap-3 rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange-600" />
                      <div>
                        <h4 className="text-sm font-black text-amber-950">
                          Valor mínimo para Delivery nesta filial:{" "}
                          {formatBRL(selectedBranch.minOrder)}
                        </h4>
                        <p className="text-xs text-amber-900">
                          Adicione mais{" "}
                          <strong>{formatBRL(minOrderRemaining)}</strong> em
                          produtos ou mude para{" "}
                          <strong>
                            Retirada na Loja (Grátis e sem mínimo)
                          </strong>
                          .
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFulfillment("pickup")}
                      className="shrink-0 rounded-xl bg-brand-orange-500 px-3.5 py-2 text-xs font-extrabold text-white hover:bg-brand-orange-600"
                    >
                      Mudar para Retirada
                    </button>
                  </div>
                )}

                {/* OPÇÃO B: INTEGRAÇÃO COM IFOOD */}
                {checkoutMethod === "ifood" && storeSettings.ifoodEnabled && (
                  <div className="overflow-hidden rounded-3xl border-2 border-[#EA1D2C]/80 bg-white shadow-soft">
                    <div className="bg-gradient-to-r from-[#EA1D2C] to-red-700 p-6 text-white">
                      <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider">
                        Loja Oficial Verificada
                      </span>
                      <h2 className="mt-1.5 text-2xl font-black">
                        SuperVerde no iFood Mercado
                      </h2>
                      <p className="mt-1 text-xs text-red-100 sm:text-sm">
                        Prefere usar seu saldo iFood Card, Clube iFood ou rastreio por entregador parceiro? Acesse nossa loja oficial diretamente no iFood!
                      </p>
                    </div>

                    <div className="p-6 space-y-5">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                          Link Oficial Configurado pelo Gestor:
                        </h4>
                        <p className="mt-1 font-mono text-xs text-slate-700 break-all">
                          {storeSettings.ifoodStoreUrl}
                        </p>
                      </div>

                      <a
                        href={storeSettings.ifoodStoreUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#EA1D2C] py-4 text-base font-black text-white shadow-lg transition hover:bg-[#c91623]"
                      >
                        <span>Abrir Loja Oficial SuperVerde no iFood</span>
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* OPÇÃO A (WHATSAPP) OU OPÇÃO C (CHECKOUT PRÓPRIO) */}
                {(checkoutMethod === "proprio" ||
                  checkoutMethod === "whatsapp") && (
                  <form
                    onSubmit={handleConfirmOwnCheckout}
                    className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-soft sm:p-7"
                  >
                    {/* Step 1: Delivery vs Store Pickup */}
                    <div>
                      <h2 className="flex items-center gap-2 text-base font-black text-slate-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green-700 text-xs text-white">
                          1
                        </span>
                        <span>Escolha entre Delivery ou Retirada na Loja</span>
                      </h2>

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setFulfillment("delivery")}
                          className={`flex items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition ${
                            fulfillment === "delivery"
                              ? "border-brand-green-600 bg-brand-green-50/60"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-700" />
                          <div>
                            <span className="block text-xs font-black text-slate-900">
                              Delivery (Receber em Casa)
                            </span>
                            <span className="block text-[11px] text-slate-500">
                              Entrega refrigerada em{" "}
                              {selectedBranch.deliveryTime}
                            </span>
                            <span className="mt-1 inline-block text-[11px] font-extrabold text-brand-green-700">
                              {shippingFee === 0
                                ? "Frete Grátis Liberado!"
                                : `Taxa: ${formatBRL(shippingFee)}`}
                            </span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFulfillment("pickup")}
                          className={`flex items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition ${
                            fulfillment === "pickup"
                              ? "border-brand-orange-500 bg-brand-orange-50/60"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <Store className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange-600" />
                          <div>
                            <span className="block text-xs font-black text-slate-900">
                              Retirada na Loja (Clique e Retire)
                            </span>
                            <span className="block text-[11px] text-slate-500">
                              {selectedBranch.address}
                            </span>
                            <span className="mt-1 inline-block text-[11px] font-extrabold text-brand-orange-600">
                              100% Grátis • Sem valor mínimo
                            </span>
                          </div>
                        </button>
                      </div>

                      <div className="mt-3">
                        <label className="mb-1.5 block text-xs font-bold text-slate-600">
                          Janela de Horário Preferida:
                        </label>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          {[
                            "Expressa (45 - 60 min)",
                            "Hoje (18h00 às 20h00)",
                            "Amanhã (08h00 às 10h00)",
                          ].map((win) => (
                            <button
                              key={win}
                              type="button"
                              onClick={() => setDeliveryWindow(win)}
                              className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                                deliveryWindow === win
                                  ? "border-brand-green-700 bg-brand-green-700 text-white"
                                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <Clock className="h-3.5 w-3.5" />
                              <span>{win}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Customer Data & Address */}
                    <div className="border-t border-slate-100 pt-5">
                      <h2 className="flex items-center gap-2 text-base font-black text-slate-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green-700 text-xs text-white">
                          2
                        </span>
                        <span>
                          Seus Dados{" "}
                          {fulfillment === "delivery" &&
                            "& Endereço de Entrega"}
                        </span>
                      </h2>

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-600">
                            Nome Completo *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-600">
                            WhatsApp / Telefone *
                          </label>
                          <input
                            type="text"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {fulfillment === "delivery" && (
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-6">
                          <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-bold text-slate-600">
                              CEP *
                            </label>
                            <input
                              type="text"
                              required
                              value={cep}
                              onChange={(e) => setCep(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <label className="mb-1 block text-xs font-bold text-slate-600">
                              Rua / Avenida *
                            </label>
                            <input
                              type="text"
                              required
                              value={street}
                              onChange={(e) => setStreet(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-bold text-slate-600">
                              Número *
                            </label>
                            <input
                              type="text"
                              required
                              value={number}
                              onChange={(e) => setNumber(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-bold text-slate-600">
                              Complemento / Apto
                            </label>
                            <input
                              type="text"
                              value={complement}
                              onChange={(e) => setComplement(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-bold text-slate-600">
                              Bairro *
                            </label>
                            <input
                              type="text"
                              required
                              value={neighborhood}
                              onChange={(e) => setNeighborhood(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-6">
                            <label className="mb-1 block text-xs font-bold text-slate-600">
                              Ponto de Referência / Instruções de Portaria
                            </label>
                            <input
                              type="text"
                              value={reference}
                              onChange={(e) => setReference(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step 3: Payment Method (Pix, Cartão na Entrega, Vale-Alimentação ou Dinheiro) */}
                    <div className="border-t border-slate-100 pt-5">
                      <h2 className="flex items-center gap-2 text-base font-black text-slate-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green-700 text-xs text-white">
                          3
                        </span>
                        <span>Escolha a Forma de Pagamento</span>
                      </h2>

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {storeSettings.paymentPixEnabled && (
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("pix")}
                            className={`flex flex-col items-start rounded-2xl border-2 p-3.5 text-left transition ${
                              paymentMethod === "pix"
                                ? "border-brand-green-600 bg-brand-green-50/70"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <QrCode className="h-5 w-5 text-brand-green-700" />
                            <span className="mt-1.5 text-xs font-black text-slate-900">
                              PIX (Chave Rápida)
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Chave: {storeSettings.paymentPixKey}
                            </span>
                          </button>
                        )}

                        {storeSettings.paymentCardOnDeliveryEnabled && (
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("card_on_delivery")}
                            className={`flex flex-col items-start rounded-2xl border-2 p-3.5 text-left transition ${
                              paymentMethod === "card_on_delivery"
                                ? "border-brand-green-600 bg-brand-green-50/70"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <CreditCard className="h-5 w-5 text-brand-orange-500" />
                            <span className="mt-1.5 text-xs font-black text-slate-900">
                              Cartão na Entrega (Maquininha)
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Crédito, Débito ou Cartão SuperVerde
                            </span>
                          </button>
                        )}

                        {storeSettings.paymentFoodVoucherEnabled && (
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("food_voucher")}
                            className={`flex flex-col items-start rounded-2xl border-2 p-3.5 text-left transition ${
                              paymentMethod === "food_voucher"
                                ? "border-brand-green-600 bg-brand-green-50/70"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <Wallet className="h-5 w-5 text-amber-600" />
                            <span className="mt-1.5 text-xs font-black text-slate-900">
                              Vale-Alimentação
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {storeSettings.paymentFoodVoucherBrands}
                            </span>
                          </button>
                        )}

                        {storeSettings.paymentCashEnabled && (
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("cash")}
                            className={`flex flex-col items-start rounded-2xl border-2 p-3.5 text-left transition ${
                              paymentMethod === "cash"
                                ? "border-brand-green-600 bg-brand-green-50/70"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <Banknote className="h-5 w-5 text-emerald-700" />
                            <span className="mt-1.5 text-xs font-black text-slate-900">
                              Dinheiro na Entrega
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Informe abaixo se precisar de troco
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Conditional Sub-options */}
                      {paymentMethod === "pix" && (
                        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs">
                          <span className="font-bold text-brand-green-900">
                            Chave PIX Configurada pelo Mercado:
                          </span>{" "}
                          <span className="font-mono text-slate-800">
                            {storeSettings.paymentPixKey}
                          </span>
                        </div>
                      )}

                      {paymentMethod === "card_on_delivery" && (
                        <div className="mt-3 rounded-2xl bg-slate-50 p-3.5">
                          <label className="mb-1.5 block text-xs font-bold text-slate-700">
                            Qual cartão você utilizará na maquininha?
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "Cartão de Crédito (Visa / Master / Elo)",
                              "Cartão de Débito",
                              "Cartão da Loja SuperVerde",
                            ].map((b) => (
                              <button
                                key={b}
                                type="button"
                                onClick={() => setCardBrandType(b)}
                                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                                  cardBrandType === b
                                    ? "border-brand-green-700 bg-brand-green-700 text-white"
                                    : "border-slate-200 bg-white text-slate-700"
                                }`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {paymentMethod === "food_voucher" && (
                        <div className="mt-3 rounded-2xl bg-slate-50 p-3.5">
                          <label className="mb-1.5 block text-xs font-bold text-slate-700">
                            Selecione a bandeira do seu Vale-Alimentação:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(voucherBrandsList.length > 0
                              ? voucherBrandsList
                              : [
                                  "Alelo Alimentação",
                                  "Pluxee (Sodexo)",
                                  "Ticket Alimentação",
                                  "VR Benefícios",
                                ]
                            ).map((b) => (
                              <button
                                key={b}
                                type="button"
                                onClick={() => setVoucherBrandType(b)}
                                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                                  voucherBrandType === b
                                    ? "border-brand-orange-500 bg-brand-orange-500 text-white"
                                    : "border-slate-200 bg-white text-slate-700"
                                }`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {paymentMethod === "cash" && (
                        <div className="mt-3 rounded-2xl bg-slate-50 p-3.5">
                          <label className="mb-1 block text-xs font-bold text-slate-700">
                            Precisa de troco para quanto? (Deixe em branco se não precisar)
                          </label>
                          <input
                            type="text"
                            value={cashChangeFor}
                            onChange={(e) => setCashChangeFor(e.target.value)}
                            placeholder="Ex: 100,00 ou 200,00"
                            className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                          />
                        </div>
                      )}
                    </div>

                    {/* Step 4: Substitution Preference */}
                    <div className="border-t border-slate-100 pt-5">
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Caso algum produto perecível esteja indisponível na gôndola:
                      </label>
                      <select
                        value={substitutionRule}
                        onChange={(e) => setSubstitutionRule(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800"
                      >
                        <option value="Consultar via WhatsApp antes de substituir">
                          Me chamar no WhatsApp para escolher substituto
                        </option>
                        <option value="Substituir por marca equivalente de mesmo valor">
                          Autorizo substituir por similar de mesma qualidade
                        </option>
                        <option value="Não substituir (remover item do pedido)">
                          Não substituir (apenas descontar o item)
                        </option>
                      </select>
                    </div>

                    {/* OPÇÃO A: WHATSAPP PREVIEW & SUBMIT */}
                    {checkoutMethod === "whatsapp" ||
                    !storeSettings.onlineShoppingEnabled ? (
                      <div className="space-y-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/60 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-900">
                            <MessageCircle className="h-4 w-4 text-emerald-600" />
                            Mensagem Formatada para {storeSettings.whatsappDisplayPhone}:
                          </h3>
                          <button
                            type="button"
                            onClick={handleCopyWhatsAppText}
                            className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-800 shadow-xs hover:bg-emerald-100"
                          >
                            {copiedWhatsApp ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Texto Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copiar Texto</span>
                              </>
                            )}
                          </button>
                        </div>

                        <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap rounded-xl border border-emerald-200 bg-white p-3.5 font-mono text-[11px] leading-relaxed text-slate-700">
                          {whatsappMessage}
                        </pre>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-green-600 py-4 text-sm font-black text-white shadow-lg transition hover:bg-brand-green-700"
                        >
                          <MessageCircle className="h-5 w-5 fill-white text-brand-green-600" />
                          <span>
                            Enviar Pedido Formatado via WhatsApp ({formatBRL(finalTotal)})
                          </span>
                        </a>
                      </div>
                    ) : (
                      /* OPÇÃO C: CHECKOUT PRÓPRIO SUBMIT BUTTON */
                      <button
                        type="submit"
                        disabled={!meetsMinOrder || totalItems === 0}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange-500 py-4 text-base font-black text-white shadow-lg transition hover:bg-brand-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ShieldCheck className="h-5 w-5" />
                        <span>
                          Confirmar e Finalizar Pedido ({formatBRL(finalTotal)})
                        </span>
                      </button>
                    )}
                  </form>
                )}
              </div>

              {/* RIGHT COLUMN: 5 cols — Order Summary */}
              <div className="space-y-6 lg:col-span-5">
                <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-soft sm:p-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Resumo do Carrinho ({totalItems})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Confira ou ajuste quantidades antes de enviar
                      </p>
                    </div>
                    {cartEntries.length > 0 && (
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        Limpar tudo
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 py-2">
                    {cartEntries.map(({ product, qty }) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between gap-2.5 py-2.5"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-800">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {formatBRL(product.price)} /{" "}
                            {isSoldByWeight(product) ? "kg" : "un"} ×{" "}
                            {formatProductQuantity(product, qty)} ={" "}
                            <strong className="text-brand-green-700">
                              {formatBRL(product.price * qty)}
                            </strong>
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-10 text-center text-xs font-extrabold">
                            {formatProductQuantity(product, qty)}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-green-600 text-white"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => clearProductFromCart(product.id)}
                            className="ml-1 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal dos produtos:</span>
                      <span className="font-bold">{formatBRL(subtotal)}</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between rounded-lg bg-brand-orange-50 px-2.5 py-1.5 font-extrabold text-brand-orange-700">
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" /> Economia nas
                          ofertas:
                        </span>
                        <span>-{formatBRL(totalSavings)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>
                        Taxa de Entrega (
                        {fulfillment === "pickup" ? "Retirada" : "Delivery"}):
                      </span>
                      <span className="font-bold text-brand-green-700">
                        {shippingFee === 0 ? "GRÁTIS" : formatBRL(shippingFee)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-black text-slate-900">
                      <span>Total a Pagar:</span>
                      <span className="text-xl text-brand-green-800">
                        {formatBRL(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recurring Shopping List Card */}
                <div className="rounded-3xl border-2 border-brand-green-600/30 bg-gradient-to-b from-brand-green-50/90 to-white p-5 shadow-card">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-green-700 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                      Listas Inteligentes
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsListsModalOpen(true)}
                      className="text-xs font-extrabold text-brand-green-700 underline hover:text-brand-green-900"
                    >
                      Gerenciar / Compartilhar listas
                    </button>
                  </div>
                  <h3 className="mt-2 text-sm font-black text-slate-900">
                    Salve este carrinho para recarregar ou compartilhar no WhatsApp!
                  </h3>
                  <form
                    onSubmit={handleQuickSaveList}
                    className="mt-3 flex flex-col gap-2 sm:flex-row"
                  >
                    <input
                      type="text"
                      value={listNameInput}
                      onChange={(e) => setListNameInput(e.target.value)}
                      placeholder='Ex: "Compras do Mês", "Churrasco"...'
                      className="flex-1 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-brand-green-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={totalItems === 0}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand-green-700 px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-brand-green-800 disabled:opacity-50"
                    >
                      <BookmarkPlus className="h-4 w-4 text-brand-orange-400" />
                      <span>
                        {listSavedFeedback ? "Salva!" : "Salvar Lista"}
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer selectedBranch={selectedBranch} />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-bold text-brand-green-700">
          Carregando opções de checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

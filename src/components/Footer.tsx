"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  Truck,
  ShieldCheck,
  Lock,
  PhoneCall,
  MessageCircle,
  MapPin,
  Mail,
  Leaf,
  CreditCard,
  Snowflake,
  CheckCircle2,
  ExternalLink,
  Instagram,
  Facebook,
  Smartphone,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { StoreBranch } from "@/data/mockData";
import { useStore } from "@/context/StoreContext";
import { formatBRL } from "./ProductCard";

interface FooterProps {
  selectedBranch: StoreBranch;
}

export default function Footer({ selectedBranch }: FooterProps) {
  const { storeSettings } = useStore();

  const activePaymentBadges: string[] = [];
  if (storeSettings.paymentPixEnabled) activePaymentBadges.push("PIX Imediato");
  if (storeSettings.paymentCardOnDeliveryEnabled) {
    activePaymentBadges.push("Cartão na Entrega (Visa/Master/Elo)");
  }
  if (storeSettings.paymentCashEnabled) {
    activePaymentBadges.push("Dinheiro (Troco na Entrega)");
  }
  if (storeSettings.paymentFoodVoucherEnabled) {
    activePaymentBadges.push("Alelo / Pluxee / Ticket / VR");
  }
  if (storeSettings.storeCardEnabled) {
    activePaymentBadges.push("Cartão da Loja SuperVerde");
  }

  const whatsappDirectHref = `https://wa.me/${storeSettings.whatsappOrderNumber.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(
    "Olá! Gostaria de atendimento / fazer um pedido no SuperVerde."
  )}`;

  return (
    <>
      <footer className="mt-12 border-t border-slate-200 bg-slate-900 text-slate-300">
        {/* Top Delivery Notices & Cold Chain Assurance */}
        <div className="border-b border-slate-800 bg-slate-950/60">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-start gap-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green-900/60 text-brand-green-500">
                  <Snowflake className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Aviso de Entrega Refrigerada
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Carnes, laticínios e congelados são transportados em caixas térmicas higienizadas com controle de temperatura até a sua porta.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange-500/20 text-brand-orange-400">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Política de Frete & Substituição
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Pedido mínimo de{" "}
                    <strong className="text-white">
                      {formatBRL(selectedBranch.minOrder)}
                    </strong>{" "}
                    e Frete Grátis acima de{" "}
                    <strong className="text-brand-green-500">
                      {formatBRL(selectedBranch.freeShippingThreshold)}
                    </strong>
                    . Nossos separadores consultam você via WhatsApp caso algum item precise de substituição.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green-900/60 text-brand-green-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Horário de Funcionamento
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    <strong className="text-white">
                      {storeSettings.institutionalHours || selectedBranch.hours}
                    </strong>
                    <br />
                    Pedidos feitos após as 20h são agendados para a primeira janela da manhã seguinte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Institutional Columns */}
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12">
            {/* Brand, Active Store Info & Social Links */}
            <div className="space-y-4 lg:col-span-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green-600 text-white">
                  <Leaf className="h-6 w-6 text-brand-orange-400" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight text-white">
                    Super<span className="text-brand-orange-500">Verde</span>
                  </span>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    E-commerce & Vitrine Digital
                  </p>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-400">
                Qualidade e economia da nossa loja física direto para a mesa da sua família. Produtos frescos selecionados por especialistas em hortifrúti, açougue e padaria.
              </p>

              {/* Editable Social Media Links */}
              <div className="flex flex-wrap items-center gap-2">
                {storeSettings.socialLinks
                  .filter((social) => social.name.trim() && social.url.trim())
                  .map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-brand-green-500/50 hover:bg-slate-800"
                    >
                      {social.name.trim().toLowerCase() === "instagram" ? (
                        <Instagram className="h-4 w-4 text-pink-400" />
                      ) : social.name.trim().toLowerCase() === "facebook" ? (
                        <Facebook className="h-4 w-4 text-blue-400" />
                      ) : (
                        <ExternalLink className="h-4 w-4 text-brand-orange-400" />
                      )}
                      <span>{social.name}</span>
                    </a>
                  ))}
                <a
                  href={whatsappDirectHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-800 bg-emerald-950/60 px-3 py-2 text-xs font-bold text-emerald-400 transition hover:bg-emerald-900/60"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
                <Link
                  href="/bio"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs font-bold text-amber-400 transition hover:border-amber-500/50 hover:bg-slate-800"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Link na Bio</span>
                </Link>
              </div>

              {(storeSettings.playStoreEnabled ||
                storeSettings.appStoreEnabled) && (
                <div className="flex flex-wrap items-center gap-2">
                  {storeSettings.playStoreEnabled &&
                    storeSettings.playStoreUrl && (
                      <a
                        href={storeSettings.playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:border-brand-green-500 hover:bg-slate-800"
                      >
                        <Smartphone className="h-4 w-4 text-brand-green-400" />
                        <span>Google Play Store</span>
                      </a>
                    )}
                  {storeSettings.appStoreEnabled &&
                    storeSettings.appStoreUrl && (
                      <a
                        href={storeSettings.appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:border-brand-green-500 hover:bg-slate-800"
                      >
                        <Smartphone className="h-4 w-4 text-slate-300" />
                        <span>Apple App Store</span>
                      </a>
                    )}
                </div>
              )}

              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-3.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-white">
                  <MapPin className="h-4 w-4 text-brand-orange-400" />
                  <span>{selectedBranch.name}</span>
                </div>
                <p className="text-slate-400">{selectedBranch.address}</p>
                {(selectedBranch.phone || selectedBranch.email) && (
                  <div className="space-y-1 text-slate-400">
                    {selectedBranch.phone && <p>{selectedBranch.phone}</p>}
                    {selectedBranch.email && <p>{selectedBranch.email}</p>}
                  </div>
                )}
                <p className="text-emerald-400 font-medium">
                  ⏱ {selectedBranch.hours}
                </p>
              </div>
            </div>

            {/* Institutional Pages Pre-Ready Links */}
            <div className="space-y-3 lg:col-span-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Institucional & Serviços
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link
                    href="/institucional?secao=quem-somos"
                    className="hover:text-brand-orange-400 transition flex items-center gap-1.5"
                  >
                    <span>Quem Somos</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/institucional?secao=lojas"
                    className="hover:text-brand-orange-400 transition flex items-center gap-1.5"
                  >
                    <MapPin className="h-3.5 w-3.5 text-brand-orange-400" />
                    <span>Nossas Lojas e Filiais (Mapa / Waze)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clube-descontos"
                    className="hover:text-brand-orange-400 transition flex items-center gap-1.5 font-semibold text-emerald-300"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-brand-orange-400" />
                    <span>Clube SuperVerde de Descontos</span>
                  </Link>
                </li>
                {storeSettings.storeCardEnabled && (
                  <li>
                    <Link
                      href="/cartao-loja"
                      className="hover:text-brand-orange-400 transition flex items-center gap-1.5 font-semibold text-amber-300"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-brand-orange-400" />
                      <span>Solicitar Cartão da Loja</span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="/trabalhe-conosco"
                    className="hover:text-brand-orange-400 transition flex items-center gap-1.5"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-brand-green-400" />
                    <span>Trabalhe Conosco (Envie seu CV)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/institucional?secao=privacidade"
                    className="hover:text-brand-orange-400 transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                    <span>Política de Privacidade (LGPD)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/conta"
                    className="hover:text-brand-orange-400 transition"
                  >
                    Minha Conta / Histórico de Pedidos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Support & External Sales Channels */}
            <div className="space-y-3 lg:col-span-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Atendimento & Canais
              </h4>
              <div className="space-y-2.5 text-xs">
                <a
                  href={whatsappDirectHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 rounded-xl border border-emerald-700/60 bg-emerald-950/50 p-2.5 text-emerald-300 transition hover:bg-emerald-900/60"
                >
                  <MessageCircle className="h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <span className="block font-bold text-white">
                      Compre pelo WhatsApp
                    </span>
                    <span className="text-[11px]">
                      {storeSettings.whatsappDisplayPhone}
                    </span>
                  </div>
                </a>

                {storeSettings.ifoodEnabled && (
                  <a
                    href={storeSettings.ifoodStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-2 rounded-xl border border-red-800/70 bg-red-950/50 p-2.5 text-red-200 transition hover:bg-red-900/60"
                  >
                    <div>
                      <span className="block font-black text-white">
                        Peça pelo iFood
                      </span>
                      <span className="text-[10px]">Loja Oficial SuperVerde</span>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-red-400" />
                  </a>
                )}

                <a
                  href={`tel:${storeSettings.sacPhone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/40 p-2.5 text-slate-300 transition hover:border-slate-700"
                >
                  <PhoneCall className="h-4 w-4 shrink-0 text-brand-orange-400" />
                  <div>
                    <span className="block font-bold text-white">
                      SAC: {storeSettings.sacPhone}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Atendimento ao Cliente
                    </span>
                  </div>
                </a>

                <div className="flex items-center gap-2 text-slate-400 pt-1">
                  <Mail className="h-4 w-4 shrink-0 text-brand-orange-400" />
                  <span className="truncate">{storeSettings.supportEmail}</span>
                </div>
              </div>
            </div>

            {/* Security Seals & Payment Methods */}
            <div className="space-y-4 lg:col-span-3">
              <div>
                <h4 className="mb-2.5 text-xs font-extrabold uppercase tracking-wider text-white">
                  Selos de Segurança & App
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                    <Lock className="h-5 w-5 shrink-0 text-brand-green-500" />
                    <div>
                      <span className="block text-[11px] font-bold text-white">
                        Ambiente Seguro
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        SSL 256-Bits & LGPD
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-brand-orange-400" />
                    <div>
                      <span className="block text-[11px] font-bold text-white">
                        Compra Garantida
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        Qualidade Auditada
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-white">
                  Formas de Pagamento Habilitadas
                </h4>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                  {activePaymentBadges.map((method) => (
                    <span
                      key={method}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-800/80 px-2.5 py-1 text-slate-200"
                    >
                      <CreditCard className="h-3 w-3 text-brand-orange-400" />
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal Notice */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
            <p>
              © {new Date().getFullYear()} SuperVerde Comércio Varejista de Alimentos Ltda. CNPJ {storeSettings.companyCnpj}. Todos os direitos reservados.
            </p>
            <p className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-brand-green-500" />
              <span>
                A venda de bebidas alcoólicas é proibida para menores de 18 anos.
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Contact Button (Controlado pelo Painel do Gestor) */}
      {storeSettings.whatsappFloatingEnabled && (
        <a
          href={whatsappDirectHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar com atendente pelo WhatsApp"
          className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-brand-green-600 p-3.5 text-white shadow-2xl ring-4 ring-brand-green-500/30 transition-all hover:scale-105 hover:bg-brand-green-700 sm:px-5 sm:py-3.5"
        >
          <MessageCircle className="h-6 w-6 fill-white text-brand-green-600" />
          <div className="hidden text-left sm:block">
            <span className="block text-[10px] font-semibold uppercase leading-none text-emerald-100">
              Dúvidas ou Televendas?
            </span>
            <span className="flex items-center gap-1 text-xs font-extrabold leading-tight">
              Peça no WhatsApp <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        </a>
      )}
    </>
  );
}

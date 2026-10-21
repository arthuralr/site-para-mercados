"use client";

import React from "react";
import Link from "next/link";
import {
  Leaf,
  Flame,
  Newspaper,
  MessageCircle,
  Sparkles,
  CreditCard,
  Briefcase,
  MapPin,
  ExternalLink,
  Instagram,
  Facebook,
  ShoppingBag,
  Smartphone,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { BioLinkItem } from "@/data/cmsData";

export default function InstagramBioPage() {
  const { bioLinks, storeSettings, selectedBranch } = useStore();

  const activeBioLinks = bioLinks.filter((b) => b.isActive);

  const renderIcon = (type: BioLinkItem["iconType"]) => {
    switch (type) {
      case "flash":
        return <Flame className="h-5 w-5 text-brand-orange-500" />;
      case "tabloid":
        return <Newspaper className="h-5 w-5 text-brand-orange-500" />;
      case "whatsapp":
        return <MessageCircle className="h-5 w-5 text-emerald-500" />;
      case "club":
        return <Sparkles className="h-5 w-5 text-brand-green-600" />;
      case "card":
        return <CreditCard className="h-5 w-5 text-amber-500" />;
      case "jobs":
        return <Briefcase className="h-5 w-5 text-sky-600" />;
      case "ifood":
        return <ShoppingBag className="h-5 w-5 text-[#EA1D2C]" />;
      case "stores":
        return <MapPin className="h-5 w-5 text-brand-green-700" />;
      default:
        return <Sparkles className="h-5 w-5 text-brand-green-700" />;
    }
  };

  const whatsappDirectUrl = `https://wa.me/${storeSettings.whatsappOrderNumber.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(
    "Olá! Vim pelo Link da Bio do Instagram e gostaria de atendimento."
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-green-950 via-brand-green-900 to-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-md space-y-6">
        {/* Top Bar: Back to Store + Admin Edit Shortcut */}
        <div className="flex items-center justify-between text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-bold text-emerald-100 backdrop-blur-xs transition hover:bg-white/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Ir para a Loja Completa</span>
          </Link>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-400/15 px-3 py-1.5 font-bold text-amber-300 hover:bg-amber-400/25"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Editar Bio no Painel</span>
          </Link>
        </div>

        {/* Profile Avatar & Bio Header */}
        <div className="rounded-3xl border border-emerald-700/50 bg-white/10 p-6 text-center backdrop-blur-md shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-green-500 to-brand-green-800 shadow-lg ring-4 ring-brand-orange-500">
            <Leaf className="h-10 w-10 text-brand-orange-400" />
          </div>

          <h1 className="mt-3 text-2xl font-black tracking-tight">
            Super<span className="text-brand-orange-400">Verde</span> Oficial
          </h1>
          <p className="mt-1 text-xs font-medium text-emerald-200">
            🍎 Hortifrúti Fresco • 🥩 Açougue Angus • 🥖 Padaria Artesanal
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 px-3 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              Loja Aberta • {selectedBranch.hours}
            </span>
          </div>

          {/* Social Icons Row */}
          <div className="mt-4 flex items-center justify-center gap-2.5">
            {storeSettings.socialLinks
              .filter((social) => social.name.trim() && social.url.trim())
              .map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 items-center justify-center rounded-2xl bg-white/15 px-3 text-xs font-bold text-white transition hover:scale-105 hover:bg-white/25"
                  aria-label={social.name}
                >
                  {social.name.trim().toLowerCase() === "instagram" ? (
                    <Instagram className="h-5 w-5" />
                  ) : social.name.trim().toLowerCase() === "facebook" ? (
                    <Facebook className="h-5 w-5" />
                  ) : (
                    <span>{social.name}</span>
                  )}
                </a>
              ))}
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white transition hover:scale-105 hover:bg-emerald-500"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Highlight Banner: Grupo VIP de Ofertas no WhatsApp */}
        <a
          href={storeSettings.whatsappOffersGroupUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-3 rounded-2xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-600 to-brand-green-700 p-4 text-white shadow-xl transition hover:scale-[1.01]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700">
              <MessageCircle className="h-6 w-6 fill-emerald-600 text-emerald-600" />
            </div>
            <div>
              <span className="inline-block rounded bg-emerald-950/60 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-200">
                Grupo Oficial VIP
              </span>
              <h2 className="text-sm font-black">
                Receba nossas Ofertas no WhatsApp
              </h2>
              <p className="text-[11px] text-emerald-100">
                Toque para entrar no grupo silencioso da semana
              </p>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-emerald-200" />
        </a>

        {/* Dynamic Bio Links Managed by Admin */}
        <div className="space-y-3">
          {activeBioLinks.map((item) => {
            const isExternal = item.url.startsWith("http");
            const resolvedUrl =
              item.iconType === "whatsapp"
                ? whatsappDirectUrl
                : item.iconType === "ifood"
                ? storeSettings.ifoodStoreUrl
                : item.url;

            const cardContent = (
              <div
                className={`group flex items-center justify-between gap-3 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 ${
                  item.highlight
                    ? "border-2 border-brand-orange-400 bg-white text-slate-900 shadow-xl"
                    : "border border-white/15 bg-white/95 text-slate-900 shadow-md hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      item.highlight
                        ? "bg-brand-orange-50 ring-2 ring-brand-orange-200"
                        : "bg-slate-100"
                    }`}
                  >
                    {renderIcon(item.iconType)}
                  </div>
                  <div className="min-w-0">
                    {item.badge && (
                      <span className="inline-block rounded-md bg-brand-orange-500 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                        {item.badge}
                      </span>
                    )}
                    <h3 className="mt-0.5 text-sm font-black leading-snug text-slate-900 group-hover:text-brand-green-700">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-brand-green-700" />
              </div>
            );

            return isExternal ||
              item.iconType === "whatsapp" ||
              item.iconType === "ifood" ? (
              <a
                key={item.id}
                href={resolvedUrl}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                {cardContent}
              </a>
            ) : (
              <Link key={item.id} href={resolvedUrl} className="block">
                {cardContent}
              </Link>
            );
          })}
        </div>

        {/* App Download Section (Google Play / App Store / PWA) */}
        {(storeSettings.playStoreEnabled ||
          storeSettings.appStoreEnabled ||
          storeSettings.pwaBannerEnabled) && (
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur-xs">
            <p className="flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-200">
              <Smartphone className="h-4 w-4 text-brand-orange-400" />
              <span>Baixe o Aplicativo SuperVerde</span>
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {storeSettings.playStoreEnabled && (
                <a
                  href={storeSettings.playStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-extrabold text-white border border-slate-700 hover:bg-slate-800"
                >
                  <span>▶ Google Play Store</span>
                </a>
              )}
              {storeSettings.appStoreEnabled && (
                <a
                  href={storeSettings.appStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-extrabold text-white border border-slate-700 hover:bg-slate-800"
                >
                  <span> Apple App Store</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Footer Credit */}
        <p className="text-center text-[11px] text-emerald-300/70">
          © {new Date().getFullYear()} SuperVerde Supermercados • CNPJ{" "}
          {storeSettings.companyCnpj}
        </p>
      </div>
    </div>
  );
}

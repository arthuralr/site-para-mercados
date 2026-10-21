"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  BellRing,
  X,
  CheckCircle2,
  Zap,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function PushPermissionBanner() {
  const {
    storeSettings,
    isCurrentBrowserSubscribed,
    subscribeBrowserToPush,
    activeRealtimePushAlert,
    dismissRealtimePushAlert,
  } = useStore();

  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [justSubscribed, setJustSubscribed] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleEnablePush = async () => {
    setIsSubscribing(true);
    setStatusMessage(null);
    try {
      const res = await subscribeBrowserToPush([
        "ofertas_relampago",
        "encarte_semanal",
        "alertas_gerais",
      ]);
      if (res.ok) {
        setJustSubscribed(true);
        setTimeout(() => {
          setDismissedBanner(true);
        }, 2800);
      } else {
        setStatusMessage(res.message);
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <>
      {/* 1. Banner de Permissão de Notificações Web Push (Exibido para clientes ainda não inscritos) */}
      {storeSettings.pushNotificationsBannerEnabled &&
        !isCurrentBrowserSubscribed &&
        !dismissedBanner && (
          <div className="border-b border-amber-200/80 bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 text-slate-800">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-brand-orange-500 text-white shadow-sm">
                  <BellRing className="h-4 w-4 animate-bounce" />
                </span>
                <div>
                  <p className="text-xs font-extrabold text-slate-900 sm:text-sm">
                    Receba alertas de{" "}
                    <span className="text-brand-orange-600">
                      Ofertas Relâmpago
                    </span>{" "}
                    e do{" "}
                    <span className="text-brand-green-700">
                      Panfleto de Ofertas
                    </span>{" "}
                    direto no navegador!
                  </p>
                  {statusMessage && (
                    <p className="mt-0.5 text-[11px] font-bold text-red-600">
                      {statusMessage}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {justSubscribed ? (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-brand-green-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Notificações Ativadas!
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleEnablePush}
                      disabled={isSubscribing}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-green-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-brand-green-700 disabled:opacity-60"
                    >
                      <Bell className="h-3.5 w-3.5 text-amber-300" />
                      {isSubscribing
                        ? "Ativando..."
                        : "Permitir Notificações de Ofertas"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDismissedBanner(true)}
                      className="rounded-lg px-2 py-1 text-[11px] font-bold text-slate-500 transition hover:bg-slate-200/60 hover:text-slate-700"
                    >
                      Agora não
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      {/* 2. Alerta de Web Push Recebido em Tempo Real (Disparado pelo Painel do Gestor) */}
      {activeRealtimePushAlert && (
        <div className="fixed right-4 top-24 z-[70] w-[calc(100vw-2rem)] max-w-sm animate-bounce-once">
          <div className="overflow-hidden rounded-3xl border-2 border-brand-green-500 bg-white shadow-2xl ring-4 ring-brand-green-500/20">
            <div className="flex items-center justify-between bg-gradient-to-r from-brand-green-800 to-brand-green-600 px-4 py-2.5 text-white">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-orange-500 text-white">
                  <Zap className="h-3.5 w-3.5 fill-white" />
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider">
                  Notificação Push • Agora Mesmo
                </span>
              </div>
              <button
                type="button"
                onClick={dismissRealtimePushAlert}
                className="rounded-lg p-1 text-emerald-100 transition hover:bg-white/15 hover:text-white"
                aria-label="Fechar notificação"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-green-50 text-brand-green-700 ring-1 ring-brand-green-200">
                  <Sparkles className="h-5 w-5 text-brand-orange-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black leading-snug text-slate-900">
                    {activeRealtimePushAlert.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {activeRealtimePushAlert.message}
                  </p>
                </div>
              </div>

              <div className="mt-3.5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={dismissRealtimePushAlert}
                  className="rounded-xl px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100"
                >
                  Dispensar
                </button>
                <Link
                  href={activeRealtimePushAlert.targetUrl || "/"}
                  onClick={dismissRealtimePushAlert}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-orange-500 px-4 py-1.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-brand-orange-600"
                >
                  Conferir Oferta
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const CACHE_NAME = "superverde-pwa-v1";
const OFFLINE_URLS = ["/", "/catalogo", "/panfleto-de-ofertas", "/bio"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// ============================================================================
// WEB PUSH NOTIFICATIONS - SERVICE WORKER LISTENERS
// ============================================================================

self.addEventListener("push", (event) => {
  let payload = {
    title: "SuperVerde Ofertas Relâmpago",
    body: "Novas ofertas disponíveis no supermercado! Clique para conferir.",
    url: "/panfleto-de-ofertas",
    icon: "/icon-superverde.svg",
    badge: "/icon-superverde.svg",
    tag: "superverde-push",
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    } catch {
      payload.body = event.data.text() || payload.body;
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon || "/icon-superverde.svg",
    badge: payload.badge || "/icon-superverde.svg",
    tag: payload.tag || `superverde-${Date.now()}`,
    renotify: true,
    vibrate: [200, 100, 200],
    data: {
      url: payload.url || "/",
      sentAt: new Date().toISOString(),
    },
    actions: [
      { action: "open", title: "Ver Oferta Agora" },
      { action: "close", title: "Fechar" },
    ],
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Permite disparo em tempo real via postMessage (Broadcast do Painel do Gestor)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_PUSH_NOTIFICATION") {
    const { title, body, url, tag } = event.data.payload || {};
    const options = {
      body: body || "Confira as ofertas especiais de hoje no SuperVerde!",
      icon: "/icon-superverde.svg",
      badge: "/icon-superverde.svg",
      tag: tag || `superverde-push-${Date.now()}`,
      renotify: true,
      vibrate: [200, 100, 200],
      data: {
        url: url || "/",
      },
      actions: [
        { action: "open", title: "Abrir Oferta" },
        { action: "close", title: "Dispensar" },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(
        title || "SuperVerde Supermercados",
        options
      )
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  const targetUrl =
    (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.focus();
            if ("navigate" in client) {
              return client.navigate(targetUrl);
            }
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

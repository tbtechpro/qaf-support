// QAF service worker: Web Push display + offline-first shell (free, no vendor).
const CACHE = "qaf-v1";
const SHELL = ["/", "/ask", "/plan", "/reminders", "/manifest.webmanifest"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()).catch(() => {}));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || !u.pathname.startsWith("/") || u.pathname.startsWith("/api/")) return;
  e.respondWith(
    fetch(e.request).then((r) => {
      const copy = r.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request).then((m) => m || caches.match("/")))
  );
});
self.addEventListener("push", (e) => {
  const d = (() => { try { return e.data.json(); } catch { return { title: "QAF reminder", body: "Check QAF Support inbox." }; } })();
  e.waitUntil(self.registration.showNotification(d.title || "QAF reminder", { body: d.body || "", icon: "/icon-192.png", data: d }));
});
self.addEventListener("notificationclick", (e) => { e.notification.close(); e.waitUntil(clients.openWindow("/reminders")); });

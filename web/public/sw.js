// Minimal SW: cache shell, push shows in-app reminder (free Web Push, no vendor).
self.addEventListener("push", (e) => {
  const d = (() => { try { return e.data.json(); } catch { return { title: "QAF reminder", body: "Check QAF Support inbox." }; } })();
  e.waitUntil(self.registration.showNotification(d.title || "QAF reminder", { body: d.body || "", data: d }));
});
self.addEventListener("notificationclick", (e) => { e.notification.close(); e.waitUntil(clients.openWindow("/reminders")); });

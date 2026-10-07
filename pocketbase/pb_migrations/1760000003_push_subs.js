/// <reference path="../pb_data/types.d.ts" />
// Web Push subscriptions. Public create/list/view so the server worker (no login)
// can read them; sending still requires the VAPID private key, which never leaves
// the server (.vapid.json, gitignored). Deletes stay organizer-only; stale
// endpoints are logged by the worker and pruned by re-subscribe.
migrate((app) => {
  let c = null;
  try { c = app.findCollectionByNameOrId("push_subscriptions"); } catch (e) { c = null; }
  if (!c) {
    c = new Collection({ name: "push_subscriptions", type: "base", listRule: "", viewRule: "", createRule: "", updateRule: "", deleteRule: "@request.auth.id != ''" });
    app.save(c);
    c = app.findCollectionByNameOrId("push_subscriptions");
  }
  const add = (f) => {
    let ok = false;
    try { ok = !!c.fields.getByName(f.name); } catch (e) { ok = false; }
    if (!ok) { c.fields.add(f); app.save(c); }
  };
  add(new TextField({ name: "endpoint", required: true }));
  add(new TextField({ name: "p256dh", required: true }));
  add(new TextField({ name: "auth", required: true }));
  add(new TextField({ name: "learner", required: false }));
}, (app) => {});

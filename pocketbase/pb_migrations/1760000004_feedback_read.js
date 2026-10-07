/// <reference path="../pb_data/types.d.ts" />
// Pilot: feedback readable publicly so the organizer workspace (no learner login)
// can review helpfulness, stars and reported issues. Records carry no PII
// (random session id, optional free-text note). Writes stay public-create only.
migrate((app) => {
  const c = app.findCollectionByNameOrId("feedback");
  c.listRule = "";
  c.viewRule = "";
  app.save(c);
}, (app) => {});

/// <reference path="../pb_data/types.d.ts" />
// Pilot: schedules, cohorts and approved docs are cohort-shared info — public read.
// Writes stay organizer-only (create/update require auth; delete denied).
migrate((app) => {
  for (const n of ["schedules", "cohorts", "content_docs"]) {
    const c = app.findCollectionByNameOrId(n);
    c.listRule = "";
    c.viewRule = "";
    app.save(c);
  }
}, (app) => {});

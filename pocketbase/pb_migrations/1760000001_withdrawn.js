/// <reference path="../pb_data/types.d.ts" />
// Worker filters schedules by `withdrawn != true`; the field was missing (-> 400).
migrate((app) => {
  const c = app.findCollectionByNameOrId("schedules");
  let exists = false;
  try { exists = !!c.fields.getByName("withdrawn"); } catch (e) { exists = false; }
  if (!exists) {
    c.fields.add(new BoolField({ name: "withdrawn", required: false }));
    app.save(c);
  }
}, (app) => {});

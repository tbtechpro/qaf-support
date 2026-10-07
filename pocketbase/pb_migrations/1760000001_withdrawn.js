/// <reference path="../pb_data/types.d.ts" />
// Worker filters schedules by `withdrawn != true`; the field was missing (-> 400).
migrate((app) => {
  const c = app.findCollectionByNameOrId("schedules");
  const has = c.schema.fields.some((f) => f.name === "withdrawn");
  if (!has) {
    c.schema.addField(new BoolField({ name: "withdrawn", required: false }));
    app.save(c);
  }
}, (app) => {});

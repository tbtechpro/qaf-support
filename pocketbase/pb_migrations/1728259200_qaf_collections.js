/// <reference path="../pb_data/types.d.ts" />
// QAF collections for PocketBase v0.40 JSVM: create bare, then add Field instances.
// Reads: schedules/cohorts/content_docs public (cohort-shared info), rest auth-only.
// Writes: auth-only everywhere except feedback creation (anonymous learners).
// Deletes: denied (withdraw instead).
migrate((app) => {
  const AUTH = "@request.auth.id != ''";
  const mkBase = (name, listRule, viewRule, createRule, updateRule) => {
    let c = null;
    try { c = app.findCollectionByNameOrId(name); } catch (e) { c = null; }
    if (!c) {
      c = new Collection({ name, type: "base", listRule, viewRule, createRule, updateRule, deleteRule: null });
      app.save(c);
      c = app.findCollectionByNameOrId(name);
    } else {
      c.listRule = listRule; c.viewRule = viewRule; c.createRule = createRule; c.updateRule = updateRule; c.deleteRule = null;
      app.save(c);
    }
    return c;
  };
  const addFields = (c, fields) => {
    let changed = false;
    for (const f of fields) {
      let ok = false;
      try { ok = !!c.fields.getByName(f.name); } catch (e) { ok = false; }
      if (!ok) { c.fields.add(f); changed = true; }
    }
    if (changed) app.save(c);
  };
  const T = (name, required) => new TextField({ name, required: !!required });
  const B = (name) => new BoolField({ name, required: false });
  const D = (name, required) => new DateField({ name, required: !!required });
  const S = (name, values, required) => new SelectField({ name, values, maxSelect: 1, required: !!required });
  const R = (name, collectionId) => new RelationField({ name, collectionId, maxSelect: 1 });

  const cohorts = mkBase("cohorts", "", "", AUTH, AUTH);
  addFields(cohorts, [T("code", true), T("name", true), T("timezone", false)]);

  const learners = mkBase("learners", AUTH, AUTH, AUTH, AUTH);
  addFields(learners, [
    T("display_name", false), R("cohort", cohorts.id), T("project_stage", false),
    T("device", false), T("contact_channel", false), T("contact_value", false), B("opt_in_reminders"),
  ]);

  const schedules = mkBase("schedules", "", "", AUTH, AUTH);
  addFields(schedules, [
    R("cohort", cohorts.id), S("kind", ["live_session", "deadline"], true), T("title", true),
    D("starts_at", true), T("timezone", true), T("join_link", false), T("source", true),
    T("action", false), B("withdrawn"),
  ]);

  const prefs = mkBase("reminder_prefs", AUTH, AUTH, AUTH, AUTH);
  addFields(prefs, [
    R("learner", learners.id), S("category", ["deadline", "live_session", "checkin"], true),
    B("enabled_24h"), B("enabled_3h"), B("enabled_1h"), T("channel", false),
  ]);

  const queue = mkBase("reminders_queue", AUTH, AUTH, AUTH, AUTH);
  addFields(queue, [
    R("schedule", schedules.id), R("learner", learners.id), S("offset", ["24h", "3h", "1h"], true),
    D("due_at", true), S("status", ["queued", "sent", "withdrawn"], true), T("channel", false),
  ]);

  const feedback = mkBase("feedback", AUTH, AUTH, "", AUTH);
  addFields(feedback, [
    T("session_id", false), S("vote", ["helped", "not_quite"], true),
    T("stars", false), T("note", false), B("resolved"),
  ]);

  const docs = mkBase("content_docs", "", "", AUTH, AUTH);
  addFields(docs, [
    T("title", true), T("body", true), T("source", true), T("owner", true),
    D("review_date", false), B("withdrawn"), T("cohort", false),
  ]);
}, (app) => {});

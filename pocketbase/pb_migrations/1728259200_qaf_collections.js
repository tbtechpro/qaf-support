/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const mk = (name, schema, rule = "@request.auth.id != ''") => {
    let c;
    try { c = app.findCollectionByNameOrId(name); }
    catch (e) {
      c = new Collection({ name, type: "base", listRule: rule, viewRule: rule, createRule: rule, updateRule: rule, deleteRule: null, schema });
      app.save(c);
    }
    return c;
  };
  const text = (n, req = true) => ({ name: n, type: "text", required: req });
  const bool = (n) => ({ name: n, type: "bool", required: false });
  const date = (n, req = true) => ({ name: n, type: "date", required: req });
  const rel = (n, col, req = false) => ({ name: n, type: "relation", required: req, collectionId: col, cascadeDelete: false, maxSelect: 1 });
  const sel = (n, vals) => ({ name: n, type: "select", required: true, values: vals, maxSelect: 1 });

  // cohorts: one pilot cohort for V1
  mk("cohorts", [text("code"), text("name"), text("timezone")]);
  // learners: optional context, opt-in contacts only
  mk("learners", [text("display_name", false), rel("cohort", "cohorts"), text("project_stage", false), text("device", false), text("contact_channel", false), text("contact_value", false), bool("opt_in_reminders")]);
  // schedules: confirmed sessions + deadlines, same-for-cohort verified join link
  mk("schedules", [rel("cohort", "cohorts"), sel("kind", ["live_session", "deadline"]), text("title"), date("starts_at"), text("timezone"), text("join_link", false), text("source"), text("action")]);
  // reminder prefs per learner per category
  mk("reminder_prefs", [rel("learner", "learners"), sel("category", ["deadline", "live_session", "checkin"]), bool("enabled_24h"), bool("enabled_3h"), bool("enabled_1h"), text("channel", false)]);
  // reminders queue: computed 24h/3h/1h, withdrawn on change
  mk("reminders_queue", [rel("schedule", "schedules"), rel("learner", "learners"), sel("offset", ["24h", "3h", "1h"]), date("due_at"), sel("status", ["queued", "sent", "withdrawn"]), text("channel", false)]);
  // feedback: helpfulness vs resolution separate, stars optional
  mk("feedback", [text("session_id", false), sel("vote", ["helped", "not_quite"]), text("stars", false), text("note", false), bool("resolved")]);
  // content docs: approved only, owner/cohort/review date, withdrawn stops
  mk("content_docs", [text("title"), text("body"), text("source"), text("owner"), date("review_date"), bool("withdrawn"), text("cohort", false)]);
}, (app) => {});

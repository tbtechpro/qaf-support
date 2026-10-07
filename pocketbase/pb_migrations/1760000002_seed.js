/// <reference path="../pb_data/types.d.ts" />
// Pilot seed rows. Runs once per database. Each insert is isolated: a bad row
// logs and continues, so boot can never fail because of seed data.
migrate((app) => {
  const put = (col, data, label) => {
    try {
      app.save(new Record(app.findCollectionByNameOrId(col), data));
    } catch (e) {
      console.log("[seed] skip", col, label, String(e).slice(0, 160));
    }
  };
  put("cohorts", { code: "pilot-2026-01", name: "Pilot Cohort", timezone: "Africa/Lagos" }, "cohort");
  put("schedules", {
    kind: "live_session", title: "Orientation Live", starts_at: "2026-10-13 17:00:00.000Z",
    timezone: "Africa/Lagos", join_link: "https://meet.example.org/qaf-orientation",
    source: "Schedule v1 6-Oct-2026", action: "Join via same cohort link",
  }, "orientation");
  put("schedules", {
    kind: "deadline", title: "Assessment 1 due", starts_at: "2026-10-18 22:59:00.000Z",
    timezone: "Africa/Lagos", join_link: "", source: "Schedule v1 6-Oct-2026", action: "Submit on learn.qubators.org",
  }, "assessment");
  put("content_docs", {
    title: "How do I submit Assessment 1?",
    body: "Open learn.qubators.org, Assessments, Assessment 1, Upload, Confirm.",
    source: "Learner Guide v1", owner: "content-owner",
    review_date: "2026-10-01 00:00:00.000Z", cohort: "pilot-2026-01",
  }, "faq1");
  put("content_docs", {
    title: "Where is the live session link?",
    body: "Same verified cohort link for all learners, shown personally in reminders. If missing: Awaiting organizer confirmation.",
    source: "Schedule v1 6-Oct-2026", owner: "content-owner",
    review_date: "2026-10-01 00:00:00.000Z", cohort: "pilot-2026-01",
  }, "faq2");
}, (app) => {});

"use client";
import { useEffect, useState } from "react";
import { allSchedules, fetchLive, mergeByTitle } from "../../lib/schedules";
import type { Schedule } from "../../lib/seed";
export default function Reminders() {
  const [prefs, setPrefs] = useState({ deadline: true, live: true, checkin: true, wa: false });
  const [sched, setSched] = useState<(Schedule & { id?: string })[]>([]);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const refresh = () => {
      fetchLive().then(({ live: ok, items }) => {
        setLive(ok);
        setSched(mergeByTitle(items, allSchedules()));
      }).catch(() => setSched(allSchedules()));
    };
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, []);
  const t = (k: keyof typeof prefs) => setPrefs({ ...prefs, [k]: !prefs[k] });
  const [push, setPush] = useState("off");
  const enablePush = async () => {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) { setPush("unsupported"); return; }
      setPush("working");
      const reg = await navigator.serviceWorker.register("/sw.js");
      const { key } = await (await fetch("/api/push/public-key")).json();
      if (!key) throw new Error("no key");
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
      const j = sub.toJSON();
      const r = await fetch("/api/push/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint, p256dh: j.keys?.p256dh, auth: j.keys?.auth }) });
      setPush(r.ok ? "on" : "failed");
    } catch { setPush("failed"); }
  };
  return (
    <main>
      <div className="pills"><span className="pill hot">● 24H / 3H / 1H</span><span className="pill">Africa/Lagos (WAT)</span><span className="pill">{live ? "● LIVE from organizers" : "○ Offline seed"}</span><span className="pill">Pause anytime</span></div>
      <h2 style={{ fontSize: 30, margin: "10px 0" }}>Never miss <span className="grad">live or due</span></h2>
      <div className="timeline"><span className="t">T-24h confirm</span><div className="tline" /><span className="t">T-3h nudge</span><div className="tline" /><span className="t done">T-1h join</span></div>
      <div className="card">
        <label className="switch">Assessment deadlines — exact time, action, source<input type="checkbox" checked={prefs.deadline} onChange={() => t("deadline")} /></label>
        <label className="switch">Live sessions — same verified cohort link, shown personally<input type="checkbox" checked={prefs.live} onChange={() => t("live")} /></label>
        <label className="switch">Weekly check-in prompt<input type="checkbox" checked={prefs.checkin} onChange={() => t("checkin")} /></label>
        <label className="switch">In-app cards (always)<input type="checkbox" checked disabled /></label>
        <label className="switch">
          <span>Push alerts 24h / 3h / 1h {push === "on" ? "· ON ✓" : push === "working" ? "· working…" : push === "failed" ? "· failed, retry" : push === "unsupported" ? "· not supported here" : ""}</span>
          <button className="btn btn-g" style={{ padding: "8px 14px", fontSize: 13 }} onClick={enablePush} disabled={push === "on" || push === "working"}>{push === "on" ? "Enabled ✓" : "Enable push"}</button>
        </label>
        <label className="switch">WhatsApp / email (opt-in + verified only)<input type="checkbox" checked={prefs.wa} onChange={() => t("wa")} /></label>
      </div>
      {sched.filter((s) => (s.kind === "deadline" ? prefs.deadline : prefs.live)).map((s, i) => (
        <div key={i} className={`ev ${s.kind === "live_session" ? "live" : ""}`}>
          <b>{s.kind === "live_session" ? "🎥" : "📝"} {s.title}</b> — {s.datetime_iso} ({s.timezone})<br />
          {s.kind === "live_session" ? <>Join (same for cohort): <u>{s.join_link || "Awaiting organizer confirmation"}</u></> : <>Action: {s.action}</>}<br />
          <small>⏰ 24h · 3h · 1h · Source: {s.source} · in-app always{prefs.wa ? " + WhatsApp/email" : ""}</small>
        </div>
      ))}
      <p className="meta">Missing schedule/link → “Awaiting organizer confirmation”, never invented. Changed date/link → old withdrawn, revised flagged. In-app gives no alert while closed.</p>
    </main>
  );
}

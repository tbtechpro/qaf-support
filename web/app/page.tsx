export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1>QAF Support</h1>
      <p>Welcome to QAF Support. What would you like help with today?</p>
      <ul>
        <li><a href="/ask">Ask a question</a></li>
        <li><a href="/plan">Weekly plan</a></li>
        <li><a href="/reminders">Reminder prefs (24h / 3h / 1h, WAT)</a></li>
        <li><a href="/organizer">Organizer workspace (restricted)</a></li>
      </ul>
      <p style={{ color: "#555" }}>
        P0 skeleton. Chat, grounding, reminders worker and PocketBase wiring come in P1–P4.
      </p>
    </main>
  );
}

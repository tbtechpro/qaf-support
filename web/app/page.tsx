export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="pills"><span className="pill hot">● PILOT LIVE</span><span className="pill">One programme · one cohort</span><span className="pill">24h / 3h / 1h reminders</span><span className="pill">Same cohort link</span></div>
        <h1>Stuck? Get a <span className="grad">supported answer</span> and a clear next step.</h1>
        <p className="lead">Welcome to QAF Support. Ask privately — answers cite approved docs, sessions carry the verified cohort link, and organizers are one tap away on WhatsApp. Nothing auto-sent, ever.</p>
        <div className="cta-row"><a className="btn btn-p" href="/ask">Ask a question →</a><a className="btn btn-g" href="/reminders">Set 24h / 3h / 1h reminders</a></div>
        <div className="timeline"><span className="t">T-24h confirm</span><div className="tline" /><span className="t">T-3h nudge</span><div className="tline" /><span className="t done">T-1h join → Live</span></div>
      </section>
      <div className="grid">
        <div className="card"><h3>💬 Ask anything</h3><p>Submission steps, session links, platform help, lesson clarity — grounded in approved docs with sources.</p><a className="go" href="/ask">Open chat →</a></div>
        <div className="card"><h3>🗓️ Weekly plan</h3><p>Small editable checklist for your hours. Personal progress ≠ official completion.</p><a className="go" href="/plan">Plan my week →</a></div>
        <div className="card"><h3>⏰ Early reminders</h3><p>Deadlines + live sessions at 24h, 3h, 1h. Same verified cohort link, WAT timezone, pause anytime.</p><a className="go" href="/reminders">Preview reminders →</a></div>
        <div className="card"><h3>🛟 Human handoff</h3><p>Review an editable summary, then open the confirmed organizer WhatsApp inbox yourself.</p><a className="go" href="/ask">Try handoff →</a></div>
      </div>
    </main>
  );
}

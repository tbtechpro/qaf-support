# Acceptance pass — live link, ~5 min (PRD Sec 13)

Link: `https://qaf-pilot-v6vqvq576w76f9vj-3000.app.github.dev` (click Continue once on GitHub's notice).

| # | Area | Do | Expect (release condition) |
|---|---|---|---|
| 1 | Entry | Open link on phone + laptop, no login | Chat + suggested topics + visible organizer route load |
| 2 | Relevant | Ask “How do I submit?” (no assessment named) | Asks WHICH assessment first — no invented steps |
| 3 | Relevant | Ask “How do I submit Assessment 1?” | Approved steps + source (Learner Guide) |
| 4 | Source | Ask session link | Same verified cohort link + date/time/WAT + source; never an invented link |
| 5 | Unavailable | Ask something unanswerable (“Will I get a certificate if I beg?”) | Acknowledges limit, offers organizer handoff — no guessing |
| 6 | Personalization | Set a name, say “I’m behind” | Uses name sparingly, manageable next step, states personal plan ≠ deadline waiver |
| 7 | Feedback | Vote “Not quite” / low stars | Asks what was missing, revises (not repeats); still unhappy → offers human |
| 8 | Reminders | Open Reminders: toggle 24h/3h/1h, timezone WAT visible | Only confirmed events listed; pause/off respected; missing link shows “Awaiting organizer confirmation” |
| 9 | Handoff | Ask → WhatsApp organizer | Editable summary shown first, opens `wa.me/2348078239107` with text pre-filled; NOTHING sent automatically; no passwords asked |
| 10 | Organizer | Sign in with invite code, publish a test session, withdraw it | Appears in Reminders with your email; withdraw removes future reminders |
| 11 | Content update | Change a deadline in organizer feed | Old date gone everywhere, revised flagged |
| 12 | Failure | (Optional) stop web in codespace, reload | Clear failure message + retry/verified support route (no blank crash) |

Record: date, tester, pass/fail per row + notes. All 12 must pass before inviting the cohort.
Automated part already green: `node tests/run.mjs` + `node tests/acceptance.mjs` (25 behavioral checks) + CI build.

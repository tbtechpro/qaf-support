// Feedback records sent to PB. No PII: session is a random client id, notes optional.
export type Vote = "helped" | "not_quite";
export function toFeedbackRecord(vote: Vote, stars: number | null, note: string, sessionId: string) {
  return {
    vote,
    stars: stars === null ? "" : String(Math.min(5, Math.max(1, Math.round(stars)))),
    note: note.slice(0, 500),
    session_id: sessionId.slice(0, 64),
  };
}
export function metrics(items: { vote: string; stars: string }[]) {
  const total = items.length;
  const helped = items.filter((i) => i.vote === "helped").length;
  const notQuite = total - helped;
  const starNums = items.map((i) => parseInt(i.stars || "", 10)).filter((n) => n >= 1 && n <= 5);
  const avg = starNums.length ? starNums.reduce((a, b) => a + b, 0) / starNums.length : null;
  return { total, helped, notQuite, helpfulness: total ? helped / total : null, starsAvg: avg, starsCount: starNums.length };
}

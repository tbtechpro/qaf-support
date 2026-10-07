import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
// GET /api/push/public-key -> VAPID public key (runtime file, no rebuild needed).
// The keypair is created once by scripts/codespace-start.sh into gitignored .vapid.json.
export async function GET() {
  try {
    const raw = readFileSync(join(process.cwd(), "..", ".vapid.json"), "utf8");
    const { public: key } = JSON.parse(raw);
    if (!key) throw new Error("empty");
    return NextResponse.json({ key });
  } catch {
    return NextResponse.json({ error: "push not configured yet — run the starter once" }, { status: 503 });
  }
}

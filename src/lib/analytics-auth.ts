import crypto from "crypto";

// In production a MISSING secret must not fall back to a literal that ships in
// this repo -- the repo is public, so the HMAC would be computable by anyone and
// the token forgeable offline. A random per-process value keeps the process
// starting while making forgery impossible; the cost is that these tokens do not
// survive a restart, which is the correct trade for a gate. Development keeps the
// fixed string so local work needs no env setup. This mirrors the password check
// below, which already returns false in production rather than accepting a
// published default.
const SECRET =
  process.env.ANALYTICS_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  (process.env.NODE_ENV === "production"
    ? crypto.randomBytes(32).toString("hex")
    : "anticipy-analytics-default-secret-not-for-prod");

const TOKEN_PAYLOAD = "anticipy-analytics-v1";

export const ANALYTICS_COOKIE_NAME = "anticipy_analytics_session";

export function getSessionToken(): string {
  return crypto.createHmac("sha256", SECRET).update(TOKEN_PAYLOAD).digest("hex");
}

export function isAnalyticsAuthed(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const expected = getSessionToken();
  try {
    const a = Buffer.from(cookieValue, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function checkAnalyticsPassword(input: unknown): boolean {
  const password = typeof input === "string" ? input : "";
  // B053: fail-secure when ANALYTICS_PASSWORD is unset. Previously we fell
  // back to the literal "Anticipy123", which shipped in prod and was a
  // working default password. In dev we keep the legacy literal so local
  // /analytics testing still works without env setup.
  const envValue = process.env.ANALYTICS_PASSWORD || "";
  let expected = envValue;
  if (!expected) {
    if (process.env.NODE_ENV === "production") {
      return false;
    }
    expected = "Anticipy123";
  }
  if (password.length === 0) return false;
  if (password.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(password, "utf8"),
      Buffer.from(expected, "utf8")
    );
  } catch {
    return false;
  }
}

/**
 * In-memory limiter for one Node process.
 *
 * Vercel runs many instances, and each one has its own map. A burst can be
 * spread across instances, so this does not give a global cap. The durable
 * approach is a shared store such as Vercel KV or Upstash Redis. That is not
 * wired up here: it needs a new account and a secret, which this change does
 * not add.
 *
 * Prefer `x-real-ip` (Vercel sets this to the connecting client). Fall back to
 * the first `x-forwarded-for` hop, then one shared bucket when no proxy header
 * is present.
 */

type LimitResult = { ok: true } | { ok: false; retryAfterSec: number };

const WINDOW_MS = 15 * 60 * 1000;
const hits = new Map<string, number[]>();

export const RATE_LIMITS = {
  checkout: 10,
  login: 8,
  find: 8,
} as const;

export function clientIp(request: Request): string {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) {
    return real.slice(0, 80);
  }
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first.slice(0, 80);
    }
  }
  return "unknown";
}

export function rateLimit(key: string, limit: number, windowMs = WINDOW_MS): LimitResult {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= limit) {
    const oldest = recent[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    hits.set(key, recent);
    return { ok: false, retryAfterSec };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 2000) {
    for (const [bucket, stamps] of hits) {
      if (stamps.every((stamp) => now - stamp >= windowMs)) {
        hits.delete(bucket);
      }
    }
  }
  return { ok: true };
}

export function tooManyRequests(retryAfterSec: number): Response {
  return Response.json(
    { error: "Too many attempts. Please wait and try again." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}

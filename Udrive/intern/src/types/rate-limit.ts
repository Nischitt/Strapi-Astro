// src/types/rate-limit.ts
// Simple in-memory rate limiter — sufficient for a single Render instance.
// Resets on every server restart/redeploy (fresh in-memory map each time),
// and doesn't share state across multiple instances if this ever scales
// horizontally. For this project's size, that's a fine trade-off; a real
// multi-instance production app would use Redis instead.

type TBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, TBucket>();

// Periodically clear old entries so this Map doesn't grow forever between
// restarts on a long-lived server process.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Returns { allowed: true } if the request is within limits, or
 * { allowed: false, retryAfterSeconds } if the caller should be blocked.
 *
 * @param key   Unique identifier for this limit bucket, e.g. `login:1.2.3.4`
 * @param limit Max requests allowed within the window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true };
}

/**
 * Best-effort client IP extraction. Render (and most proxies) set
 * X-Forwarded-For with the real client IP first in a comma-separated list.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}
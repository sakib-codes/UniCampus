import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientRateLimitKey,
  type RateLimitConfig,
} from "@/lib/scalability/rateLimiter";

/**
 * Next.js 16 Request Proxy — Distributed API Rate-Limiting & Surge Protection
 *
 * Applies tiered Token Bucket / Upstash Redis rate limits across all `/api/*` endpoints
 * so traffic spikes (e.g. admission day, tuition deadline, exam results) cannot overwhelm
 * Next.js server workers or Postgres connections.
 */
function resolvePolicy(pathname: string): { scope: string; config: RateLimitConfig } {
  if (pathname.startsWith("/api/auth/otp")) {
    return { scope: "api:otp", config: { capacity: 15, refillPerSecond: 0.25 } };
  }
  if (pathname.startsWith("/api/payments")) {
    return { scope: "api:payments", config: { capacity: 20, refillPerSecond: 0.5 } };
  }
  if (pathname.startsWith("/api/health")) {
    return { scope: "api:health", config: { capacity: 60, refillPerSecond: 2 } };
  }
  return { scope: "api:general", config: { capacity: 40, refillPerSecond: 1 } };
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const { scope, config } = resolvePolicy(pathname);
  const rl = await checkRateLimit(getClientRateLimitKey(req, scope), config);

  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please wait before retrying.",
        retryAfterSeconds: rl.retryAfterSeconds,
      },
      {
        status: 429,
        headers: rl.headers,
      }
    );
  }

  const res = NextResponse.next();
  for (const [k, v] of Object.entries(rl.headers)) {
    res.headers.set(k, v);
  }
  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};

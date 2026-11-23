import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientRateLimitKey,
  type RateLimitConfig,
} from "@/lib/scalability/rateLimiter";

/**
 * Next.js 16 Request Proxy — Distributed API Rate-Limiting & Server-Side Route Protection
 *
 * 1. Applies tiered Token Bucket / Upstash Redis rate limits across all `/api/*` endpoints.
 * 2. When live Supabase is configured, enforces server-side session & role checks on protected
 *    portal routes (`/admin/*`, `/teacher/*`, `/dashboard/*`, etc.) before rendering.
 */

const PROTECTED_PREFIXES = [
  "/admin",
  "/teacher",
  "/dashboard",
  "/profile",
  "/routine",
  "/notices",
  "/messages",
  "/payments",
  "/advising",
  "/assignments",
  "/settings",
  "/materials",
  "/students",
  "/teachers",
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

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

  // 1. API Rate Limiting
  if (pathname.startsWith("/api/")) {
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

  // 2. Server-Side Portal Route Protection (Live Supabase mode only)
  const isLiveSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (isLiveSupabase && isProtectedRoute(pathname)) {
    const hasSession = req.cookies.get("uc_session")?.value === "1";
    const role = req.cookies.get("uc_role")?.value;

    if (!hasSession) {
      const loginUrl = new URL("/login", req.url);
      if (pathname !== "/admin") {
        loginUrl.searchParams.set("next", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    if ((pathname === "/admin" || pathname.startsWith("/admin/")) && role && role !== "admin") {
      const fallback = role === "teacher" ? "/teacher/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(fallback, req.url));
    }

    if ((pathname === "/teacher" || pathname.startsWith("/teacher/")) && role === "student") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/admin",
    "/teacher/:path*",
    "/teacher",
    "/dashboard/:path*",
    "/dashboard",
    "/profile/:path*",
    "/profile",
    "/routine/:path*",
    "/routine",
    "/notices/:path*",
    "/notices",
    "/messages/:path*",
    "/messages",
    "/payments/:path*",
    "/payments",
    "/advising/:path*",
    "/advising",
    "/assignments/:path*",
    "/assignments",
    "/settings/:path*",
    "/settings",
    "/materials/:path*",
    "/materials",
    "/students/:path*",
    "/students",
    "/teachers/:path*",
    "/teachers",
  ],
};

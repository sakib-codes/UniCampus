import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseServerClient } from "@/lib/supabase/client";
import {
  paymentGatewayCircuitBreaker,
  supabaseCircuitBreaker,
} from "@/lib/scalability/resilience";
import { getQueryCacheStats } from "@/lib/scalability/queryCache";
import {
  getRateLimiterBackendStatus,
  pingUpstashRedis,
} from "@/lib/scalability/rateLimiter";

export const dynamic = "force-dynamic";

/**
 * Production Liveness & Readiness Health Endpoint (/api/health)
 * Used by Vercel, Cloudflare, Docker, and Kubernetes HPA auto-scalers to verify
 * instance health, database reachability, Redis rate limiter status, and circuit breakers.
 */
export async function GET() {
  const configured = isSupabaseConfigured();
  let dbReachable: boolean | null = null;
  let dbLatencyMs: number | null = null;

  const [redisHealth] = await Promise.all([
    pingUpstashRedis(),
    (async () => {
      if (!configured) return;
      const client = getSupabaseServerClient();
      if (!client) return;
      const start = Date.now();
      try {
        const { error } = await client
          .from("departments")
          .select("id", { head: true, count: "exact" })
          .limit(1);
        dbReachable = !error;
        dbLatencyMs = Date.now() - start;
      } catch {
        dbReachable = false;
        dbLatencyMs = Date.now() - start;
      }
    })(),
  ]);

  const rateLimiterStatus = getRateLimiterBackendStatus();
  const healthy = !configured || dbReachable !== false;

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      mode: configured ? "supabase-live" : "local-sandbox",
      database: {
        configured,
        reachable: dbReachable,
        latencyMs: dbLatencyMs,
      },
      resilience: {
        circuits: [
          supabaseCircuitBreaker.getStatus(),
          paymentGatewayCircuitBreaker.getStatus(),
        ],
        cache: getQueryCacheStats(),
        rateLimiter: {
          ...rateLimiterStatus,
          redisReachable: redisHealth.reachable,
          redisLatencyMs: redisHealth.latencyMs,
        },
        distributedRateLimit: rateLimiterStatus.configured,
      },
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

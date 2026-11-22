/**
 * Production Token Bucket Rate Limiter with Bounded LRU Memory Guard
 *
 * - Prevents request floods on sensitive routes (/api/payments/*, /register, /advising).
 * - Uses Upstash Redis REST (distributed across serverless/K8s replicas) when configured,
 *   and automatically falls back to a bounded in-memory Token Bucket in dev/single-node.
 */

export interface RateLimitConfig {
  /** Maximum burst tokens available per key */
  capacity: number;
  /** Tokens refilled per second */
  refillPerSecond: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  headers: Record<string, string>;
}

interface BucketState {
  tokens: number;
  lastRefillMs: number;
}

const MAX_IN_MEMORY_BUCKETS = 10_000;
const memoryBuckets = new Map<string, BucketState>();

function pruneMemoryBucketsIfNeeded(): void {
  if (memoryBuckets.size < MAX_IN_MEMORY_BUCKETS) return;
  const oldestKey = memoryBuckets.keys().next().value;
  if (oldestKey) {
    memoryBuckets.delete(oldestKey);
  }
}

function checkInMemoryBucket(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const existing = memoryBuckets.get(key);

  let tokens = config.capacity;
  let lastRefillMs = now;

  if (existing) {
    const elapsedSec = Math.max(0, (now - existing.lastRefillMs) / 1000);
    tokens = Math.min(config.capacity, existing.tokens + elapsedSec * config.refillPerSecond);
    lastRefillMs = now;
    // Refresh insertion order for LRU eviction
    memoryBuckets.delete(key);
  } else {
    pruneMemoryBucketsIfNeeded();
  }

  if (tokens >= 1) {
    const nextTokens = tokens - 1;
    memoryBuckets.set(key, { tokens: nextTokens, lastRefillMs });
    return {
      allowed: true,
      remaining: Math.floor(nextTokens),
      retryAfterSeconds: 0,
      headers: {
        "X-RateLimit-Limit": String(config.capacity),
        "X-RateLimit-Remaining": String(Math.floor(nextTokens)),
      },
    };
  }

  memoryBuckets.set(key, { tokens, lastRefillMs });
  const needed = 1 - tokens;
  const retryAfterSeconds = Math.max(1, Math.ceil(needed / config.refillPerSecond));
  return {
    allowed: false,
    remaining: 0,
    retryAfterSeconds,
    headers: {
      "X-RateLimit-Limit": String(config.capacity),
      "X-RateLimit-Remaining": "0",
      "Retry-After": String(retryAfterSeconds),
    },
  };
}

/**
 * Checks rate limit using Upstash Redis (when UPSTASH_REDIS_REST_URL & TOKEN are set)
 * or falls back gracefully to the bounded in-memory Token Bucket.
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig = { capacity: 30, refillPerSecond: 1 }
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const windowSec = Math.max(1, Math.ceil(config.capacity / config.refillPerSecond));
      const redisKey = `rl:unicampus:${key}`;
      const res = await fetch(`${redisUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", redisKey],
          ["EXPIRE", redisKey, windowSec, "NX"],
        ]),
        cache: "no-store",
      });

      if (res.ok) {
        const data = (await res.json()) as Array<{ result: number }>;
        const count = Number(data?.[0]?.result ?? 1);
        const remaining = Math.max(0, config.capacity - count);
        const allowed = count <= config.capacity;
        return {
          allowed,
          remaining,
          retryAfterSeconds: allowed ? 0 : windowSec,
          headers: {
            "X-RateLimit-Limit": String(config.capacity),
            "X-RateLimit-Remaining": String(remaining),
            ...(allowed ? {} : { "Retry-After": String(windowSec) }),
          },
        };
      }
    } catch {
      // Degrade gracefully to local token bucket if Redis is unreachable
    }
  }

  return checkInMemoryBucket(key, config);
}

/** Extracts a stable client identifier from Next.js Request headers */
export function getClientRateLimitKey(req: Request, scope: string): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  return `${scope}:${ip}`;
}

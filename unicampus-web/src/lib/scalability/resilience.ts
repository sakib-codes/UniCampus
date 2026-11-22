/**
 * Production Resilience Primitives:
 *  1. Exponential Backoff with Full Jitter (prevents thundering-herd retry storms)
 *  2. Circuit Breaker (fail-fast & automatic recovery when upstream DB/gateway degrades)
 *  3. Idempotency Helper (prevents duplicate charges or double submissions)
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (err: unknown) => boolean;
}

export async function withExponentialBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 150;
  const maxDelayMs = options.maxDelayMs ?? 2500;
  const shouldRetry = options.shouldRetry ?? (() => true);

  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      if (attempt >= maxAttempts || !shouldRetry(err)) {
        throw err;
      }
      // Full Jitter: random delay in [0, min(maxDelayMs, baseDelayMs * 2^attempt)]
      const expCap = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt - 1));
      const jitterDelay = Math.floor(Math.random() * expCap);
      await new Promise((resolve) => setTimeout(resolve, jitterDelay));
    }
  }

  throw lastError;
}

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private openedAt = 0;

  constructor(
    private readonly name: string,
    private readonly failureThreshold: number = 5,
    private readonly resetTimeoutMs: number = 30_000
  ) {}

  getStatus(): { name: string; state: CircuitState; failureCount: number } {
    if (this.state === "OPEN" && Date.now() - this.openedAt >= this.resetTimeoutMs) {
      this.state = "HALF_OPEN";
    }
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
    };
  }

  async execute<T>(operation: () => Promise<T>, fallback?: () => T | Promise<T>): Promise<T> {
    const status = this.getStatus();
    if (status.state === "OPEN") {
      if (fallback) return fallback();
      throw new Error(`Circuit breaker "${this.name}" is OPEN — failing fast.`);
    }

    try {
      const result = await operation();
      this.failureCount = 0;
      this.state = "CLOSED";
      return result;
    } catch (err) {
      this.failureCount += 1;
      if (this.failureCount >= this.failureThreshold) {
        this.state = "OPEN";
        this.openedAt = Date.now();
      }
      if (fallback) return fallback();
      throw err;
    }
  }
}

export const supabaseCircuitBreaker = new CircuitBreaker("supabase-db", 5, 25_000);
export const paymentGatewayCircuitBreaker = new CircuitBreaker("payment-gateway", 4, 30_000);

/** Generates a deterministic or unique Idempotency-Key for payment & advising mutations */
export function createIdempotencyKey(scope: string, entityId: string): string {
  const ts = Math.floor(Date.now() / 10_000); // 10-second dedup window for accidental double-clicks
  return `${scope}:${entityId}:${ts}`;
}

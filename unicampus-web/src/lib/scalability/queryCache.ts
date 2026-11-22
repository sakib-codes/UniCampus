/**
 * Stale-While-Revalidate (SWR) Query Cache with In-Flight Request Coalescing (Singleflight)
 *
 * Prevents database thundering-herd spikes (e.g., 5,000 students opening /notices or /advising
 * simultaneously):
 *  - Coalesces concurrent identical fetches into a single upstream database call.
 *  - Serves fresh entries instantly within ttlMs.
 *  - Serves stale entries immediately while revalidating silently in the background within staleMs.
 */

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
  ttlMs: number;
  staleMs: number;
}

const cacheStore = new Map<string, CacheEntry<unknown>>();
const inFlightRequests = new Map<string, Promise<unknown>>();

export interface SwrOptions {
  /** Duration in ms where cached value is considered completely fresh (default: 30s) */
  ttlMs?: number;
  /** Additional window in ms where stale value can be served while refreshing in background (default: 5m) */
  staleMs?: number;
  /** Force bypass cache and fetch fresh */
  forceRefresh?: boolean;
}

export async function queryWithSwr<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: SwrOptions = {}
): Promise<T> {
  const ttlMs = options.ttlMs ?? 30_000;
  const staleMs = options.staleMs ?? 300_000;
  const now = Date.now();

  if (!options.forceRefresh) {
    const cached = cacheStore.get(key) as CacheEntry<T> | undefined;
    if (cached) {
      const age = now - cached.fetchedAt;
      if (age <= cached.ttlMs) {
        return cached.data;
      }
      if (age <= cached.ttlMs + cached.staleMs) {
        // Trigger background revalidation without blocking caller
        void coalesceFetch(key, fetcher, ttlMs, staleMs);
        return cached.data;
      }
    }
  }

  return coalesceFetch(key, fetcher, ttlMs, staleMs);
}

function coalesceFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number,
  staleMs: number
): Promise<T> {
  const existingPromise = inFlightRequests.get(key) as Promise<T> | undefined;
  if (existingPromise) {
    return existingPromise;
  }

  const promise = fetcher()
    .then((data) => {
      cacheStore.set(key, {
        data,
        fetchedAt: Date.now(),
        ttlMs,
        staleMs,
      });
      return data;
    })
    .finally(() => {
      inFlightRequests.delete(key);
    });

  inFlightRequests.set(key, promise);
  return promise;
}

/** Invalidates all cache entries whose key starts with the given prefix */
export function invalidateQueryCache(prefix?: string): void {
  if (!prefix) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
}

export function getQueryCacheStats(): { entries: number; inFlight: number } {
  return {
    entries: cacheStore.size,
    inFlight: inFlightRequests.size,
  };
}

/**
 * Generic cache manager with TTL and request deduplication
 * Prevents duplicate API calls and caches responses with time-to-live
 */

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

interface CacheConfig {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
}

export class CacheManager<TKey extends string | number, TValue> {
  private cache = new Map<TKey, CacheEntry<TValue>>();
  private inFlightPromises = new Map<TKey, Promise<TValue>>();
  private readonly ttl: number;

  constructor(config: CacheConfig = {}) {
    this.ttl = config.ttl ?? 5 * 60 * 1000; // Default: 5 minutes
  }

  /**
   * Get data from cache or fetch using the provided fetcher function
   * Includes automatic deduplication of concurrent requests
   */
  async get(key: TKey, fetcher: () => Promise<TValue>): Promise<TValue> {
    const now = Date.now();
    const cached = this.cache.get(key);

    // Return cached data if valid
    if (cached && now - cached.fetchedAt < this.ttl) {
      return cached.data;
    }

    // If there's already a request in flight, return that promise (deduplication)
    const inFlightPromise = this.inFlightPromises.get(key);
    if (inFlightPromise) {
      return inFlightPromise;
    }

    // Start new fetch
    const promise = fetcher()
      .then((data) => {
        this.cache.set(key, { data, fetchedAt: Date.now() });
        this.inFlightPromises.delete(key);
        return data;
      })
      .catch((error) => {
        this.inFlightPromises.delete(key);
        // Return stale cached data if available, otherwise rethrow
        if (cached) {
          console.warn(`Fetch failed for key "${key}", using stale cache:`, error);
          return cached.data;
        }
        throw error;
      });

    this.inFlightPromises.set(key, promise);
    return promise;
  }

  /**
   * Get data synchronously from cache only (no fetch)
   * Returns null if not in cache
   */
  getSync(key: TKey): TValue | null {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  /**
   * Manually set cache entry (useful for SSR hydration)
   */
  set(key: TKey, data: TValue): void {
    this.cache.set(key, { data, fetchedAt: Date.now() });
  }

  /**
   * Check if key exists in cache
   */
  has(key: TKey): boolean {
    return this.cache.has(key);
  }

  /**
   * Check if cache is valid (not expired)
   */
  isValid(key: TKey): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.fetchedAt < this.ttl;
  }

  /**
   * Clear specific cache entry
   */
  delete(key: TKey): void {
    this.cache.delete(key);
    this.inFlightPromises.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.inFlightPromises.clear();
  }

  /**
   * Get all cached keys
   */
  keys(): TKey[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * Specialized cache manager for single-value caches (like categories or cities list)
 */
export class SingletonCacheManager<T> {
  private cache: CacheEntry<T> | null = null;
  private inFlightPromise: Promise<T> | null = null;
  private readonly ttl: number;

  constructor(config: CacheConfig = {}) {
    this.ttl = config.ttl ?? 5 * 60 * 1000; // Default: 5 minutes
  }

  /**
   * Get data from cache or fetch using the provided fetcher function
   */
  async get(fetcher: () => Promise<T>): Promise<T> {
    const now = Date.now();

    // Return cached data if valid
    if (this.cache && now - this.cache.fetchedAt < this.ttl) {
      return this.cache.data;
    }

    // If there's already a request in flight, return that promise (deduplication)
    if (this.inFlightPromise) {
      return this.inFlightPromise;
    }

    // Start new fetch
    this.inFlightPromise = fetcher()
      .then((data) => {
        this.cache = { data, fetchedAt: Date.now() };
        this.inFlightPromise = null;
        return data;
      })
      .catch((error) => {
        this.inFlightPromise = null;
        // Return stale cached data if available, otherwise rethrow
        if (this.cache) {
          console.warn('Fetch failed, using stale cache:', error);
          return this.cache.data;
        }
        throw error;
      });

    return this.inFlightPromise;
  }

  /**
   * Get data synchronously from cache only (no fetch)
   * Returns null if not in cache
   */
  getSync(): T | null {
    return this.cache ? this.cache.data : null;
  }

  /**
   * Manually set cache entry (useful for SSR hydration)
   */
  set(data: T): void {
    this.cache = { data, fetchedAt: Date.now() };
  }

  /**
   * Check if cache has data
   */
  has(): boolean {
    return this.cache !== null;
  }

  /**
   * Check if cache is valid (not expired)
   */
  isValid(): boolean {
    if (!this.cache) return false;
    return Date.now() - this.cache.fetchedAt < this.ttl;
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache = null;
    this.inFlightPromise = null;
  }
}

// ============================================
//  cache.js – Simple in‑memory caching
// ============================================

const cache = new Map();

/**
 * Get cached data if not expired
 * @param {string} key – unique cache key
 * @param {number} ttl – time‑to‑live in milliseconds (default: 5 minutes)
 * @returns {any|null} – cached data or null
 */
export function getCached(key, ttl = 300000) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < ttl) {
    return entry.data;
  }
  return null;
}

/**
 * Store data in cache
 * @param {string} key – unique cache key
 * @param {any} data – data to store
 */
export function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Clear all cache (useful after admin updates)
 */
export function clearCache() {
  cache.clear();
}
/**
 * Thin, typed wrappers around localStorage.
 * Falls back gracefully if storage is unavailable (e.g., SSR or private mode).
 */
export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail — e.g., quota exceeded
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch {
      // Silently fail
    }
  },
};

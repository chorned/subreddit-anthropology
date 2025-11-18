const CACHE_EXPIRATION_MS = 3 * 60 * 60 * 1000; // 3 hours
const CACHE_PREFIX = 'subredditHumanistCache_';

interface CacheEntry {
  analysis: string;
  timestamp: number;
}

const getCacheKey = (subredditName: string): string => `${CACHE_PREFIX}${subredditName.toLowerCase()}`;

export const getCachedAnalysis = (subredditName: string): string | null => {
  const key = getCacheKey(subredditName);
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;

    const entry: CacheEntry = JSON.parse(data);
    const now = Date.now();

    if (now - entry.timestamp > CACHE_EXPIRATION_MS) {
      // Cache expired, remove it
      localStorage.removeItem(key);
      return null;
    }
    
    console.log(`Serving cached analysis for r/${subredditName}`);
    return entry.analysis;
  } catch (error) {
    console.error("Failed to read from cache", error);
    // In case of error, clear the key to avoid issues
    localStorage.removeItem(key);
    return null;
  }
};

export const setCachedAnalysis = (subredditName: string, analysis: string): void => {
  const key = getCacheKey(subredditName);
  const entry: CacheEntry = {
    analysis,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(entry));
    console.log(`Cached analysis for r/${subredditName}`);
  } catch (error) {
    console.error("Failed to write to cache", error);
  }
};

export const clearAllCache = (): void => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log(`Subreddit Humanist cache cleared. ${keysToRemove.length} items removed.`);
  } catch (error) {
    console.error("Failed to clear cache", error);
  }
};

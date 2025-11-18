const RATE_LIMIT_COUNT = 5; // 5 requests
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const STORAGE_KEY = 'subredditHumanistRateLimit';

interface RateLimitData {
  timestamps: number[];
}

const getTimestamps = (): number[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed: RateLimitData = JSON.parse(data);
      if (Array.isArray(parsed.timestamps)) {
        return parsed.timestamps;
      }
    }
  } catch (error) {
    console.error("Failed to read rate limit data from localStorage", error);
  }
  return [];
};

const saveTimestamps = (timestamps: number[]): void => {
  try {
    const data: RateLimitData = { timestamps };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save rate limit data to localStorage", error);
  }
};

/**
 * Checks if a request is allowed and records it if so.
 * Throws an error if the rate limit has been exceeded.
 */
export const checkAndRecordRequest = (): void => {
  const now = Date.now();
  const timestamps = getTimestamps();

  const recentTimestamps = timestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );

  if (recentTimestamps.length >= RATE_LIMIT_COUNT) {
    const oldestRequest = recentTimestamps[0] ?? now;
    const timeToWait = Math.ceil((oldestRequest + RATE_LIMIT_WINDOW_MS - now) / (1000 * 60));
    throw new Error(`You have made too many requests. Please try again in about ${timeToWait} minutes.`);
  }

  const newTimestamps = [...recentTimestamps, now];
  saveTimestamps(newTimestamps);
};
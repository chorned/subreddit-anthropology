/**
 * Parses various subreddit input formats and extracts the subreddit name.
 *
 * @param {string} input - The user input string.
 * @returns {string | null} The extracted subreddit name or null if invalid.
 */
export const normalizeSubredditName = (input: string): string | null => {
  if (!input || input.trim() === '') {
    return null;
  }

  const trimmedInput = input.trim();

  try {
    // Handle full URLs
    if (trimmedInput.startsWith('http')) {
      const url = new URL(trimmedInput);
      const pathParts = url.pathname.split('/').filter(part => part);
      const rIndex = pathParts.indexOf('r');
      if (rIndex !== -1 && pathParts[rIndex + 1]) {
        return pathParts[rIndex + 1];
      }
    }
    
    // Handle formats like "/r/philosophy" or "r/philosophy"
    const match = trimmedInput.match(/^(?:\/?r\/)?([a-zA-Z0-9_]+)/);
    if (match && match[1]) {
      return match[1];
    }
    
    // Handle just the name "philosophy"
    if (/^[a-zA-Z0-9_]+$/.test(trimmedInput)) {
        return trimmedInput;
    }

  } catch (e) {
    // In case of invalid URL
    return null;
  }

  return null;
};

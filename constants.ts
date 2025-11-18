export const SUBREDDIT_SUGGESTIONS = [
  'askreddit',
  'todayilearned',
  'science',
  'philosophy',
  'worldnews',
  'futurology',
  'dataisbeautiful',
  'amitheasshole',
  'lifeprotips',
  'explainlikeimfive',
  'relationships',
  'nosleep',
  'personalfinance',
];

export interface Quote {
  text: string;
  author: string;
  source: string;
  year: string;
}

export const LOADING_QUOTES: Quote[] = [
  {
    text: "The proper study of mankind is man.",
    author: "Alexander Pope",
    source: "An Essay on Man",
    year: "1734",
  },
  {
    text: "Man is the only creature who refuses to be what he is.",
    author: "Albert Camus",
    source: "The Rebel",
    year: "1951",
  },
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates",
    source: "Plato's Apology",
    year: "c. 399 BC",
  },
  {
    text: "What is a man? A miserable little pile of secrets.",
    author: "André Malraux",
    source: "Man's Fate",
    year: "1933",
  },
  {
    text: "I seem to be a verb.",
    author: "R. Buckminster Fuller",
    source: "I Seem to Be a Verb",
    year: "1970",
  },
  {
    text: "The human heart has hidden treasures, in secret kept, in silence sealed.",
    author: "Charlotte Brontë",
    source: "Evening Solace",
    year: "1846",
  },
  {
    text: "Man is a mystery. It needs to be unravelled, and if you spend your whole life unravelling it, don't say that you've wasted time.",
    author: "Fyodor Dostoevsky",
    source: "Letter to his brother",
    year: "1839",
  },
  {
    text: "Have patience with everything that remains unsolved in your heart and try to love the questions themselves.",
    author: "Rainer Maria Rilke",
    source: "Letters to a Young Poet",
    year: "1929",
  },
];

import React, { useState, useEffect } from 'react';
import { SUBREDDIT_SUGGESTIONS } from '../constants';

interface SubredditInputProps {
  onSubmit: (subreddit: string) => void;
  isLoading: boolean;
}

const SubredditInput: React.FC<SubredditInputProps> = ({ onSubmit, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkIsPortrait = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkIsPortrait();
    window.addEventListener('resize', checkIsPortrait);

    return () => {
      window.removeEventListener('resize', checkIsPortrait);
    };
  }, []);

  const showRandomSuggestions = () => {
    const shuffled = [...SUBREDDIT_SUGGESTIONS].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 3));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      showRandomSuggestions();
    } else {
      const filtered = SUBREDDIT_SUGGESTIONS.filter(sub =>
        sub.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    if (inputValue.trim() === '') {
      showRandomSuggestions();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    onSubmit(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
    }
  };

  const placeholderText = isPortrait
    ? "Tap for suggestions"
    : "Enter a subreddit (e.g., r/philosophy)";

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto animate-fade-in px-4">
      <h1 className="text-3xl md:text-4xl font-serif text-center mb-8 text-text-main/95 leading-snug">
        Contemporary Anthropology through the lens of a Subreddit
      </h1>
      <form onSubmit={handleSubmit} className="w-full relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          disabled={isLoading}
          className="w-full px-5 py-4 bg-surface border-2 border-transparent rounded-lg text-base landscape:text-lg text-gray-50 placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors"
          placeholder={placeholderText}
          aria-label="Subreddit input"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-lg shadow-lg overflow-hidden z-10" role="listbox">
            {suggestions.map(sub => (
              <li
                key={sub}
                role="option"
                aria-selected={false}
                onMouseDown={() => handleSuggestionClick(sub)}
                className="px-5 py-3 cursor-pointer hover:bg-primary/20 transition-colors"
              >
                r/{sub}
              </li>
            ))}
          </ul>
        )}
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white font-bold rounded-md hover:bg-blue-500 transition-colors disabled:bg-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      <p className="mt-4 text-sm text-text-secondary">
        Or try one of the suggestions. The weirder, the better.
      </p>
    </div>
  );
};

export default SubredditInput;
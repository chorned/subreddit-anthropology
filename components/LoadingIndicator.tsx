import React, { useState, useEffect } from 'react';
import { LOADING_QUOTES } from '../constants';
import type { Quote } from '../constants';

const LoadingIndicator: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    setQuote(LOADING_QUOTES[Math.floor(Math.random() * LOADING_QUOTES.length)]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-64 h-1 bg-surface rounded-full overflow-hidden">
        <div className="h-1 w-1/2 bg-primary rounded-full animate-pulse-line"></div>
        <style>{`
          @keyframes pulse-line {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(328px); }
          }
          .animate-pulse-line {
            animation: pulse-line 2s ease-in-out infinite;
          }
        `}</style>
      </div>
      {quote && (
        <figure className="mt-6 max-w-sm animate-fade-in">
            <blockquote className="text-text-secondary italic text-sm">
              "{quote.text}"
            </blockquote>
            <figcaption className="text-right text-text-secondary/70 text-xs mt-2">
              — {quote.author}, <cite>{quote.source}</cite> ({quote.year})
            </figcaption>
        </figure>
      )}
    </div>
  );
};

export default LoadingIndicator;

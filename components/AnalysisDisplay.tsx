import React from 'react';

interface AnalysisDisplayProps {
  analysis: string;
  subreddit: string;
  onReset: () => void;
}

/**
 * A simple inline markdown parser that converts **bold** and *italic* text
 * into corresponding HTML elements.
 * @param text The string to parse.
 * @returns A React Node with parsed markdown.
 */
const parseInlineMarkdown = (text: string): React.ReactNode => {
  // Use a key for React list rendering
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    // Using Fragment to avoid unnecessary wrappers and satisfy key requirement
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, subreddit, onReset }) => {
  const formattedAnalysis = analysis
    .split('\n')
    .filter(p => p.trim() !== '')
    .map((paragraph, index) => (
      <p key={index} className="mb-6 last:mb-0">
        {parseInlineMarkdown(paragraph)}
      </p>
    ));
    
  const subredditUrl = `https://www.reddit.com/r/${subreddit}`;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 animate-fade-in flex flex-col items-center">
      <h2 className="font-serif text-3xl md:text-4xl text-center mb-4 text-text-main/90">
        An Analysis of <span className="italic">r/{subreddit}</span>
      </h2>
      <div className="mt-12 font-serif text-2xl md:text-3xl text-center leading-loose text-text-main/80 min-h-[10rem]">
        {formattedAnalysis}
        {analysis && <span className="animate-pulse opacity-70">▍</span>}
      </div>
      
      <div className="mt-16 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
        <a
          href={subredditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-500 transition-colors text-center"
        >
          Visit r/{subreddit}
        </a>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-surface text-text-main font-bold rounded-lg hover:bg-gray-600 transition-colors"
        >
          Test Another
        </button>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
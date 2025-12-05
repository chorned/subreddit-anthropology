import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const GithubIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.09.682-.218.682-.482 0-.237-.009-.868-.014-1.703-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.645 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.375.203 2.392.1 2.645.64.698 1.028 1.591 1.028 2.682 0 3.842-2.338 4.685-4.566 4.935.359.309.678.92.678 1.855 0 1.336-.012 2.415-.012 2.743 0 .266.18.577.688.48C19.137 20.162 22 16.417 22 12A10 10 0 0012 2z" />
  </svg>
);

const LinkedInIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const HeartIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const PortfolioIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const links = [
    { href: 'https://horned.se', Icon: PortfolioIcon, text: 'My Portfolio' },
    { href: 'https://github.com/chorned', Icon: GithubIcon, text: 'My Github' },
    { href: 'https://www.linkedin.com/in/carlhorned/', Icon: LinkedInIcon, text: 'My LinkedIn' },
    { href: 'https://ko-fi.com/chorned', Icon: HeartIcon, text: "Hosting isn't free, a donation is appreciated" },
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto animate-fade-in px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-serif mb-6 text-text-main/95 leading-snug">
        Contemporary Anthropology through the lens of a Subreddit
      </h1>
      
      <p className="text-base md:text-lg text-text-secondary mb-12">
        In this prototype I want to imagine the LLM as an outside observer of humanity. 
        The LLM looks at humanity through the lens of different communities, 
        in this case subreddits, and writes its observation.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-12">
        {links.map(({ href, Icon, text }) => (
            <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start text-left gap-4 p-4 bg-surface rounded-lg hover:bg-primary/20 transition-colors text-text-secondary hover:text-text-main"
            >
                <Icon />
                <span>{text}</span>
            </a>
        ))}
      </div>

      <button
        onClick={onStart}
        className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-500 transition-colors text-lg"
      >
        Begin
      </button>
    </div>
  );
};

export default WelcomeScreen;
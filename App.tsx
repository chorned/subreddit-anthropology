import React, { useState, useCallback, useEffect } from 'react';
import { GenerateContentResponse } from "@google/genai";
import SubredditInput from './components/SubredditInput';
import LoadingIndicator from './components/LoadingIndicator';
import AnalysisDisplay from './components/AnalysisDisplay';
import WelcomeScreen from './components/WelcomeScreen';
import { normalizeSubredditName } from './utils/subredditParser';
import { fetchSubredditData } from './services/redditService';
import { getAnalysisStream } from './services/geminiService';
import { checkAndRecordRequest } from './utils/rateLimiter';
import { getCachedAnalysis, setCachedAnalysis, clearAllCache } from './utils/cache';

type ViewState = 'welcome' | 'initial' | 'loading' | 'result' | 'error';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('welcome');
  const [subreddit, setSubreddit] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Expose a function to the window object for admin cache clearing
    (window as any).clearSubredditCache = clearAllCache;
    console.log('Admin command registered: call `clearSubredditCache()` from the console to clear the cache.');

    // Cleanup function to remove it when the component unmounts
    return () => {
      delete (window as any).clearSubredditCache;
    };
  }, []);

  const handleAnalysis = useCallback(async (input: string) => {
    setErrorMessage('');
    setAnalysis('');

    try {
      checkAndRecordRequest();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected rate limit error occurred.');
      }
      setView('error');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    const normalizedSub = normalizeSubredditName(input);

    if (!normalizedSub) {
      setErrorMessage('The link was not recognized as a valid subreddit.');
      setView('error');
      setIsLoading(false);
      return;
    }

    setSubreddit(normalizedSub);
    setView('loading');
    
    const cachedAnalysis = getCachedAnalysis(normalizedSub);
    if (cachedAnalysis) {
      setAnalysis(cachedAnalysis);
      setView('result');
      setIsLoading(false);
      return;
    }
    
    try {
      // In a real app, this would be a backend call. Here we simulate it.
      const redditData = await fetchSubredditData(normalizedSub);
      const stream = await getAnalysisStream(normalizedSub, redditData);

      setView('result');

      let text = '';
      for await (const chunk of stream) {
          const response = chunk as GenerateContentResponse;
          const chunkText = response.text;
          if(chunkText) {
            text += chunkText;
            setAnalysis(text);
          }
      }

      if (text) {
        setCachedAnalysis(normalizedSub, text);
      }

    } catch (error) {
      console.error("Error during analysis:", error);
      let message = 'An unknown error occurred.';
      if (error instanceof Error) {
        message = error.message;
      }
      setErrorMessage(message);
      setView('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = (input: string) => {
    handleAnalysis(input);
  };
  
  const handleReset = () => {
    setView('initial');
    setSubreddit('');
    setAnalysis('');
    setErrorMessage('');
    setIsLoading(false);
  }

  const handleStart = () => {
    setView('initial');
  }

  const renderContent = () => {
    switch (view) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />;
      case 'loading':
        return <LoadingIndicator />;
      case 'result':
        return <AnalysisDisplay analysis={analysis} subreddit={subreddit} onReset={handleReset} />;
      case 'error':
        return (
          <div className="text-center animate-fade-in">
            <p className="text-red-400 mb-4">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      case 'initial':
      default:
        return <SubredditInput onSubmit={handleSubmit} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-opacity duration-500">
      {renderContent()}
    </div>
  );
};

export default App;

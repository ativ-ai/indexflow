import React, { useState, useCallback } from 'react';
import { SeoResults } from './types';
import { analyzeUrl } from './services/seoService';
import SeoInputForm from './components/SeoInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import About from './components/About';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [results, setResults] = useState<SeoResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'main' | 'about'>('main');

  const handleAnalysis = useCallback(async (targetUrl: string) => {
    if (!targetUrl) {
      setError('Please enter a valid URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    setUrl(targetUrl);

    try {
      setStatusMessage('Fetching URL data...');
      await new Promise(res => setTimeout(res, 500));
      
      setStatusMessage('Performing SEO audit...');
      await new Promise(res => setTimeout(res, 1000));
      
      setStatusMessage('Generating sitemap...');
      const seoData = await analyzeUrl(targetUrl);
      
      setStatusMessage('Analysis complete!');
      await new Promise(res => setTimeout(res, 500));
      
      setResults(seoData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  }, []);

  const handleNavigate = () => {
    if (view === 'main') {
      setView('about');
    } else {
      // Reset state when returning to the main analyzer
      setResults(null);
      setError(null);
      setUrl('');
      setIsLoading(false);
      setStatusMessage('');
      setView('main');
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <LogoIcon />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">
              IndexFlow
            </h1>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            Audit, Generate, Index: Simple SEO That Works.
          </p>
          <p className="text-slate-500 text-base mt-3 leading-relaxed max-w-3xl mx-auto">
            Enter your website URL for an instant analysis of key on-page SEO factors and generate a ready-to-use XML sitemap. Our tool checks for critical elements like status codes, title tags, meta descriptions, and H1 tags, providing actionable recommendations to help you rank higher.
          </p>
        </header>

        <main>
          {view === 'main' ? (
            <div className="bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 p-6 sm:p-8">
              <SeoInputForm onSubmit={handleAnalysis} isLoading={isLoading} />

              {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center">
                  {error}
                </div>
              )}

              {(isLoading || results) && (
                <ResultsDisplay
                  results={results}
                  url={url}
                  isLoading={isLoading}
                  statusMessage={statusMessage}
                />
              )}
            </div>
          ) : (
            <About />
          )}
        </main>

        <footer className="text-center mt-10 text-slate-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} IndexFlow. Design by <a href="https://ativ.ai" target="_blank" rel="noopener noreferrer" className="font-medium text-sky-600 hover:text-sky-800 hover:underline">Ativ.ai</a>.
              <button 
                onClick={handleNavigate} 
                className="ml-4 font-medium text-sky-600 hover:text-sky-800 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
                aria-label={view === 'main' ? 'Go to About page' : 'Go back to main analyzer'}
              >
                {view === 'main' ? 'About' : 'Back to Analyzer'}
              </button>
            </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
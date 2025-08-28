

import React, { useState, useCallback, useEffect } from 'react';
import { SeoResults, UserProfile, AuditHistoryEntry } from './types';
import { analyzeUrl } from './services/seoService';
import SeoInputForm from './components/SeoInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import About from './components/About';
import Pricing from './components/Pricing';
import LoginButton from './components/LoginButton';
import UserProfileDisplay from './components/UserProfile';
import AuditHistory from './components/AuditHistory';
import CookieBanner from './components/CookieBanner';
import ProFeatureTeaser from './components/ProFeatureTeaser';
import { LogoIcon, HistoryIcon } from './components/Icons';

type View = 'main' | 'about' | 'pricing';

const getViewFromPath = (path: string): View => {
  if (path === '/about') return 'about';
  if (path === '/pricing') return 'pricing';
  return 'main';
};

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [results, setResults] = useState<SeoResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>(getViewFromPath(window.location.pathname));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userPlan, setUserPlan] = useState<'FREE' | 'PRO'>('FREE');
  const [auditHistory, setAuditHistory] = useState<AuditHistoryEntry[]>([]);
  const [isLimitReached, setIsLimitReached] = useState<boolean>(false);
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);

  useEffect(() => {
    const handlePopState = () => {
      setView(getViewFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);


  useEffect(() => {
    const checkLimit = () => {
      if (userPlan === 'FREE') {
        const lastAuditDate = localStorage.getItem('lastFreeAuditDate');
        const today = new Date().toISOString().split('T')[0];
        if (lastAuditDate === today) {
          setIsLimitReached(true);
        } else {
          setIsLimitReached(false);
        }
      } else {
        setIsLimitReached(false);
      }
    };
    checkLimit();
  }, [userPlan]);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent !== 'true') {
      const timer = setTimeout(() => {
        setShowCookieBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowCookieBanner(false);
  };

  const handleLoginSuccess = async (profile: UserProfile) => {
    setUser(profile);
    // DEMO: Upgrade user to PRO and add mock history on login
    setUserPlan('PRO'); 
    
    // Create mock history data
    const historyUrl1 = 'https://google.com';
    const historyUrl2 = 'https://react.dev';
    const mockResults1 = await analyzeUrl(historyUrl1);
    const mockResults2 = await analyzeUrl(historyUrl2);

    setAuditHistory([
      { id: new Date('2023-10-26T10:00:00Z').toISOString(), url: historyUrl1, date: new Date('2023-10-26T10:00:00Z'), results: mockResults1 },
      { id: new Date('2023-10-25T15:30:00Z').toISOString(), url: historyUrl2, date: new Date('2023-10-25T15:30:00Z'), results: mockResults2 },
    ]);
  };

  const handleLogout = () => {
    setUser(null);
    setUserPlan('FREE');
    setAuditHistory([]);
  };

  const handleLoginError = () => {
    console.error("Google login failed.");
  };

  const handleAnalysis = useCallback(async (targetUrl: string) => {
    if (isLimitReached) {
      setError('You have reached your daily audit limit for the FREE plan. Please upgrade to PRO for unlimited analyses.');
      return;
    }

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

      if (userPlan === 'PRO' && user) {
        const newHistoryEntry: AuditHistoryEntry = {
          id: new Date().toISOString(),
          url: targetUrl,
          date: new Date(),
          results: seoData,
        };
        setAuditHistory(prevHistory => [newHistoryEntry, ...prevHistory]);
      } else if (userPlan === 'FREE') {
        // FREE user: set the limit for today
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('lastFreeAuditDate', today);
        setIsLimitReached(true);
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  }, [userPlan, isLimitReached, user]);

  const handleViewHistory = (entry: AuditHistoryEntry) => {
    setUrl(entry.url);
    setResults(entry.results);
    setError(null);
    setIsLoading(false);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };
  
  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, targetView: View) => {
    e.preventDefault();
    const path = targetView === 'main' ? '/' : `/${targetView}`;

    if (window.location.pathname === path) return;

    window.history.pushState({}, '', path);
    
    if (targetView === 'main') {
      setResults(null);
      setError(null);
      setUrl('');
      setIsLoading(false);
      setStatusMessage('');
    }
    setView(targetView);
  };

  const renderView = () => {
    switch (view) {
      case 'about':
        return <About />;
      case 'pricing':
        // FIX: Added 'as any' to the event to match the signature of handleNavigate, which expects an Anchor element event.
        return <Pricing onNavigate={(e) => handleNavigate(e as any, 'main')} />;
      case 'main':
      default:
        return (
          <section aria-labelledby="main-heading">
            <div className="bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 p-6 sm:p-8">
              <SeoInputForm onSubmit={handleAnalysis} isLoading={isLoading} isLimitReached={isLimitReached} />
              
              {isLimitReached && userPlan === 'FREE' && !isLoading && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-center text-sm">
                  You've used your free audit for today. <a href="/pricing" onClick={(e) => handleNavigate(e, 'pricing')} className="font-bold underline hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded">Upgrade to PRO</a> for unlimited analyses.
                </div>
              )}
              
              {user && userPlan === 'PRO' && auditHistory.length > 0 && !isLoading && !results && (
                <AuditHistory history={auditHistory} onViewHistory={handleViewHistory} />
              )}
              
              {user && userPlan === 'FREE' && !isLoading && !results && (
                <ProFeatureTeaser
                  icon={<HistoryIcon />}
                  title="Unlock Audit History"
                  description="PRO users can track their SEO progress by reviewing past analyses. Upgrade to keep a record of every audit."
                  onUpgradeClick={(e) => handleNavigate(e as any, 'pricing')}
                />
              )}

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
                  userPlan={userPlan}
                  onUpgradeClick={(e) => handleNavigate(e as any, 'pricing')}
                />
              )}
            </div>
          </section>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="flex items-center justify-between py-4 mb-8 gap-4">
           <a 
            href="/"
            onClick={(e) => handleNavigate(e, 'main')}
            className="flex items-center gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg p-1 -m-1"
            aria-label="IndexFlow Home"
           >
            <LogoIcon />
            <span className="text-2xl font-bold text-slate-800 hidden sm:inline group-hover:text-sky-600 transition-colors">IndexFlow</span>
          </a>
          <nav className="flex items-center gap-4" aria-label="Main navigation">
              <a 
                href="/about"
                onClick={(e) => handleNavigate(e, 'about')} 
                className="font-medium text-sky-600 hover:text-sky-800 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
              >
                About
              </a>
             <a 
                href="/pricing"
                onClick={(e) => handleNavigate(e, 'pricing')} 
                className="font-medium text-sky-600 hover:text-sky-800 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
              >
                Pricing
              </a>
            {user ? (
              <UserProfileDisplay user={user} onLogout={handleLogout} />
            ) : (
              <LoginButton onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} />
            )}
          </nav>
        </header>

        {view === 'main' && (
           <div className="text-center mb-10">
            <h1 id="main-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">
              Instant SEO Audit & Sitemap
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto font-medium mt-2">
              Check, Generate, Index: Simple SEO That Works.
            </p>
            <p className="text-slate-500 text-base mt-3 leading-relaxed max-w-3xl mx-auto">
              Get an instant SEO checkup and an XML sitemap for your website. We analyze crucial elements like title tags, meta descriptions, and status codes, offering clear recommendations to improve your search engine ranking.
            </p>
          </div>
        )}
       
        <main>
          {renderView()}
        </main>

        <footer className="text-center mt-10 text-slate-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} IndexFlow. Design by <a href="https://ativ.ai" target="_blank" rel="noopener noreferrer" className="font-medium text-sky-600 hover:text-sky-800 hover:underline">Ativ.ai</a>.
            </p>
        </footer>
      </div>
      {showCookieBanner && <CookieBanner onAccept={handleAcceptCookies} />}
    </div>
  );
};

export default App;
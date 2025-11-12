

import React, { useState, useCallback, useEffect } from 'react';
import { SeoResults, UserProfile, AuditHistoryEntry } from './types';
import { analyzeUrl } from './services/seoService';
import SeoInputForm from './components/SeoInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import About from './components/About';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import LoginButton from './components/LoginButton';
import UserProfileDisplay from './components/UserProfile';
import AuditHistory from './components/AuditHistory';
import CookieBanner from './components/CookieBanner';
import StatusDisplay from './components/StatusDisplay';
import LandingPage from './components/LandingPage'; // Import the new Landing Page
import { AnalyzeIcon, LogoIcon, MenuAboutIcon, MenuFAQIcon, MenuPricingIcon, SearchIcon, ChatIcon } from './components/Icons';
import Chatbot from './components/Chatbot';

declare const Stripe: any; // Declare Stripe as a global variable from the script tag

type View = 'main' | 'about' | 'pricing' | 'faq' | 'analyze';

const FREE_PLAN_DAILY_LIMIT = 3;
const FREE_PLAN_HISTORY_LIMIT = 5;

// NOTE: In a real application, this key should be stored in an environment variable.
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51Rb7ehDvGAbJzCKmoCqR74hJdm0hiheMikJhIaC18Sx8kUXEE5OeBP3MFiXImVhyJq4MJzWDjyVGrllVprWzeA8700wcHFPhPD';

const getViewFromPath = (path: string): View => {
  if (path === '/about') return 'about';
  if (path === '/pricing') return 'pricing';
  if (path === '/faq') return 'faq';
  if (path === '/analyze') return 'analyze';
  return 'main';
};

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [results, setResults] = useState<SeoResults | null>(null);
  const [sitemapBlobUrl, setSitemapBlobUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>(getViewFromPath(window.location.pathname));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userPlan, setUserPlan] = useState<'FREE' | 'Premium'>('FREE');
  const [auditHistory, setAuditHistory] = useState<AuditHistoryEntry[]>([]);
  const [isLimitReached, setIsLimitReached] = useState<boolean>(false);
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const [initialMetas, setInitialMetas] = useState({ title: '', description: '' });
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);


  // Store initial meta tags from index.html on first load
  useEffect(() => {
    const metaDesc = document.querySelector('meta[name="description"]');
    setInitialMetas({
        title: document.title,
        description: metaDesc ? metaDesc.getAttribute('content') || '' : '',
    });
  }, []);

  // Update meta tags dynamically when viewing results
  useEffect(() => {
    if (results && url) {
      document.title = `SEO Audit for ${url} | IndexFlow`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `View the detailed SEO audit report for ${url}, including checks for title tags, meta descriptions, sitemap, and more.`);
      }
    }
  }, [results, url]);


  // Callback to reset meta tags to their initial state
  const resetMetaTags = useCallback(() => {
      if (initialMetas.title) {
        document.title = initialMetas.title;
      }
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && initialMetas.description) {
          metaDesc.setAttribute('content', initialMetas.description);
      }
  }, [initialMetas]);


  const handleAnalysis = useCallback(async (targetUrl: string) => {
    if (isLimitReached) {
      setError(`You have reached your daily limit of ${FREE_PLAN_DAILY_LIMIT} audits on the FREE plan. Please upgrade to Premium for unlimited analyses.`);
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
      setStatusMessage('AI is analyzing your URL...');
      
      const seoData = await analyzeUrl(targetUrl, userPlan);
      
      setStatusMessage('Analysis complete!');
      await new Promise(res => setTimeout(res, 500)); // Short delay for smooth UI transition
      
      setResults(seoData);

      // Update URL to be shareable
      const newPath = `/analyze?url=${encodeURIComponent(targetUrl)}`;
      if (window.location.pathname + window.location.search !== newPath) {
        window.history.pushState({ path: newPath }, `SEO Audit for ${targetUrl}`, newPath);
      }
      
      const newHistoryEntry: AuditHistoryEntry = {
        id: new Date().toISOString(),
        url: targetUrl,
        date: new Date(),
        results: seoData,
      };

      if (userPlan === 'Premium' && user) {
        setAuditHistory(prevHistory => [newHistoryEntry, ...prevHistory]);
      } else if (userPlan === 'FREE') {
         if (user) { // Only save history if a free user is logged in
            setAuditHistory(prevHistory => {
                const updatedHistory = [newHistoryEntry, ...prevHistory];
                const limitedHistory = updatedHistory.slice(0, FREE_PLAN_HISTORY_LIMIT);
                try {
                    localStorage.setItem('freeAuditHistory', JSON.stringify(limitedHistory));
                } catch (e) {
                    console.warn('Failed to save audit history to local storage.', e);
                }
                return limitedHistory;
            });
        }

        // FREE user: update the daily audit limit tracker
        try {
            const auditTrackerRaw = localStorage.getItem('freeAuditTracker');
            const today = new Date().toISOString().split('T')[0];
            let newCount = 1;

            if (auditTrackerRaw) {
                const auditTracker = JSON.parse(auditTrackerRaw);
                if (auditTracker.date === today) {
                    newCount = auditTracker.count + 1;
                }
            }
            
            localStorage.setItem('freeAuditTracker', JSON.stringify({ date: today, count: newCount }));

            if (newCount >= FREE_PLAN_DAILY_LIMIT) {
                setIsLimitReached(true);
            }
        } catch (error) {
            console.warn('Could not update audit limit in localStorage.', error);
        }
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  }, [userPlan, isLimitReached, user]);
  
  // Handle popstate for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const newView = getViewFromPath(window.location.pathname);
      const queryParams = new URLSearchParams(window.location.search);
      const urlFromQuery = queryParams.get('url');

      setView(newView); // Always update the view first

      if ((newView !== 'analyze') || (newView === 'analyze' && !urlFromQuery)) {
          // We've navigated to a page that shouldn't show results, or to /analyze without a URL
          setResults(null);
          setError(null);
          setUrl('');
          setIsLoading(false);
          setStatusMessage('');
          resetMetaTags();
      } else if (newView === 'analyze' && urlFromQuery) {
          // We've navigated to a results page (e.g., via back button), re-run the analysis for that URL
          handleAnalysis(urlFromQuery);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [resetMetaTags, handleAnalysis]);
  
  // Handle initial load with a URL parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlFromQuery = queryParams.get('url');

    if (getViewFromPath(window.location.pathname) === 'analyze' && urlFromQuery) {
        handleAnalysis(urlFromQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on initial mount


  // Handle redirect from Stripe Checkout
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get("session_id");
    const canceled = query.get("canceled");

    if (sessionId) {
        alert("Upgrade successful! Welcome to Premium.");
        // In a real app, we'd verify the session with the backend.
        // For this demo, we'll just update the client-side state.
        setUserPlan('Premium');
    }

    if (canceled) {
        alert("Your upgrade was canceled. You can upgrade anytime from the pricing page.");
    }

    // Clean up the URL by removing the query parameters
    if (sessionId || canceled) {
        // Using replaceState to avoid adding to browser history
        window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []); // Run only once on component mount to check for redirects.

  // Effect to manage the lifecycle of the sitemap blob URL
  useEffect(() => {
    let objectUrl = '';
    if (results?.sitemapXml) {
      const blob = new Blob([results.sitemapXml], { type: 'application/xml' });
      objectUrl = URL.createObjectURL(blob);
      setSitemapBlobUrl(objectUrl);
    } else {
      setSitemapBlobUrl(''); // Clear URL if no results
    }

    // Cleanup function to revoke the URL and prevent memory leaks
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [results]);


  useEffect(() => {
    const checkLimit = () => {
      if (userPlan === 'FREE') {
        try {
          const auditTrackerRaw = localStorage.getItem('freeAuditTracker');
          const today = new Date().toISOString().split('T')[0];

          if (auditTrackerRaw) {
            const { date, count } = JSON.parse(auditTrackerRaw);
            if (date === today && count >= FREE_PLAN_DAILY_LIMIT) {
              setIsLimitReached(true);
            } else {
              setIsLimitReached(false);
            }
          } else {
            setIsLimitReached(false);
          }
        } catch (error) {
          console.warn('Could not access localStorage to check audit limit.', error);
          setIsLimitReached(false); // Assume not reached if storage is inaccessible
        }
      } else {
        setIsLimitReached(false);
      }
    };
    checkLimit();
  }, [userPlan]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    try {
      const consent = localStorage.getItem('cookie_consent');
      if (consent !== 'true') {
        timer = setTimeout(() => setShowCookieBanner(true), 1500);
      }
    } catch (error) {
      console.warn('Could not access localStorage for cookie consent.', error);
      // If we can't check, assume no consent and show banner
      timer = setTimeout(() => setShowCookieBanner(true), 1500);
    }
    return () => clearTimeout(timer);
  }, []);
  
  // Effect to load local history for FREE users upon login
  useEffect(() => {
    if (user && userPlan === 'FREE') {
      try {
        const savedHistoryRaw = localStorage.getItem('freeAuditHistory');
        if (savedHistoryRaw) {
          // Rehydrate Date objects from JSON strings
          const savedHistory = JSON.parse(savedHistoryRaw).map((entry: AuditHistoryEntry) => ({
            ...entry,
            date: new Date(entry.date),
          }));
          setAuditHistory(savedHistory);
        } else {
          setAuditHistory([]); // No history found, start with empty
        }
      } catch (error) {
        console.warn('Could not load free audit history from localStorage.', error);
        setAuditHistory([]);
      }
    }
    // For Premium users, history remains session-based.
    // When a user logs out, history is cleared by handleLogout.
  }, [user, userPlan]);

  const handleAcceptCookies = () => {
    try {
      localStorage.setItem('cookie_consent', 'true');
    } catch (error) {
      console.warn('Could not set cookie consent in localStorage.', error);
    }
    setShowCookieBanner(false);
  };

  const handleLoginSuccess = async (profile: UserProfile) => {
    setIsLoggingIn(true);
    setUser(profile);
    // User starts on FREE plan. The useEffect above will handle loading their local history.
    setUserPlan('FREE'); 
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setUser(null);
    setUserPlan('FREE');
    setAuditHistory([]);
  };

  const handleLoginError = () => {
    console.error("Google login failed.");
    setIsLoggingIn(false); // Ensure loading state is reset on error
  };

  const handleViewHistory = (entry: AuditHistoryEntry) => {
    setUrl(entry.url);
    setResults(entry.results);
    setError(null);
    setIsLoading(false);
    // Update URL to reflect the viewed history item
    const newPath = `/analyze?url=${encodeURIComponent(entry.url)}`;
    window.history.pushState({ path: newPath }, `SEO Audit for ${entry.url}`, newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteHistoryEntry = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this history entry? This action cannot be undone.')) {
        return;
    }

    setAuditHistory(prevHistory => {
        const updatedHistory = prevHistory.filter(entry => entry.id !== id);
        
        if (userPlan === 'FREE' && user) {
            try {
                localStorage.setItem('freeAuditHistory', JSON.stringify(updatedHistory));
            } catch (e) {
                console.warn('Failed to update audit history in local storage after deletion.', e);
            }
        }
        
        return updatedHistory;
    });
  };

  const handleClearHistory = () => {
    if (!window.confirm('Are you sure you want to clear your entire audit history? This action cannot be undone.')) {
        return;
    }

    setAuditHistory([]);

    if (userPlan === 'FREE' && user) {
        try {
            localStorage.removeItem('freeAuditHistory');
        } catch (e) {
            console.warn('Failed to clear audit history from local storage.', e);
        }
    }
  };


  const handleNavigate = (targetView: View, e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (targetView === 'main' || targetView === 'analyze') {
        setResults(null);
        setError(null);
        setUrl('');
        setIsLoading(false);
        setStatusMessage('');
        resetMetaTags();
    }
    setView(targetView);

    try {
      const path = targetView === 'main' ? '/' : `/${targetView}`;
      const currentFullPath = window.location.pathname + window.location.search;
      if (currentFullPath !== path) {
        window.history.pushState({}, '', path);
      }
    } catch (error) {
      console.warn("Could not update browser history, but navigation will proceed.", error);
    }
    
    window.scrollTo(0, 0);
  };

  const handleLandingPageAnalysis = (targetUrl: string) => {
    handleNavigate('analyze');
    if (targetUrl && targetUrl.trim()) {
      handleAnalysis(targetUrl);
    }
  };

  const handleUpgrade = async (priceId: string) => {
    if (!user) {
        alert("Please log in to upgrade to Premium.");
        return;
    }
    setIsUpgrading(true);
    try {
        const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        if (!stripe) {
            throw new Error('Stripe.js has not loaded yet.');
        }

        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            successUrl: `${window.location.origin}/pricing?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/pricing?canceled=true`,
            customerEmail: user.email,
        });

        if (error) {
            console.error('Stripe checkout error:', error);
            setError(`Payment failed: ${error.message}`);
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred during checkout.';
        setError(message);
    } finally {
        setIsUpgrading(false);
    }
  };
  
  const renderView = () => {
    switch (view) {
      case 'about':
        return <About />;
      case 'pricing':
        return <Pricing onNavigate={(e) => handleNavigate('analyze', e)} onUpgradeClick={handleUpgrade} isUpgrading={isUpgrading} userPlan={userPlan} />;
      case 'faq':
        return <FAQ />;
      case 'analyze':
        return (
          <section aria-labelledby="analyze-heading">
            <h1 id="analyze-heading" className="text-3xl sm:text-4xl font-bold text-center text-slate-800 mb-2">SEO Audit & Sitemap Tool</h1>
            <p className="text-center text-slate-500 mb-8 max-w-2xl mx-auto">Enter any website URL to get an instant on-page SEO analysis and generate a free XML sitemap.</p>
            <div className="bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 p-6 sm:p-8">
              <SeoInputForm 
                initialUrl={url}
                onSubmit={handleAnalysis} 
                isLoading={isLoading} 
                isLimitReached={isLimitReached}
                sitemapUrl={sitemapBlobUrl}
              />
              
              {isLimitReached && userPlan === 'FREE' && !isLoading && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-center text-sm">
                  You've used your {FREE_PLAN_DAILY_LIMIT} free audits for today. <a href="/pricing" onClick={(e) => handleNavigate('pricing', e)} className="font-bold underline hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded">Upgrade to Premium</a> for unlimited analyses.
                </div>
              )}
              
              {user && !isLoading && !results && (
                <>
                  <AuditHistory 
                    history={auditHistory} 
                    onViewHistory={handleViewHistory} 
                    onDeleteEntry={handleDeleteHistoryEntry}
                    onClearHistory={handleClearHistory}
                  />
                  {userPlan === 'FREE' && auditHistory.length >= FREE_PLAN_HISTORY_LIMIT && (
                      <div className="mt-4 p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-center text-sm animate-fade-in">
                          You've reached your local history limit of {FREE_PLAN_HISTORY_LIMIT} audits.{' '}
                          <a href="/pricing" onClick={(e) => handleNavigate('pricing', e)} className="font-bold underline hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded">
                              Upgrade to Premium
                          </a>
                          {' '}for unlimited cloud-saved history.
                      </div>
                  )}
                </>
              )}
            </div>
            {isLoading && <StatusDisplay message={statusMessage} />}
            
            {error && (
              <div className="mt-8 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-center animate-fade-in" role="alert">
                  <p className="font-bold">An Error Occurred</p>
                  <p>{error}</p>
              </div>
            )}
            
            {results && !isLoading && (
              <ResultsDisplay 
                results={results}
                url={url}
                isLoading={isLoading}
                statusMessage={statusMessage}
                userPlan={userPlan}
                onUpgradeClick={(e) => handleNavigate('pricing', e)}
                sitemapBlobUrl={sitemapBlobUrl}
              />
            )}
          </section>
        );
      case 'main':
      default:
        return <LandingPage onAnalyze={handleLandingPageAnalysis} onNavigate={(e) => handleNavigate('analyze', e)} />;
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="py-4 sticky top-0 bg-slate-50/80 backdrop-blur-lg z-20 border-b border-slate-900/5">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
                <a href="/" onClick={(e) => handleNavigate('main', e)} className="flex items-center gap-2 flex-shrink-0" aria-label="IndexFlow Home">
                    <LogoIcon />
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">IndexFlow</h1>
                        <p className="text-sm text-slate-500 hidden sm:block">SEO Audit & Sitemap Tool</p>
                    </div>
                </a>
                <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
                    <a href="/about" onClick={(e) => handleNavigate('about', e)} className={`flex items-center gap-1.5 transition-colors hover:text-sky-600 ${view === 'about' ? 'text-sky-600' : 'text-slate-700'}`}>
                        <MenuAboutIcon />
                        <span>About</span>
                    </a>
                    <a href="/pricing" onClick={(e) => handleNavigate('pricing', e)} className={`flex items-center gap-1.5 transition-colors hover:text-sky-600 ${view === 'pricing' ? 'text-sky-600' : 'text-slate-700'}`}>
                        <MenuPricingIcon />
                        <span>Pricing</span>
                    </a>
                    <a href="/faq" onClick={(e) => handleNavigate('faq', e)} className={`flex items-center gap-1.5 transition-colors hover:text-sky-600 ${view === 'faq' ? 'text-sky-600' : 'text-slate-700'}`}>
                        <MenuFAQIcon />
                        <span>FAQ</span>
                    </a>
                </nav>
                <div className="flex items-center gap-4 ml-auto">
                    <a
                        href="/analyze"
                        onClick={(e) => handleNavigate('analyze', e)}
                        className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-all duration-300"
                    >
                        Start Analysis
                    </a>
                    {user ? (
                        <UserProfileDisplay user={user} onLogout={handleLogout} userPlan={userPlan} />
                    ) : (
                        <LoginButton onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} isLoading={isLoggingIn} />
                    )}
                </div>
            </div>
        </header>

        <main className="flex-grow py-8 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderView()}
            </div>
        </main>

        <footer className="py-8 bg-slate-100 text-center text-sm text-slate-500">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <p>&copy; {new Date().getFullYear()} IndexFlow. All rights reserved. Design by <a href="https://ativ.ai" target="_blank" rel="noopener noreferrer" className="font-medium text-sky-600 hover:text-sky-800 hover:underline">Ativ.ai</a>.</p>
            </div>
        </footer>
      </div>
      {showCookieBanner && <CookieBanner onAccept={handleAcceptCookies} />}
      
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            
      <button
          onClick={() => setIsChatOpen(prev => !prev)}
          className="fixed bottom-4 right-4 sm:right-6 z-20 w-14 h-14 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          aria-label="Toggle AI Assistant"
      >
          <ChatIcon />
      </button>
    </>
  );
};

export default App;



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

const getViewFromHash = (hash: string): View => {
  const path = hash.substring(1); // remove '#'
  if (path.startsWith('/about')) return 'about';
  if (path.startsWith('/pricing')) return 'pricing';
  if (path.startsWith('/faq')) return 'faq';
  if (path.startsWith('/analyze')) return 'analyze';
  return 'main';
};

const getUrlFromHash = (hash: string): string | null => {
    const path = hash.substring(1); // remove '#'
    if (path.startsWith('/analyze')) {
        const queryParams = new URLSearchParams(path.split('?')[1] || '');
        return queryParams.get('url');
    }
    return null;
}

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [results, setResults] = useState<SeoResults | null>(null);
  const [sitemapBlobUrl, setSitemapBlobUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>(getViewFromHash(window.location.hash));
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
    setView('analyze'); // Ensure view is set correctly when analysis starts

    try {
      setStatusMessage('AI is analyzing your URL...');
      
      const seoData = await analyzeUrl(targetUrl, userPlan);
      
      setStatusMessage('Analysis complete!');
      await new Promise(res => setTimeout(res, 500)); // Short delay for smooth UI transition
      
      setResults(seoData);

      // Update URL to be shareable using hash routing
      const newPath = `/analyze?url=${encodeURIComponent(targetUrl)}`;
      if (window.location.hash !== `#${newPath}`) {
        window.location.hash = newPath;
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
      const newView = getViewFromHash(window.location.hash);
      const urlFromQuery = getUrlFromHash(window.location.hash);

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
          // Added check to prevent re-running analysis if results for the same URL are already displayed.
          if (urlFromQuery !== url || !results) {
            handleAnalysis(urlFromQuery);
          }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [resetMetaTags, handleAnalysis, url, results]);
  
  // Handle initial load with a URL parameter in the hash
  useEffect(() => {
    const urlFromQuery = getUrlFromHash(window.location.hash);

    if (getViewFromHash(window.location.hash) === 'analyze' && urlFromQuery) {
        handleAnalysis(urlFromQuery);
    }
  }, [handleAnalysis]);

  // Handle sitemap generation when results are available
  useEffect(() => {
    if (results?.sitemapXml) {
      const blob = new Blob([results.sitemapXml], { type: 'application/xml' });
      const blobUrl = URL.createObjectURL(blob);
      setSitemapBlobUrl(blobUrl);

      return () => URL.revokeObjectURL(blobUrl);
    }
  }, [results]);

  const handleLoginSuccess = async (profile: UserProfile) => {
      setIsLoggingIn(true);
      setUser(profile);
      // Simulate fetching user plan and history from a backend
      // In a real app, you would make an API call here.
      await new Promise(res => setTimeout(res, 500)); 
      
      // For demonstration, we'll check for a mock premium user status.
      if (profile.email.endsWith('@premium-user.com')) {
          setUserPlan('Premium');
          // Fetch cloud history for premium users
          // setAuditHistory(await fetchCloudHistory(profile.id));
      } else {
          setUserPlan('FREE');
          // Load free user history from local storage
          try {
            const storedHistory = localStorage.getItem('freeAuditHistory');
            if (storedHistory) {
                const parsedHistory = JSON.parse(storedHistory).map((item: any) => ({
                    ...item,
                    date: new Date(item.date), // Ensure date is a Date object
                }));
                setAuditHistory(parsedHistory);
            }
          } catch (e) {
            console.warn('Could not load free audit history from local storage.', e);
          }
      }
      setIsLoggingIn(false);
  };
  
  const handleLoginError = () => {
      setError('Google login failed. Please try again.');
      setIsLoggingIn(false);
  };
  
  const handleLogout = () => {
      setUser(null);
      setUserPlan('FREE');
      setAuditHistory([]);
      // We don't clear free user audit limit on logout, as it's device-based.
  };

  const handleNavigate = (newView: View, e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e?.preventDefault();
    const newPath = `/${newView}`;
    
    if (window.location.hash !== `#${newPath}`) {
        window.location.hash = newPath;
    } else {
        // If we are already on the view, just update the state if needed
        // This is important for cases like clicking the logo to go home
        setView(newView);
    }

    if (newView !== 'analyze') {
      setResults(null);
      setError(null);
      setUrl('');
      resetMetaTags();
    }
  };
  
  const handleViewHistory = (entry: AuditHistoryEntry) => {
    setUrl(entry.url);
    setResults(entry.results);
    const newPath = `/analyze?url=${encodeURIComponent(entry.url)}`;
    if (window.location.hash !== `#${newPath}`) {
        window.location.hash = newPath;
    } else {
        setView('analyze');
    }
  };

  const handleDeleteHistoryEntry = (id: string) => {
    setAuditHistory(prev => prev.filter(entry => entry.id !== id));
    // Also update local storage if it's a free user
    if (userPlan === 'FREE') {
        try {
            const updatedHistory = auditHistory.filter(entry => entry.id !== id);
            localStorage.setItem('freeAuditHistory', JSON.stringify(updatedHistory));
        } catch (e) {
            console.warn('Could not update history in localStorage.', e);
        }
    }
  };
  
  const handleClearHistory = () => {
      setAuditHistory([]);
      if (userPlan === 'FREE') {
          try {
            localStorage.removeItem('freeAuditHistory');
          } catch(e) {
            console.warn('Could not clear history from localStorage.', e);
          }
      }
  };

  // Check cookie consent status
  useEffect(() => {
      try {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setShowCookieBanner(true);
        }
      } catch (e) {
        console.warn('Could not access localStorage for cookie consent.', e);
      }
  }, []);

  const handleAcceptCookies = () => {
      try {
        localStorage.setItem('cookieConsent', 'true');
      } catch (e) {
        console.warn('Could not save cookie consent to localStorage.', e);
      }
      setShowCookieBanner(false);
  };

  // Initialize Stripe and check for daily limit on mount
  useEffect(() => {
    if (typeof Stripe === 'undefined') {
        console.warn('Stripe.js has not loaded. Checkout will not be available.');
    }
    
    // Check daily audit limit for free users
    if (userPlan === 'FREE') {
      try {
        const auditTrackerRaw = localStorage.getItem('freeAuditTracker');
        if (auditTrackerRaw) {
            const auditTracker = JSON.parse(auditTrackerRaw);
            const today = new Date().toISOString().split('T')[0];
            if (auditTracker.date === today && auditTracker.count >= FREE_PLAN_DAILY_LIMIT) {
                setIsLimitReached(true);
            }
        }
      } catch (e) {
        console.warn('Could not read audit tracker from localStorage.', e);
      }
    } else {
        setIsLimitReached(false);
    }
  }, [userPlan]);
  
  const handleUpgradeClick = async (priceId: string) => {
    if (!user) {
        setError("Please log in to upgrade your plan.");
        return;
    }
    
    setIsUpgrading(true);
    const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
    
    // In a real application, you would create a checkout session on your backend.
    // For this demo, we are using a mock checkout flow.
    try {
        // Here you would typically call your backend:
        // const { sessionId } = await fetch('/create-checkout-session', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ priceId: priceId, customerEmail: user.email }),
        // }).then(res => res.json());

        // MOCK: Simulate success and upgrade user plan after a delay
        await new Promise(res => setTimeout(res, 2000));
        setUserPlan('Premium');
        setAuditHistory([]); // Clear local history as cloud history would be used
        console.log("User plan upgraded to Premium.");
        
        // This would be the actual Stripe redirect:
        // const { error } = await stripe.redirectToCheckout({ sessionId });
        // if (error) {
        //   setError(error.message);
        // }
    } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Upgrade failed: ${message}`);
    } finally {
        setIsUpgrading(false);
    }
  };

  const renderView = () => {
    switch (view) {
      case 'about':
        return <About />;
      case 'pricing':
        return <Pricing onNavigate={(e) => handleNavigate('analyze', e)} onUpgradeClick={handleUpgradeClick} isUpgrading={isUpgrading} userPlan={userPlan} />;
      case 'faq':
        return <FAQ />;
      case 'analyze':
      case 'main':
      default:
        // If results exist, show them regardless of whether the view is 'main' or 'analyze'
        if (results) {
             return <ResultsDisplay results={results} url={url} isLoading={isLoading} statusMessage={statusMessage} userPlan={userPlan} onUpgradeClick={(e) => handleNavigate('pricing', e)} sitemapBlobUrl={sitemapBlobUrl} />;
        }
        // If loading, show status.
        if (isLoading) {
            return <StatusDisplay message={statusMessage} />
        }
        // Otherwise, show the landing page/input form
        return <LandingPage onAnalyze={handleAnalysis} onNavigate={(e) => handleNavigate('analyze', e)} />;
    }
  };
  
  const urlFromHash = getUrlFromHash(window.location.hash);


  return (
    <div className="min-h-screen flex flex-col font-sans">
        <header className="p-4 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-200/80">
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
                <a href="#/main" onClick={(e) => {
                    e.preventDefault();
                    const newHash = '#/main';
                    if (window.location.hash !== newHash) {
                        window.location.hash = newHash;
                    } else {
                        setView('main');
                        setResults(null);
                        setError(null);
                        setUrl('');
                        resetMetaTags();
                    }
                }} className="flex items-center gap-2">
                    <LogoIcon />
                    <span className="text-xl font-bold text-slate-800">IndexFlow</span>
                </a>
                <div className="hidden md:flex items-center gap-6">
                    <a href="#/analyze" onClick={(e) => handleNavigate('analyze', e)} className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 font-medium transition-colors"><AnalyzeIcon /> Analyze</a>
                    <a href="#/about" onClick={(e) => handleNavigate('about', e)} className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 font-medium transition-colors"><MenuAboutIcon /> About</a>
                    <a href="#/pricing" onClick={(e) => handleNavigate('pricing', e)} className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 font-medium transition-colors"><MenuPricingIcon /> Pricing</a>
                    <a href="#/faq" onClick={(e) => handleNavigate('faq', e)} className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 font-medium transition-colors"><MenuFAQIcon /> FAQ</a>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <UserProfileDisplay user={user} onLogout={handleLogout} userPlan={userPlan} />
                    ) : (
                        <LoginButton onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} isLoading={isLoggingIn} />
                    )}
                </div>
            </nav>
        </header>

        <main className={`flex-grow p-4 sm:p-6 md:p-8 ${view === 'main' && !results && !isLoading ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <div className="max-w-7xl mx-auto">
                 {view !== 'main' && (
                  <div className="max-w-4xl mx-auto">
                    {/* Render the SEO input form on top of other pages, but not on the landing page */}
                    <SeoInputForm onSubmit={handleAnalysis} initialUrl={urlFromHash || url} isLoading={isLoading} isLimitReached={isLimitReached} sitemapUrl={sitemapBlobUrl} />
                    {error && <div className="mt-4 p-4 bg-red-100 text-red-800 border border-red-200 rounded-lg animate-fade-in" role="alert">{error}</div>}
                    {isLimitReached && userPlan === 'FREE' && (
                      <div className="mt-4 p-4 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg animate-fade-in" role="alert">
                          You've reached your daily free limit. <button onClick={(e) => handleNavigate('pricing', e)} className="font-bold underline hover:text-amber-900">Upgrade to Premium</button> for unlimited analyses.
                      </div>
                    )}
                  </div>
                 )}
                 <div className={`${view !== 'main' ? 'mt-8 max-w-4xl mx-auto' : ''}`}>
                    {renderView()}
                 </div>
                 {user && view !== 'main' && view !== 'analyze' && (
                  <div className="mt-8 max-w-4xl mx-auto">
                    <AuditHistory 
                        history={auditHistory} 
                        onViewHistory={handleViewHistory} 
                        onDeleteEntry={handleDeleteHistoryEntry}
                        onClearHistory={handleClearHistory}
                    />
                  </div>
                 )}
            </div>
        </main>
        
        <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-4 right-4 sm:right-6 z-20 w-14 h-14 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transform hover:scale-105 transition-all duration-300"
            aria-label="Toggle AI Assistant Chat"
        >
            <ChatIcon />
        </button>

        <footer className="bg-slate-800 text-slate-400 text-sm p-4 text-center">
            <p>&copy; {new Date().getFullYear()} IndexFlow. All Rights Reserved. Built with Gemini.</p>
        </footer>

        {showCookieBanner && <CookieBanner onAccept={handleAcceptCookies} />}
    </div>
  );
};

export default App;

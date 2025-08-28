

import React, { useState, useCallback, useEffect } from 'react';
import { SeoResults, UserProfile, AuditHistoryEntry } from './types';
import { analyzeUrl } from './services/seoService';
import SeoInputForm from './components/SeoInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import About from './components/About';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ'; // Import the new FAQ component
import LoginButton from './components/LoginButton';
import UserProfileDisplay from './components/UserProfile';
import AuditHistory from './components/AuditHistory';
import CookieBanner from './components/CookieBanner';
import ProFeatureTeaser from './components/ProFeatureTeaser';
import { LogoIcon, HistoryIcon } from './components/Icons';

declare const Stripe: any; // Declare Stripe as a global variable from the script tag

type View = 'main' | 'about' | 'pricing' | 'faq'; // Add 'faq' to the view types

const FREE_PLAN_DAILY_LIMIT = 3;

// NOTE: In a real application, this key should be stored in an environment variable.
const STRIPE_PUBLISHABLE_KEY = 'pk_test_TYooMQauvdEDq54NiTphI7jx'; 
const PRO_PLAN_PRICE_ID = 'price_1S1CMuDvGAbJzCKmnJ5fxRAX';

const getViewFromPath = (path: string): View => {
  if (path === '/about') return 'about';
  if (path === '/pricing') return 'pricing';
  if (path === '/faq') return 'faq'; // Handle the new FAQ path
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
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);

  useEffect(() => {
    const handlePopState = () => {
      const newView = getViewFromPath(window.location.pathname);
      // When navigating back to the main page via browser history (e.g., using the "Back" button),
      // reset the state to ensure a clean slate, matching the behavior of clicking the home link.
      if (newView === 'main') {
        setResults(null);
        setError(null);
        setUrl('');
        setIsLoading(false);
        setStatusMessage('');
      }
      setView(newView);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handle redirect from Stripe Checkout
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get("session_id");
    const canceled = query.get("canceled");

    if (sessionId) {
        alert("Upgrade successful! Welcome to PRO.");
        // In a real app, we'd verify the session with the backend.
        // For this demo, we'll just update the client-side state.
        setUserPlan('PRO');
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
    // User starts on FREE plan after login, can upgrade later.
    setUserPlan('FREE'); 
    
    // Simulate fetching *potential* previous history for a user.
    // In a real app, this would be a fetch call to your backend.
    // For this demo, we'll clear history on login to show the PRO teaser.
    setAuditHistory([]);
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

  const handleAnalysis = useCallback(async (targetUrl: string) => {
    if (isLimitReached) {
      setError(`You have reached your daily limit of ${FREE_PLAN_DAILY_LIMIT} audits on the FREE plan. Please upgrade to PRO for unlimited analyses.`);
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
        // FREE user: update the limit for today
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

  const handleViewHistory = (entry: AuditHistoryEntry) => {
    setUrl(entry.url);
    setResults(entry.results);
    setError(null);
    setIsLoading(false);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };
  
  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetView: View) => {
    e.preventDefault();

    // The primary navigation logic is updating the React state.
    if (targetView === 'main') {
        // Reset state when navigating home
        setResults(null);
        setError(null);
        setUrl('');
        setIsLoading(false);
        setStatusMessage('');
    }
    setView(targetView);

    // The secondary logic is to update the browser URL for a better UX.
    // This is wrapped in a try/catch because it can fail in sandboxed
    // environments (like iframes), but the app should not crash.
    try {
      const path = targetView === 'main' ? '/' : `/${targetView}`;
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    } catch (error) {
      console.warn("Could not update browser history, but navigation will proceed.", error);
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
        alert("Please log in to upgrade to PRO.");
        return;
    }
    setIsUpgrading(true);
    try {
        const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        if (!stripe) {
            throw new Error('Stripe.js has not loaded yet.');
        }

        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: PRO_PLAN_PRICE_ID, quantity: 1 }],
            mode: 'subscription',
            successUrl: `${window.location.origin}${window.location.pathname.replace('pricing', '')}?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}${window.location.pathname}?canceled=true`,
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
        return <Pricing onNavigate={(e) => handleNavigate(e, 'main')} onUpgradeClick={handleUpgrade} isUpgrading={isUpgrading} />;
      case 'faq':
        return <FAQ />; // Render the FAQ component
      case 'main':
      default:
        return (
          <section aria-labelledby="main-heading">
            <div className="bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 p-6 sm:p-8">
              <SeoInputForm onSubmit={handleAnalysis} isLoading={isLoading} isLimitReached={isLimitReached} />
              
              {isLimitReached && userPlan === 'FREE' && !isLoading && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-center text-sm">
                  You've used your {FREE_PLAN_DAILY_LIMIT} free audits for today. <a href="/pricing" onClick={(e) => handleNavigate(e, 'pricing')} className="font-bold underline hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded">Upgrade to PRO</a> for unlimited analyses.
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
                  onUpgradeClick={(e) => handleNavigate(e, 'pricing')}
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
                  onUpgradeClick={(e) => handleNavigate(e, 'pricing')}
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
              <a 
                href="/faq"
                onClick={(e) => handleNavigate(e, 'faq')} 
                className="font-medium text-sky-600 hover:text-sky-800 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
              >
                FAQ
              </a>
            {user ? (
              <UserProfileDisplay user={user} onLogout={handleLogout} />
            ) : (
              <LoginButton onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} isLoading={isLoggingIn} />
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
              &copy; {new Date().getFullYear()} IndexFlow.
            </p>
        </footer>
      </div>
      {showCookieBanner && <CookieBanner onAccept={handleAcceptCookies} />}
    </div>
  );
};

export default App;
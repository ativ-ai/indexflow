import React, { useEffect } from 'react';
import { CheckIcon, TokenIcon } from './Icons';

interface PricingProps {
    onNavigate: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onUpgradeClick: () => void;
    isUpgrading: boolean;
    userPlan: 'FREE' | 'PRO';
}

const Feature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center gap-3">
        <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckIcon />
        </div>
        <span className="text-slate-700">{children}</span>
    </li>
);

const Pricing: React.FC<PricingProps> = ({ onNavigate, onUpgradeClick, isUpgrading, userPlan }) => {
  useEffect(() => {
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription ? metaDescription.getAttribute('content') : null;
    const canonicalLink = document.querySelector("link[rel='canonical']");
    const originalCanonicalHref = canonicalLink ? canonicalLink.getAttribute('href') : null;


    // Set page-specific meta tags
    document.title = 'Pricing Plans | IndexFlow SEO Audit Tool';
    if (metaDescription) {
      metaDescription.setAttribute('content', "Choose the best plan. Compare IndexFlow's Free & PRO plans for SEO audits and sitemap generation.");
    }
    if (canonicalLink) {
        canonicalLink.setAttribute('href', 'https://indexflow.app/pricing');
    }
    
    const scriptId = 'pro-plan-schema';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const proPlanSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "IndexFlow PRO",
      "description": "The PRO plan for professionals who need deeper SEO insights, unlimited analyses, and audit history tracking.",
      "sku": "INDEXFLOW-PRO-MONTHLY",
      "brand": {
        "@type": "Brand",
        "name": "IndexFlow"
      },
      "offers": {
        "@type": "Offer",
        "price": "4.70",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://indexflow.app/pricing"
      },
      "positiveNotes": {
        "@type": "ItemList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "AI Meta Tag Generator" },
          { "@type": "ListItem", "position": 2, "name": "Internal Link Optimization" },
          { "@type": "ListItem", "position": 3, "name": "Core Web Vitals Analysis" },
          { "@type": "ListItem", "position": 4, "name": "Structured Data (Schema) Check" },
          { "@type": "ListItem", "position": 5, "name": "Image Alt, OG & Canonical Tags" },
          { "@type": "ListItem", "position": 6, "name": "Broken Link & Redirect Chain Checks" },
          { "@type": "ListItem", "position": 7, "name": "Facebook Pixel & Favicon Checks" },
          { "@type": "ListItem", "position": 8, "name": "Unlimited Audits" },
          { "@type": "ListItem", "position": 9, "name": "Cloud Audit History" }
        ]
      }
    };
    
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(proPlanSchema);
    document.head.appendChild(script);

    const breadcrumbScriptId = 'breadcrumb-schema';
    document.getElementById(breadcrumbScriptId)?.remove();
    // Add breadcrumb schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://indexflow.app/"
      }, {
        "@type": "ListItem",
        "position": 2,
        "name": "Pricing",
        "item": "https://indexflow.app/pricing"
      }]
    };
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.id = breadcrumbScriptId;
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.title = originalTitle;
      if (metaDescription && originalDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
      if (canonicalLink && originalCanonicalHref) {
        canonicalLink.setAttribute('href', originalCanonicalHref);
      }
      document.getElementById(scriptId)?.remove();
      document.getElementById(breadcrumbScriptId)?.remove();
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 p-6 sm:p-8 animate-fade-in">
        <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">
                Find the Perfect Plan
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-2">
                Start for free and upgrade to unlock powerful features that will take your SEO to the next level.
            </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="border border-slate-200 rounded-xl p-8 flex flex-col">
                <h3 className="text-2xl font-bold text-slate-800">Free</h3>
                <p className="mt-2 text-slate-500">For individuals and hobbyists getting started with SEO.</p>
                <div className="mt-6">
                    <span className="text-4xl font-extrabold">$0</span>
                    <span className="text-lg font-medium text-slate-500">/month</span>
                </div>
                <button
                    onClick={onNavigate}
                    className="mt-6 w-full text-center px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all"
                >
                    Get Started
                </button>
                <ul className="mt-8 space-y-4 text-sm flex-grow">
                    <Feature>Basic SEO Audit</Feature>
                    <Feature>H2 &amp; H3 Tag Analysis</Feature>
                    <Feature>Sitemap Generation</Feature>
                    <Feature>Internal Link Discovery</Feature>
                    <Feature>3 Audits per Day</Feature>
                    <Feature>Local Audit History (5 entries)</Feature>
                </ul>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-amber-400 rounded-xl p-8 flex flex-col relative ring-4 ring-amber-400/20">
                <div className="flex items-center gap-3">
                  <TokenIcon className="w-8 h-8 text-amber-500" />
                  <h3 className="text-2xl font-bold text-slate-800">PRO</h3>
                </div>
                <p className="mt-2 text-slate-500">For professionals who need to dive deeper into their SEO.</p>
                <div className="mt-6">
                    <span className="text-4xl font-extrabold">$4.70</span>
                    <span className="text-lg font-medium text-slate-500">/month</span>
                </div>
                <div className="relative group mt-6">
                    <button
                        onClick={onUpgradeClick}
                        disabled={isUpgrading || userPlan === 'PRO'}
                        className={`w-full text-center px-6 py-3 font-semibold rounded-lg shadow-md transition-all text-white
                            ${userPlan === 'PRO'
                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:from-amber-400 disabled:to-orange-500 disabled:cursor-wait disabled:opacity-80'
                            }
                        `}
                        aria-describedby={userPlan === 'PRO' ? 'pro-tooltip' : undefined}
                    >
                        {userPlan === 'PRO' ? "You're on PRO" : isUpgrading ? 'Redirecting...' : 'Upgrade to PRO'}
                    </button>
                    {userPlan === 'PRO' && (
                        <span
                            id="pro-tooltip"
                            role="tooltip"
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 text-sm font-light text-white bg-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 pointer-events-none"
                        >
                            You are already subscribed to the PRO plan.
                        </span>
                    )}
                </div>
                <ul className="mt-8 space-y-4 text-sm flex-grow">
                    <Feature><strong>Everything in Free, plus:</strong></Feature>
                    <Feature>AI Meta Tag Generator</Feature>
                    <Feature>Internal Link Optimization</Feature>
                    <Feature>Core Web Vitals Analysis</Feature>
                    <Feature>Structured Data (Schema) Check</Feature>
                    <Feature>Image Alt, OG & Canonical Tags</Feature>
                    <Feature>Broken Link & Redirect Chain Checks</Feature>
                    <Feature>Facebook Pixel & Favicon Checks</Feature>
                    <Feature>Unlimited Audits &amp; Cloud History</Feature>
                </ul>
            </div>
        </div>
    </div>
  );
};

export default Pricing;
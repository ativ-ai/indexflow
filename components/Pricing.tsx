





import React, { useEffect } from 'react';
import { CheckIcon, TokenIcon } from './Icons';

interface PricingProps {
    onNavigate: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onUpgradeClick: () => void;
    isUpgrading: boolean;
}

const Feature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center gap-3">
        <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckIcon />
        </div>
        <span className="text-slate-700">{children}</span>
    </li>
);

const Pricing: React.FC<PricingProps> = ({ onNavigate, onUpgradeClick, isUpgrading }) => {
  useEffect(() => {
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
          { "@type": "ListItem", "position": 1, "name": "Image Alt Tag Analysis" },
          { "@type": "ListItem", "position": 2, "name": "Open Graph Tag Check" },
          { "@type": "ListItem", "position": 3, "name": "Mobile-Friendliness Check" },
          { "@type": "ListItem", "position": 4, "name": "Unlimited Audits" },
          { "@type": "ListItem", "position": 5, "name": "Audit History" }
        ]
      }
    };
    
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(proPlanSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
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

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
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
                    <Feature>Sitemap Generation</Feature>
                    <Feature>Internal Link Discovery</Feature>
                    <Feature>3 Audits per Day</Feature>
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
                <button
                    onClick={onUpgradeClick}
                    disabled={isUpgrading}
                    className="mt-6 w-full text-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all disabled:from-amber-400 disabled:to-orange-500 disabled:cursor-wait disabled:opacity-80"
                >
                    {isUpgrading ? 'Redirecting...' : 'Upgrade to PRO'}
                </button>
                <ul className="mt-8 space-y-4 text-sm flex-grow">
                    <Feature><strong>Everything in Free, plus:</strong></Feature>
                    <Feature>Image Alt Tag Analysis</Feature>
                    <Feature>Open Graph Tag Check</Feature>
                    <Feature>Mobile-Friendliness Check</Feature>
                    <Feature>Unlimited Audits</Feature>
                    <Feature>Audit History</Feature>
                </ul>
            </div>
        </div>
    </div>
  );
};

export default Pricing;
import React, { useEffect } from 'react';

const FAQItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
  <div className="py-5">
    <h3 className="text-xl font-bold text-slate-800 mb-2">{question}</h3>
    <div className="space-y-3 text-slate-600 leading-relaxed">{children}</div>
  </div>
);

const FAQ: React.FC = () => {
    
  useEffect(() => {
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription ? metaDescription.getAttribute('content') : '';

    document.title = 'Frequently Asked Questions | IndexFlow';
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find answers to common questions about IndexFlow, including how our SEO audit works, sitemap generation, plan details, and data privacy.');
    }

    const scriptId = 'faq-schema';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What does the free audit check?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our free audit focuses on the foundational elements that search engines care about most: Status Code (accessibility), Title Tag (length and presence), Meta Description (summary for search results), H1 Tag (main content heading), and Robots.txt (crawler guidance)."
                }
            },
            {
                "@type": "Question",
                "name": "Why is an XML Sitemap important?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "An XML sitemap acts as a roadmap for search engines, listing all the important pages on your website. It helps crawlers like Googlebot find, crawl, and index your content more efficiently, especially for new sites or sites with a complex structure."
                }
            },
            {
                "@type": "Question",
                "name": "Is this tool analyzing my live website?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To provide a fast and free service without running into browser security limits (CORS), this demonstration tool uses high-quality mock data for its analysis. A full-scale version would use a dedicated server to crawl websites in real-time to provide live data."
                }
            },
            {
                "@type": "Question",
                "name": "What is the difference between the Free and PRO plans?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Free plan provides a basic SEO audit and sitemap generation, limited to 3 analyses per day. The PRO plan offers unlimited audits, saves your audit history, and includes more in-depth checks like Image Alt Tags, Open Graph tags for social sharing, and mobile-friendliness tests."
                }
            },
             {
                "@type": "Question",
                "name": "Is my data safe?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. When you log in, we only use your email and name for identification and do not share your data with third parties. All payment processing for the PRO plan is handled securely by Stripe."
                }
            }
        ]
    });
    document.head.appendChild(script);

    return () => {
      document.title = originalTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', originalDescription || '');
      }
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <section aria-labelledby="faq-heading" className="bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 p-6 sm:p-8 animate-fade-in">
      <h2 id="faq-heading" className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">Frequently Asked Questions</h2>
      <div className="divide-y divide-slate-200">
        
        <FAQItem question="What does the free audit check?">
          <p>
            Our free audit focuses on the foundational elements that search engines care about most:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Status Code:</strong> Is your page online and accessible?</li>
            <li><strong>Title Tag:</strong> Is your title present and optimized for length?</li>
            <li><strong>Meta Description:</strong> Does it effectively summarize your page for search results?</li>
            <li><strong>H1 Tag:</strong> Is there a clear main heading for your content?</li>
            <li><strong>Robots.txt:</strong> Is the file that guides search engine crawlers present?</li>
          </ul>
        </FAQItem>

        <FAQItem question="Why is an XML Sitemap important?">
             <p>
              An XML sitemap acts as a roadmap for search engines, listing all the important pages on your website. It helps crawlers like Googlebot find, crawl, and index your content more efficiently, especially for new sites or sites with a complex structure.
            </p>
        </FAQItem>
        
        <FAQItem question="An Important Note on Data">
            <p>
            To provide a fast and free service without running into browser security limits (CORS), this demonstration tool uses high-quality mock data for its analysis. A full-scale version would use a dedicated server to crawl websites in real-time to provide live data.
            </p>
        </FAQItem>

        <FAQItem question="What is the difference between the Free and PRO plans?">
            <p>
                The Free plan is perfect for getting started, offering a basic SEO audit and sitemap generation for up to 3 URLs per day.
            </p>
            <p>
                The <strong>PRO plan</strong> unlocks unlimited audits, saves your full audit history to track progress, and provides deeper insights with additional checks for Image Alt Tags, Open Graph (social media) tags, mobile-friendliness, and canonical tag status.
            </p>
        </FAQItem>

        <FAQItem question="Is my data safe?">
            <p>
                Absolutely. We use Google OAuth for secure login, which means we never see or store your password. We only request basic profile information (name, email, profile picture) to identify you within the app. All payment information is handled directly and securely by Stripe, a certified PCI Level 1 Service Provider.
            </p>
        </FAQItem>

      </div>
    </section>
  );
};

export default FAQ;

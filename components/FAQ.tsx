import React, { useEffect, useMemo, useState } from 'react';
import { SearchIcon } from './Icons';

const FAQItem: React.FC<{ question: string; children: React.ReactNode; questionJsx?: React.ReactNode }> = ({ question, children, questionJsx }) => (
  <div className="py-5">
    <h3 className="text-xl font-bold text-slate-800 mb-2">{questionJsx || question}</h3>
    <div className="space-y-3 text-slate-600 leading-relaxed">{children}</div>
  </div>
);

const faqData = [
  {
    question: "What does the free audit check?",
    answerJsx: (
      <>
        <p>
          Our free audit focuses on the foundational on-page elements that search engines care about most:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>Status Code:</strong> Is your page online and accessible?</li>
          <li><strong>Title Tag:</strong> Is your title present and optimized for length?</li>
          <li><strong>Meta Description:</strong> Does it effectively summarize your page for search results?</li>
          <li><strong>H1, H2 & H3 Tags:</strong> Are your headings structured hierarchically to organize content for readers and search engines?</li>
          <li><strong>Robots.txt:</strong> Is the file that guides search engine crawlers present and correctly configured?</li>
        </ul>
      </>
    ),
    answerText: "Our free audit focuses on the foundational on-page elements that search engines care about most, including: Status Code (Is your page online and accessible?), Title Tag (Is your title present and optimized for length?), Meta Description (Does it effectively summarize your page for search results?), H1, H2 & H3 Tags (Are your headings structured hierarchically to organize content for readers and search engines?), and Robots.txt (Is the file that guides search engine crawlers present and correctly configured?)."
  },
  {
    question: "Why is an XML Sitemap important?",
    answerJsx: (
      <p>
        An XML sitemap acts as a roadmap for search engines, listing all the important pages on your website. It helps crawlers like Googlebot find, crawl, and index your content more efficiently, especially for new sites or sites with a complex structure.
      </p>
    ),
    answerText: "An XML sitemap acts as a roadmap for search engines, listing all the important pages on your website. It helps crawlers like Googlebot find, crawl, and index your content more efficiently, especially for new sites or sites with a complex structure."
  },
  {
    question: "What's included in the generated sitemap?",
    answerJsx: (
      <p>
        The tool generates a standard XML sitemap that includes the URL you entered plus several other plausible internal pages it "discovers" (e.g., /about, /contact, /services). This process also provides you with a list of discovered internal links. You receive a complete, valid sitemap file that you can download, upload to your website's root directory, and submit to search engines.
      </p>
    ),
    answerText: "The tool generates a standard XML sitemap that includes the URL you entered plus several other plausible internal pages it 'discovers' (e.g., /about, /contact, /services). This process also provides you with a list of discovered internal links. You receive a complete, valid sitemap file that you can download, upload to your website's root directory, and submit to search engines."
  },
    {
    question: "What is the 'Internal Link Optimization Analysis' feature?",
    answerJsx: (
      <>
        <p>
          This is a Premium feature that uses AI to analyze your website's internal linking structure. A strong internal linking strategy is vital for SEO as it helps search engines understand the relationship between your pages and distributes authority (or "link equity") throughout your site.
        </p>
        <p className="mt-2">Our analysis provides actionable recommendations, including:</p>
        <ul className="list-disc list-inside space-y-2 pl-4 mt-2">
            <li><strong>Anchor Text Suggestions:</strong> Improving generic anchor text (like "click here") to be more descriptive and keyword-rich.</li>
            <li><strong>Orphaned Page Identification:</strong> Finding pages that aren't linked to from other parts of your site, making them difficult for search engines and users to discover.</li>
            <li><strong>New Linking Opportunities:</strong> Suggesting strategic new links between your pages to boost topical relevance and improve user navigation.</li>
        </ul>
      </>
    ),
    answerText: "This is a Premium feature that uses AI to analyze your website's internal linking structure. A strong internal linking strategy is vital for SEO as it helps search engines understand the relationship between your pages and distributes authority (or 'link equity') throughout your site. Our analysis provides actionable recommendations, including: Anchor Text Suggestions (improving generic anchor text like 'click here' to be more descriptive), Orphaned Page Identification (finding pages that aren't linked to), and New Linking Opportunities (suggesting strategic new links between pages)."
  },
  {
    question: "Is this tool analyzing my live website?",
    answerJsx: (
      <p>
        To provide a fast and free service without running into browser security limits (CORS), this demonstration tool uses high-quality mock data for its analysis. A full-scale version would use a dedicated server to crawl websites in real-time to provide live data.
      </p>
    ),
    answerText: "To provide a fast and free service without running into browser security limits (CORS), this demonstration tool uses high-quality mock data for its analysis. A full-scale version would use a dedicated server to crawl websites in real-time to provide live data."
  },
  {
    question: "What is the difference between the Free and Premium plans?",
    answerJsx: (
      <>
        <p>
            The Free plan is perfect for getting started. It offers a core SEO audit, sitemap generation, and allows for up to 3 analyses per day, with a limited audit history saved to your local device.
        </p>
        <p>
            The <strong>Premium plan</strong> is built for professionals and unlocks a full suite of advanced features:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4 mt-2">
            <li><strong>Unlimited Audits:</strong> Analyze as many URLs as you need.</li>
            <li><strong>Cloud-Saved History:</strong> Keep a complete history of all your audits, accessible from anywhere.</li>
            <li><strong>AI Meta Tag Generator:</strong> Get AI-powered suggestions for your title, description, and keywords.</li>
            <li><strong>Internal Link Optimization Analysis:</strong> Get AI suggestions to improve your site structure and link equity.</li>
            <li><strong>Deeper Audit Checks:</strong>
                <ul className="list-disc list-inside space-y-1 pl-5 mt-1">
                    <li>Image Alt Tags</li>
                    <li>Open Graph (Social Media) Tags</li>
                    <li>Mobile-Friendliness</li>
                    <li>Core Web Vitals</li>
                    <li>Structured Data (Schema) Check</li>
                    <li>Canonical Tag Status</li>
                    <li>Favicon Presence</li>
                    <li>Facebook Pixel</li>
                    <li>Broken Links & Redirect Chains</li>
                </ul>
            </li>
        </ul>
      </>
    ),
    answerText: "The Free plan is perfect for getting started. It offers a core SEO audit, sitemap generation, and allows for up to 3 analyses per day, with a limited audit history saved to your local device. The Premium plan is built for professionals and unlocks a full suite of advanced features, including: Unlimited Audits, Cloud-Saved History, an AI Meta Tag Generator, Internal Link Optimization Analysis to improve site structure, and deeper audit checks for Image Alt Tags, Open Graph (Social Media) Tags, Mobile-Friendliness, Core Web Vitals, Structured Data (Schema) Check, Canonical Tag Status, Favicon Presence, Facebook Pixel, and Broken Links & Redirect Chains."
  },
  {
    question: "What is a Facebook Pixel and why do you check for it?",
    answerJsx: (
        <p>
            The Facebook Pixel is a snippet of code that you place on your website. It allows you to track conversions from Facebook ads, optimize ads, build targeted audiences for future ads, and retarget people who have already taken some kind of action on your website. We check for it as part of our Premium audit because it's a critical tool for any business that uses or plans to use Facebook for marketing.
        </p>
    ),
    answerText: "The Facebook Pixel is a snippet of code that you place on your website. It allows you to track conversions from Facebook ads, optimize ads, build targeted audiences for future ads, and retarget people who have already taken some kind of action on your website. We check for it as part of our Premium audit because it's a critical tool for any business that uses or plans to use Facebook for marketing."
  },
  {
    question: "Is my data safe?",
    answerJsx: (
        <p>
            Absolutely. We use Google OAuth for secure login, which means we never see or store your password. We only request basic profile information (name, email, profile picture) to identify you within the app. All payment information is handled directly and securely by Stripe, a certified PCI Level 1 Service Provider.
        </p>
    ),
    answerText: "Absolutely. We use Google OAuth for secure login, which means we never see or store your password. We only request basic profile information (name, email, profile picture) to identify you within the app. All payment information is handled directly and securely by Stripe, a certified PCI Level 1 Service Provider."
  }
];

const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
    
  useEffect(() => {
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription ? metaDescription.getAttribute('content') : null;
    const canonicalLink = document.querySelector("link[rel='canonical']");
    const originalCanonicalHref = canonicalLink ? canonicalLink.getAttribute('href') : null;

    document.title = 'FAQ - SEO Audit & Sitemap Questions | IndexFlow';
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Got questions about SEO audits, sitemap generation, or how IndexFlow works? Find clear answers to frequently asked questions about our free and Premium plans.');
    }
    if (canonicalLink) {
        canonicalLink.setAttribute('href', 'https://indexflow.app/faq');
    }

    const faqSchemaId = 'faq-schema';
    const breadcrumbSchemaId = 'breadcrumb-schema';

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answerText
            }
        }))
    };
    
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
        "name": "FAQ",
        "item": "https://indexflow.app/faq"
      }]
    };
    
    // Remove existing scripts to prevent duplicates before injecting new ones.
    document.getElementById(faqSchemaId)?.remove();
    document.getElementById(breadcrumbSchemaId)?.remove();

    // Inject FAQ schema
    const faqScript = document.createElement('script');
    faqScript.id = faqSchemaId;
    faqScript.type = 'application/ld+json';
    faqScript.text = JSON.stringify(faqSchema);
    document.head.appendChild(faqScript);
    
    // Inject Breadcrumb schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.id = breadcrumbSchemaId;
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
      document.getElementById(faqSchemaId)?.remove();
      document.getElementById(breadcrumbSchemaId)?.remove();
    };
  }, []);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return text;
    }
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? <mark key={index} className="bg-sky-200/70 text-sky-900 px-0.5 rounded-sm">{part}</mark> : part
    );
  };

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqData;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return faqData.filter(item =>
      item.question.toLowerCase().includes(lowercasedQuery) ||
      item.answerText.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);


  return (
    <section aria-labelledby="faq-heading" className="bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 p-6 sm:p-8 animate-fade-in">
      <h1 id="faq-heading" className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">Frequently Asked Questions</h1>
      
      <div className="relative mb-6 max-w-lg mx-auto">
          <label htmlFor="faq-search" className="sr-only">Search FAQs</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
              <SearchIcon />
          </div>
          <input
              type="search"
              name="search"
              id="faq-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              placeholder="Search FAQs..."
          />
      </div>

      <div className="divide-y divide-slate-200">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, index) => (
            <FAQItem key={index} question={item.question} questionJsx={highlightText(item.question, searchQuery)}>
              {item.answerJsx}
            </FAQItem>
          ))
        ) : (
          <div className="text-center py-10 text-slate-600">
            <h3 className="text-xl font-semibold">No Results Found</h3>
            <p className="mt-2">We couldn't find any FAQs matching your search for "<span className="font-bold">{searchQuery}</span>".</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQ;
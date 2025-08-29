import React, { useEffect } from 'react';

const FAQItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
  <div className="py-5">
    <h3 className="text-xl font-bold text-slate-800 mb-2">{question}</h3>
    <div className="space-y-3 text-slate-600 leading-relaxed">{children}</div>
  </div>
);

const faqData = [
  {
    question: "What does the free audit check?",
    answerJsx: (
      <>
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
      </>
    ),
    answerText: "Our free audit focuses on the foundational elements that search engines care about most, including: Status Code (Is your page online and accessible?), Title Tag (Is your title present and optimized for length?), Meta Description (Does it effectively summarize your page for search results?), H1 Tag (Is there a clear main heading for your content?), and Robots.txt (Is the file that guides search engine crawlers present?)."
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
    question: "Is this tool analyzing my live website?",
    answerJsx: (
      <p>
        To provide a fast and free service without running into browser security limits (CORS), this demonstration tool uses high-quality mock data for its analysis. A full-scale version would use a dedicated server to crawl websites in real-time to provide live data.
      </p>
    ),
    answerText: "To provide a fast and free service without running into browser security limits (CORS), this demonstration tool uses high-quality mock data for its analysis. A full-scale version would use a dedicated server to crawl websites in real-time to provide live data."
  },
  {
    question: "What is the difference between the Free and PRO plans?",
    answerJsx: (
      <>
        <p>
            The Free plan is perfect for getting started, offering a basic SEO audit and sitemap generation for up to 3 URLs per day.
        </p>
        <p>
            The <strong>PRO plan</strong> unlocks unlimited audits, saves your full audit history to track progress, and provides deeper insights with additional checks for Image Alt Tags, Open Graph (social media) tags, mobile-friendliness, and canonical tag status.
        </p>
      </>
    ),
    answerText: "The Free plan is perfect for getting started, offering a basic SEO audit and sitemap generation for up to 3 URLs per day. The PRO plan unlocks unlimited audits, saves your full audit history to track progress, and provides deeper insights with additional checks for Image Alt Tags, Open Graph (social media) tags, mobile-friendliness, and canonical tag status."
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
    
  useEffect(() => {
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription ? metaDescription.getAttribute('content') : '';

    document.title = 'Frequently Asked Questions | IndexFlow';
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find answers to common questions about IndexFlow, including our SEO audit, sitemap generation, plan details, and data privacy.');
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
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answerText
            }
        }))
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
      <h1 id="faq-heading" className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">Frequently Asked Questions</h1>
      <div className="divide-y divide-slate-200">
        {faqData.map((item, index) => (
          <FAQItem key={index} question={item.question}>
            {item.answerJsx}
          </FAQItem>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
import React, { useEffect } from 'react';

const FAQItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
  <div className="py-4">
    <h3 className="text-xl font-bold text-slate-800 mb-2">{question}</h3>
    <div className="space-y-3 text-slate-600 leading-relaxed">{children}</div>
  </div>
);

const About: React.FC = () => {
    
  useEffect(() => {
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription ? metaDescription.getAttribute('content') : '';

    // Set page-specific meta tags
    document.title = 'About IndexFlow | Our Mission & SEO Philosophy';
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about IndexFlow, the free SEO audit and sitemap generation tool. Understand our mission to demystify on-page SEO for everyone.');
    }

    const scriptId = 'faq-schema';
    // Remove existing script if it's there
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
                "name": "What is IndexFlow?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "IndexFlow is a free, simple tool designed to demystify on-page Search Engine Optimization. It allows anyone—from bloggers to business owners—to get a quick, actionable SEO health check and generate a vital XML sitemap for their website."
                }
            },
            {
                "@type": "Question",
                "name": "What does the free audit check?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our free audit focuses on the foundational elements that search engines care about most: Status Code (accessibility), Title Tag (length and presence), Meta Description (summary for search results), H1 Tag (main content heading), Canonical Tag (correct page version), and Robots.txt (crawler guidance)."
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
                "name": "Is this tool really analyzing my live website?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To provide a fast and free service without running into browser security limits (CORS), this demonstration tool uses high-quality mock data for its analysis. A full-scale version would use a dedicated server to crawl websites in real-time to provide live data."
                }
            }
        ]
    });
    document.head.appendChild(script);

    // Cleanup function to remove the script and restore original meta tags
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
    <section aria-labelledby="about-heading" className="bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 p-6 sm:p-8 animate-fade-in">
      <h2 id="about-heading" className="text-3xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">About IndexFlow</h2>
      <div className="divide-y divide-slate-200">
        <FAQItem question="What is IndexFlow?">
          <p>
            IndexFlow is a free, simple tool designed to demystify on-page Search Engine Optimization. It allows anyone—from bloggers to business owners—to get a quick, actionable SEO health check and generate a vital XML sitemap for their website.
          </p>
        </FAQItem>

        <FAQItem question="What does the free audit check?">
          <p>
            Our free audit focuses on the foundational elements that search engines care about most:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Status Code:</strong> Is your page online and accessible?</li>
            <li><strong>Title Tag:</strong> Is your title present and optimized for length?</li>
            <li><strong>Meta Description:</strong> Does it effectively summarize your page for search results?</li>
            <li><strong>H1 Tag:</strong> Is there a clear main heading for your content?</li>
            <li><strong>Canonical Tag:</strong> Are you telling search engines the correct page version to index?</li>
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

        <div className="pt-6">
          <p>
            Have questions or feedback? We'd love to hear from you at <a href="mailto:indexflow@pm.me" className="font-medium text-sky-600 hover:text-sky-800 hover:underline">indexflow@pm.me</a>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
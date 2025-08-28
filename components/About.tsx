import React, { useEffect } from 'react';

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

    // Cleanup function to restore original meta tags
    return () => {
      document.title = originalTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', originalDescription || '');
      }
    };
  }, []);

  return (
    <section aria-labelledby="about-heading" className="bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 p-6 sm:p-8 animate-fade-in">
      <h2 id="about-heading" className="text-3xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">Our Mission</h2>
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <p className="text-lg">
          IndexFlow was born from a simple idea: <strong>SEO shouldn't be a mystery.</strong>
        </p>
        <p>
          We believe that everyone—from small business owners and bloggers to marketing professionals and web developers—deserves access to clear, straightforward tools to improve their website's visibility on search engines. Too often, SEO is presented as a complex, jargon-filled discipline accessible only to experts. We're here to change that.
        </p>
        <p>
          Our goal is to provide an intuitive, instant, and insightful first step into the world of on-page SEO. By focusing on the foundational elements that truly matter, we empower you to make meaningful improvements without needing a technical background.
        </p>
        <p>
          This tool provides a rapid analysis and generates a crucial XML sitemap, serving as your website's roadmap for search engines like Google. It's designed to be the starting point for your SEO journey, giving you the confidence to build a stronger online presence.
        </p>
        <div className="pt-4 border-t border-slate-200">
          <p>
            Have questions or feedback? We'd love to hear from you at <a href="mailto:indexflow@ativ.ai" className="font-medium text-sky-600 hover:text-sky-800 hover:underline">indexflow@ativ.ai</a>.
          </p>
          <p className="mt-4">
            Design by <a href="https://ativ.ai" target="_blank" rel="noopener noreferrer" className="font-medium text-sky-600 hover:text-sky-800 hover:underline">Ativ.ai</a>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
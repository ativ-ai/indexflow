import React, { useEffect } from 'react';
import ContactForm from './ContactForm';

const About: React.FC = () => {
    
  useEffect(() => {
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription ? metaDescription.getAttribute('content') : null;
    const canonicalLink = document.querySelector("link[rel='canonical']");
    const originalCanonicalHref = canonicalLink ? canonicalLink.getAttribute('href') : null;

    // Set page-specific meta tags
    document.title = 'About IndexFlow | Our Mission to Simplify SEO';
    if (metaDescription) {
      metaDescription.setAttribute('content', "Learn about the mission behind IndexFlow. We're dedicated to making on-page SEO accessible for everyone with our free audit and sitemap tool.");
    }
    if (canonicalLink) {
        canonicalLink.setAttribute('href', 'https://indexflow.app/about');
    }

    // Add Breadcrumb schema
    const scriptId = 'breadcrumb-schema';
    document.getElementById(scriptId)?.remove(); // Clean up existing
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
        "name": "About",
        "item": "https://indexflow.app/about"
      }]
    };
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    // Add ContactPage schema
    const contactSchemaId = 'contact-page-schema';
    document.getElementById(contactSchemaId)?.remove(); // Clean up existing
    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact IndexFlow",
        "description": "Get in touch with the IndexFlow team for questions, feedback, or support.",
        "url": "https://indexflow.app/about",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://indexflow.app/about"
        },
        "publisher": {
          "@type": "Organization",
          "name": "IndexFlow",
          "logo": {
            "@type": "ImageObject",
            "url": "https://indexflow.app/favicon.png"
          }
        }
    };
    const contactScript = document.createElement('script');
    contactScript.id = contactSchemaId;
    contactScript.type = 'application/ld+json';
    contactScript.text = JSON.stringify(contactSchema);
    document.head.appendChild(contactScript);


    // Cleanup function to restore original meta tags
    return () => {
      document.title = originalTitle;
      if (metaDescription && originalDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
      if (canonicalLink && originalCanonicalHref) {
        canonicalLink.setAttribute('href', originalCanonicalHref);
      }
      document.getElementById(scriptId)?.remove();
      document.getElementById(contactSchemaId)?.remove();
    };
  }, []);
  
  return (
    <section aria-labelledby="about-heading" className="bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 p-6 sm:p-8 animate-fade-in">
      <h1 id="about-heading" className="text-3xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">Our Mission</h1>
      <div className="space-y-6 text-slate-600 leading-relaxed">
         <p className="text-lg">
            <strong>IndexFlow was born from a simple idea: SEO shouldn't be a mystery.</strong>
        </p>
        <blockquote className="border-l-4 border-sky-200 pl-4 italic text-slate-700">
            <p>
                For entrepreneurs and creators, IndexFlow simplifies SEO. Our free AI tool delivers an instant audit and an XML sitemap, creating a clear action plan to improve your Google ranking and attract more customers.
            </p>
        </blockquote>
        <p>
            We believe that everyone—from small business owners and bloggers to marketing professionals and web developers—deserves access to clear, straightforward tools to improve their website's visibility on search engines. Too often, SEO is presented as a complex, jargon-filled discipline accessible only to experts. We're here to change that.
        </p>
        <p>
            Our goal is to provide an intuitive, instant, and insightful first step into the world of on-page SEO. By focusing on the foundational elements that truly matter, we empower you to make meaningful improvements without needing a technical background.
        </p>
        <p>
            This tool provides a rapid analysis and generates a crucial XML sitemap, serving as your website's roadmap for search engines like Google. It's designed to be the starting point for your SEO journey, giving you the confidence to build a stronger online presence.
        </p>
        <ContactForm />
      </div>
    </section>
  );
};

export default About;

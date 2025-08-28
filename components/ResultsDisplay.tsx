import React, { useMemo, useState } from 'react';
import { SeoResults } from '../types';
import AuditItem from './AuditItem';
import StatusDisplay from './StatusDisplay';
import { DownloadIcon, CopyIcon, CheckIcon, TwitterIcon, LinkedInIcon } from './Icons';

interface ResultsDisplayProps {
  results: SeoResults | null;
  url: string;
  isLoading: boolean;
  statusMessage: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, url, isLoading, statusMessage }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedRobotsLine, setCopiedRobotsLine] = useState(false);

  const handleCopy = (link: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        setCopiedLink(link);
        setTimeout(() => setCopiedLink(null), 2000);
      });
    }
  };

  const robotsTxtLine = useMemo(() => `Sitemap: ${new URL(url).origin}/sitemap.xml`, [url]);

  const handleRobotsCopy = () => {
      if (navigator.clipboard) {
          navigator.clipboard.writeText(robotsTxtLine).then(() => {
              setCopiedRobotsLine(true);
              setTimeout(() => setCopiedRobotsLine(false), 2000);
          });
      }
  };

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    // Find the title tag result from the audit
    const titleAudit = results?.audit.find(item => item.id === 'titleTag');
    // Extract the title text, which is inside quotes. Fallback to the URL if not found.
    const auditedPageTitle = titleAudit ? titleAudit.value.match(/"([^"]*)"/)?.[1] || url : url;

    const shareUrl = `${window.location.origin}?url=${encodeURIComponent(url)}`;
    let shareLink = '';

    if (platform === 'twitter') {
      const text = `Just audited "${auditedPageTitle}" with IndexFlow! Got a quick SEO checkup and a new sitemap. Check out this free tool! #SEO #Sitemap #WebDev`;
      shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    } else if (platform === 'linkedin') {
      const title = `SEO Audit Results for: ${auditedPageTitle}`;
      const summary = `I used IndexFlow for an instant SEO audit and sitemap generation for ${url}. It provides great insights into title tags, meta descriptions, and more. A great free tool for web developers and marketers! #SEO #WebsiteAudit #DigitalMarketing`;
      shareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer');
    }
  };


  const sitemapBlobUrl = useMemo(() => {
    if (!results?.sitemapXml) return '';
    const blob = new Blob([results.sitemapXml], { type: 'application/xml' });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  }, [results?.sitemapXml]);

  if (isLoading) {
    return <StatusDisplay message={statusMessage} />;
  }

  if (!results) {
    return null;
  }

  return (
    <div className="mt-8 space-y-10 animate-fade-in">
      {/* SEO Audit Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-4">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">SEO Audit for <span className="text-indigo-600 break-all">{url}</span></h2>
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-medium text-slate-500">Share Results:</span>
                <button 
                  onClick={() => handleShare('twitter')} 
                  aria-label="Share on Twitter" 
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-sky-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                    <TwitterIcon />
                </button>
                <button 
                  onClick={() => handleShare('linkedin')} 
                  aria-label="Share on LinkedIn" 
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                    <LinkedInIcon />
                </button>
            </div>
        </div>
        <div className="space-y-4">
          {results.audit.map(item => (
            <AuditItem key={item.id} {...item} />
          ))}
        </div>
      </div>

      {/* Sitemap Section */}
      <div>
        <h2 className="text-3xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">Your Sitemap is Ready!</h2>
        <div className="bg-slate-100/50 rounded-lg p-6 border border-slate-200">
          <p className="mb-5 text-slate-600 leading-relaxed">A sitemap has been generated based on the initial crawl of your site. You can download it below or inspect the discovered internal links.</p>
          <a
            href={sitemapBlobUrl}
            download="sitemap.xml"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-sky-500 transition-all duration-300"
          >
            <DownloadIcon />
            <span>Download sitemap.xml</span>
          </a>

          {results.internalLinks?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-slate-800 text-base mb-3">Internal Links Found ({results.internalLinks.length})</h3>
              <div className="max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg p-2 space-y-2">
                {results.internalLinks.map(link => (
                  <div key={link} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors duration-200 group">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-700 hover:underline truncate" title={link}>
                      {link}
                    </a>
                    <button 
                      onClick={() => handleCopy(link)}
                      className="flex-shrink-0 ml-4 p-1.5 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                      aria-label={`Copy link: ${link}`}
                    >
                      {copiedLink === link ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-slate-200 pt-6 text-sm text-slate-600 space-y-4 leading-relaxed">
            <h3 className="font-semibold text-slate-800 text-base">How to Use Your Sitemap:</h3>
            <ol className="list-decimal list-outside space-y-4 pl-5">
              <li>
                <strong>Upload the File:</strong> Place the downloaded <code className="bg-slate-200 text-indigo-700 font-mono px-1.5 py-0.5 rounded-md">sitemap.xml</code> file in the root directory of your website (the main folder, often named <code>public_html</code> or <code>www</code>).
              </li>
              <li>
                <strong>(Optional) Update Timestamps:</strong> For best results, edit the <code className="bg-slate-200 text-indigo-700 font-mono px-1.5 py-0.5 rounded-md">&lt;lastmod&gt;</code> date for each URL. This date should reflect when the page's content was last significantly changed. This helps search engines prioritize crawling.
              </li>
              <li>
                <strong>Update robots.txt:</strong> Add the following line to your <code className="bg-slate-200 text-indigo-700 font-mono px-1.5 py-0.5 rounded-md">robots.txt</code> file. This tells search engines where to find your sitemap.
                <div className="relative mt-2">
                  <pre className="bg-slate-800 text-slate-100 p-3 pr-12 rounded-md block text-xs overflow-x-auto">{robotsTxtLine}</pre>
                  <button 
                    onClick={handleRobotsCopy}
                    className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                    aria-label="Copy robots.txt line"
                  >
                    {copiedRobotsLine ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </li>
              <li>
                <strong>Submit to Search Engines:</strong> Finally, submit your sitemap URL to tools like <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="font-medium text-sky-600 hover:text-sky-800 hover:underline">Google Search Console</a> to ensure they discover and index your pages efficiently.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
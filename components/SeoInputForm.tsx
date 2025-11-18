
import React, { useState, useEffect } from 'react';
import { AnalyzeIcon } from './Icons';

interface SeoInputFormProps {
  initialUrl: string;
  onSubmit: (url: string) => void;
  isLoading: boolean;
  isLimitReached: boolean;
  sitemapUrl: string;
}

const SeoInputForm: React.FC<SeoInputFormProps> = ({ initialUrl, onSubmit, isLoading, isLimitReached, sitemapUrl }) => {
  const [url, setUrl] = useState<string>(initialUrl || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setUrl(initialUrl || '');
  }, [initialUrl]);

  const validateAndFormatUrl = (inputUrl: string): { valid: boolean; formattedUrl: string; error: string | null } => {
    let trimmedUrl = inputUrl.trim();
    if (!trimmedUrl) {
      return { valid: false, formattedUrl: '', error: 'URL cannot be empty.' };
    }

    if (!/^(https|http):\/\//i.test(trimmedUrl)) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    try {
      const urlObject = new URL(trimmedUrl);
      if (['localhost', '127.0.0.1'].includes(urlObject.hostname)) {
        return { valid: false, formattedUrl: '', error: 'Localhost and IP addresses cannot be analyzed.' };
      }
      if (!urlObject.hostname.includes('.') || urlObject.hostname.endsWith('.') || urlObject.hostname.startsWith('.')) {
        return { valid: false, formattedUrl: '', error: 'Please enter a valid domain name (e.g., example.com).' };
      }
      return { valid: true, formattedUrl: urlObject.toString(), error: null };
    } catch (error) {
      return { valid: false, formattedUrl: '', error: 'Please enter a valid URL structure.' };
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = validateAndFormatUrl(url);

    if (!validationResult.valid) {
      setValidationError(validationResult.error);
      return;
    }
    
    setValidationError(null);
    onSubmit(validationResult.formattedUrl);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
      <div className="w-full">
        <label htmlFor="url-input" className="w-full">
          <span className="sr-only">Website URL</span>
          <input
            id="url-input"
            type="text"
            value={url}
            onChange={handleChange}
            placeholder="example.com"
            required
            className={`w-full px-4 py-3 bg-white text-slate-800 border rounded-lg transition-all duration-300 placeholder-slate-400 ${
              validationError
                ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 focus:ring-2 focus:ring-sky-600 focus:border-sky-600'
            }`}
            disabled={isLoading || isLimitReached}
            aria-label="Website URL to analyze"
            aria-invalid={!!validationError}
            aria-describedby={validationError ? "url-error" : undefined}
          />
        </label>
        {validationError && (
          <p id="url-error" className="text-red-600 text-sm mt-2" role="alert">
            {validationError}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || isLimitReached}
        className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-600 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
      >
        <AnalyzeIcon />
        <span>{isLimitReached ? 'Limit Reached' : isLoading ? 'Analyzing...' : 'Start Analysis'}</span>
      </button>
      {sitemapUrl && !isLoading && (
          <a
            href={sitemapUrl}
            target="_blank"
            rel="noopener noreferrer"
            download="sitemap.xml"
            className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-semibold border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 transition-all duration-300 animate-fade-in"
          >
            View Sitemap
          </a>
      )}
    </form>
  );
};

export default SeoInputForm;

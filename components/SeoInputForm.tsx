
import React, { useState } from 'react';
import { AnalyzeIcon } from './Icons';

interface SeoInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  isLimitReached: boolean;
}

const SeoInputForm: React.FC<SeoInputFormProps> = ({ onSubmit, isLoading, isLimitReached }) => {
  const [url, setUrl] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
      <label htmlFor="url-input" className="w-full">
        <span className="sr-only">Website URL</span>
        <input
          id="url-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          className="w-full px-4 py-3 bg-white text-slate-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 placeholder-slate-400"
          disabled={isLoading || isLimitReached}
          aria-label="Website URL to analyze"
        />
      </label>
      <button
        type="submit"
        disabled={isLoading || isLimitReached}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-all duration-300 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed"
      >
        <AnalyzeIcon />
        <span>{isLimitReached ? 'Limit Reached' : isLoading ? 'Analyzing...' : 'Start Analysis'}</span>
      </button>
    </form>
  );
};

export default SeoInputForm;

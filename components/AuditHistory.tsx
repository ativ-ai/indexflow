
import React from 'react';
import { AuditHistoryEntry } from '../types';
import { HistoryIcon } from './Icons';

interface AuditHistoryProps {
  history: AuditHistoryEntry[];
  onViewHistory: (entry: AuditHistoryEntry) => void;
}

const AuditHistory: React.FC<AuditHistoryProps> = ({ history, onViewHistory }) => {
  return (
    <div className="mt-8 p-6 rounded-lg bg-slate-100/80 border border-slate-200/80">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-sky-600">
            <HistoryIcon />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Your Audit History</h3>
      </div>
      <p className="text-slate-600 mb-5 text-sm">
        Review your past analyses to track your SEO progress over time.
      </p>
      <div className="max-h-72 overflow-y-auto space-y-3 pr-2">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
          >
            <div className="flex-grow">
              <p className="font-semibold text-sky-700 break-all">{entry.url}</p>
              <p className="text-xs text-slate-500 mt-1">
                {entry.date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <button
              onClick={() => onViewHistory(entry)}
              className="w-full sm:w-auto flex-shrink-0 px-4 py-1.5 bg-white text-sm text-slate-700 font-semibold border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditHistory;



import React from 'react';
import { AuditHistoryEntry } from '../types';
import { HistoryIcon, TrashIcon } from './Icons';

interface AuditHistoryProps {
  history: AuditHistoryEntry[];
  onViewHistory: (entry: AuditHistoryEntry) => void;
  onDeleteEntry: (id: string) => void;
  onClearHistory: () => void;
}

// A robust date formatting utility function.
const formatDate = (date: Date): string => {
  try {
    // Check if the date is valid before formatting.
    if (!date || isNaN(date.getTime())) {
      throw new Error("Invalid date object provided.");
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error("Could not format date:", date, error);
    return "Invalid Date";
  }
};


const AuditHistory: React.FC<AuditHistoryProps> = ({ history, onViewHistory, onDeleteEntry, onClearHistory }) => {
  return (
    <div className="mt-8 p-6 rounded-lg bg-slate-100/80 border border-slate-200/80">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
            <div className="text-sky-600">
                <HistoryIcon />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Your Audit History</h3>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-sm font-medium text-slate-500 hover:text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            aria-label="Clear all audit history"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <>
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
                    {formatDate(entry.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                    <button
                        onClick={() => onViewHistory(entry)}
                        className="w-full sm:w-auto flex-1 px-4 py-1.5 bg-white text-sm text-slate-700 font-semibold border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200"
                    >
                        View
                    </button>
                    <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="p-2 bg-white text-slate-500 border border-slate-300 rounded-md shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                        aria-label={`Delete audit for ${entry.url}`}
                    >
                        <TrashIcon />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
            <p className="text-slate-500">Your audit history is empty.</p>
            <p className="text-slate-500 text-sm mt-1">Perform an analysis to see your results here.</p>
        </div>
      )}
    </div>
  );
};

export default AuditHistory;
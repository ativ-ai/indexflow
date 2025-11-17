import React from 'react';
import AnalysisAnimation from './AnalysisAnimation';

interface StatusDisplayProps {
  message: string;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ message }) => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-6 p-6 bg-slate-100/50 rounded-lg border border-slate-200 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 text-center">
            {message}
        </h2>
        <p className="text-slate-600 text-center -mt-4">
            This may take a moment. We're performing a comprehensive audit.
        </p>
      <AnalysisAnimation />
    </div>
  );
};

export default StatusDisplay;
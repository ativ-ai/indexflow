import React from 'react';
import AnalysisAnimation from './AnalysisAnimation';
import ReportGenerationAnimation from './ReportGenerationAnimation';

interface StatusDisplayProps {
  message: string;
  stage?: 'analyzing' | 'generating';
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ message, stage = 'analyzing' }) => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center w-full animate-fade-in">
        <div className="w-full">
             {stage === 'analyzing' ? (
                 <AnalysisAnimation />
             ) : (
                 <ReportGenerationAnimation />
             )}
        </div>
        <p className="text-slate-500 text-sm mt-6 animate-pulse font-medium tracking-wide uppercase">
            {message || "System Processing..."}
        </p>
    </div>
  );
};

export default StatusDisplay;
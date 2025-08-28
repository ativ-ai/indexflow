
import React from 'react';
import { SpinnerIcon } from './Icons';

interface StatusDisplayProps {
  message: string;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ message }) => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-4 p-6 bg-slate-100/50 rounded-lg border border-slate-200">
      <SpinnerIcon />
      <p className="text-lg text-slate-600">{message}</p>
    </div>
  );
};

export default StatusDisplay;
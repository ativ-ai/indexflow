

import React from 'react';
import { LockIcon } from './Icons';

interface ProFeatureTeaserProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  // FIX: Changed onUpgradeClick to accept a mouse event from a button.
  onUpgradeClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ProFeatureTeaser: React.FC<ProFeatureTeaserProps> = ({ icon, title, description, onUpgradeClick }) => {
  return (
    <div className="mt-8 p-6 rounded-lg bg-slate-100/80 border border-slate-200/80 text-center animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="text-slate-400 h-6 w-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      </div>
      <p className="text-slate-600 mb-6 text-sm max-w-md mx-auto">
        {description}
      </p>
      <button
        onClick={onUpgradeClick}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-amber-500 transition-all duration-300"
      >
        <LockIcon />
        <span>Upgrade to Unlock</span>
      </button>
    </div>
  );
};

export default ProFeatureTeaser;
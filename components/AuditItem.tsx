import React from 'react';
import { AuditCheck, AuditStatus } from '../types';
import { CheckCircleIcon, XCircleIcon, InfoCircleIcon, LockIcon } from './Icons';

const statusStyles = {
  [AuditStatus.OK]: {
    icon: <CheckCircleIcon />,
    containerClasses: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-500',
    badgeClasses: 'bg-emerald-100 text-emerald-800',
  },
  [AuditStatus.Problem]: {
    icon: <XCircleIcon />,
    containerClasses: 'bg-red-50 border-red-200',
    iconColor: 'text-red-500',
    badgeClasses: 'bg-red-100 text-red-800',
  },
  [AuditStatus.Info]: {
    icon: <InfoCircleIcon />,
    containerClasses: 'bg-sky-50 border-sky-200',
    iconColor: 'text-sky-500',
    badgeClasses: 'bg-sky-100 text-sky-800',
  }
};

interface AuditItemProps extends AuditCheck {
  isLocked?: boolean;
  onUpgradeClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const AuditItem: React.FC<AuditItemProps> = ({ title, status, value, recommendation, isLocked, onUpgradeClick }) => {
  if (isLocked) {
    return (
      <div className="p-4 rounded-lg border bg-slate-50 border-slate-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-0.5 text-slate-400">
            {/* Use a consistent icon style with other items */}
            <InfoCircleIcon />
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="flex items-center gap-2 font-semibold text-slate-600">
                {title}
                {/* Subtle, inline lock icon */}
                <span className="text-slate-400" title="Premium Feature">
                  <LockIcon />
                </span>
              </h3>
              {/* "Premium" badge for clarity */}
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Premium
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">Upgrade your plan to see the analysis and recommendation for this check.</p>
            {onUpgradeClick && (
              <button
                onClick={onUpgradeClick}
                className="mt-3 inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-amber-500 transition-all duration-300"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const styles = statusStyles[status];

  return (
    <div className={`p-4 rounded-lg border ${styles.containerClasses}`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 mt-0.5 ${styles.iconColor}`}>
          {styles.icon}
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles.badgeClasses}`}>
              {status}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1 font-mono break-words bg-slate-100/50 p-2 rounded-md">{value}</p>
          <p className="text-sm text-slate-500 mt-2">{recommendation}</p>
        </div>
      </div>
    </div>
  );
};

export default AuditItem;
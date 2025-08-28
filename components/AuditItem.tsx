
import React from 'react';
import { AuditCheck, AuditStatus } from '../types';
import { CheckCircleIcon, XCircleIcon, InfoCircleIcon } from './Icons';

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

const AuditItem: React.FC<AuditCheck> = ({ title, status, value, recommendation }) => {
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
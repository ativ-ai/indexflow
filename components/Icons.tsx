import React from 'react';

export const LogoIcon: React.FC = () => (
  <span className="material-symbols-outlined text-sky-500" style={{ fontSize: '40px', lineHeight: 1 }}>
    mediation
  </span>
);

export const AnalyzeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const DownloadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const SpinnerIcon: React.FC = () => (
  <svg className="animate-spin h-8 w-8 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const CheckCircleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const InfoCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CopyIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const TwitterIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.216 3.821 4.654-.757.205-1.547.243-2.345.087.616 1.892 2.395 3.27 4.501 3.309-1.801 1.413-4.072 2.257-6.553 2.257-.425 0-.845-.025-1.258-.075 2.324 1.493 5.093 2.368 8.046 2.368 9.664 0 14.945-8.008 14.945-14.945 0-.227-.005-.453-.014-.678.988-.711 1.843-1.6 2.535-2.625z"/>
  </svg>
);

export const LinkedInIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.06 20.45H3.53V9h3.53v11.45zM5.3 7.5c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2c1.1 0 2 1 2 2.2s-.9 2.2-2 2.2zm13.38 12.95h-3.53v-5.6c0-1.34-.02-3.07-1.87-3.07s-2.16 1.46-2.16 2.97v5.7h-3.53V9h3.38v1.54h.05c.47-.88 1.6-1.8 3.33-1.8 3.56 0 4.22 2.3 4.22 5.3v6.1z"/>
  </svg>
);

export const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M48 24C48 22.0427 47.8427 20.1245 47.5455 18.2618H24.48V28.7382H37.8182C37.2655 31.8027 35.6455 34.3336 33.0027 36.0655V42.3464H41.4545C45.6218 38.3345 48 31.7836 48 24Z" fill="#4285F4"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M24.48 48.0001C30.9818 48.0001 36.45 45.9274 40.4564 42.3465L33.0027 36.0656C30.8 37.491 27.8809 38.3347 24.48 38.3347C18.1091 38.3347 12.72 34.0092 10.9364 28.2H2.18182V34.6528C6.18818 42.6656 14.64 48.0001 24.48 48.0001Z" fill="#34A853"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M10.9364 28.2001C10.4373 26.7746 10.1673 25.2656 10.1673 23.7092C10.1673 22.1528 10.4373 20.6437 10.9364 19.2183V12.7655H2.18182C0.818182 15.3965 0 18.4609 0 22.0001C0 25.5392 0.818182 28.6037 2.18182 31.2347L10.9364 28.2001Z" fill="#FBBC05"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M24.48 9.66545C27.3027 9.66545 29.8036 10.6364 31.7918 12.5118L40.6473 3.83454C36.45 0.253632 30.9818 0 24.48 0C14.64 0 6.18818 5.33454 2.18182 13.3473L10.9364 19.8C12.72 14.0091 18.1091 9.66545 24.48 9.66545Z" fill="#EA4335"/>
    </svg>
);

export const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

export const TokenIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M15.5,16.88L12,14.62L8.5,16.88L9.5,12.88L6.5,10.38L10.5,10.12L12,6.12L13.5,10.12L17.5,10.38L14.5,12.88L15.5,16.88Z" />
    </svg>
);

export const HistoryIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
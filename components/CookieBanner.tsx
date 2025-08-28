import React from 'react';

interface CookieBannerProps {
  onAccept: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept }) => {
  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md p-4 bg-slate-800 text-white rounded-lg shadow-2xl animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-grow">
          <h3 className="font-semibold text-base">Cookie Consent</h3>
          <p className="text-sm text-slate-300 mt-1">
            We use cookies to enhance your experience, analyze site traffic, and for essential functionality. By clicking "Accept", you agree to our use of cookies.
          </p>
        </div>
        <button
          onClick={onAccept}
          className="w-full sm:w-auto flex-shrink-0 px-5 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors duration-200"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;

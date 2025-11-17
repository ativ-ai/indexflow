import React, { useState, useEffect } from 'react';
import { CheckIcon, SpinnerIcon } from './Icons';

const analysisSteps = [
    { id: 'connect', text: 'Establishing secure connection...' },
    { id: 'fetch', text: 'Fetching URL content...' },
    { id: 'headers', text: 'Analyzing HTTP headers...' },
    { id: 'title', text: 'Checking title tag...' },
    { id: 'meta', text: 'Verifying meta description...' },
    { id: 'headings', text: 'Scanning heading structure (H1-H6)...' },
    { id: 'images', text: 'Auditing image alt tags...' },
    { id: 'links', text: 'Crawling internal links...' },
    { id: 'sitemap', text: 'Building sitemap.xml...' },
    { id: 'report', text: 'Compiling final report...' },
];

const AnalysisAnimation: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prevStep => {
                if (prevStep < analysisSteps.length -1) {
                    return prevStep + 1;
                }
                // Loop the animation from a mid-point if it finishes before analysis.
                return 3; 
            });
        }, 800);

        return () => clearInterval(interval);
    }, []);

    const progressPercentage = ((currentStep + 1) / analysisSteps.length) * 100;

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="mb-4">
                <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-2 bg-sky-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
            <div className="space-y-3 text-sm">
                {analysisSteps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`flex items-center gap-3 transition-opacity duration-300 ${
                            index > currentStep ? 'opacity-40' : 'opacity-100'
                        }`}
                    >
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                            {index < currentStep ? (
                                <span className="text-emerald-500"><CheckIcon /></span>
                            ) : index === currentStep ? (
                                <SpinnerIcon />
                            ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-300 bg-white"></div>
                            )}
                        </div>
                        <span className={`transition-colors duration-300 ${
                            index < currentStep ? 'text-slate-500 line-through' : 'text-slate-700 font-medium'
                        }`}>
                            {step.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalysisAnimation;

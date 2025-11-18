
import React, { useState } from 'react';
import { GeneratedMetaTags } from '../types';
import { CodeTagIcon, CopyIcon, CheckIcon } from './Icons';

interface MetaTagGeneratorProps {
    metaTags: GeneratedMetaTags;
}

const MetaTagGenerator: React.FC<MetaTagGeneratorProps> = ({ metaTags }) => {
    const [justCopied, setJustCopied] = useState<string | null>(null);

    const handleCopyToClipboard = (textToCopy: string, identifier: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setJustCopied(identifier);
                setTimeout(() => setJustCopied(null), 2000);
            }).catch(err => {
                console.error(`Failed to copy ${identifier}: `, err);
                alert('Failed to copy text.');
            });
        } else {
            alert('Clipboard API not available.');
        }
    };

    const renderMetaTag = (label: string, value: string, type: 'title' | 'description' | 'keywords') => (
        <div>
            <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold text-slate-800 text-base">{label}</h4>
                <button
                    onClick={() => handleCopyToClipboard(value, type)}
                    className="p-1.5 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all duration-200"
                    aria-label={`Copy ${label}`}
                >
                    {justCopied === type ? <CheckIcon /> : <CopyIcon />}
                </button>
            </div>
            <pre className="bg-slate-800 text-slate-100 p-3 rounded-md block text-sm overflow-x-auto whitespace-pre-wrap break-words">{value}</pre>
        </div>
    );

    return (
        <div>
            <div className="flex items-center gap-3 mb-5">
                <div className="text-sky-600">
                    <CodeTagIcon />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">AI Meta Tag Suggestions</h2>
            </div>
            <div className="bg-slate-100/50 rounded-lg p-6 border border-slate-200 space-y-6">
                <p className="text-slate-600 leading-relaxed">
                    Here are some AI-generated suggestions for your meta tags. Review and edit them to perfectly match your page's content and tone.
                </p>
                {renderMetaTag('Title Tag', metaTags.title, 'title')}
                {renderMetaTag('Meta Description', metaTags.description, 'description')}
                {renderMetaTag('Meta Keywords', metaTags.keywords, 'keywords')}
            </div>
        </div>
    );
};

export default MetaTagGenerator;

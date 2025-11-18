
import React, { useState } from 'react';
import { InternalLinkAnalysis } from '../types';
import { LinkIcon, OrphanIcon, LightbulbIcon } from './Icons';

interface InternalLinkAnalysisDisplayProps {
    analysis: InternalLinkAnalysis;
}

const InternalLinkAnalysisDisplay: React.FC<InternalLinkAnalysisDisplayProps> = ({ analysis }) => {
    // Return null if there is no meaningful data to display
    if (!analysis || (!analysis.anchorTextSuggestions?.length && !analysis.orphanedPages?.length && !analysis.linkingOpportunities?.length)) {
        return null;
    }
    
    return (
        <section>
            <div className="flex items-center gap-3 mb-5">
                <div className="text-sky-600 h-8 w-8">
                    <LinkIcon /> 
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Internal Link Optimization</h2>
            </div>
            <div className="bg-slate-100/50 rounded-lg p-6 border border-slate-200 space-y-8">
                <p className="text-slate-600 leading-relaxed">
                    A strong internal linking strategy helps search engines understand your site structure and spreads link equity. Here are AI-powered suggestions to improve your internal links.
                </p>

                {/* Anchor Text Suggestions */}
                {analysis.anchorTextSuggestions && analysis.anchorTextSuggestions.length > 0 && (
                    <div>
                        <h3 className="flex items-center gap-2 font-bold text-slate-800 text-xl mb-3">
                            <LightbulbIcon className="w-6 h-6 text-amber-500" />
                            Anchor Text Suggestions
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">Using descriptive, keyword-rich anchor text is better for SEO than generic phrases.</p>
                        <div className="space-y-3">
                            {analysis.anchorTextSuggestions.map((suggestion, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <p className="text-sm text-slate-500 break-all">For link to: <code className="text-indigo-700">{suggestion.link}</code></p>
                                    <div className="mt-2 grid sm:grid-cols-2 gap-4 items-center">
                                        <div className="text-center p-2 rounded-md bg-red-50 text-red-700 border border-red-200">
                                            <p className="text-xs font-semibold uppercase">Current (Poor)</p>
                                            <p className="font-mono text-sm mt-1">"{suggestion.currentAnchorText}"</p>
                                        </div>
                                        <div className="text-center p-2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <p className="text-xs font-semibold uppercase">Suggested (Better)</p>
                                            <p className="font-mono text-sm mt-1">"{suggestion.suggestedAnchorText}"</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Orphaned Pages */}
                {analysis.orphanedPages && analysis.orphanedPages.length > 0 && (
                    <div>
                        <h3 className="flex items-center gap-2 font-bold text-slate-800 text-xl mb-3">
                            <OrphanIcon className="w-6 h-6 text-red-500" />
                            Orphaned Pages
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">These pages may exist on your site but have no internal links pointing to them, making them hard for users and search engines to find.</p>
                        <ul className="list-disc list-inside bg-white p-4 rounded-lg border border-slate-200 space-y-2">
                            {analysis.orphanedPages.map((page, index) => (
                                <li key={index} className="text-sm text-sky-700 font-mono break-all">{page}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Linking Opportunities */}
                {analysis.linkingOpportunities && analysis.linkingOpportunities.length > 0 && (
                     <div>
                        <h3 className="flex items-center gap-2 font-bold text-slate-800 text-xl mb-3">
                            <LinkIcon className="w-6 h-6 text-sky-500" />
                            New Linking Opportunities
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">Strategically adding new internal links can improve rankings and user navigation.</p>
                        <div className="space-y-3">
                            {analysis.linkingOpportunities.map((opp, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <p className="text-sm break-words">
                                        Consider linking from <code className="bg-slate-200 text-indigo-700 font-mono px-1.5 py-0.5 rounded-md">{opp.sourcePageSuggestion}</code> to <code className="bg-slate-200 text-indigo-700 font-mono px-1.5 py-0.5 rounded-md">{opp.targetPage}</code>.
                                    </p>
                                    <p className="text-sm text-slate-600 mt-2 pl-4 border-l-4 border-sky-200">
                                        <strong>Reason:</strong> {opp.reason}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default InternalLinkAnalysisDisplay;

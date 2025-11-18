import React, { useState } from 'react';
import { TargetIcon, SitemapIcon, LightbulbIcon, CheckIcon } from './Icons';

interface LandingPageProps {
    onAnalyze: (url: string) => void;
    onNavigate: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
        <div className="flex-shrink-0 w-12 h-12 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{children}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; title: string; avatar: string; }> = ({ quote, name, title, avatar }) => (
    <figure className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg h-full flex flex-col justify-between">
        <blockquote className="text-slate-800 italic font-medium">
            <p>“{quote}”</p>
        </blockquote>
        <figcaption className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-200">
            <img className="w-12 h-12 rounded-full object-cover border border-slate-200" src={avatar} alt={name} />
            <div>
                <div className="font-bold text-slate-900">{name}</div>
                <div className="text-slate-500 text-sm font-medium">{title}</div>
            </div>
        </figcaption>
    </figure>
);

const LandingPage: React.FC<LandingPageProps> = ({ onAnalyze, onNavigate }) => {
    const [url, setUrl] = useState('');

    const handleAnalyzeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onAnalyze(url);
    };

    return (
        <div className="space-y-24 sm:space-y-32 animate-fade-in bg-white">
            {/* Hero Section */}
            <section className="relative text-center pt-20 pb-24 overflow-hidden bg-slate-50 border-b border-slate-200">
                
                {/* Blueprint Grid Background - High Contrast Light Mode */}
                <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-30" aria-hidden="true">
                    <div className="absolute w-[200vw] h-[200vh] top-1/4 -translate-x-1/2 left-1/2 bg-[linear-gradient(rgba(14,165,233,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.2)_1px,transparent_1px)] bg-[size:40px_40px] transform perspective-[1200px] rotate-x-60"></div>
                </div>

                <div className="relative z-10 px-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-bold mb-6 shadow-sm animate-fade-in-up">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-600"></span>
                        </span>
                        AI-Powered Analysis Engine
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Instant SEO Insights. <br />
                        <span className="text-sky-600">Perfect Sitemaps.</span>
                    </h1>
                    <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                        Turn SEO guesswork into a clear action plan. Get a free, AI-powered audit and an XML sitemap in seconds.
                    </p>
                    <div className="mt-10 max-w-xl mx-auto">
                         <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl shadow-xl border border-slate-200">
                            <div className="w-full">
                                <label htmlFor="hero-url" className="sr-only">Enter your website URL to analyze</label>
                                <input
                                    type="url"
                                    name="url"
                                    id="hero-url"
                                    className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-transparent focus:outline-none transition placeholder-slate-400 font-medium"
                                    placeholder="Enter your website URL..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleAnalyzeClick}
                                className="w-full sm:w-auto flex-shrink-0 px-8 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-md hover:bg-sky-700 transform hover:scale-105 transition-all duration-300"
                            >
                                Analyze for Free
                            </button>
                        </div>
                         <p className="mt-4 text-xs text-slate-500 flex items-center justify-center gap-2 font-medium">
                             <CheckIcon /> No credit card required. Start improving your rankings now.
                         </p>
                    </div>
                </div>
            </section>

             {/* Social Proof */}
            <section className="text-center px-4">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Trusted by developers, marketers, and founders worldwide
                </p>
                <div className="mt-6 flex justify-center items-center flex-wrap gap-8 sm:gap-12 text-slate-400 font-bold text-lg">
                    <span>Innovate Inc.</span>
                    <span>QuantumLeap</span>
                    <span>Apex Digital</span>
                    <span>NextGen Media</span>
                    <span>Synergy Co.</span>
                </div>
            </section>

             {/* Features Section */}
            <section className="px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Everything You Need for On-Page SEO</h2>
                     <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                        From technical checks to content structure, get a complete picture of your website's health.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <FeatureCard icon={<TargetIcon />} title="In-Depth SEO Audit">
                        Analyze title tags, meta descriptions, headings (H1-H3), robots.txt, and other critical on-page factors instantly.
                    </FeatureCard>
                    <FeatureCard icon={<SitemapIcon />} title="XML Sitemap Generator">
                        Create a perfectly formatted sitemap that helps search engines like Google discover, crawl, and index all your important pages.
                    </FeatureCard>
                    <FeatureCard icon={<LightbulbIcon />} title="Actionable Recommendations">
                        Receive clear, straightforward advice for every issue found, empowering you to make impactful improvements quickly.
                    </FeatureCard>
                </div>
            </section>

            {/* Visual Showcase Section */}
            <section className="relative px-4">
                 <div className="text-center mb-12">
                     <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Visualize Your SEO Success</h2>
                     <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                       Go from a complex problem to a clear solution. See exactly what you'll get.
                    </p>
                </div>
                <div className="relative bg-slate-900 rounded-2xl shadow-2xl p-4 border border-slate-800 max-w-5xl mx-auto">
                    <div className="absolute top-4 left-4 flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="mt-6 bg-white p-6 rounded-lg">
                        <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2 mb-4">SEO Audit for example.com</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                                <span className="text-emerald-600"><CheckIcon/></span>
                                <span className="text-sm font-bold text-emerald-900">Title Tag: OK</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                <span className="text-red-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></span>
                                <span className="text-sm font-bold text-red-900">Meta Description: Problem - Too short</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-sky-50 border border-sky-200 rounded-md">
                                <span className="text-sky-600"><CheckIcon/></span>
                                <span className="text-sm font-bold text-sky-900">H1 Tag: OK</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="px-4">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Loved by People Like You</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <TestimonialCard
                        quote="This tool is a game-changer. I got a sitemap and identified three critical SEO issues on my client's site within minutes. It's now part of my weekly workflow."
                        name="Sarah Jenkins"
                        title="Freelance Web Developer"
                        avatar="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    />
                    <TestimonialCard
                        quote="As a small business owner, I don't have a huge marketing budget. IndexFlow gave me a clear, actionable plan to improve my site's visibility on Google for free."
                        name="Mike Rodriguez"
                        title="Owner, The Coffee Spot"
                        avatar="https://i.pravatar.cc/150?u=a042581f4e29026704e"
                    />
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="px-4 pb-20">
                <div className="text-center bg-slate-900 p-10 sm:p-16 rounded-2xl max-w-5xl mx-auto shadow-2xl">
                     <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Boost Your Rankings?</h2>
                    <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto font-medium">
                       Stop guessing, start improving. Get your free, comprehensive SEO report and sitemap today.
                    </p>
                    <div className="mt-8">
                         <button
                            onClick={onNavigate}
                            className="px-8 py-4 bg-sky-600 text-white font-bold rounded-lg shadow-lg hover:bg-sky-500 transform hover:scale-105 transition-all duration-300"
                        >
                            Analyze My Website for Free
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
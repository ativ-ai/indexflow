import React, { useState, useEffect, useRef } from 'react';
import { GlobeIcon, ServerIcon, CheckCircleIcon, SitemapIcon, LinkIcon, CpuIcon } from './Icons';

// Technical logs to simulate deep analysis
const terminalLogs = [
    "Resolving hostname...",
    "Initiating TCP handshake...",
    "GET / HTTP/1.1",
    "Status: 200 OK",
    "Latency: 124ms",
    "Downloading document...",
    "Parsing DOM tree...",
    "Extracting meta tags...",
    "<title> tag found",
    "<meta name='description'> found",
    "Analyzing header hierarchy...",
    "Checking H1 presence... OK",
    "Scanning H2/H3 structure...",
    "Validating robots.txt...",
    "User-agent: * allowed",
    "Checking for sitemap.xml...",
    "Crawling internal links...",
    "Found /about",
    "Found /contact",
    "Analyzing anchor text...",
    "Checking image alt attributes...",
    "Simulating mobile viewport...",
    "Checking viewport meta tag...",
    "Analyzing Critical Rendering Path...",
    "LCP: 1.2s [GOOD]",
    "CLS: 0.05 [GOOD]",
    "Validating Schema.org markup...",
    "Checking for Open Graph tags...",
    "Generating report..."
];

interface AnalysisAnimationProps {
    finished?: boolean;
}

const AnalysisAnimation: React.FC<AnalysisAnimationProps> = ({ finished = false }) => {
    const [currentLogIndex, setCurrentLogIndex] = useState(0);
    const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [activePhase, setActivePhase] = useState(0);
    const logContainerRef = useRef<HTMLDivElement>(null);

    const phases = [
        { name: "CONNECTING", icon: <GlobeIcon className="w-6 h-6 text-sky-400" />, color: "text-sky-400", border: "border-sky-500" },
        { name: "CRAWLING", icon: <LinkIcon className="w-6 h-6 text-indigo-400" />, color: "text-indigo-400", border: "border-indigo-500" },
        { name: "ANALYZING", icon: <CpuIcon className="w-6 h-6 text-emerald-400" />, color: "text-emerald-400", border: "border-emerald-500" },
        { name: "COMPLETE", icon: <CheckCircleIcon />, color: "text-emerald-400", border: "border-emerald-500" },
    ];

    // Progress bar animation
    useEffect(() => {
        if (finished) {
            setProgress(100);
            setActivePhase(3);
            setDisplayedLogs(prev => [...prev, "Analysis Complete.", "Report Generated Successfully."]);
            return;
        }

        const interval = setInterval(() => {
            setProgress(old => {
                if (old >= 100) return 100;
                return old + 0.8; // ~4 seconds total
            });
        }, 30);
        return () => clearInterval(interval);
    }, [finished]);

    // Update phases based on progress (only if not finished)
    useEffect(() => {
        if (finished) return;

        if (progress < 25) setActivePhase(0);
        else if (progress < 50) setActivePhase(1);
        else if (progress < 95) setActivePhase(2);
        else setActivePhase(3);
    }, [progress, finished]);

    // Terminal log animation
    useEffect(() => {
        if (finished) return;
        if (currentLogIndex >= terminalLogs.length) return;

        const timeout = setTimeout(() => {
            setDisplayedLogs(prev => [...prev, terminalLogs[currentLogIndex]]);
            setCurrentLogIndex(prev => prev + 1);
        }, Math.random() * 150 + 50); 

        return () => clearTimeout(timeout);
    }, [currentLogIndex, finished]);

    // Auto-scroll logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [displayedLogs]);

    const currentPhase = phases[activePhase];

    return (
        <div className={`w-full mx-auto bg-black rounded-xl overflow-hidden shadow-2xl border-2 transition-colors duration-500 ${finished ? 'border-emerald-500' : 'border-slate-800'} font-mono text-sm relative group`}>
            {/* Top Bar */}
            <div className="bg-slate-900 p-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className={`w-3 h-3 rounded-full ${finished ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        <div className={`w-3 h-3 rounded-full ${finished ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <div className={`w-3 h-3 rounded-full ${finished ? 'bg-emerald-500' : 'bg-emerald-500'}`}></div>
                    </div>
                    <span className="ml-3 text-slate-300 text-xs tracking-wider font-bold">INDEXFLOW_SYSTEM_SCAN_V2.0</span>
                </div>
                <div className={`flex items-center gap-2 px-2 py-1 rounded bg-black border ${currentPhase.border} transition-all duration-500`}>
                    <span className={`${finished ? '' : 'animate-pulse'} ${currentPhase.color}`}>{currentPhase.icon}</span>
                    <span className={`font-bold ${currentPhase.color} tracking-widest text-xs`}>{finished ? 'SCAN COMPLETE' : `${currentPhase.name}...`}</span>
                </div>
            </div>

            {/* Main Visual Area - Solid Black for maximum contrast */}
            <div className="relative p-6 h-80 sm:h-96 flex flex-col sm:flex-row items-center justify-between bg-black">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20" style={{ 
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
                    backgroundSize: '40px 40px' 
                }}></div>
                
                {/* Scanner Visual (Left/Top) */}
                <div className="relative z-10 w-full sm:w-1/3 flex flex-col items-center justify-center mb-6 sm:mb-0">
                     <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Spinning Rings - Solid Colors */}
                        <div className={`absolute inset-0 border-2 rounded-full transition-all duration-1000 ${finished ? 'border-emerald-500' : 'border-sky-500 animate-[spin_3s_linear_infinite]'}`}></div>
                        <div className={`absolute inset-2 border-2 rounded-full border-dashed transition-all duration-1000 ${finished ? 'border-emerald-500' : 'border-indigo-500 animate-[spin_4s_linear_infinite_reverse]'}`}></div>
                        <div className={`absolute inset-8 border-2 rounded-full flex items-center justify-center transition-all duration-500 ${finished ? 'bg-emerald-900/50 border-emerald-400 scale-110' : 'bg-sky-900/50 border-sky-400 animate-pulse'}`}>
                            <div className={finished ? 'text-emerald-400' : 'text-sky-400'}>
                                {finished ? <CheckCircleIcon /> : currentPhase.icon}
                            </div>
                        </div>
                        
                        {/* Scanning Radar Effect - hidden when finished */}
                        {!finished && (
                            <div className="absolute top-1/2 left-1/2 w-[150%] h-[2px] bg-sky-400 -translate-x-1/2 -translate-y-1/2 animate-[spin_2s_linear_infinite]"></div>
                        )}
                     </div>
                     <div className="mt-4 text-center">
                        <div className={`text-3xl font-bold transition-colors duration-500 ${finished ? 'text-emerald-400' : 'text-white'}`}>{Math.round(progress)}%</div>
                        <div className="text-xs text-slate-400 font-bold">COMPLETION</div>
                     </div>
                </div>

                {/* Terminal Log (Right/Bottom) */}
                <div className="relative z-10 w-full sm:w-2/3 sm:pl-6 h-full flex flex-col">
                    <div className={`flex-grow bg-black rounded-lg border-2 transition-colors duration-500 ${finished ? 'border-emerald-700' : 'border-slate-700'} p-4 overflow-hidden flex flex-col shadow-md`}>
                        <div className="text-xs text-slate-400 mb-2 border-b border-slate-800 pb-1 flex justify-between font-bold">
                            <span>/> SYSTEM_LOG</span>
                            <span className={finished ? "text-emerald-500" : "text-emerald-500 animate-pulse"}>{finished ? 'OFFLINE' : 'LIVE'}</span>
                        </div>
                        <div ref={logContainerRef} className="flex-grow overflow-y-auto space-y-1.5 font-mono text-xs scrollbar-hide">
                            {displayedLogs.map((log, i) => (
                                <div key={i} className="text-emerald-400 font-bold break-words">
                                    <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                                    {log}
                                </div>
                            ))}
                            {!finished && <div className="animate-pulse text-emerald-500 font-bold">_</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating 'Found' Badges - Solid Colors */}
            <div className="absolute bottom-4 left-6 flex flex-wrap gap-2 pointer-events-none">
                 {(progress > 30 || finished) && (
                    <div className="px-3 py-1 bg-sky-900 border border-sky-500 rounded text-sky-300 text-xs flex items-center gap-1 font-bold shadow-lg">
                        <ServerIcon className="w-3 h-3" /> Server: OK
                    </div>
                 )}
                 {(progress > 55 || finished) && (
                    <div className="px-3 py-1 bg-indigo-900 border border-indigo-500 rounded text-indigo-300 text-xs flex items-center gap-1 font-bold shadow-lg">
                        <SitemapIcon /> Structure Parsed
                    </div>
                 )}
                  {(progress > 85 || finished) && (
                    <div className="px-3 py-1 bg-emerald-900 border border-emerald-500 rounded text-emerald-300 text-xs flex items-center gap-1 font-bold shadow-lg">
                        <CheckCircleIcon /> Audit Ready
                    </div>
                 )}
            </div>
        </div>
    );
};

export default AnalysisAnimation;
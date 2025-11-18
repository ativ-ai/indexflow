import React from 'react';
import { FileCodeIcon } from './Icons';

const ReportGenerationAnimation: React.FC = () => {
  return (
    <div className="w-full mx-auto bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-slate-800 font-mono text-sm relative h-80 sm:h-96 flex items-center justify-center flex-col group">
        {/* Matrix Background */}
        <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(14, 165, 233, .3) 25%, rgba(14, 165, 233, .3) 26%, transparent 27%, transparent 74%, rgba(14, 165, 233, .3) 75%, rgba(14, 165, 233, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(14, 165, 233, .3) 25%, rgba(14, 165, 233, .3) 26%, transparent 27%, transparent 74%, rgba(14, 165, 233, .3) 75%, rgba(14, 165, 233, .3) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
        }}></div>

        {/* Central Document Visual */}
        <div className="relative z-10 p-8 border-2 border-sky-500/50 bg-slate-900/90 backdrop-blur-md rounded-lg w-64 h-80 flex flex-col shadow-[0_0_50px_rgba(14,165,233,0.3)] transition-all duration-500 transform group-hover:scale-105">
            {/* Header Construction */}
            <div className="w-full h-6 bg-sky-900/50 rounded mb-6 flex items-center px-2 gap-2 animate-pulse">
                 <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                 <div className="w-24 h-2 bg-sky-500/30 rounded"></div>
            </div>
            
            {/* Content Lines - Staggered Animation */}
            <div className="space-y-4 flex-grow">
                 <div className="w-full h-3 bg-slate-700 rounded animate-[pulse_1s_ease-in-out_infinite]"></div>
                 <div className="w-3/4 h-3 bg-slate-700 rounded animate-[pulse_1.5s_ease-in-out_infinite_0.2s]"></div>
                 <div className="w-5/6 h-3 bg-slate-700 rounded animate-[pulse_1.2s_ease-in-out_infinite_0.4s]"></div>
                 
                 {/* Image Placeholder */}
                 <div className="mt-6 w-full h-32 border border-dashed border-slate-600 rounded-lg relative overflow-hidden bg-slate-800/50 flex items-center justify-center">
                     <div className="absolute inset-0 flex items-center justify-center">
                        <FileCodeIcon className="w-10 h-10 text-sky-500 opacity-50" />
                     </div>
                     {/* Scanning Bar Effect */}
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-sky-400/20 to-transparent -translate-y-full animate-[shimmer_2s_infinite]"></div>
                 </div>
                 
                 <div className="w-full h-3 bg-slate-700 rounded animate-[pulse_1s_ease-in-out_infinite_0.6s]"></div>
            </div>
            
            {/* Footer */}
            <div className="mt-auto w-full h-1 bg-sky-500/20 rounded overflow-hidden">
                <div className="h-full bg-sky-500 w-full animate-[load_3s_ease-out_forwards]"></div>
            </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
             <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-t-sky-500 border-r-sky-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <span className="text-sky-400 font-bold tracking-widest text-lg animate-pulse">COMPILING REPORT...</span>
             </div>
             <p className="text-slate-500 text-xs uppercase tracking-wider">Formatting Data & Generative Insights</p>
        </div>
        
        <style>{`
            @keyframes shimmer {
                0% { transform: translateY(-150%); }
                100% { transform: translateY(150%); }
            }
            @keyframes load {
                0% { width: 0%; }
                100% { width: 100%; }
            }
        `}</style>
    </div>
  );
};

export default ReportGenerationAnimation;
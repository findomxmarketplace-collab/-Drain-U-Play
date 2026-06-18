import React from 'react';

const MandateOverlay = ({ task, onComplete }) => {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500 cursor-pointer"
      onClick={onComplete}
    >
      <div className="max-w-2xl w-full p-8 text-center animate-in zoom-in-95 duration-500">
        <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-4 uppercase italic tracking-tighter drop-shadow-2xl">
          GODDESS MANDATE
        </h1>
        
        <p className="text-pink-500 text-2xl md:text-3xl uppercase tracking-[0.2em] font-black mb-12 drop-shadow-sm">
          Synchronized Submission Required
        </p>

        <div className="bg-white/5 border-y-2 border-pink-500/30 p-10 mb-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-pink-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <p className="text-3xl md:text-4xl text-white font-serif italic relative z-10 leading-tight">
            "{task}"
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-500 text-sm uppercase tracking-widest animate-pulse font-bold">
            Click anywhere to acknowledge your duty
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
};

export default MandateOverlay;

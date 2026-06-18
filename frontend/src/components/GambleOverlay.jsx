import React, { useState } from 'react';

const GambleOverlay = ({ onResult }) => {
  const [outcome, setOutcome] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const result = Math.random() > 0.5 ? 'heads' : 'tails';
      setOutcome(result);
      setIsFlipping(false);
    }, 2000);
  };

  const handleSafe = () => {
    onResult(50);
  };

  const handleComplete = () => {
    onResult(outcome === 'heads' ? 0 : 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-neutral-900 border-4 border-[#FFD700] p-10 rounded-[30px] max-w-md w-full text-center shadow-[0_0_50px_rgba(255,215,0,0.3)]">
        <h2 className="font-impact text-4xl text-[#FF2D55] mb-6 uppercase tracking-wider">Double or Nothing</h2>
        
        {!outcome && !isFlipping && (
          <div className="space-y-6">
            <p className="text-gray-300 text-lg italic">"A choice, little sub. Pay the safe tribute, or let fate decide."</p>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={handleSafe}
                className="py-4 bg-neutral-700 hover:bg-neutral-600 text-white font-bold rounded-xl transition-all"
              >
                Safe Choice (Pay $50)
              </button>
              <button 
                onClick={handleFlip}
                className="py-4 bg-gradient-to-r from-[#FF2D55] to-[#FFD700] text-black font-black rounded-xl hover:scale-105 transition-all shadow-lg"
              >
                FLIP THE COIN
              </button>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Heads: $0 | Tails: $150</p>
          </div>
        )}

        {isFlipping && (
          <div className="py-10">
            <div className="w-20 h-20 bg-[#FFD700] rounded-full mx-auto animate-bounce shadow-[0_0_20px_#FFD700]"></div>
            <p className="mt-8 text-[#FFD700] font-impact text-2xl animate-pulse">FLIPPING...</p>
          </div>
        )}

        {outcome && (
          <div className="animate-in zoom-in duration-300">
            <div className="text-[5rem] font-impact text-white mb-4 uppercase">
              {outcome}
            </div>
            <p className="text-xl text-gray-300 mb-8">
              {outcome === 'heads' ? "Goddess shows mercy. You owe nothing." : "Greed has its price. You owe $150."}
            </p>
            <button 
              onClick={handleComplete}
              className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all"
            >
              I ACCEPT MY FATE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GambleOverlay;

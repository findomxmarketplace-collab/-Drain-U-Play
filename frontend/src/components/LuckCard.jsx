import React, { useState, useEffect } from 'react';

const LuckCard = ({ title, description, onComplete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Auto-flip after a short delay
    const timer = setTimeout(() => {
      setIsFlipped(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="scene w-[300px] h-[450px] perspective-1000">
        <div 
          className={`card w-full h-full relative transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Back of the card (shown first) */}
          <div 
            className="absolute w-full h-full backface-hidden rounded-[15px] shadow-[0_0_20px_rgba(255,45,85,0.3)] overflow-hidden border-2 border-[#FFD700]"
            style={{ 
              backgroundImage: 'url("/luck_card_back_v2.png")',
              backgroundSize: 'cover'
            }}
          >
          </div>
          
          {/* Front of the card (content) */}
          <div 
            className="absolute w-full h-full backface-hidden rounded-[15px] shadow-[0_0_20px_rgba(255,45,85,0.3)] overflow-hidden border-2 border-[#FFD700] flex flex-col justify-center items-center p-[30px] text-center rotate-y-180"
            style={{ 
              backgroundImage: 'url("/luck_card_front_template.png")',
              backgroundSize: 'cover'
            }}
          >
            <img src="/luck_card_seal.png" alt="Seal" className="w-20 h-20 mb-5" />
            <div className="z-10 bg-black/80 p-5 rounded-xl border border-[#BF5AF2]">
              <h2 className="font-impact text-[#FF2D55] text-3xl uppercase mb-4 drop-shadow-[0_0_10px_rgba(255,45,85,0.8)]">
                {title}
              </h2>
              <p className="text-white text-lg leading-relaxed italic font-verdana">
                {description}
              </p>
            </div>
            <div className="mt-5 text-[0.8rem] text-[#FFD700] uppercase tracking-[2px]">
              Tap to Flip
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onComplete}
        className="mt-8 px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-black rounded-xl shadow-lg transition-all transform hover:scale-[1.05] active:scale-95 uppercase tracking-widest"
      >
        I Obey, Goddess
      </button>
    </div>
  );
};

export default LuckCard;

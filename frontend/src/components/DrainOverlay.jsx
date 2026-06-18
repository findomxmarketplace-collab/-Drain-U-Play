import React, { useState } from 'react';

const DrainOverlay = ({ label, description, price, onComplete, paymentLink }) => {
  const [processing, setProcessing] = useState(false);

  const handleAuthorize = () => {
    if (paymentLink) {
      window.open(paymentLink, '_blank');
    }
    setProcessing(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-sans">
      {/* Carbon fiber background texture */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }}
      ></div>

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-4">
        <div className="text-center mb-8 animate-in slide-in-from-top duration-700">
          <h1 className="text-6xl font-black text-white leading-none tracking-tighter uppercase italic">
            FINANCIAL
          </h1>
          <h2 className="text-4xl font-black text-pink-600 leading-none tracking-[0.2em] uppercase">
            SURRENDER
          </h2>
        </div>

        <div className="relative bg-neutral-900 border-2 border-pink-600 rounded-[30px] p-8 w-full text-center shadow-[0_0_50px_rgba(219,39,119,0.4)] animate-in zoom-in-90 duration-500">
          {/* Pulsing border effect */}
          <div className="absolute inset-[-10px] border border-pink-600/30 rounded-[40px] animate-pulse"></div>

          <img 
            src="/drain_warning_icon.png" 
            alt="Warning" 
            className="w-24 h-24 mx-auto mb-6 animate-bounce transition-transform"
            style={{ animationDuration: '0.5s' }}
          />

          <p className="text-sm text-neutral-500 uppercase tracking-[0.3em] font-black mb-2">
            {label || 'Drain Station Triggered'}
          </p>

          <div className="text-7xl font-black text-white mb-6 tracking-tighter">
            ${price.toFixed(2)}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-xl text-neutral-200 italic leading-snug">
              "{description}"
            </p>
          </div>

          <button 
            onClick={handleAuthorize}
            disabled={processing}
            className={`w-full py-5 rounded-full text-2xl font-black uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 border-2 border-yellow-500/50 shadow-2xl
              ${processing 
                ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-900 to-pink-600 text-white hover:shadow-pink-500/50'}`}
          >
            {processing ? 'PROCESSING...' : 'Authorize Drain'}
          </button>
        </div>

        <p className="mt-12 text-[10px] text-red-600 uppercase tracking-[15px] animate-pulse font-black">
          Resistance is futile
        </p>
      </div>

      {/* Decorative side elements */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-red-900/20 to-transparent"></div>
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-red-900/20 to-transparent"></div>
    </div>
  );
};

export default DrainOverlay;

import React, { useState } from 'react';
import AlternativePayments from './AlternativePayments';

const TributeOverlay = ({ label, description, price, onComplete, paymentLink, playerId }) => {
  const [paid, setPaid] = useState(false);
  const fee = Math.max(price * 0.1, 5); // 10% gratitude fee or $5 min
  const total = price + fee;

  const handlePay = () => {
    if (paymentLink) {
      window.open(paymentLink, '_blank');
    }
    setPaid(true);
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-sans">
      <div className="bg-white rounded-sm w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Invoice Header */}
        <div className="p-8 border-b-4 border-pink-500">
          <div className="flex justify-between items-start mb-6">
            <div className="text-2xl font-black tracking-tighter text-pink-600 italic">DRAIN U PLAY</div>
            <div className="text-[10px] text-gray-400 uppercase font-bold text-right">
              Tribute Invoice<br />
              #{Math.floor(Math.random() * 9000) + 1000}
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-gray-900 uppercase leading-none mb-1">Payment Due</h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold">To the Throne of the Goddess</p>
        </div>

        {/* Invoice Body */}
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100 text-sm">
              <span className="text-gray-500 font-bold uppercase tracking-tight">Space: {label}</span>
              <span className="text-gray-900 font-black">${price.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100 text-sm">
              <span className="text-gray-500 font-bold uppercase tracking-tight">Processing Fee (Gratitude)</span>
              <span className="text-gray-900 font-black">${fee.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <span className="text-2xl font-black text-gray-900 uppercase">Total Due</span>
            <span className="text-3xl font-black text-yellow-600">${total.toFixed(2)}</span>
          </div>

          <p className="text-xs text-gray-500 italic text-center leading-relaxed px-4">
            "{description}"
          </p>

          <button 
            onClick={handlePay}
            disabled={paid}
            className={`w-full py-4 text-xl font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-sm
              ${paid 
                ? 'bg-neutral-800 text-neutral-400' 
                : 'bg-pink-600 text-white hover:bg-pink-700 hover:tracking-[0.3em]'}`}
          >
            {paid ? 'PAID' : 'Confirm Payment'}
          </button>
          
          <AlternativePayments playerId={playerId} />
        </div>

        {/* Invoice Seal */}
        <img 
          src="/tribute_invoice_seal.png" 
          alt="Accepted Seal" 
          className={`absolute bottom-[-20px] right-[-20px] w-32 h-32 transition-all duration-500 transform rotate-[-15deg] pointer-events-none
            ${paid ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}
        />

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500 rotate-45 translate-x-12 translate-y-[-40px]"></div>
      </div>
    </div>
  );
};

export default TributeOverlay;

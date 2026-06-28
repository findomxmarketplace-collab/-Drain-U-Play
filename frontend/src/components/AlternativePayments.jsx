import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const AlternativePayments = ({ playerId }) => {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const btcAddress = "bc1pvyvaf0dckp72udyun2f6gm2x6nlp6ft2pm3pv65vwa33crqu9z7qkn0ung";

  const handleCopy = () => {
    navigator.clipboard.writeText(btcAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 w-full">
      <button
        onClick={() => setShowModal(true)}
        className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest hover:text-pink-500 transition-colors block mx-auto"
      >
        Alternative Payments (Crypto)
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border-2 border-pink-500 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(236,72,153,0.3)]">
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight text-center">Goddess's Bitcoin Wallet</h3>
            
            <div className="bg-black/50 border border-neutral-800 rounded-2xl p-4 mb-6">
              <p className="text-[10px] text-neutral-500 uppercase font-black mb-2 tracking-widest">BTC Address</p>
              <div className="flex items-center gap-3">
                <code className="text-pink-400 text-xs break-all font-mono">
                  {btcAddress}
                </code>
                <button 
                  onClick={handleCopy}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex-shrink-0"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-neutral-400" />}
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4 text-xs text-pink-200/70 italic leading-relaxed">
                "Please include your player ID or username in the transaction note if possible."
              </div>
              <p className="text-[10px] text-neutral-600 uppercase font-bold text-center tracking-tighter">
                Player ID: <span className="text-pink-500">{playerId}</span>
              </p>
            </div>

            <button 
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-white text-black font-black rounded-xl uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlternativePayments;

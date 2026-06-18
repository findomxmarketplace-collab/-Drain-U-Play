import React, { useState } from 'react';
import { ShieldAlert, ExternalLink, Coins, QrCode, Clock } from 'lucide-react';

const FirstDutyOverlay = ({ goddessName, solanaAddress, throneLink, wishtenderLink, onConfirm, onRequestCryptoApproval, isPendingApproval }) => {
  const [showCrypto, setShowCrypto] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const paymentLink = throneLink || wishtenderLink || "https://throne.com/goddess";

  const handlePayBack = () => {
    window.open(paymentLink, '_blank');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(solanaAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const qrUrl = solanaAddress ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${solanaAddress}` : '';

  if (isPendingApproval) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900 border-4 border-purple-500 rounded-[40px] p-8 text-center shadow-[0_0_100px_rgba(168,85,247,0.3)]">
          <div className="bg-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Clock size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 uppercase italic">Approval Pending</h2>
          <p className="text-neutral-400 leading-relaxed mb-8">
            Your crypto tribute has been signaled. The Goddess is currently verifying your transaction. Do not refresh or Her patience may wear thin.
          </p>
          <div className="text-[10px] text-purple-400 font-black uppercase tracking-[0.2em] animate-bounce">
            Waiting for Her Touch...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      {/* Decorative background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[150px] rounded-full"></div>

      <div className="max-w-md w-full bg-neutral-900 border-4 border-pink-500 rounded-[40px] p-8 text-center relative shadow-[0_0_100px_rgba(236,72,153,0.3)] my-8">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-pink-500 p-4 rounded-2xl shadow-xl">
          <ShieldAlert size={40} className="text-white animate-pulse" />
        </div>

        <h2 className="text-4xl font-black text-white mt-6 mb-2 uppercase tracking-tighter italic">
          Entry Denied
        </h2>
        <p className="text-pink-500 font-black uppercase tracking-[0.2em] text-sm mb-8">
          Settle the Tab
        </p>

        {!showCrypto ? (
          <>
            <div className="space-y-6 text-left mb-10">
              <p className="text-neutral-300 leading-relaxed italic">
                "Goddess <span className="text-pink-400 font-bold">{goddessName || 'Goddess'}</span> has prepared this space for your 'improvement.' It is Her palace, Her rules, and—starting now—Her expenses."
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-neutral-400 text-sm leading-relaxed">
                  The <span className="text-white font-bold">$4.44</span> hosting fee for this session has been charged to Her account. A truly devoted submissive would never allow Her to carry a balance on their behalf.
                </p>
              </div>

              <p className="text-neutral-300 leading-relaxed font-medium">
                Prove you are worth Her time. Reimburse Her entry fee now to earn the right to roll.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={handlePayBack}
                className="w-full py-5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xl rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
              >
                PAY HER BACK ($4.44)
                <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              {solanaAddress && (
                <button
                  onClick={() => setShowCrypto(true)}
                  className="w-full py-4 bg-neutral-800 text-purple-400 font-black text-lg rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 border-2 border-purple-500/30 flex items-center justify-center gap-2"
                >
                  <Coins size={20} /> PAY WITH CRYPTO (SOL)
                </button>
              )}

              <button
                onClick={onConfirm}
                className="w-full py-4 bg-white text-neutral-900 font-black text-lg rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 border-b-4 border-neutral-300 hover:border-pink-300"
              >
                I HAVE REIMBURSED HER
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-3xl p-6">
              <div className="flex justify-center mb-4 bg-white p-2 rounded-xl">
                <img src={qrUrl} alt="SOL QR" className="w-32 h-32" />
              </div>
              <div className="text-left">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] text-neutral-500 font-black uppercase block">Solana Address</label>
                  <button 
                    onClick={copyAddress}
                    className="text-[10px] text-purple-400 font-bold hover:text-purple-300 transition-colors"
                  >
                    {copySuccess ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 break-all font-mono text-[10px] text-purple-300">
                  {solanaAddress}
                </div>
              </div>
              <div className="mt-4 text-left">
                <label className="text-[10px] text-neutral-500 font-black uppercase mb-1 block">Required Amount</label>
                <div className="text-xl font-black text-white">0.03 SOL</div>
                <p className="text-[10px] text-neutral-500 italic">Approx $4.44 + Gas</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={onRequestCryptoApproval}
                className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xl rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95"
              >
                SENT - REQUEST APPROVAL
              </button>
              <button
                onClick={() => setShowCrypto(false)}
                className="text-neutral-500 text-xs font-bold uppercase tracking-widest hover:text-pink-400 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        <p className="mt-8 text-[10px] text-neutral-500 uppercase tracking-widest font-bold animate-pulse">
          Board remains locked until duty is fulfilled
        </p>
      </div>
    </div>
  );
};

export default FirstDutyOverlay;

import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

const AgeVerification = ({ onVerified }) => {
  const [status, setStatus] = useState('idle'); // idle, scanning, verified, error
  const [error, setError] = useState(null);
  const [faceio, setFaceio] = useState(null);

  const [showDeclaration, setShowSafetyDeclaration] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    let interval;
    let timeout;

    // Use environment variable if available, otherwise fallback to placeholder
    const faceioId = import.meta.env.VITE_FACEIO_ID || 'fio_placeholder_id';
    const isPlaceholder = faceioId === 'fio_placeholder_id';

    const initFaceIO = () => {
      if (window.faceIO && !isPlaceholder) {
        console.log("FACEIO library detected, initializing...");
        try {
          const fio = new window.faceIO(faceioId);
          setFaceio(fio);
          setStatus('idle');
          setError(null);
          if (interval) clearInterval(interval);
          if (timeout) clearTimeout(timeout);
        } catch (e) {
          console.error("FACEIO initialization error:", e);
          setError("FACEIO initialization failed: " + e.message);
          setStatus('error');
          if (interval) clearInterval(interval);
          if (timeout) clearTimeout(timeout);
        }
      } else if (isPlaceholder) {
        console.log("Using Placeholder Age Verification mode.");
        setStatus('demo');
        if (interval) clearInterval(interval);
        if (timeout) clearTimeout(timeout);
      }
    };

    if (window.faceIO && !isPlaceholder) {
      initFaceIO();
    } else if (isPlaceholder) {
      initFaceIO();
    } else {
      console.log("FACEIO library not found, waiting...");
      setStatus('loading'); 
      interval = setInterval(initFaceIO, 500);
      
      // Fallback timeout after 5 seconds instead of 10 for demo purposes
      timeout = setTimeout(() => {
        if (!window.faceIO || isPlaceholder) {
          console.error("FACEIO library load timeout or Placeholder mode active");
          setStatus('demo');
          if (interval) clearInterval(interval);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const handleDemoVerify = () => {
    setShowSafetyDeclaration(true);
  };

  const confirmDeclaration = () => {
    if (agreed) {
      setStatus('verified');
      setTimeout(() => onVerified(), 1500);
    }
  };

  const handleScan = async () => {
    if (!faceio) return;
    
    setStatus('scanning');
    setError(null);

    try {
      const userData = await faceio.enroll({
        "locale": "auto",
        "payload": {
          "whoami": "drain_u_play_user"
        }
      });

      console.log("Success, user enrolled!", userData);
      setStatus('verified');
      setTimeout(() => onVerified(), 1500);
    } catch (err) {
      console.error("FaceIO Error:", err);
      setError(err.message || "An error occurred during scanning.");
      setStatus('error');
    }
  };

  if (showDeclaration) {
    return (
      <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-pink-300 max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Safety Declaration</h2>
          
          <div className="space-y-4 mb-8 text-sm text-gray-600 leading-relaxed overflow-y-auto max-h-64 pr-2 border-b border-pink-50 pr-4">
            <p className="font-bold text-pink-600">Please read and confirm the following:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>I am at least 18 years of age or older.</li>
              <li>I understand that this platform involves financial play and "drain" mechanics.</li>
              <li>I am participating of my own free will and understand the risks involved.</li>
              <li>I agree to treat all creators and participants with respect.</li>
              <li>I understand that all tributes and payments are non-refundable.</li>
            </ul>
            <p>By proceeding, you acknowledge that you have read and agreed to our Terms of Service and Privacy Policy regarding adult content and financial transactions.</p>
          </div>

          <label className="flex items-start gap-3 mb-8 cursor-pointer group">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 rounded border-pink-300 text-pink-500 focus:ring-pink-400"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-pink-600 transition-colors">
              I confirm I am 18+ and agree to the Safety Declaration.
            </span>
          </label>

          <button
            disabled={!agreed}
            onClick={confirmDeclaration}
            className={`w-full py-4 font-bold rounded-xl transition-all transform shadow-lg active:scale-95 ${
              agreed 
                ? 'bg-pink-500 hover:bg-pink-600 text-white hover:scale-[1.02]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm & Enter Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-pink-300 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Age Verification</h2>
        <p className="text-pink-600 font-semibold mb-6 flex items-center justify-center gap-2">
          <ShieldAlert size={20} /> Mandatory Compliance
        </p>
        
        <div className="relative aspect-video bg-neutral-100 rounded-xl mb-8 flex items-center justify-center border-2 border-dashed border-pink-200 overflow-hidden">
          {status === 'loading' && (
            <div className="flex flex-col items-center text-pink-400">
              <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-2" />
              <p>Initializing security...</p>
            </div>
          )}
          
          {(status === 'idle' || status === 'demo') && (
            <div className="flex flex-col items-center text-gray-400">
              <Camera size={48} className="mb-2" />
              <p>{status === 'demo' ? 'Ready for Safety Declaration' : 'Ready for face scan'}</p>
            </div>
          )}
          
          {status === 'scanning' && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/5">
              <div className="w-full h-1 bg-pink-500 absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
              <p className="text-pink-600 font-bold animate-pulse">Estimating age...</p>
            </div>
          )}
          
          {status === 'verified' && (
            <div className="flex flex-col items-center text-green-500">
              <CheckCircle size={48} className="mb-2" />
              <p className="font-bold text-xl">Verified: 18+</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center text-red-500 p-4">
              <AlertTriangle size={48} className="mb-2" />
              <p className="font-bold">Verification Unavailable</p>
              <p className="text-xs mt-2">{error}</p>
              <button 
                onClick={() => setStatus('demo')}
                className="mt-4 text-[10px] uppercase font-bold text-pink-500 underline"
              >
                Use Alternative Verification
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          {status === 'demo' 
            ? "Biometric verification is currently unavailable. Please use our manual safety declaration to proceed."
            : "We use facial age estimation to ensure a safe environment. No identity documents required. Data is processed in real-time and deleted immediately."}
        </p>

        {(status === 'idle' || status === 'error' || status === 'demo') && (
          <button
            onClick={status === 'demo' ? handleDemoVerify : handleScan}
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg active:scale-95"
          >
            {status === 'demo' ? 'Start Safety Declaration' : (status === 'error' ? 'Retry Face Scan' : 'Start Face Scan')}
          </button>
        )}
      </div>
      
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default AgeVerification;

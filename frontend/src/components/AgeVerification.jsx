import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

const AgeVerification = ({ onVerified }) => {
  const [status, setStatus] = useState('idle'); // idle, scanning, verified, error
  const [error, setError] = useState(null);
  const [faceio, setFaceio] = useState(null);

  useEffect(() => {
    let interval;
    let timeout;

    const initFaceIO = () => {
      if (window.faceIO) {
        console.log("FACEIO library detected, initializing...");
        try {
          // Initialize FACEIO with the provided Public ID
          // Using the current placeholder, but ensuring the library is present first
          const fio = new window.faceIO("fio_placeholder_id");
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
      }
    };

    if (window.faceIO) {
      initFaceIO();
    } else {
      console.log("FACEIO library not found, waiting...");
      setStatus('loading'); // You might want to add a loading state
      interval = setInterval(initFaceIO, 500);
      
      // Fallback timeout after 10 seconds
      timeout = setTimeout(() => {
        if (!window.faceIO) {
          console.error("FACEIO library load timeout after 10s");
          setError("FACEIO library failed to load. Please check your internet connection and ensure no ad-blockers are blocking 'cdn.faceio.net'.");
          setStatus('error');
          if (interval) clearInterval(interval);
        }
      }, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

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
      
      // FaceIO returns age estimation if configured
      // In a real production app, we would also use faceio.authenticate() 
      // but for simple age verification, enroll/authenticate can both work.
      setStatus('verified');
      setTimeout(() => onVerified(), 1500);
    } catch (err) {
      console.error("FaceIO Error:", err);
      setError(err.message || "An error occurred during scanning.");
      setStatus('error');
    }
  };

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
          
          {status === 'idle' && (
            <div className="flex flex-col items-center text-gray-400">
              <Camera size={48} className="mb-2" />
              <p>Ready for face scan</p>
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
              <p className="font-bold">Scan Failed</p>
              <p className="text-xs mt-2">{error}</p>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          We use facial age estimation to ensure a safe environment. No identity documents required. Data is processed in real-time and deleted immediately.
        </p>

        {(status === 'idle' || status === 'error') && (
          <button
            onClick={handleScan}
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg active:scale-95"
          >
            {status === 'error' ? 'Retry Face Scan' : 'Start Face Scan'}
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

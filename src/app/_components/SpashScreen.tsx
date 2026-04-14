'use client'
import React, { useEffect, useState } from 'react';
import logo from '../../../public/logo.png'
import Image from 'next/image';

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#fafcfe]">
      {/* Background Subtle Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Rectangular Logo Section */}
        <div className="relative w-72 h-32 flex items-center justify-center mb-12 animate-[scaleIn_0.8s_ease-out]">
          <div className="w-full h-full bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,148,207,0.12)] flex items-center justify-center border border-slate-100 p-6">
            <div className="flex items-center gap-3">
            
              <div className="flex flex-col">
                <Image
                  alt="logo"
                  src={logo}
                  width={140}
                  height={40}
                  className="w-40 md:w-56 h-auto transition-opacity hover:opacity-90"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Simplified Horizontal Loader Section */}
        <div className="w-full max-w-[280px] text-center">
          <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3 shadow-inner">
            <div
              className="h-full bg-linear-to-r from-primary to-secondary transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect for the loader */}
              <div className="absolute inset-0 bg-white/30 animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              System Initializing...
            </span>
            <span className="text-[10px] font-mono font-bold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Version Tag at Bottom */}
      <div className="absolute bottom-10 text-[10px] font-medium text-slate-300 tracking-widest uppercase">
        Version 1.0.0 • Secured Environment
      </div>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.92); opacity: 0; filter: blur(10px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;

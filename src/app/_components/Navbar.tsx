'use client'
import React, { useState } from 'react';
import { cn } from '../_utils/cn/cn';
import Button from './Button';
import Image from 'next/image';
import logo from '../../../public/logo.png'

const Navbar = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/sign-out', {
        method: 'POST',
      });
      
      if (res.ok) {
        localStorage.removeItem("normalDemographicData")
        localStorage.removeItem("researchDemographicData")
        localStorage.removeItem("user_id")
        localStorage.removeItem("entryId")
        console.log("demographicData and researchDemographicData successfully removed")
        // Redirect to sign-in page
        window.location.href = '/sign-in';
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error during sign out:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSelectionRedirect = () => {
    window.location.href = '/';
  };

  return (
    <section className="z-50 w-full">
      <nav className="h-20 md:h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 sm:px-12 shadow-sm shadow-blue-900/5">

        {/* Logo Placeholder - Matches the branding theme */}
        <div className="flex relative items-center">
          <Image
            alt="logo"
            src={logo}
            width={140}
            height={40}
            className="w-45 md:w-56 h-auto transition-opacity hover:opacity-90"
            priority
          />
          <span className="absolute -top-1 -right-6 text-[10px] font-bold text-primary tracking-wider  px-1.5 py-0.5 rounded-md border border-slate-100 shadow-sm">
            v1.0.6
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-auto px-6 py-2.5 text-sm rounded-xl"
          >
            <span className="flex items-center gap-2">
              {isLoggingOut ? (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              )}
              {isLoggingOut ? 'Leaving...' : 'Sign out'}
            </span>
          </Button>
        </div>
      </nav>

      {/* Floating bottom-right navigation button */}
      <button
        className="fixed bottom-8 right-8 w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center cursor-pointer z-50 shadow-[0_20px_50px_-12px_rgba(0,148,207,0.25)] border border-slate-50 transition-all hover:scale-110 hover:shadow-2xl hover:-translate-y-1 active:scale-95 group"
        onClick={handleSelectionRedirect}
        aria-label="Go to Selection"
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0094cf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </div>
        {/* Subtle hover pulse */}
        <div className="absolute inset-0 rounded-[1.5rem] bg-primary/5 animate-pulse -z-10 opacity-0 group-hover:opacity-100"></div>
      </button>
    </section>
  );
};

export default Navbar;




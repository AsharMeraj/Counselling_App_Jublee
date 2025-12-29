
'use client'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useEPDSResult } from '../../_context/EPDSResult'
import logo from '../../../public/logo.png'
import Button from './Button'

const Navbar = () => {
  const { setShowGHQ } = useEPDSResult();
  const router = useRouter();

  // Color constants to match the Results Dashboard theme

  return (
    <section className="top-0 z-50">
      <main className="h-25 md:h-30  bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-10 shadow-sm shadow-slate-200/50">
        {/* Logo Container */}
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
        <span>
          <Button
            onClick={() => {
              router.push('/');
              setShowGHQ(false);
            }}
          >
            Sign out
          </Button>
        </span>
      </main>

      {/* Floating bottom-right navigation button */}
      <div
        className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center cursor-pointer z-50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-50 transition-all hover:scale-110 hover:shadow-2xl active:scale-90"
        onClick={() => router.push('/selection')}
        title="Go to Selection"
      >
        <div className="relative w-7 h-7 sm:w-9 sm:h-9">
          <Image
            src="/BackBlue.png"
            alt="Back"
            fill
            className="object-contain"
          />
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500/5 animate-ping -z-10 opacity-0 hover:opacity-100"></div>
      </div>
    </section>
  );
};

export default Navbar;

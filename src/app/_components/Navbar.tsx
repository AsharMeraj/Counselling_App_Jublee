'use client'
import Image from 'next/image'
import React from 'react'
import logo from '../../../public/logo.png'
import back from '../../../public/BackBlue.png'
import { useRouter } from 'next/navigation'
import { useEPDSResult } from '../_context/EPDSResult'
import Button from './Button'

const Navbar = () => {
  const { setShowGHQ } = useEPDSResult();
  const router = useRouter();

  return (
    <section className="">
      <main className="h-20 sm:h-30 bg-white flex items-center justify-between sm:px-6 px-3">
        <Image
          alt="logo"
          src={logo}
          className="aspect-square w-45 h-13 sm:w-70 sm:h-20"
        />
        <Button
          onClick={() => {
            router.push('/');
            setShowGHQ(false);
          }}
          className="w-fit px-4 sm:px-6 text-sm sm:text-lg my-auto"
        >
          Sign out
        </Button>
      </main>

      {/* Floating bottom-left image button */}
      <div
        className="bg-white rounded-full fixed bottom-4 right-4 w-14 h-14 sm:w-18 sm:h-18 cursor-pointer z-50"
        onClick={() => router.push('/selection')}
      >
        <Image
          src={back}
          alt="Go to Selection"
          fill
          className="object-contain"
        />
      </div>
    </section>
  );
};

export default Navbar;

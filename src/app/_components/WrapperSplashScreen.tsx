'use client'
import React, { useState, useEffect } from 'react';
import SplashScreen from './SpashScreen';


const WrapperSplashScreen= ({children}:{children: React.ReactNode}) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Initializing state for simulation
    
    // Timer to hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showSplash && <SplashScreen />}
      
      {/* The main app content only fades in after splash is gone */}
      <div className={`transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        {!showSplash && (
          <>
            {children}
          </>
        )}
      </div>
    </div>
  );
};

export default WrapperSplashScreen;

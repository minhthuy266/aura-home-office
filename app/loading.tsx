import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#FAFAF7] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative">
        {/* Main Golden Circle */}
        <div className="w-16 h-16 rounded-full border-t-2 border-[#C4A265] border-r-2 border-transparent animate-spin"></div>
        
        {/* Inner Static Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#C4A265]/10 animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-8">
        <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-[#C4A265] opacity-50 animate-pulse">
          Curating Atmosphere
        </span>
      </div>
    </div>
  );
}

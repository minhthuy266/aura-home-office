import React from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

export default function Logo({ className = "", isDark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Gold Geometric Mark */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-xl rotate-45 transition-all duration-700 group-hover:rotate-[60deg] ${
          isDark 
            ? 'bg-gradient-to-br from-[#C4A265] to-[#A68B4B]' 
            : 'bg-gradient-to-br from-[#C4A265] to-[#D4AF37]'
        }`}></div>
        <span className="relative z-10 text-white font-display text-sm font-bold leading-none">A</span>
      </div>

      <div className="flex flex-col">
        <span className={`text-lg font-display font-bold leading-none tracking-tight transition-colors duration-500 ${
          isDark ? 'text-[#1A1A1A] group-hover:text-[#C4A265]' : 'text-white'
        }`}>
          Aura
        </span>
        <span className={`text-[8px] uppercase tracking-[0.22em] font-semibold mt-0.5 ${
          isDark ? 'text-[#9A9A9A]' : 'text-white/60'
        }`}>
          Home Office
        </span>
      </div>
    </div>
  );
}

import React from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

/**
 * Logo — DESIGN.md §8 Navigation
 * 
 * .nav__logo: Playfair Display, 800 weight, text-xl
 * isDark=true means dark text (for light backgrounds)
 * isDark=false means light text (for dark backgrounds like footer)
 */
export default function Logo({ className = "", isDark = true }: LogoProps) {
  const textColor = isDark ? 'var(--color-text-primary)' : 'var(--color-text-inverse)';
  const subColor = isDark ? 'var(--color-text-muted)' : 'rgba(245,243,240,0.6)';
  const iconBg = 'var(--color-accent)';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Mark */}
      <div style={{
        width: '36px',
        height: '36px',
        background: iconBg,
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Monitor */}
          <rect x="6" y="4" width="12" height="8" rx="1" />
          <path d="M12 12v4" />
          <path d="M9 16h6" />
          {/* Desk */}
          <path d="M3 16h18" strokeWidth="3" />
          <path d="M5 16v6" strokeWidth="3" />
          <path d="M19 16v6" strokeWidth="3" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col justify-center">
        {/* Brand name — Playfair Display (nav__logo spec) */}
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-xl)',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: 'var(--tracking-display)',
          color: textColor,
        }}>
          Aura
        </span>
        {/* Sub — JetBrains Mono, uppercase */}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          fontWeight: 400,
          textTransform: 'uppercase' as const,
          letterSpacing: 'var(--tracking-ribbon)',
          lineHeight: 1,
          color: subColor,
          marginTop: '3px',
        }}>
          Home Office
        </span>
      </div>
    </div>
  );
}

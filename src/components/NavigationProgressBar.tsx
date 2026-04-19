"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgressBar — Premium UX
 * Shows a thin top progress bar during route transitions.
 * Inspired by NProgress but optimized for App Router.
 */
export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  // We use this effect to "finish" the animation when the URL actually changes
  useEffect(() => {
    setIsAnimating(false);
    setProgress(0);
  }, [pathname, searchParams]);

  // To catch the START of a transition, we'd ideally wrap all Links,
  // but a simpler way for UX is to handle click events globally or 
  // just rely on the fact that Next.js is fast.
  
  // Actually, without wrapping all Links in useTransition, it's hard to 
  // catch the exact start in App Router without monkey-patching.
  
  // However, we can add a global click listener to start a "fake" progress
  // if the click is on a Link.
  
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (
        anchor && 
        anchor.href && 
        anchor.href.startsWith(window.location.origin) && 
        !anchor.target &&
        anchor.href !== window.location.href // Only for new pages
      ) {
        setIsAnimating(true);
        setProgress(30);
        
        // Slow increment
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + (90 - prev) * 0.1;
          });
        }, 150);
        
        return () => clearInterval(interval);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  if (!isAnimating) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "2px",
        background: "var(--color-accent)",
        width: `${progress}%`,
        zIndex: 9999,
        transition: "width 0.4s ease",
        boxShadow: "0 0 10px var(--color-accent)",
        pointerEvents: "none",
      }}
    />
  );
}

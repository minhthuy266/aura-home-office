'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

/**
 * PostInteractive — Client-only interactive layer
 *
 * Handles ONLY:
 * - Reading progress bar
 * - TOC active-heading sync (scroll spy)
 * - Mobile TOC toggle
 *
 * All article content is rendered server-side by PostArticle.
 */
export default function PostInteractive({ toc }: { toc: TOCItem[] }) {
  const progressRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<string>('');
  const tocLinksRef = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  // Scroll spy — progress bar + TOC highlight
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        if (progressRef.current) {
          progressRef.current.style.width = `${progress}%`;
        }

        if (toc.length > 0) {
          const headerOffset = 250;
          let currentId = '';

          for (const item of toc) {
            const element = document.getElementById(item.id);
            if (element) {
              const top = element.getBoundingClientRect().top;
              if (top <= headerOffset) {
                currentId = item.id;
              } else {
                break;
              }
            }
          }

          if (currentId !== activeIdRef.current) {
            const prevLink = tocLinksRef.current.get(activeIdRef.current);
            if (prevLink) {
              prevLink.style.borderLeftColor = 'transparent';
              prevLink.style.color = 'var(--color-text-muted)';
              prevLink.style.fontWeight = '400';
            }
            const newLink = tocLinksRef.current.get(currentId);
            if (newLink) {
              newLink.style.borderLeftColor = 'var(--color-accent)';
              newLink.style.color = 'var(--color-text-primary)';
              newLink.style.fontWeight = '600';
            }
            activeIdRef.current = currentId;
          }
        }

        timeoutId = undefined as any;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [toc]);

  const scrollToHeading = (id: string, isMobile: boolean = false) => {
    if (isMobile) {
      setIsMobileTocOpen(false);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 10);
    } else {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        ref={progressRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          background: 'var(--color-accent)',
          zIndex: 100,
          width: '0%',
          pointerEvents: 'none',
        }}
      />

      {/* Desktop TOC — Left Sidebar */}
      <aside className="lg:col-span-2 lg:sticky lg:top-32 order-1 px-4 lg:px-0">
        <div
          className="hidden lg:block scrollbar-hide"
          style={{
            maxHeight: 'calc(100vh - 140px)',
            overflowY: 'auto',
            paddingBottom: '16px',
          }}
        >
          {/* TOC Label — JetBrains Mono */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: 'var(--tracking-ribbon)',
              textTransform: 'uppercase' as const,
              color: 'var(--color-text-muted)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            CONTENTS
          </span>
          <nav style={{ borderLeft: '1px solid var(--color-border-subtle)' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {toc.map((item) => (
                <li key={item.id} style={{ position: 'relative' }}>
                  <a
                    href={`#${item.id}`}
                    ref={(el) => {
                      if (el) tocLinksRef.current.set(item.id, el);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHeading(item.id);
                    }}
                    style={{
                      display: 'block',
                      padding: '7px 0 7px ' + (item.level === 3 ? '24px' : '12px'),
                      fontFamily: 'var(--font-ui)',
                      fontSize: item.level === 3 ? 'var(--text-xs)' : 'var(--text-sm)',
                      lineHeight: 1.5,
                      color: 'var(--color-text-muted)',
                      textDecoration: 'none',
                      borderLeft: '2px solid transparent',
                      marginLeft: '-1px',
                    }}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile TOC toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
              Table of Contents
            </span>
            <ChevronDown
              size={16}
              style={{ transform: isMobileTocOpen ? 'rotate(180deg)' : 'none' }}
            />
          </button>
          {isMobileTocOpen && toc.length > 0 && (
            <div
              style={{
                marginTop: '4px',
                background: 'var(--color-surface)',
                borderTop: '2px solid var(--color-rule-section)',
                borderBottom: '1px solid var(--color-border)',
                padding: '8px',
              }}
            >
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id, true)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    paddingLeft: item.level === 3 ? '24px' : '12px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {item.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

"use client";
import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

/**
 * Footer — DESIGN.md §5 / §8
 * Dark surface, inverse type, hairline rules
 */
export default function Footer() {
  const categories = [
    { label: 'Furniture', href: '/furniture' },
    { label: 'Setup', href: '/setup' },
    { label: 'Guides', href: '/guides' },
    { label: 'Standing Desks', href: '/standing-desks' },
    { label: 'Ergonomic Chairs', href: '/ergonomic-chairs' },
    { label: 'Monitor Arms', href: '/monitor-arms' },
    { label: 'Desk Accessories', href: '/desk-accessories' },
  ];

  const legal = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Affiliate Disclosure', href: '/disclosure' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer style={{
      background: 'var(--color-surface-dark)',
      color: 'var(--color-text-inverse)',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 32px 40px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-5">
            <Logo isDark={false} />
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              color: 'rgba(245,243,240,0.65)',
              lineHeight: 'var(--leading-relaxed)',
              maxWidth: '320px',
            }}>
              Independent home office buying guide. We research so you don’t waste yours.
            </p>
            {/* Mono kicker */}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 400,
              textTransform: 'uppercase' as const,
              letterSpacing: 'var(--tracking-mono)',
              color: 'rgba(245,243,240,0.45)',
            }}>
              INDEPENDENT & READER SUPPORTED
            </span>
          </div>

          {/* Categories Column */}
          <div className="md:col-span-4 md:col-start-6">
            {/* Section label — JetBrains Mono */}
            <h4 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: 'var(--tracking-ribbon)',
              color: 'var(--color-text-muted)',
              marginBottom: '20px',
            }}>Categories</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {categories.map(link => (
                <Link key={link.label} href={link.href} style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(245,243,240,0.7)',
                  textDecoration: 'none',
                  fontWeight: 400,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-inverse)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,243,240,0.7)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-3">
            <h4 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: 'var(--tracking-ribbon)',
              color: 'var(--color-text-muted)',
              marginBottom: '20px',
            }}>Company</h4>
            <div className="space-y-3">
              {legal.map(link => (
                <Link key={link.label} href={link.href} className="block" style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(245,243,240,0.7)',
                  textDecoration: 'none',
                  fontWeight: 400,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-inverse)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,243,240,0.7)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* FTC Disclosure — border-left pattern */}
        <div style={{
          marginTop: '48px',
          borderLeft: '3px solid var(--color-border-strong)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'rgba(255,255,255,0.04)',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase' as const,
            letterSpacing: 'var(--tracking-mono)',
            color: 'rgba(245,243,240,0.5)',
            lineHeight: 'var(--leading-normal)',
          }}>
            AFFILIATE DISCLOSURE — Aura Home Office is reader-supported. As an Amazon Associate we earn from qualifying purchases. We may also earn commissions from other partners when you purchase through our links, at no extra cost to you.{' '}
            <Link href="/disclosure" style={{ color: 'var(--color-accent-light)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
              Read our full disclosure →
            </Link>
          </p>
        </div>

        {/* Bottom Bar — hairline rule */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '12px',
          alignItems: 'flex-start',
        }}
        className="md:flex-row md:justify-between md:items-center"
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'rgba(245,243,240,0.35)',
            textTransform: 'uppercase' as const,
            letterSpacing: 'var(--tracking-mono)',
            fontWeight: 400,
          }}>
            © {new Date().getFullYear()} Aura Media International
          </p>
          <Link href="/terms" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'rgba(245,243,240,0.35)',
            textTransform: 'uppercase' as const,
            letterSpacing: 'var(--tracking-mono)',
            fontWeight: 400,
            textDecoration: 'none',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,243,240,0.6)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,243,240,0.35)')}
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

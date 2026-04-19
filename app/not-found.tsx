import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--color-bg)',
      padding: 'var(--space-6)',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '600px' }}>
        {/* Error Code — Mono */}
        <span style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: 'var(--text-sm)', 
          color: 'var(--color-accent)',
          fontWeight: 700,
          letterSpacing: '0.2em',
          display: 'block',
          marginBottom: 'var(--space-6)'
        }}>
          ERROR 404
        </span>

        {/* Title — Display */}
        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
          fontWeight: 900,
          lineHeight: 1,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.04em',
          marginBottom: 'var(--space-8)'
        }}>
          Lost in<br />
          <span style={{ fontStyle: 'italic', fontWeight: 400 }}>the workspace.</span>
        </h1>

        {/* Description — Body */}
        <p style={{ 
          fontFamily: 'var(--font-body)', 
          fontSize: 'var(--text-lg)', 
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-12)'
        }}>
          The page you are looking for has been moved, renamed, or simply doesn&apos;t exist in our artifacts collection.
        </p>

        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          alignItems: 'center'
        }}>
          <Link href="/" className="btn-buy" style={{ padding: '14px 28px', gap: '10px' }}>
            <Home size={18} /> Back to Homepage
          </Link>
          
          <div style={{ 
            display: 'flex', 
            gap: '24px', 
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-rule-hard)',
            width: '100%',
            justifyContent: 'center'
          }}>
            <Link href="/furniture" style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '11px', 
              color: 'var(--color-text-muted)', 
              textTransform: 'uppercase',
              textDecoration: 'none'
            }}>Furniture</Link>
            <Link href="/setup" style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '11px', 
              color: 'var(--color-text-muted)', 
              textTransform: 'uppercase',
              textDecoration: 'none'
            }}>Setups</Link>
            <Link href="/guides" style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '11px', 
              color: 'var(--color-text-muted)', 
              textTransform: 'uppercase',
              textDecoration: 'none'
            }}>Guides</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

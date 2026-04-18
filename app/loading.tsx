import React from 'react';

export default function Loading() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ position: 'relative', width: '48px', height: '48px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '2px solid var(--color-border)',
          borderTopColor: 'var(--color-accent)',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
      <span style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.625rem',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        marginTop: '24px',
      }}>
        Loading
      </span>
    </div>
  );
}

"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

type ConsentChoice = 'accepted' | 'declined';

const STORAGE_KEY = 'aura_cookie_consent';

function updateGoogleConsent(choice: ConsentChoice) {
  const granted = choice === 'accepted' ? 'granted' : 'denied';
  const gtag = (window as typeof window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }).gtag;

  if (typeof gtag !== 'function') return;

  gtag('consent', 'update', {
    ad_storage: granted,
    analytics_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
  });
}

export default function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ConsentChoice | null;
    if (stored === 'accepted' || stored === 'declined') {
      updateGoogleConsent(stored);
      return;
    }

    setIsVisible(true);
  }, []);

  const saveChoice = (choice: ConsentChoice) => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    updateGoogleConsent(choice);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Privacy choices"
      style={{
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        zIndex: 300,
        width: 'min(420px, calc(100vw - 32px))',
        background: 'white',
        border: '1px solid var(--color-rule-hard)',
        borderTop: '3px solid var(--color-accent)',
        padding: '20px',
        color: 'var(--color-text-body)',
      }}
    >
      <p
        style={{
          margin: '0 0 14px',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          lineHeight: 1.55,
        }}
      >
        Aura Home Office uses optional analytics and ad measurement to improve the site. You can accept or decline these optional signals.
      </p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => saveChoice('accepted')}
          style={{
            background: 'var(--color-text-primary)',
            color: 'white',
            border: '1px solid var(--color-text-primary)',
            padding: '10px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            cursor: 'pointer',
          }}
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => saveChoice('declined')}
          style={{
            background: 'white',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            padding: '10px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
        <Link
          href="/privacy"
          style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          }}
        >
          Privacy
        </Link>
      </div>
    </div>
  );
}

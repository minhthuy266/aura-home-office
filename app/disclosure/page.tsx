import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — Aura Home Office',
  description:
    'Read how Aura Home Office uses affiliate links, how commissions work, and how we keep editorial recommendations independent.',
  alternates: {
    canonical: 'https://aurahomeoffice.com/disclosure',
  },
  openGraph: {
    title: 'Affiliate Disclosure — Aura Home Office',
    description: 'How Aura Home Office earns commissions and keeps recommendations independent.',
    url: 'https://aurahomeoffice.com/disclosure',
    type: 'website',
  },
};

export default function DisclosurePage() {
  return (
    <main style={{ minHeight: '100vh', paddingTop: 'var(--page-pt, 160px)', paddingBottom: '96px', background: 'var(--color-bg)' }} className="[--page-pt:120px] md:[--page-pt:160px]">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 var(--space-6)' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Affiliate Disclosure',
              url: 'https://aurahomeoffice.com/disclosure',
              description: 'Affiliate disclosure for Aura Home Office.',
              publisher: {
                '@type': 'Organization',
                name: 'Aura Home Office',
                url: 'https://aurahomeoffice.com',
              },
            }),
          }}
        />

        <header style={{ marginBottom: '80px', textAlign: 'center' }}>
          <span className="kicker">Transparency</span>
          <h1 className="heading-hero" style={{ marginBottom: 'var(--space-6)' }}>Affiliate Disclosure</h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-md)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '620px',
            margin: '0 auto',
          }}>
            Aura Home Office is reader-supported. This page explains how affiliate links work and how we keep recommendations independent.
          </p>
        </header>

        <section className="prose-editorial">
          <p>
            Some links on Aura Home Office are affiliate links. If you click one of those links and make a qualifying purchase, we may earn a commission at no extra cost to you.
          </p>

          <blockquote style={{
            borderLeft: '3px solid var(--color-accent)',
            background: 'var(--color-accent-subtle)',
            padding: 'var(--space-4) var(--space-5)',
            margin: '2rem 0',
            color: 'var(--color-text-body)',
            fontFamily: 'var(--font-body)',
          }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>Amazon disclosure:</strong> As an Amazon Associate, Aura Home Office earns from qualifying purchases.
          </blockquote>

          <h2>How Affiliate Links Work</h2>
          <p>
            Affiliate links help fund our research, hosting, tools, and editorial work. We may participate in Amazon Associates and other retailer or affiliate programs. A retailer may pay us when a reader buys through a tracked link.
          </p>

          <h2>Editorial Independence</h2>
          <p>
            Affiliate relationships do not decide our rankings, conclusions, or product trade-off notes. Brands and retailers cannot pay to receive a positive verdict, hide buyer complaints, remove downsides, or control our editorial recommendations.
          </p>

          <h2>Prices and Availability</h2>
          <p>
            Product prices, availability, shipping terms, discounts, and listing details can change without notice. We may reference product information available at the time of research, but the retailer page is the final source for current price and availability.
          </p>

          <h2>Research Limits</h2>
          <p>
            Most Aura Home Office recommendations are research-based unless clearly labeled otherwise. If a product was not hands-on tested, we do not want the article to imply that it was. We rely on product specifications, listing details, warranty information, and recurring owner feedback patterns where available.
          </p>

          <h2>Questions or Corrections</h2>
          <p>
            If you spot an outdated product detail, unclear disclosure, or possible error, contact us at <a href="mailto:contact@aurahomeoffice.com">contact@aurahomeoffice.com</a>.
          </p>

          <p style={{
            marginTop: '60px',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-mono)',
          }}>
            Last updated: May 9, 2026
          </p>
        </section>
      </div>
    </main>
  );
}

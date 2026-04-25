import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — Aura Home Office',
  description:
    'Read our affiliate disclosure to understand how Aura Home Office is funded through reader-supported links, and our commitment to honest, unbiased research.',
  alternates: {
    canonical: 'https://aurahomeoffice.com/disclosure',
  },
  openGraph: {
    title: 'Affiliate Disclosure — Aura Home Office',
    description: 'How Aura Home Office earns commissions and why it never affects our recommendations.',
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
        
        {/* Editorial Header */}
        <header style={{ marginBottom: '80px', textAlign: 'center' }}>
          <span className="kicker">Transparency</span>
          <h1 className="heading-hero" style={{ marginBottom: 'var(--space-6)' }}>Affiliate Disclosure</h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-md)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Transparency and trust are the foundation of Aura Home Office. Here is everything you need to know about how we fund our research.
          </p>
        </header>

        {/* Content Section */}
        <section className="prose-editorial">
          <p>
            At Aura Home Office, we believe in being 100% transparent with our readers. Our mission is to help you build the perfect workspace, and to keep our research independent and high-quality, we participate in various affiliate marketing programs.
          </p>

          <blockquote style={{
            borderLeft: '3px solid var(--color-accent)',
            background: 'var(--color-accent-subtle)',
            padding: 'var(--space-4) var(--space-5)',
            margin: '2rem 0',
            color: 'var(--color-text-body)',
            fontFamily: 'var(--font-body)',
          }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>Official Amazon Statement:</strong> Aura Home Office is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases.
          </blockquote>

          <h2>What does this mean for you?</h2>
          <p>
            Whenever you click on a link to a product we recommend and make a purchase, we may receive a small commission from the retailer. <strong style={{ color: 'var(--color-text-primary)' }}>This comes at no absolute extra cost to you.</strong> In fact, sometimes our partnerships allow us to share exclusive deals or discounts with our community.
          </p>

          <h2>Our Editorial Integrity</h2>
          <p>
            Our recommendations are always based on one thing: <strong style={{ color: 'var(--color-text-primary)' }}>what is genuinely useful for the buyer.</strong> We spend considerable time researching and comparing gear so you don&apos;t have to. A product&apos;s affiliate status never influences our decision to recommend it. If we don&apos;t think a product is worth buying, we say so — regardless of whether it pays a commission or not.
          </p>

          <h2>Price &amp; Availability Notice</h2>
          <p>
            We use the Amazon Product Advertising API to provide you with the most accurate information possible, including images, titles, and highlights. However, please note that Amazon.com prices and availability change frequently. We recommend checking the final price on the retailer's site before completing your purchase.
          </p>

          <h2>Social Media Transparency</h2>
          <p>
            When you see us sharing gear on Instagram, Twitter, or other social platforms, we maintain the same level of honesty. Any post containing affiliate links will be clearly marked with indicators like <strong>#ad</strong> or <strong>#commissionsearned</strong>.
          </p>

          <p style={{ 
            marginTop: '60px', 
            fontFamily: 'var(--font-mono)', 
            fontSize: 'var(--text-xs)', 
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-mono)'
          }}>
            Last updated: April 18, 2026
          </p>
        </section>
      </div>
    </main>
  );
}

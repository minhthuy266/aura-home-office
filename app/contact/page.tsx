import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Aura Home Office',
  description: 'Contact Aura Home Office for corrections, product feedback, editorial questions, affiliate disclosure questions, or collaboration requests.',
  alternates: {
    canonical: 'https://aurahomeoffice.com/contact',
  },
};

export default function ContactUs() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Aura Home Office',
    url: 'https://aurahomeoffice.com/contact',
    description: 'Contact Aura Home Office for corrections, product feedback, editorial questions, and disclosure questions.',
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://aurahomeoffice.com/#organization',
      name: 'Aura Home Office',
      url: 'https://aurahomeoffice.com',
      email: 'contact@aurahomeoffice.com',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@aurahomeoffice.com',
        contactType: 'editorial support',
        availableLanguage: 'English',
      },
    },
  };

  return (
    <main style={{ minHeight: '100vh', paddingTop: 'var(--page-pt, 160px)', paddingBottom: '96px', background: 'var(--color-bg)' }} className="[--page-pt:120px] md:[--page-pt:160px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--space-6)' }}>
        <header style={{ marginBottom: '60px', textAlign: 'center' }}>
          <span className="kicker">Support</span>
          <h1 className="heading-hero" style={{ marginBottom: 'var(--space-6)' }}>Contact Aura Home Office</h1>
        </header>

        <section className="prose-editorial">
          <h2>Get in Touch</h2>
          <p>
            For corrections, product feedback, editorial questions, disclosure questions, or collaboration requests, email us at:
          </p>
          <p>
            <strong>Email:</strong> <a href="mailto:contact@aurahomeoffice.com">contact@aurahomeoffice.com</a>
          </p>

          <h2>What to Send</h2>
          <ul>
            <li>Corrections or outdated product details</li>
            <li>First-hand product ownership feedback</li>
            <li>Questions about our research or affiliate disclosure</li>
            <li>Brand or manufacturer information relevant to an existing article</li>
          </ul>

          <h2>Response Time</h2>
          <p>
            We review messages regularly and try to respond within 1-2 business days when a reply is needed.
          </p>

          <h2>Quick Links</h2>
          <ul>
            <li><Link href="/about">About Aura Home Office</Link></li>
            <li><Link href="/disclosure">Affiliate Disclosure</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}

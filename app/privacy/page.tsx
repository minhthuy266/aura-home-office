import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Aura Home Office',
  description: 'Read the Aura Home Office Privacy Policy, including analytics, cookies, affiliate links, third-party retailers, and contact information.',
  alternates: {
    canonical: 'https://aurahomeoffice.com/privacy',
  },
};

export default function PrivacyPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy',
    url: 'https://aurahomeoffice.com/privacy',
    description: 'Privacy Policy for Aura Home Office.',
    publisher: {
      '@id': 'https://aurahomeoffice.com/#organization',
    },
  };

  return (
    <main style={{ minHeight: '100vh', paddingTop: 'var(--page-pt, 160px)', paddingBottom: '96px', background: 'var(--color-bg)' }} className="[--page-pt:120px] md:[--page-pt:160px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 var(--space-6)' }}>
        
        {/* Editorial Header */}
        <header style={{ marginBottom: '80px', textAlign: 'center' }}>
          <span className="kicker">Legal</span>
          <h1 className="heading-hero" style={{ marginBottom: 'var(--space-6)' }}>Privacy Policy</h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-md)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            How Aura Home Office handles analytics, cookies, affiliate links, third-party services, and contact information.
          </p>
        </header>

        {/* Content Section */}
        <section className="prose-editorial">
          <p>
            Aura Home Office is an editorial website. This policy explains what information may be collected when you visit the site, how that information is used, and how to contact us with privacy questions.
          </p>

          <h2>Information We May Collect</h2>
          <p>
            We may collect limited information in the following categories:
          </p>
          <ul>
            <li><strong style={{ color: 'var(--color-text-primary)' }}>Technical data</strong> such as browser type, device type, pages viewed, referring pages, approximate location, and other analytics signals.</li>
            <li><strong style={{ color: 'var(--color-text-primary)' }}>Usage data</strong> such as article views, clicks, search queries on the site, and interactions with links or forms.</li>
            <li><strong style={{ color: 'var(--color-text-primary)' }}>Contact data</strong> such as your email address and message content if you contact us directly.</li>
          </ul>

          <h2>How We Use Your Data</h2>
          <p>
            We use information to operate the site, understand which content is useful, respond to messages, improve articles, maintain security, and measure affiliate link performance.
          </p>

          <h2>Cookies and Tracking</h2>
          <p>
            We may use cookies, Google Analytics 4, Google Tag Manager, advertising tags, and affiliate tracking links. These tools help us understand site usage and may help retailers attribute purchases to affiliate links. You can limit or block cookies through your browser settings.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            This website links to retailers, manufacturers, analytics providers, and other third-party websites. Those services have their own privacy policies and data practices. We do not control third-party sites after you leave Aura Home Office.
          </p>

          <h2>Affiliate Links</h2>
          <p>
            Some outbound links are affiliate links. If you click an affiliate link, the retailer or affiliate network may use cookies or similar tracking to attribute a purchase.
          </p>

          <h2>Data Retention</h2>
          <p>
            We keep contact messages only as long as reasonably needed to respond, maintain records, or improve editorial quality. Analytics and affiliate reporting data may be retained by third-party providers according to their own policies.
          </p>

          <h2>Privacy Rights</h2>
          <p>
            Depending on where you live, including certain U.S. states such as California, you may have rights to request access to, correction of, deletion of, or information about personal data associated with you. You may also have the right to opt out of certain data sharing or targeted advertising activities. To make a privacy request, contact us at <a href="mailto:contact@aurahomeoffice.com">contact@aurahomeoffice.com</a>.
          </p>

          <h2>Do Not Sell or Share</h2>
          <p>
            Aura Home Office does not sell personal information for money. Some analytics, advertising, or affiliate tools may be considered "sharing" under certain privacy laws. You can limit tracking through browser controls, privacy extensions, and available platform opt-out tools.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:contact@aurahomeoffice.com">contact@aurahomeoffice.com</a>.
          </p>

          <p style={{ 
            marginTop: '60px', 
            fontFamily: 'var(--font-mono)', 
            fontSize: 'var(--text-xs)', 
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-mono)'
          }}>
            Last updated: May 9, 2026
          </p>
        </section>
      </div>
    </main>
  );
}

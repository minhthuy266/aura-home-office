import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Aura Home Office',
  description: 'Read the Terms of Service for Aura Home Office, including permitted use, affiliate content, third-party links, and limitations.',
  alternates: {
    canonical: 'https://aurahomeoffice.com/terms',
  },
};

export default function TermsPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Service',
    url: 'https://aurahomeoffice.com/terms',
    description: 'Terms of Service for Aura Home Office.',
    publisher: {
      '@id': 'https://aurahomeoffice.com/#organization',
    },
  };

  return (
    <main style={{ minHeight: '100vh', paddingTop: 'var(--page-pt, 160px)', paddingBottom: '96px', background: 'var(--color-bg)' }} className="[--page-pt:120px] md:[--page-pt:160px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 var(--space-6)' }}>
        <header style={{ marginBottom: '80px', textAlign: 'center' }}>
          <span className="kicker">Legal</span>
          <h1 className="heading-hero" style={{ marginBottom: 'var(--space-6)' }}>Terms of Service</h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-md)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '620px',
            margin: '0 auto',
          }}>
            These terms explain how you may use Aura Home Office and how our editorial and affiliate content should be understood.
          </p>
        </header>

        <section className="prose-editorial">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using Aura Home Office, you agree to these Terms of Service. If you do not agree with these terms, please do not use the site.
          </p>

          <h2>2. Editorial Information Only</h2>
          <p>
            Aura Home Office publishes research, buying guides, comparisons, and opinionated editorial content about home office products. The content is for general informational purposes only and is not professional medical, ergonomic, legal, financial, or safety advice.
          </p>

          <h2>3. Product Information</h2>
          <p>
            We work to keep product details useful and current, but product listings, prices, availability, warranties, specifications, and retailer policies can change. Always confirm important details directly with the retailer or manufacturer before purchasing.
          </p>

          <h2>4. Affiliate Links</h2>
          <p>
            Some links may be affiliate links. We may earn a commission from qualifying purchases at no extra cost to you. Read our <Link href="/disclosure">Affiliate Disclosure</Link> for more detail.
          </p>

          <h2>5. Permitted Use</h2>
          <p>
            You may read, share, and link to our public pages for personal or editorial use. You may not copy, scrape, republish, sell, or redistribute substantial portions of the site without permission.
          </p>

          <h2>6. Third-Party Sites</h2>
          <p>
            Aura Home Office links to retailers, manufacturers, and other third-party websites. We do not control those websites and are not responsible for their content, policies, pricing, availability, shipping, returns, or data practices.
          </p>

          <h2>7. No Warranties</h2>
          <p>
            The site is provided on an "as is" and "as available" basis. We do not guarantee that every article, product detail, or link will always be complete, current, uninterrupted, or error-free.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Aura Home Office is not liable for losses or damages arising from your use of the site, reliance on editorial content, purchases made through third-party retailers, or issues with third-party products or services.
          </p>

          <h2>9. Informal Resolution</h2>
          <p>
            If you have a concern about the site, please contact us first at <a href="mailto:contact@aurahomeoffice.com">contact@aurahomeoffice.com</a> so we can review the issue and try to resolve it informally.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These terms are governed by applicable laws of the United States, without regard to conflict-of-law rules, unless a different rule is required by law in your location.
          </p>

          <h2>11. Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. The updated version will be posted on this page with a revised date.
          </p>

          <h2>12. Contact</h2>
          <p>
            Questions about these terms can be sent to <a href="mailto:contact@aurahomeoffice.com">contact@aurahomeoffice.com</a>. Please also read our <Link href="/privacy">Privacy Policy</Link>.
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

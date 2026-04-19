import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Privacy Policy of Aura Home Office. Learn how we collect, use, store, and protect your personal data when you visit our website.',
};

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', paddingTop: '96px', paddingBottom: '96px', background: 'var(--color-bg)' }}>
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
            How we collect, use, and protect your data across the Aura Home Office platform.
          </p>
        </header>

        {/* Content Section */}
        <section className="prose-editorial">
          <p>
            At Aura Home Office, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>

          <h2>Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul>
            <li><strong style={{ color: 'var(--color-text-primary)' }}>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong style={{ color: 'var(--color-text-primary)' }}>Contact Data</strong> includes email address and telephone numbers.</li>
            <li><strong style={{ color: 'var(--color-text-primary)' }}>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong style={{ color: 'var(--color-text-primary)' }}>Usage Data</strong> includes information about how you use our website, products and services.</li>
          </ul>

          <h2>How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2>Cookies and Tracking</h2>
          <p>
            You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly. We use basic analytics tools to understand how our users interact with our content, which allows us to improve the reading experience.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our website, we encourage you to read the privacy policy of every website you visit.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:hello@aurahomeoffice.com">hello@aurahomeoffice.com</a>.
          </p>

          <p style={{ 
            marginTop: '60px', 
            fontFamily: 'var(--font-mono)', 
            fontSize: 'var(--text-xs)', 
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-mono)'
          }}>
            Last updated: April 19, 2026
          </p>
        </section>
      </div>
    </main>
  );
}

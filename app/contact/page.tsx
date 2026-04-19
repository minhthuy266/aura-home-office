import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Aura Home Office. We are here to help with any questions about home office reviews, ergonomic ratings, gear deals, or site features.',
};

export default function ContactUs() {
  return (
    <main style={{ minHeight: '100vh', paddingTop: '96px', paddingBottom: '96px', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--space-6)' }}>
        
        {/* Editorial Header */}
        <header style={{ marginBottom: '60px', textAlign: 'center' }}>
          <span className="kicker">Support</span>
          <h1 className="heading-hero" style={{ marginBottom: 'var(--space-6)' }}>Contact Us</h1>
        </header>

        {/* Content Section */}
        <section className="prose-editorial">
          <h2>Contact Aura Home Office</h2>
          <p>
            We’re here to help with any questions about home office reviews, ergonomic ratings, gear deals, or site features.
          </p>
          <p>
            Feel free to reach out – we love connecting with fellow remote workers, designers, and readers.
          </p>

          <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid var(--color-rule-hard)' }} />

          <h2>Get in Touch</h2>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:contact@aurahomeoffice.com">contact@aurahomeoffice.com</a></li>
            <li><strong>Website:</strong> <a href="https://aurahomeoffice.com">https://aurahomeoffice.com</a></li>
          </ul>

          <h2>Our Address</h2>
          <p>
            CooWorking 244 5th Ave #2<br />
            New York, NY 10001<br />
            Phone: (212) 726-1002
          </p>

          <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid var(--color-rule-hard)' }} />

          <h2>Quick Links</h2>
          <ul>
            <li><Link href="/">Back to Home</Link> – Explore our latest ergonomic reviews and setups</li>
            <li>Learn more on our <Link href="/about">About page</Link></li>
            <li>Read our <Link href="/privacy">Privacy Policy</Link></li>
            <li>View the <Link href="/disclosure">Affiliate Disclosure</Link></li>
          </ul>

          <p style={{ marginTop: '40px' }}>
            <em>We typically respond to emails within 1-2 business days. Thank you for visiting AuraHomeOffice.com!</em>
          </p>
          
          <p><strong>Happy working and building!</strong></p>

        </section>
      </div>
    </main>
  );
}

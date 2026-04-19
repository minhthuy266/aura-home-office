import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the Terms of Service for Aura Home Office. Understand your rights and responsibilities when using our website and services.',
};

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', paddingTop: '96px', paddingBottom: '96px', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 var(--space-6)' }}>
        
        {/* Editorial Header */}
        <header style={{ marginBottom: '80px', textAlign: 'center' }}>
          <span className="kicker">Legal</span>
          <h1 className="heading-hero" style={{ marginBottom: 'var(--space-6)' }}>Terms of Service</h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-md)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Please read these terms carefully before using the Aura Home Office platform.
          </p>
        </header>

        {/* Content Section */}
        <section className="prose-editorial">
          <h2>1. Terms</h2>
          <p>
            By accessing this website, accessible from aurahomeoffice.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on Aura Home Office's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose or for any public display;</li>
            <li>attempt to reverse engineer any software contained on Aura Home Office's website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transferring the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2>3. Disclaimer</h2>
          <p>
            All the materials on Aura Home Office’s website are provided "as is". Aura Home Office makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Aura Home Office does not make any representations concerning the accuracy or reliability of the use of the materials on its website or otherwise relating to such materials or any sites linked to this website.
          </p>

          <h2>4. Limitations</h2>
          <p>
            Aura Home Office or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Aura Home Office’s website, even if Aura Home Office or an authorize representative of this website has been notified, orally or in writing, of the possibility of such damage. 
          </p>

          <h2>5. Revisions and Errata</h2>
          <p>
            The materials appearing on Aura Home Office’s website may include technical, typographical, or photographic errors. Aura Home Office will not promise that any of the materials in this website are accurate, complete, or current. Aura Home Office may change the materials contained on its website at any time without notice.
          </p>

          <h2>6. Links</h2>
          <p>
            Aura Home Office has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by Aura Home Office of the site. The use of any linked website is at the user’s own risk.
          </p>

          <h2>7. Site Terms of Use Modifications</h2>
          <p>
            Aura Home Office may revise these Terms of Use for its website at any time without prior notice. By using this website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.
          </p>

          <h2>8. Your Privacy</h2>
          <p>
            Please read our <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            Any claim related to Aura Home Office's website shall be governed by the laws of US without regards to its conflict of law provisions.
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

import React from 'react';
import Link from 'next/link';
import { Search, Target, ShieldCheck, Coffee } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Aura Home Office — Independent Home Office Buying Guide',
  description:
    'Learn about Aura Home Office. We are an independent home office buying guide helping real people find gear that fits their space, budget, and routine — without wasting money on the wrong products.',
  alternates: {
    canonical: 'https://aurahomeoffice.com/about',
  },
  openGraph: {
    title: 'About Aura Home Office — Independent Buying Guide',
    description:
      'Honest research on home office gear. No paid rankings. No fake testing. Practical advice on what fits your space and budget.',
    url: 'https://aurahomeoffice.com/about',
    type: 'website',
    siteName: 'Aura Home Office',
  },
  twitter: {
    card: 'summary',
    title: 'About Aura Home Office',
    description: 'Independent home office buying research. No paid rankings. No fake testing.',
  },
};

const monoLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-xs)',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 'var(--tracking-mono)',
};

const bodyMd: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-md)',
  color: 'var(--color-text-secondary)',
  lineHeight: 'var(--leading-relaxed)',
};

const bodyBase: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-base)',
  color: 'var(--color-text-secondary)',
  lineHeight: 'var(--leading-relaxed)',
};

export default function AboutPage() {
  const evidenceLabels = [
    {
      title: 'Research-Based',
      desc: 'The recommendation is built from product specifications, listing details, manufacturer information, and available buyer feedback.',
    },
    {
      title: 'Owner Feedback-Based',
      desc: 'The recommendation relies heavily on recurring patterns from buyer reviews and owner comments.',
    },
    {
      title: 'Showroom Checked',
      desc: 'The product was inspected in person but not long-term tested.',
    },
    {
      title: 'Hands-On Tested',
      desc: 'The product was physically used, assembled, or tested before publication.',
    },
  ];

  const desks = [
    {
      icon: <Search size={20} />,
      title: 'Research Desk',
      desc: 'Focuses on product specs, dimensions, materials, weight capacity, warranty terms, owner feedback, comparison tables, and the small technical details that can make or break a purchase.',
      accent: true,
    },
    {
      icon: <Target size={20} />,
      title: 'Workspace Fit Desk',
      desc: 'Looks at how a product fits into real home offices: small rooms, apartments, shared spaces, desk clutter, lighting, cable management, aesthetics, and daily usability.',
      accent: false,
    },
    {
      icon: <ShieldCheck size={20} />,
      title: 'Editorial Review Desk',
      desc: 'Turns the research into practical buying guides. This step focuses on search intent, product fit, clear verdicts, internal linking, affiliate transparency, and whether the article actually helps a reader make a better decision.',
      accent: false,
    },
  ];

  return (
    <main
      style={{ minHeight: '100vh', paddingTop: 'var(--page-pt, 160px)', paddingBottom: '96px', background: 'var(--color-bg)' }}
      className="[--page-pt:120px] md:[--page-pt:160px]"
    >
      {/* AboutPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Aura Home Office',
            url: 'https://aurahomeoffice.com/about',
            description:
              'Independent home office buying guide. Structured buying research on desks, chairs, monitor arms, and workspace gear.',
            publisher: {
              '@type': 'Organization',
              name: 'Aura Home Office',
              url: 'https://aurahomeoffice.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://aurahomeoffice.com/og-image.jpg',
              },
            },
          }),
        }}
      />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 var(--space-6)' }}>

        {/* ── Hero Header ── */}
        <header style={{ marginBottom: '80px', textAlign: 'center' }}>
          <span style={{ ...monoLabel, color: 'var(--color-accent)', display: 'block', marginBottom: 'var(--space-5)' }}>
            About Aura Home Office
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, var(--text-4xl))',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-display)',
            marginBottom: 'var(--space-4)',
          }}>
            We do the research<br />so you don&apos;t waste yours.
          </h1>
          <time
            dateTime="2026-04-18"
            style={{ ...monoLabel, color: 'var(--color-text-muted)', fontWeight: 400, display: 'block', marginBottom: 'var(--space-6)' }}
          >
            Last updated: April 2026
          </time>
          <p style={{ ...bodyMd, maxWidth: '620px', margin: '0 auto 16px' }}>
            Aura Home Office is an independent home office buying guide for people building better workspaces at home. We cover standing desks, ergonomic chairs, monitor arms, desk lighting, cable management, storage, and the small accessories that make daily work feel less painful.
          </p>
          <p style={{ ...bodyMd, maxWidth: '620px', margin: '0 auto 24px' }}>
            We are not here to publish another vague &quot;best of&quot; list stuffed with random products. Our goal is simple: help you understand what is worth buying, what trade-offs to expect, and which product fits your space, budget, and daily routine.
          </p>
        </header>

        {/* ── Who This Is For ── */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{
            border: '1px solid var(--color-border-subtle)',
            background: 'var(--color-surface)',
            padding: '48px',
          }}>
            <span style={{ ...monoLabel, color: 'var(--color-accent)', display: 'block', marginBottom: '16px' }}>
              Who This Is For
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: 'var(--tracking-display)',
              marginBottom: '20px',
            }}>
              Aura Home Office is for people who want a better workspace without wasting hours comparing specs.
            </h2>
            <p style={{ ...bodyBase, marginBottom: '20px' }}>
              This site is especially useful if you are:
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {[
                'Working from a small apartment, spare bedroom, or shared space',
                'Trying to choose a standing desk, ergonomic chair, monitor arm, or workspace accessory',
                'Comparing products that look similar but have different trade-offs',
                'Trying to avoid weak frames, confusing assembly, poor storage, cable clutter, or vague warranty details',
                'Looking for practical buying advice instead of hype',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: 'var(--color-accent)',
                    flexShrink: 0, marginTop: '8px',
                  }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p style={{ ...bodyBase, color: 'var(--color-text-primary)', fontWeight: 600, margin: 0 }}>
              We are not here to tell everyone to buy the most expensive option. Sometimes the right pick is the compact desk that actually fits your room, the chair with better adjustability, or the storage solution that keeps your workspace usable.
            </p>
          </div>
        </section>

        {/* ── Our Story ── */}
        <section className="grid lg:grid-cols-2 gap-16 items-start" style={{ marginBottom: '80px' }}>
          <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200"
              alt="A clean, organized home office desk setup with a monitor, plant, and desk lamp"
              style={{ objectFit: 'cover', height: '100%', width: '100%' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)' }} />
          </div>
          <div>
            <span style={{ ...monoLabel, color: 'var(--color-accent)', display: 'block', marginBottom: '12px' }}>
              Our Story
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: 'var(--tracking-display)',
              marginBottom: '24px',
            }}>
              Built around a problem remote workers know too well.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ ...bodyMd, margin: 0 }}>
                A kitchen table becomes a desk. A laptop screen sits too low. Cables take over the floor. By lunch, the setup already feels uncomfortable. Then you search for &quot;best ergonomic chair&quot; or &quot;best standing desk&quot; and find the same generic affiliate lists repeating product titles without explaining what actually matters.
              </p>
              <p style={{ ...bodyMd, margin: 0, color: 'var(--color-text-primary)', fontWeight: 600 }}>
                We wanted something more useful.
              </p>
              <p style={{ ...bodyMd, margin: 0 }}>
                So we built Aura Home Office around structured buying research: comparing product specs, reading owner feedback, checking listing details, looking for repeated complaints, and explaining who each product is really for.
              </p>
              <p style={{ ...bodyMd, margin: 0 }}>
                Most recommendations on Aura Home Office are research-based unless clearly labeled otherwise. We do not pretend a product was hands-on tested when it was not.
              </p>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-rule-hard)', marginBottom: '80px' }} />

        {/* ── How We Work ── */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ ...monoLabel, color: 'var(--color-accent)', display: 'block', marginBottom: '12px' }}>
              How We Work
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, var(--text-2xl))',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: 'var(--tracking-display)',
            }}>
              Research First
            </h2>
          </div>

          {/* Research checklist */}
          <div className="grid md:grid-cols-2 gap-12" style={{ marginBottom: '64px' }}>
            <div>
              <p style={{ ...bodyBase, marginBottom: '16px' }}>
                Before a product makes one of our guides, we look at the details that matter in real home offices:
              </p>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', ...bodyBase, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Size and footprint</li>
                <li>Height range and adjustability</li>
                <li>Weight capacity and stability signals</li>
                <li>Materials and frame design</li>
                <li>Storage and cable management</li>
                <li>Assembly expectations</li>
                <li>Warranty clarity</li>
                <li>Owner feedback patterns</li>
                <li>Common complaints</li>
              </ul>
            </div>
            <div>
              <p style={{ ...bodyBase, marginBottom: '16px' }}>
                For each product, we ask practical buying questions:
              </p>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', ...bodyBase, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Will this fit a small apartment or spare bedroom?</li>
                <li>Is the height range usable for both sitting and standing?</li>
                <li>Does the frame look suitable for monitors and daily work?</li>
                <li>Are the drawers, shelves, outlets, or cable features actually useful?</li>
                <li>Do buyers repeatedly mention wobble, missing parts, unclear instructions, weak materials, or poor support?</li>
              </ul>
            </div>
          </div>

          {/* Structured Research callout */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            padding: '40px',
            marginBottom: '64px',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: '16px',
            }}>
              Structured Research, Not Random Lists
            </h3>
            <p style={{ ...bodyBase, marginBottom: '12px' }}>
              Aura Home Office uses structured research workflows to organize product details, compare specifications, summarize buyer feedback, and draft research notes.
            </p>
            <p style={{ ...bodyBase, color: 'var(--color-text-primary)', fontWeight: 600, margin: 0 }}>
              Our editorial standard is simple: research should explain the available evidence, not invent experience. If a product was not physically tested, our content should not sound like it was.
            </p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-rule-hard)', marginBottom: '64px' }} />

          {/* Owner Feedback + Picks side by side */}
          <div className="grid md:grid-cols-2 gap-12" style={{ marginBottom: '64px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px' }}>
                Owner Feedback Matters
              </h3>
              <p style={{ ...bodyBase, marginBottom: '12px' }}>
                Specs tell only part of the story. A desk can look great on paper and still wobble. A chair can claim lumbar support and still feel wrong after a few hours.
              </p>
              <p style={{ ...bodyBase, marginBottom: '12px' }}>
                That is why we pay attention to repeated feedback from people who actually bought and used the product.
              </p>
              <p style={{ ...bodyBase, color: 'var(--color-text-primary)', fontWeight: 600 }}>
                Our job is not to repeat every review. Our job is to turn owner feedback into practical buying advice.
              </p>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px' }}>
                No Paid Rankings
              </h3>
              <p style={{ ...bodyBase, marginBottom: '12px' }}>
                Aura Home Office is reader-supported, but affiliate commissions do not decide our rankings.
              </p>
              <p style={{ ...bodyBase, marginBottom: '4px', color: 'var(--color-text-primary)', fontWeight: 600 }}>Brands cannot pay to get a positive verdict.</p>
              <p style={{ ...bodyBase, marginBottom: '4px', color: 'var(--color-text-primary)', fontWeight: 600 }}>They cannot pay to hide trade-offs.</p>
              <p style={{ ...bodyBase, marginBottom: '12px', color: 'var(--color-text-primary)', fontWeight: 600 }}>They cannot pay to remove common complaints.</p>
              <p style={{ ...bodyBase }}>
                If a product has weak materials, confusing assembly, unclear warranty coverage, misleading photos, limited buyer feedback, or repeated complaints, we call that out.
              </p>
            </div>
          </div>

          {/* Evidence Labels */}
          <div style={{ background: 'var(--color-surface)', padding: '40px', border: '1px solid var(--color-border)', marginBottom: '64px' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: '8px',
              textAlign: 'center',
            }}>
              Our Evidence Labels
            </h3>
            <p style={{ ...bodyBase, textAlign: 'center', maxWidth: '560px', margin: '0 auto 32px' }}>
              You may see these labels across Aura Home Office:
            </p>
            <div className="grid sm:grid-cols-2 gap-6" style={{ marginBottom: '24px' }}>
              {evidenceLabels.map((label, i) => (
                <div key={i} style={{ padding: '24px', background: 'white', border: '1px solid var(--color-border-subtle)' }}>
                  <h4 style={{ ...monoLabel, color: 'var(--color-accent)', marginBottom: '8px' }}>
                    {label.title}
                  </h4>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    {label.desc}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textAlign: 'center', fontStyle: 'italic', margin: 0 }}>
              If a guide or product card does not say &quot;Hands-On Tested,&quot; you should assume it is research-based.
            </p>
          </div>

          {/* Clear Verdicts */}
          <div style={{ maxWidth: '560px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px' }}>
              Clear Verdicts
            </h3>
            <p style={{ ...bodyBase, marginBottom: '16px' }}>
              Every product should answer three questions:
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Who is this for?', 'Who should skip it?', 'What are the real trade-offs?'].map((q, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ ...monoLabel, color: 'var(--color-accent)', fontSize: '10px', marginTop: '3px', flexShrink: 0 }}>
                    0{i + 1}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                    {q}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Editorial Workflow ── */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ ...monoLabel, color: 'var(--color-accent)', display: 'block', marginBottom: '12px' }}>
              Our Editorial Workflow
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, var(--text-2xl))',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: 'var(--tracking-display)',
              marginBottom: '16px',
            }}>
              Built on Structured Editorial Checkpoints
            </h2>
            <p style={{ ...bodyBase, maxWidth: '560px', margin: '0 auto' }}>
              Aura Home Office does not pretend to be a large traditional newsroom. Instead, we use a structured editorial workflow built around three editorial checkpoints.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {desks.map((desk, i) => (
              <div key={i} style={{
                border: '1px solid var(--color-border-subtle)',
                padding: '32px',
                background: 'white',
              }}>
                <div style={{
                  width: '48px', height: '48px',
                  background: desk.accent ? 'var(--color-accent-subtle)' : 'var(--color-surface)',
                  color: desk.accent ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  {desk.icon}
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 16px 0' }}>
                  {desk.title}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                  {desk.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Transparency ── */}
        <section style={{
          padding: '64px 48px',
          background: 'var(--color-surface-dark)',
          textAlign: 'center',
          marginBottom: '80px',
        }}>
          <span style={{ ...monoLabel, color: 'var(--color-accent-light)', display: 'block', marginBottom: '20px' }}>
            Transparency
          </span>
          <blockquote style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.25rem, 3vw, var(--text-2xl))',
            fontStyle: 'italic',
            color: 'rgba(245,243,240,0.9)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '640px',
            margin: '0 auto 28px',
          }}>
            &ldquo;Our recommendations are not for sale.&rdquo;
          </blockquote>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'rgba(245,243,240,0.7)', lineHeight: 'var(--leading-relaxed)', maxWidth: '700px', margin: '0 auto 16px' }}>
            Aura Home Office is reader-supported. As an Amazon Associate, we earn from qualifying purchases. When you buy through links on our site, we may earn a commission from Amazon and other partners at no extra cost to you.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'rgba(245,243,240,0.7)', lineHeight: 'var(--leading-relaxed)', maxWidth: '700px', margin: '0 auto 32px' }}>
            We may earn commissions, but brands do not get to buy positive verdicts, hide trade-offs, or control our rankings.
          </p>
          <Link
            href="/disclosure"
            style={{
              ...monoLabel,
              color: 'var(--color-accent-light)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              display: 'inline-block',
            }}
          >
            Read our full Affiliate Disclosure →
          </Link>
        </section>

        {/* ── Contact ── */}
        <section style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px',
            background: 'var(--color-accent-subtle)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-accent)',
            marginBottom: '20px',
          }}>
            <Coffee size={22} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: 'var(--tracking-display)',
            marginBottom: '12px',
          }}>
            Contact
          </h2>
          <p style={{ ...bodyBase, maxWidth: '500px', margin: '0 auto 12px' }}>
            Aura Home Office is operated as an independent editorial research site.
          </p>
          <p style={{ ...bodyBase, maxWidth: '500px', margin: '0 auto 24px' }}>
            For feedback, product experiences, collaboration requests, corrections, or questions about our reviews, email us at:
          </p>
          <a
            href="mailto:hello@aurahomeoffice.com"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-md)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              borderBottom: '2px solid var(--color-accent)',
              textDecoration: 'none',
              paddingBottom: '2px',
            }}
          >
            hello@aurahomeoffice.com
          </a>
        </section>

      </div>
    </main>
  );
}

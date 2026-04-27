import React from 'react';
import Link from 'next/link';
import { Search, Target, ShieldCheck, Coffee } from 'lucide-react';
import { Metadata } from 'next';
import { AUTHORS } from '../../src/config/authors';

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

const styles = {
  monoKicker: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
    color: 'var(--color-accent)',
  },
  headingHero: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: 800,
    color: 'var(--color-text-primary)',
    lineHeight: 1.05,
    letterSpacing: '-0.02em',
  },
  headingSection: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2rem, 4vw, 2.75rem)',
    fontWeight: 800,
    color: 'var(--color-text-primary)',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  headingSub: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    lineHeight: 1.3,
  },
  bodyLead: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(1.125rem, 2vw, 1.35rem)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
  },
  bodyText: {
    fontFamily: 'var(--font-body)',
    fontSize: '1.125rem', // 18px
    color: 'var(--color-text-body)',
    lineHeight: 1.75,
  },
  bodySmall: {
    fontFamily: 'var(--font-body)',
    fontSize: '1rem', // 16px
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
  },
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
      icon: <Search size={24} />,
      title: 'Research Desk',
      desc: 'Focuses on product specs, dimensions, materials, weight capacity, warranty terms, owner feedback, comparison tables, and the small technical details that can make or break a purchase.',
      accent: true,
    },
    {
      icon: <Target size={24} />,
      title: 'Workspace Fit Desk',
      desc: 'Looks at how a product fits into real home offices: small rooms, apartments, shared spaces, desk clutter, lighting, cable management, aesthetics, and daily usability.',
      accent: false,
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Editorial Review Desk',
      desc: 'Turns the research into practical buying guides. This step focuses on search intent, product fit, clear verdicts, internal linking, affiliate transparency, and whether the article actually helps a reader make a better decision.',
      accent: false,
    },
  ];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: '120px' }}>
      
      {/* ── Hero Section ── */}
      <header style={{ 
        paddingTop: 'var(--page-pt, 160px)', 
        paddingBottom: '80px',
        borderBottom: '1px solid var(--color-rule-hard)' 
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <span style={{ ...styles.monoKicker, display: 'inline-block', marginBottom: '24px' }}>
            About Aura Home Office
          </span>
          <h1 style={{ ...styles.headingHero, marginBottom: '32px' }}>
            We do the research<br />
            <span style={{ color: 'var(--color-text-muted)' }}>so you don't waste yours.</span>
          </h1>
          <time dateTime="2026-04-18" style={{ ...styles.monoKicker, color: 'var(--color-text-muted)', display: 'block', marginBottom: '32px' }}>
            Last updated: April 2026 
          </time>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px', margin: '0 auto 40px', textAlign: 'left' }}>
            <p style={{ ...styles.bodyLead }}>
              Aura Home Office is an independent home office buying guide for people building better workspaces at home. We cover standing desks, ergonomic chairs, monitor arms, desk lighting, cable management, storage, and the small accessories that make daily work feel less painful.
            </p>
            <p style={{ ...styles.bodyLead }}>
              We are not here to publish another vague "best of" list stuffed with random products. Our goal is simple: help you understand what is worth buying, what trade-offs to expect, and which product fits your space, budget, and daily routine.
            </p>
          </div>
        </div>
      </header>

      {/* ── Who This Is For ── */}
      <section style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-rule-hard)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px' }}>
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <span style={{ ...styles.monoKicker, display: 'block', marginBottom: '16px' }}>Who This Is For</span>
              <h2 style={{ ...styles.headingSection, fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}>
                Aura Home Office is for people who want a better workspace without wasting hours comparing specs.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p style={{ ...styles.bodyText, marginBottom: '32px', color: 'var(--color-text-primary)' }}>
                This site is especially useful if you are:
              </p>
              <div className="flex flex-col gap-4 mb-8">
                {[
                  'Working from a small apartment, spare bedroom, or shared space',
                  'Trying to choose a standing desk, ergonomic chair, monitor arm, or workspace accessory',
                  'Comparing products that look similar but have different trade-offs',
                  'Trying to avoid weak frames, confusing assembly, poor storage, cable clutter, or vague warranty details',
                  'Looking for practical buying advice instead of hype',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      width: '6px', height: '6px', 
                      borderRadius: '50%', background: 'var(--color-accent)', 
                      flexShrink: 0, marginTop: '10px'
                    }} />
                    <p style={{ ...styles.bodyText, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
              <p style={{ ...styles.bodyText, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                We are not here to tell everyone to buy the most expensive option. Sometimes the right pick is the compact desk that actually fits your room, the chair with better adjustability, or the storage solution that keeps your workspace usable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px' }}>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div style={{ position: 'relative', aspectRatio: '4/5', background: 'var(--color-surface)', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200"
                alt="A clean, organized home office desk setup with a monitor, plant, and desk lamp"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)' }} />
            </div>
          </div>
          
          <div className="lg:col-span-7 order-1 lg:order-2">
            <span style={{ ...styles.monoKicker, display: 'block', marginBottom: '16px' }}>Our Story</span>
            <h2 style={{ ...styles.headingSection, marginBottom: '32px' }}>
              Built around a problem remote workers know too well.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <p style={{ ...styles.bodyText }}>
                A kitchen table becomes a desk. A laptop screen sits too low. Cables take over the floor. By lunch, the setup already feels uncomfortable. Then you search for "best ergonomic chair" or "best standing desk" and find the same generic affiliate lists repeating product titles without explaining what actually matters.
              </p>
              <p style={{ ...styles.bodyText, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                We wanted something more useful.
              </p>
              <p style={{ ...styles.bodyText }}>
                So we built Aura Home Office around structured buying research: comparing product specs, reading owner feedback, checking listing details, looking for repeated complaints, and explaining who each product is really for.
              </p>
              <p style={{ ...styles.bodyText }}>
                Most recommendations on Aura Home Office are research-based unless clearly labeled otherwise. We do not pretend a product was hands-on tested when it was not.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-rule-hard)', margin: '0' }} />

      {/* ── How We Work ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px', maxWidth: '700px', margin: '0 auto 64px' }}>
          <span style={{ ...styles.monoKicker, display: 'block', marginBottom: '16px' }}>How We Work</span>
          <h2 style={{ ...styles.headingSection, marginBottom: '24px' }}>
            Research First
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-24">
          <div>
            <p style={{ ...styles.bodyText, marginBottom: '24px' }}>
              Before a product makes one of our guides, we look at the details that matter in real home offices:
            </p>
            <ul style={{ ...styles.bodyText, listStyle: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
            <p style={{ ...styles.bodyText, marginBottom: '24px' }}>
              For each product, we ask practical buying questions:
            </p>
            <ul style={{ ...styles.bodyText, listStyle: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Will this fit a small apartment or spare bedroom?</li>
              <li>Is the height range usable for both sitting and standing?</li>
              <li>Does the frame look suitable for monitors and daily work?</li>
              <li>Are the drawers, shelves, outlets, or cable features actually useful?</li>
              <li>Do buyers repeatedly mention wobble, missing parts, unclear instructions, weak materials, or poor support?</li>
            </ul>
          </div>
        </div>

        {/* Structured Research Box */}
        <div style={{ background: 'var(--color-surface)', padding: '48px', border: '1px solid var(--color-border)', marginBottom: '80px' }}>
          <h3 style={{ ...styles.headingSub, fontSize: 'var(--text-xl)', marginBottom: '24px' }}>
            Structured Research, Not Random Lists
          </h3>
          <p style={{ ...styles.bodyText, marginBottom: '20px' }}>
            Aura Home Office uses structured research workflows to organize product details, compare specifications, summarize buyer feedback, and draft research notes.
          </p>
          <p style={{ ...styles.bodyText, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
            Our editorial standard is simple: research should explain the available evidence, not invent experience. If a product was not physically tested, our content should not sound like it was.
          </p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-rule-hard)', marginBottom: '80px' }} />

        {/* Owner Feedback & No Paid Rankings */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-24">
          <div>
            <h3 style={{ ...styles.headingSub, fontSize: 'var(--text-xl)', marginBottom: '24px' }}>
              Owner Feedback Matters
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ ...styles.bodyText, margin: 0 }}>
                Specs tell only part of the story. A desk can look great on paper and still wobble. A chair can claim lumbar support and still feel wrong after a few hours.
              </p>
              <p style={{ ...styles.bodyText, margin: 0 }}>
                That is why we pay attention to repeated feedback from people who actually bought and used the product.
              </p>
              <p style={{ ...styles.bodyText, margin: 0, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Our job is not to repeat every review. Our job is to turn owner feedback into practical buying advice.
              </p>
            </div>
          </div>
          <div>
            <h3 style={{ ...styles.headingSub, fontSize: 'var(--text-xl)', marginBottom: '24px' }}>
              No Paid Rankings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ ...styles.bodyText, margin: 0 }}>
                Aura Home Office is reader-supported, but affiliate commissions do not decide our rankings.
              </p>
              <div>
                <p style={{ ...styles.bodyText, margin: 0, fontWeight: 600, color: 'var(--color-text-primary)' }}>Brands cannot pay to get a positive verdict.</p>
                <p style={{ ...styles.bodyText, margin: 0, fontWeight: 600, color: 'var(--color-text-primary)' }}>They cannot pay to hide trade-offs.</p>
                <p style={{ ...styles.bodyText, margin: 0, fontWeight: 600, color: 'var(--color-text-primary)' }}>They cannot pay to remove common complaints.</p>
              </div>
              <p style={{ ...styles.bodyText, margin: 0 }}>
                If a product has weak materials, confusing assembly, unclear warranty coverage, misleading photos, limited buyer feedback, or repeated complaints, we call that out.
              </p>
            </div>
          </div>
        </div>

        {/* Evidence Labels Box */}
        <div style={{ padding: '48px', border: '1px solid var(--color-border)', marginBottom: '80px', background: 'var(--color-surface)' }}>
          <h3 style={{ ...styles.headingSub, fontSize: 'var(--text-xl)', marginBottom: '16px', textAlign: 'center' }}>
            Our Evidence Labels
          </h3>
          <p style={{ ...styles.bodyText, textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
            You may see these labels across Aura Home Office:
          </p>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {evidenceLabels.map((label, i) => (
              <div key={i} style={{ padding: '32px', background: 'white', border: '1px solid var(--color-border-subtle)' }}>
                <h4 style={{ ...styles.monoKicker, marginBottom: '12px' }}>
                  {label.title}
                </h4>
                <p style={{ ...styles.bodySmall, margin: 0 }}>
                  {label.desc}
                </p>
              </div>
            ))}
          </div>
          <p style={{ ...styles.bodySmall, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>
            If a guide or product card does not say "Hands-On Tested," you should assume it is research-based.
          </p>
        </div>
      </section>

      {/* ── Methodology & TrustScore ── */}
      <section id="trustscore" style={{ background: 'var(--color-surface-dark)', color: 'var(--color-text-inverse)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px' }}>
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <span style={{ ...styles.monoKicker, color: 'var(--color-accent-light)', display: 'block', marginBottom: '16px' }}>Scoring System</span>
              <h2 style={{ ...styles.headingSection, color: 'var(--color-text-inverse)', marginBottom: '24px' }}>
                Aura TrustScore™ Methodology
              </h2>
              <p style={{ ...styles.bodyText, color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }}>
                The Aura TrustScore™ is a proprietary scoring system developed by our editorial team. It ranges from 0 to 10 and is calculated based on our structured research framework. This score is independent of any manufacturer or retailer and reflects the overall value based on specifications, durability, price-to-performance, and owner feedback.
              </p>
              
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '24px', listStyle: 'none', padding: 0 }}>
                {[
                  { title: 'Expert Analysis', desc: 'We aggregate long-term feedback from professionals and industry veterans.' },
                  { title: 'Build Quality', desc: 'We scrutinize materials, manufacturer reliability, and long-term durability.' },
                  { title: 'Ergonomic Performance', desc: 'We evaluate how effectively the product improves workspace health and comfort.' },
                  { title: 'Value for Money', desc: 'We compare the feature-to-price ratio against current market alternatives.' }
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{item.title}</strong>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div style={{ background: '#252420', border: '1px solid #3A3935', padding: '48px' }}>
                <span style={{ ...styles.monoKicker, color: 'var(--color-accent)', display: 'block', marginBottom: '32px' }}>What our ratings mean</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { range: '9.0 – 10', label: 'Gold Standard', desc: 'Exceptional quality across the board. Highly recommended for long-term office use.' },
                    { range: '7.5 – 8.9', label: 'Recommended', desc: 'Strong performer with great value. A solid investment for most home offices.' },
                    { range: '6.0 – 7.4', label: 'Functional', desc: 'Meets expectations well, though some trade-offs in materials or features exist.' },
                    { range: '4.0 – 5.9', label: 'Average', desc: 'Functional but often outclassed by better options in the same price range.' },
                    { range: '0 – 3.9', label: 'Poor', desc: 'Significant drawbacks or durability concerns. Not recommended for daily work.' }
                  ].map((row, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      gap: '24px', 
                      paddingBottom: i === 4 ? 0 : '24px',
                      borderBottom: i === 4 ? 'none' : '1px solid #3A3935',
                      alignItems: 'flex-start',
                      flexDirection: 'column'
                    }} className="sm:flex-row">
                      <div style={{ ...styles.monoKicker, color: '#fff', width: '100px', flexShrink: 0 }}>{row.range}</div>
                      <div style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                        <strong style={{ color: '#fff', fontWeight: 600, marginRight: '8px' }}>{row.label}:</strong>
                        <span>{row.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ marginTop: '64px' }}>
                <h3 style={{ ...styles.headingSub, color: '#fff', marginBottom: '24px' }}>
                  Clear Verdicts
                </h3>
                <p style={{ ...styles.bodyText, color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
                  Every product should answer three questions:
                </p>
                <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {['Who is this for?', 'Who should skip it?', 'What are the real trade-offs?'].map((q, i) => (
                    <li key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <span style={{ ...styles.monoKicker, color: 'var(--color-accent)', marginTop: '4px', flexShrink: 0 }}>
                        0{i + 1}
                      </span>
                      <span style={{ ...styles.bodyText, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                        {q}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Editorial Workflow ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px', maxWidth: '700px', margin: '0 auto 64px' }}>
          <span style={{ ...styles.monoKicker, display: 'block', marginBottom: '16px' }}>Our Editorial Workflow</span>
          <h2 style={{ ...styles.headingSection, marginBottom: '24px' }}>
            Built on Structured Editorial Checkpoints
          </h2>
          <p style={{ ...styles.bodyText }}>
            Aura Home Office does not pretend to be a large traditional newsroom. Instead, we use a structured editorial workflow built around three editorial checkpoints.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {desks.map((desk, i) => (
            <div key={i} style={{ 
              padding: '40px 32px', 
              border: '1px solid var(--color-border)', 
              background: 'white',
              position: 'relative'
            }}>
              <div style={{ 
                width: '56px', height: '56px', 
                background: desk.accent ? 'var(--color-accent-subtle)' : 'var(--color-surface)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: desk.accent ? 'var(--color-accent)' : 'var(--color-text-primary)',
                marginBottom: '24px'
              }}>
                {desk.icon}
              </div>
              <h3 style={{ ...styles.headingSub, marginBottom: '16px' }}>{desk.title}</h3>
              <p style={{ ...styles.bodySmall, margin: 0 }}>{desk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Meet the Team ── */}
      <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-rule-hard)', borderBottom: '1px solid var(--color-rule-hard)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ ...styles.monoKicker, display: 'block', marginBottom: '16px' }}>Meet the Team</span>
            <h2 style={{ ...styles.headingSection, marginBottom: '16px' }}>The people behind Aura Home Office</h2>
            <p style={{ ...styles.bodyText, color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Three roles. One shared standard: research that explains what's actually worth buying.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {AUTHORS.map((member) => (
              <Link
                key={member.id}
                href={`/author/${member.id}`}
                style={{ textDecoration: 'none', display: 'block' }}
                className="group"
              >
                <div style={{
                  padding: '40px 32px',
                  background: 'white',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                  transition: 'border-color 0.2s ease',
                }}
                  className="group-hover:border-[var(--color-accent)]"
                >
                  {/* Avatar */}
                  <div style={{
                    width: '80px', height: '80px',
                    borderRadius: '50%', overflow: 'hidden',
                    margin: '0 auto 24px',
                    border: '3px solid var(--color-border)',
                    background: 'var(--color-surface)',
                  }}>
                    <img
                      src={member.avatar}
                      alt={`${member.name}, ${member.role}`}
                      width={80} height={80}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Role kicker */}
                  <span style={{ ...styles.monoKicker, display: 'block', marginBottom: '8px' }}>
                    {member.role}
                  </span>

                  {/* Name */}
                  <h3 style={{ ...styles.headingSub, marginBottom: '16px' }}>{member.name}</h3>

                  {/* Short bio */}
                  <p style={{ ...styles.bodySmall, margin: '0 0 24px' }}>
                    {member.shortBio}
                  </p>

                  {/* Expertise chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '24px' }}>
                    {member.expertise.slice(0, 2).map((t) => (
                      <span key={t} style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: 'var(--color-text-muted)',
                        padding: '4px 8px',
                        border: '1px solid var(--color-border-subtle)',
                        background: 'var(--color-surface)',
                      }}>{t}</span>
                    ))}
                  </div>

                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    color: 'var(--color-accent)',
                  }}>
                    View profile →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Transparency & Contact ── */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{ 
          background: 'var(--color-surface-dark)', 
          padding: '80px 48px', 
          textAlign: 'center',
          marginBottom: '100px'
        }}>
          <span style={{ ...styles.monoKicker, color: 'var(--color-accent-light)', display: 'block', marginBottom: '24px' }}>Transparency</span>
          <h2 style={{ ...styles.headingHero, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', marginBottom: '32px' }}>
            "Our recommendations are not for sale."
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '700px', margin: '0 auto 40px' }}>
            <p style={{ ...styles.bodyText, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              Aura Home Office is reader-supported. As an Amazon Associate, we earn from qualifying purchases. When you buy through links on our site, we may earn a commission from Amazon and other partners at no extra cost to you.
            </p>
            <p style={{ ...styles.bodyText, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              We may earn commissions, but brands do not get to buy positive verdicts, hide trade-offs, or control our rankings.
            </p>
          </div>
          <Link href="/disclosure" style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
            color: 'var(--color-accent-light)', borderBottom: '1px solid var(--color-accent-light)',
            paddingBottom: '2px', textDecoration: 'none'
          }}>
            Read our full Affiliate Disclosure →
          </Link>
        </div>

        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{ 
            width: '48px', height: '48px', 
            background: 'var(--color-accent-subtle)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-accent)', marginBottom: '24px'
          }}>
            <Coffee size={24} />
          </div>
          <h3 style={{ ...styles.headingSub, fontSize: 'var(--text-xl)', marginBottom: '16px' }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px', margin: '0 auto 32px' }}>
            <p style={{ ...styles.bodyText, margin: 0 }}>
              Aura Home Office is operated as an independent editorial research site.
            </p>
            <p style={{ ...styles.bodyText, margin: 0 }}>
              For feedback, product experiences, collaboration requests, corrections, or questions about our reviews, email us at:
            </p>
          </div>
          <a href="mailto:hello@aurahomeoffice.com" style={{ 
            fontFamily: 'var(--font-ui)', fontSize: '18px', fontWeight: 600,
            color: 'var(--color-text-primary)', textDecoration: 'none',
            borderBottom: '2px solid var(--color-accent)', paddingBottom: '2px'
          }}>
            hello@aurahomeoffice.com
          </a>
        </div>
      </section>

    </main>
  );
}

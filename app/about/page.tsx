import React from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Target, ShieldCheck, Coffee } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Aura Home Office. We are a small team of remote workers and designers building honest reviews with hands-on testing.',
};

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', paddingTop: 'var(--page-pt, 160px)', paddingBottom: '96px', background: 'var(--color-bg)' }} className="[--page-pt:120px] md:[--page-pt:160px]">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 var(--space-6)' }}>

        {/* Editorial Header */}
        <header style={{ marginBottom: '80px', textAlign: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            fontWeight: 400,
            textTransform: 'uppercase' as const,
            letterSpacing: 'var(--tracking-mono)',
            color: 'var(--color-accent)',
            display: 'block',
            marginBottom: 'var(--space-5)',
          }}>About Aura Home Office</span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, var(--text-4xl))',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-display)',
            marginBottom: 'var(--space-6)',
          }}>
            We spend the money<br />so you don&apos;t have to.
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-md)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Aura Home Office is a small team of remote workers, designers, and desk obsessives who got tired of vague &quot;best of&quot; lists. So we built something better.
          </p>
        </header>

        {/* Story Section */}
        <section className="grid lg:grid-cols-2 gap-16 items-center" style={{ marginBottom: '80px' }}>
          <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 0, overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200" 
              alt="Workspace curation" 
              style={{ objectFit: 'cover', height: '100%', width: '100%', borderRadius: 0 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)' }} />
          </div>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: 'var(--tracking-display)',
              marginBottom: '24px',
            }}>Our Story</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-md)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
                margin: 0,
              }}>
                It started in 2020 when most of us were suddenly working from kitchen tables and spare bedrooms — squinting at laptop screens and nursing sore backs by noon. We started researching ergonomic gear obsessively, reading hundreds of reviews, comparing specs, and talking to people who actually owned this stuff.
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-md)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
                margin: 0,
              }}>
                What we kept running into was the same problem: every &quot;best ergonomic chair&quot; article read like it was written by someone who had never sat in one. Affiliate lists stuffed with Amazon bestsellers, zero context, zero honesty.
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-md)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
                margin: 0,
              }}>
                Aura Home Office exists to fix that. We combine hands-on testing (when possible), deep research, user feedback from thousands of real owners, and direct conversations with manufacturers.
              </p>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-rule-hard)', marginBottom: '80px' }} />

        {/* Methodology Grid */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 400,
              textTransform: 'uppercase' as const,
              letterSpacing: 'var(--tracking-mono)',
              color: 'var(--color-accent)',
              display: 'block',
              marginBottom: 'var(--space-2)',
            }}>How We Work</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, var(--text-2xl))',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: 'var(--tracking-display)',
            }}>Research The Hell Out Of Everything</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target size={20} />,
                title: "Hands-on Testing",
                desc: "We test products ourselves. Sometimes that means buying it, or hitting showrooms. If we haven't physically tested something, we say so."
              },
              {
                icon: <Search size={20} />,
                title: "Deep Context",
                desc: "We dive deep into spec sheets, warranty terms, verified owner reviews, and forum discussions. No surface-level summaries."
              },
              {
                icon: <ShieldCheck size={20} />,
                title: "Unbiased Verdicts",
                desc: "If a product doesn't live up to the hype, we say that too. No paid placements. No sponsored picks dressed up as editorial."
              }
            ].map((item, i) => (
              <div key={i} style={{
                padding: '32px',
                background: 'var(--color-surface)',
                borderTop: '2px solid var(--color-rule-section)',
                borderLeft: '1px solid var(--color-border)',
                borderRight: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
                borderRadius: 0,
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 0,
                  background: 'var(--color-accent-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent)',
                  marginBottom: '20px',
                }}>
                  {item.icon}
                </div>
                <h4 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  letterSpacing: 'var(--tracking-display)',
                  marginBottom: '10px',
                }}>{item.title}</h4>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--leading-relaxed)',
                  margin: 0,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 400,
              textTransform: 'uppercase' as const,
              letterSpacing: 'var(--tracking-mono)',
              color: 'var(--color-accent)',
              display: 'block',
              marginBottom: 'var(--space-2)',
            }}>The Team</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, var(--text-2xl))',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: 'var(--tracking-display)',
            }}>Built By Remote Workers</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Jamie */}
            <div style={{ border: '1px solid var(--color-border-subtle)', padding: '32px', background: 'white' }}>
              <div style={{
                width: '48px', height: '48px',
                background: 'var(--color-accent-subtle)', color: 'var(--color-accent)',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px'
              }}>JM</div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>Jamie M.</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px 0' }}>Founder & Editor</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Full-time remote since 2019. Spent way too many hours researching ergonomic gear before finally buying the right chair. Writes about desks, chairs, and the eternal monitor arm debate.
              </p>
            </div>
            
            {/* Sara */}
            <div style={{ border: '1px solid var(--color-border-subtle)', padding: '32px', background: 'white' }}>
              <div style={{
                width: '48px', height: '48px',
                background: 'var(--color-surface)', color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px'
              }}>SL</div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>Sara L.</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px 0' }}>Lighting & Aesthetics</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Interior designer by training, remote worker by necessity. Covers desk lighting, cable management, and making your setup look intentional — not just functional.
              </p>
            </div>
            
            {/* Ryan */}
            <div style={{ border: '1px solid var(--color-border-subtle)', padding: '32px', background: 'white' }}>
              <div style={{
                width: '48px', height: '48px',
                background: 'var(--color-surface)', color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px'
              }}>RK</div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>Ryan K.</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px 0' }}>Research & Analysis</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                IT background, data nerd. Breaks down spec sheets, warranty terms, and long-term owner feedback. If there&apos;s a detailed comparison table, Ryan probably built it.
              </p>
            </div>
          </div>
        </section>

        {/* Transparency Box */}
        <section style={{
          padding: '64px 48px',
          background: 'var(--color-surface-dark)',
          borderRadius: 0,
          textAlign: 'center',
          marginBottom: '80px',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: 'var(--tracking-ribbon)',
            color: 'var(--color-accent-light)',
            display: 'block',
            marginBottom: '20px',
          }}>Transparency</span>
          <blockquote style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.25rem, 3vw, var(--text-2xl))',
            fontStyle: 'italic',
            color: 'rgba(245,243,240,0.9)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '640px',
            margin: '0 auto 28px',
          }}>
            &ldquo;We are reader-supported. When you buy through our links, we may earn a commission — but our reviews are never for sale.&rdquo;
          </blockquote>
          <Link href="/disclosure" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: 'var(--tracking-ribbon)',
            color: 'var(--color-accent-light)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}>
            Read our full Affiliate Disclosure →
          </Link>
        </section>

        {/* Contact CTA */}
        <section style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 0,
            background: 'var(--color-accent-subtle)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
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
          }}>Have a setup we should see?</h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '400px',
            margin: '0 auto 24px',
          }}>
            Your real-world experience helps the whole community. Reach out for collaborations or feedback.
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

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { getFeaturedPost, getLatestPosts, getPostsByTagSlug } from '@/src/services/wpService';
import PostCard from '@/src/components/PostCard';
import CategoryGrid from '@/src/components/CategoryGrid';
import { ArrowRight } from 'lucide-react';
import { formatSEOText } from '@/src/utils/seoFormatter';

/**
 * Homepage — DESIGN.md §5 Page Templates
 * 
 * Structure:
 * [Nav — sticky, white bg, bottom hairline rule]
 * [Hero — 2-col: large image left + editorial headline right]
 *   ↳ Kicker: REVIEWS · HOME OFFICE
 *   ↳ H1: Playfair, text-4xl/5xl
 *   ↳ Deck: Source Serif 4, text-md
 * [Section ribbon — "BEST PICKS" — dark bg, inverse type]
 * [Story grid — tiles with hairline rules between]
 * [Section ribbon — "MOST POPULAR"]
 * [Recent reviews — list format]
 * [Footer — dark surface, inverse type]
 */
export default async function HomePage() {
  const allPosts = await getLatestPosts(12);
  const featuredPost = await getFeaturedPost();
  
  const trendingPosts = allPosts.slice(1, 5); 
  const standingDesks = await getPostsByTagSlug('standing-desks', 1, 4);
  const furniturePosts = standingDesks.length > 0 ? standingDesks : allPosts.slice(4, 8);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{
        paddingTop: '96px',
        paddingBottom: '80px',
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-rule-hard)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-6)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
            
            {/* Left: Editorial Copy */}
            <div className="flex flex-col justify-between py-4 lg:py-8 reveal">
              <div style={{ marginBottom: '40px' }} className="reveal delay-1">
                {/* Kicker — JetBrains Mono, ALL-CAPS (WIRED mandatory) */}
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 400,
                  textTransform: 'uppercase' as const,
                  letterSpacing: 'var(--tracking-mono)',
                  color: 'var(--color-text-muted)',
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                }}>
                  REVIEWS · HOME OFFICE
                </span>

                {/* H1 — Playfair Display */}
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, var(--text-4xl))',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  lineHeight: 'var(--leading-display)',
                  letterSpacing: 'var(--tracking-display)',
                  marginBottom: 'var(--space-6)',
                }}>
                  The Best Home Office Gear,<br />
                  <span style={{ fontStyle: 'italic', fontWeight: 700 }}>Tested &amp; Ranked.</span>
                </h1>

                {/* Deck — Source Serif 4 */}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-md)',
                  lineHeight: 'var(--leading-relaxed)',
                  color: 'var(--color-text-secondary)',
                  maxWidth: '480px',
                }} className="reveal delay-2">
                  Expert reviews and ergonomic analysis for professionals building high-performance home offices. We test so you don&apos;t have to.
                </p>
              </div>

              {/* CTAs */}
              <div className="reveal delay-3">
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
                  <Link href="/category/reviews" className="btn-buy">
                    Explore Reviews <ArrowRight size={14} />
                  </Link>
                  <Link href="/about" className="btn-secondary">
                    How We Test
                  </Link>
                </div>

                {/* Trust signals — JetBrains Mono kicker style */}
                <div style={{
                  paddingTop: 'var(--space-5)',
                  borderTop: '1px solid var(--color-rule-hard)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 400,
                    textTransform: 'uppercase' as const,
                    letterSpacing: 'var(--tracking-mono)',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.8,
                  }}>
                    200+ PRODUCTS TESTED · EXPERT-LED RESEARCH · UNBIASED REVIEWS
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Hero Image — square corners */}
            <div className="relative min-h-[360px] lg:min-h-[520px] flex items-stretch reveal">
              <div style={{
                position: 'relative',
                width: '100%',
                borderRadius: 0,
                overflow: 'hidden',
              }} className="img-zoom-hover">
                <img 
                  src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=1600" 
                  className="w-full h-full object-cover" 
                  alt="Premium ergonomic home office setup with monitor and desk"
                  width={800}
                  height={600}
                  loading="eager"
                  style={{ borderRadius: 0 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(17,17,16,0.5), transparent)' }} />
              </div>

              {/* Featured card overlay */}
              {featuredPost && (
                <Link 
                  href={`/category/${featuredPost._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized'}/${featuredPost.slug}`} 
                  style={{
                    position: 'absolute',
                    bottom: '-24px',
                    left: '-16px',
                    zIndex: 20,
                    display: 'block',
                    textDecoration: 'none',
                  }}
                  className="sm:-left-8 lg:-left-12"
                >
                  <div style={{
                    padding: '16px 20px',
                    background: 'white',
                    boxShadow: 'var(--shadow-md)',
                    maxWidth: '260px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 0,
                  }}>
                    <div style={{ marginBottom: '10px' }}>
                      {/* Kicker — JetBrains Mono */}
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        textTransform: 'uppercase' as const,
                        letterSpacing: 'var(--tracking-ribbon)',
                        color: 'var(--color-accent)',
                      }}>FEATURED</span>
                    </div>
                    <h3 
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        lineHeight: 'var(--leading-snug)',
                        letterSpacing: 'var(--tracking-display)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                        overflow: 'hidden',
                        marginBottom: '12px',
                      }}
                      dangerouslySetInnerHTML={{ __html: formatSEOText(featuredPost.title.rendered, featuredPost.title.rendered, featuredPost._embedded?.['wp:term']?.[0]?.[0]?.name, featuredPost.content?.rendered) }} 
                    />
                    <span style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--color-accent)',
                    }}>
                      Read Review →
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════ SECTION RIBBON — BEST PICKS ═══════════════ */}
      <div className="section-ribbon">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-6)' }} className="md:px-8">
          BEST PICKS
        </div>
      </div>

      {/* ═══════════════ TRENDING — Story Grid with Hairline Rules ═══════════════ */}
      <section style={{ padding: '0', background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: 0 }}>
            {trendingPosts.map((p, i) => {
              const image = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400";
              const catName = p._embedded?.['wp:term']?.[0]?.[0]?.name || 'Gear';
              const catSlug = p._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized';

              return (
                <Link 
                  key={p.id} 
                  href={`/category/${catSlug}/${p.slug}`} 
                  className="max-md:border-r-0 md:border-r md:even:border-r-0 lg:even:border-r lg:[&:nth-child(4n)]:border-r-0 border-b border-[var(--color-rule-hard)]"
                  style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    padding: 'var(--space-6)',
                    textDecoration: 'none',
                    background: 'var(--color-bg)',
                  }}
                >
                  {/* Image — square corners */}
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', background: 'var(--color-surface)', flexShrink: 0, marginBottom: 'var(--space-4)', borderRadius: 0 }}>
                    <img 
                      src={image} 
                      className="w-full h-full object-cover" 
                      alt={p.title.rendered}
                      loading="lazy"
                      width={300}
                      height={169}
                      style={{ borderRadius: 0 }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' as const, flexGrow: 1 }}>
                    {/* Kicker — JetBrains Mono (WIRED mandatory) */}
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 400,
                      textTransform: 'uppercase' as const,
                      letterSpacing: 'var(--tracking-mono)',
                      color: 'var(--color-text-muted)',
                      display: 'block',
                      marginBottom: 'var(--space-2)',
                    }}>
                      {catName}
                    </span>
                    
                    {/* Headline — Playfair Display */}
                    <h4 
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-xl)',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        lineHeight: 'var(--leading-tight)',
                        letterSpacing: 'var(--tracking-display)',
                        marginBottom: 'var(--space-2)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                        overflow: 'hidden',
                      }}
                      dangerouslySetInnerHTML={{ __html: formatSEOText(p.title.rendered, p.title.rendered, catName, p.content?.rendered) }} 
                    />
                    
                    {/* Deck — Source Serif 4 */}
                    <div 
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-base)',
                        color: 'var(--color-text-body)',
                        lineHeight: 'var(--leading-relaxed)',
                        marginBottom: 'var(--space-3)',
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                        overflow: 'hidden',
                      }}
                      dangerouslySetInnerHTML={{ __html: formatSEOText(p.excerpt?.rendered || '', p.title.rendered, catName, p.content?.rendered) }}
                    />

                    {/* Byline — JetBrains Mono */}
                    <time style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 400,
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase' as const,
                      letterSpacing: 'var(--tracking-mono)',
                    }}>
                      {format(new Date(p.date), 'MMM dd, yyyy')}
                    </time>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section style={{ padding: 'var(--space-20) 0', background: 'var(--color-bg)', borderTop: '1px solid var(--color-rule-hard)', marginTop: '-1px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-6)' }}>
          <div style={{ marginBottom: 'var(--space-10)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-6)' }}>
            <div>
              {/* Kicker */}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                fontWeight: 400,
                textTransform: 'uppercase' as const,
                letterSpacing: 'var(--tracking-mono)',
                color: 'var(--color-accent)',
                display: 'block',
                marginBottom: 'var(--space-2)',
              }}>
                BROWSE BY CATEGORY
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, var(--text-3xl))',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: 'var(--tracking-display)',
                lineHeight: 'var(--leading-tight)',
              }}>
                Find Your Focus.
              </h2>
            </div>
            <Link href="/categories" style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-accent)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}>
              All Categories <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryGrid />
        </div>
      </section>


      {/* ═══════════════ SECTION RIBBON — MOST POPULAR ═══════════════ */}
      <div className="section-ribbon">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-6)' }} className="md:px-8">
          MOST POPULAR
        </div>
      </div>

      {/* ═══════════════ LATEST REVIEWS — Story Grid ═══════════════ */}
      <section style={{ padding: '0', background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: 0 }}>
            {furniturePosts.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Full bleed divider after grid */}
      <div style={{ borderBottom: '1px solid var(--color-rule-hard)', marginTop: '-1px', position: 'relative', zIndex: 10 }}></div>

      {/* CTA Button Block */}
      <section style={{ padding: 'var(--space-12) 0 var(--space-16) 0', background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <Link href="/category/reviews" className="btn-buy">
              Browse All Reviews &nbsp;<ArrowRight size={16} />
            </Link>
          </div>
      </section>

      {/* ═══════════════ NEWSLETTER ═══════════════ */}
      <section style={{ background: 'var(--color-surface-dark)', padding: 'var(--space-20) 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-6)' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row' as const,
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-12)',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              {/* Kicker — JetBrains Mono */}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: 'var(--tracking-ribbon)',
                color: 'var(--color-accent-light)',
                display: 'block',
                marginBottom: 'var(--space-4)',
              }}>THE AURA EDIT</span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3vw, var(--text-3xl))',
                fontWeight: 700,
                color: 'var(--color-text-inverse)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-display)',
                marginBottom: 'var(--space-4)',
              }}>
                Curated picks,<br />
                <span style={{ fontStyle: 'italic' }}>delivered weekly.</span>
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'rgba(245,243,240,0.65)',
                lineHeight: 'var(--leading-relaxed)',
                maxWidth: '360px',
              }}>
                Join 12,000+ professionals who get our best gear picks every Thursday.
              </p>
            </div>

            <div style={{ width: '100%', maxWidth: '400px' }}>
              <form style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  style={{
                    width: '100%',
                    paddingLeft: '20px',
                    paddingRight: '130px',
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '1rem',
                    color: 'var(--color-text-inverse)',
                    outline: 'none',
                  }}
                  required
                />
                <button type="submit" className="btn-buy" style={{
                  position: 'absolute',
                  right: '4px',
                  top: '4px',
                  bottom: '4px',
                  padding: '0 18px',
                  gap: '0',
                  fontSize: 'var(--text-sm)',
                }}>
                  Subscribe
                </button>
              </form>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                textTransform: 'uppercase' as const,
                letterSpacing: 'var(--tracking-mono)',
                color: 'rgba(245,243,240,0.4)',
                marginTop: '12px',
              }}>
                No spam. Unsubscribe any time.{' '}
                <Link href="/privacy-policy" style={{ color: 'rgba(245,243,240,0.6)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

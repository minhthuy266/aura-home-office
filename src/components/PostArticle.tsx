import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Twitter,
  Mail,
  Share2,
} from 'lucide-react';
import { format } from 'date-fns';
import type { WPPost } from '../types';
import { TOCItem } from '../utils/processContent';
import PostInteractive from './PostInteractive';
import { formatSEOText } from '../utils/seoFormatter';

interface PostArticleProps {
  post: WPPost;
  latestPosts: WPPost[];
  processedHtml: string;
  toc: TOCItem[];
}

/**
 * PostArticle — Server Component
 * DESIGN.md §5 Article Layout + §8 Component Patterns
 *
 * ALL article content is rendered as static HTML at build time / SSR.
 * Interactive features (progress bar, TOC scroll spy) are delegated
 * to the thin <PostInteractive> client component.
 *
 * Key rules:
 * - Article content max-width: 680px
 * - Kickers in JetBrains Mono, ALWAYS uppercase
 * - Author/trust block with hairline rules (--color-rule-hard)
 * - FTC disclosure with border-left pattern
 * - No box-shadow on content blocks
 * - Images: border-radius: 0
 */
export default function PostArticle({ post, latestPosts, processedHtml, toc }: PostArticleProps) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.author?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const tags = post._embedded?.['wp:term']?.[1] || [];
  const relatedPosts = latestPosts.filter((p) => p.id !== post.id).slice(0, 3);
  const defaultPostImage =
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1400';

  // Clean title for display (replace placeholders in title too)
  const cleanTitleForDisplay = post.title.rendered
    .replace(
      /%keyword%/gi,
      post.title.rendered
        .replace(/<[^>]*>/g, '')
        .replace(/The \d+ Best | of \d{4}/gi, '')
        .trim(),
    )
    .replace(/%year%/gi, new Date().getFullYear().toString());

  // Clean excerpt using the central SEO formatter (handles placeholders + filler removal)
  const cleanExcerpt = formatSEOText(post.excerpt?.rendered || '', post.title.rendered);

  // Plain text title for schema
  const plainTitle = post.title.rendered.replace(/<[^>]*>/g, '');
  const postUrl = `https://aurahomeoffice.com/${categories[0]?.slug || 'uncategorized'}/${post.slug}`;
  const imageUrl = featuredMedia?.source_url || defaultPostImage;

  // Evidence label from tags (tag slugs: research-based, hands-on-tested, showroom-checked, owner-feedback-based)
  const evidenceTag = tags.find((t: { slug: string }) =>
    ['research-based', 'hands-on-tested', 'showroom-checked', 'owner-feedback-based'].includes(t.slug)
  );
  const evidenceLabelMap: Record<string, { label: string; color: string }> = {
    'research-based':       { label: 'Research-Based', color: 'var(--color-text-muted)' },
    'hands-on-tested':      { label: 'Hands-On Tested', color: 'var(--color-accent)' },
    'showroom-checked':     { label: 'Showroom Checked', color: '#7B6E5D' },
    'owner-feedback-based': { label: 'Owner Feedback-Based', color: 'var(--color-text-muted)' },
  };
  const evidenceInfo = evidenceTag ? evidenceLabelMap[evidenceTag.slug] : evidenceLabelMap['research-based'];

  // Article JSON-LD schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: plainTitle,
    description: post.excerpt?.rendered?.replace(/<[^>]*>/g, '').slice(0, 200) || '',
    image: imageUrl,
    url: postUrl,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      '@type': 'Organization',
      name: 'Aura Home Office',
      url: 'https://aurahomeoffice.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aura Home Office',
      url: 'https://aurahomeoffice.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aurahomeoffice.com/og-image.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };

  // BreadcrumbList JSON-LD schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://aurahomeoffice.com',
      },
      ...(categories[0]
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: categories[0].name,
              item: `https://aurahomeoffice.com/${categories[0].slug}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: categories[0] ? 3 : 2,
        name: plainTitle,
        item: postUrl,
      },
    ],
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* ── Article + BreadcrumbList Schema ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── Post Hero Header — Wirecutter Left Alignment ── */}
      <header
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          paddingTop: 'var(--page-pt, 160px)',
          paddingBottom: '48px',
          paddingLeft: '24px',
          paddingRight: '24px',
          textAlign: 'left',
        }}
        className="[--page-pt:120px] md:[--page-pt:160px]"
      >
        {/* Clean Meta Row: Breadcrumbs + Trust Signal */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '16px', 
          marginBottom: '32px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: 'var(--color-border)' }}>›</span>
            <Link href={`/${categories[0]?.slug}`} style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 700 }}>{categories[0]?.name}</Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            <ShieldCheck size={12} style={{ color: 'var(--color-accent)' }} />
            Independent Buying Guide
          </div>
        </div>

        {/* Headline — Balanced Size */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary)',
            marginBottom: '32px',
          }}
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Deck / Intro */}
        {cleanExcerpt && (
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.125rem, 3vw, 1.35rem)',
              lineHeight: 1.5,
              color: 'var(--color-text-secondary)',
              borderLeft: '4px solid var(--color-accent)',
              paddingLeft: '24px',
              marginBottom: '48px',
              maxWidth: '800px'
            }}
            dangerouslySetInnerHTML={{ __html: cleanExcerpt }}
          />
        )}

        {/* Author & Date — JetBrains Mono (WIRED article meta format) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 'var(--space-6)',
            paddingTop: 'var(--space-5)',
            borderTop: '1px solid var(--color-rule-hard)',
            maxWidth: '100%',
            margin: '0',
            flexWrap: 'wrap',
          }}
        >
          {author && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {author.avatar_urls &&
                (author.avatar_urls['48'] ||
                  author.avatar_urls['96'] ||
                  author.avatar_urls['24']) && (
                  <img
                    src={
                      author.avatar_urls['48'] ||
                      author.avatar_urls['96'] ||
                      author.avatar_urls['24']
                    }
                    alt={author.name}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid var(--color-border)',
                    }}
                  />
                )}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  textTransform: 'uppercase' as const,
                  letterSpacing: 'var(--tracking-mono)',
                  color: 'var(--color-text-muted)',
                  fontWeight: 400,
                }}
              >
                BY{' '}
                <strong style={{ color: 'var(--color-text-primary)' }}>
                  {author.name}
                </strong>
              </span>
            </div>
          )}
          <time
            dateTime={post.date}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-mono)',
              textTransform: 'uppercase' as const,
              color: 'var(--color-text-muted)',
              fontWeight: 400,
            }}
          >
            LAST UPDATED: {format(new Date(post.date), 'MMMM yyyy').toUpperCase()}
          </time>
        </div>
      </header>

      {/* ── Featured Image — square corners ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px' }}>
        <div
          style={{
            position: 'relative',
            aspectRatio: '21/9',
            overflow: 'hidden',
            borderRadius: 0,
            borderTop: '2px solid var(--color-rule-section)',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
          }}
        >
          <img
            src={featuredMedia?.source_url || defaultPostImage}
            alt={
              featuredMedia?.alt_text ||
              (post.title.rendered
                ? post.title.rendered.replace(/<[^>]*>/g, '')
                : 'Post image')
            }
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              borderRadius: 0,
            }}
          />
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 96px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Sidebar TOC + Progress Bar — rendered by PostInteractive (client) */}
          <PostInteractive toc={toc} />

          {/* ── Main Article Content — 8 Columns ── */}
          <main
            className="col-span-1 lg:col-span-8 order-2 min-w-0 p-4 md:p-8 border-x-0 md:border-x-[1px] md:border-border"
            style={{
              background: 'white',
              borderTop: '2px solid var(--color-rule-section)',
              borderBottom: '1px solid var(--color-border)',
              borderRadius: 0,
            }}
          >
            {/* FTC Disclosure — border-left pattern per DESIGN.md §8 */}
            <div className="disclosure" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <ShieldCheck
                  size={16}
                  style={{
                    color: 'var(--color-accent)',
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                />
                <p style={{ margin: 0 }}>
                  <strong
                    style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}
                  >
                    AFFILIATE DISCLOSURE:
                  </strong>{' '}
                  AS AN AMAZON ASSOCIATE WE EARN FROM QUALIFYING PURCHASES. THIS
                  DOESN&apos;T AFFECT OUR RECOMMENDATIONS.{' '}
                  <Link
                    href="/disclosure"
                    style={{
                      color: 'var(--color-accent)',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                    }}
                  >
                    READ OUR DISCLOSURE →
                  </Link>
                </p>
              </div>
            </div>

            {/* Article Body — SERVER-RENDERED HTML */}
            <article className="prose-premium">
              <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
            </article>

            {/* Share Footer */}
            <div
              style={{
                marginTop: '64px',
                paddingTop: '32px',
                borderTop: '1px solid var(--color-rule-hard)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              {/* Share label — JetBrains Mono */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase' as const,
                  letterSpacing: 'var(--tracking-ribbon)',
                  color: 'var(--color-text-muted)',
                }}
              >
                SHARE
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[Twitter, Mail, Share2].map((Icon, i) => (
                  <button
                    key={i}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Section — DESIGN.md §8 Component Patterns */}
            {tags.length > 0 && (
              <div
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {tags.map((tag: { id: number; name: string; slug: string }) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    style={{
                      padding: '6px 12px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 500,
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </main>

          {/* Right Sidebar — Trending (2 Columns, Independent Scroll) */}
          <aside className="hidden lg:block lg:col-span-2 sticky top-32 order-3">
            <div
              className="scrollbar-hide"
              style={{
                maxHeight: 'calc(100vh - 140px)',
                overflowY: 'auto',
                paddingBottom: '32px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-text-muted)',
                  display: 'block',
                  marginBottom: '24px',
                  borderBottom: '1px solid var(--color-rule-hard)',
                  paddingBottom: '8px',
                }}
              >
                TRENDING NOW
              </span>
              <div className="space-y-6">
                {relatedPosts.map((rp, i) => (
                  <Link
                    key={rp.id}
                    href={`/${rp._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized'}/${rp.slug}`}
                    className="group flex gap-4 items-start text-decoration-none"
                  >
                    {/* Number Marker — Mono */}
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--color-accent)',
                        opacity: 0.4,
                        marginTop: '2px',
                      }}
                    >
                      0{i + 1}
                    </span>

                    <div style={{ flex: 1 }}>
                      {/* Image — Small Thumb */}
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '16/9',
                          background: 'var(--color-surface)',
                          overflow: 'hidden',
                          marginBottom: '8px',
                          border: '1px solid var(--color-border-subtle)',
                        }}
                      >
                        <img
                          src={
                            rp._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                            defaultPostImage
                          }
                          alt={rp.title.rendered}
                          style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                            transition: 'transform 0.5s ease',
                          }}
                          className="group-hover:scale-105"
                        />
                      </div>
                      {/* Title — Display */}
                      <h4
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '15px',
                          color: 'var(--color-text-primary)',
                          lineHeight: '1.4',
                          fontWeight: 700,
                          margin: 0,
                        }}
                        dangerouslySetInnerHTML={{ __html: rp.title.rendered }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Up Next — hairline rule separator */}
        <div
          style={{
            marginTop: '80px',
            paddingTop: '48px',
            borderTop: '1px solid var(--color-rule-hard)',
          }}
        >
          {/* Kicker — JetBrains Mono */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-text-muted)',
              display: 'block',
              marginBottom: 'var(--space-6)',
            }}
          >
            UP NEXT
          </span>
          {relatedPosts[0] && (
            <Link
              href={`/${relatedPosts[0]._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized'}/${relatedPosts[0].slug}`}
              style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
                textDecoration: 'none',
              }}
              className="group flex-col md:flex-row"
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '200px',
                  aspectRatio: '16/10',
                  overflow: 'hidden',
                  borderRadius: 0,
                  background: 'var(--color-surface)',
                  flexShrink: 0,
                  border: '1px solid var(--color-rule-hard)',
                }}
                className="md:w-1/4"
              >
                <img
                  src={
                    relatedPosts[0]._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                    defaultPostImage
                  }
                  alt={relatedPosts[0].title.rendered}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    borderRadius: 0,
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-lg)',
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.3,
                    fontWeight: 700,
                    letterSpacing: 'var(--tracking-display)',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    className="group-hover:bg-[length:100%_2px]"
                    style={{
                      backgroundImage: 'linear-gradient(currentColor, currentColor)',
                      backgroundPosition: '0% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '0% 2px',
                      transition: 'background-size 0.3s ease',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: relatedPosts[0].title.rendered,
                    }}
                  />
                </h4>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: relatedPosts[0].excerpt.rendered,
                  }}
                />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

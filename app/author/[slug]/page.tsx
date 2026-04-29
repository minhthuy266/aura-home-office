import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAuthorBySlug, AUTHORS } from '../../../src/config/authors';
import { getPostsByAuthorId } from '../../../src/services/wpService';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  return AUTHORS.map((author) => ({ slug: author.id }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return { title: 'Author Not Found' };

  return {
    title: `${author.name} — ${author.role} at Aura Home Office`,
    description: author.shortBio + '. Independent home office buying research at Aura Home Office.',
    alternates: {
      canonical: `https://aurahomeoffice.com/author/${author.id}`,
    },
    openGraph: {
      title: `${author.name} — Aura Home Office`,
      description: author.shortBio,
      url: `https://aurahomeoffice.com/author/${author.id}`,
      type: 'profile',
      siteName: 'Aura Home Office',
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  // Fetch recent posts for this author directly from WordPress.
  const authorPosts = author.wpUserId ? await getPostsByAuthorId(author.wpUserId, 6) : [];

  const latestActivity = authorPosts[0]?.modified || authorPosts[0]?.date;

  // JSON-LD Person schema (Individual)
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://aurahomeoffice.com/author/${author.id}/#person`,
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `https://aurahomeoffice.com/author/${author.id}`,
    image: author.avatar,
    identifier: author.wpUserId ? `wp-user-${author.wpUserId}` : author.id,
    worksFor: {
      '@type': 'Organization',
      name: 'Aura Home Office',
      url: 'https://aurahomeoffice.com',
    },
    knowsAbout: author.expertise,
  };

  const recentArticleEntities = authorPosts.map((post) => {
    const categorySlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized';
    const articleUrl = `https://aurahomeoffice.com/${categorySlug}/${post.slug}`;

    return {
      '@type': 'Article',
      '@id': `${articleUrl}#article`,
      headline: post.title.rendered.replace(/<[^>]*>/g, ''),
      url: articleUrl,
      datePublished: post.date,
      dateModified: post.modified || post.date,
      author: {
        '@id': `https://aurahomeoffice.com/author/${author.id}/#person`,
      },
    };
  });

  // JSON-LD ProfilePage schema (The page itself)
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `https://aurahomeoffice.com/author/${author.id}/#webpage`,
    url: `https://aurahomeoffice.com/author/${author.id}`,
    name: `${author.name} Profile — Aura Home Office`,
    mainEntity: { '@id': `https://aurahomeoffice.com/author/${author.id}/#person` },
    description: author.shortBio,
    ...(latestActivity ? { dateModified: latestActivity } : {}),
    publisher: {
      '@type': 'Organization',
      name: 'Aura Home Office',
      url: 'https://aurahomeoffice.com',
    },
    ...(recentArticleEntities.length > 0 ? { hasPart: recentArticleEntities } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />

      <main style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: '120px' }}>

        {/* ── Author Hero ── */}
        <header style={{
          paddingTop: 'var(--page-pt, 160px)',
          paddingBottom: '80px',
          borderBottom: '1px solid var(--color-rule-hard)',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

            {/* Back link */}
            <Link
              href="/about"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--color-text-muted)', textDecoration: 'none',
                marginBottom: '48px',
              }}
            >
              <ArrowLeft size={12} />
              Meet the Team
            </Link>

            <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}
              className="flex-col md:flex-row"
            >
              {/* Avatar */}
              <div style={{
                width: '120px', height: '120px', flexShrink: 0,
                borderRadius: '50%', overflow: 'hidden',
                border: '4px solid var(--color-border)',
                background: 'var(--color-surface)',
              }}>
                <img
                  src={author.avatar}
                  alt={`${author.name}, ${author.role} at Aura Home Office`}
                  width={120} height={120}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: 'var(--color-accent)', display: 'block', marginBottom: '12px',
                }}>
                  {author.role}
                </span>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
                  color: 'var(--color-text-primary)', lineHeight: 1.1,
                  letterSpacing: '-0.02em', marginBottom: '24px',
                }}>
                  {author.name}
                </h1>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '1.125rem',
                  color: 'var(--color-text-secondary)', lineHeight: 1.75,
                  maxWidth: '620px', marginBottom: '32px',
                }}>
                  {author.bio}
                </p>

                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: 'var(--color-text-muted)', display: 'block', marginBottom: '12px',
                }}>
                  Areas of Focus
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {author.expertise.map((topic) => (
                    <span key={topic} style={{
                      fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      color: 'var(--color-text-muted)',
                      padding: '6px 12px',
                      border: '1px solid var(--color-border-subtle)',
                      background: 'var(--color-surface)',
                    }}>
                      {topic}
                    </span>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginTop: '32px',
                  paddingTop: '24px',
                  borderTop: '1px solid var(--color-rule-hard)',
                }}>
                  {[
                    { href: '/about', label: 'About' },
                    { href: '/about#methodology', label: 'Methodology' },
                    { href: '/disclosure', label: 'Disclosure' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--color-accent)',
                        textDecoration: 'none',
                        borderBottom: '1px solid var(--color-accent)',
                        paddingBottom: '2px',
                      }}
                    >
                      {link.label} →
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Editorial Standards Note ── */}
        <section style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-rule-hard)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <ShieldCheck size={20} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '1rem',
                color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0,
              }}>
                All Aura Home Office content is research-based unless labeled otherwise.
                Our recommendations are not for sale — brands cannot pay for positive verdicts or to hide trade-offs.{' '}
                <Link href="/about" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
                  Read our editorial standards →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* ── Recent Articles ── */}
        {authorPosts.length > 0 && (
          <section style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--color-text-muted)', display: 'block', marginBottom: '40px',
              borderBottom: '1px solid var(--color-rule-hard)', paddingBottom: '16px',
            }}>
              Recent Articles by {author.name}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {authorPosts.map((post, i) => {
                const cat = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized';
                const thumb = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                const title = post.title.rendered.replace(/<[^>]*>/g, '');
                return (
                  <Link
                    key={post.id}
                    href={`/${cat}/${post.slug}`}
                    style={{
                      display: 'flex', gap: '24px', alignItems: 'center',
                      padding: '24px 0',
                      borderTop: i === 0 ? 'none' : '1px solid var(--color-border-subtle)',
                      textDecoration: 'none',
                    }}
                    className="group"
                  >
                    {thumb && (
                      <div style={{
                        width: '80px', height: '60px', flexShrink: 0,
                        overflow: 'hidden', background: 'var(--color-surface)',
                      }}>
                        <img
                          src={thumb}
                          alt={title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700,
                      color: 'var(--color-text-primary)', lineHeight: 1.4,
                    }}>
                      {title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

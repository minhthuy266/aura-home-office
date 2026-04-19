"use client";
import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { WPPost } from '../types';
import { formatSEOText } from '../utils/seoFormatter';

interface PostCardProps {
  post: WPPost;
  isFeatured?: boolean;
  isCompact?: boolean;
  isHorizontal?: boolean;
  index?: number;
}

export default function PostCard({ post, isFeatured, isCompact, isHorizontal, index = 0 }: PostCardProps) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const rating = post.acf?.rating; 
  const defaultImage = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200";
  const postUrl = `/category/${categories[0]?.slug || 'uncategorized'}/${post.slug}`;

  // FEATURED — Hero style
  if (isFeatured) {
    return (
      <article className="group relative aspect-[16/9] overflow-hidden img-zoom-hover" style={{ borderRadius: 0 }}>
        <img 
          src={featuredMedia?.source_url || defaultImage} 
          className="w-full h-full object-cover"
          alt={post.title.rendered}
          loading="lazy"
          style={{ borderRadius: 0 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,17,16,0.85) 0%, rgba(17,17,16,0.2) 60%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {categories.slice(0,1).map(cat => (
            <span key={cat.id} className="kicker" style={{ color: 'rgba(245,243,240,0.7)', marginBottom: '12px' }}>{cat.name}</span>
          ))}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, var(--text-3xl))',
            fontWeight: 700,
            color: 'var(--color-text-inverse)',
            lineHeight: 'var(--leading-snug)',
            letterSpacing: '-0.02em',
            marginBottom: '12px',
          }}>
            <Link href={postUrl} style={{ color: 'inherit', textDecoration: 'none' }}>
              <span className="group-hover:bg-[length:100%_2px]" style={{
                backgroundImage: 'linear-gradient(currentColor, currentColor)',
                backgroundPosition: '0% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '0% 2px',
                transition: 'background-size 0.3s ease',
              }} dangerouslySetInnerHTML={{ __html: formatSEOText(post.title.rendered, post.title.rendered, categories[0]?.name, post.content?.rendered) }} />
            </Link>
          </h3>
          <time className="text-editorial-cap" style={{ color: 'rgba(245,243,240,0.55)' }}>
            {format(new Date(post.date), 'MMMM dd, yyyy')}
          </time>
        </div>
      </article>
    );
  }

  // COMPACT — Sidebar style
  if (isCompact) {
    return (
      <article className="group flex gap-4 items-center" style={{ padding: '12px 0', borderBottom: '1px solid var(--color-rule-hard)' }}>
        <Link href={postUrl} className="shrink-0 img-zoom-hover" style={{ width: '72px', height: '72px', background: 'var(--color-surface)', borderRadius: 0 }}>
          <img src={featuredMedia?.source_url || defaultImage} className="w-full h-full object-cover" alt={post.title.rendered} loading="lazy" style={{ borderRadius: 0 }} />
        </Link>
        <div className="min-w-0 pr-1">
          {categories.slice(0,1).map(cat => (
            <span key={cat.id} className="label-micro" style={{ color: 'var(--color-accent)', marginBottom: '4px', display: 'block' }}>{cat.name}</span>
          ))}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: '1.4',
            letterSpacing: '-0.01em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            <Link href={postUrl} dangerouslySetInnerHTML={{ __html: formatSEOText(post.title.rendered, post.title.rendered, categories[0]?.name, post.content?.rendered) }} style={{ color: 'inherit', textDecoration: 'none' }} />
          </h3>
        </div>
      </article>
    );
  }

  // HORIZONTAL — List style (For Category Pages)
  if (isHorizontal) {
    return (
      <article className="group flex flex-col sm:flex-row gap-6 md:gap-8" style={{
        padding: '32px 0',
        borderBottom: '1px solid var(--color-rule-hard)',
      }}>
        <Link href={postUrl} className="shrink-0 img-zoom-hover" style={{
          width: '100%',
          maxWidth: '300px',
          aspectRatio: '16/10',
          background: 'var(--color-surface)',
          borderRadius: 0,
        }}>
          <img 
            src={featuredMedia?.source_url || defaultImage} 
            className="w-full h-full object-cover" 
            alt={post.title.rendered} 
            loading="lazy" 
          />
        </Link>
        <div className="flex flex-col justify-center">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {categories.slice(0,1).map(cat => (
              <span key={cat.id} className="label-micro" style={{ color: 'var(--color-accent)' }}>{cat.name}</span>
            ))}
            {post._embedded?.['wp:term']?.[1]?.[0] && (
              <>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--color-border-hard)' }}></span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)',
                }}>
                  {post._embedded['wp:term'][1][0].name}
                </span>
              </>
            )}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: '1.3',
            letterSpacing: '-0.015em',
            marginBottom: '12px',
          }}>
            <Link href={postUrl} style={{ color: 'inherit', textDecoration: 'none' }}>
              <span className="group-hover:bg-[length:100%_2px]" style={{
                backgroundImage: 'linear-gradient(currentColor, currentColor)',
                backgroundPosition: '0% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '0% 2px',
                transition: 'background-size 0.3s ease',
              }} dangerouslySetInnerHTML={{ __html: formatSEOText(post.title.rendered, post.title.rendered, categories[0]?.name, post.content?.rendered) }} />
            </Link>
          </h3>
          <div 
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.6',
              marginBottom: '16px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}
            dangerouslySetInnerHTML={{ __html: formatSEOText(post.excerpt?.rendered || '', post.title.rendered, categories[0]?.name, post.content?.rendered) }}
          />
          <time className="text-editorial-cap" style={{ fontSize: '10px' }}>
            {format(new Date(post.date), 'MMM dd, yyyy')}
          </time>
        </div>
      </article>
    );
  }

  // STANDARD — Vertical Grid style (For Homepage)
  return (
    <article className="group flex flex-col max-md:border-r-0 md:border-r md:even:border-r-0 lg:even:border-r lg:[&:nth-child(4n)]:border-r-0 border-b border-[var(--color-rule-hard)]" style={{
      padding: 'var(--space-6)',
    }}>
      <Link href={postUrl} className="block img-zoom-hover" style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-surface)', position: 'relative', marginBottom: 'var(--space-4)', borderRadius: 0 }}>
        <img src={featuredMedia?.source_url || defaultImage} alt={post.title.rendered} className="w-full h-full object-cover" loading="lazy" style={{ borderRadius: 0 }} />
      </Link>
      <div className="flex flex-col flex-grow">
        {categories.slice(0,1).map(cat => (
          <span key={cat.id} className="label-micro" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>{cat.name}</span>
        ))}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          lineHeight: 'var(--leading-tight)',
          letterSpacing: '-0.015em',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}>
          <Link href={postUrl} style={{ color: 'inherit', textDecoration: 'none' }}>
            <span className="group-hover:bg-[length:100%_2px]" style={{
              backgroundImage: 'linear-gradient(currentColor, currentColor)',
              backgroundPosition: '0% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '0% 2px',
              transition: 'background-size 0.3s ease',
            }} dangerouslySetInnerHTML={{ __html: formatSEOText(post.title.rendered, post.title.rendered, categories[0]?.name, post.content?.rendered) }} />
          </Link>
        </h3>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-text-body)', lineHeight: '1.6', marginBottom: 'var(--space-3)', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}
          dangerouslySetInnerHTML={{ __html: formatSEOText(post.excerpt?.rendered || '', post.title.rendered, categories[0]?.name, post.content?.rendered) }}
        />
        <time className="text-editorial-cap" style={{ fontSize: '10px' }}>{format(new Date(post.date), 'MMM dd, yyyy')}</time>
      </div>
    </article>
  );
}

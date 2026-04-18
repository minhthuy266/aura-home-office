"use client";
import React from 'react';
import Link from 'next/link';

/**
 * CategoryGrid — DESIGN.md compliant
 * 
 * Rules enforced:
 * - No decorative animations, no parallax, no hover lift
 * - No glassmorphism, no backdrop-blur
 * - No rounded corners on images (--radius-none)
 * - Kickers in JetBrains Mono, uppercase
 * - Square-cornered images
 * - Hairline rules for structure
 */

const CATEGORIES = [
  { 
    name: 'Reviews', 
    slug: 'reviews', 
    image: 'https://images.unsplash.com/photo-1454165833767-027508496bce?q=80&w=1200', 
    span: 'md:col-span-2 md:row-span-2',
    desc: 'Expert gear analysis'
  },
  { 
    name: 'Gaming PCs', 
    slug: 'gaming-pcs', 
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800', 
    span: 'md:col-span-2 md:row-span-1',
    desc: 'Performance for work and play'
  },
  { 
    name: 'Peripherals', 
    slug: 'peripherals', 
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800', 
    span: 'md:col-span-1 md:row-span-1',
    desc: 'Premium tools for your hands'
  },
  { 
    name: 'Components', 
    slug: 'components', 
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800', 
    span: 'md:col-span-1 md:row-span-1',
    desc: 'Building blocks of productivity'
  },
  { 
    name: 'Standing Desks', 
    slug: 'standing-desks', 
    image: 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=800', 
    span: 'md:col-span-1 md:row-span-1',
    desc: 'Ergonomic elevation'
  },
  { 
    name: 'Air Purifiers', 
    slug: 'air-purifiers', 
    image: 'https://images.unsplash.com/photo-1585771724684-2e270052e24a?q=80&w=800', 
    span: 'md:col-span-1 md:row-span-1',
    desc: 'Breathe cleaner air'
  },
  { 
    name: 'Blog', 
    slug: 'blog', 
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200', 
    span: 'md:col-span-2 md:row-span-1',
    desc: 'Stay updated with office trends'
  },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-0" style={{ border: '1px solid var(--color-rule-hard)' }}>
      {CATEGORIES.map((cat) => (
        <Link 
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className={`${cat.span} group relative overflow-hidden flex items-end cursor-pointer img-zoom-hover`}
          style={{
            minHeight: '220px',
            borderRight: '1px solid var(--color-rule-hard)',
            borderBottom: '1px solid var(--color-rule-hard)',
            textDecoration: 'none',
          }}
        >
          {/* Image — square corners, subtle sleep-to-wake transition */}
          <div className="absolute inset-0 z-0">
            <img 
              src={cat.image} 
              alt={cat.name}
              loading="lazy"
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              style={{ borderRadius: 0 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800';
              }}
            />
            <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-70" style={{ background: 'linear-gradient(to top, rgba(17,17,16,0.95), rgba(17,17,16,0.3))' }} />
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-6 w-full transition-transform duration-300 group-hover:-translate-y-1">
            {/* Kicker — JetBrains Mono, uppercase */}
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 400,
              textTransform: 'uppercase' as const,
              letterSpacing: 'var(--tracking-mono)',
              color: 'rgba(245,243,240,0.6)',
              marginBottom: 'var(--space-2)',
            }}>
              {cat.desc}
            </p>
            {/* Headline — DM Sans for UI labels */}
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
              fontWeight: 700,
              color: 'var(--color-text-inverse)',
              letterSpacing: 'var(--tracking-display)',
              lineHeight: 'var(--leading-tight)',
              transition: 'color 0.2s ease',
            }} className="group-hover:text-white">
              <span style={{
                backgroundImage: 'linear-gradient(currentColor, currentColor)',
                backgroundPosition: '0% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '0% 2px',
                transition: 'background-size 0.3s ease',
              }} className="group-hover:bg-[length:100%_2px]">
                {cat.name}
              </span>
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

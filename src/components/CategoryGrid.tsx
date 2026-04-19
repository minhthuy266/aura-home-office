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
    name: 'Furniture', 
    slug: 'furniture', 
    // Home office with wooden desk, shelving, clean editorial feel
    image: 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=1200', 
    span: 'md:col-span-2 md:row-span-2',
    desc: 'Desks, Chairs & More'
  },
  { 
    name: 'Workspace Setup', 
    slug: 'setup', 
    // Clean minimal home office desk with ultrawide monitor
    image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=800', 
    span: 'md:col-span-2 md:row-span-1',
    desc: 'The Foundation'
  },
  { 
    name: 'Standing Desks', 
    slug: 'standing-desks', 
    // Person working at a height-adjustable standing desk
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=800', 
    span: 'md:col-span-1 md:row-span-1',
    desc: 'Active Workspace'
  },
  { 
    name: 'Ergonomic Chairs', 
    slug: 'ergonomic-chairs', 
    // Ergonomic mesh office chair at home office desk
    image: 'https://images.unsplash.com/photo-1623177579111-ccdec0898ed1?q=80&w=800', 
    span: 'md:col-span-1 md:row-span-1',
    desc: 'Lumbar & Comfort'
  },
  { 
    name: 'Monitor Arms', 
    slug: 'monitor-arms', 
    // Triple monitor home office setup with desk-mounted arms
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800', 
    span: 'md:col-span-1 md:row-span-1',
    desc: 'Display Ergonomics'
  },
  { 
    name: 'Desk Accessories', 
    slug: 'desk-accessories', 
    // Organized home office desk: lamp, organizer, keyboard, notepad
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800', 
    span: 'md:col-span-1 md:row-span-1',
    desc: 'Essential Add-ons'
  },
  { 
    name: 'Guides & Health', 
    slug: 'guides', 
    // Person at desk with good ergonomic posture, home office
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=1200', 
    span: 'md:col-span-2 md:row-span-1',
    desc: 'Wellness & Focus'
  },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-0" style={{ border: '1px solid var(--color-rule-hard)' }}>
      {CATEGORIES.map((cat) => (
        <Link 
          key={cat.slug}
          href={`/${cat.slug}`}
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

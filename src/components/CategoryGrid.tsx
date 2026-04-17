"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  { 
    name: 'Reviews', 
    slug: 'reviews', 
    image: 'https://images.unsplash.com/photo-1454165833767-027508496bce?q=80&w=1200', 
    span: 'md:col-span-2 md:row-span-2',
    desc: 'Unbiased gear analysis'
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {CATEGORIES.map((cat) => (
        <Link 
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className={`${cat.span} group relative overflow-hidden rounded-3xl flex items-end min-h-[220px] md:min-h-[260px] cursor-pointer`}
        >
          {/* Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={cat.image} 
              alt={cat.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-6 w-full flex items-end justify-between">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#C4A265] group-hover:text-white transition-colors duration-500">
                {cat.desc}
              </p>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight leading-none italic">
                {cat.name}
              </h3>
              <div className="h-0.5 w-0 bg-[#C4A265] rounded-full transition-all duration-700 group-hover:w-16"></div>
            </div>
            
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0 border border-white/20 shadow-lg">
              <ArrowUpRight size={20} className="text-white" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  { 
    name: 'Standing Desks', 
    slug: 'standing-desks', 
    image: 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=1200', 
    span: 'md:col-span-2 md:row-span-2',
    desc: 'Elevate your daily workflow'
  },
  { 
    name: 'Ergonomic Chairs', 
    slug: 'ergonomic-chairs', 
    image: 'https://images.unsplash.com/photo-1505797149-43b00fe9ee25?q=80&w=800', 
    span: 'md:col-span-2 md:row-span-1',
    desc: 'Engineered for posture and focus'
  },
  { 
    name: 'Monitor Arms', 
    slug: 'monitor-arms', 
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=800', 
    span: 'md:col-span-1 md:row-span-1',
    desc: 'Cinematic display elevation'
  },
  { 
    name: 'Desk Lighting', 
    slug: 'desk-lighting', 
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800', 
    span: 'md:col-span-1 md:row-span-1',
    desc: 'Reduce eye strain'
  },
  { 
    name: 'Workspace Ideas', 
    slug: 'workspace-ideas', 
    image: 'https://plus.unsplash.com/premium_photo-1661330386229-ea6868af380d?w=1200&auto=format&fit=crop&q=80', 
    span: 'md:col-span-2 md:row-span-1',
    desc: 'Aesthetic setup inspiration'
  },
  { 
    name: 'Cable Management', 
    slug: 'cable-management', 
    image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=800', 
    span: 'md:col-span-1 md:row-span-1',
    desc: 'Minimalist wire-free kits'
  },
  { 
    name: 'Productivity', 
    slug: 'productivity', 
    image: 'https://images.unsplash.com/photo-1506784919141-995400966f0e?w=800&auto=format&fit=crop&q=80', 
    span: 'md:col-span-1 md:row-span-1',
    desc: 'Master your flow state'
  },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {CATEGORIES.map((cat) => (
        <Link 
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className={`${cat.span} group relative overflow-hidden rounded-2xl flex items-end min-h-[180px] md:min-h-[220px] cursor-pointer`}
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
          <div className="relative z-10 p-5 w-full flex items-end justify-between">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4A265] group-hover:text-white transition-colors duration-500">
                {cat.desc}
              </p>
              <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight leading-none italic">
                {cat.name}
              </h3>
              <div className="h-0.5 w-0 bg-[#C4A265] rounded-full transition-all duration-700 group-hover:w-16"></div>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 border border-white/20">
              <ArrowUpRight size={16} className="text-white" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

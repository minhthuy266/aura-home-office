"use client";
import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { WPPost } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface PostCardProps {
  post: WPPost;
  isFeatured?: boolean;
  isCompact?: boolean;
  index?: number;
}

export default function PostCard({ post, isFeatured, isCompact, index = 0 }: PostCardProps) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const rating = post.acf?.rating; 
  const defaultImage = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200";
  const postUrl = `/category/${categories[0]?.slug || 'uncategorized'}/${post.slug}`;

  // Featured State
  if (isFeatured) {
    return (
      <article className="group relative aspect-[16/9] overflow-hidden rounded-2xl">
        <img 
          src={featuredMedia?.source_url || defaultImage} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s] ease-out"
          alt={post.title.rendered}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-3">
          <div className="flex items-center gap-2.5">
            {categories.slice(0,1).map(cat => (
              <span key={cat.id} className="pill pill-gold text-[8px]">{cat.name}</span>
            ))}
            {rating && (
              <span className="pill glass-dark text-white text-[9px] font-bold tracking-wider">
                <span className="text-[#D4AF37] mr-1">★</span> {rating}
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-3xl font-display font-bold text-white leading-[1.05] tracking-tight group-hover:text-[#D4AF37] transition-colors duration-500">
            <Link href={postUrl} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </h3>
          <div className="flex items-center gap-4">
            <time className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">{format(new Date(post.date), 'MMMM dd, yyyy')}</time>
            <div className="flex-grow h-px bg-white/10"></div>
            <span className="text-[10px] text-white/50 font-semibold uppercase tracking-widest flex items-center gap-1.5 group-hover:text-[#D4AF37] transition-colors">
              Read <ArrowUpRight size={10} />
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Compact Style
  if (isCompact) {
    return (
      <article className="group flex gap-4 items-center">
        <Link href={postUrl} className="w-24 h-24 rounded-xl overflow-hidden shrink-0 img-zoom bg-[#F5F4F0]">
          <img src={featuredMedia?.source_url || defaultImage} className="w-full h-full object-cover" alt={post.title.rendered} />
        </Link>
        <div className="space-y-1.5 min-w-0">
          {categories.slice(0,1).map(cat => (
            <span key={cat.id} className="label-micro text-[#C4A265] text-[8px]">{cat.name}</span>
          ))}
          <h3 className="text-sm font-display font-bold text-[#1A1A1A] leading-snug group-hover:text-[#C4A265] transition-colors duration-300 line-clamp-2">
            <Link href={postUrl} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </h3>
          <time className="label-micro block text-[8px]">{format(new Date(post.date), 'MMM dd, yyyy')}</time>
        </div>
      </article>
    );
  }

  // Standard Card
  return (
    <article className="group flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[var(--shadow-card-hover)] border border-black/[0.04]">
      <Link href={postUrl} className="block aspect-[16/10] overflow-hidden relative bg-[#F5F4F0]">
        <img 
          src={featuredMedia?.source_url || defaultImage} 
          alt={featuredMedia?.alt_text || post.title.rendered}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-all duration-[1.2s] ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-3 left-3">
          {categories.slice(0,1).map(cat => (
            <span key={cat.id} className="pill pill-dark shadow-md text-[8px] py-0.5 px-2">{cat.name}</span>
          ))}
        </div>
        {rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full glass-dark text-white text-[9px] font-bold tracking-wider shadow-lg">
            <span className="text-[#D4AF37]">★</span> {rating}
          </div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <time dateTime={post.date} className="label-micro mb-2 text-[8px]">
          {format(new Date(post.date), 'MMM dd, yyyy')}
        </time>
        <h3 className="text-[15px] font-display font-bold leading-snug mb-2 text-[#1A1A1A] group-hover:text-[#C4A265] transition-colors duration-300 line-clamp-2">
          <Link href={postUrl} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </h3>
        <div 
          className="text-[#6B6B6B] line-clamp-2 text-xs leading-relaxed mb-4 flex-grow"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        <div className="mt-auto pt-3 border-t border-black/[0.04] flex justify-between items-center">
          <span className="text-[10px] font-semibold text-[#9A9A9A] uppercase tracking-widest group-hover:text-[#C4A265] transition-colors duration-300">
            Read More
          </span>
          <span className="w-6 h-6 rounded-full bg-[#F5F4F0] flex items-center justify-center group-hover:bg-[#C4A265] group-hover:text-white transition-all duration-300 text-[#9A9A9A]">
            <ArrowUpRight size={11} />
          </span>
        </div>
      </div>
    </article>
  );
}

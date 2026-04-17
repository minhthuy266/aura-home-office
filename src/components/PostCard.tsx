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
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 space-y-4">
          <div className="flex items-center gap-3">
            {categories.slice(0,1).map(cat => (
              <span key={cat.id} className="pill pill-gold">{cat.name}</span>
            ))}
            {rating && (
              <span className="pill glass-dark text-white text-xs font-bold tracking-widest px-3">
                <span className="text-[#D4AF37] mr-1">★</span> {rating}
              </span>
            )}
          </div>
          <h3 className="text-2xl md:text-4xl font-display font-bold text-white leading-[1.05] tracking-tight group-hover:text-[#D4AF37] transition-colors duration-500">
            <Link href={postUrl} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <time className="text-xs text-white/60 font-semibold uppercase tracking-widest">{format(new Date(post.date), 'MMMM dd, yyyy')}</time>
            <div className="flex-grow h-px bg-white/20"></div>
            <span className="text-xs text-white/80 font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-[#D4AF37] transition-colors">
              Read <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Compact Style
  if (isCompact) {
    return (
      <article className="group flex gap-5 items-center bg-white p-3 rounded-2xl hover:shadow-md transition-all duration-300 border border-transparent hover:border-black/[0.04]">
        <Link href={postUrl} className="w-24 h-24 rounded-xl overflow-hidden shrink-0 img-zoom bg-[#F5F4F0]">
          <img src={featuredMedia?.source_url || defaultImage} className="w-full h-full object-cover" alt={post.title.rendered} />
        </Link>
        <div className="space-y-2 min-w-0 pr-2">
          {categories.slice(0,1).map(cat => (
            <span key={cat.id} className="label-micro block text-[#C4A265]">{cat.name}</span>
          ))}
          <h3 className="text-base font-display font-bold text-[#1A1A1A] leading-snug group-hover:text-[#C4A265] transition-colors duration-300 line-clamp-2">
            <Link href={postUrl} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </h3>
          <time className="label-micro block text-[#9A9A9A]">{format(new Date(post.date), 'MMM dd, yyyy')}</time>
        </div>
      </article>
    );
  }

  // Standard Card
  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[var(--shadow-card-hover)] border border-black/[0.04]">
      <Link href={postUrl} className="block aspect-[16/10] overflow-hidden relative bg-[#F5F4F0]">
        <img 
          src={featuredMedia?.source_url || defaultImage} 
          alt={featuredMedia?.alt_text || post.title.rendered}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-all duration-[1.2s] ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 left-4 flex gap-2">
          {categories.slice(0,1).map(cat => (
            <span key={cat.id} className="pill pill-dark shadow-md px-3 py-1 text-xs">{cat.name}</span>
          ))}
        </div>
        {rating && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-dark text-white text-xs font-bold tracking-wider shadow-lg">
            <span className="text-[#D4AF37]">★</span> {rating}
          </div>
        )}
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <time dateTime={post.date} className="label-micro mb-3 block text-[#9A9A9A]">
          {format(new Date(post.date), 'MMM dd, yyyy')}
        </time>
        <h3 className="text-xl font-display font-bold leading-snug mb-3 text-[#1A1A1A] group-hover:text-[#C4A265] transition-colors duration-300 line-clamp-2">
          <Link href={postUrl} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </h3>
        <div 
          className="text-[#6B6B6B] line-clamp-2 text-sm leading-relaxed mb-6 flex-grow"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        <div className="mt-auto pt-4 border-t border-black/[0.04] flex justify-between items-center">
          <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest group-hover:text-[#C4A265] transition-colors duration-300">
            Read Review
          </span>
          <span className="w-8 h-8 rounded-full bg-[#FAFAF7] border border-black/5 flex items-center justify-center group-hover:bg-[#C4A265] group-hover:border-[#C4A265] group-hover:text-white transition-all duration-300 text-[#1A1A1A]">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}

"use client";
import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { WPPost } from '../types';

interface PostCardProps {
  post: WPPost;
  key?: React.Key;
}

export default function PostCard({ post }: PostCardProps) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const rating = post.acf?.rating; 

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300">
      <Link href={`/post/${post.slug}`} className="block aspect-[16/10] overflow-hidden relative bg-zinc-100">
        {featuredMedia ? (
          <img 
            src={featuredMedia.source_url} 
            alt={featuredMedia.alt_text || post.title.rendered}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400 font-mono text-sm">
            NO_IMAGE_DATA
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">
          {categories.slice(0,1).map(cat => (
             <span key={cat.id} className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-zinc-900 rounded border border-zinc-200 shadow-sm">
               {cat.name}
             </span>
          ))}
        </div>

        {rating && (
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white text-zinc-900 font-sans font-bold text-sm rounded flex items-center gap-1 shadow-md border border-zinc-100">
             <span className="text-amber-500 text-lg leading-none mt-[-2px]">★</span> {rating}
          </div>
        )}
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <time dateTime={post.date} className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
            {format(new Date(post.date), 'MM.dd.yyyy')}
          </time>
        </div>
        
        <h3 className="text-2xl font-display font-semibold leading-[1.25] mb-3 text-zinc-900 group-hover:text-amber-700 transition-colors line-clamp-2">
          <Link href={`/post/${post.slug}`} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </h3>
        
        <div 
          className="text-zinc-500 line-clamp-2 text-sm leading-relaxed mb-6 flex-grow font-light"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />

        <div className="mt-auto pt-5 border-t border-zinc-100">
          <Link 
            href={`/post/${post.slug}`}
            className="text-[11px] font-bold text-zinc-500 group-hover:text-amber-600 uppercase tracking-widest inline-flex items-center transition-colors w-full justify-between"
          >
            <span>Read Verdict</span>
            <span className="font-mono text-lg leading-none group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

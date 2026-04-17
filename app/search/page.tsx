import React from 'react';
import { searchPosts } from '../../src/services/wpService';
import PostCard from '../../src/components/PostCard';

interface SearchPageProps {
  searchParams: Promise<{ q: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  
  const posts = query ? await searchPosts(query) : [];

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 animate-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C4A265]/10 rounded-full mb-4">
             <span className="text-[10px] uppercase tracking-widest font-black text-[#C4A265]">Search Results</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-[#1A1A1A] mb-6">
            {query ? `“${query}”` : 'Search Archive'}
          </h1>
          <p className="text-xl text-[#6B6B6B] font-light leading-relaxed max-w-2xl">
            {posts.length > 0 
              ? `We found ${posts.length} articles matching your query in the Aura archive.`
              : query 
                ? `Our archives don't seem to have anything on "${query}" yet. Try searching for broader terms like "chairs" or "desks".`
                : 'Enter a keyword to search our archive of gear reviews and office guides.'
            }
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in delay-150">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-t border-black/[0.05] animate-in delay-150">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/[0.03] text-[#9A9A9A] mb-6">
               <span className="text-3xl">?</span>
             </div>
             <p className="text-[#9A9A9A] font-bold text-[11px] tracking-[0.2em] uppercase">The archive remains silent on this query.</p>
          </div>
        )}
      </div>
    </main>
  );
}

import React from 'react';
import { getPostsByCategorySlug, getPostsByTagSlug } from '../../../src/services/wpService';
import PostCard from '../../../src/components/PostCard';

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  
  // Try to get posts by category slug first
  let { posts, category } = await getPostsByCategorySlug(categorySlug);
  
  // If no posts and no category found, try to fetch as a Tag
  if (posts.length === 0) {
    console.log(`No posts found for category ${categorySlug}, trying tag...`);
    const tagPosts = await getPostsByTagSlug(categorySlug);
    if (tagPosts.length > 0) {
      posts = tagPosts;
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 animate-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C4A265]/10 rounded-full mb-4">
             <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C4A265]">Classification</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-[#1A1A1A] mb-6 capitalize leading-[0.95] tracking-tight">
            {category?.name || categorySlug.replace(/-/g, ' ')}
          </h1>
          <p className="text-xl text-[#6B6B6B] font-light leading-relaxed max-w-2xl">
            {posts.length > 0 
              ? `Exploring ${posts.length} definitive guides and reviews meticulously curated for the modern professional.`
              : `We are currently curating the definitive archive for ${categorySlug.replace(/-/g, ' ')}. Check back soon for our first verdict.`
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
               <span className="text-3xl italic font-display">?</span>
             </div>
             <p className="text-[#9A9A9A] font-bold text-[11px] tracking-[0.2em] uppercase">The archive is currently being updated.</p>
          </div>
        )}
      </div>
    </main>
  );
}

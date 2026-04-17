import React from 'react';
import { getPostsByCategorySlug } from '../../src/services/wpService';
import PostCard from '../../src/components/PostCard';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const { posts, category } = await getPostsByCategorySlug(categorySlug);

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full mb-4">
             <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Classification</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-zinc-900 mb-6 capitalize">
            {category?.name || categorySlug.replace(/-/g, ' ')}
          </h1>
          <p className="text-xl text-zinc-500 font-light leading-relaxed max-w-2xl">
            {category?.count || 0} definitive guides and reviews curated for your home office.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-t border-zinc-100">
             <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase">No articles found in this category yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}

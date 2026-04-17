import React from 'react';
import { getPostBySlug } from '../../../src/services/wpService';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.author?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];

  const defaultPostImage = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1400";

  return (
    <main className="min-h-screen pt-40 pb-40 px-6 prose-premium">
      <div className="max-w-4xl mx-auto">
        {/* Editorial Header */}
        <header className="mb-16 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <time className="text-[9px] uppercase font-mono tracking-[0.3em] text-zinc-400">
                {format(new Date(post.date), 'MMMM dd, yyyy')}
              </time>
              <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
              <div className="flex gap-2">
                {categories.map(cat => (
                  <span key={cat.id} className="text-[9px] uppercase font-black tracking-widest text-amber-600">
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>

            <h1 
              className="text-4xl md:text-5xl font-display font-bold leading-tight tracking-tight text-zinc-900 drop-shadow-sm text-balance"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            
            <p className="text-lg text-zinc-400 font-light max-w-xl leading-relaxed">
              Definitive ergonomic testing and long-term setup viability analysis.
            </p>
        </header>

        {/* Featured Image - Use Default if missing */}
        <div className="aspect-[21/10] rounded-3xl overflow-hidden mb-20 shadow-xl border border-white">
          <img 
            src={featuredMedia?.source_url || defaultPostImage} 
            alt={featuredMedia?.alt_text || post.title.rendered}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-20">
          <article className="flex-1 max-w-2xl">
            <div 
              className="prose-premium"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-40 space-y-12">
              {/* Author & Curator Trust */}
              <div className="p-10 bg-white rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/40">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-8">Verified Reviewer</p>
                <div className="space-y-6">
                  {author?.avatar_urls && (
                    <img src={Object.values(author.avatar_urls)[0]} className="w-20 h-20 rounded-full grayscale border-2 border-zinc-50" alt={author.name} />
                  )}
                  <div>
                    <p className="text-2xl font-display font-bold text-zinc-900">{author?.name || 'Thuy Nguyen'}</p>
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mt-1">Lead Gear Curator</p>
                  </div>
                  <p className="text-sm text-zinc-500 font-light leading-relaxed italic">
                    "I personally tested this model for 45+ hours to ensure it meets our strict aesthetic and ergonomic standards."
                  </p>
                </div>
              </div>

              {/* Affiliate Disclosure Mini */}
              <div className="p-8 bg-amber-50 rounded-[32px] border border-amber-100/50">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 mb-3">Transparency</p>
                 <p className="text-xs text-amber-900/60 leading-relaxed font-light">
                   When you purchase through our links, we may earn a small commission. This supports our independent laboratory testing.
                 </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

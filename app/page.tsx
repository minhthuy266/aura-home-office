import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { getFeaturedPost, getLatestPosts, getPostsByTagSlug } from '@/src/services/wpService';
import PostCard from '@/src/components/PostCard';
import CategoryGrid from '@/src/components/CategoryGrid';
import { ArrowRight, ArrowUpRight, Star, Zap, Shield, Award } from 'lucide-react';

export default async function HomePage() {
  const allPosts = await getLatestPosts(12);
  const featuredPost = await getFeaturedPost();
  
  const trendingPosts = allPosts.slice(1, 4); 
  const standingDesks = await getPostsByTagSlug('standing-desks', 1, 3);
  const furniturePosts = standingDesks.length > 0 ? standingDesks : allPosts.slice(4, 7);
  const latestReviews = allPosts.slice(7, 10);

  return (
    <main className="min-h-screen relative overflow-hidden font-sans">

      {/* ═══════════════════════════════════════════
          HERO SECTION — Refined Cinematic Layout
          ═══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 bg-[#F5F4F0] border-b border-black/[0.04]">
        {/* Decorative blobs */}
        <div className="aura-blob w-[600px] h-[600px] bg-[#C4A265]/15 -top-32 -right-32"></div>
        <div className="aura-blob w-[400px] h-[400px] bg-[#C4A265]/10 bottom-0 -left-32"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
            
            {/* Left: Editorial Copy */}
            <div className="space-y-6 lg:space-y-7 flex flex-col justify-center">
              {/* Issue Badge */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#C4A265]/8 border border-[#C4A265]/15 w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C4A265] animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C4A265]">
                  Spring 2026 Collection
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl font-display font-bold text-[#1A1A1A] leading-[1.05] tracking-tight">
                Curate Your
                <br />
                <span className="bg-gradient-to-r from-[#C4A265] via-[#D4AF37] to-[#A68B4B] bg-clip-text text-transparent italic px-1">
                  Perfect
                </span>
                <br />
                Workspace.
              </h1>

              {/* Subheading */}
              <p className="text-lg text-[#555555] max-w-lg leading-relaxed font-light">
                Expert reviews, ergonomic analysis, and curated gear for professionals who demand excellence from every corner of their home office.
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/category/reviews" className="btn-premium btn-dark">
                  Explore Reviews
                  <ArrowRight size={16} />
                </Link>
                <Link href="/about-us" className="btn-premium btn-gold">
                  Our Method
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Shield size={12} className="text-[#C4A265]" />
                  </div>
                  <span className="text-xs font-semibold text-[#888888]">200+ Tested</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Award size={12} className="text-[#C4A265]" />
                  </div>
                  <span className="text-xs font-semibold text-[#888888]">Expert-Led</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Zap size={12} className="text-[#C4A265]" />
                  </div>
                  <span className="text-xs font-semibold text-[#888888]">Unbiased</span>
                </div>
              </div>
            </div>

            {/* Right: Hero Image Stack */}
            <div className="relative min-h-[400px] lg:min-h-[600px] flex items-center">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden h-full w-full shadow-luxury img-zoom">
                <img 
                  src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=1600" 
                  className="w-full h-full object-cover" 
                  alt="Premium home office setup" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* Featured Card Overlay */}
              {featuredPost && (
                <Link 
                  href={`/category/${featuredPost._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized'}/${featuredPost.slug}`} 
                  className="absolute -bottom-6 -left-4 sm:-left-8 lg:-left-12 z-20 block group"
                >
                  <div className="p-5 bg-white rounded-2xl shadow-[var(--shadow-card)] max-w-[280px] border border-black/[0.04] hover:shadow-[var(--shadow-card-hover)] transition-all duration-500 hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="pill pill-gold">Featured</span>
                      <div className="flex items-center gap-1.5 text-[#C4A265]">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-bold">9.8</span>
                      </div>
                    </div>
                    <h3 
                      className="text-base font-bold leading-snug text-[#1A1A1A] group-hover:text-[#C4A265] transition-colors line-clamp-2" 
                      dangerouslySetInnerHTML={{ __html: featuredPost.title.rendered }} 
                    />
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#9A9A9A] uppercase tracking-wider group-hover:text-[#C4A265] transition-colors">
                      Read Review <ArrowUpRight size={14} />
                    </div>
                  </div>
                </Link>
              )}

              {/* Floating Stat Badge */}
              <div className="absolute -top-4 -right-4 sm:-right-6 lg:-right-8 z-20 animate-float">
                <div className="glass-card p-4 rounded-2xl shadow-xl text-center border-white/40">
                  <div className="text-3xl font-display font-bold text-[#C4A265]">4.9</div>
                  <div className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mt-1">Avg Rating</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#D4AF37" className="text-[#D4AF37]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          TRENDING NOW — Clean Grid
          ═══════════════════════════════════════════ */}
      <section className="py-24 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C4A265]/10 flex items-center justify-center">
                <Zap size={20} className="text-[#C4A265]" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A]">Trending Now</h2>
            </div>
            <div className="hidden sm:block flex-grow h-px bg-black/[0.04] mx-6"></div>
            <Link href="/category/standing-desks" className="text-[11px] font-bold text-[#C4A265] uppercase tracking-widest hover:text-[#A68B4B] transition-colors flex items-center gap-1.5">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {/* 3-Column Trending */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingPosts.map((p, i) => {
              const image = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400";
              const category = p._embedded?.['wp:term']?.[0]?.[0]?.name || 'Gear';
              
              return (
                <Link 
                  key={p.id} 
                  href={`/category/${p._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized'}/${p.slug}`} 
                  className="group flex flex-col bg-white rounded-3xl p-5 border border-black/[0.04] hover:shadow-luxury transition-all duration-500 hover:-translate-y-2 relative"
                >
                  {/* Rank Badge */}
                  <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 z-20 w-12 h-12 rounded-full bg-[#1A1A1A] text-[#C4A265] flex items-center justify-center font-display text-lg font-black shadow-xl border-4 border-white group-hover:bg-[#C4A265] group-hover:text-white transition-colors duration-500">
                    {i + 1}
                  </div>

                  <div className="flex gap-5 items-center">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#F5F4F0] relative">
                      <img 
                        src={image} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={p.title.rendered} 
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:opacity-0 transition-opacity"></div>
                    </div>

                    <div className="space-y-3 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#C4A265]">{category}</span>
                      </div>
                      <h4 
                        className="text-base font-display font-bold text-[#1A1A1A] leading-snug group-hover:text-[#C4A265] transition-colors line-clamp-2" 
                        dangerouslySetInnerHTML={{ __html: p.title.rendered }} 
                      />
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 text-[10px] font-bold uppercase tracking-widest text-[#C4A265]">
                        Read verdict <ArrowUpRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORY EXPLORATION — Visual Grid
          ═══════════════════════════════════════════ */}
      <section className="py-24 relative bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <span className="label-micro text-[#C4A265]">Browse by Category</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A1A1A] tracking-tight leading-[1.05]">
                Find Your <span className="italic text-[#C4A265]">Focus.</span>
              </h2>
            </div>
            <Link href="/categories" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#C4A265] uppercase tracking-widest hover:text-[#A68B4B] transition-colors">
              All Categories <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LATEST REVIEWS — Magazine Grid
          ═══════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-white border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <span className="label-micro text-[#C4A265]">Latest Analysis</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A1A1A] tracking-tight leading-[1.05]">
                The <span className="italic text-[#C4A265]">Foundation.</span>
              </h2>
              <p className="text-[#6B6B6B] text-lg max-w-lg font-light leading-relaxed">
                In-depth gear reviews from our testing lab — so you invest with confidence.
              </p>
            </div>
            <Link href="/category/furniture" className="inline-flex items-center gap-2 text-sm font-bold text-[#C4A265] uppercase tracking-widest hover:text-[#A68B4B] transition-colors">
              All Reviews <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {furniturePosts.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
          </div>

          <div className="mt-16 text-center">
            <Link href="/category/reviews" className="btn-premium btn-dark">
              Browse All Reviews
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          NEWSLETTER CTA — Dark Section
          ═══════════════════════════════════════════ */}
      <section className="relative py-24 bg-[#111111] overflow-hidden text-white">
        <div className="aura-blob w-[600px] h-[600px] bg-[#C4A265]/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
            <Star size={14} fill="#C4A265" className="text-[#C4A265]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C4A265]">The Aura Edit</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight leading-[1.05] mb-6">
            Curated picks,
            <br />
            <span className="italic text-[#C4A265]">delivered weekly.</span>
          </h2>

          <p className="text-[#9A9A9A] text-lg max-w-lg mx-auto mb-12 font-light leading-relaxed">
            Join 12,000+ professionals who get our best gear picks and workspace insights every Thursday.
          </p>

          <form className="flex flex-col sm:flex-row items-stretch justify-center gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-[#6B6B6B] text-base focus:outline-none focus:border-[#C4A265] focus:bg-white/10 transition-all duration-300"
            />
            <button className="btn-premium btn-gold whitespace-nowrap">
              Subscribe Now
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-sm text-[#6B6B6B] mt-8 font-medium">
            No spam. Your data is safe with us. 
            <Link href="/privacy-policy" className="text-[#C4A265] hover:text-white underline-offset-4 hover:underline ml-2 transition-all">Privacy Policy</Link>
          </p>
        </div>
      </section>

    </main>
  );
}

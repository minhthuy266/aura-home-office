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
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#C4A265]/8 border border-[#C4A265]/15">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C4A265] animate-pulse"></div>
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#C4A265]">
                  Spring 2026 Collection
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-[2.8rem] md:text-[3.4rem] font-display font-bold text-[#1A1A1A] leading-[0.95] tracking-tight">
                Curate Your
                <br />
                <span className="bg-gradient-to-r from-[#C4A265] via-[#D4AF37] to-[#A68B4B] bg-clip-text text-transparent">
                  Perfect
                </span>
                <br />
                Workspace.
              </h1>

              {/* Subheading */}
              <p className="text-[15px] text-[#6B6B6B] max-w-md leading-relaxed font-light">
                Expert reviews, ergonomic analysis, and curated gear for professionals who demand excellence from every corner of their home office.
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/category/reviews" className="btn-premium btn-dark text-[10px] py-3 px-6">
                  Explore Reviews
                  <ArrowRight size={12} />
                </Link>
                <Link href="/about-us" className="btn-premium btn-gold text-[10px] py-3 px-6">
                  Our Method
                  <ArrowUpRight size={12} />
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#F5F4F0] flex items-center justify-center">
                    <Shield size={11} className="text-[#C4A265]" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#9A9A9A]">200+ Tested</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#F5F4F0] flex items-center justify-center">
                    <Award size={11} className="text-[#C4A265]" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#9A9A9A]">Expert-Led</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#F5F4F0] flex items-center justify-center">
                    <Zap size={11} className="text-[#C4A265]" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#9A9A9A]">Unbiased</span>
                </div>
              </div>
            </div>

            {/* Right: Hero Image Stack */}
            <div className="relative min-h-[400px]">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden h-full shadow-luxury img-zoom">
                <img 
                  src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=1600" 
                  className="w-full h-full object-cover" 
                  alt="Premium home office setup" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>

              {/* Featured Card Overlay */}
              {featuredPost && (
                <Link 
                  href={`/category/${featuredPost._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized'}/${featuredPost.slug}`} 
                  className="absolute -bottom-5 -left-2 sm:-left-5 lg:-left-10 z-20 block group"
                >
                  <div className="p-4 bg-white rounded-xl shadow-[var(--shadow-card)] max-w-[240px] border border-black/[0.04] hover:shadow-[var(--shadow-card-hover)] transition-all duration-500 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="pill pill-gold text-[7px] py-0.5 px-2">Featured</span>
                      <div className="flex items-center gap-1 text-[#C4A265]">
                        <Star size={10} fill="currentColor" />
                        <span className="text-xs font-bold">9.8</span>
                      </div>
                    </div>
                    <h3 
                      className="text-xs font-bold leading-snug text-[#1A1A1A] group-hover:text-[#C4A265] transition-colors line-clamp-2" 
                      dangerouslySetInnerHTML={{ __html: featuredPost.title.rendered }} 
                    />
                    <div className="mt-2 flex items-center gap-1.5 text-[9px] font-semibold text-[#9A9A9A] uppercase tracking-wider group-hover:text-[#C4A265] transition-colors">
                      Read Review <ArrowUpRight size={9} />
                    </div>
                  </div>
                </Link>
              )}

              {/* Floating Stat Badge */}
              <div className="absolute -top-3 -right-2 sm:-right-3 lg:-right-6 z-20 animate-float">
                <div className="glass-card p-3 rounded-xl shadow-lg text-center">
                  <div className="text-lg font-display font-bold text-[#C4A265]">4.9</div>
                  <div className="text-[8px] font-bold text-[#6B6B6B] uppercase tracking-wider mt-0.5">Avg Rating</div>
                  <div className="flex items-center justify-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={7} fill="#D4AF37" className="text-[#D4AF37]" />
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
      <section className="py-20 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[#C4A265]/10 flex items-center justify-center">
                <Zap size={12} className="text-[#C4A265]" />
              </div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1A1A1A]">Trending Now</h2>
            </div>
            <div className="flex-grow h-px bg-black/[0.04]"></div>
            <Link href="/category/standing-desks" className="text-[10px] font-semibold text-[#C4A265] uppercase tracking-wider hover:text-[#A68B4B] transition-colors flex items-center gap-1">
              View All <ArrowRight size={10} />
            </Link>
          </div>

          {/* 3-Column Trending */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingPosts.map((p, i) => {
              const image = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400";
              const category = p._embedded?.['wp:term']?.[0]?.[0]?.name || 'Gear';
              
              return (
                <Link 
                  key={p.id} 
                  href={`/category/${p._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized'}/${p.slug}`} 
                  className="group flex flex-col bg-white rounded-2xl p-4 border border-black/[0.04] hover:shadow-luxury transition-all duration-500 hover:-translate-y-1 relative"
                >
                  {/* Rank Badge */}
                  <div className="absolute top-2 left-2 z-20 w-8 h-8 rounded-full bg-[#1A1A1A] text-[#C4A265] flex items-center justify-center font-display text-xs font-black shadow-lg border border-white/10 group-hover:bg-[#C4A265] group-hover:text-white transition-colors duration-500">
                    {i + 1}
                  </div>

                  <div className="flex gap-4 items-center">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#F5F4F0] relative">
                      <img 
                        src={image} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={p.title.rendered} 
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:opacity-0 transition-opacity"></div>
                    </div>

                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#C4A265]">{category}</span>
                        <div className="w-1 h-1 rounded-full bg-black/[0.1]"></div>
                        <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#9A9A9A]">5 min read</span>
                      </div>
                      <h4 
                        className="text-[14px] font-display font-bold text-[#1A1A1A] leading-tight group-hover:text-[#C4A265] transition-colors line-clamp-2" 
                        dangerouslySetInnerHTML={{ __html: p.title.rendered }} 
                      />
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#C4A265]">Read verdict</span>
                        <ArrowUpRight size={10} className="text-[#C4A265]" />
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
      <section className="py-10 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-10 flex items-end justify-between">
            <div className="space-y-2">
              <span className="label-micro text-[#C4A265]">Browse by Category</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#1A1A1A] tracking-tight leading-[1.05]">
                Find Your <span className="italic text-[#C4A265]">Focus.</span>
              </h2>
            </div>
            <Link href="/categories" className="hidden md:flex items-center gap-1.5 text-[10px] font-semibold text-[#C4A265] uppercase tracking-wider hover:text-[#A68B4B] transition-colors">
              All Categories <ArrowRight size={10} />
            </Link>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LATEST REVIEWS — Magazine Grid
          ═══════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-[#F0EDE5] border-t border-black/[0.08]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div className="space-y-2">
              <span className="label-micro text-[#C4A265]">Latest Analysis</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#1A1A1A] tracking-tight leading-[1.05]">
                The <span className="italic text-[#C4A265]">Foundation.</span>
              </h2>
              <p className="text-[#6B6B6B] text-sm max-w-md font-light leading-relaxed">
                In-depth gear reviews from our testing lab — so you invest with confidence.
              </p>
            </div>
            <Link href="/category/furniture" className="hidden md:flex items-center gap-1.5 text-[10px] font-semibold text-[#C4A265] uppercase tracking-wider hover:text-[#A68B4B] transition-colors">
              All Reviews <ArrowRight size={10} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {furniturePosts.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
          </div>

          <div className="mt-12 text-center">
            <Link href="/category/reviews" className="btn-premium btn-dark text-[10px] py-3 px-6">
              Browse All Reviews
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          NEWSLETTER CTA — Dark Section
          ═══════════════════════════════════════════ */}
      <section className="relative py-16 bg-white overflow-hidden border-t border-black/[0.08]">
        <div className="aura-blob w-[500px] h-[500px] bg-[#C4A265]/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/[0.08] bg-white/50 mb-6 font-medium shadow-sm">
            <Star size={10} fill="#C4A265" className="text-[#C4A265]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#C4A265]">The Aura Edit</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A1A1A] tracking-tight leading-[1.05] mb-6">
            Curated picks,
            <br />
            <span className="italic text-[#C4A265]">delivered weekly.</span>
          </h2>

          <p className="text-[#6B6B6B] text-[15px] max-w-sm mx-auto mb-10 font-light leading-relaxed">
            Join 12,000+ professionals who get our best gear picks and workspace insights every Thursday.
          </p>

          <form className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 w-full px-6 py-4 rounded-full bg-white border border-black/[0.08] text-[#1A1A1A] placeholder:text-[#9A9A9A] text-[13px] font-medium focus:outline-none focus:border-[#C4A265] focus:ring-4 focus:ring-[#C4A265]/5 transition-all duration-300 shadow-sm"
            />
            <button className="btn-premium btn-dark whitespace-nowrap text-[10px] py-4 px-8">
              Subscribe Now
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="text-[10px] text-[#9A9A9A] mt-6 font-medium">
            No spam. Your data is safe with us. 
            <Link href="/privacy-policy" className="text-[#C4A265] hover:underline ml-1 transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </section>

    </main>
  );
}

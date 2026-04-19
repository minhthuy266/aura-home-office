import React from 'react';
import { getPosts, getCategories } from '../../src/services/wpService';
import PostCard from '../../src/components/PostCard';
import Link from 'next/link';
import { Metadata } from 'next';
import { Star, TrendingUp, Tags } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Best Home Office Reviews & Buying Guides 2026',
  description: 'Independent, expert-led home office reviews and ergonomic gear analysis. We meticulously test standing desks, chairs, and workspace artifacts to help you build a high-performance office.',
  alternates: { canonical: 'https://aurahomeoffice.com/reviews' },
};

export default async function ReviewsHubPage() {
  const { posts: allPosts } = await getPosts(1, 15);
  const categories = await getCategories();
  
  const featuredPost = allPosts?.[0];
  const listPosts = allPosts?.slice(1, 5) || []; 
  const feedPosts = allPosts?.slice(5) || [];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '160px', paddingBottom: '96px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-6)' }}>
        
        {/* ─── Breadcrumb ─── */}
        <nav style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-secondary)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Home</Link>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>/</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reviews</span>
        </nav>

        {/* ─── Page Title ─── */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}>
            Editorial Review <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Hub.</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            maxWidth: '640px'
          }}>
            Deep-tissue research and ergonomic testing for high-performance home offices. All our recommendations are independent and reader-supported.
          </p>
        </div>

        {/* ─── NEW: Top Filter Bar (High Utility) ─── */}
        <div style={{ 
          marginBottom: '56px', 
          padding: '20px 0', 
          borderTop: '1px solid var(--color-rule-hard)', 
          borderBottom: '1px solid var(--color-rule-hard)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'nowrap',
          overflowX: 'auto'
        }} className="scrollbar-hide">
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <Tags size={14} color="var(--color-text-muted)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>EXPLORE GEAR:</span>
             </div>
             <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
                {categories.slice(0, 12).map(cat => (
                  <Link 
                    key={cat.id} 
                    href={`/${cat.slug}`}
                    style={{
                      padding: '6px 14px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--color-text-primary)',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap'
                    }}
                    className="hover:bg-black hover:text-white transition-colors"
                  >
                    {cat.name.replace(/&amp;/g, '&')}
                  </Link>
                ))}
             </div>
        </div>

        {/* ─── Top Level: Spotlight & Sidebar ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          <div className="lg:col-span-8">
            {featuredPost && <PostCard post={featuredPost} isFeatured={true} />}
          </div>

          <div className="lg:col-span-4 lg:border-t-2 lg:border-black lg:pt-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <TrendingUp size={16} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Trending Analysis</span>
            </div>
            <div className="flex flex-col gap-0">
              {listPosts.map((post) => (
                <PostCard key={post.id} post={post} isCompact={true} />
              ))}
            </div>
          </div>
        </div>

        {/* ─── Main Feed Section ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20">
          <div className="lg:col-span-8">
             <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--color-rule-hard)', paddingBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Recent artifacts</span>
             </div>
             <div className="flex flex-col gap-0">
                {feedPosts.map(post => (
                  <PostCard key={post.id} post={post} isHorizontal={true} />
                ))}
             </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-10">
              <div style={{ padding: '32px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <Star size={24} style={{ color: 'var(--color-accent)', marginBottom: '16px' }} />
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Independent Testing</h4>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                  We spend hundreds of hours researching and ergonomic testing so you can buy with confidence. Zero sponsored content.
                </p>
                <Link href="/about" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', textDecoration: 'underline' }}>How We Test Gear</Link>
              </div>

              <div>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '20px', borderBottom: '1px solid var(--color-rule-hard)', paddingBottom: '8px' }}>Essential Guides</h4>
                <div className="flex flex-col gap-4">
                   <Link href="/guides" className="group">
                      <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }} className="group-hover:text-accent transition-colors">How to choose the perfect ergonomic chair for back pain</h5>
                   </Link>
                   <Link href="/guides" className="group">
                      <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }} className="group-hover:text-accent transition-colors">Standing Desk vs. Seated: What the science says in 2026</h5>
                   </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}

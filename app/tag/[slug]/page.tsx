import { getPostsByTagId, getTagBySlug, getCategories } from '../../../src/services/wpService';
import PostCard from '../../../src/components/PostCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;

  // 1. Lấy thông tin Tag + Categories để làm Sidebar
  const [tag, allCategories] = await Promise.all([
    getTagBySlug(slug),
    getCategories()
  ]);

  if (!tag) {
    notFound();
  }

  // 2. Lấy danh sách bài viết có tag này
  const { posts, totalPosts } = await getPostsByTagId(tag.id, 1, 20);

  // Phân loại: Bài đầu tiên làm Featured, còn lại hiện danh sách
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main style={{ 
      minHeight: '100vh', 
      background: 'var(--color-bg)', 
      paddingTop: 'var(--page-pt, 160px)', 
      paddingBottom: '80px' 
    }} className="[--page-pt:120px] md:[--page-pt:160px]">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-6)' }}>
        
        {/* Header Section — Editorial Style */}
        <header style={{ 
          marginBottom: '64px', 
          borderBottom: '2px solid var(--color-rule-section)', 
          paddingBottom: '40px' 
        }}>
          <nav style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', textDecoration: 'none', textTransform: 'uppercase' }}>Home</Link>
            <span style={{ color: 'var(--color-border)', fontSize: '11px' }}>›</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Topic Archive</span>
          </nav>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}>
            #{tag.name}
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '20px',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            lineHeight: 1.5
          }}>
            Discovery {totalPosts} research-backed articles and expert buying guides curated under the <strong style={{ color: 'var(--color-text-primary)' }}>{tag.name}</strong> tag.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Main Content (8 Columns) */}
          <div className="lg:col-span-8">
            {posts.length > 0 ? (
              <div className="flex flex-col gap-0" style={{ borderTop: '1px solid var(--color-rule-hard)' }}>
                {/* Featured Post for the Tag */}
                {featuredPost && (
                   <PostCard post={featuredPost} isHorizontal={true} />
                )}
                
                {/* Remaining Posts */}
                {remainingPosts.map((post) => (
                  <PostCard key={post.id} post={post} isHorizontal={true} />
                ))}
              </div>
            ) : (
              <div style={{ padding: '100px 0', textAlign: 'center', border: '1px dashed var(--color-border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>No articles found for this topic.</span>
              </div>
            )}
          </div>

          {/* Right: Sidebar (4 Columns) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-12">
              
              {/* Sidebar Block: Explore Categories */}
              <div>
                <h4 style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-text-muted)',
                  borderBottom: '1px solid var(--color-rule-hard)',
                  paddingBottom: '12px',
                  marginBottom: '20px'
                }}>Browse Categories</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {allCategories
                    .filter(cat => cat.count > 0) // Chỉ hiện category có bài
                    .slice(0, 8)
                    .map(cat => (
                      <Link 
                        key={cat.id} 
                        href={`/${cat.slug}`}
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '14px',
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 0'
                      }}
                      className="hover:text-black transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span style={{ opacity: 0.3, fontSize: '10px' }}>{cat.count} →</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar Block: Trust / E-E-A-T */}
              <div style={{
                padding: '24px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-rule-hard)',
                borderRadius: 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--color-accent)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>Our Methodology</span>
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '12px', lineHeight: 1.3 }}>Independent Research-Driven Reviews</h4>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                  We spend hundreds of hours analyzing ergonomics, build quality, and real-world durability so you don&apos;t have to. 
                </p>
                <Link href="/about" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase' }}>Learn More →</Link>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}

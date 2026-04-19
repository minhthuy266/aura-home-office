import { getPostsByCategorySlug, getPostsByTagSlug, getCategories, getCategoryBySlug } from '../../../src/services/wpService';
import PostCard from '../../../src/components/PostCard';
import { Metadata } from 'next';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  const name = category?.name || categorySlug.replace(/-/g, ' ');
  
  return {
    title: `Best ${name} Reviews 2026 — Tested & Ranked`,
    description: `Expert-tested ${name} reviews. We analyzed the top options so you can buy with confidence.`,
  };
}

export async function generateStaticParams() {
  const allCategories = await getCategories();
  return allCategories.map((cat) => ({
    categorySlug: cat.slug,
  }));
}

/**
 * Category Slug Page — Updated to Editorial Archive Layout
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  
  let { posts, category } = await getPostsByCategorySlug(categorySlug);
  
  if (posts.length === 0) {
    const tagPosts = await getPostsByTagSlug(categorySlug);
    if (tagPosts.length > 0) {
      posts = tagPosts;
    }
  }

  const displayName = category?.name || categorySlug.replace(/-/g, ' ');

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '96px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-6)' }}>

        {/* Header Section */}
        <header style={{ 
          marginBottom: 'var(--space-12)', 
          borderBottom: '2px solid var(--color-rule-section)', 
          paddingBottom: 'var(--space-8)' 
        }}>
          <nav style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              textTransform: 'uppercase' as const,
              letterSpacing: 'var(--tracking-mono)',
            }}>Home</Link>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>/</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase' as const,
              letterSpacing: 'var(--tracking-mono)',
            }}>{displayName}</span>
          </nav>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: '-0.02em',
                marginBottom: '16px',
                textTransform: 'capitalize',
              }}>
                {displayName}
              </h1>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-md)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
                maxWidth: '600px',
              }}>
                {posts.length > 0
                  ? `Professional reviews and long-term testing data for ${displayName.toLowerCase()}. Find the gear that fits your focus.`
                  : `Our team is currently evaluating the latest ${displayName.toLowerCase()}. Check back soon for our expert verdicts.`
                }
              </p>
            </div>
            
            {/* Stats Label */}
            <div style={{
              padding: '12px 16px',
              border: '1px solid var(--color-rule-hard)',
              background: 'var(--color-surface)',
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '4px',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Guides Found</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{posts.length}</span>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main List */}
          <div className="lg:col-span-8 flex flex-col gap-0" style={{ borderTop: '1px solid var(--color-rule-hard)' }}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} isHorizontal={true} />
              ))
            ) : (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <span className="kicker">Archive coming soon.</span>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-12 overflow-y-auto px-1 scrollbar-hide" style={{ 
              maxHeight: 'calc(100vh - 160px)',
            }}>
              
              {/* Popular */}
              <div>
                <h4 style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-muted)',
                  borderBottom: '1px solid var(--color-rule-hard)',
                  paddingBottom: '12px',
                  marginBottom: '20px',
                }}>Popular in {displayName}</h4>
                <div className="space-y-6">
                  {posts.slice(0, 4).map((rp, i) => (
                    <Link 
                      key={rp.id} 
                      href={`/${categorySlug}/${rp.slug}`}
                      className="group flex gap-4 items-start text-decoration-none"
                    >
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: 'var(--color-accent)',
                        opacity: 0.3,
                        lineHeight: 1,
                      }}>0{i+1}</span>
                      <div>
                        <h5 style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'var(--text-base)',
                          fontWeight: 700,
                          lineHeight: 'var(--leading-snug)',
                          color: 'var(--color-text-primary)',
                          margin: 0,
                        }}>{rp.title.rendered}</h5>
                        <time style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{new Date(rp.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</time>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust Box */}
              <div style={{
                padding: '24px',
                background: 'var(--color-surface-dark)',
                color: 'white',
                borderRadius: 0,
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-accent-light)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Aura Methodology</span>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Why trust our {displayName.toLowerCase()} picks?</h4>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '16px' }}>
                  Aura Home Office uses objective data and real-world testing. We don't take money from brands to review products.
                </p>
                <Link href="/about" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'white', textTransform: 'uppercase', textDecoration: 'underline' }}>Read our Ethics →</Link>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}

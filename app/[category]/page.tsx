import { getPostsByCategorySlug, getCategories, getCategoryBySlug, getPostsByMultipleCategories, getPostBySlug } from '../../src/services/wpService';
import PostCard from '../../src/components/PostCard';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { WPPost } from '../../src/types';

// export const dynamic = 'force-static';
export const revalidate = 60; // Revalidate every minute instead of hour for better testing

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Pre-render all category pages at build time for SEO.
 */
export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((cat) => ({
      category: cat.slug,
    }));
  } catch (e) {
    return [];
  }
}

/**
 * Per-category SEO metadata
 */
export async function generateMetadata({ params, searchParams }: { 
  params: Promise<{ category: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const sParams = await searchParams;
  const pageVal = Array.isArray(sParams.page) ? sParams.page[0] : sParams.page;
  const page = parseInt(pageVal || '1', 10);

  try {
    const { category, totalPages } = await getPostsByCategorySlug(categorySlug, page, 6);
    const rawName = category?.name || categorySlug.replace(/-/g, ' ');
    const displayName = rawName.replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    
    const baseUrl = 'https://aurahomeoffice.com';
    let categoryUrl = `${baseUrl}/${categorySlug}`;
    if (page > 1) categoryUrl += `?page=${page}`;

    // Full Dynamic Description Mapping
    const descMap: Record<string, string> = {
      'furniture': 'Elevate your workspace with our deep-dive reviews into premium office furniture, from designer desks to minimalist storage solutions.',
      'standing-desks': 'The ultimate guide to the best standing desks in 2026. We analyze stability, motor noise, and long-term durability for peak performance.',
      'ergonomic-chairs': 'Meticulously tested ergonomic chairs designed to protect your posture and enhance comfort during long-form coding and creative work.',
      'gaming-pcs': 'Power meets aesthetics. We rank the top pre-built gaming rigs that balance raw performance with home office design.',
      'setup': 'Inspirational home office setup guides and cinematic reveals of high-performance workspaces from around the world.',
      'guides': 'Expert-led instructional guides to help you optimize your ergonomics, organization, and technical infrastructure.',
      'desk-accessories': 'Small artifacts, big impact. We review the best desk accessories to refine your workflow and keep your space organized.',
    };

    const description = descMap[categorySlug] || `Expert analysis and deep-dive reviews for ${displayName.toLowerCase()}. We test everything to ensure your home office is functional.`;
    const titleSuffix = page > 1 ? ` (Page ${page})` : '';

    // Calculate prev/next URLs for all bots
    const prevUrl = page > 1 ? `${baseUrl}/${categorySlug}${page - 1 === 1 ? '' : `?page=${page - 1}`}` : undefined;
    const nextUrl = page < totalPages ? `${baseUrl}/${categorySlug}?page=${page + 1}` : undefined;

    return {
      title: `Best ${displayName} Reviews & Buying Guides 2026${titleSuffix}`,
      description: description,
      alternates: { 
        canonical: categoryUrl,
      },
    };
  } catch (e) {
    return { title: 'Category Archive' };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const sParams = await searchParams;
  const pageVal = Array.isArray(sParams.page) ? sParams.page[0] : sParams.page;
  const currentPage = parseInt(pageVal || '1', 10);
  const perPage = 6;

  const category = await getCategoryBySlug(categorySlug);
  console.log(`[CategoryPage] Slug: ${categorySlug}, Page: ${currentPage}`);

  if (!category) {
    // ─── NEW: Fallback Check — Is this actually a post slug? ───
    const post = await getPostBySlug(categorySlug);
    if (post) {
      const realCategorySlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized';
      console.log(`[REDIRECT] Found post at category root: ${categorySlug} -> /${realCategorySlug}/${categorySlug}`);
      redirect(`/${realCategorySlug}/${categorySlug}`);
    }
    
    notFound();
  }

  // Fetch data
  let posts: WPPost[] = [];
  let totalPages = 1;
  let totalPosts = 0;
  
  // Logic for Parent Hubs: Aggregate child posts
  const parentChildMap: Record<string, string[]> = {
    'furniture': ['standing-desks', 'ergonomic-chairs', 'desk-converters', 'desk-storage', 'footrests-mats'],
    'setup': ['workspace-ideas', 'coffee-corner', 'desk-lighting', 'ambient-comfort'],
    'guides': ['productivity', 'ergonomics-health', 'cable-management']
  };

  if (parentChildMap[categorySlug]) {
    // Get all child category objects to get their IDs
    const allCategories = await getCategories();
    const childSlugs = parentChildMap[categorySlug];
    const childIds = allCategories
      .filter(c => childSlugs.includes(c.slug))
      .map(c => c.id);
    
    // Add parent ID too just in case
    childIds.push(category.id);
    
    const result = await getPostsByMultipleCategories(childIds, currentPage, perPage);
    posts = result.posts;
    totalPages = result.totalPages;
    totalPosts = result.totalPosts;
  } else {
    // Regular single category fetch
    const result = await getPostsByCategorySlug(categorySlug, currentPage, perPage).catch(() => ({ posts: [], category: null, totalPages: 0, totalPosts: 0 }));
    posts = result.posts;
    totalPages = result.totalPages;
    totalPosts = result.totalPosts;
  }
  
  const displayName = category.name.replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  const baseUrl = 'https://aurahomeoffice.com';

  // Featured and regular posts
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: displayName, item: `${baseUrl}/${categorySlug}` },
    ],
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Best ${displayName} Reviews & Buying Guides`,
    description: `Expert analysis and deep-dive reviews for ${displayName.toLowerCase()}.`,
    url: `${baseUrl}/${categorySlug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalPosts,
      itemListElement: posts.slice(0, 10).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${baseUrl}/${categorySlug}/${p.slug}`,
        name: p.title.rendered.replace(/<[^>]*>/g, ''),
      })),
    },
  };

  return (
    <main key={`${categorySlug}-${currentPage}`} style={{ 
      minHeight: '100vh', 
      background: 'var(--color-bg)', 
      paddingTop: 'var(--page-pt, 160px)', 
      paddingBottom: '80px' 
    }} className="[--page-pt:120px] md:[--page-pt:160px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-6)' }}>

        {/* Header Section — Rich Editorial Style */}
        <header style={{ 
          marginBottom: 'var(--space-12)', 
          borderBottom: '2px solid var(--color-rule-section)', 
          paddingBottom: 'var(--space-8)' 
        }}>
          <nav style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              textTransform: 'uppercase' as const,
              letterSpacing: 'var(--tracking-mono)',
            }}>Home</Link>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>/</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--color-text-primary)',
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
                Expert analysis and deep-dive reviews for {displayName.toLowerCase()}. 
                We test everything to ensure your home office is both functional and inspiring.
              </p>
            </div>
            
            {/* Stats Label — Mono */}
            <div style={{
              padding: '12px 16px',
              border: '1px solid var(--color-rule-hard)',
              background: 'var(--color-surface)',
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '4px',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Guides Found</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{totalPosts}</span>
            </div>
          </div>
        </header>

        {/* ─── NEW: Visual Topic Bar (Best Practice Hub Nav) ─── */}
        {['furniture', 'setup', 'guides'].includes(categorySlug) && (
          <div style={{ 
            marginBottom: '48px', 
            paddingBottom: '24px', 
            borderBottom: '1px solid var(--color-border)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              overflowX: 'auto',
            }} className="scrollbar-hide">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <div style={{ width: '4px', height: '16px', background: 'var(--color-accent)' }}></div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Explore {categorySlug}:</span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'nowrap' }}>
                {categorySlug === 'furniture' && [
                  { name: 'Standing Desks', slug: 'standing-desks', icon: <i className="bi bi-layout-sidebar-inset"></i> },
                  { name: 'Ergonomic Chairs', slug: 'ergonomic-chairs', icon: <i className="bi bi-person-workspace"></i> },
                  { name: 'Desk Converters', slug: 'desk-converters', icon: <i className="bi bi-arrow-up-square"></i> },
                  { name: 'Desk Storage', slug: 'desk-storage', icon: <i className="bi bi-layers"></i> },
                  { name: 'Footrests & Mats', slug: 'footrests-mats', icon: <i className="bi bi-shadows"></i> }
                ].map(sub => (
                  <Link 
                    key={sub.slug} 
                    href={`/${sub.slug}`} 
                    className="topic-pill"
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 18px', 
                      background: 'white', 
                      border: '1px solid var(--color-border)', 
                      borderRadius: '100px',
                      fontFamily: 'var(--font-ui)', 
                      fontSize: '13px', 
                      fontWeight: 500,
                      color: 'var(--color-text-primary)', 
                      textDecoration: 'none', 
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    <span style={{ opacity: 0.6, fontSize: '14px' }}>{sub.icon}</span>
                    {sub.name}
                  </Link>
                ))}
                {categorySlug === 'setup' && [
                  { name: 'Workspace Ideas', slug: 'workspace-ideas', icon: <i className="bi bi-lightbulb"></i> },
                  { name: 'Coffee Corner', slug: 'coffee-corner', icon: <i className="bi bi-cup-hot"></i> },
                  { name: 'Lighting', slug: 'desk-lighting', icon: <i className="bi bi-lamp"></i> },
                  { name: 'Ambient Comfort', slug: 'ambient-comfort', icon: <i className="bi bi-wind"></i> }
                ].map(sub => (
                  <Link 
                    key={sub.slug} 
                    href={`/${sub.slug}`} 
                    className="topic-pill"
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 18px', 
                      background: 'white', 
                      border: '1px solid var(--color-border)', 
                      borderRadius: '100px',
                      fontFamily: 'var(--font-ui)', 
                      fontSize: '13px', 
                      fontWeight: 500,
                      color: 'var(--color-text-primary)', 
                      textDecoration: 'none', 
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ opacity: 0.6, fontSize: '14px' }}>{sub.icon}</span>
                    {sub.name}
                  </Link>
                ))}
                {categorySlug === 'guides' && [
                  { name: 'Productivity', slug: 'productivity', icon: <i className="bi bi-lightning-charge"></i> },
                  { name: 'Health', slug: 'ergonomics-health', icon: <i className="bi bi-heart-pulse"></i> },
                  { name: 'Cable Management', slug: 'cable-management', icon: <i className="bi bi-usb-symbol"></i> }
                ].map(sub => (
                  <Link 
                    key={sub.slug} 
                    href={`/${sub.slug}`} 
                    className="topic-pill"
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 18px', 
                      background: 'white', 
                      border: '1px solid var(--color-border)', 
                      borderRadius: '100px',
                      fontFamily: 'var(--font-ui)', 
                      fontSize: '13px', 
                      fontWeight: 500,
                      color: 'var(--color-text-primary)', 
                      textDecoration: 'none', 
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ opacity: 0.6, fontSize: '14px' }}>{sub.icon}</span>
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area — 2 Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Article List (75%) */}
          <div className="lg:col-span-8 flex flex-col gap-0" style={{ borderTop: '1px solid var(--color-rule-hard)' }}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} isHorizontal={true} />
              ))
            ) : (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <span className="kicker">No reviews found yet.</span>
              </div>
            )}

            {/* ─── Pagination Section ─── */}
            {totalPages > 1 && (
              <div style={{ 
                marginTop: '40px', 
                paddingTop: '32px', 
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}>
                {currentPage > 1 && (
                  <Link 
                    href={`/${categorySlug}?page=${currentPage - 1}`}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      border: '1px solid var(--color-border)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: 'var(--color-text-primary)'
                    }}
                    className="hover:bg-black hover:text-white transition-colors"
                  >
                    Previous
                  </Link>
                )}

                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                      if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                    }
                    if (pageNum <= 0 || pageNum > totalPages) return null;

                    return (
                      <Link
                        key={pageNum}
                        href={`/${categorySlug}?page=${pageNum}`}
                        style={{
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: currentPage === pageNum ? 'black' : 'white',
                          border: '1px solid var(--color-border)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          textDecoration: 'none',
                          color: currentPage === pageNum ? 'white' : 'var(--color-text-primary)'
                        }}
                        className={currentPage === pageNum ? '' : 'hover:bg-gray-100 transition-colors'}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>

                {currentPage < totalPages && (
                  <Link 
                    href={`/${categorySlug}?page=${currentPage + 1}`}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      border: '1px solid var(--color-border)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: 'var(--color-text-primary)'
                    }}
                    className="hover:bg-black hover:text-white transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Right: Sidebar (25%) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-12 overflow-y-auto px-1 scrollbar-hide" style={{ 
              maxHeight: 'calc(100vh - 140px)',
            }}>
              
              {/* Sidebar Section: Popular */}
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

              <div style={{
                padding: '24px',
                background: 'var(--color-surface-dark)',
                color: 'white',
                borderRadius: 0,
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-accent-light)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Independent Testing</span>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>How we rank {displayName.toLowerCase()}</h4>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '16px' }}>
                  Our research involves 50+ hours of data analysis and real-world ergonomic testing for every product mentioned.
                </p>
                <Link href="/about" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'white', textTransform: 'uppercase', textDecoration: 'underline' }}>See our process →</Link>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}

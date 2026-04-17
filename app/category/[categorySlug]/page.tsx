import { getPostsByCategorySlug, getPostsByTagSlug, getCategories, getCategoryBySlug } from '../../../src/services/wpService';
import PostCard from '../../../src/components/PostCard';
import { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  const name = category?.name || categorySlug.replace(/-/g, ' ');
  
  return {
    title: `${name} | Curated Collection`,
    description: `Discover our definitive archive of ${name} reviews, field reports, and editorial verdicts for the modern workspace.`,
  };
}

export async function generateStaticParams() {
  // Fetch all categories from WordPress to pre-render ALL category pages
  const allCategories = await getCategories();
  return allCategories.map((cat) => ({
    categorySlug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  
  // Try to get posts by category slug first
  let { posts, category } = await getPostsByCategorySlug(categorySlug);
  
  // If no posts and no category found, try to fetch as a Tag
  if (posts.length === 0) {
    const tagPosts = await getPostsByTagSlug(categorySlug);
    if (tagPosts.length > 0) {
      posts = tagPosts;
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 animate-in text-center md:text-left">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--accent-gold)]">
              Curated Collection
            </span>
            <div className="h-px w-12 bg-[var(--accent-gold)]/30"></div>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 leading-[1.05] tracking-tight capitalize">
            {category?.name || categorySlug.replace(/-/g, ' ')}
          </h1>
          
          <div className="max-w-2xl border-l-2 border-[var(--border-light)] pl-6 md:pl-8">
            <p className="text-lg md:text-xl text-gray-400 font-display italic leading-relaxed">
              {posts.length > 0 
                ? `A definitive archive of ${posts.length} field reports and editorial verdicts curated for the distinct workspace.`
                : `We are currently curating the definitive archive for ${categorySlug.replace(/-/g, ' ')}. Check back soon for our first verdict.`
              }
            </p>
          </div>
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

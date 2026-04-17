import { WPPost, WPCategory } from '../types';

// revalidation time in seconds (1 hour)
const REVALIDATE_TIME = 3600;

const RAW_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || process.env.VITE_WP_API_URL || '';
const API_URL = RAW_API_URL.replace(/\/$/, ''); // Remove trailing slash if exists
const isConfigured = !!API_URL;
console.log("WP Service Configured:", { isConfigured, API_URL });

export async function getPosts(page = 1, perPage = 10, categoryId?: number, tagId?: number): Promise<WPPost[]> {
  if (!isConfigured) {
    console.log("WP API not configured, using mock posts.");
    return MOCK_POSTS;
  }

  try {
    const url = new URL(`${API_URL}/wp-json/wp/v2/posts`);
    url.searchParams.set('_embed', '1');
    url.searchParams.set('page', page.toString());
    url.searchParams.set('per_page', perPage.toString());
    if (categoryId) url.searchParams.set('categories', categoryId.toString());
    if (tagId) url.searchParams.set('tags', tagId.toString());

    console.log(`Fetching posts from: ${url.toString()}`);
    const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("WP API Fetch Error (getPosts):", err);
    return MOCK_POSTS;
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  if (!isConfigured) return MOCK_POSTS.find(p => p.slug === slug) || null;

  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/posts?_embed=1&slug=${slug}`, { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const posts = await res.json();
    return posts.length > 0 ? posts[0] : (MOCK_POSTS.find(p => p.slug === slug) || null);
  } catch (err) {
    console.error("Fetch Error:", err);
    return MOCK_POSTS.find(p => p.slug === slug) || null;
  }
}

export async function getCategories(): Promise<WPCategory[]> {
  if (!isConfigured) return MOCK_CATEGORIES;

  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/categories?per_page=100`, { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch Error:", err);
    return MOCK_CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
  if (!isConfigured) return MOCK_CATEGORIES.find(c => c.slug === slug) || null;

  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/categories?slug=${slug}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const categories = await res.json();
    return categories.length > 0 ? categories[0] : null;
  } catch (err) {
    console.error("Fetch Error:", err);
    return null;
  }
}

export async function getPostsByCategorySlug(categorySlug: string, page = 1, perPage = 10): Promise<{posts: WPPost[], category: WPCategory | null}> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return { posts: [], category: null };
  const posts = await getPosts(page, perPage, category.id);
  return { posts, category };
}

export async function getTagBySlug(slug: string): Promise<any | null> {
  if (!isConfigured) return null;
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/tags?slug=${slug}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const tags = await res.json();
    return tags.length > 0 ? tags[0] : null;
  } catch (err) {
    console.error("Fetch Error:", err);
    return null;
  }
}

export async function getPostsByTagSlug(tagSlug: string, page = 1, perPage = 10): Promise<WPPost[]> {
  const tag = await getTagBySlug(tagSlug);
  if (!tag) return [];
  return getPosts(page, perPage, undefined, tag.id);
}

/**
 * Higher-level editorial helpers
 */

/**
 * Fetches the most recent posts globally.
 */
export async function getLatestPosts(perPage = 10): Promise<WPPost[]> {
  return getPosts(1, perPage);
}

/**
 * Fetches the post intended for the Hero/Featured slot.
 * Logic: Fetches the most recent post, or could be filtered by a 'featured' tag in the future.
 */
export async function getFeaturedPost(): Promise<WPPost | null> {
  const posts = await getLatestPosts(1);
  return posts.length > 0 ? posts[0] : null;
}

/**
 * Fetches posts for a specific organizational silo (category).
 */
export async function getPostsBySilo(categorySlug: string, count = 3): Promise<WPPost[]> {
  const result = await getPostsByCategorySlug(categorySlug, 1, count);
  return result.posts;
}

/**
 * Searches posts by a query string.
 */
export async function searchPosts(query: string, page = 1, perPage = 10): Promise<WPPost[]> {
  if (!isConfigured) {
    return MOCK_POSTS.filter(p => 
      p.title.rendered.toLowerCase().includes(query.toLowerCase()) || 
      p.excerpt.rendered.toLowerCase().includes(query.toLowerCase())
    );
  }

  try {
    const url = new URL(`${API_URL}/wp-json/wp/v2/posts`);
    url.searchParams.set('_embed', '1');
    url.searchParams.set('search', query);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('per_page', perPage.toString());

    const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch Error:", err);
    return [];
  }
}

const MOCK_CATEGORIES: WPCategory[] = [
  { id: 160, name: "Reviews", slug: "reviews", count: 5 },
  { id: 153, name: "Gaming PCs", slug: "gaming-pcs", count: 3 },
  { id: 157, name: "Components", slug: "components", count: 6 },
  { id: 163, name: "Peripherals", slug: "peripherals", count: 3 },
  { id: 1, name: "Blog", slug: "blog", count: 12 },
];

const MOCK_POSTS: WPPost[] = [
  {
    id: 229,
    slug: 'portable-power-station',
    date: "2026-03-05T00:20:09",
    title: { rendered: "The 30 Best Portable Power Station of 2026" },
    excerpt: { rendered: "Whether you are gearing up for a weekend camping trip, preparing for unexpected power outages, or needing reliable backup power for RV adventures..." },
    content: { rendered: "<p>Whether you are gearing up for a weekend camping trip, preparing for unexpected power outages...</p>" },
    acf: { rating: 4.8 },
    _embedded: {
      author: [{ name: "Aura Home Office", avatar_urls: { "48": "https://secure.gravatar.com/avatar/fake" } }],
      "wp:featuredmedia": [{ 
        source_url: "https://m.media-amazon.com/images/I/511uY4VGxyS._SL500_.jpg",
        alt_text: "Portable Power Station"
      }],
      "wp:term": [[{ id: 160, name: "Reviews", slug: "reviews" }]]
    }
  },
  {
    id: 101,
    slug: 'best-gaming-pcs-2026',
    date: "2026-04-01T10:00:00",
    title: { rendered: "Best Gaming PCs for Your Home Office in 2026" },
    excerpt: { rendered: "We rank the top pre-built gaming rigs that balance raw power with aesthetic design for a professional workspace." },
    content: { rendered: "<p>Full review of top gaming PCs...</p>" },
    acf: { rating: 4.5 },
    _embedded: {
      author: [{ name: "Aura Team", avatar_urls: { "48": "https://secure.gravatar.com/avatar/fake" } }],
      "wp:featuredmedia": [{ 
        source_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800",
        alt_text: "Top Gaming PCs"
      }],
      "wp:term": [[{ id: 153, name: "Gaming PCs", slug: "gaming-pcs" }]]
    }
  },
  {
    id: 102,
    slug: 'ergonomic-keyboard-roundup',
    date: "2026-04-10T15:30:00",
    title: { rendered: "2026 Ergonomic Keyboard Roundup: Efficiency Meets Comfort" },
    excerpt: { rendered: "If you spend 8+ hours a day typing, these keyboards are the single best investment you can make for your wrists." },
    content: { rendered: "<p>The best keyboards we tested this year...</p>" },
    acf: { rating: 4.9 },
    _embedded: {
      author: [{ name: "Expert Reviewer", avatar_urls: { "48": "https://secure.gravatar.com/avatar/fake" } }],
      "wp:featuredmedia": [{ 
        source_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800",
        alt_text: "Ergonomic Keyboards"
      }],
      "wp:term": [[{ id: 163, name: "Peripherals", slug: "peripherals" }]]
    }
  }
];

import { WPPost, WPCategory } from '../types';

const RAW_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || process.env.VITE_WP_API_URL || '';
const API_URL = RAW_API_URL.replace(/\/$/, ''); // Remove trailing slash if exists
const isConfigured = !!API_URL;

export async function getPosts(page = 1, perPage = 10, categoryId?: number): Promise<WPPost[]> {
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

    console.log(`Fetching posts from: ${url.toString()}`);
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
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
    const res = await fetch(`${API_URL}/wp-json/wp/v2/posts?_embed=1&slug=${slug}`, { next: { revalidate: 3600 } });
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
    const res = await fetch(`${API_URL}/wp-json/wp/v2/categories?per_page=100`, { next: { revalidate: 3600 } });
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

const MOCK_CATEGORIES: WPCategory[] = [
  { id: 1, name: "Standing Desks", slug: "standing-desks", count: 12 },
  { id: 2, name: "Ergonomic Chairs", slug: "ergonomic-chairs", count: 8 },
  { id: 3, name: "Monitor Arms", slug: "monitor-arms", count: 15 },
  { id: 4, name: "Desk Storage", slug: "desk-storage", count: 10 },
  { id: 5, name: "Desk Converters", slug: "desk-converters", count: 5 },
  { id: 6, name: "Lighting", slug: "desk-lighting", count: 20 },
  { id: 7, name: "Workspace Ideas", slug: "workspace-ideas", count: 30 },
  { id: 8, name: "Accessories", slug: "desk-accessories", count: 25 },
];

const MOCK_POSTS: WPPost[] = [
  {
    id: 1,
    slug: 'ultimate-setup',
    date: new Date().toISOString(),
    title: { rendered: "The Ultimate Ergonomic Setup for 2026" },
    excerpt: { rendered: "Discover why personalizing your workspace is the most important investment you can make this year for your health and productivity." },
    content: { rendered: "<p>Full content here...</p>" },
    acf: { rating: "4.9" },
    _embedded: {
      author: [{ name: "Thuy Nguyen", avatar_urls: { "48": "https://secure.gravatar.com/avatar/fake" } }],
      "wp:featuredmedia": [{ source_url: "https://images.unsplash.com/photo-1544413647-ad5198947c7e?q=80&w=2600&auto=format&fit=crop" }],
      "wp:term": [[{ id: 1, name: "Furniture", slug: "furniture" }]]
    }
  }
];

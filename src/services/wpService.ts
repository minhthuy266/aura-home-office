import { WPPost, WPCategory } from '../types';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.aurahomeoffice.com';
const REVALIDATE_TIME = 60; // 1 minute cache for performance

const isConfigured = !!process.env.NEXT_PUBLIC_WORDPRESS_URL || true; // Force true for demo if not set

// Mock data for fallback
const MOCK_POSTS: WPPost[] = [];

/**
 * Base fetcher for posts with common params.
 */
export async function getPosts(page = 1, perPage = 10, categories?: number[], tags?: number[]): Promise<{posts: WPPost[], totalPages: number, totalPosts: number}> {
  if (!isConfigured) return { posts: MOCK_POSTS, totalPages: 1, totalPosts: MOCK_POSTS.length };
  
  try {
    const url = new URL(`${API_URL}/wp-json/wp/v2/posts`);
    url.searchParams.set('_embed', '1');
    url.searchParams.set('page', page.toString());
    url.searchParams.set('per_page', perPage.toString());
    url.searchParams.set('status', 'publish');
    
    if (categories && categories.length > 0) {
      url.searchParams.set('categories', categories.join(','));
    }
    
    if (tags && tags.length > 0) {
      url.searchParams.set('tags', tags.join(','));
    }

    const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const posts = await res.json();
    const totalPosts = parseInt(res.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    
    return { posts, totalPages, totalPosts };
  } catch (err) {
    console.error("Fetch Error:", err);
    return { posts: [], totalPages: 0, totalPosts: 0 };
  }
}

/**
 * Fetches all posts by iterating through pages (for static param generation).
 */
export async function getAllPosts(): Promise<WPPost[]> {
  const allPosts: WPPost[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    try {
      const url = new URL(`${API_URL}/wp-json/wp/v2/posts`);
      url.searchParams.set('_embed', '1');
      url.searchParams.set('page', page.toString());
      url.searchParams.set('per_page', perPage.toString());
      url.searchParams.set('status', 'publish');

      console.log(`[WP SERVICE] Fetching all posts page ${page} for Route Map...`);
      const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_TIME } });

      if (!res.ok) {
        console.error(`[WP SERVICE] Error fetching page ${page}: ${res.status}`);
        break;
      }

      const posts: WPPost[] = await res.json();
      if (posts.length === 0) break;

      allPosts.push(...posts);

      const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
      if (page >= totalPages) break;
      page++;
    } catch (e) {
      break;
    }
  }

  return allPosts;
}

/**
 * Fetches a single post by its slug.
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  if (!isConfigured) return MOCK_POSTS.find(p => p.slug === slug) || null;
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed=1`, { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const posts = await res.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (err) {
    console.error("Fetch Error:", err);
    return null;
  }
}

/**
 * Fetches all categories.
 */
export async function getCategories(): Promise<WPCategory[]> {
  if (!isConfigured) return [];
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/categories?per_page=100`, { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch Error:", err);
    return [];
  }
}

/**
 * Fetches a single category by its slug.
 */
export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
  if (!isConfigured) return null;
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/categories?slug=${slug}`, { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const categories = await res.json();
    return categories.length > 0 ? categories[0] : null;
  } catch (err) {
    console.error("Fetch Error:", err);
    return null;
  }
}

/**
 * Fetches posts by category slug.
 */
export async function getPostsByCategorySlug(categorySlug: string, page = 1, perPage = 10): Promise<{posts: WPPost[], category: WPCategory | null, totalPages: number, totalPosts: number}> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return { posts: [], category: null, totalPages: 0, totalPosts: 0 };
  
  console.log(`[WP SERVICE] Requesting Page: ${page}, PerPage: ${perPage}, Categories: ${category.id}`);
  const { posts, totalPages, totalPosts } = await getPosts(page, perPage, [category.id]);
  return { posts, category, totalPages, totalPosts };
}

/**
 * Fetches a single tag by its slug.
 */
export async function getTagBySlug(slug: string): Promise<WPCategory | null> {
  if (!isConfigured) return null;
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/tags?slug=${slug}`, { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const tags = await res.json();
    return tags.length > 0 ? tags[0] : null;
  } catch (err) {
    console.error("Fetch Error:", err);
    return null;
  }
}

/**
 * Fetches posts by tag ID.
 */
export async function getPostsByTagId(tagId: number, page = 1, perPage = 10): Promise<{posts: WPPost[], totalPages: number, totalPosts: number}> {
  return getPosts(page, perPage, undefined, [tagId]);
}

/**
 * Fetches posts by tag Slug.
 */
export async function getPostsByTagSlug(tagSlug: string, page = 1, perPage = 10): Promise<{posts: WPPost[], totalPages: number, totalPosts: number}> {
  const tag = await getTagBySlug(tagSlug);
  if (!tag) return { posts: [], totalPages: 0, totalPosts: 0 };
  return getPostsByTagId(tag.id, page, perPage);
}

/**
 * Higher-level editorial helpers
 */

/**
 * Fetches the most recent posts globally.
 */
export async function getLatestPosts(perPage = 10): Promise<WPPost[]> {
  const { posts } = await getPosts(1, perPage);
  return posts;
}

/**
 * Fetches the post intended for the Hero/Featured slot.
 * Logic: Looks for 'featured' tag first, fallbacks to the most recent post.
 */
export async function getFeaturedPost(): Promise<WPPost | null> {
  const { posts } = await getPostsByTagSlug('featured', 1, 1);
  if (posts.length > 0) return posts[0];
  
  const latest = await getLatestPosts(1);
  return latest.length > 0 ? latest[0] : null;
}

/**
 * Fetches posts for a specific organizational silo (category).
 */
export async function getPostsBySilo(categorySlug: string, count = 3): Promise<WPPost[]> {
  const result = await getPostsByCategorySlug(categorySlug, 1, count);
  return result.posts;
}

/**
 * Fetches posts from multiple category IDs (useful for parent hubs)
 */
export async function getPostsByMultipleCategories(categoryIds: number[], page = 1, perPage = 10): Promise<{posts: WPPost[], totalPages: number, totalPosts: number}> {
  if (categoryIds.length === 0) return { posts: [], totalPages: 0, totalPosts: 0 };
  return getPosts(page, perPage, categoryIds);
}

/**
 * Builds a map of slug -> categorySlug for link rewriting.
 */
export async function getRouteMap(): Promise<Record<string, string>> {
  console.log("[WP SERVICE] Building Route Map...");
  const allPosts = await getAllPosts();
  const routeMap: Record<string, string> = {};
  
  allPosts.forEach(post => {
    const categorySlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized';
    routeMap[post.slug] = categorySlug;
  });
  
  console.log(`[WP SERVICE] Route Map Built: ${Object.keys(routeMap).length} posts mapped.`);
  return routeMap;
}

/**
 * Builds a set of all category slugs to identify category links.
 */
export async function getCategoryMap(): Promise<Set<string>> {
  const categories = await getCategories();
  return new Set(categories.map(cat => cat.slug));
}

/**
 * Searches posts by a query string.
 */
export async function searchPosts(query: string, page = 1, perPage = 10): Promise<{posts: WPPost[], totalPages: number, totalPosts: number}> {
  if (!isConfigured) {
    const posts = MOCK_POSTS.filter(p => 
      p.title.rendered.toLowerCase().includes(query.toLowerCase()) || 
      p.excerpt.rendered.toLowerCase().includes(query.toLowerCase())
    );
    return { posts, totalPages: 1, totalPosts: posts.length };
  }

  try {
    const url = new URL(`${API_URL}/wp-json/wp/v2/posts`);
    url.searchParams.set('_embed', '1');
    url.searchParams.set('search', query);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('per_page', perPage.toString());

    const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const posts = await res.json();
    const totalPosts = parseInt(res.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    
    return { posts, totalPages, totalPosts };
  } catch (err) {
    console.error("Fetch Error (searchPosts):", err);
    return { posts: [], totalPages: 0, totalPosts: 0 };
  }
}

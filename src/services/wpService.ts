import { WPPost, WPCategory } from '../types';

const isConfigured = !!(typeof process !== 'undefined' && process.env && (process.env.VITE_WP_API_URL || process.env.NEXT_PUBLIC_WP_API_URL));

export async function getPosts(page = 1, perPage = 10, categoryId?: number): Promise<WPPost[]> {
  if (!isConfigured) return [];
  
  // Use local backend proxy instead of direct WP call to bypass CORS
  let url = `/api/wp/wp/v2/posts?_embed=1&page=${page}&per_page=${perPage}`;
  if (categoryId) {
    url += `&categories=${categoryId}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch Error:", err);
    throw err;
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  if (!isConfigured) return null;

  try {
    const res = await fetch(`/api/wp/wp/v2/posts?_embed=1&slug=${slug}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const posts = await res.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (err) {
    console.error("Fetch Error:", err);
    throw err;
  }
}

export async function getCategories(): Promise<WPCategory[]> {
  if (!isConfigured) return [];

  try {
    const res = await fetch(`/api/wp/wp/v2/categories`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch Error:", err);
    throw err;
  }
}

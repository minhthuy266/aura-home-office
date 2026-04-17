export interface WPPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  slug: string;
  date: string;
  modified: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    author?: Array<{ name: string; avatar_urls: Record<string, string>; description?: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
  acf?: {
    affiliate_url?: string;
    affiliate_button_text?: string;
    product_price?: string;
    rating?: number; // 0-10 or 1-5
    pros?: string; // HTML or comma separated
    cons?: string; // HTML or comma separated
    verdict?: string; // short summary
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

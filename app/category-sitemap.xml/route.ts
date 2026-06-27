import { getCategories } from '@/src/services/wpService';

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c] || c));
}

// Hub categories always appear in sitemap (they aggregate child posts)
const HUB_CATEGORIES = ['furniture', 'setup', 'guides', 'lifestyle'];

export async function GET() {
  const baseUrl = 'https://aurahomeoffice.com';
  const allCategories = await getCategories();

  // ─── Only include categories that have posts OR are hub pages ───
  // Empty leaf categories get noindex in the page component + excluded here
  // to avoid signaling low-quality pages to Bing/Google.
  const categories = allCategories.filter(
    (cat) => cat.count > 0 || HUB_CATEGORIES.includes(cat.slug)
  );

  const categoryUrls = categories.map((cat) => ({
    url: escapeXml(`${baseUrl}/${cat.slug}`),
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: HUB_CATEGORIES.includes(cat.slug) ? 0.7 : 0.6,
  }));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categoryUrls
    .map((item) => `
    <url>
      <loc>${item.url}</loc>
      <lastmod>${item.lastModified}</lastmod>
      <changefreq>${item.changeFrequency}</changefreq>
      <priority>${item.priority}</priority>
    </url>`)
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

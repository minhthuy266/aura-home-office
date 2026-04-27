import { getLatestPosts } from '@/src/services/wpService';

export async function GET() {
  const baseUrl = 'https://aurahomeoffice.com';
  const posts = await getLatestPosts(100);

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/${post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized'}/${post.slug}`,
    lastModified: new Date(post.modified).toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
    image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    title: post.title.rendered.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c] || c)),
  }));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${postUrls
    .map((item) => `
    <url>
      <loc>${item.url}</loc>
      <lastmod>${item.lastModified}</lastmod>
      <changefreq>${item.changeFrequency}</changefreq>
      <priority>${item.priority}</priority>
      ${item.image ? `
      <image:image>
        <image:loc>${item.image}</image:loc>
        <image:title>${item.title}</image:title>
      </image:image>` : ''}
    </url>`)
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

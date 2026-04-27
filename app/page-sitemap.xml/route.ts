export async function GET() {
  const baseUrl = 'https://aurahomeoffice.com';

  const staticUrls = [
    { url: baseUrl, lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: '2026-04-18T00:00:00.000Z', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: '2026-04-18T00:00:00.000Z', changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/disclosure`, lastModified: '2026-04-18T00:00:00.000Z', changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: '2026-04-18T00:00:00.000Z', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: '2026-04-18T00:00:00.000Z', changeFrequency: 'yearly', priority: 0.3 },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls
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
    },
  });
}

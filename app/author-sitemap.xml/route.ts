import { AUTHORS, getAuthorForPost } from '@/src/config/authors';
import { getSitemapPosts } from '@/src/services/wpService';

export async function GET() {
  const baseUrl = 'https://aurahomeoffice.com';
  const allPosts = await getSitemapPosts();
  const latestModifiedByAuthor = new Map<string, string>();

  for (const post of allPosts) {
    const author = getAuthorForPost(post.id, post.author);
    const postModified = post.modified || post.date;
    const currentModified = latestModifiedByAuthor.get(author.id);

    if (!currentModified || new Date(postModified) > new Date(currentModified)) {
      latestModifiedByAuthor.set(author.id, postModified);
    }
  }

  const authorUrls = AUTHORS.map((author) => ({
    url: `${baseUrl}/author/${author.id}`,
    lastModified: latestModifiedByAuthor.get(author.id) || new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${authorUrls
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

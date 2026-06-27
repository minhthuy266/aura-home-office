import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Bingbot: no crawl-delay per Bing Webmaster Guidelines recommendation
        // crawl-delay slows down indexing and is flagged as an issue in Bing WBT
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/search?q='],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/search?q='],
      },
    ],
    // List ALL sub-sitemaps so Bing Webmaster Tools discovers them immediately
    sitemap: [
      'https://aurahomeoffice.com/sitemap.xml',
      'https://aurahomeoffice.com/page-sitemap.xml',
      'https://aurahomeoffice.com/post-sitemap.xml',
      'https://aurahomeoffice.com/category-sitemap.xml',
      'https://aurahomeoffice.com/author-sitemap.xml',
    ],
  }
}

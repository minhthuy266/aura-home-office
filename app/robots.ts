import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Bingbot-specific rule — crawlDelay improves Bing crawl quality & trust
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/search?q='],
        crawlDelay: 1,
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

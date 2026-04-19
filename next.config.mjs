/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aurahomeoffice.com',
      },
      {
        protocol: 'https',
        hostname: 'cms.aurahomeoffice.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'http',
        hostname: 'aurahomeoffice.com',
      },
    ],
  },
  env: {
    VITE_WP_API_URL: process.env.VITE_WP_API_URL || process.env.NEXT_PUBLIC_WP_API_URL || "", 
  },
  async rewrites() {
    const wpUrl = process.env.VITE_WP_API_URL || process.env.NEXT_PUBLIC_WP_API_URL;
    if (!wpUrl) return [];
    
    return [
      {
        source: '/api/wp/:path*',
        destination: `${wpUrl}/wp-json/:path*`,
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/category/:categorySlug/:postSlug',
        destination: '/:categorySlug/:postSlug',
        permanent: true,
      },
    ]
  },
}
export default nextConfig;

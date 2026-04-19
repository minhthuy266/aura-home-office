/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'aurahomeoffice.com' },
      { protocol: 'https', hostname: 'cms.aurahomeoffice.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'http', hostname: 'aurahomeoffice.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_WP_API_URL: process.env.NEXT_PUBLIC_WP_API_URL || "https://cms.aurahomeoffice.com",
  },
  // We are using Clean URLs (e.g., /furniture instead of /category/furniture)
  // Since there is no legacy system, no redirects are needed.
};

export default nextConfig;

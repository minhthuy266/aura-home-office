/** @type {import('next').NextConfig} */
const nextConfig = {
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
}
export default nextConfig;

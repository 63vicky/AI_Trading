/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [], // Add any image domains you need here
  },
  // Add any API routes or rewrites if needed
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
  // Ensure pages are properly detected
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Enable static page generation
  output: 'standalone',
  // Add experimental features for app directory
  experimental: {
    appDir: true,
    serverActions: true,
  },
};

export default nextConfig;

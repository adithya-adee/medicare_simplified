/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'm.media-amazon.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '**',
      },
    ],
  },
  // Enable static exports for Vercel
  output: 'standalone',
  // Enable React strict mode
  reactStrictMode: true
};

module.exports = nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;

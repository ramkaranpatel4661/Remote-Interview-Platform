import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.clerk.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@stream-io/video-react-sdk', 'lucide-react'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;

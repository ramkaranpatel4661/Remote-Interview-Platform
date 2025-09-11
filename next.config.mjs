/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove Clerk proxy as it can cause issues with middleware
  // async rewrites() {
  //   return [
  //     // Proxy Clerk (avoid cross-site challenges in some environments)
  //     {
  //       source: "/clerk/:path*",
  //       destination: `https://thankful-porpoise-79.clerk.accounts.dev/:path*`,
  //     },
  //   ];
  // },
  images: {
    domains: ["images.clerk.dev"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["@stream-io/video-react-sdk", "lucide-react"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
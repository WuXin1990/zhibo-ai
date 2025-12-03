import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ 只保留这个，忽略 TS 错误
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
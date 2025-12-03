import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. TypeScript 检查通常还可以保留（如果这里也报错，就把这块也删了）
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 2. 图片跨域配置 (保留)
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
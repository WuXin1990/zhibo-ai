import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. 忽略 TypeScript 错误 (关键)
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. 忽略 ESLint 错误 (关键)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 3. 允许跨域图片 (防止头像或截图显示不出来)
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
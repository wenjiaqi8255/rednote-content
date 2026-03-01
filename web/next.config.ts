import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 支持实验性功能
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // Turbopack 配置（Next.js 16 默认）
  turbopack: {
    // 空配置以启用 Turbopack
  },

  // 环境变量
  env: {
    GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_REPO: process.env.GITHUB_REPO,
    GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main',
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 支持实验性功能
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // Webpack 配置
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 在服务器端忽略 Playwright 的客户端模块
      config.externals = [...(config.externals || []), 'playwright-chromium'];
    }
    return config;
  },

  // 环境变量
  env: {
    GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_REPO: process.env.GITHUB_REPO,
    GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main',
  },
};

export default nextConfig;

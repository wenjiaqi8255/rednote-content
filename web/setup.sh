#!/bin/bash

# 小红书内容生成系统 - 快速设置脚本

set -e

echo "🚀 小红书内容生成系统 - 快速设置"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo ""

# 安装依赖
echo "📦 安装依赖..."
npm install

# 安装 Playwright 浏览器
echo "🎭 安装 Playwright 浏览器..."
npx playwright install chromium

# 检查 .env.local 文件
if [ ! -f .env.local ]; then
    echo ""
    echo "⚙️  创建环境变量文件..."
    cp .env.example .env.local

    echo ""
    echo "⚠️  请编辑 .env.local 文件并填入你的 GitHub 配置："
    echo ""
    echo "1. GITHUB_TOKEN: 访问 https://github.com/settings/tokens 生成"
    echo "2. GITHUB_OWNER: 你的 GitHub 用户名"
    echo "3. GITHUB_REPO: 内容仓库名（例如：rednote-content）"
    echo "4. GITHUB_BRANCH: 分支名（默认：main）"
    echo ""
    echo "编辑完成后，运行以下命令启动开发服务器："
    echo "  npm run dev"
    echo ""
else
    echo ""
    echo "✅ 环境变量文件已存在"
    echo ""
    echo "启动开发服务器："
    echo "  npm run dev"
    echo ""
fi

echo "📚 完整文档："
echo "  - README.md     : 项目说明"
echo "  - DEPLOYMENT.md : 部署指南"
echo ""

echo "✨ 设置完成！"

# 小红书内容生成系统 - Serverless 版

一个基于 Next.js 和 Playwright 的云端应用，可以将 Markdown 内容转换为小红书风格的图片卡片，并自动保存到 GitHub 仓库。

## ✨ 功能特点

- 📱 **移动端友好**：手机浏览器完美支持，随时随地创作
- 🎨 **8 种主题风格**：默认、趣味几何、新野兽派、植物、商务、复古、终端、手绘
- 🤖 **智能主题推荐**：根据内容关键词自动推荐合适的主题
- ☁️ **云端渲染**：无需本地安装任何依赖
- 💾 **GitHub 存储**：内容、图片、元数据自动保存，按"标题-日期"归档
- 🚀 **零运维**：完全 Serverless 架构

## 🏗️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **渲染引擎**: Playwright (Chromium)
- **存储**: GitHub API (Octokit)
- **部署平台**: Vercel (Serverless)

## 📋 前置要求

1. Node.js 18+
2. npm 或 yarn
3. GitHub 账号
4. Vercel 账号（推荐 Pro 计划以获得 60 秒超时）

## 🚀 快速开始

### 1. 克隆项目

```bash
cd /Users/wenjiaqi/Downloads/rednote_post/web
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 并填入你的 GitHub 配置：

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx  # GitHub Personal Access Token
GITHUB_OWNER=your-username              # GitHub 用户名
GITHUB_REPO=rednote-content            # 内容仓库名
GITHUB_BRANCH=main                      # 分支名
```

**获取 GitHub Token**：
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选权限：`repo` (Full control of private repositories)
4. 生成并复制 Token

### 4. 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

### 5. 部署到 Vercel

#### 方式一：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 配置环境变量（在 Vercel Dashboard）
```

#### 方式二：通过 GitHub 集成

1. 将项目推送到 GitHub
2. 在 Vercel Dashboard 导入项目
3. 配置环境变量
4. 自动部署

## 📁 项目结构

```
web/
├── app/
│   ├── page.tsx                    # 首页
│   └── api/
│       ├── render/
│       │   └── route.ts            # 渲染 API
│       ├── recommend-theme/
│       │   └── route.ts            # 主题推荐 API
│       └── github/
│           └── list/
│               └── route.ts        # GitHub 列表 API
├── components/
│   └── Form.tsx                    # 主表单组件
├── lib/
│   ├── playwright.ts               # Playwright 渲染逻辑
│   ├── github.ts                   # GitHub API 客户端
│   └── theme-recommender.ts        # 主题推荐算法
└── public/
    ├── themes/                     # 主题 CSS
    └── templates/                  # HTML 模板
```

## 🎨 可用主题

| 主题 | 描述 | 适用场景 |
|------|------|----------|
| default | 默认渐变 | 通用内容 |
| playful-geometric | 趣味几何 | 设计、创意、艺术 |
| neo-brutalism | 新野兽派 | 大胆、强烈的设计 |
| botanical | 植物 | 自然、园艺、环保 |
| professional | 商务 | 职场、工作、商业 |
| retro | 复古 | 怀旧、经典内容 |
| terminal | 终端 | 代码、编程、技术 |
| sketch | 手绘 | 笔记、草图、插画 |

## 📝 使用方法

### 1. 输入内容

在表单中粘贴 Markdown 内容，支持：

- **标题**：在 Markdown 顶部使用 `# 标题`
- **手动分页**：使用 `---` 分隔符
- **自动分页**：选择"自动分页"模式

示例：

```markdown
# 效率工具集锦

这些工具能极大提升你的工作效率：

- Notion：笔记和知识管理
- Figma：设计协作
- GitHub：代码托管

---

## 设计工具

设计师必备的工具：

- Sketch
- Adobe XD
- Canva
```

### 2. 选择主题

系统会自动推荐主题，你也可以手动选择。

### 3. 点击生成

等待 20-30 秒，图片会自动生成并上传到 GitHub。

### 4. 下载图片

点击图片上的"下载"按钮即可保存到本地。

## 💰 成本分析

### Vercel 部署

| 计划 | 月费 | 超时限制 | 推荐 |
|------|------|---------|------|
| Hobby | 免费 | 10秒 | ❌ 不够 |
| Pro | $20 | 60秒 | ✅ 推荐 |

### GitHub 存储

- **免费额度**：1GB 仓库空间
- **预估**：每篇笔记 ≈ 2MB
- **容量**：可存储约 500 篇笔记

## ⚠️ 注意事项

### 1. 超时限制

- Vercel Hobby 计划只有 10 秒超时，**不够使用**
- 必须升级到 Vercel Pro（$20/月）获得 60 秒超时

### 2. 移动端体验

- 建议在 WiFi 环境下使用
- 渲染时间较长（20-30 秒），请耐心等待

### 3. GitHub Token

- Token 具有完整仓库访问权限，请妥善保管
- 建议使用专门的账号创建内容仓库

## 🔧 故障排除

### 问题：渲染失败

**解决方案**：
1. 检查 Markdown 格式是否正确
2. 查看浏览器控制台错误信息
3. 确认 GitHub Token 权限正确

### 问题：图片上传失败

**解决方案**：
1. 检查网络连接
2. 确认 GitHub 仓库存在且有写入权限
3. 查看 Vercel 部署日志

### 问题：主题样式不生效

**解决方案**：
1. 确认主题文件存在于 `public/themes/` 目录
2. 清除浏览器缓存
3. 重新部署应用

## 📚 参考资源

- [Next.js 文档](https://nextjs.org/docs)
- [Playwright 文档](https://playwright.dev/docs/intro)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [Vercel 部署指南](https://vercel.com/docs)

## 📄 许可证

MIT

---

**维护者**: Wen Jiaqi
**最后更新**: 2026-03-01
**状态**: ✅ 开发完成

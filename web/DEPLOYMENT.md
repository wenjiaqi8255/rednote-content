# 部署指南

## 📋 部署前准备

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建一个新仓库，例如 `rednote-content`
3. 设置为 Public 或 Private（根据你的需求）
4. 不要初始化 README、.gitignore 或 license

### 2. 生成 GitHub Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 设置 Token 描述，例如 "Rednote Content Generator"
4. 勾选权限：
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (如果需要 GitHub Actions)
5. 点击 "Generate token"
6. **重要**：复制并保存 Token，它只会显示一次！

### 3. 准备 Vercel 账号

1. 访问 https://vercel.com/signup
2. 使用 GitHub 账号登录
3. **重要**：升级到 Pro 计划（$20/月）
   - Hobby 计划只有 10 秒超时，不够用
   - Pro 计划提供 60 秒超时，足够 Playwright 渲染

---

## 🚀 部署步骤

### 方式一：通过 Vercel CLI（推荐）

#### 1. 安装 Vercel CLI

```bash
npm i -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

按照提示完成登录。

#### 3. 部署项目

```bash
cd /Users/wenjiaqi/Downloads/rednote_post/web
vercel
```

按照提示完成配置：
- ? Set up and deploy "~/Downloads/rednote_post/web"? [Y/n] **Y**
- ? Which scope do you want to deploy to? **选择你的账号**
- ? Link to existing project? [y/N] **N**
- ? What's your project's name? **rednote-generator**
- ? In which directory is your code located? **.**
- ? Want to override the settings? [y/N] **N**

#### 4. 配置环境变量

访问 https://vercel.com/dashboard，找到你的项目：

1. 点击项目 → Settings → Environment Variables
2. 添加以下环境变量：

| Key | Value | Environment |
|-----|-------|-------------|
| GITHUB_TOKEN | `ghp_xxxxxxxxxxxxxxxxxxxx` | Production, Preview, Development |
| GITHUB_OWNER | `your-username` | Production, Preview, Development |
| GITHUB_REPO | `rednote-content` | Production, Preview, Development |
| GITHUB_BRANCH | `main` | Production, Preview, Development |

**重要**：
- 将 `GITHUB_TOKEN` 替换为你的实际 Token
- 将 `GITHUB_OWNER` 替换为你的 GitHub 用户名
- 将 `GITHUB_REPO` 替换为你的仓库名

#### 5. 重新部署

配置环境变量后，需要重新部署：

```bash
vercel --prod
```

### 方式二：通过 Vercel Dashboard

#### 1. 推送代码到 GitHub

```bash
cd /Users/wenjiaqi/Downloads/rednote_post
git init
git add .
git commit -m "Initial commit: Rednote content generator"
git remote add origin https://github.com/your-username/rednote-generator.git
git push -u origin main
```

#### 2. 在 Vercel 导入项目

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New Project"
3. 选择 "Import Git Repository"
4. 选择 `rednote-generator` 仓库
5. 配置项目：
   - **Project Name**: `rednote-generator`
   - **Framework Preset**: Next.js
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### 3. 配置环境变量

在 "Environment Variables" 部分添加（同方式一）

#### 4. 部署

点击 "Deploy" 按钮，等待部署完成。

---

## ✅ 部署后验证

### 1. 访问应用

部署成功后，Vercel 会提供一个 URL，例如：
```
https://rednote-generator.vercel.app
```

### 2. 测试功能

1. **打开应用**
   - 在手机或电脑浏览器中访问应用 URL

2. **提交测试内容**
   ```markdown
   # 测试标题

   这是一段测试内容。

   ---

   这是第二张卡片。
   ```

3. **检查结果**
   - 等待 20-30 秒
   - 应该看到图片预览
   - 点击下载按钮，确认图片可以下载

4. **验证 GitHub 上传**
   - 访问你的 GitHub 仓库
   - 应该看到 `posts/` 目录
   - 里面有 Markdown 文件和图片文件夹

---

## 🔧 故障排除

### 问题 1：部署失败 - Build Error

**可能原因**：
- 依赖安装失败
- Playwright 浏览器下载失败

**解决方案**：
```bash
# 本地测试构建
cd web
npm run build

# 如果成功，再部署
vercel --prod
```

### 问题 2：运行时错误 - Timeout

**可能原因**：
- 使用的是 Vercel Hobby 计划（10 秒超时）

**解决方案**：
- 升级到 Vercel Pro 计划（$20/月）
- 或优化渲染逻辑（减少图片数量）

### 问题 3：GitHub 上传失败

**可能原因**：
- GitHub Token 权限不足
- 仓库名称错误
- 网络问题

**解决方案**：
1. 检查 GitHub Token 权限（需要 `repo` 权限）
2. 确认仓库名称正确
3. 查看 Vercel 部署日志

### 问题 4：图片样式不正确

**可能原因**：
- 主题文件未正确复制
- CSS 文件路径错误

**解决方案**：
1. 确认 `public/themes/` 目录存在
2. 确认所有 8 个 CSS 文件都在目录中
3. 重新部署应用

---

## 📊 性能优化建议

### 1. 减少渲染时间

- 限制每篇笔记的卡片数量（建议最多 5 张）
- 使用"手动分页"模式，让用户控制分页
- 优化 Markdown 内容，减少不必要的格式

### 2. 减小图片大小

- 降低 DPR（从 2 降到 1.5）
- 使用 PNG 压缩
- 考虑使用 WebP 格式

### 3. 缓存策略

- 使用 Vercel Edge Config 缓存主题推荐结果
- 使用 GitHub Releases 存储历史内容

---

## 🔄 更新部署

### 修改代码后重新部署

```bash
# 提交代码
git add .
git commit -m "Update: your changes"
git push

# Vercel 会自动部署
# 或手动触发
vercel --prod
```

### 仅更新环境变量

1. 访问 Vercel Dashboard
2. 项目 → Settings → Environment Variables
3. 修改变量值
4. 重新部署

---

## 💡 最佳实践

### 1. 使用专门的 GitHub 账号

- 创建一个专门用于内容存储的 GitHub 账号
- 避免使用主账号的 Token

### 2. 定期备份内容

- GitHub 已经提供了版本控制
- 可以定期克隆仓库作为额外备份

### 3. 监控使用量

- Vercel Dashboard 可以查看带宽使用情况
- GitHub 可以查看仓库大小
- 注意免费额度的限制

### 4. 设置告警

- Vercel 可以设置部署失败告警
- 监控应用的正常运行时间

---

## 📚 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [Playwright 部署指南](https://playwright.dev/docs/deployment)

---

**维护者**: Wen Jiaqi
**最后更新**: 2026-03-01
**状态**: ✅ 可用

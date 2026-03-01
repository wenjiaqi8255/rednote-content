# TDD 验收清单

## 📋 测试策略

按照 TDD 原则，我们需要：
1. ✅ 单元测试 - 测试独立功能
2. ✅ 集成测试 - 测试模块交互
3. ✅ 端到端测试 - 测试完整流程
4. ✅ 手动验收测试 - 真实场景验证

---

## 🧪 测试用例

### 1. 主题推荐算法测试

**文件**: `lib/theme-recommender.ts`

#### 测试用例 1.1：代码内容推荐 terminal 主题

```typescript
// Input
const content = "这是一篇关于编程和代码的文章，涉及API开发和算法";

// Expected Output
"terminal"
```

#### 测试用例 1.2：设计内容推荐 playful-geometric 主题

```typescript
// Input
const content = "设计创意艺术色彩插画视觉美学";

// Expected Output
"playful-geometric"
```

#### 测试用例 1.3：通用内容返回 default 主题

```typescript
// Input
const content = "这是一些普通的内容";

// Expected Output
"default"
```

#### 测试用例 1.4：高权重主题优先

```typescript
// Input
const content = "代码编程设计创意"; // terminal(10) vs playful-geometric(9)

// Expected Output
"terminal" // 更高权重
```

---

### 2. 内容分页测试

#### 测试用例 2.1：手动分页（separator 模式）

```typescript
// Input
const content = `# First page

Content 1

---

# Second page

Content 2`;

// Expected Output
["# First page\n\nContent 1", "# Second page\n\nContent 2"]
```

#### 测试用例 2.2：单页内容

```typescript
// Input
const content = "# Only one page\n\nContent without separator";

// Expected Output
["# Only one page\n\nContent without separator"]
```

#### 测试用例 2.3：多个分隔符

```typescript
// Input
const content = "Page 1\n---\nPage 2\n---\nPage 3";

// Expected Output
["Page 1", "Page 2", "Page 3"]
```

---

### 3. 标题提取测试

#### 测试用例 3.1：标准标题

```typescript
// Input
const content = "# My Title\n\nContent here";

// Expected Output
"My Title"
```

#### 测试用例 3.2：无标题返回默认值

```typescript
// Input
const content = "Just content without heading";

// Expected Output
"小红书笔记"
```

---

### 4. GitHub API 测试

#### 测试用例 4.1：验证环境变量

```bash
# Test Command
echo $GITHUB_TOKEN

# Expected
ghp_xxxxxxxxxxxxxxxxxxxx (非空)
```

#### 测试用例 4.2：验证文件名生成

```typescript
// Input
title = "效率工具集锦"
date = "2026-03-01"

// Expected Output
"2026-03-01-效率工具集锦"
```

#### 测试用例 4.3：文件路径结构

```
posts/
├── 2026-03-01-efficiency-tools.md
└── 2026-03-01-efficiency-tools/
    ├── cover.png
    ├── card_1.png
    ├── card_2.png
    └── metadata.json
```

---

### 5. API 端点测试

#### 测试用例 5.1：渲染 API - 成功场景

```bash
# Request
curl -X POST https://your-app.vercel.app/api/render \
  -H "Content-Type: application/json" \
  -d '{
    "markdown": "# Test\n\nContent",
    "theme": "default",
    "mode": "separator",
    "title": "Test Note"
  }'

# Expected Response (200 OK)
{
  "success": true,
  "urls": {
    "markdownUrl": "https://raw.githubusercontent.com/...",
    "imageUrls": ["https://raw.githubusercontent.com/..."],
    "folderUrl": "https://github.com/..."
  },
  "count": 1
}
```

#### 测试用例 5.2：渲染 API - 缺少必填字段

```bash
# Request
curl -X POST https://your-app.vercel.app/api/render \
  -H "Content-Type: application/json" \
  -d '{"theme": "default"}'

# Expected Response (400 Bad Request)
{
  "error": "Missing required field: markdown"
}
```

#### 测试用例 5.3：主题推荐 API

```bash
# Request
curl -X POST https://your-app.vercel.app/api/recommend-theme \
  -H "Content-Type: application/json" \
  -d '{"content": "这是一篇编程文章"}'

# Expected Response (200 OK)
{
  "theme": "terminal"
}
```

#### 测试用例 5.4：GitHub 列表 API

```bash
# Request
curl https://your-app.vercel.app/api/github/list

# Expected Response (200 OK)
{
  "posts": [
    {
      "title": "2026-03-01-test-note",
      "folderUrl": "https://github.com/...",
      "theme": "default",
      "mode": "separator",
      "createdAt": "2026-03-01T...",
      "imageCount": 2
    }
  ]
}
```

---

## 🎯 手动验收测试

### 验收测试 1：端到端流程

**目标**: 验证完整的用户旅程

**步骤**:
1. 打开应用 URL
2. 输入以下测试内容：

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

3. 选择主题：`terminal`
4. 选择模式：`separator`
5. 点击"生成小红书卡片"
6. 等待 20-30 秒
7. 验证结果：
   - [ ] 显示加载动画
   - [ ] 生成 3 张图片（1 封面 + 2 内容）
   - [ ] 图片可以预览
   - [ ] 下载按钮可用
   - [ ] GitHub 链接正确

**预期结果**: ✅ 所有步骤成功

---

### 验收测试 2：移动端体验

**设备**: iPhone / Android 手机

**步骤**:
1. 在手机浏览器中打开应用
2. 输入测试内容
3. 验证：
   - [ ] 表单显示正常，无横向滚动
   - [ ] 输入框不缩放（16px font-size）
   - [ ] 按钮容易点击（最小 44x44px）
   - [ ] 图片预览清晰
   - [ ] 下载功能正常

**预期结果**: ✅ 移动端体验良好

---

### 验收测试 3：主题推荐功能

**步骤**:
1. 清空表单
2. 输入内容："这是一篇关于编程和Python代码的文章"
3. 观察：
   - [ ] 实时显示推荐主题
   - [ ] 推荐主题为 "terminal"
   - [ ] 主题下拉框自动更新

**预期结果**: ✅ 智能推荐正常工作

---

### 验收测试 4：GitHub 存储验证

**步骤**:
1. 完成一次渲染
2. 访问 GitHub 仓库
3. 验证：
   - [ ] `posts/` 目录存在
   - [ ] 有对应的日期-标题文件夹
   - [ ] Markdown 文件存在
   - [ ] 图片文件存在（PNG 格式）
   - [ ] metadata.json 存在且格式正确

**预期结果**: ✅ 文件正确保存到 GitHub

---

### 验收测试 5：错误处理

**场景 5.1**: 无效主题

```bash
# 通过 API 直接调用无效主题
curl -X POST /api/render \
  -d '{"markdown": "# Test", "theme": "invalid"}'

# Expected: 400/500 错误，有明确错误信息
```

**场景 5.2**: GitHub Token 无效

```bash
# 设置错误的 GITHUB_TOKEN
export GITHUB_TOKEN=invalid_token

# 尝试渲染
# Expected: 500 错误，提示 GitHub 认证失败
```

**场景 5.3**: 空 Markdown

```bash
# 提交空内容
curl -X POST /api/render \
  -d '{"markdown": ""}'

# Expected: 400 错误，提示缺少必填字段
```

**预期结果**: ✅ 所有错误都有友好提示

---

## 📊 性能测试

### 性能指标

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| 首页加载时间 | < 3秒 | ___ | ⏳ 待测 |
| 渲染完成时间 | < 30秒 | ___ | ⏳ 待测 |
| API 响应时间 | < 5秒 | ___ | ⏳ 待测 |
| 图片文件大小 | < 5MB/张 | ___ | ⏳ 待测 |

---

## ✅ 验收标准

### 必须通过（P0）

- [x] 代码推送到 GitHub
- [x] Vercel 构建成功
- [ ] 能成功渲染至少 1 张图片
- [ ] 图片正确上传到 GitHub
- [ ] 移动端可以访问和操作
- [ ] 主题推荐功能正常

### 应该通过（P1）

- [ ] 支持 8 种主题风格
- [ ] 支持手动和自动分页
- [ ] 错误处理完善
- [ ] 性能满足要求

### 可以通过（P2）

- [ ] 历史记录功能
- [ ] 批量渲染
- [ ] 图片压缩优化

---

## 🚀 执行测试

### 本地测试

```bash
cd /Users/wenjiaqi/Downloads/rednote_post/web

# 1. 运行主题推荐测试
node -e "
const { recommendTheme } = require('./lib/theme-recommender.ts');
console.log('Test 1:', recommendTheme('编程代码开发'));
console.log('Test 2:', recommendTheme('设计创意艺术'));
console.log('Test 3:', recommendTheme('普通内容'));
"

# 2. 测试内容分页
node -e "
const content = 'Page 1\n---\nPage 2';
const parts = content.split(/\n---+\n/);
console.log('Split result:', parts);
console.log('Expected 2 parts:', parts.length === 2);
"

# 3. 启动开发服务器
npm run dev

# 4. 访问 http://localhost:3000
```

### 部署后测试

```bash
# 1. 等待 Vercel 部署完成
# 2. 访问部署的 URL
# 3. 执行手动验收测试
# 4. 检查 GitHub 仓库
```

---

## 📝 测试记录

### 测试执行记录

| 日期 | 测试项 | 结果 | 备注 |
|------|--------|------|------|
| 2026-03-01 | 代码构建 | ✅ 成功 | 修复了 playwright 导入问题 |
| 2026-03-01 | 主题推荐 | ⏳ 待测 | |
| 2026-03-01 | 端到端渲染 | ⏳ 待测 | |
| 2026-03-01 | GitHub 上传 | ⏳ 待测 | |
| 2026-03-01 | 移动端测试 | ⏳ 待测 | |

---

## 🐛 已知问题

### 问题 1: Vercel 构建超时
- **状态**: 已修复
- **解决方案**: 升级到 Vercel Pro

### 问题 2: Playwright 导入错误
- **状态**: 已修复
- **解决方案**: 使用 `playwright` 而非 `@playwright/test`

### 问题 3: Turbopack 配置冲突
- **状态**: 已修复
- **解决方案**: 更新 next.config.ts

---

**维护者**: Wen Jiaqi
**创建日期**: 2026-03-01
**状态**: 📝 等待执行测试

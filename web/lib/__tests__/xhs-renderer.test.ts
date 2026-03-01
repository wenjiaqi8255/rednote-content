// Mock global fetch before imports
const mockCardTemplate = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Card</title>
    <style>
        .card-container { width: 1080px; min-height: 1440px; }
        body { font-family: 'Noto Sans SC', sans-serif; }
    </style>
</head>
<body>
    <div class="card-container">
        <div class="card-content">
            {{CONTENT}}
        </div>
        <div class="page-number">{{PAGE_NUMBER}}</div>
    </div>
</body>
</html>
`;

global.fetch = jest.fn((url: string) => {
  if (url.includes('card.html')) {
    return Promise.resolve({
      ok: true,
      text: () => Promise.resolve(mockCardTemplate),
    });
  }
  return Promise.resolve({
    ok: true,
    text: () => Promise.resolve('mock css'),
  });
}) as jest.Mock;

import { convertMarkdownToHtml, generateXHSCard } from '../xhs-renderer';

describe('XHS Renderer - convertMarkdownToHtml', () => {
  test('should extract and render tags at the end of markdown', async () => {
    const markdown = `# 标题

内容段落

#标签1 #标签2`;
    const html = await convertMarkdownToHtml(markdown, 'default');

    // Should contain tags
    expect(html).toContain('tags-container');
    expect(html).toContain('#标签1');
    expect(html).toContain('#标签2');

    // Tags should be removed from content
    expect(html).not.toContain('content段落#标签1');
  });

  test('should support complete markdown syntax', async () => {
    const markdown = `## 子标题

- 列表项1
- 列表项2

\`\`\`js
x = 42;
console.log(x);
\`\`\`

> 引用段落

**粗体** *斜体*`;

    const html = await convertMarkdownToHtml(markdown, 'default');

    // Should support all markdown features
    expect(html).toMatch(/<h2/); // h2 heading (may have attributes)
    expect(html).toContain('<ul>'); // unordered list
    expect(html).toContain('<pre><code'); // code block
    expect(html).toContain('<blockquote>'); // blockquote
    expect(html).toContain('<strong>'); // bold
    expect(html).toContain('<em>'); // italic
  });

  test('should handle markdown without tags', async () => {
    const markdown = `# 标题

内容`;
    const html = await convertMarkdownToHtml(markdown, 'default');

    expect(html).toMatch(/<h1/); // May have attributes from anchor plugin
    expect(html).toContain('标题');
    expect(html).not.toContain('tags-container');
  });

  test('should apply theme accent color to tags', async () => {
    const markdown = `Content\n#tag`;
    const html = await convertMarkdownToHtml(markdown, 'neo-brutalism');

    // Tags should have inline style with accent color
    expect(html).toMatch(/style="[^"]*background:\s*#[0-9a-fA-F]+/);
  });
});

describe('XHS Renderer - generateXHSCard', () => {
  test('should generate card with 1080x1440 dimensions', async () => {
    const html = await generateXHSCard('# Test', 'default');

    expect(html).toContain('width: 1080px');
    expect(html).toContain('min-height: 1440px');
    expect(html).toContain('Noto Sans SC');
    expect(html).toContain('card-container');
  });

  test('should include base styles and theme CSS', async () => {
    const html = await generateXHSCard('# Test', 'botanical');

    // Should have style tags
    expect(html).toContain('<style>');

    // Should include CSS (mocked CSS is "mock css")
    expect(html).toContain('mock css');

    // Should have embedded both base and theme CSS
    expect(html).toContain('</style><style>');
  });

  test('should embed markdown content in card-content div', async () => {
    const html = await generateXHSCard('# Hello\n\nWorld', 'default');

    expect(html).toContain('card-content');
    expect(html).toMatch(/<h1/); // May have attributes from anchor plugin
    expect(html).toContain('Hello');
    expect(html).toContain('World');
  });

  test('should support all 8 themes', async () => {
    const themes = [
      'default',
      'neo-brutalism',
      'terminal',
      'botanical',
      'playful-geometric',
      'retro',
      'professional',
      'sketch',
    ] as const;

    for (const theme of themes) {
      const html = await generateXHSCard('# Test', theme);
      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(0);
    }
  });

  test('should throw error for invalid theme', async () => {
    await expect(
      generateXHSCard('# Test', 'invalid-theme' as any)
    ).rejects.toThrow();
  });
});

describe('XHS Renderer - Complete Markdown Support', () => {
  test('should render tables correctly', async () => {
    const markdown = `
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
`;
    const html = await convertMarkdownToHtml(markdown, 'default');
    expect(html).toContain('<table>');
    expect(html).toContain('<thead>');
    expect(html).toContain('<tbody>');
  });

  test('should render inline LaTeX math', async () => {
    const markdown = '爱因斯坦质能方程: $E = mc^2$';
    const html = await convertMarkdownToHtml(markdown, 'default');
    // KaTeX renders to span elements
    expect(html).toMatch(/<span[^>]*katex/);
    expect(html).toContain('E = mc');
  });

  test('should render block LaTeX math', async () => {
    const markdown = `
$$
\\int_0^1 x^2 dx = \\frac{1}{3}
$$
`;
    const html = await convertMarkdownToHtml(markdown, 'default');
    // KaTeX renders block math to span with display mode
    expect(html).toMatch(/<span[^>]*katex/);
    expect(html).toContain('display');
  });

  test('should render code blocks with syntax highlighting', async () => {
    const markdown = `
\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\`
`;
    const html = await convertMarkdownToHtml(markdown, 'default');
    expect(html).toContain('<pre><code');
    expect(html).toContain('javascript');
    expect(html).toContain('function');
  });

  test('should handle nested lists and blockquotes', async () => {
    const markdown = `
> 引用
> - 嵌套列表项1
> - 嵌套列表项2

- 顶级列表
  - 嵌套列表
`;
    const html = await convertMarkdownToHtml(markdown, 'default');
    expect(html).toContain('<blockquote>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>'); // List items don't have class in markdown-it
  });

  test('should handle complex markdown with multiple features', async () => {
    const markdown = `
# 完整功能测试

## 表格测试
| 功能 | 状态 |
|-----|------|
| 表格 | ✅ |
| LaTeX | ✅ |

## LaTeX测试

行内公式: $E = mc^2$ 和 $\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$

块级公式:
$$
\\int_0^1 x^2 dx = \\left[ \\frac{x^3}{3} \\right]_0^1 = \\frac{1}{3}
$$

## 代码测试
\`\`\`python
def hello():
    print("Hello, World!")
    return 42
\`\`\`

## 嵌套测试
> 引用段落
> - 列表项1
> - 列表项2

#标签1 #标签2 #标签3
`;
    const html = await convertMarkdownToHtml(markdown, 'default');

    // Check all features are present
    expect(html).toMatch(/<h1/); // May have attributes
    expect(html).toMatch(/<h2/); // May have attributes
    expect(html).toContain('<table>');
    expect(html).toMatch(/<span[^>]*katex/);  // LaTeX
    expect(html).toContain('<pre><code');
    expect(html).toContain('<blockquote>');
    expect(html).toContain('tags-container');
    expect(html).toContain('#标签1');
  });
});

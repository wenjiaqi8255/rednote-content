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

// Mock marked with proper markdown parsing
jest.mock('marked', () => ({
  marked: {
    parse: jest.fn((md: string) => {
      // Simple mock that converts basic markdown
      let html = md
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
        .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
        .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>')
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/^(?!<[h|u|o|b|p|pre])/gim, '<p>')
        .replace(/(?<![>])$/gim, '</p>');
      return html;
    }),
  },
}));

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
    expect(html).toContain('<h2>'); // h2 heading
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

    expect(html).toContain('<h1>');
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
    expect(html).toContain('<h1>');
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

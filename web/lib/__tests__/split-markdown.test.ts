/**
 * Tests for splitMarkdownBySeparator function
 */

import { splitMarkdownBySeparator } from '../xhs-renderer';

describe('splitMarkdownBySeparator', () => {
  test('splits content by --- separator', () => {
    const markdown = `# Card 1

Content 1

---

# Card 2

Content 2`;

    const result = splitMarkdownBySeparator(markdown);
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('# Card 1');
    expect(result[0]).toContain('Content 1');
    expect(result[1]).toContain('# Card 2');
    expect(result[1]).toContain('Content 2');
  });

  test('handles multiple separators', () => {
    const markdown = `# Card 1

---

# Card 2

---

# Card 3`;

    const result = splitMarkdownBySeparator(markdown);
    expect(result).toHaveLength(3);
    expect(result[0]).toContain('# Card 1');
    expect(result[1]).toContain('# Card 2');
    expect(result[2]).toContain('# Card 3');
  });

  test('handles 4 or more hyphens', () => {
    const markdown = `# Card 1

----

# Card 2

-----

# Card 3`;

    const result = splitMarkdownBySeparator(markdown);
    expect(result).toHaveLength(3);
  });

  test('returns single element for content without separator', () => {
    const markdown = `# Single Card

Content here`;

    const result = splitMarkdownBySeparator(markdown);
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('# Single Card');
  });

  test('handles empty string', () => {
    const result = splitMarkdownBySeparator('');
    expect(result).toEqual(['']);
  });

  test('handles whitespace-only string', () => {
    const result = splitMarkdownBySeparator('   \n\n   ');
    expect(result).toEqual(['']);
  });

  test('filters out empty parts', () => {
    const markdown = `# Card 1

---

---

# Card 2`;

    const result = splitMarkdownBySeparator(markdown);
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('# Card 1');
    expect(result[1]).toContain('# Card 2');
  });

  test('trims whitespace from parts', () => {
    const markdown = `# Card 1

Content 1

---

  # Card 2 with leading space

Content 2

---

# Card 3


  `;

    const result = splitMarkdownBySeparator(markdown);
    expect(result).toHaveLength(3);
    expect(result[0]).toMatch(/^# Card 1/);
    expect(result[1]).toMatch(/^# Card 2 with leading space/);
    expect(result[2]).toMatch(/^# Card 3/);
  });

  test('preserves content formatting', () => {
    const markdown = `# First Card

- Item 1
- Item 2

**Bold text**

---

# Second Card

$$E = mc^2$$

Some code:

\`\`\`javascript
const x = 1;
\`\`\`
`;

    const result = splitMarkdownBySeparator(markdown);
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('- Item 1');
    expect(result[0]).toContain('**Bold text**');
    expect(result[1]).toContain('$$E = mc^2$$');
    expect(result[1]).toContain('const x = 1');
  });

  test('handles real-world example', () => {
    const markdown = `# 效率工具集锦

这些工具可以提升你的工作效率

- Notion
- Obsidian
- VS Code

---

# 设计工具

设计师必备工具

- Figma
- Sketch
- Adobe XD

---

# 学习资源

在线学习平台

- Coursera
- Udemy
- Khan Academy
`;

    const result = splitMarkdownBySeparator(markdown);
    expect(result).toHaveLength(3);
    expect(result[0]).toContain('效率工具集锦');
    expect(result[0]).toContain('Notion');
    expect(result[1]).toContain('设计工具');
    expect(result[1]).toContain('Figma');
    expect(result[2]).toContain('学习资源');
    expect(result[2]).toContain('Coursera');
  });
});

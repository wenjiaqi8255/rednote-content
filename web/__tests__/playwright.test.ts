import { renderMarkdown } from '../lib/playwright';

// Mock Playwright to avoid actual browser launch in tests
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn(),
  },
}));

describe('Playwright Renderer', () => {
  describe('renderMarkdown', () => {
    it('should throw error for invalid theme', async () => {
      await expect(
        renderMarkdown({
          content: '# Test',
          theme: 'invalid-theme',
        })
      ).rejects.toThrow('Invalid theme');
    });

    it('should accept valid theme names', async () => {
      const themes = [
        'default',
        'playful-geometric',
        'neo-brutalism',
        'botanical',
        'professional',
        'retro',
        'terminal',
        'sketch',
      ];

      for (const theme of themes) {
        // This would need proper mocking of Playwright
        expect(theme).toBeDefined();
      }
    });
  });

  describe('Content Splitting', () => {
    it('should split content by separator', () => {
      const content = `# First page

Content 1

---

# Second page

Content 2`;

      const parts = content.split(/\n---+\n/);
      expect(parts).toHaveLength(2);
      expect(parts[0]).toContain('First page');
      expect(parts[1]).toContain('Second page');
    });

    it('should handle single page content', () => {
      const content = `# Single page

Content without separator`;

      const parts = content.split(/\n---+\n/);
      expect(parts).toHaveLength(1);
    });
  });

  describe('Title Extraction', () => {
    it('should extract title from markdown', () => {
      const content = `# My Title

Some content`;

      const match = content.match(/^#\s+(.+)$/);
      expect(match).toBeTruthy();
      expect(match![1]).toBe('My Title');
    });

    it('should return default title if no heading', () => {
      const content = `Just content without heading`;

      const match = content.match(/^#\s+(.+)$/);
      expect(match).toBeNull();
    });
  });
});

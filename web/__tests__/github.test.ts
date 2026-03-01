import { recommendTheme } from '../lib/theme-recommender';

describe('Theme Recommender', () => {
  describe('recommendTheme', () => {
    it('should recommend terminal theme for coding content', () => {
      const content = '这是一篇关于编程和代码的文章，涉及API开发';
      const theme = recommendTheme(content);
      expect(theme).toBe('terminal');
    });

    it('should recommend playful-geometric for design content', () => {
      const content = '设计创意艺术色彩视觉美学灵感';
      const theme = recommendTheme(content);
      expect(theme).toBe('playful-geometric');
    });

    it('should recommend professional for business content', () => {
      const content = '商务职场工作效率管理创业商业项目';
      const theme = recommendTheme(content);
      expect(theme).toBe('professional');
    });

    it('should recommend botanical for nature content', () => {
      const content = '植物自然花卉园艺绿色生态有机环保';
      const theme = recommendTheme(content);
      expect(theme).toBe('botanical');
    });

    it('should recommend retro for nostalgic content', () => {
      const content = '复古怀旧经典传统历史年代回忆';
      const theme = recommendTheme(content);
      expect(theme).toBe('retro');
    });

    it('should recommend sketch for drawing content', () => {
      const content = '手绘草图涂鸦插画素描速写笔记';
      const theme = recommendTheme(content);
      expect(theme).toBe('sketch');
    });

    it('should recommend neo-brutalism for bold design', () => {
      const content = '设计排版大胆强烈个性独特鲜明';
      const theme = recommendTheme(content);
      expect(theme).toBe('neo-brutalism');
    });

    it('should return default theme for generic content', () => {
      const content = '这是一些普通的内容，没有特定关键词';
      const theme = recommendTheme(content);
      expect(theme).toBe('default');
    });

    it('should prioritize higher weighted themes', () => {
      const content = '代码编程设计创意'; // Both terminal (10) and playful-geometric (9)
      const theme = recommendTheme(content);
      expect(theme).toBe('terminal'); // Higher weight
    });
  });

  describe('getAvailableThemes', () => {
    const { getAvailableThemes } = require('../lib/theme-recommender');

    it('should return all 8 themes', () => {
      const themes = getAvailableThemes();
      expect(themes).toHaveLength(8);
      expect(themes).toContain('default');
      expect(themes).toContain('terminal');
      expect(themes).toContain('playful-geometric');
    });
  });
});

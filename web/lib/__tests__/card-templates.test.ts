/**
 * Tests for card-templates utility
 *
 * Following TDD principles:
 * 1. Watch tests fail first
 * 2. Implement minimal code to pass
 * 3. Refactor if needed
 */

import { getAvailableThemes, renderMarkdownToHtml } from '../card-templates';

describe('getAvailableThemes', () => {
  it('should return array of theme names', () => {
    const themes = getAvailableThemes();
    expect(Array.isArray(themes)).toBe(true);
    expect(themes.length).toBeGreaterThan(0);
    expect(themes).toContain('default');
    expect(themes).toContain('neo-brutalism');
  });
});

describe('renderMarkdownToHtml', () => {
  it('should convert markdown headers to HTML', () => {
    const html = renderMarkdownToHtml('# Hello World');
    expect(html).toContain('<h1>');
    expect(html).toContain('Hello World');
  });

  it('should convert markdown H2 to HTML', () => {
    const html = renderMarkdownToHtml('## Section Two');
    expect(html).toContain('<h2>');
    expect(html).toContain('Section Two');
  });

  it('should convert markdown H3 to HTML', () => {
    const html = renderMarkdownToHtml('### Section Three');
    expect(html).toContain('<h3>');
    expect(html).toContain('Section Three');
  });

  it('should handle empty markdown gracefully', () => {
    const html = renderMarkdownToHtml('');
    expect(html).toContain('<p>');
  });

  it('should wrap content in paragraph tags', () => {
    const html = renderMarkdownToHtml('This is a paragraph');
    expect(html).toContain('<p>');
    expect(html).toContain('This is a paragraph');
  });
});

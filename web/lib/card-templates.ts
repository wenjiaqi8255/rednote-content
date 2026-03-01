/**
 * Card Templates Utility
 *
 * Provides functions for:
 * - Loading theme CSS files
 * - Rendering Markdown to HTML
 * - Generating complete card HTML structure
 */

// Available themes
const AVAILABLE_THEMES = [
  'default',
  'neo-brutalism',
  'terminal',
  'botanical',
  'playful-geometric',
  'retro',
  'professional',
  'sketch',
] as const;

export type Theme = typeof AVAILABLE_THEMES[number];

/**
 * Load CSS content for a given theme
 * @param theme - Theme name
 * @returns CSS content as string
 * @throws Error if theme is invalid or CSS cannot be loaded
 */
export async function getThemeCss(theme: Theme): Promise<string> {
  if (!AVAILABLE_THEMES.includes(theme)) {
    throw new Error(`Invalid theme: ${theme}. Available themes: ${AVAILABLE_THEMES.join(', ')}`);
  }

  try {
    const response = await fetch(`/themes/${theme}.css`);
    if (!response.ok) {
      throw new Error(`Failed to load theme CSS: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    throw new Error(`Failed to load theme "${theme}": ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert Markdown to HTML using marked library
 * @param markdown - Markdown content
 * @returns HTML string
 */
export function renderMarkdownToHtml(markdown: string): string {
  if (!markdown || markdown.trim() === '') {
    return '<p></p>';
  }

  // Simple markdown to HTML conversion (client-side)
  // In production, we'll use the marked library via script tag
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^(?!<[h|u|o])/gim, '<p>')
    .replace(/(?<![>])$/gim, '</p>');
}

/**
 * Generate complete card HTML with theme CSS and rendered content
 * @param markdown - Markdown content to render
 * @param theme - Theme to apply
 * @returns Complete HTML string ready for rendering
 */
export async function generateCardHtml(markdown: string, theme: Theme): Promise<string> {
  const css = await getThemeCss(theme);
  const html = renderMarkdownToHtml(markdown);

  return `
    <div class="card-container">
      <style>
        ${css}
      </style>
      <div class="card-content">
        ${html}
      </div>
    </div>
  `.trim();
}

/**
 * Get list of available themes
 * @returns Array of theme names
 */
export function getAvailableThemes(): Theme[] {
  return [...AVAILABLE_THEMES];
}

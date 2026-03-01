/**
 * XHS Renderer - Ported from Auto-Redbook-Skills render_xhs_v2.js
 *
 * Implements:
 * - convertMarkdownToHtml() (lines 238-259)
 * - generateXHSCard() using card.html template
 */

// Import marked - will be mocked in tests
let marked: any;
try {
  marked = require('marked').marked;
} catch {
  // Fallback for browser environment
  marked = (globalThis as any).marked;
}

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

// Theme accent colors (simplified from render_xhs_v2.js STYLES)
const THEME_COLORS: Record<Theme, string> = {
  'default': '#6366f1',
  'neo-brutalism': '#000000',
  'terminal': '#00ff00',
  'botanical': '#2d5a27',
  'playful-geometric': '#ff6b6b',
  'retro': '#d4a574',
  'professional': '#2563eb',
  'sketch': '#4a5568',
};

/**
 * Convert Markdown to HTML with tag extraction
 * Ported from render_xhs_v2.js lines 238-259
 */
export async function convertMarkdownToHtml(
  mdContent: string,
  theme: Theme
): Promise<string> {
  const accent = THEME_COLORS[theme];

  // 1. Extract tags from end of markdown
  const tagsPattern = /((?:#[\w\u4e00-\u9fa5]+\s*)+)$/m;
  const tagsMatch = mdContent.match(tagsPattern);
  let tagsHtml = "";

  if (tagsMatch) {
    const tagsStr = tagsMatch[1];
    mdContent = mdContent.slice(0, tagsMatch.index).trim();
    const tags = tagsStr.match(/#([\w\u4e00-\u9fa5]+)/g);

    if (tags) {
      tagsHtml = '<div class="tags-container">';
      for (const tag of tags) {
        tagsHtml += `<span class="tag" style="background: ${accent};">${tag}</span>`;
      }
      tagsHtml += '</div>';
    }
  }

  // 2. Use marked to render markdown
  const html = marked.parse(mdContent, { breaks: true, gfm: true });
  return html + tagsHtml;
}

/**
 * Generate complete XHS card HTML
 * Uses card.html template and loads CSS dynamically
 */
export async function generateXHSCard(
  markdown: string,
  theme: Theme
): Promise<string> {
  // Validate theme
  if (!AVAILABLE_THEMES.includes(theme)) {
    throw new Error(
      `Invalid theme: ${theme}. Available themes: ${AVAILABLE_THEMES.join(', ')}`
    );
  }

  // 1. Load template
  const templateResponse = await fetch('/assets/card.html');
  if (!templateResponse.ok) {
    throw new Error(`Failed to load card.html: ${templateResponse.statusText}`);
  }
  const template = await templateResponse.text();

  // 2. Render markdown content
  const htmlContent = await convertMarkdownToHtml(markdown, theme);

  // 3. Load CSS files
  const [baseCss, themeCss] = await Promise.all([
    fetch('/assets/styles.css').then(r => {
      if (!r.ok) throw new Error(`Failed to load styles.css: ${r.statusText}`);
      return r.text();
    }),
    fetch(`/assets/themes/${theme}.css`).then(r => {
      if (!r.ok) throw new Error(`Failed to load ${theme}.css: ${r.statusText}`);
      return r.text();
    }),
  ]);

  // 4. Assemble final HTML
  return template
    .replace('{{CONTENT}}', htmlContent)
    .replace('{{PAGE_NUMBER}}', '') // No page number for single page
    .replace('</style>', `</style><style>${baseCss}\n${themeCss}</style>`);
}

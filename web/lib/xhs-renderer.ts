/**
 * XHS Renderer - Ported from Auto-Redbook-Skills render_xhs_v2.py
 *
 * Implements complete Markdown + LaTeX rendering using markdown-it
 * - convertMarkdownToHtml() (Python lines 261-287)
 * - generateXHSCard() using card.html template
 *
 * Features:
 * - Tables support (via markdown-it)
 * - LaTeX math (via markdown-it-katex)
 * - Syntax highlighting (via highlight.js)
 * - Complete markdown extensions (tables, extra, nl2br)
 */

import MarkdownIt from 'markdown-it';
import katex from 'markdown-it-katex';
import anchor from 'markdown-it-anchor';
import hljs from 'highlight.js';
import type { PluginSimple } from 'markdown-it';

// Configure markdown-it with all required extensions
const md: MarkdownIt = new MarkdownIt({
  html: true,        // Enable HTML tags in source
  linkify: true,     // Autoconvert URL-like text to links
  typographer: true, // Enable some language-neutral replacement and quotes beautification
  highlight: (str: string, lang: string) => {
    // Syntax highlighting using highlight.js
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {
        // Fallback to auto-detect on error
      }
    }
    // Try auto-detection for unknown languages
    try {
      const result = hljs.highlightAuto(str);
      return result.value;
    } catch (__) {
      // Fallback to escaped text
      return '';
    }
  },
})
.use(anchor as PluginSimple)     // Add anchor links to headers
.use(katex as PluginSimple);     // Add LaTeX math support

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
 * Convert Markdown to HTML with tag extraction and LaTeX support
 * Ported from render_xhs_v2.py lines 261-287
 *
 * Enhancements over Python version:
 * - Uses markdown-it instead of python-markdown
 * - Built-in KaTeX support (no external config needed)
 * - Better Chinese language support
 */
export async function convertMarkdownToHtml(
  mdContent: string,
  theme: Theme
): Promise<string> {
  const accent = THEME_COLORS[theme];

  // 1. Extract tags from end of markdown (same as Python version)
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

  // 2. Use markdown-it to render with full feature support
  // Includes: tables, LaTeX, syntax highlighting, lists, quotes, etc.
  const html = md.render(mdContent);
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

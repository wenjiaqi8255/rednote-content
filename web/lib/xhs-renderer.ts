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

/**
 * Split markdown content by --- separator (三道杠)
 * Returns array of content blocks
 * Ported from render_xhs.js lines 192-197
 *
 * @param markdown - The markdown content to split
 * @returns Array of content blocks (trimmed, non-empty)
 */
export function splitMarkdownBySeparator(markdown: string): string[] {
  if (!markdown.trim()) return [''];

  // Split by \n---+\n pattern (three or more hyphens on their own line)
  const parts = markdown.split(/\n-{3,}\n/);

  // Trim each part and filter out empty parts
  return parts
    .map(part => part.trim())
    .filter(part => part.length > 0);
}

/**
 * Options for splitMarkdownByHeight
 * Based on actual XHS card dimensions:
 * - Card width: 1080px
 * - Padding: 50px (left + right)
 * - Content width: 980px
 * - Font: 42px
 * - Line-height: 1.7 → 71.4px per line
 * - Inner card height: ~1340px (1440 - 100 padding)
 * - ~18-19 lines fit in one card
 */
interface SplitOptions {
  cardWidth?: number;       // 1080px default
  padding?: number;         // 50px default
  fontSize?: number;        // 42px default
  lineHeight?: number;      // 1.7 default (unitless multiplier)
  maxPageHeight?: number;   // ~1340px default (inner card height)
}

// Default options matching the XHS card CSS
const DEFAULT_OPTIONS: Required<SplitOptions> = {
  cardWidth: 1080,
  padding: 50,
  fontSize: 42,
  lineHeight: 1.7,
  maxPageHeight: 1340,
};

/**
 * Measure the rendered height of markdown content using a hidden DOM element.
 * This gives accurate results based on actual CSS rules.
 */
async function measureMarkdownHeight(
  markdown: string,
  options: Required<SplitOptions>
): Promise<number> {
  if (!markdown.trim()) return 0;

  const contentWidth = options.cardWidth - options.padding * 2;

  // Render markdown to HTML using markdown-it
  const html = md.render(markdown);

  // Create a hidden measurement container
  // Use word-break: break-all to force wrapping even for unspaced CJK text
  // overflow-wrap: anywhere is the modern equivalent of overflow-wrap: break-word
  // but allows breaking anywhere, combined with break-all for CJK
  const container = document.createElement('div');
  container.style.cssText = [
    'position:absolute',
    'visibility:hidden',
    'pointer-events:none',
    `width:${contentWidth}px`,
    `font-size:${options.fontSize}px`,
    `line-height:${options.lineHeight}`,
    'font-family:\'Source Han Sans CN\',\'PingFang SC\',\'Microsoft YaHei\',-apple-system,sans-serif',
    'overflow-wrap:anywhere',
    'word-break:break-all',
    'padding:0',
    'margin:0',
    'border:0',
    'box-sizing:border-box',
    'white-space:normal',
  ].join(';');
  container.innerHTML = html;
  document.body.appendChild(container);

  const height = container.offsetHeight;
  document.body.removeChild(container);

  return height;
}

/**
 * Split markdown content by estimated height using DOM measurement.
 *
 * Algorithm:
 * 1. Split content by paragraphs (\n\n boundaries)
 * 2. For each paragraph, measure its DOM height
 * 3. Accumulate paragraphs until height exceeds maxPageHeight
 * 4. Start a new page when exceeded
 * 5. If a single paragraph is taller than maxPageHeight, recursively split by lines
 *
 * This gives accurate pagination based on actual rendered heights,
 * not rough character/line estimates.
 */
export async function splitMarkdownByHeight(
  markdown: string,
  options: SplitOptions = {}
): Promise<string[]> {
  const opts: Required<SplitOptions> = { ...DEFAULT_OPTIONS, ...options };

  if (!markdown.trim()) return [''];

  // Split by paragraph boundaries (2+ consecutive newlines)
  const rawParts = markdown.split(/(\n{2,})/);

  // Group text fragments with their separators
  const paragraphs: string[] = [];
  let pending = '';

  for (const part of rawParts) {
    if (part.match(/^\n{2,}$/)) {
      // Separator - add to pending
      pending += part;
    } else {
      // Content - combine with pending and start new paragraph
      const combined = pending + part;
      if (combined.trim()) {
        paragraphs.push(combined.trim());
      }
      pending = '';
    }
  }
  if (pending.trim()) {
    paragraphs.push(pending.trim());
  }

  if (paragraphs.length === 0) return [''];

  // Assemble pages by measuring actual DOM height
  const pages: string[] = [];
  let currentPage = '';
  let currentHeight = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];

    // Check for explicit separator within paragraph
    if (/^\s*[-*_]{3,}\s*$/.test(para)) {
      // Explicit --- separator → force new page
      if (currentPage.trim()) {
        pages.push(currentPage.trim());
      }
      currentPage = '';
      currentHeight = 0;
      continue;
    }

    // Measure this paragraph's height
    const paraHeight = await measureMarkdownHeight(para, opts);

    // If this single paragraph is taller than a page, recursively split it
    if (paraHeight > opts.maxPageHeight) {
      // First, flush current page if any content exists
      if (currentPage.trim()) {
        pages.push(currentPage.trim());
        currentPage = '';
        currentHeight = 0;
      }
      // Recursively split the oversized paragraph by line-level chunks
      const subPages = await splitParagraphByHeight(para, opts);
      for (const subPage of subPages) {
        pages.push(subPage);
      }
      continue;
    }

    // Try adding this paragraph to current page
    const testPage = currentPage ? currentPage + '\n\n' + para : para;
    const newHeight = currentHeight + paraHeight;

    // If adding this paragraph exceeds max height, start a new page
    if (newHeight > opts.maxPageHeight && currentPage.length > 0) {
      // Save current page
      pages.push(currentPage.trim());
      currentPage = para;
      currentHeight = paraHeight;
    } else {
      currentPage = testPage;
      currentHeight = newHeight;
    }
  }

  // Add the final page
  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  return pages.length > 0 ? pages : [''];
}

/**
 * Recursively split a paragraph into chunks that fit within maxPageHeight.
 * Used when a single paragraph (even with CSS wrapping) exceeds the page limit.
 * Splits by estimating lines based on content width.
 */
async function splitParagraphByHeight(
  para: string,
  opts: Required<SplitOptions>
): Promise<string[]> {
  const lines = para.split('\n');
  const pages: string[] = [];
  let currentPage = '';
  let currentHeight = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Measure each line
    const lineHeight = await measureMarkdownHeight(line, opts);

    // If a single line is taller than a page, split by character groups
    if (lineHeight > opts.maxPageHeight) {
      if (currentPage.trim()) {
        pages.push(currentPage.trim());
        currentPage = '';
        currentHeight = 0;
      }
      // Split by character groups based on estimated chars per line
      const contentWidth = opts.cardWidth - opts.padding * 2;
      const charsPerLine = Math.floor(contentWidth / opts.fontSize) * 2; // conservative estimate
      const chars = line;

      for (let j = 0; j < chars.length; j += charsPerLine) {
        const chunk = chars.slice(j, j + charsPerLine);
        const chunkHeight = await measureMarkdownHeight(chunk, opts);

        if (currentHeight + chunkHeight > opts.maxPageHeight && currentPage.length > 0) {
          pages.push(currentPage.trim());
          currentPage = '';
          currentHeight = 0;
        }
        currentPage = currentPage ? currentPage + '\n' + chunk : chunk;
        currentHeight += chunkHeight;
      }
      continue;
    }

    // Try adding this line to current page
    const testPage = currentPage ? currentPage + '\n' + line : line;
    const newHeight = currentHeight + lineHeight;

    if (newHeight > opts.maxPageHeight && currentPage.length > 0) {
      pages.push(currentPage.trim());
      currentPage = line;
      currentHeight = lineHeight;
    } else {
      currentPage = testPage;
      currentHeight = newHeight;
    }
  }

  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  return pages.length > 0 ? pages : [para];
}

/**
 * Synchronous version using line-count estimation.
 * Less accurate than the async DOM version but works without DOM access.
 * Uses actual card CSS parameters: 42px font, 1.7 line-height, ~23 chars/line.
 */
export function splitMarkdownByHeightSync(
  markdown: string,
  maxPageHeight: number = 1340
): string[] {
  if (!markdown.trim()) return [''];

  const FONT_SIZE = 42;
  const LINE_HEIGHT = 1.7;
  const LINE_HEIGHT_PX = FONT_SIZE * LINE_HEIGHT; // 71.4px
  const CONTENT_WIDTH = 1080 - 50 * 2; // 980px
  const CHARS_PER_LINE = Math.floor(CONTENT_WIDTH / FONT_SIZE); // ~23 chars

  // Split by paragraph boundaries
  const rawParts = markdown.split(/(\n{2,})/);
  const paragraphs: string[] = [];
  let pending = '';

  for (const part of rawParts) {
    if (part.match(/^\n{2,}$/)) {
      pending += part;
    } else {
      const combined = pending + part;
      if (combined.trim()) paragraphs.push(combined.trim());
      pending = '';
    }
  }
  if (pending.trim()) paragraphs.push(pending.trim());
  if (paragraphs.length === 0) return [''];

  // Estimate height per paragraph
  const pages: string[] = [];
  let currentPage = '';
  let currentHeight = 0;

  for (const para of paragraphs) {
    if (/^\s*[-*_]{3,}\s*$/.test(para)) {
      if (currentPage.trim()) pages.push(currentPage.trim());
      currentPage = '';
      currentHeight = 0;
      continue;
    }

    // Estimate paragraph height based on content
    let paraHeight = 0;
    const lines = para.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        paraHeight += LINE_HEIGHT_PX * 0.5;
      } else if (/^#{1,3}\s/.test(trimmed)) {
        // Heading: takes more space
        const chars = trimmed.replace(/^#+\s/, '').length;
        const lines_ = Math.ceil(chars / CHARS_PER_LINE);
        paraHeight += LINE_HEIGHT_PX * (lines_ + 1.5);
      } else if (/^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
        // List item
        const content = trimmed.replace(/^[-*+]\s|^\d+\.\s/, '');
        const lines_ = Math.ceil(content.length / CHARS_PER_LINE);
        paraHeight += LINE_HEIGHT_PX * lines_;
      } else {
        // Regular paragraph
        const lines_ = Math.ceil(trimmed.length / CHARS_PER_LINE);
        paraHeight += LINE_HEIGHT_PX * lines_;
      }
    }

    const newHeight = currentHeight + paraHeight;
    if (newHeight > maxPageHeight && currentPage.length > 0) {
      pages.push(currentPage.trim());
      currentPage = para;
      currentHeight = paraHeight;
    } else {
      currentPage = currentPage ? currentPage + '\n\n' + para : para;
      currentHeight = newHeight;
    }
  }

  if (currentPage.trim()) pages.push(currentPage.trim());
  return pages.length > 0 ? pages : [''];
}

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

  // 4. Scope CSS variables to prevent global pollution
  // Prefix all CSS variables to avoid conflicts with globals.css
  const scopeCss = (css: string) => {
    return css
      // Wrap :root in a class to scope variables
      .replace(/:root\s*\{/g, '.card-root {')
      // Prefix CSS variables
      .replace(/--([a-z-]+):/g, '--card-$1:')
      // Scope element selectors to .card- prefix
      .replace(/^body\s*\{/gm, '.card-body {')
      .replace(/^\*\s*\{/gm, '.card-root * {');
  };

  const scopedBaseCss = scopeCss(baseCss);
  const scopedThemeCss = scopeCss(themeCss);

  // 5. Assemble final HTML - inject CSS into the style tag content
  const combinedCss = scopedBaseCss + '\n' + scopedThemeCss;

  // Replace the style tag content (everything between <style> and </style>)
  const htmlWithCss = template.replace(
    /<style>([\s\S]*?)<\/style>/,
    `<style>$1\n${combinedCss}</style>`
  );

  return htmlWithCss
    .replace('{{CONTENT}}', htmlContent)
    .replace('{{PAGE_NUMBER}}', ''); // No page number for single page
}

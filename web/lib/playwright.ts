import { chromium } from 'playwright';
import { marked } from 'marked';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface RenderOptions {
  content: string;
  theme?: string;
  mode?: 'separator' | 'auto-fit' | 'auto-split' | 'dynamic';
  width?: number;
  height?: number;
  dpr?: number;
}

export interface RenderResult {
  buffer: Buffer;
  filename: string;
}

/**
 * 启动浏览器（带 Vercel Serverless 兼容配置和重试机制）
 */
async function launchBrowserWithRetry(retries = 3): Promise<ReturnType<typeof chromium.launch>> {
  for (let i = 0; i < retries; i++) {
    try {
      const browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--single-process', // Vercel Serverless 关键参数
        ],
      });
      return browser;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Browser launch attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Failed to launch browser after all retries');
}

// 可用主题列表
export const AVAILABLE_THEMES = [
  'default',
  'playful-geometric',
  'neo-brutalism',
  'botanical',
  'professional',
  'retro',
  'terminal',
  'sketch'
];

/**
 * 渲染 Markdown 为小红书图片卡片
 */
export async function renderMarkdown(options: RenderOptions): Promise<RenderResult[]> {
  const {
    content,
    theme = 'default',
    mode = 'separator',
    width = 1080,
    height = 1440,
    dpr = 2
  } = options;

  // 验证主题
  if (!AVAILABLE_THEMES.includes(theme)) {
    throw new Error(`Invalid theme: ${theme}. Available themes: ${AVAILABLE_THEMES.join(', ')}`);
  }

  // 读取模板文件
  const templatesDir = path.join(process.cwd(), 'public', 'templates');
  const cardTemplate = await fs.readFile(path.join(templatesDir, 'card.html'), 'utf-8');
  const coverTemplate = await fs.readFile(path.join(templatesDir, 'cover.html'), 'utf-8');
  const themeCss = await fs.readFile(path.join(templatesDir, '..', 'themes', `${theme}.css`), 'utf-8');
  const stylesCss = await fs.readFile(path.join(templatesDir, 'styles.css'), 'utf-8');

  // 解析 Markdown 内容会在后续的渲染中使用

  // 根据模式分页
  const parts = splitContent(content, mode);

  // 启动浏览器（Vercel Serverless 兼容配置）
  const browser = await launchBrowserWithRetry();

  const context = await browser.newContext({
    viewport: { width, height: height * dpr },
    deviceScaleFactor: dpr,
  });

  const page = await context.newPage();
  const results: RenderResult[] = [];

  try {
    // 渲染封面
    if (parts.length > 1) {
      const coverHtml = coverTemplate
        .replace('{{THEME_CSS}}', themeCss)
        .replace('{{STYLES_CSS}}', stylesCss)
        .replace('{{CONTENT}}', extractTitle(content));

      await page.setContent(coverHtml);
      await page.waitForLoadState('networkidle');

      const coverBuffer = await page.screenshot({
        type: 'png',
        fullPage: true,
      });

      results.push({
        buffer: Buffer.from(coverBuffer),
        filename: 'cover.png'
      });
    }

    // 渲染内容卡片
    for (let i = 0; i < parts.length; i++) {
      const partHtml = cardTemplate
        .replace('{{THEME_CSS}}', themeCss)
        .replace('{{STYLES_CSS}}', stylesCss)
        .replace('{{CONTENT}}', await marked(parts[i]));

      await page.setContent(partHtml);
      await page.waitForLoadState('networkidle');

      const cardBuffer = await page.screenshot({
        type: 'png',
        fullPage: true,
      });

      results.push({
        buffer: Buffer.from(cardBuffer),
        filename: `card_${i + 1}.png`
      });
    }
  } finally {
    await browser.close();
  }

  return results;
}

/**
 * 根据模式拆分内容
 */
function splitContent(content: string, mode: string): string[] {
  if (mode === 'separator') {
    // 按 --- 分隔符拆分
    const parts = content.split(/\n---+\n/);
    return parts.filter(p => p.trim());
  } else if (mode === 'auto-split') {
    // 简单的自动分页：按段落拆分，每张卡片最多5个段落
    const paragraphs = content.split(/\n\n+/);
    const parts: string[] = [];
    let currentPart = '';

    for (const para of paragraphs) {
      if (currentPart.split(/\n\n+/).length >= 5) {
        parts.push(currentPart.trim());
        currentPart = para;
      } else {
        currentPart += (currentPart ? '\n\n' : '') + para;
      }
    }

    if (currentPart.trim()) {
      parts.push(currentPart.trim());
    }

    return parts;
  } else {
    // 其他模式暂不实现，返回整个内容
    return [content];
  }
}

/**
 * 从 Markdown 内容中提取标题
 */
function extractTitle(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^#\s+(.+)$/);
    if (match) {
      return match[1];
    }
  }
  return '小红书笔记';
}

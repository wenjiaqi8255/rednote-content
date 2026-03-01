import { NextRequest, NextResponse } from 'next/server';
import { renderMarkdown } from '@/lib/playwright';
import { uploadToGitHub } from '@/lib/github';

export const runtime = 'nodejs';
export const maxDuration = 60; // Vercel Pro 计划支持

/**
 * POST /api/render
 *
 * 请求体:
 * {
 *   "markdown": string,
 *   "theme": string (optional),
 *   "mode": string (optional, default: "separator"),
 *   "title": string (optional)
 * }
 *
 * 响应:
 * {
 *   "success": true,
 *   "urls": {
 *     "markdownUrl": string,
 *     "imageUrls": string[],
 *     "folderUrl": string
 *   },
 *   "count": number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { markdown, theme, mode, title } = body;

    // 验证必填字段
    if (!markdown) {
      return NextResponse.json(
        { error: 'Missing required field: markdown' },
        { status: 400 }
      );
    }

    // 生成文件名（使用标题或日期）
    const date = new Date().toISOString().split('T')[0];
    const safeTitle = title
      ?.trim()
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')
      .toLowerCase()
      .substring(0, 50) || `note-${Date.now()}`;
    const baseFilename = `${date}-${safeTitle}`;

    // 渲染图片
    console.log('Starting render...');
    const images = await renderMarkdown({
      content: markdown,
      theme: theme || 'default',
      mode: mode || 'separator',
      width: 1080,
      height: 1440,
      dpr: 2,
    });

    console.log(`Rendered ${images.length} images`);

    // 上传到 GitHub
    console.log('Uploading to GitHub...');
    const urls = await uploadToGitHub({
      markdown,
      images,
      baseFilename,
      theme: theme || 'default',
      mode: mode || 'separator',
    });

    console.log('Upload complete');

    return NextResponse.json({
      success: true,
      urls,
      count: images.length,
    });

  } catch (error) {
    console.error('Render error:', error);
    return NextResponse.json(
      {
        error: 'Failed to render markdown',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

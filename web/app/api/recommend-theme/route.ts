import { NextRequest, NextResponse } from 'next/server';
import { recommendTheme } from '@/lib/theme-recommender';

/**
 * POST /api/recommend-theme
 *
 * 请求体:
 * {
 *   "content": string
 * }
 *
 * 响应:
 * {
 *   "theme": string,
 *   "confidence": number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Missing required field: content' },
        { status: 400 }
      );
    }

    const recommendedTheme = recommendTheme(content);

    return NextResponse.json({
      theme: recommendedTheme,
    });

  } catch (error) {
    console.error('Theme recommendation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to recommend theme',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

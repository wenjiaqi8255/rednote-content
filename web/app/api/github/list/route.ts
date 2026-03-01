import { NextRequest, NextResponse } from 'next/server';
import { listPosts } from '@/lib/github';

/**
 * GET /api/github/list
 *
 * 响应:
 * {
 *   "posts": Array<{
 *     "title": string,
 *     "folderUrl": string,
 *     "theme": string,
 *     "mode": string,
 *     "createdAt": string,
 *     "imageCount": number
 *   }>
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const posts = await listPosts();

    return NextResponse.json({
      posts,
    });

  } catch (error) {
    console.error('List posts error:', error);
    return NextResponse.json(
      {
        error: 'Failed to list posts',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

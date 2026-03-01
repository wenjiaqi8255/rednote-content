import { Octokit } from 'octokit';
import { RenderResult } from './playwright';

export interface GitHubUploadOptions {
  markdown: string;
  images: RenderResult[];
  baseFilename: string;
  theme: string;
  mode: string;
}

export interface GitHubUploadResult {
  markdownUrl: string;
  imageUrls: string[];
  folderUrl: string;
}

/**
 * GitHub API 客户端 - 上传文件到 GitHub 仓库
 */
export async function uploadToGitHub(options: GitHubUploadOptions): Promise<GitHubUploadResult> {
  const {
    markdown,
    images,
    baseFilename,
    theme,
    mode
  } = options;

  // 从环境变量获取配置
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || '';
  const repo = process.env.GITHUB_REPO || '';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }

  if (!owner || !repo) {
    throw new Error('GITHUB_OWNER and GITHUB_REPO environment variables must be set');
  }

  const octokit = new Octokit({ auth: token });

  try {
    // 1. 获取最新 commit 的 SHA
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    const latestCommitSha = refData.object.sha;
    const { data: commitData } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSha,
    });
    const treeSha = commitData.tree.sha;

    // 2. 创建 blobs
    const blobs: { path: string; sha: string }[] = [];

    // 上传 Markdown
    const markdownBlob = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(markdown).toString('base64'),
      encoding: 'base64',
    });
    blobs.push({
      path: `posts/${baseFilename}.md`,
      sha: markdownBlob.data.sha,
    });

    // 上传图片
    const imageUrls: string[] = [];
    for (const image of images) {
      const imageBlob = await octokit.rest.git.createBlob({
        owner,
        repo,
        content: image.buffer.toString('base64'),
        encoding: 'base64',
      });
      blobs.push({
        path: `posts/${baseFilename}/${image.filename}`,
        sha: imageBlob.data.sha,
      });
      imageUrls.push(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/posts/${baseFilename}/${image.filename}`
      );
    }

    // 上传元数据
    const metadata = {
      title: baseFilename,
      theme,
      mode,
      createdAt: new Date().toISOString(),
      imageCount: images.length,
    };
    const metadataBlob = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(JSON.stringify(metadata, null, 2)).toString('base64'),
      encoding: 'base64',
    });
    blobs.push({
      path: `posts/${baseFilename}/metadata.json`,
      sha: metadataBlob.data.sha,
    });

    // 3. 创建 tree
    const { data: newTree } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: treeSha,
      tree: blobs.map((blob) => ({
        path: blob.path,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blob.sha,
      })),
    });

    // 4. 创建 commit
    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: `Add post: ${baseFilename}`,
      tree: newTree.sha,
      parents: [latestCommitSha],
    });

    // 5. 更新分支引用
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    return {
      markdownUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/posts/${baseFilename}.md`,
      imageUrls,
      folderUrl: `https://github.com/${owner}/${repo}/tree/${branch}/posts/${baseFilename}`,
    };

  } catch (error) {
    console.error('GitHub upload error:', error);
    throw new Error(`Failed to upload to GitHub: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 列出所有已发布的笔记
 */
export async function listPosts(): Promise<any[]> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || '';
  const repo = process.env.GITHUB_REPO || '';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }

  const octokit = new Octokit({ auth: token });

  try {
    // 获取 posts 目录的内容
    const { data: contents } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'posts',
      ref: branch,
    });

    if (!Array.isArray(contents)) {
      return [];
    }

    // 过滤出文件夹并获取其元数据
    const posts = [];
    for (const item of contents) {
      if (item.type === 'dir') {
        try {
          const { data: metadataContent } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: `posts/${item.name}/metadata.json`,
            ref: branch,
          });

          if ('content' in metadataContent) {
            const metadata = JSON.parse(
              Buffer.from(metadataContent.content, 'base64').toString('utf-8')
            );
            posts.push({
              title: item.name,
              folderUrl: `https://github.com/${owner}/${repo}/tree/${branch}/posts/${item.name}`,
              ...metadata,
            });
          }
        } catch (error) {
          // 忽略没有元数据的文件夹
        }
      }
    }

    return posts.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  } catch (error) {
    console.error('GitHub list error:', error);
    throw new Error(`Failed to list posts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

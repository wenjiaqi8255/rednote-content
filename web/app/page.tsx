'use client';

import { useState } from 'react';
import Form from '@/components/Form';

interface RenderResult {
  success: boolean;
  urls: {
    markdownUrl: string;
    imageUrls: string[];
    folderUrl: string;
  };
  count: number;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RenderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    markdown: string;
    theme: string;
    mode: string;
    title: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to render');
      }

      const renderResult = await response.json();
      setResult(renderResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            小红书内容生成器
          </h1>
          <p className="text-lg text-gray-600">
            粘贴 Markdown 内容，一键生成小红书风格图片卡片
          </p>
        </div>

        {/* 主表单 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <Form onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* 加载状态 */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <p className="text-lg text-gray-600">正在生成图片，请稍候...</p>
            <p className="text-sm text-gray-500 mt-2">这可能需要 20-30 秒</p>
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-2">生成失败</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 结果展示 */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🎉 生成成功！
            </h2>

            <div className="space-y-6">
              {/* 图片预览 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  生成的图片（共 {result.count} 张）
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {result.urls.imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Card ${index + 1}`}
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                      <a
                        href={url}
                        download={`card_${index + 1}.png`}
                        className="absolute bottom-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700"
                      >
                        下载
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub 链接 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  已保存到 GitHub
                </h3>
                <div className="space-y-2">
                  <a
                    href={result.urls.folderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-purple-600 hover:text-purple-800"
                  >
                    📁 查看文件夹
                  </a>
                  <a
                    href={result.urls.markdownUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-purple-600 hover:text-purple-800"
                  >
                    📄 查看 Markdown
                  </a>
                </div>
              </div>

              {/* 重新生成 */}
              <button
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300"
              >
                生成新的内容
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

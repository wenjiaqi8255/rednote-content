'use client';

import { useState } from 'react';
import Form from '@/components/Form';
import CardPreview from '@/components/CardPreview';
import type { Theme } from '@/lib/card-templates';

interface FormData {
  markdown: string;
  theme: string;
  mode: string;
  title: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (data: FormData) => {
    setFormData(data);
    setShowPreview(true);
  };

  const handleBack = () => {
    setShowPreview(false);
    setFormData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            小红书内容生成器
          </h1>
          <p className="text-lg text-gray-600">
            粘贴 Markdown 内容，实时预览并生成小红书风格图片卡片
          </p>
          <p className="text-sm text-purple-600 mt-2 font-semibold">
            ✨ 客户端渲染 - 无需等待服务器，即时生成！
          </p>
        </div>

        {!showPreview ? (
          /* 表单模式 */
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Form onSubmit={handleSubmit} isLoading={false} />
          </div>
        ) : (
          /* 预览模式 */
          <div className="space-y-6">
            {/* 返回按钮 */}
            <button
              onClick={handleBack}
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300"
            >
              ← 返回编辑
            </button>

            {/* 卡片预览 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📱 实时预览
              </h2>

              {formData && (
                <div className="flex justify-center">
                  <CardPreview
                    markdown={formData.markdown}
                    theme={formData.theme as Theme}
                    mode={formData.mode}
                  />
                </div>
              )}
            </div>

            {/* 使用说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                💡 使用说明
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-700">
                <li>点击 "📸 Capture Image" 按钮生成图片</li>
                <li>点击 "⬇️ Download" 按钮下载图片到本地</li>
                <li>图片会自动保存为 PNG 格式，高清 2x DPR</li>
                <li>可以随时修改内容并重新生成</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

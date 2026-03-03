'use client';

import { useState } from 'react';
import { recommendTheme } from '@/lib/theme-recommender';

interface FormProps {
  onSubmit: (data: {
    markdown: string;
    theme: string;
    mode: string;
    title: string;
  }) => void;
  isLoading: boolean;
  defaultValue?: {
    title?: string;
    markdown?: string;
    theme?: string;
    mode?: string;
  };
}

export default function Form({ onSubmit, isLoading, defaultValue }: FormProps) {
  const [markdown, setMarkdown] = useState(defaultValue?.markdown || '');
  const [theme, setTheme] = useState(defaultValue?.theme || 'default');
  const [mode, setMode] = useState(defaultValue?.mode || 'separator');
  const [title, setTitle] = useState(defaultValue?.title || '');
  const [recommendedTheme, setRecommendedTheme] = useState<string | null>(null);

  const handleMarkdownChange = (value: string) => {
    setMarkdown(value);
    // 自动推荐主题
    if (value.length > 10) {
      const recommended = recommendTheme(value);
      setRecommendedTheme(recommended);
      if (theme === 'default') {
        setTheme(recommended);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!markdown.trim()) return;

    onSubmit({
      markdown,
      theme,
      mode,
      title: title || '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 标题输入 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          标题（可选）
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例如：效率工具集锦"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-base"
        />
      </div>

      {/* Markdown 输入 */}
      <div>
        <label htmlFor="markdown" className="block text-sm font-medium text-gray-700 mb-2">
          Markdown 内容 *
        </label>
        <textarea
          id="markdown"
          value={markdown}
          onChange={(e) => handleMarkdownChange(e.target.value)}
          placeholder="# 标题&#10;&#10;这是正文内容...&#10;&#10;---&#10;&#10;这是第二张卡片"
          required
          rows={12}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-base font-mono"
          style={{ fontSize: '16px' }} // 防止 iOS 自动缩放
        />
        {recommendedTheme && recommendedTheme !== 'default' && (
          <p className="mt-2 text-sm text-gray-600">
            💡 推荐主题：<strong>{recommendedTheme}</strong>
          </p>
        )}
      </div>

      {/* 主题选择 */}
      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
          主题风格
        </label>
        <select
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-base"
        >
          <option value="default">默认</option>
          <option value="playful-geometric">趣味几何</option>
          <option value="neo-brutalism">新野兽派</option>
          <option value="botanical">植物</option>
          <option value="professional">商务</option>
          <option value="retro">复古</option>
          <option value="terminal">终端</option>
          <option value="sketch">手绘</option>
        </select>
      </div>

      {/* 分页模式 */}
      <div>
        <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-2">
          分页模式
        </label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-base"
        >
          <option value="separator">单卡片模式（完整内容）</option>
          <option value="auto-split">多卡片模式（自动切分）</option>
        </select>
      </div>

      {/* 提交按钮 - Minimal gray */}
      <button
        type="submit"
        disabled={isLoading || !markdown.trim()}
        className="w-full bg-gray-900 text-white font-semibold py-4 px-6 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg transition-colors"
      >
        {isLoading ? '生成中...' : '生成小红书卡片'}
      </button>
    </form>
  );
}

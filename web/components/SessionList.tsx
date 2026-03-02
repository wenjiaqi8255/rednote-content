'use client';

import { useStorageContext } from '@/contexts/StorageContext';
import type { Session } from '@/types/session';

interface SessionListProps {
  onCreateNew?: () => void;
}

export default function SessionList({ onCreateNew }: SessionListProps) {
  const {
    sessions,
    currentSession,
    createSession,
    deleteSession,
    selectSession,
  } = useStorageContext();

  const handleCreateNew = () => {
    // Create a new default session
    createSession({
      title: '新卡片',
      markdown: '',
      theme: 'default',
      mode: 'separator',
    });

    if (onCreateNew) {
      onCreateNew();
    }
  };

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); // Prevent triggering selectSession

    if (confirm('确定要删除这个会话吗？')) {
      deleteSession(sessionId);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 360000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;

    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-3">我的会话</h2>
        <button
          onClick={handleCreateNew}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all touch-manipulation"
          style={{ minHeight: '48px' }}
        >
          + 创建新会话
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-4">
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg mb-2">暂无会话</p>
            <p className="text-gray-400 text-sm">点击上方按钮创建新会话</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => {
              const isCurrent = session.id === currentSession?.id;

              return (
                <div
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={`group relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-purple-500 bg-purple-100 shadow-md'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  {/* Session Title */}
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className={`font-semibold flex-1 ${
                        isCurrent ? 'text-purple-900' : 'text-gray-900'
                      }`}
                    >
                      {session.title || '未命名会话'}
                    </h3>
                    <button
                      onClick={(e) => handleDelete(e, session.id)}
                      aria-label="删除"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 rounded"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Session Meta */}
                  <div className="flex items-center gap-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        isCurrent
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {session.theme}
                    </span>
                    <span className="text-gray-400">
                      {formatDate(session.updatedAt)}
                    </span>
                  </div>

                  {/* Has Image Indicator */}
                  {session.imageData && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>已生成图片</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

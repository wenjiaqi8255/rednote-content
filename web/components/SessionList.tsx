'use client';

import { useRouter } from 'next/navigation';
import { useStorageContext } from '@/contexts/StorageContext';

interface SessionListProps {
  onCreateNew?: () => void;
  /** If true, clicking a session navigates to /edit/[id]. If false, just selects the session. */
  navigateOnSelect?: boolean;
}

export default function SessionList({ onCreateNew, navigateOnSelect = false }: SessionListProps) {
  const router = useRouter();
  const {
    sessions,
    currentSession,
    isLoading,
    createSession,
    deleteSession,
    selectSession,
  } = useStorageContext();

  // Show loading state while data is being loaded
  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header - Notion-style with bottom line */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            我的作品
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            加载中...
          </p>

          <button
            disabled
            className="btn btn-primary w-full shadow-sm opacity-50 cursor-not-allowed"
            style={{ minHeight: '48px' }}
          >
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            创建新卡片
          </button>
        </div>

        {/* Loading indicator */}
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        </div>
      </div>
    );
  }

  const handleCreateNew = () => {
    const newSessionId = createSession({
      title: '新卡片',
      markdown: '',
      theme: 'default',
      mode: 'separator',
    });

    if (onCreateNew) {
      onCreateNew();
    }

    // Navigate to edit page for the new session if navigation is enabled
    if (navigateOnSelect && newSessionId) {
      router.push(`/edit/${newSessionId}`);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    // Don't call selectSession here - let the target page handle it on mount
    // This prevents the current session from being overwritten while editing

    // Navigate to edit page if navigation is enabled
    if (navigateOnSelect) {
      router.push(`/edit/${sessionId}`);
    }
    // If navigateOnSelect is false (e.g., home page), still update current session
    // so the indicator shows correctly
    else {
      selectSession(sessionId);
    }
  };

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();

    // Custom confirmation dialog (better UX than window.confirm)
    if (window.confirm('确定要删除这个会话吗？此操作无法撤销。')) {
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
    <div className="h-full flex flex-col bg-white">
      {/* Header - Notion-style with bottom line */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          我的作品
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          {sessions.length} 个卡片
        </p>

        <button
          onClick={handleCreateNew}
          className="btn btn-primary w-full shadow-sm hover:shadow-md"
          style={{ minHeight: '48px' }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          创建新卡片
        </button>
      </div>

      {/* Session List - Clean, Minimal with lines */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {sessions.length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="text-6xl mb-5 opacity-30">⋄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              开始创作
            </h3>
            <p className="text-gray-500 text-sm">
              点击上方按钮创建你的第一张卡片
            </p>
          </div>
        ) : (
          <div>
            {sessions.map((session, index) => {
              const isCurrent = session.id === currentSession?.id;

              return (
                <div key={session.id}>
                  <div
                    onClick={() => handleSelectSession(session.id)}
                    className={`
                      group relative p-4 transition-all cursor-pointer card-hover
                      ${isCurrent
                        ? 'bg-gray-50'
                        : 'bg-white hover:bg-gray-50'
                      }
                      animate-fade-in-up
                    `}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Session Title */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold flex-1 pr-2 text-gray-900">
                        {session.title || '未命名卡片'}
                      </h3>

                      {/* Delete Button - Always visible */}
                      <button
                        onClick={(e) => handleDelete(e, session.id)}
                        aria-label="删除"
                        className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                        style={{ minWidth: '44px', minHeight: '44px' }}
                      >
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Session Meta - Minimal Tags */}
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`px-2 py-1 rounded-md font-medium uppercase tracking-wide ${
                          isCurrent
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {session.theme}
                      </span>
                      <span className="text-gray-400">
                        {formatDate(session.updatedAt)}
                      </span>
                    </div>

                    {/* Has Image Indicator - Subtle */}
                    {session.imageData && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-medium">已生成</span>
                      </div>
                    )}
                  </div>

                  {/* Line between cards - Notion style */}
                  {index < sessions.length - 1 && (
                    <div className="border-b border-gray-100" />
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

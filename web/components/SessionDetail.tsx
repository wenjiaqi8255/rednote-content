'use client';

import { useStorageContext } from '@/contexts/StorageContext';
import Form from './Form';
import CardPreview from './CardPreview';

export default function SessionDetail() {
  const { currentSession, updateCurrentSession } = useStorageContext();

  if (!currentSession) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-30">⋄</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            请选择或创建一个会话
          </h3>
          <p className="text-gray-500">
            从左侧列表选择现有会话，或创建新会话开始
          </p>
        </div>
      </div>
    );
  }

  const handleFormSubmit = (data: any) => {
    updateCurrentSession(data);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header - Clean with bottom line */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          {currentSession.title || '未命名会话'}
        </h2>
        <p className="text-sm text-gray-500">
          最后更新: {new Date(currentSession.updatedAt).toLocaleString('zh-CN')}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Form Section */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            编辑内容
          </h3>
          <Form
            onSubmit={handleFormSubmit}
            isLoading={false}
            defaultValue={{
              title: currentSession.title,
              markdown: currentSession.markdown,
              theme: currentSession.theme,
              mode: currentSession.mode,
            }}
          />
        </div>

        {/* Preview Section */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            卡片预览
          </h3>
          <CardPreview
            markdown={currentSession.markdown}
            theme={currentSession.theme as any}
            mode={currentSession.mode}
            sessionId={currentSession.id}
          />
        </div>

        {/* Saved Image Display */}
        {currentSession.imageData && (
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3">
              已保存的图片
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <img
                src={currentSession.imageData}
                alt="Saved card"
                className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

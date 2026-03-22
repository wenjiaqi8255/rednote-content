'use client';

import { useState } from 'react';
import SessionList from '@/components/SessionList';
import MobileHeader from '@/components/MobileHeader';
import { ResponsiveSidebar } from '@/components/ResponsiveSidebar';
import { StorageProvider, useStorageContext } from '@/contexts/StorageContext';

/**
 * Home Page - Pure Session List
 *
 * Unified experience for mobile and desktop:
 * - Shows session list in sidebar (collapsible on mobile, always visible on desktop)
 * - Main area shows welcome message / instructions
 * - Clicking a session navigates to /edit/[id]
 *
 * Flow: / (list) → /edit/[id] (edit) → /preview/[id] (preview)
 */
function HomeContent() {
  const { currentSession } = useStorageContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader
        isMenuOpen={isMobileMenuOpen}
        onToggleMenu={handleToggleMenu}
        currentTitle={currentSession?.title}
      />

      <div className="flex">
        {/* Responsive Sidebar */}
        <ResponsiveSidebar isOpen={isMobileMenuOpen} onClose={handleCloseMenu}>
          <SessionList
            onCreateNew={handleCloseMenu}
            navigateOnSelect={true}
          />
        </ResponsiveSidebar>

        {/* Main Content Area - Welcome/Instructions */}
        <main
          data-testid="main-content"
          className="flex-1 min-w-0 p-4 md:p-6"
        >
          <div className="max-w-md mx-auto md:max-w-4xl">
            {/* Welcome message when no session is selected */}
            <div className="text-center py-20">
              <div className="text-6xl mb-5 opacity-30">✨</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                欢迎使用小红书卡片生成器
              </h2>
              <p className="text-gray-500 mb-8">
                从左侧选择一个会话开始编辑，或创建新卡片
              </p>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-medium">1</span>
                  <span>在左侧创建或选择卡片</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-medium">2</span>
                  <span>编辑标题和正文内容</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-medium">3</span>
                  <span>点击"一键排版"预览和生成图片</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <StorageProvider>
      <HomeContent />
    </StorageProvider>
  );
}

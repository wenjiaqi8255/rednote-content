/**
 * Unified Preview Page
 *
 * Works for both mobile and desktop with responsive layout:
 * - Mobile: Full-screen preview with collapsible sidebar
 * - Desktop: Sidebar always visible + preview area
 *
 * Route: /preview/[sessionId]
 */

'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { StorageProvider, useStorageContext } from '@/contexts/StorageContext';
import { ResponsiveSidebar } from '@/components/ResponsiveSidebar';
import SessionList from '@/components/SessionList';
import { ThemeSelector } from '@/components/mobile/ThemeSelector';
import { SaveButton } from '@/components/mobile/SaveButton';
import { generateXHSCard, type Theme } from '@/lib/xhs-renderer';
import Link from 'next/link';

/**
 * Mobile Header
 */
function MobileHeader({ sessionId, onMenuToggle }: { sessionId: string; onMenuToggle: () => void }) {
  return (
    <header
      className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30"
      style={{ height: '56px' }}
    >
      {/* Menu Button */}
      <button
        onClick={onMenuToggle}
        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        aria-label="Toggle menu"
      >
        <Menu width={20} height={20} />
      </button>

      {/* Title */}
      <h1 className="text-lg font-semibold text-gray-900">
        预览
      </h1>

      {/* Edit Link */}
      <Link
        href={`/edit/${sessionId}`}
        className="text-red-600 text-sm font-medium"
      >
        编辑
      </Link>
    </header>
  );
}

/**
 * Desktop Header
 */
function DesktopHeader({ sessionId }: { sessionId: string }) {
  return (
    <header
      className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200"
    >
      <h1 className="text-2xl font-semibold text-gray-900">
        预览和生成
      </h1>

      <Link
        href={`/edit/${sessionId}`}
        className="px-6 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
      >
        返回编辑
      </Link>
    </header>
  );
}

/**
 * Card Preview Component
 */
function CardPreview({ sessionId, theme }: { sessionId: string; theme: Theme }) {
  const { sessions } = useStorageContext();
  const session = sessions.find((s) => s.id === sessionId);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        未找到会话
      </div>
    );
  }

  const cardHTML = generateXHSCard(session.markdown, theme);

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 h-96 flex flex-col gap-5 relative"
    >
      {/* Page indicator */}
      <div className="absolute top-5 right-5 text-sm text-gray-400">
        ...
      </div>

      {/* Card content */}
      <div
        dangerouslySetInnerHTML={{ __html: cardHTML }}
        className="flex-1 overflow-hidden"
      />
    </div>
  );
}

/**
 * Page Indicators
 */
function PageIndicators({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: totalPages }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            index === currentPage ? 'bg-red-600' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Unified Preview Page Content
 */
function UnifiedPreviewPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = React.use(params);
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const themes: Theme[] = [
    'default',
    'neo-brutalism',
    'terminal',
    'botanical',
    'playful-geometric',
    'retro',
    'professional',
    'sketch',
  ];

  const handleCreateNew = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader
        sessionId={sessionId}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Desktop Header */}
      <DesktopHeader sessionId={sessionId} />

      <div className="flex">
        {/* Responsive Sidebar */}
        <ResponsiveSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
          <SessionList onCreateNew={handleCreateNew} />
        </ResponsiveSidebar>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="max-w-md mx-auto md:max-w-4xl bg-white min-h-screen">
            <div className="p-4 md:p-6 flex flex-col gap-4">
              {/* Preview Card */}
              <CardPreview sessionId={sessionId} theme={currentTheme} />

              {/* Page Indicators */}
              <PageIndicators currentPage={0} totalPages={3} />

              {/* Theme Selector */}
              <ThemeSelector
                currentTheme={currentTheme}
                onThemeChange={setCurrentTheme}
                themes={themes}
              />

              {/* Save Button */}
              <div className="pt-4 pb-8 md:pb-12">
                <SaveButton
                  sessionId={sessionId}
                  title={sessionId}
                  onGenerateImage={async () => {
                    // Placeholder implementation
                    return 'data:image/png;base64,mock-image';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnifiedPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <StorageProvider>
      <UnifiedPreviewPageContent params={params} />
    </StorageProvider>
  );
}

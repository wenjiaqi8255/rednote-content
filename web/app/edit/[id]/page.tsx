/**
 * Unified Edit Page
 *
 * Works for both mobile and desktop with responsive layout:
 * - Mobile: Full-screen editor with collapsible sidebar (menu button)
 * - Desktop: Sidebar always visible + editor area
 *
 * Route: /edit/[sessionId]
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { StorageProvider, useStorageContext } from '@/contexts/StorageContext';
import { ResponsiveSidebar } from '@/components/ResponsiveSidebar';
import SessionList from '@/components/SessionList';
import { MarkdownInput } from '@/components/mobile/MarkdownInput';
import Link from 'next/link';

/**
 * Mobile Header with Menu Button
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
        写长文
      </h1>

      {/* Format Button */}
      <Link
        href={`/preview/${sessionId}`}
        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
      >
        一键排版
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
        编辑卡片
      </h1>

      <Link
        href={`/preview/${sessionId}`}
        className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
      >
        预览和生成
      </Link>
    </header>
  );
}

/**
 * Unified Edit Page Content
 */
function UnifiedEditPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = React.use(params);
  const { selectSession } = useStorageContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Select this session as current when page loads
  useEffect(() => {
    selectSession(sessionId);
  }, [sessionId, selectSession]);

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
            <MarkdownInput sessionId={sessionId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnifiedEditPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <StorageProvider>
      <UnifiedEditPageContent params={params} />
    </StorageProvider>
  );
}

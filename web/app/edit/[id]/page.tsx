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
import { useStorageContext } from '@/contexts/StorageContext';
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
      className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-[51]"
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
      <h2 className="text-lg font-semibold text-gray-900">
        编辑卡片
      </h2>

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
 *
 * Layout structure:
 * - Mobile: MobileHeader (fixed z-[51]) + flex column (sidebar overlay, content below)
 * - Desktop: flex row (sidebar z-40 + content with DesktopHeader)
 */
function UnifiedEditPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = React.use(params);
  const { selectSession, isLoading, currentSession, sessions, createSession } = useStorageContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const hasValidatedRef = React.useRef(false);

  // Select this session as current when page loads (with validation)
  useEffect(() => {
    if (isLoading) return; // Wait for storage to load
    if (hasValidatedRef.current) return; // Only validate once
    hasValidatedRef.current = true;

    const sessionExists = sessions.some(s => s.id === sessionId);

    if (sessionExists) {
      selectSession(sessionId);
    } else {
      // Session doesn't exist in storage
      const newSessionId = createSession({
        title: '新卡片',
        markdown: '',
        theme: 'default',
        mode: 'auto-split',
      });
      router.push(`/edit/${newSessionId}`);
    }
  }, [sessionId, isLoading, sessions, selectSession, createSession, router]);

  const handleCreateNew = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header — fixed above sidebar on mobile, hidden on desktop */}
      <MobileHeader
        sessionId={sessionId}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main layout: flex row on desktop, sidebar overlay on mobile */}
      <div className="flex flex-1 min-h-0">
        {/* Responsive Sidebar */}
        <ResponsiveSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
          <SessionList onCreateNew={handleCreateNew} navigateOnSelect={true} />
        </ResponsiveSidebar>

        {/* Content area — offset by sidebar width on desktop, offset by mobile header on mobile */}
        <div
          className={`
            flex-1 min-w-0 flex flex-col
            ml-0 md:ml-80
            pt-14 md:pt-0
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
          `}
        >
          {/* Desktop Header — only shown on desktop, inside flex column */}
          <div className="hidden md:block">
            <DesktopHeader sessionId={sessionId} />
          </div>

          {/* Editor area */}
          <div className="flex-1 min-h-0">
            <div className="w-full max-w-2xl mx-auto h-full bg-white overflow-x-auto">
              <MarkdownInput sessionId={sessionId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnifiedEditPage({ params }: { params: Promise<{ id: string }> }) {
  return <UnifiedEditPageContent params={params} />;
}

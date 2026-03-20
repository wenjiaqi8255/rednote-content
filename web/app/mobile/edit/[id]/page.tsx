'use client';

/**
 * Mobile Session Editor Page
 *
 * Markdown editor with auto-save functionality.
 * Pencil design specification:
 * - 390px width (mobile frame)
 * - Status bar (62px) + Nav bar (48px) + Content area (scrollable)
 * - Title: Space Grotesk, 22px, 600 weight
 * - Body: Inter, 15px, lineHeight 1.6
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBar } from '@/components/mobile/StatusBar';
import { MobileNavBar } from '@/components/mobile/MobileNavBar';
import { MarkdownInput } from '@/components/mobile/MarkdownInput';
import { StorageProvider, useStorageContext } from '@/contexts/StorageContext';

/**
 * Format Button Component
 */
interface FormatButtonProps {
  sessionId: string;
}

function FormatButton({ sessionId }: FormatButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/mobile/preview/${sessionId}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: '#E42313',
        borderRadius: '16px',
        padding: '6px 12px',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          color: '#FFFFFF',
          fontFamily: 'Inter',
          fontSize: '13px',
          fontWeight: '500',
        }}
      >
        一键排版
      </span>
    </div>
  );
}

/**
 * Mobile Session Editor Page Component
 */
function MobileEditorPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = React.use(params);
  const { selectSession } = useStorageContext();

  // Select this session as current when page loads
  useEffect(() => {
    selectSession(sessionId);
  }, [sessionId, selectSession]);

  return (
    <main
      style={{
        width: '390px',
        height: '844px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {/* Status Bar */}
      <StatusBar time="02:36" />

      {/* Nav Bar */}
      <MobileNavBar
        title="写长文"
        showBack={true}
        rightAction={<FormatButton sessionId={sessionId} />}
        height="inner"
      />

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: '#E8E8E8',
          width: '100%',
        }}
      />

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        <MarkdownInput sessionId={sessionId} />
      </div>
    </main>
  );
}

export default function MobileEditorPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <StorageProvider>
      <MobileEditorPageContent params={params} />
    </StorageProvider>
  );
}

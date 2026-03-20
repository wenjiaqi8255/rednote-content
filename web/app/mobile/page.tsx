/**
 * Mobile Home Page
 *
 * Displays list of sessions with mobile-optimized UI.
 * Pencil design specification:
 * - 390px width (mobile frame)
 * - 844px height (iPhone height)
 * - Status bar (62px) + Nav bar (56px) + Session list (scrollable)
 */

'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { StatusBar } from '@/components/mobile/StatusBar';
import { MobileNavBar } from '@/components/mobile/MobileNavBar';
import { MobileSessionCard } from '@/components/mobile/MobileSessionCard';
import { StorageProvider, useStorageContext } from '@/contexts/StorageContext';

/**
 * Format date string for display (e.g., "今天 14:32", "3月15日")
 */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `今天 ${hours}:${minutes}`;
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

/**
 * Get preview text from markdown (truncated)
 */
function getPreviewText(markdown: string, maxLength = 40): string {
  // Remove markdown syntax
  const plainText = markdown
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\n/g, ' ')
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength) + '...';
}

/**
 * New Session Button Component
 */
function NewSessionButton() {
  const router = useRouter();
  const { createSession } = useStorageContext();

  const handleClick = () => {
    const newSessionId = createSession({
      title: '新会话',
      markdown: '',
      theme: 'default',
      mode: 'edit',
    });

    router.push(`/mobile/edit/${newSessionId}`);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: '#E42313',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
      }}
      >
        <Plus width={18} height={18} color="#FFFFFF" />
    </button>
  );
}

/**
 * Session List Component
 */
function SessionList() {
  const { sessions, selectSession } = useStorageContext();
  const router = useRouter();

  const handleCardClick = (sessionId: string) => {
    selectSession(sessionId);
    router.push(`/mobile/edit/${sessionId}`);
  };

  if (sessions.length === 0) {
    return (
      <div
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: '#7A7A7A',
          fontFamily: 'Inter',
          fontSize: '14px',
        }}
      >
        还没有会话，点击右上角创建新会话
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {sessions.map((session, index) => (
        <MobileSessionCard
          key={session.id}
          id={session.id}
          title={session.title}
          preview={getPreviewText(session.markdown)}
          date={formatDate(session.updatedAt)}
          isHighlighted={index === 0}
          onClick={handleCardClick}
        />
      ))}
    </div>
  );
}

/**
 * Mobile Home Page Component
 */
function MobileHomePageContent() {
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
      <StatusBar time="9:41" />

      {/* Nav Bar */}
      <MobileNavBar
        title="Rednote Post"
        rightAction={<NewSessionButton />}
        height="home"
      />

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: '#E8E8E8',
          width: '100%',
        }}
      />

      {/* Session List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingTop: '8px',
        }}
      >
        <SessionList />
      </div>
    </main>
  );
}

export default function MobileHomePage() {
  return (
    <StorageProvider>
      <MobileHomePageContent />
    </StorageProvider>
  );
}

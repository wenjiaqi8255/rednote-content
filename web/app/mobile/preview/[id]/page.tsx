/**
 * Mobile Preview Page
 *
 * Displays XHS card preview with theme selection and save functionality.
 * Pencil design specification:
 * - 390px × 844px frame
 * - Status Bar (62px)
 * - Nav Bar (48px, inner page)
 * - Preview Area (scrollable)
 * - Bottom Action Bar (72px)
 */

'use client';

import React from 'react';
import { StorageProvider, useStorageContext } from '@/contexts/StorageContext';
import { StatusBar } from '@/components/mobile/StatusBar';
import { MobileNavBar } from '@/components/mobile/MobileNavBar';
import { ThemeSelector } from '@/components/mobile/ThemeSelector';
import { SaveButton } from '@/components/mobile/SaveButton';
import { generateXHSCard, type Theme } from '@/lib/xhs-renderer';
import html2canvas from 'html2canvas';
import { useState } from 'react';
import Link from 'next/link';

interface EditLinkProps {
  sessionId: string;
}

function EditLink({ sessionId }: EditLinkProps) {
  return (
    <Link
      href={`/mobile/edit/${sessionId}`}
      style={{
        fontFamily: 'Inter',
        fontSize: '15px',
        fontWeight: '500',
        color: '#E42313',
        textDecoration: 'none',
      }}
    >
      编辑
    </Link>
  );
}

interface MobileCardPreviewProps {
  sessionId: string;
  theme: Theme;
}

function MobileCardPreview({ sessionId, theme }: MobileCardPreviewProps) {
  const { sessions } = useStorageContext();
  const session = sessions.find((s) => s.id === sessionId);

  if (!session) {
    return (
      <div
        style={{
          padding: '32px 28px',
          height: '380px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7A7A7A',
        }}
      >
        未找到会话
      </div>
    );
  }

  const cardHTML = generateXHSCard(session.markdown, theme);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8E8E8',
        borderRadius: '8px',
        padding: '32px 28px',
        height: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
      }}
    >
      {/* Page indicator */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          fontSize: '14px',
          color: '#B0B0B0',
        }}
      >
        ...
      </div>

      {/* Card content */}
      <div
        dangerouslySetInnerHTML={{ __html: cardHTML }}
        style={{
          flex: 1,
          overflow: 'hidden',
        }}
      />
    </div>
  );
}

interface PageIndicatorsProps {
  currentPage: number;
  totalPages: number;
}

function PageIndicators({ currentPage, totalPages }: PageIndicatorsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: totalPages }).map((_, index) => (
        <div
          key={index}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: index === currentPage ? '#E42313' : '#E8E8E8',
          }}
        />
      ))}
    </div>
  );
}

interface PreviewAreaProps {
  sessionId: string;
}

function PreviewArea({ sessionId }: PreviewAreaProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
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

  return (
    <div
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <MobileCardPreview sessionId={sessionId} theme={currentTheme} />
      <PageIndicators currentPage={0} totalPages={3} />
      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        themes={themes}
      />
    </div>
  );
}

function MobilePreviewPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = React.use(params);

  return (
    <main
      style={{
        width: '390px',
        height: '844px',
        backgroundColor: '#FFFFFF',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Status Bar */}
      <StatusBar time="02:37" />

      {/* Nav Bar */}
      <MobileNavBar
        title="预览"
        showBack={true}
        rightAction={<EditLink sessionId={sessionId} />}
        height="inner"
      />

      {/* Preview Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        <PreviewArea sessionId={sessionId} />
      </div>

      {/* Bottom Action Bar */}
      <div
        style={{
          padding: '12px 20px 20px 20px',
        }}
      >
        <SaveButton
          sessionId={sessionId}
          title={sessionId}
          onGenerateImage={async () => {
            // Placeholder implementation
            return 'data:image/png;base64,mock-image';
          }}
        />
      </div>
    </main>
  );
}

export default function MobilePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <StorageProvider>
      <MobilePreviewPageContent params={params} />
    </StorageProvider>
  );
}

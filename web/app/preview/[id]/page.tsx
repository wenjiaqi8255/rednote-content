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

import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStorageContext } from '@/contexts/StorageContext';
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
function CardPreview({ sessionId, theme, cardRef }: { sessionId: string; theme: Theme; cardRef: React.RefObject<HTMLDivElement | null> }) {
  const { sessions, isLoading } = useStorageContext();
  const router = useRouter();
  const hasValidatedRef = useRef(false);
  const [htmlContent, setHtmlContent] = useState('');

  console.log('[CardPreview] Rendering:', {
    sessionId,
    isLoading,
    sessionsCount: sessions.length,
  });

  const session = sessions.find((s) => s.id === sessionId);
  console.log('[CardPreview] Found session:', session?.id || 'NOT FOUND');

  // Validate session exists and redirect if not
  useEffect(() => {
    if (isLoading) return; // Wait for storage to load
    if (hasValidatedRef.current) return; // Only validate once
    hasValidatedRef.current = true;

    const sessionExists = sessions.some(s => s.id === sessionId);
    if (!sessionExists) {
      console.warn('[CardPreview] Session not found, redirecting to home');
      console.log('[CardPreview] Available sessions:', sessions.map(s => s.id));
      router.push('/');
    }
  }, [sessionId, isLoading, sessions, router]);

  // Generate HTML when session or theme changes — MUST be async via useEffect
  useEffect(() => {
    if (!session) return;

    const generateHtml = async () => {
      console.log('[CardPreview] Generating HTML for theme:', theme);
      const html = await generateXHSCard(session.markdown, theme);
      setHtmlContent(html);
    };

    generateHtml();
  }, [session?.markdown, session?.id, theme]);

  // Show loading state while data is being loaded
  if (isLoading) {
    console.log('[CardPreview] Showing loading state');
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!session) {
    // This will be shown briefly before redirect
    console.log('[CardPreview] Session not found! sessions:', sessions.map(s => s.id));
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    );
  }

  // Show loading state while generating HTML
  if (!htmlContent) {
    console.log('[CardPreview] Generating HTML...');
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    );
  }

  console.log('[CardPreview] HTML generated, rendering content');

  // Extract CSS from the HTML and inject into a scoped style tag
  const cssMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
  const cardCss = cssMatch ? cssMatch[1] : '';
  const contentWithoutStyle = htmlContent.replace(/<style>[\s\S]*?<\/style>/, '');

  // Scale factor: card CSS is 1080px wide, container is 375px
  // Using 360px as the target card width for better fit
  const cardWidth = 1080;
  const previewWidth = 360;
  const scale = previewWidth / cardWidth; // ~0.333

  return (
    <div
      ref={cardRef}
      className="mx-auto overflow-hidden rounded-lg border border-gray-200"
      style={{
        width: `${previewWidth}px`,
        height: '600px',
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      {/* Inject CSS into a scoped style tag */}
      {cardCss && (
        <style dangerouslySetInnerHTML={{ __html: cardCss }} />
      )}
      {/* Scale the card to fit the preview container */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${cardWidth}px`,
          // Height auto-scales with width since card is not fixed-height
          height: 'auto',
        }}
      >
        {/* Card content without the duplicate style tag */}
        <div dangerouslySetInnerHTML={{ __html: contentWithoutStyle }} />
      </div>
    </div>
  );
}

/**
 * Save Button Wrapper - extracts session title for SaveButton
 */
function SaveButtonWrapper({ sessionId, cardRef }: { sessionId: string; cardRef: React.RefObject<HTMLDivElement | null> }) {
  const { sessions } = useStorageContext();
  const session = sessions.find((s) => s.id === sessionId);

  const handleGenerateImage = async (): Promise<string> => {
    if (!cardRef.current) {
      throw new Error('Card element not found');
    }

    const canvas = await html2canvas(cardRef.current, {
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scale: 2, // 2x for retina quality
      onclone: (clonedDoc) => {
        // Remove CSS rules with lab() / lch() color functions
        // html2canvas doesn't support these modern CSS color syntaxes
        const styleSheets = Array.from(clonedDoc.styleSheets);
        for (const sheet of styleSheets) {
          try {
            const rules = Array.from(sheet.cssRules);
            for (let i = rules.length - 1; i >= 0; i--) {
              const ruleText = rules[i].cssText;
              if (ruleText && (ruleText.includes('lab(') || ruleText.includes('lch('))) {
                sheet.deleteRule(i);
              }
            }
          } catch {
            // Cross-origin stylesheets may throw — skip
          }
        }
      },
    });

    return canvas.toDataURL('image/png');
  };

  return (
    <SaveButton
      sessionId={sessionId}
      title={session?.title || '卡片'}
      onGenerateImage={handleGenerateImage}
    />
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
  const cardRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <MobileHeader
        sessionId={sessionId}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Desktop Header - now inside flex-col flow */}
      <DesktopHeader sessionId={sessionId} />

      {/* Main layout container - takes remaining height with flex-1 */}
      <div className="flex flex-1 min-h-0">
        {/* Responsive Sidebar */}
        <ResponsiveSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
          <SessionList onCreateNew={handleCreateNew} />
        </ResponsiveSidebar>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex justify-center pt-4 md:pt-0">
          <div className="max-w-[375px] md:max-w-4xl bg-gray-50 min-h-full px-4">
            <div className="flex flex-col gap-4">
              {/* Preview Card */}
              <CardPreview sessionId={sessionId} theme={currentTheme} cardRef={cardRef} />

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
                <SaveButtonWrapper sessionId={sessionId} cardRef={cardRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnifiedPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  return <UnifiedPreviewPageContent params={params} />;
}

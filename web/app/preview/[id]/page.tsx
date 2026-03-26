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
import { generateXHSCard, splitMarkdownBySeparator, splitMarkdownByHeight, type Theme } from '@/lib/xhs-renderer';
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
function CardPreview({ sessionId, theme, cardRef, innerCardRef, currentPageIndex, pages }: {
  sessionId: string;
  theme: Theme;
  cardRef: React.RefObject<HTMLDivElement | null>;
  innerCardRef: React.RefObject<HTMLDivElement | null>;
  currentPageIndex: number;
  pages: string[];
}) {
  const { sessions, isLoading } = useStorageContext();
  const router = useRouter();
  const hasValidatedRef = useRef(false);
  const [htmlContent, setHtmlContent] = useState('');

  // Scale factor: card CSS is 1080px wide, container is 360px
  const cardWidth = 1080;
  const previewWidth = 360;
  const scale = previewWidth / cardWidth;

  // Extract the card's min-height from CSS and calculate visual height
  // Card CSS: .card-container { min-height: 1440px }
  // Scale = 360/1080 = 1/3, so visual height = 1440 * 1/3 = 480
  const cardMinHeight = 1440;
  const visualHeight = Math.ceil(cardMinHeight * scale); // 480

  console.log('[CardPreview] Rendering:', {
    sessionId,
    isLoading,
    sessionsCount: sessions.length,
    currentPageIndex,
    totalPages: pages.length,
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

  // Generate HTML for current page when page index or theme changes
  useEffect(() => {
    if (!session || pages.length === 0) return;

    const currentMarkdown = pages[currentPageIndex] || '';
    if (!currentMarkdown) return;

    const generateHtml = async () => {
      console.log('[CardPreview] Generating HTML for page:', currentPageIndex, 'theme:', theme);
      const html = await generateXHSCard(currentMarkdown, theme);
      setHtmlContent(html);
    };

    generateHtml();
  }, [currentPageIndex, pages, session?.id, theme]);

  // No need for ResizeObserver — we calculate height from card's min-height CSS
  useEffect(() => {
    if (!htmlContent) return;
    // Height is calculated from card's min-height: 1440 * scale = 480px
    // This matches the visual height of the scaled inner div
  }, [htmlContent]);

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

  return (
    <div
      ref={cardRef}
      className="mx-auto overflow-hidden rounded-lg border border-gray-200"
      style={{
        width: `${previewWidth}px`,
        height: `${visualHeight}px`,
        minHeight: '200px',
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
        ref={innerCardRef}
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
 * Supports multi-page saving with ZIP download
 */
function SaveButtonWrapper({ sessionId, innerCardRef, pages, setCurrentPageIndex }: {
  sessionId: string;
  innerCardRef: React.RefObject<HTMLDivElement | null>;
  pages: string[];
  setCurrentPageIndex: (index: number) => void;
}) {
  const { sessions } = useStorageContext();
  const session = sessions.find((s) => s.id === sessionId);

  const generateImageDataUrl = async (): Promise<string> => {
    if (!innerCardRef.current) {
      throw new Error('Card element not found');
    }

    const canvas = await html2canvas(innerCardRef.current, {
      useCORS: true,
      logging: false,
      backgroundColor: null, // Transparent background to show card's own gradient
      scale: 1, // No additional scaling - card is already at full resolution
      width: 1080, // Full width of the card
      onclone: (clonedDoc) => {
        // Find the cloned inner card element
        const clonedCard = clonedDoc.querySelector('[style*="transform: scale"]') as HTMLElement;
        if (clonedCard) {
          // Remove the scale transform to capture at full resolution
          clonedCard.style.transform = 'none';
          clonedCard.style.width = '1080px';
        }

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

  const handleGenerateImage = async (): Promise<string> => {
    return generateImageDataUrl();
  };

  const handleSaveAll = async () => {
    if (!innerCardRef.current || pages.length === 0) return;

    try {
      // Dynamically import JSZip to reduce bundle size
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (let i = 0; i < pages.length; i++) {
        // Switch to page i
        setCurrentPageIndex(i);
        // Wait for re-render
        await new Promise(resolve => setTimeout(resolve, 200));

        const dataUrl = await generateImageDataUrl();
        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        zip.file(`page-${i + 1}.png`, blob);
      }

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${session?.title || '卡片'}-${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Failed to save all pages:', error);
    }
  };

  return (
    <SaveButton
      sessionId={sessionId}
      title={session?.title || '卡片'}
      onGenerateImage={handleGenerateImage}
      onSaveAll={pages.length > 1 ? handleSaveAll : undefined}
      totalPages={pages.length}
    />
  );
}

/**
 * Page Indicators
 */
function PageIndicators({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: totalPages }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-colors ${
            index === currentPage ? 'bg-red-600' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Navigation Arrows for carousel
 */
function NavigationArrows({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4">
      <button
        onClick={onPrev}
        disabled={currentPage === 0}
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        aria-label="上一页"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <span className="text-sm text-gray-500">
        {currentPage + 1} / {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        aria-label="下一页"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Unified Preview Page Content
 */
function UnifiedPreviewPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = React.use(params);
  const { sessions, isLoading } = useStorageContext();
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Hidden by default for focused preview
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const innerCardRef = useRef<HTMLDivElement>(null);

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

  const session = sessions.find((s) => s.id === sessionId);

  // Split markdown into pages when session changes
  useEffect(() => {
    if (!session || isLoading) return;

    const mode = session.mode || 'auto-split';

    const doSplit = async () => {
      let splitPages: string[];

      if (mode === 'auto-split') {
        // Auto-split by height using DOM measurement (async)
        splitPages = await splitMarkdownByHeight(session.markdown);
      } else if (mode === 'separator') {
        // Split by --- separator
        splitPages = splitMarkdownBySeparator(session.markdown);
      } else {
        // Single page mode
        splitPages = [session.markdown];
      }

      setPages(splitPages.length > 0 ? splitPages : ['']);
      setCurrentPageIndex(0);
    };

    doSplit();
  }, [session?.markdown, session?.mode, isLoading, sessionId]);

  // Navigation handlers
  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

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
        {/* Preview page: sidebar is optional — always hidden on desktop, togglable on mobile */}
        <ResponsiveSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} desktopHidden>
          <SessionList onCreateNew={handleCreateNew} />
        </ResponsiveSidebar>

        {/* Main Content Area */}
        <div className="w-full min-w-0 flex justify-center pt-4 md:pt-0">
          <div className="max-w-[375px] md:max-w-5xl bg-gray-50 px-4">
            {/* Desktop: grid with sidebar; Mobile: stacked layout */}
            <div className="flex flex-col gap-4 items-center md:grid md:grid-cols-[1fr_auto] md:gap-6 md:items-start">
              {/* Left side: Navigation + Preview Card + Page Indicators */}
              <div className="flex flex-col gap-4 items-center flex-shrink-0">
                {/* Navigation Arrows */}
                <NavigationArrows
                  currentPage={currentPageIndex}
                  totalPages={pages.length}
                  onPrev={handlePrevPage}
                  onNext={handleNextPage}
                />

                {/* Preview Card */}
                <CardPreview
                  sessionId={sessionId}
                  theme={currentTheme}
                  cardRef={cardRef}
                  innerCardRef={innerCardRef}
                  currentPageIndex={currentPageIndex}
                  pages={pages}
                />

                {/* Page Indicators */}
                <PageIndicators currentPage={currentPageIndex} totalPages={pages.length} />
              </div>

              {/* Right side: Theme Selector */}
              <div className="flex-shrink-0">
                <ThemeSelector
                  currentTheme={currentTheme}
                  onThemeChange={setCurrentTheme}
                  themes={themes}
                />
              </div>

              {/* Save Button - full width on mobile, centered on desktop */}
              <div className="w-full pt-4 pb-8 md:pt-4 md:pb-8 md:col-span-2 md:flex md:justify-center">
                <SaveButtonWrapper
                  sessionId={sessionId}
                  innerCardRef={innerCardRef}
                  pages={pages}
                  setCurrentPageIndex={setCurrentPageIndex}
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
  return <UnifiedPreviewPageContent params={params} />;
}
